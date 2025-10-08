#!/bin/bash
###############################################################################
# Production-Grade AWS Deployment Script for LMS
###############################################################################

set -euo pipefail
IFS=$'\n\t'

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"

AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"
PROJECT_NAME="${PROJECT_NAME:-lms}"

# Functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

check_prerequisites() {
    log_step "Checking prerequisites..."

    local missing=()

    command -v aws >/dev/null 2>&1 || missing+=("aws-cli")
    command -v terraform >/dev/null 2>&1 || missing+=("terraform")
    command -v docker >/dev/null 2>&1 || missing+=("docker")
    command -v jq >/dev/null 2>&1 || missing+=("jq")

    if [ ${#missing[@]} -gt 0 ]; then
        log_error "Missing required tools: ${missing[*]}"
        exit 1
    fi

    if ! aws sts get-caller-identity &>/dev/null; then
        log_error "AWS credentials not configured"
        exit 1
    fi

    log_info "Prerequisites check passed"
}

setup_terraform_backend() {
    log_step "Setting up Terraform backend..."

    local bucket_name="${PROJECT_NAME}-terraform-state-$(aws sts get-caller-identity --query Account --output text)"
    local table_name="${PROJECT_NAME}-terraform-locks"

    # Create S3 bucket for state
    if ! aws s3 ls "s3://$bucket_name" 2>/dev/null; then
        log_info "Creating S3 bucket: $bucket_name"
        aws s3 mb "s3://$bucket_name" --region "$AWS_REGION"
        aws s3api put-bucket-versioning \
            --bucket "$bucket_name" \
            --versioning-configuration Status=Enabled
        aws s3api put-bucket-encryption \
            --bucket "$bucket_name" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'
        aws s3api put-public-access-block \
            --bucket "$bucket_name" \
            --public-access-block-configuration \
            "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    else
        log_info "S3 bucket already exists: $bucket_name"
    fi

    # Create DynamoDB table for locking
    if ! aws dynamodb describe-table --table-name "$table_name" &>/dev/null; then
        log_info "Creating DynamoDB table: $table_name"
        aws dynamodb create-table \
            --table-name "$table_name" \
            --attribute-definitions AttributeName=LockID,AttributeType=S \
            --key-schema AttributeName=LockID,KeyType=HASH \
            --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
            --region "$AWS_REGION" \
            --tags "Key=Project,Value=$PROJECT_NAME" "Key=Environment,Value=$ENVIRONMENT"

        log_info "Waiting for DynamoDB table to be active..."
        aws dynamodb wait table-exists --table-name "$table_name"
    else
        log_info "DynamoDB table already exists: $table_name"
    fi

    # Update backend config
    cat > "$TERRAFORM_DIR/backend.tf" <<EOF
terraform {
  backend "s3" {
    bucket         = "$bucket_name"
    key            = "$ENVIRONMENT/terraform.tfstate"
    region         = "$AWS_REGION"
    encrypt        = true
    dynamodb_table = "$table_name"
  }
}
EOF

    log_info "Terraform backend configured"
}

init_terraform() {
    log_step "Initializing Terraform..."

    cd "$TERRAFORM_DIR"
    terraform init -upgrade

    log_info "Terraform initialized"
}

plan_terraform() {
    log_step "Planning Terraform deployment..."

    cd "$TERRAFORM_DIR"
    terraform plan \
        -var="environment=$ENVIRONMENT" \
        -var="project_name=$PROJECT_NAME" \
        -var="aws_region=$AWS_REGION" \
        -out=tfplan

    log_info "Terraform plan created"
}

apply_terraform() {
    log_step "Applying Terraform configuration..."

    cd "$TERRAFORM_DIR"
    terraform apply tfplan

    log_info "Terraform applied successfully"
}

build_and_push_images() {
    log_step "Building and pushing Docker images..."

    local account_id=$(aws sts get-caller-identity --query Account --output text)
    local ecr_uri="$account_id.dkr.ecr.$AWS_REGION.amazonaws.com"

    # Get ECR repository URLs
    local backend_repo=$(terraform output -raw ecr_backend_repository_url)
    local frontend_repo=$(terraform output -raw ecr_frontend_repository_url)

    # Login to ECR
    log_info "Logging into ECR..."
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "$ecr_uri"

    # Build and push backend
    log_info "Building backend image..."
    cd "$PROJECT_ROOT/LMS-Backend"
    docker build -t "$backend_repo:latest" -t "$backend_repo:$(git rev-parse --short HEAD)" .

    log_info "Pushing backend image..."
    docker push "$backend_repo:latest"
    docker push "$backend_repo:$(git rev-parse --short HEAD)"

    # Build and push frontend
    log_info "Building frontend image..."
    cd "$PROJECT_ROOT/LMS-Frontend"
    docker build -t "$frontend_repo:latest" -t "$frontend_repo:$(git rev-parse --short HEAD)" .

    log_info "Pushing frontend image..."
    docker push "$frontend_repo:latest"
    docker push "$frontend_repo:$(git rev-parse --short HEAD)"

    cd "$PROJECT_ROOT"
    log_info "Docker images built and pushed"
}

deploy_ecs_services() {
    log_step "Deploying ECS services..."

    cd "$TERRAFORM_DIR"
    local cluster_name=$(terraform output -raw ecs_cluster_name)
    local backend_service=$(terraform output -raw ecs_backend_service_name)
    local frontend_service=$(terraform output -raw ecs_frontend_service_name)

    log_info "Updating backend service..."
    aws ecs update-service \
        --cluster "$cluster_name" \
        --service "$backend_service" \
        --force-new-deployment \
        --region "$AWS_REGION" >/dev/null

    log_info "Updating frontend service..."
    aws ecs update-service \
        --cluster "$cluster_name" \
        --service "$frontend_service" \
        --force-new-deployment \
        --region "$AWS_REGION" >/dev/null

    log_info "Waiting for services to stabilize..."
    aws ecs wait services-stable \
        --cluster "$cluster_name" \
        --services "$backend_service" "$frontend_service" \
        --region "$AWS_REGION"

    log_info "ECS services deployed"
}

show_outputs() {
    log_step "Deployment Summary"

    cd "$TERRAFORM_DIR"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  DEPLOYMENT COMPLETE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Application URL: $(terraform output -raw application_url)"
    echo "API URL:         $(terraform output -raw api_url)"
    echo ""
    echo "Backend Repository:  $(terraform output -raw ecr_backend_repository_url)"
    echo "Frontend Repository: $(terraform output -raw ecr_frontend_repository_url)"
    echo ""
    echo "RDS Endpoint:        $(terraform output -raw rds_endpoint)"
    echo "Redis Endpoint:      $(terraform output -raw redis_endpoint)"
    echo "DocumentDB Endpoint: $(terraform output documentdb_endpoint)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

main() {
    log_info "Starting deployment for $PROJECT_NAME ($ENVIRONMENT) in $AWS_REGION"
    echo ""

    check_prerequisites
    setup_terraform_backend
    init_terraform
    plan_terraform

    read -p "Apply Terraform changes? (yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        log_warn "Deployment cancelled"
        exit 0
    fi

    apply_terraform
    build_and_push_images
    deploy_ecs_services
    show_outputs

    log_info "Deployment completed successfully!"
}

main "$@"
