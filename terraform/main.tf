# ============================================================================
# Main Terraform Configuration for Learning Management System
# ============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "lms-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "lms-terraform-locks"
  }
}

# ============================================================================
# Provider Configuration
# ============================================================================

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.tags,
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      }
    )
  }
}

# ============================================================================
# Data Sources
# ============================================================================

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

# ============================================================================
# Local Variables
# ============================================================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  account_id  = data.aws_caller_identity.current.account_id

  common_tags = merge(
    var.tags,
    {
      Name        = local.name_prefix
      Environment = var.environment
      ManagedBy   = "Terraform"
      Project     = var.project_name
    }
  )
}

# ============================================================================
# VPC Module
# ============================================================================

module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment

  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs

  enable_nat_gateway   = var.enable_nat_gateway
  single_nat_gateway   = var.single_nat_gateway
  enable_dns_hostnames = true
  enable_dns_support   = true
  enable_flow_logs     = var.enable_vpc_flow_logs

  tags = local.common_tags
}

# ============================================================================
# Security Module
# ============================================================================

module "security" {
  source = "./modules/security"

  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id

  alb_ingress_cidrs = var.alb_ingress_cidrs
  enable_waf        = var.enable_waf

  tags = local.common_tags
}

# ============================================================================
# ECR Module
# ============================================================================

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment

  image_tag_mutability     = var.ecr_image_tag_mutability
  scan_on_push            = var.ecr_scan_on_push
  lifecycle_policy_enabled = var.ecr_lifecycle_policy_enabled

  tags = local.common_tags
}

# ============================================================================
# RDS Module (PostgreSQL for Django Auth)
# ============================================================================

module "rds" {
  source = "./modules/rds"

  project_name = var.project_name
  environment  = var.environment

  vpc_id                = module.vpc.vpc_id
  database_subnet_ids   = module.vpc.database_subnet_ids
  security_group_ids    = [module.security.rds_security_group_id]

  instance_class        = var.rds_instance_class
  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage
  engine_version        = var.rds_engine_version
  database_name         = var.rds_database_name
  master_username       = var.rds_master_username

  backup_retention_period      = var.backup_retention_days
  backup_window               = var.rds_backup_window
  maintenance_window          = var.rds_maintenance_window
  enabled_cloudwatch_logs_exports = var.rds_enabled_cloudwatch_logs_exports

  multi_az                    = var.rds_multi_az
  deletion_protection         = var.rds_deletion_protection
  skip_final_snapshot        = var.rds_skip_final_snapshot
  final_snapshot_identifier  = "${local.name_prefix}-rds-final-snapshot"

  tags = local.common_tags
}

# ============================================================================
# ElastiCache Module (Redis)
# ============================================================================

module "elasticache" {
  source = "./modules/elasticache"

  project_name = var.project_name
  environment  = var.environment

  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.database_subnet_ids
  security_group_ids  = [module.security.redis_security_group_id]

  node_type           = var.redis_node_type
  num_cache_nodes     = var.redis_num_cache_nodes
  parameter_group_family = var.redis_parameter_group_family
  engine_version      = var.redis_engine_version
  port                = var.redis_port

  automatic_failover_enabled = var.redis_automatic_failover
  multi_az_enabled          = var.redis_multi_az

  snapshot_retention_limit = var.redis_snapshot_retention_limit
  snapshot_window         = var.redis_snapshot_window
  maintenance_window      = var.redis_maintenance_window

  tags = local.common_tags
}

# ============================================================================
# DocumentDB Module (MongoDB Compatible)
# ============================================================================

module "documentdb" {
  source = "./modules/documentdb"

  project_name = var.project_name
  environment  = var.environment

  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.database_subnet_ids
  security_group_ids  = [module.security.documentdb_security_group_id]

  instance_class           = var.documentdb_instance_class
  instance_count           = var.documentdb_instance_count
  engine_version          = var.documentdb_engine_version
  master_username         = var.documentdb_master_username

  deletion_protection      = var.documentdb_deletion_protection
  skip_final_snapshot     = var.documentdb_skip_final_snapshot
  backup_retention_period = var.backup_retention_days
  backup_window           = var.documentdb_backup_window
  maintenance_window      = var.documentdb_maintenance_window

  tags = local.common_tags
}

# ============================================================================
# Application Load Balancer Module
# ============================================================================

module "alb" {
  source = "./modules/alb"

  project_name = var.project_name
  environment  = var.environment

  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  security_group_ids = [module.security.alb_security_group_id]

  enable_deletion_protection = var.alb_enable_deletion_protection
  enable_http2              = var.alb_enable_http2
  enable_cross_zone_load_balancing = var.alb_enable_cross_zone_load_balancing

  ssl_certificate_arn = var.ssl_certificate_arn
  enable_https        = var.enable_https

  health_check_path     = var.alb_health_check_path
  health_check_interval = var.alb_health_check_interval
  health_check_timeout  = var.alb_health_check_timeout

  tags = local.common_tags
}

# ============================================================================
# ECS Module
# ============================================================================

module "ecs" {
  source = "./modules/ecs"

  project_name = var.project_name
  environment  = var.environment

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_ids = [module.security.ecs_security_group_id]

  # Backend configuration
  backend_image           = "${module.ecr.backend_repository_url}:${var.backend_image_tag}"
  backend_cpu            = var.ecs_backend_cpu
  backend_memory         = var.ecs_backend_memory
  backend_desired_count  = var.ecs_backend_count
  backend_target_group_arn = module.alb.backend_target_group_arn

  # Frontend configuration
  frontend_image          = "${module.ecr.frontend_repository_url}:${var.frontend_image_tag}"
  frontend_cpu           = var.ecs_frontend_cpu
  frontend_memory        = var.ecs_frontend_memory
  frontend_desired_count = var.ecs_frontend_count
  frontend_target_group_arn = module.alb.frontend_target_group_arn

  # Environment variables
  backend_environment_variables = {
    DJANGO_DEBUG         = "False"
    DJANGO_ALLOWED_HOSTS = var.domain_name
    ENVIRONMENT          = var.environment
    AWS_REGION           = var.aws_region
    RDS_ENDPOINT         = module.rds.endpoint
    RDS_DATABASE_NAME    = module.rds.database_name
    REDIS_ENDPOINT       = module.elasticache.endpoint
    REDIS_PORT           = tostring(module.elasticache.port)
    MONGODB_ENDPOINT     = module.documentdb.endpoint
    MONGODB_PORT         = tostring(module.documentdb.port)
  }

  frontend_environment_variables = {
    API_URL     = "https://${var.domain_name}/api"
    ENVIRONMENT = var.environment
  }

  # Auto-scaling
  enable_autoscaling              = var.enable_ecs_autoscaling
  autoscaling_min_capacity        = var.ecs_autoscaling_min_capacity
  autoscaling_max_capacity        = var.ecs_autoscaling_max_capacity
  autoscaling_target_cpu_percent  = var.ecs_autoscaling_target_cpu
  autoscaling_target_memory_percent = var.ecs_autoscaling_target_memory

  # Logging
  log_retention_days = var.ecs_log_retention_days

  tags = local.common_tags

  depends_on = [module.alb]
}

# ============================================================================
# S3 Module (Static Assets and Backups)
# ============================================================================

module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment

  enable_versioning        = var.s3_enable_versioning
  enable_lifecycle_rules   = var.s3_enable_lifecycle_rules
  lifecycle_glacier_days   = var.s3_lifecycle_glacier_days
  lifecycle_expiration_days = var.s3_lifecycle_expiration_days

  enable_replication       = var.s3_enable_replication
  replication_region       = var.s3_replication_region

  tags = local.common_tags
}

# ============================================================================
# CloudFront Module (Optional)
# ============================================================================

module "cloudfront" {
  count  = var.enable_cloudfront ? 1 : 0
  source = "./modules/cloudfront"

  project_name = var.project_name
  environment  = var.environment

  alb_domain_name         = module.alb.dns_name
  s3_bucket_domain_name   = module.s3.bucket_regional_domain_name
  ssl_certificate_arn     = var.cloudfront_certificate_arn

  price_class             = var.cloudfront_price_class
  enable_ipv6            = var.cloudfront_enable_ipv6
  minimum_protocol_version = var.cloudfront_minimum_protocol_version

  tags = local.common_tags
}

# ============================================================================
# Route53 Module (Optional)
# ============================================================================

module "route53" {
  count  = var.create_route53_zone ? 1 : 0
  source = "./modules/route53"

  domain_name = var.domain_name
  alb_dns_name = module.alb.dns_name
  alb_zone_id  = module.alb.zone_id

  cloudfront_domain_name = var.enable_cloudfront ? module.cloudfront[0].domain_name : ""
  cloudfront_zone_id     = var.enable_cloudfront ? module.cloudfront[0].hosted_zone_id : ""

  use_cloudfront = var.enable_cloudfront

  tags = local.common_tags
}

# ============================================================================
# Monitoring Module
# ============================================================================

module "monitoring" {
  source = "./modules/monitoring"

  project_name = var.project_name
  environment  = var.environment

  tags = local.common_tags
}
