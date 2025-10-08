output "endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "reader_endpoint" {
  description = "Redis reader endpoint"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "port" {
  description = "Redis port"
  value       = aws_elasticache_replication_group.main.port
}

output "id" {
  description = "Redis replication group ID"
  value       = aws_elasticache_replication_group.main.id
}

output "arn" {
  description = "Redis ARN"
  value       = aws_elasticache_replication_group.main.arn
}
