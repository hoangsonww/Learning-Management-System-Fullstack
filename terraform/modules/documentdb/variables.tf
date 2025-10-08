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

variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "instance_count" {
  type    = number
  default = 3
}

variable "engine_version" {
  type    = string
  default = "5.0.0"
}

variable "master_username" {
  type    = string
  default = "lmsadmin"
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
  default = "02:00-03:00"
}

variable "maintenance_window" {
  type    = string
  default = "sun:03:00-sun:04:00"
}

variable "tags" {
  type    = map(string)
  default = {}
}
