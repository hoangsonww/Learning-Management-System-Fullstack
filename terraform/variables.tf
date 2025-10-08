# ============================================================================
# Variables for Learning Management System Terraform Configuration
# ============================================================================

# ----------------------------------------------------------------------------
# General Configuration
# ----------------------------------------------------------------------------

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "lms"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ----------------------------------------------------------------------------
# Network Configuration
# ----------------------------------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
  default     = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use single NAT Gateway for all private subnets"
  type        = bool
  default     = false
}

variable "enable_vpc_flow_logs" {
  description = "Enable VPC Flow Logs"
  type        = bool
  default     = true
}

# ----------------------------------------------------------------------------
# Security Configuration
# ----------------------------------------------------------------------------

variable "alb_ingress_cidrs" {
  description = "CIDR blocks allowed to access ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "enable_waf" {
  description = "Enable AWS WAF for ALB"
  type        = bool
  default     = true
}

# ----------------------------------------------------------------------------
# ECR Configuration
# ----------------------------------------------------------------------------

variable "ecr_image_tag_mutability" {
  description = "Image tag mutability setting for ECR repositories"
  type        = string
  default     = "MUTABLE"
}

variable "ecr_scan_on_push" {
  description = "Enable image scanning on push"
  type        = bool
  default     = true
}

variable "ecr_lifecycle_policy_enabled" {
  description = "Enable lifecycle policy for ECR"
  type        = bool
  default     = true
}

# ----------------------------------------------------------------------------
# RDS Configuration
# ----------------------------------------------------------------------------

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "rds_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 100
}

variable "rds_max_allocated_storage" {
  description = "Maximum allocated storage for RDS auto-scaling"
  type        = number
  default     = 500
}

variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.3"
}

variable "rds_database_name" {
  description = "Name of the default database"
  type        = string
  default     = "lmsdb"
}

variable "rds_master_username" {
  description = "Master username for RDS"
  type        = string
  default     = "lmsadmin"
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = true
}

variable "rds_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = true
}

variable "rds_skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = false
}

variable "rds_backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "rds_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "rds_enabled_cloudwatch_logs_exports" {
  description = "List of log types to export to CloudWatch"
  type        = list(string)
  default     = ["postgresql", "upgrade"]
}

# ----------------------------------------------------------------------------
# ElastiCache Configuration
# ----------------------------------------------------------------------------

variable "redis_node_type" {
  description = "Node type for Redis cluster"
  type        = string
  default     = "cache.t3.medium"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 2
}

variable "redis_parameter_group_family" {
  description = "Redis parameter group family"
  type        = string
  default     = "redis7"
}

variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

variable "redis_port" {
  description = "Redis port"
  type        = number
  default     = 6379
}

variable "redis_automatic_failover" {
  description = "Enable automatic failover"
  type        = bool
  default     = true
}

variable "redis_multi_az" {
  description = "Enable Multi-AZ for Redis"
  type        = bool
  default     = true
}

variable "redis_snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 7
}

variable "redis_snapshot_window" {
  description = "Snapshot window"
  type        = string
  default     = "03:00-05:00"
}

variable "redis_maintenance_window" {
  description = "Maintenance window"
  type        = string
  default     = "sun:05:00-sun:07:00"
}

# ----------------------------------------------------------------------------
# ALB Configuration
# ----------------------------------------------------------------------------

variable "alb_enable_deletion_protection" {
  description = "Enable deletion protection for ALB"
  type        = bool
  default     = true
}

variable "alb_enable_http2" {
  description = "Enable HTTP/2 on ALB"
  type        = bool
  default     = true
}

variable "alb_enable_cross_zone_load_balancing" {
  description = "Enable cross-zone load balancing"
  type        = bool
  default     = true
}

variable "alb_health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "alb_health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 30
}

variable "alb_health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "enable_https" {
  description = "Enable HTTPS listener on ALB"
  type        = bool
  default     = true
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate for ALB"
  type        = string
  default     = ""
}

# ----------------------------------------------------------------------------
# ECS Configuration
# ----------------------------------------------------------------------------

variable "ecs_backend_cpu" {
  description = "CPU units for backend task"
  type        = number
  default     = 512
}

variable "ecs_backend_memory" {
  description = "Memory for backend task in MB"
  type        = number
  default     = 1024
}

variable "ecs_backend_count" {
  description = "Desired count of backend tasks"
  type        = number
  default     = 2
}

variable "ecs_frontend_cpu" {
  description = "CPU units for frontend task"
  type        = number
  default     = 256
}

variable "ecs_frontend_memory" {
  description = "Memory for frontend task in MB"
  type        = number
  default     = 512
}

variable "ecs_frontend_count" {
  description = "Desired count of frontend tasks"
  type        = number
  default     = 2
}

variable "backend_image_tag" {
  description = "Docker image tag for backend"
  type        = string
  default     = "latest"
}

variable "frontend_image_tag" {
  description = "Docker image tag for frontend"
  type        = string
  default     = "latest"
}

variable "enable_ecs_autoscaling" {
  description = "Enable auto-scaling for ECS services"
  type        = bool
  default     = true
}

variable "ecs_autoscaling_min_capacity" {
  description = "Minimum number of tasks for auto-scaling"
  type        = number
  default     = 2
}

variable "ecs_autoscaling_max_capacity" {
  description = "Maximum number of tasks for auto-scaling"
  type        = number
  default     = 10
}

variable "ecs_autoscaling_target_cpu" {
  description = "Target CPU utilization percentage for auto-scaling"
  type        = number
  default     = 70
}

variable "ecs_autoscaling_target_memory" {
  description = "Target memory utilization percentage for auto-scaling"
  type        = number
  default     = 80
}

variable "ecs_log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

# ----------------------------------------------------------------------------
# S3 Configuration
# ----------------------------------------------------------------------------

variable "s3_enable_versioning" {
  description = "Enable versioning for S3 buckets"
  type        = bool
  default     = true
}

variable "s3_enable_lifecycle_rules" {
  description = "Enable lifecycle rules for S3 buckets"
  type        = bool
  default     = true
}

variable "s3_lifecycle_glacier_days" {
  description = "Days before transitioning to Glacier"
  type        = number
  default     = 90
}

variable "s3_lifecycle_expiration_days" {
  description = "Days before object expiration"
  type        = number
  default     = 365
}

variable "s3_enable_replication" {
  description = "Enable cross-region replication"
  type        = bool
  default     = false
}

variable "s3_replication_region" {
  description = "Region for S3 replication"
  type        = string
  default     = "us-west-2"
}

# ----------------------------------------------------------------------------
# CloudFront Configuration
# ----------------------------------------------------------------------------

variable "enable_cloudfront" {
  description = "Enable CloudFront distribution"
  type        = bool
  default     = false
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "cloudfront_enable_ipv6" {
  description = "Enable IPv6 for CloudFront"
  type        = bool
  default     = true
}

variable "cloudfront_minimum_protocol_version" {
  description = "Minimum TLS protocol version"
  type        = string
  default     = "TLSv1.2_2021"
}

variable "cloudfront_certificate_arn" {
  description = "ARN of ACM certificate for CloudFront"
  type        = string
  default     = ""
}

# ----------------------------------------------------------------------------
# Route53 Configuration
# ----------------------------------------------------------------------------

variable "create_route53_zone" {
  description = "Create Route53 hosted zone"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}

# ----------------------------------------------------------------------------
# DocumentDB Configuration
# ----------------------------------------------------------------------------

variable "documentdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "documentdb_instance_count" {
  description = "Number of DocumentDB instances"
  type        = number
  default     = 3
}

variable "documentdb_engine_version" {
  description = "DocumentDB engine version"
  type        = string
  default     = "5.0.0"
}

variable "documentdb_master_username" {
  description = "Master username for DocumentDB"
  type        = string
  default     = "lmsadmin"
}

variable "documentdb_deletion_protection" {
  description = "Enable deletion protection for DocumentDB"
  type        = bool
  default     = true
}

variable "documentdb_skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = false
}

variable "documentdb_backup_window" {
  description = "Preferred backup window for DocumentDB"
  type        = string
  default     = "02:00-03:00"
}

variable "documentdb_maintenance_window" {
  description = "Preferred maintenance window for DocumentDB"
  type        = string
  default     = "sun:03:00-sun:04:00"
}

# ----------------------------------------------------------------------------
# Backup Configuration
# ----------------------------------------------------------------------------

variable "enable_backup" {
  description = "Enable AWS Backup"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

# ----------------------------------------------------------------------------
# Monitoring Configuration
# ----------------------------------------------------------------------------

variable "enable_monitoring" {
  description = "Enable enhanced monitoring"
  type        = bool
  default     = true
}

variable "enable_enhanced_monitoring" {
  description = "Enable RDS enhanced monitoring"
  type        = bool
  default     = true
}
