# LMS Terraform Infrastructure

Production-grade AWS infrastructure for the Learning Management System using Terraform.

## Architecture

This Terraform configuration deploys a complete, production-ready infrastructure on AWS:

- **VPC** with public, private, and database subnets across 3 AZs
- **Security Groups** and **WAF** for application security
- **ECR** repositories for Docker images
- **RDS PostgreSQL** for Django authentication
- **ElastiCache Redis** for caching
- **DocumentDB** for MongoDB-compatible application data
- **ALB** for load balancing with SSL/TLS
- **ECS Fargate** for containerized applications
- **S3** for static assets and backups
- **CloudFront** CDN (optional)
- **Route53** DNS management (optional)
- **CloudWatch** monitoring and logging

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.5.0
- Docker
- jq (for deployment scripts)

## Quick Start

### 1. Clone and Configure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your configuration
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan Deployment

```bash
terraform plan -var-file="terraform.tfvars"
```

### 4. Deploy Infrastructure

```bash
terraform apply -var-file="terraform.tfvars"
```

## Using Deployment Scripts

The `aws/scripts/` directory contains production-ready deployment automation:

```bash
# Deploy everything (infrastructure + applications)
cd ../aws/scripts
./deploy.sh

# Destroy infrastructure
./destroy.sh
```

The `deploy.sh` script will:
1. Check prerequisites
2. Set up Terraform backend (S3 + DynamoDB)
3. Initialize and plan Terraform
4. Deploy infrastructure (with your confirmation)
5. Build and push Docker images to ECR
6. Deploy ECS services
7. Display deployment information

## Environment-Specific Configurations

Use environment-specific variable files:

### Development
```bash
terraform apply -var-file="environments/dev.tfvars"
```

### Production
```bash
terraform apply -var-file="environments/production.tfvars"
```

## Cost Estimates

### Development Environment (~$150-200/month)
- Single NAT Gateway: $32/month
- t3.small RDS: $25/month
- t3.small Redis: $15/month
- DocumentDB t3.medium: $50/month
- ECS Fargate: $30-50/month
- ALB: $16/month
- Data transfer: $10-15/month

### Production Environment (~$1200-1500/month)
- 3x NAT Gateways: $96/month
- r5.xlarge RDS Multi-AZ: $450/month
- r5.large Redis cluster: $200/month
- 3x r5.xlarge DocumentDB: $650/month
- ECS Fargate: $200-300/month
- ALB + WAF: $30/month
- CloudFront: $50-100/month
- Data transfer: $100-150/month

## Module Structure

```
terraform/
├── main.tf                 # Main infrastructure configuration
├── variables.tf            # Input variables
├── outputs.tf             # Output values
├── terraform.tfvars.example
├── environments/
│   ├── dev.tfvars         # Development configuration
│   └── production.tfvars  # Production configuration
└── modules/
    ├── vpc/               # VPC and networking
    ├── security/          # Security groups and WAF
    ├── ecr/               # Container registries
    ├── rds/               # PostgreSQL database
    ├── elasticache/       # Redis cluster
    ├── documentdb/        # MongoDB-compatible database
    ├── alb/               # Load balancer
    ├── ecs/               # Container orchestration
    ├── s3/                # Object storage
    ├── cloudfront/        # CDN
    ├── route53/           # DNS
    └── monitoring/        # CloudWatch dashboards
```

## Important Outputs

After deployment, Terraform provides:

```bash
terraform output application_url  # Main application URL
terraform output api_url          # API endpoint
terraform output rds_endpoint     # PostgreSQL endpoint
terraform output redis_endpoint   # Redis endpoint
terraform output documentdb_endpoint  # MongoDB endpoint
```

View all outputs:
```bash
terraform output
```

## Secrets Management

Database passwords are automatically generated and stored in AWS Secrets Manager:
- RDS password: `lms-{environment}-rds-password`
- DocumentDB password: `lms-{environment}-documentdb-password`

Retrieve secrets:
```bash
aws secretsmanager get-secret-value \
    --secret-id lms-production-rds-password \
    --query SecretString --output text | jq .
```

## Updating Services

### Update Docker Images
```bash
# Build and push new images
./aws/scripts/deploy.sh

# Or manually:
aws ecr get-login-password --region us-east-1 | docker login ...
docker build -t REPO_URL:latest ./LMS-Backend
docker push REPO_URL:latest

# Force ECS service update
aws ecs update-service \
    --cluster lms-production-cluster \
    --service lms-production-backend \
    --force-new-deployment
```

### Update Infrastructure
```bash
# Modify terraform.tfvars or module files
terraform plan
terraform apply
```

## Troubleshooting

### Access ECS Container
```bash
aws ecs execute-command \
    --cluster lms-production-cluster \
    --task TASK_ID \
    --container backend \
    --interactive \
    --command "/bin/bash"
```

### View Logs
```bash
aws logs tail /ecs/lms-production/backend --follow
```

### RDS Connection Test
```bash
psql -h $(terraform output -raw rds_endpoint) \
     -U lmsadmin \
     -d lmsdb
```

## Security Best Practices

1. **Never commit `terraform.tfvars` to version control**
2. Use AWS Secrets Manager for sensitive data
3. Enable deletion protection for production databases
4. Restrict `alb_ingress_cidrs` to known IPs in production
5. Use SSL/TLS certificates for all public endpoints
6. Enable WAF in production
7. Regular backup testing
8. Multi-AZ deployments for production
9. Enable enhanced monitoring
10. Review CloudWatch alarms regularly

## Backup and Disaster Recovery

### Automated Backups
- RDS: 7-day retention (configurable)
- DocumentDB: 7-day retention (configurable)
- Redis: Daily snapshots
- S3: Versioning enabled

### Manual Backup
```bash
# RDS Snapshot
aws rds create-db-snapshot \
    --db-instance-identifier lms-production-postgres \
    --db-snapshot-identifier manual-backup-$(date +%Y%m%d)

# DocumentDB Snapshot
aws docdb create-db-cluster-snapshot \
    --db-cluster-identifier lms-production-docdb \
    --db-cluster-snapshot-identifier manual-backup-$(date +%Y%m%d)
```

## Monitoring

Access CloudWatch Dashboard:
```bash
open "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=lms-production"
```

Key metrics to monitor:
- ECS CPU/Memory utilization
- ALB response time and error rate
- RDS connections and CPU
- Redis cache hit ratio
- DocumentDB CPU and connections

## Support

For issues or questions:
- Review Terraform documentation: https://terraform.io/docs
- Check AWS documentation: https://docs.aws.amazon.com
- Open an issue in the project repository

## License

MIT License - see [LICENSE](../LICENSE) file for details
