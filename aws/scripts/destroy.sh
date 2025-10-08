#!/bin/bash
###############################################################################
# AWS Infrastructure Destruction Script
###############################################################################

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"

echo -e "${RED}WARNING: This will destroy ALL AWS infrastructure!${NC}"
echo -e "${YELLOW}This action cannot be undone!${NC}"
echo ""
read -p "Type 'destroy' to confirm: " confirm

if [[ "$confirm" != "destroy" ]]; then
    echo "Destruction cancelled"
    exit 0
fi

cd "$TERRAFORM_DIR"

echo "Disabling deletion protection on RDS and DocumentDB..."
terraform state list | grep -E 'aws_(db_instance|docdb_cluster)' | while read resource; do
    terraform state show "$resource" | grep -q 'deletion_protection.*true' && \
        terraform apply -target="$resource" -var='rds_deletion_protection=false' -var='documentdb_deletion_protection=false' -auto-approve || true
done

echo "Destroying infrastructure..."
terraform destroy \
    -auto-approve \
    -var="rds_skip_final_snapshot=true" \
    -var="documentdb_skip_final_snapshot=true"

echo -e "${RED}Infrastructure destroyed${NC}"
