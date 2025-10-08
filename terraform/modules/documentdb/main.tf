# DocumentDB Subnet Group
resource "aws_docdb_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-docdb-subnet-group"
  subnet_ids = var.subnet_ids

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-docdb-subnet-group"
  })
}

# DocumentDB Cluster Parameter Group
resource "aws_docdb_cluster_parameter_group" "main" {
  family = "docdb5.0"
  name   = "${var.project_name}-${var.environment}-docdb-params"

  parameter {
    name  = "tls"
    value = "enabled"
  }

  parameter {
    name  = "audit_logs"
    value = "enabled"
  }

  tags = var.tags
}

# Random password for DocumentDB
resource "random_password" "documentdb" {
  length  = 32
  special = false # DocumentDB doesn't support all special characters
}

# Store DocumentDB password in Secrets Manager
resource "aws_secretsmanager_secret" "documentdb_password" {
  name                    = "${var.project_name}-${var.environment}-documentdb-password"
  recovery_window_in_days = var.deletion_protection ? 30 : 0

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "documentdb_password" {
  secret_id = aws_secretsmanager_secret.documentdb_password.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.documentdb.result
    engine   = "docdb"
    host     = aws_docdb_cluster.main.endpoint
    port     = aws_docdb_cluster.main.port
  })
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "main" {
  cluster_identifier      = "${var.project_name}-${var.environment}-docdb"
  engine                  = "docdb"
  engine_version          = var.engine_version
  master_username         = var.master_username
  master_password         = random_password.documentdb.result
  db_subnet_group_name    = aws_docdb_subnet_group.main.name
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  vpc_security_group_ids  = var.security_group_ids

  backup_retention_period = var.backup_retention_period
  preferred_backup_window = var.backup_window
  preferred_maintenance_window = var.maintenance_window

  storage_encrypted   = true
  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project_name}-${var.environment}-docdb-final-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  enabled_cloudwatch_logs_exports = ["audit", "profiler"]

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-docdb-cluster"
  })
}

# DocumentDB Cluster Instances
resource "aws_docdb_cluster_instance" "main" {
  count              = var.instance_count
  identifier         = "${var.project_name}-${var.environment}-docdb-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.instance_class

  auto_minor_version_upgrade = true

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-docdb-instance-${count.index + 1}"
  })
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "documentdb_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-docdb-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/DocDB"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"

  dimensions = {
    DBClusterIdentifier = aws_docdb_cluster.main.id
  }

  tags = var.tags
}
