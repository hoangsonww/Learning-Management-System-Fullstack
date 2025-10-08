output "endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
}

output "address" {
  description = "RDS address"
  value       = aws_db_instance.main.address
}

output "port" {
  description = "RDS port"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "arn" {
  description = "RDS ARN"
  value       = aws_db_instance.main.arn
}

output "password_secret_arn" {
  description = "ARN of the secret containing RDS password"
  value       = aws_secretsmanager_secret.rds_password.arn
  sensitive   = true
}
