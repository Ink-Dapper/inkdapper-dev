#!/bin/bash
# =============================================================================
# InkDapper — Full VPS Deployment Script
# Deploys backend + admin + frontend from git, restarts PM2
#
# Prerequisites on the VPS:
#   - Node.js 18+
#   - PM2 (npm install -g pm2)
#   - nginx
#   - MinIO running as a service (run scripts/setup-vps-minio.sh first)
#   - SSL certs via certbot
#   - Git repo cloned to PROJECT_PATH
#
# Usage (from your local machine):
#   chmod +x deploy-to-vps.sh
#   ./deploy-to-vps.sh
# =============================================================================

set -e

# ── CONFIG — update these to match your VPS ───────────────────────────────
VPS_USER="root"                          # SSH user on VPS
VPS_HOST="your-vps-ip"                  # VPS IP or hostname
VPS_SSH_PORT="22"                        # SSH port (usually 22)
PROJECT_PATH="/var/www/inkdapper-dev"    # Where the project lives on VPS
GIT_BRANCH="main"                        # Branch to deploy
PM2_APP_NAME="inkdapper-api"             # Must match ecosystem.config.cjs name
# ──────────────────────────────────────────────────────────────────────────

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
step()    { echo -e "\n${CYAN}──── $1 ────${NC}"; }
SSH="ssh -p $VPS_SSH_PORT -o ConnectTimeout=15 $VPS_USER@$VPS_HOST"

# ── Sanity checks ─────────────────────────────────────────────────────────
[ "$VPS_HOST" = "your-vps-ip" ] && error "Update VPS_HOST in this script before running."

step "Checking SSH connection"
$SSH "echo 'SSH OK'" || error "Cannot SSH to $VPS_USER@$VPS_HOST:$VPS_SSH_PORT"
info "SSH connection OK"

# ── 1. Pull latest code ───────────────────────────────────────────────────
step "Pulling latest code on VPS ($GIT_BRANCH)"
$SSH "
  set -e
  cd $PROJECT_PATH
  git fetch --all
  git checkout $GIT_BRANCH
  git pull origin $GIT_BRANCH
  echo 'Git pull OK'
"
info "Code updated"

# ── 2. Install backend dependencies ──────────────────────────────────────
step "Installing backend dependencies"
$SSH "
  set -e
  cd $PROJECT_PATH/backend
  npm install --omit=dev
  echo 'Backend deps installed'
"
info "Backend dependencies installed"

# ── 3. Build admin panel ──────────────────────────────────────────────────
step "Building admin panel"
$SSH "
  set -e
  cd $PROJECT_PATH/admin
  npm install
  npm run build
  echo 'Admin build OK'
"
info "Admin panel built"

# ── 4. Build frontend ─────────────────────────────────────────────────────
step "Building frontend"
$SSH "
  set -e
  cd $PROJECT_PATH/frontend
  npm install
  npm run build
  echo 'Frontend build OK'
"
info "Frontend built"

# ── 5. Restart backend via PM2 ────────────────────────────────────────────
step "Restarting backend (PM2)"
$SSH "
  set -e
  cd $PROJECT_PATH
  # Start or reload using ecosystem config
  if pm2 list | grep -q '$PM2_APP_NAME'; then
    pm2 reload ecosystem.config.cjs --env production
    echo 'PM2 reload OK'
  else
    pm2 start ecosystem.config.cjs --env production
    pm2 save
    echo 'PM2 start OK'
  fi
"
info "Backend restarted"

# ── 6. Reload nginx ───────────────────────────────────────────────────────
step "Reloading nginx"
$SSH "sudo nginx -t && sudo systemctl reload nginx"
info "Nginx reloaded"

# ── 7. Health checks ──────────────────────────────────────────────────────
step "Running health checks"

info "Waiting 3 seconds for process to settle..."
sleep 3

info "Checking API..."
API_RESP=$(curl -s -o /dev/null -w "%{http_code}" https://api.inkdapper.com/api/test)
if [ "$API_RESP" = "200" ]; then
  info "API is healthy (HTTP $API_RESP)"
else
  warn "API returned HTTP $API_RESP — check PM2 logs on the VPS"
fi

info "Checking storage endpoint..."
STORAGE_RESP=$(curl -s -o /dev/null -w "%{http_code}" https://storage.inkdapper.com)
if [ "$STORAGE_RESP" = "200" ] || [ "$STORAGE_RESP" = "403" ]; then
  info "Storage is reachable (HTTP $STORAGE_RESP)"
else
  warn "Storage returned HTTP $STORAGE_RESP — check MinIO service on VPS"
fi

# ── Done ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN} Deployment complete!${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""
echo "  Site       : https://www.inkdapper.com"
echo "  Admin      : https://admin.inkdapper.com"
echo "  API        : https://api.inkdapper.com"
echo "  Storage    : https://storage.inkdapper.com"
echo ""
echo "  PM2 status : $SSH 'pm2 status'"
echo "  PM2 logs   : $SSH 'pm2 logs $PM2_APP_NAME --lines 50'"
echo ""
