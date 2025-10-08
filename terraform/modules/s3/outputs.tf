output "static_assets_bucket" { value = aws_s3_bucket.static_assets.id }
output "static_assets_bucket_arn" { value = aws_s3_bucket.static_assets.arn }
output "backups_bucket" { value = aws_s3_bucket.backups.id }
output "backups_bucket_arn" { value = aws_s3_bucket.backups.arn }
output "bucket_regional_domain_name" { value = aws_s3_bucket.static_assets.bucket_regional_domain_name }
