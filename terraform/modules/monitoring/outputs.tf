output "sns_topic_arn" { value = aws_sns_topic.alarms.arn }
output "dashboard_name" { value = aws_cloudwatch_dashboard.main.dashboard_name }
