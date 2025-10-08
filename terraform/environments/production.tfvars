# Production Environment Configuration
environment = "production"
project_name = "lms"
aws_region = "us-east-1"

# Production-grade settings
single_nat_gateway = false
enable_waf = true
enable_monitoring = true
enable_vpc_flow_logs = true

# Production instances
rds_instance_class = "db.r5.xlarge"
rds_multi_az = true
rds_deletion_protection = true
rds_skip_final_snapshot = false
rds_allocated_storage = 200
rds_max_allocated_storage = 1000

redis_node_type = "cache.r5.large"
redis_num_cache_nodes = 3
redis_automatic_failover = true
redis_multi_az = true

documentdb_instance_class = "db.r5.xlarge"
documentdb_instance_count = 3
documentdb_deletion_protection = true
documentdb_skip_final_snapshot = false

ecs_backend_cpu = 2048
ecs_backend_memory = 4096
ecs_backend_count = 3

ecs_frontend_cpu = 1024
ecs_frontend_memory = 2048
ecs_frontend_count = 3

enable_ecs_autoscaling = true
ecs_autoscaling_min_capacity = 3
ecs_autoscaling_max_capacity = 20

enable_https = true
alb_enable_deletion_protection = true

enable_cloudfront = true
cloudfront_price_class = "PriceClass_All"

create_route53_zone = true

backup_retention_days = 30
ecs_log_retention_days = 90
