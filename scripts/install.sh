#!/usr/bin/env bash

set -euo pipefail

# ======================================
# DeceptionX Installer
# ======================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

SYSTEMD_DIR="/etc/systemd/system"
CONFIG_DIR="/etc/deceptionx"
POTCTL_ENV="$CONFIG_DIR/potctl.env"

CTI_TEMPLATE="$REPO_DIR/deploy/systemd/deceptionx-cti.service.in"
POTCTL_TEMPLATE="$REPO_DIR/deploy/systemd/deceptionx-potctl.service.in"

CTI_SERVICE="$SYSTEMD_DIR/deceptionx-cti.service"
POTCTL_SERVICE="$SYSTEMD_DIR/deceptionx-potctl.service"

# ======================================
# Helpers
# ======================================

log() {
    printf '[DeceptionX] %s\n' "$1"
}

fail() {
    printf '[ERROR] %s\n' "$1" >&2
    exit 1
}

require_command() {
    local command="$1"

    if ! command -v "$command" >/dev/null 2>&1; then
        fail "Required command not found: $command"
    fi
}

# ======================================
# Root check
# ======================================

if [[ "${EUID}" -ne 0 ]]; then
    fail "Run this installer with sudo:

sudo ./scripts/install.sh"
fi

# ======================================
# Determine service user
# ======================================

if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
    SERVICE_USER="$SUDO_USER"
else
    SERVICE_USER="${USER:-root}"
fi

if [[ "$SERVICE_USER" == "root" ]]; then
    fail "Could not determine a non-root service user."
fi

if ! id "$SERVICE_USER" >/dev/null 2>&1; then
    fail "Service user does not exist: $SERVICE_USER"
fi

SERVICE_GROUP="$(id -gn "$SERVICE_USER")"

# ======================================
# Basic dependency checks
# ======================================

log "Checking dependencies..."

require_command systemctl
require_command python3
require_command go
require_command docker
require_command curl
require_command openssl

# ======================================
# Validate repository
# ======================================

[[ -d "$REPO_DIR/agent" ]] \
    || fail "agent directory not found."

[[ -d "$REPO_DIR/potctl" ]] \
    || fail "potctl directory not found."

[[ -f "$REPO_DIR/agent/main.py" ]] \
    || fail "agent/main.py not found."

[[ -f "$REPO_DIR/potctl/go.mod" ]] \
    || fail "potctl/go.mod not found."

[[ -f "$CTI_TEMPLATE" ]] \
    || fail "Missing CTI systemd template."

[[ -f "$POTCTL_TEMPLATE" ]] \
    || fail "Missing Potctl systemd template."

# ======================================
# Check systemd
# ======================================

if ! systemctl >/dev/null 2>&1; then
    fail "systemd is not available."
fi

# ======================================
# Check Docker
# ======================================

log "Checking Docker..."

if ! systemctl is-active --quiet docker.service; then
    fail "Docker service is not running."
fi

if ! sudo -u "$SERVICE_USER" docker info >/dev/null 2>&1; then
    fail "User '$SERVICE_USER' cannot access Docker."
fi

# ======================================
# Check Suricata
# ======================================

log "Checking Suricata..."

if ! systemctl is-active --quiet suricata.service; then
    fail "Suricata service is not running."
fi

if [[ ! -f /var/log/suricata/eve.json ]]; then
    fail "Suricata eve.json was not found."
fi

# ======================================
# Create configuration directory
# ======================================

log "Preparing configuration directory..."

mkdir -p "$CONFIG_DIR"

chmod 755 "$CONFIG_DIR"

# ======================================
# Generate or preserve Potctl API key
# ======================================

if [[ -f "$POTCTL_ENV" ]] && grep -q '^POTCTL_API_KEY=' "$POTCTL_ENV"; then
    log "Existing Potctl API key found; preserving it."
else
    log "Generating a new Potctl API key..."

    API_KEY="$(openssl rand -hex 32)"

    cat > "$POTCTL_ENV" <<EOF
POTCTL_API_KEY=$API_KEY
POTCTL_DB_PATH=$REPO_DIR/potctl/potctl.db
EOF

    chmod 600 "$POTCTL_ENV"
fi

# ======================================
# Ensure DB path is current
# ======================================

if grep -q '^POTCTL_DB_PATH=' "$POTCTL_ENV"; then
    sed -i "s|^POTCTL_DB_PATH=.*|POTCTL_DB_PATH=$REPO_DIR/potctl/potctl.db|" "$POTCTL_ENV"
else
    printf '\nPOTCTL_DB_PATH=%s\n' "$REPO_DIR/potctl/potctl.db" >> "$POTCTL_ENV"
fi

chmod 600 "$POTCTL_ENV"

# ======================================
# Build Potctl
# ======================================

log "Building Potctl..."

mkdir -p "$REPO_DIR/potctl/bin"

chown -R "$SERVICE_USER:$SERVICE_GROUP" "$REPO_DIR/potctl/bin"

sudo -u "$SERVICE_USER" \
    bash -c "cd '$REPO_DIR/potctl' && go build -o bin/potctl ./cmd/potctl"

chmod 755 "$REPO_DIR/potctl/bin/potctl"

# ======================================
# Render CTI systemd service
# ======================================

log "Installing CTI systemd service..."

sed \
    -e "s|@SERVICE_USER@|$SERVICE_USER|g" \
    -e "s|@DECEPTIONX_DIR@|$REPO_DIR|g" \
    "$CTI_TEMPLATE" \
    > "$CTI_SERVICE"

# ======================================
# Render Potctl systemd service
# ======================================

log "Installing Potctl systemd service..."

sed \
    -e "s|@SERVICE_USER@|$SERVICE_USER|g" \
    -e "s|@DECEPTIONX_DIR@|$REPO_DIR|g" \
    "$POTCTL_TEMPLATE" \
    > "$POTCTL_SERVICE"

chmod 644 "$CTI_SERVICE"
chmod 644 "$POTCTL_SERVICE"

# ======================================
# Reload systemd
# ======================================

log "Reloading systemd..."

systemctl daemon-reload

# ======================================
# Enable services
# ======================================

log "Enabling DeceptionX services..."

systemctl enable deceptionx-cti.service
systemctl enable deceptionx-potctl.service

# ======================================
# Start / restart services
# ======================================

log "Starting DeceptionX services..."

systemctl restart deceptionx-potctl.service
systemctl restart deceptionx-cti.service

# ======================================
# Wait for startup
# ======================================

sleep 3

# ======================================
# Run health check
# ======================================

log "Running health check..."

"$REPO_DIR/scripts/healthcheck.sh"

log "Installation completed successfully."