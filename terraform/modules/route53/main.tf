# Route53 Hosted Zone
resource "aws_route53_zone" "main" {
  name = var.domain_name
  tags = var.tags
}

# A Record pointing to ALB or CloudFront
resource "aws_route53_record" "main" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.use_cloudfront ? var.cloudfront_domain_name : var.alb_dns_name
    zone_id                = var.use_cloudfront ? var.cloudfront_zone_id : var.alb_zone_id
    evaluate_target_health = true
  }
}

# WWW Record
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.use_cloudfront ? var.cloudfront_domain_name : var.alb_dns_name
    zone_id                = var.use_cloudfront ? var.cloudfront_zone_id : var.alb_zone_id
    evaluate_target_health = true
  }
}
