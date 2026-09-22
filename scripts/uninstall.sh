#!/usr/bin/env bash

set -euo pipefail

SYSTEMD_DIR="/etc/systemd/system"
CONFIG_DIR="/etc/deceptionx"

CTI_SERVICE="$SYSTEMD_DIR/deceptionx-cti.service"
POTCTL_SERVICE="$SYSTEMD_DIR/deceptionx-potctl.service"

if [[ "${EUID}" -ne 0 ]]; then
    echo "[ERROR] Run with sudo:"
    echo
    echo "sudo ./scripts/uninstall.sh"
    exit 1
fi

echo "======================================"
echo " DeceptionX Uninstaller"
echo "======================================"
echo

echo "[DeceptionX] Stopping services..."

systemctl stop deceptionx-cti.service 2>/dev/null || true
systemctl stop deceptionx-potctl.service 2>/dev/null || true

echo "[DeceptionX] Disabling services..."

systemctl disable deceptionx-cti.service 2>/dev/null || true
systemctl disable deceptionx-potctl.service 2>/dev/null || true

echo "[DeceptionX] Removing systemd units..."

rm -f "$CTI_SERVICE"
rm -f "$POTCTL_SERVICE"

systemctl daemon-reload

echo
echo "[DeceptionX] Services removed."
echo
echo "Runtime data and configuration were intentionally preserved:"
echo
echo "  $CONFIG_DIR"
echo "  CTI database"
echo "  Potctl database"
echo "  offset.state"
echo
echo "To remove those manually, do so only after confirming"
echo "you no longer need the stored telemetry or API key."
echo
echo "======================================"
echo " Uninstall complete"
echo "======================================"