variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "node_type" {
  type    = string
  default = "cache.t3.medium"
}

variable "num_cache_nodes" {
  type    = number
  default = 2
}

variable "parameter_group_family" {
  type    = string
  default = "redis7"
}

variable "engine_version" {
  type    = string
  default = "7.0"
}

variable "port" {
  type    = number
  default = 6379
}

variable "automatic_failover_enabled" {
  type    = bool
  default = true
}

variable "multi_az_enabled" {
  type    = bool
  default = true
}

variable "snapshot_retention_limit" {
  type    = number
  default = 7
}

variable "snapshot_window" {
  type    = string
  default = "03:00-05:00"
}

variable "maintenance_window" {
  type    = string
  default = "sun:05:00-sun:07:00"
}

variable "tags" {
  type    = map(string)
  default = {}
}
