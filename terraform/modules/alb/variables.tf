variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "enable_deletion_protection" {
  type    = bool
  default = true
}

variable "enable_http2" {
  type    = bool
  default = true
}

variable "enable_cross_zone_load_balancing" {
  type    = bool
  default = true
}

variable "enable_https" {
  type    = bool
  default = true
}

variable "ssl_certificate_arn" {
  type    = string
  default = ""
}

variable "health_check_path" {
  type    = string
  default = "/health"
}

variable "health_check_interval" {
  type    = number
  default = 30
}

variable "health_check_timeout" {
  type    = number
  default = 5
}

variable "tags" {
  type    = map(string)
  default = {}
}
