variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "backend_image" { type = string }
variable "backend_cpu" { type = number; default = 512 }
variable "backend_memory" { type = number; default = 1024 }
variable "backend_desired_count" { type = number; default = 2 }
variable "backend_target_group_arn" { type = string }
variable "frontend_image" { type = string }
variable "frontend_cpu" { type = number; default = 256 }
variable "frontend_memory" { type = number; default = 512 }
variable "frontend_desired_count" { type = number; default = 2 }
variable "frontend_target_group_arn" { type = string }
variable "backend_environment_variables" { type = map(string); default = {} }
variable "frontend_environment_variables" { type = map(string); default = {} }
variable "enable_autoscaling" { type = bool; default = true }
variable "autoscaling_min_capacity" { type = number; default = 2 }
variable "autoscaling_max_capacity" { type = number; default = 10 }
variable "autoscaling_target_cpu_percent" { type = number; default = 70 }
variable "autoscaling_target_memory_percent" { type = number; default = 80 }
variable "log_retention_days" { type = number; default = 30 }
variable "tags" { type = map(string); default = {} }
