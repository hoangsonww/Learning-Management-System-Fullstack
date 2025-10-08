# ============================================================================
# Outputs for Learning Management System Terraform Configuration
# ============================================================================

# ----------------------------------------------------------------------------
# VPC Outputs
# ----------------------------------------------------------------------------

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

output "database_subnet_ids" {
  description = "IDs of database subnets"
  value       = module.vpc.database_subnet_ids
}

# ----------------------------------------------------------------------------
# ECR Outputs
# ----------------------------------------------------------------------------

output "ecr_backend_repository_url" {
  description = "URL of the backend ECR repository"
  value       = module.ecr.backend_repository_url
}

output "ecr_frontend_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = module.ecr.frontend_repository_url
}

output "ecr_backend_repository_arn" {
  description = "ARN of the backend ECR repository"
  value       = module.ecr.backend_repository_arn
}

output "ecr_frontend_repository_arn" {
  description = "ARN of the frontend ECR repository"
  value       = module.ecr.frontend_repository_arn
}

# ----------------------------------------------------------------------------
# RDS Outputs
# ----------------------------------------------------------------------------

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "rds_database_name" {
  description = "Name of the RDS database"
  value       = module.rds.database_name
}

output "rds_arn" {
  description = "ARN of the RDS instance"
  value       = module.rds.arn
}

output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = module.security.rds_security_group_id
}

# ----------------------------------------------------------------------------
# ElastiCache Outputs
# ----------------------------------------------------------------------------

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = module.elasticache.endpoint
  sensitive   = true
}

output "redis_port" {
  description = "Redis port"
  value       = module.elasticache.port
}

output "redis_security_group_id" {
  description = "Security group ID for Redis"
  value       = module.security.redis_security_group_id
}

# ----------------------------------------------------------------------------
# DocumentDB Outputs
# ----------------------------------------------------------------------------

output "documentdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = module.documentdb.endpoint
  sensitive   = true
}

output "documentdb_port" {
  description = "DocumentDB port"
  value       = module.documentdb.port
}

output "documentdb_cluster_id" {
  description = "DocumentDB cluster ID"
  value       = module.documentdb.cluster_id
}

# ----------------------------------------------------------------------------
# ALB Outputs
# ----------------------------------------------------------------------------

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.alb.arn
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = module.alb.zone_id
}

output "backend_target_group_arn" {
  description = "ARN of the backend target group"
  value       = module.alb.backend_target_group_arn
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = module.alb.frontend_target_group_arn
}

# ----------------------------------------------------------------------------
# ECS Outputs
# ----------------------------------------------------------------------------

output "ecs_cluster_id" {
  description = "ID of the ECS cluster"
  value       = module.ecs.cluster_id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_backend_service_name" {
  description = "Name of the backend ECS service"
  value       = module.ecs.backend_service_name
}

output "ecs_frontend_service_name" {
  description = "Name of the frontend ECS service"
  value       = module.ecs.frontend_service_name
}

output "ecs_backend_task_definition_arn" {
  description = "ARN of the backend task definition"
  value       = module.ecs.backend_task_definition_arn
}

output "ecs_frontend_task_definition_arn" {
  description = "ARN of the frontend task definition"
  value       = module.ecs.frontend_task_definition_arn
}

# ----------------------------------------------------------------------------
# S3 Outputs
# ----------------------------------------------------------------------------

output "s3_static_assets_bucket" {
  description = "Name of the S3 bucket for static assets"
  value       = module.s3.static_assets_bucket
}

output "s3_backups_bucket" {
  description = "Name of the S3 bucket for backups"
  value       = module.s3.backups_bucket
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = module.s3.bucket_regional_domain_name
}

# ----------------------------------------------------------------------------
# CloudFront Outputs (if enabled)
# ----------------------------------------------------------------------------

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = var.enable_cloudfront ? module.cloudfront[0].distribution_id : null
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = var.enable_cloudfront ? module.cloudfront[0].domain_name : null
}

# ----------------------------------------------------------------------------
# Route53 Outputs (if enabled)
# ----------------------------------------------------------------------------

output "route53_zone_id" {
  description = "ID of the Route53 hosted zone"
  value       = var.create_route53_zone ? module.route53[0].zone_id : null
}

output "route53_name_servers" {
  description = "Name servers for the Route53 hosted zone"
  value       = var.create_route53_zone ? module.route53[0].name_servers : null
}

# ----------------------------------------------------------------------------
# Application URLs
# ----------------------------------------------------------------------------

output "application_url" {
  description = "URL to access the application"
  value = var.enable_cloudfront && var.create_route53_zone ? "https://${var.domain_name}" : var.create_route53_zone ? "https://${var.domain_name}" : "http://${module.alb.dns_name}"
}

output "api_url" {
  description = "URL to access the API"
  value = var.enable_cloudfront && var.create_route53_zone ? "https://${var.domain_name}/api" : var.create_route53_zone ? "https://${var.domain_name}/api" : "http://${module.alb.dns_name}/api"
}

# ----------------------------------------------------------------------------
# Connection Information
# ----------------------------------------------------------------------------

output "connection_info" {
  description = "Connection information for services"
  value = {
    rds_endpoint      = module.rds.endpoint
    redis_endpoint    = "${module.elasticache.endpoint}:${module.elasticache.port}"
    documentdb_endpoint = module.documentdb.endpoint
    alb_dns           = module.alb.dns_name
    ecr_backend_repo  = module.ecr.backend_repository_url
    ecr_frontend_repo = module.ecr.frontend_repository_url
  }
  sensitive = true
}

# ----------------------------------------------------------------------------
# Security Group IDs
# ----------------------------------------------------------------------------

output "security_group_ids" {
  description = "IDs of all security groups"
  value = {
    alb_sg   = module.security.alb_security_group_id
    ecs_sg   = module.security.ecs_security_group_id
    rds_sg   = module.security.rds_security_group_id
    redis_sg = module.security.redis_security_group_id
  }
}

# ----------------------------------------------------------------------------
# Deployment Commands
# ----------------------------------------------------------------------------

output "deployment_commands" {
  description = "Useful commands for deployment"
  value = <<-EOT
    # Login to ECR
    aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${local.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com

    # Build and push backend
    docker build -t ${module.ecr.backend_repository_url}:latest ./LMS-Backend
    docker push ${module.ecr.backend_repository_url}:latest

    # Build and push frontend
    docker build -t ${module.ecr.frontend_repository_url}:latest ./LMS-Frontend
    docker push ${module.ecr.frontend_repository_url}:latest

    # Update ECS services
    aws ecs update-service --cluster ${module.ecs.cluster_name} --service ${module.ecs.backend_service_name} --force-new-deployment
    aws ecs update-service --cluster ${module.ecs.cluster_name} --service ${module.ecs.frontend_service_name} --force-new-deployment

    # View logs
    aws logs tail /ecs/${local.name_prefix}/backend --follow
    aws logs tail /ecs/${local.name_prefix}/frontend --follow
  EOT
}
