output "dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.main.dns_name
}

output "arn" {
  description = "ARN of the ALB"
  value       = aws_lb.main.arn
}

output "zone_id" {
  description = "Zone ID of the ALB"
  value       = aws_lb.main.zone_id
}

output "backend_target_group_arn" {
  description = "ARN of backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "frontend_target_group_arn" {
  description = "ARN of frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "http_listener_arn" {
  description = "ARN of HTTP listener"
  value       = aws_lb_listener.http.arn
}

output "https_listener_arn" {
  description = "ARN of HTTPS listener"
  value       = var.enable_https ? aws_lb_listener.https[0].arn : null
}
