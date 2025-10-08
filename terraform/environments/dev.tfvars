# Development Environment Configuration
environment = "dev"
project_name = "lms"
aws_region = "us-east-1"

# Cost-optimized settings for dev
single_nat_gateway = true
enable_waf = false
enable_monitoring = true
enable_vpc_flow_logs = false

# Smaller instances for dev
rds_instance_class = "db.t3.small"
rds_multi_az = false
rds_deletion_protection = false
rds_skip_final_snapshot = true

redis_node_type = "cache.t3.small"
redis_num_cache_nodes = 1
redis_automatic_failover = false
redis_multi_az = false

documentdb_instance_class = "db.t3.medium"
documentdb_instance_count = 1
documentdb_deletion_protection = false
documentdb_skip_final_snapshot = true

ecs_backend_cpu = 256
ecs_backend_memory = 512
ecs_backend_count = 1

ecs_frontend_cpu = 256
ecs_frontend_memory = 512
ecs_frontend_count = 1

enable_ecs_autoscaling = false
enable_https = false
alb_enable_deletion_protection = false

enable_cloudfront = false
create_route53_zone = false
