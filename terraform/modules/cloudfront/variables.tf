variable "project_name" { type = string }
variable "environment" { type = string }
variable "alb_domain_name" { type = string }
variable "s3_bucket_domain_name" { type = string }
variable "ssl_certificate_arn" { type = string; default = "" }
variable "price_class" { type = string; default = "PriceClass_100" }
variable "enable_ipv6" { type = bool; default = true }
variable "minimum_protocol_version" { type = string; default = "TLSv1.2_2021" }
variable "tags" { type = map(string); default = {} }
