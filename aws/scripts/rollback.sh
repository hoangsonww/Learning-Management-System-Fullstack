#!/bin/bash
###############################################################################
# Rollback Script for LMS
# Rolls back ECS services to previous task definition
###############################################################################

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"

AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

rollback_service() {
    local cluster=$1
    local service=$2
    local service_type=$3

    log_step "Rolling back $service_type service: $service"

    # Get current task definition
    local current_task=$(aws ecs describe-services \
        --cluster "$cluster" \
        --services "$service" \
        --region "$AWS_REGION" \
        --query 'services[0].taskDefinition' \
        --output text)

    log_info "Current task definition: $current_task"

    # List previous task definitions
    local family=$(echo "$current_task" | cut -d':' -f6 | cut -d'/' -f2)
    log_info "Task definition family: $family"

    echo ""
    echo "Available versions:"
    aws ecs list-task-definitions \
        --family-prefix "$family" \
        --region "$AWS_REGION" \
        --sort DESC \
        --max-items 10 \
        --query 'taskDefinitionArns[]' \
        --output table

    echo ""
    read -p "Enter task definition ARN to rollback to (or 'cancel'): " target_task

    if [[ "$target_task" == "cancel" ]]; then
        log_warn "Rollback cancelled for $service"
        return
    fi

    # Validate task definition exists
    if ! aws ecs describe-task-definition \
        --task-definition "$target_task" \
        --region "$AWS_REGION" &>/dev/null; then
        log_error "Invalid task definition: $target_task"
        return 1
    fi

    log_info "Rolling back to: $target_task"

    # Update service
    aws ecs update-service \
        --cluster "$cluster" \
        --service "$service" \
        --task-definition "$target_task" \
        --region "$AWS_REGION" \
        --query 'service.[serviceName,taskDefinition,desiredCount,runningCount]' \
        --output table

    log_info "Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --cluster "$cluster" \
        --services "$service" \
        --region "$AWS_REGION"

    log_info "✓ Rollback completed for $service"
}

main() {
    log_info "Starting rollback for $ENVIRONMENT environment"

    cd "$TERRAFORM_DIR"

    # Get cluster and service names from Terraform
    if ! terraform output &>/dev/null; then
        log_error "Terraform state not found. Run 'terraform init' first."
        exit 1
    fi

    local cluster=$(terraform output -raw ecs_cluster_name 2>/dev/null)
    local backend_service=$(terraform output -raw ecs_backend_service_name 2>/dev/null)
    local frontend_service=$(terraform output -raw ecs_frontend_service_name 2>/dev/null)

    if [[ -z "$cluster" ]]; then
        log_error "Could not determine ECS cluster name"
        exit 1
    fi

    log_info "Cluster: $cluster"
    log_info "Backend Service: $backend_service"
    log_info "Frontend Service: $frontend_service"

    echo ""
    echo "Which service do you want to rollback?"
    echo "1) Backend only"
    echo "2) Frontend only"
    echo "3) Both services"
    echo "4) Cancel"
    read -p "Selection: " choice

    case $choice in
        1)
            rollback_service "$cluster" "$backend_service" "Backend"
            ;;
        2)
            rollback_service "$cluster" "$frontend_service" "Frontend"
            ;;
        3)
            rollback_service "$cluster" "$backend_service" "Backend"
            rollback_service "$cluster" "$frontend_service" "Frontend"
            ;;
        4)
            log_warn "Rollback cancelled"
            exit 0
            ;;
        *)
            log_error "Invalid selection"
            exit 1
            ;;
    esac

    echo ""
    log_info "Rollback completed successfully!"
    log_info "Monitor services at: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$cluster/services"
}

main "$@"
