output "backend_repository_url" {
  description = "URL of backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_repository_url" {
  description = "URL of frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "backend_repository_arn" {
  description = "ARN of backend ECR repository"
  value       = aws_ecr_repository.backend.arn
}

output "frontend_repository_arn" {
  description = "ARN of frontend ECR repository"
  value       = aws_ecr_repository.frontend.arn
}
