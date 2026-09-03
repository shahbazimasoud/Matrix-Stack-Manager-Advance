#!/usr/bin/env bash
# ==============================================================================
# Raven Matrix Stack Manager - Interactive VPS Uninstaller & Cleanup Suite
# ==============================================================================

set -eo pipefail

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_step() { echo -e "${CYAN}[STEP]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

clear 2>/dev/null || true
echo -e "${RED}"
cat << 'EOF'
======================================================================
  ██████╗  █████╗  ██╗   ██╗███████╗███╗   ██╗
  ██╔══██╗██╔══██╗ ██║   ██║██╔════╝████╗  ██║
  ██████╔╝███████║ ██║   ██║█████╗  ██╔██╗ ██║
  ██╔══██╗██╔══██║ ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
  ██║  ██║██║  ██║  ╚████╔╝ ███████╗██║ ╚████║
  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═══╝  ╚══════╝╚═╝  ╚═══╝

        RAVEN MATRIX STACK MANAGER PANEL - VPS UNINSTALLER
    Repository: https://github.com/shahbazimasoud/Matrix-Stack-Manager-Advance
    Developer: Masoud Shahbazi (https://www.linkedin.com/in/masoudshahbazi/)
======================================================================
EOF
echo -e "${NC}"

# Check privileges
if [ "$EUID" -ne 0 ]; then
  log_error "Please run this uninstaller as root (using sudo)."
  exit 1
fi

INSTALL_DIR="/opt/matrix-manager"
NON_INTERACTIVE=false
PRESERVE_DATA=true

# Parse CLI flags
for arg in "$@"; do
  case $arg in
    -y|--yes|--force|-f|--non-interactive)
      NON_INTERACTIVE=true
      ;;
    --preserve-data)
      PRESERVE_DATA=true
      NON_INTERACTIVE=true
      ;;
    --purge-all)
      PRESERVE_DATA=false
      ;;
    DELETE)
      NON_INTERACTIVE=true
      ;;
  esac
done

if [ "$NON_INTERACTIVE" = false ]; then
  echo -e "\n${YELLOW}Would you like to delete the installation directory completely?${NC}"
  echo -e "${RED}[WARNING] All panel user accounts and server connections will be automatically backed up to /etc/matrix-manager-backup before removal.${NC}"

  CONFIRM_DELETE=""
  if [ -t 0 ]; then
    printf "%s" "Type 'DELETE' to confirm full uninstallation, or press Enter/anything else to cancel: "
    read -r CONFIRM_DELETE
  elif [ -e /dev/tty ]; then
    printf "%s" "Type 'DELETE' to confirm full uninstallation, or press Enter/anything else to cancel: " > /dev/tty
    read -r CONFIRM_DELETE < /dev/tty || CONFIRM_DELETE=""
  else
    log_info "Running in automated non-interactive mode. Proceeding with data backup & uninstallation..."
    CONFIRM_DELETE="DELETE"
  fi

  if [ "$CONFIRM_DELETE" != "DELETE" ]; then
    echo ""
    log_info "Uninstallation cancelled by user. No files or services were removed."
    exit 0
  fi
fi

echo ""
log_step "Proceeding with uninstallation and data protection..."

# 0. Backup Panel Data (Users, Passwords, Server Connections)
BACKUP_DIR="/etc/matrix-manager-backup"
log_step "Creating persistent backup of panel accounts and server connections in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"

if [ -f "$INSTALL_DIR/db/panel_data.json" ]; then
  cp -f "$INSTALL_DIR/db/panel_data.json" "$BACKUP_DIR/panel_data.json"
  log_success "Panel database backed up to $BACKUP_DIR/panel_data.json"
elif [ -f "$(pwd)/db/panel_data.json" ]; then
  cp -f "$(pwd)/db/panel_data.json" "$BACKUP_DIR/panel_data.json"
  log_success "Panel database backed up from current directory to $BACKUP_DIR/panel_data.json"
else
  log_info "No existing panel_data.json found to back up."
fi

# 1. Stop and Disable Systemd Service
log_step "Stopping Matrix Manager Service..."
if systemctl is-active --quiet matrix-manager 2>/dev/null; then
  systemctl stop matrix-manager 2>/dev/null || log_warning "Failed to stop service."
fi

log_step "Disabling Matrix Manager Service..."
if systemctl is-enabled --quiet matrix-manager 2>/dev/null; then
  systemctl disable matrix-manager 2>/dev/null || log_warning "Failed to disable service."
fi

log_step "Removing Systemd Service Unit File..."
if [ -f "/etc/systemd/system/matrix-manager.service" ]; then
  rm -f "/etc/systemd/system/matrix-manager.service"
  systemctl daemon-reload 2>/dev/null || true
  log_success "Systemd service removed."
fi

# 2. Remove Nginx Proxy Configuration
if [ -f "/etc/nginx/sites-enabled/matrix-manager.conf" ] || [ -f "/etc/nginx/sites-available/matrix-manager.conf" ]; then
  log_step "Removing Nginx proxy configuration..."
  rm -f "/etc/nginx/sites-enabled/matrix-manager.conf"
  rm -f "/etc/nginx/sites-available/matrix-manager.conf"
  
  if command -v nginx &>/dev/null; then
    if nginx -t &>/dev/null; then
      systemctl reload nginx 2>/dev/null || systemctl restart nginx 2>/dev/null || log_warning "Failed to reload Nginx."
      log_success "Nginx configuration updated and reloaded."
    fi
  fi
fi

# 3. Clean Installation Directory
if [ -d "$INSTALL_DIR" ]; then
  log_step "Deleting $INSTALL_DIR directory..."
  rm -rf "$INSTALL_DIR"
  log_success "Application directory deleted."
else
  log_info "Directory $INSTALL_DIR does not exist."
fi

log_success "UNINSTALLATION COMPLETED SUCCESSFULLY!"
echo -e "Matrix Manager Panel has been removed. All account backups are safely stored in $BACKUP_DIR/panel_data.json."
