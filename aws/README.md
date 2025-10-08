# AWS Deployment Scripts

Production-ready deployment automation for the Learning Management System.

## Overview

This directory contains scripts and tools for deploying the LMS to AWS infrastructure.

## Directory Structure

```
aws/
├── scripts/
│   ├── deploy.sh          # Complete deployment automation
│   ├── destroy.sh         # Infrastructure teardown
│   └── rollback.sh        # Rollback script (to be created)
└── README.md
```

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.5.0
3. **Docker** installed and running
4. **jq** for JSON processing
5. **Git** for version tracking

## Quick Start

### Deploy Everything

```bash
cd aws/scripts
./deploy.sh
```

This will:
1. Validate prerequisites
2. Set up Terraform backend (S3 + DynamoDB)
3. Initialize Terraform
4. Plan infrastructure changes
5. Ask for confirmation
6. Deploy infrastructure
7. Build Docker images
8. Push images to ECR
9. Deploy ECS services
10. Display deployment summary

### Environment Variables

Configure deployment using environment variables:

```bash
export AWS_REGION=us-east-1
export ENVIRONMENT=production
export PROJECT_NAME=lms
./deploy.sh
```

### Destroy Infrastructure

```bash
./destroy.sh
```

**WARNING**: This will destroy ALL infrastructure. Type 'destroy' to confirm.

## Deployment Scripts

### deploy.sh

Full deployment automation script.

**Features**:
- Prerequisite checking
- Terraform backend setup
- Infrastructure deployment
- Docker image management
- ECS service deployment
- Comprehensive error handling
- Deployment summary

**Usage**:
```bash
# Deploy to production
ENVIRONMENT=production ./deploy.sh

# Deploy to dev
ENVIRONMENT=dev AWS_REGION=us-east-1 ./deploy.sh
```

### destroy.sh

Safe infrastructure destruction.

**Features**:
- Confirmation prompt
- Deletion protection handling
- Skip final snapshots for faster teardown

**Usage**:
```bash
./destroy.sh
```

### rollback.sh

Rollback to previous deployment (create this if needed).

## Manual Deployment Steps

### 1. Setup Terraform Backend

```bash
# Create S3 bucket for state
aws s3 mb s3://lms-terraform-state-$(aws sts get-caller-identity --query Account --output text)

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket lms-terraform-state-ACCOUNT_ID \
    --versioning-configuration Status=Enabled

# Create DynamoDB table for locking
aws dynamodb create-table \
    --table-name lms-terraform-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 2. Deploy Infrastructure

```bash
cd ../../terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

### 3. Build and Push Images

```bash
# Get ECR URLs
BACKEND_REPO=$(terraform output -raw ecr_backend_repository_url)
FRONTEND_REPO=$(terraform output -raw ecr_frontend_repository_url)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=us-east-1

# Login to ECR
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push backend
cd ../LMS-Backend
docker build -t $BACKEND_REPO:latest .
docker push $BACKEND_REPO:latest

# Build and push frontend
cd ../LMS-Frontend
docker build -t $FRONTEND_REPO:latest .
docker push $FRONTEND_REPO:latest
```

### 4. Deploy ECS Services

```bash
cd ../terraform
CLUSTER=$(terraform output -raw ecs_cluster_name)
BACKEND_SERVICE=$(terraform output -raw ecs_backend_service_name)
FRONTEND_SERVICE=$(terraform output -raw ecs_frontend_service_name)

# Force new deployment
aws ecs update-service \
    --cluster $CLUSTER \
    --service $BACKEND_SERVICE \
    --force-new-deployment

aws ecs update-service \
    --cluster $CLUSTER \
    --service $FRONTEND_SERVICE \
    --force-new-deployment

# Wait for services to stabilize
aws ecs wait services-stable \
    --cluster $CLUSTER \
    --services $BACKEND_SERVICE $FRONTEND_SERVICE
```

## Deployment Strategies

### Blue-Green Deployment

1. Deploy new version alongside old version
2. Test new version
3. Switch traffic
4. Monitor
5. Rollback if needed

```bash
# Deploy new task definition
aws ecs register-task-definition --cli-input-json file://task-def.json

# Update service with new task definition
aws ecs update-service \
    --cluster lms-production \
    --service backend \
    --task-definition backend:NEW_VERSION \
    --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"
```

### Rolling Deployment

ECS automatically performs rolling deployments:
- Default: 200% maximum, 100% minimum
- No downtime
- Gradual traffic shift

### Canary Deployment

Use ALB target group weighting:

```bash
# Create new target group
# Deploy to new target group
# Gradually shift traffic
aws elbv2 modify-listener \
    --listener-arn LISTENER_ARN \
    --default-actions file://weighted-targets.json
```

## Monitoring Deployment

### View Deployment Status

```bash
aws ecs describe-services \
    --cluster lms-production \
    --services backend frontend \
    --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
    --output table
```

### View Deployment Events

```bash
aws ecs describe-services \
    --cluster lms-production \
    --services backend \
    --query 'services[0].events[:10]' \
    --output table
```

### View Logs

```bash
aws logs tail /ecs/lms-production/backend --follow
```

## Troubleshooting

### Deployment Stuck

```bash
# Check service events
aws ecs describe-services \
    --cluster lms-production \
    --services backend \
    --query 'services[0].events[:5]'

# Check task status
aws ecs list-tasks \
    --cluster lms-production \
    --service-name backend

# Describe specific task
aws ecs describe-tasks \
    --cluster lms-production \
    --tasks TASK_ARN
```

### Container Fails to Start

```bash
# Check CloudWatch logs
aws logs tail /ecs/lms-production/backend --since 10m

# Access container
aws ecs execute-command \
    --cluster lms-production \
    --task TASK_ARN \
    --container backend \
    --interactive \
    --command "/bin/bash"
```

### Database Connection Issues

```bash
# Test RDS connectivity from ECS
aws ecs execute-command \
    --cluster lms-production \
    --task TASK_ARN \
    --container backend \
    --interactive \
    --command "nc -zv RDS_ENDPOINT 5432"

# Check security groups
aws ec2 describe-security-groups \
    --filters "Name=tag:Name,Values=lms-production-*"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy
        run: ./aws/scripts/deploy.sh
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    environment {
        AWS_REGION = 'us-east-1'
        ENVIRONMENT = 'production'
    }
    stages {
        stage('Deploy') {
            steps {
                sh './aws/scripts/deploy.sh'
            }
        }
    }
}
```

## Security

### IAM Permissions Required

Minimum IAM permissions needed:
- EC2 (VPC, Security Groups, Subnets)
- ECS (Clusters, Services, Tasks)
- ECR (Repositories, Images)
- RDS (DB Instances)
- DocumentDB (Clusters)
- ElastiCache (Replication Groups)
- S3 (Buckets, Objects)
- CloudWatch (Logs, Alarms, Dashboards)
- IAM (Roles, Policies)
- Secrets Manager (Secrets)
- ALB (Load Balancers, Target Groups, Listeners)

### Secrets Management

All sensitive data is stored in AWS Secrets Manager:
- Database passwords
- API keys
- Environment-specific secrets

Access secrets:
```bash
aws secretsmanager get-secret-value \
    --secret-id lms-production-rds-password
```

## Cost Optimization

### Monitor Costs

```bash
# Daily costs
aws ce get-cost-and-usage \
    --time-period Start=2025-01-01,End=2025-01-31 \
    --granularity DAILY \
    --metrics BlendedCost \
    --group-by Type=SERVICE

# By tag
aws ce get-cost-and-usage \
    --time-period Start=2025-01-01,End=2025-01-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=TAG,Key=Environment
```

### Optimization Tips

1. Use Spot Instances for dev/staging
2. Enable S3 Intelligent-Tiering
3. Use Reserved Instances for production
4. Delete old snapshots
5. Enable ECS container insights selectively
6. Use CloudFront for static content
7. Enable RDS Performance Insights only when needed
8. Review and delete old CloudWatch logs

## Support

For deployment issues:
1. Check CloudWatch logs
2. Review ECS service events
3. Verify security group rules
4. Test database connectivity
5. Check IAM permissions

## License

MIT License - see [LICENSE](../LICENSE) file for details
