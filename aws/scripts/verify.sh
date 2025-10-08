#!/bin/bash
###############################################################################
# Infrastructure Verification Script
# Validates Terraform configuration and AWS prerequisites
###############################################################################

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TERRAFORM_DIR="$PROJECT_ROOT/terraform"

errors=0
warnings=0

log_ok() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; ((errors++)); }
log_warn() { echo -e "${YELLOW}!${NC} $1"; ((warnings++)); }
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LMS Infrastructure Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if command -v aws >/dev/null 2>&1; then
    log_ok "AWS CLI installed ($(aws --version))"
else
    log_error "AWS CLI not installed"
fi

if command -v terraform >/dev/null 2>&1; then
    log_ok "Terraform installed ($(terraform version | head -1))"
else
    log_error "Terraform not installed"
fi

if command -v docker >/dev/null 2>&1; then
    log_ok "Docker installed ($(docker --version))"
else
    log_error "Docker not installed"
fi

if command -v jq >/dev/null 2>&1; then
    log_ok "jq installed ($(jq --version))"
else
    log_warn "jq not installed (optional but recommended)"
fi

# Check AWS credentials
echo ""
echo "Checking AWS credentials..."
if aws sts get-caller-identity &>/dev/null; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USERNAME=$(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f2)
    log_ok "AWS credentials configured"
    log_info "Account: $ACCOUNT_ID"
    log_info "User: $USERNAME"
else
    log_error "AWS credentials not configured"
fi

# Check Terraform files
echo ""
echo "Checking Terraform configuration..."
cd "$TERRAFORM_DIR"

if [[ -f "main.tf" ]]; then
    log_ok "main.tf exists"
else
    log_error "main.tf not found"
fi

if [[ -f "variables.tf" ]]; then
    log_ok "variables.tf exists"
else
    log_error "variables.tf not found"
fi

if [[ -f "outputs.tf" ]]; then
    log_ok "outputs.tf exists"
else
    log_error "outputs.tf not found"
fi

# Check modules
module_count=$(find modules -name "main.tf" | wc -l | tr -d ' ')
if [[ $module_count -eq 12 ]]; then
    log_ok "All 12 modules present"
else
    log_error "Expected 12 modules, found $module_count"
fi

# Check for terraform.tfvars
if [[ -f "terraform.tfvars" ]]; then
    log_ok "terraform.tfvars configured"
else
    log_warn "terraform.tfvars not found (copy from terraform.tfvars.example)"
fi

# Validate Terraform syntax
echo ""
echo "Validating Terraform syntax..."
if terraform fmt -check -recursive >/dev/null 2>&1; then
    log_ok "Terraform formatting correct"
else
    log_warn "Terraform files need formatting (run: terraform fmt -recursive)"
fi

if terraform init -backend=false >/dev/null 2>&1; then
    log_ok "Terraform initialization successful"

    if terraform validate >/dev/null 2>&1; then
        log_ok "Terraform configuration valid"
    else
        log_error "Terraform validation failed"
        terraform validate
    fi
else
    log_error "Terraform initialization failed"
fi

# Check deployment scripts
echo ""
echo "Checking deployment scripts..."
cd "$PROJECT_ROOT/aws/scripts"

for script in deploy.sh destroy.sh rollback.sh verify.sh; do
    if [[ -f "$script" ]]; then
        if [[ -x "$script" ]]; then
            log_ok "$script exists and is executable"
        else
            log_warn "$script exists but is not executable"
        fi
    else
        log_error "$script not found"
    fi
done

# Check Docker configuration
echo ""
echo "Checking Docker configuration..."
if [[ -f "$PROJECT_ROOT/LMS-Backend/Dockerfile" ]]; then
    log_ok "Backend Dockerfile exists"
else
    log_error "Backend Dockerfile not found"
fi

if [[ -f "$PROJECT_ROOT/LMS-Frontend/Dockerfile" ]]; then
    log_ok "Frontend Dockerfile exists"
else
    log_error "Frontend Dockerfile not found"
fi

# Check documentation
echo ""
echo "Checking documentation..."
docs=("$PROJECT_ROOT/DEPLOYMENT.md" "$PROJECT_ROOT/INFRASTRUCTURE_SUMMARY.md" "$TERRAFORM_DIR/README.md" "$PROJECT_ROOT/aws/README.md")
for doc in "${docs[@]}"; do
    if [[ -f "$doc" ]]; then
        log_ok "$(basename $doc) exists"
    else
        log_error "$(basename $doc) not found"
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [[ $errors -eq 0 ]]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    if [[ $warnings -gt 0 ]]; then
        echo -e "${YELLOW}! $warnings warnings found${NC}"
    fi
    echo ""
    echo "Infrastructure is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "  1. Configure terraform.tfvars (if not done)"
    echo "  2. Run: cd aws/scripts && ./deploy.sh"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $errors errors found${NC}"
    if [[ $warnings -gt 0 ]]; then
        echo -e "${YELLOW}! $warnings warnings found${NC}"
    fi
    echo ""
    echo "Please fix the errors before deploying."
    exit 1
fi
