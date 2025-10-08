variable "domain_name" { type = string }
variable "alb_dns_name" { type = string }
variable "alb_zone_id" { type = string }
variable "cloudfront_domain_name" { type = string; default = "" }
variable "cloudfront_zone_id" { type = string; default = "" }
variable "use_cloudfront" { type = bool; default = false }
variable "tags" { type = map(string); default = {} }
