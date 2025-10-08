variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "database_subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "allocated_storage" {
  type    = number
  default = 100
}

variable "max_allocated_storage" {
  type    = number
  default = 500
}

variable "engine_version" {
  type    = string
  default = "15.3"
}

variable "database_name" {
  type    = string
  default = "lmsdb"
}

variable "master_username" {
  type    = string
  default = "lmsadmin"
}

variable "multi_az" {
  type    = bool
  default = true
}

variable "deletion_protection" {
  type    = bool
  default = true
}

variable "skip_final_snapshot" {
  type    = bool
  default = false
}

variable "backup_retention_period" {
  type    = number
  default = 7
}

variable "backup_window" {
  type    = string
  default = "03:00-04:00"
}

variable "maintenance_window" {
  type    = string
  default = "sun:04:00-sun:05:00"
}

variable "enabled_cloudwatch_logs_exports" {
  type    = list(string)
  default = ["postgresql", "upgrade"]
}

variable "tags" {
  type    = map(string)
  default = {}
}
