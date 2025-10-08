variable "project_name" { type = string }
variable "environment" { type = string }
variable "enable_versioning" { type = bool; default = true }
variable "enable_lifecycle_rules" { type = bool; default = true }
variable "lifecycle_glacier_days" { type = number; default = 90 }
variable "lifecycle_expiration_days" { type = number; default = 365 }
variable "enable_replication" { type = bool; default = false }
variable "replication_region" { type = string; default = "us-west-2" }
variable "tags" { type = map(string); default = {} }
