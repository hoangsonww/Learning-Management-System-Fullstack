output "endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = aws_docdb_cluster.main.endpoint
}

output "reader_endpoint" {
  description = "DocumentDB reader endpoint"
  value       = aws_docdb_cluster.main.reader_endpoint
}

output "port" {
  description = "DocumentDB port"
  value       = aws_docdb_cluster.main.port
}

output "cluster_id" {
  description = "DocumentDB cluster ID"
  value       = aws_docdb_cluster.main.id
}

output "arn" {
  description = "DocumentDB ARN"
  value       = aws_docdb_cluster.main.arn
}

output "password_secret_arn" {
  description = "ARN of the secret containing DocumentDB password"
  value       = aws_secretsmanager_secret.documentdb_password.arn
  sensitive   = true
}
