#!/usr/bin/env bash

set -euo pipefail

CTI_URL="http://127.0.0.1:8090"
POTCTL_URL="http://127.0.0.1:8081"
POTCTL_ENV="/etc/deceptionx/potctl.env"

FAILED=0

print_check() {
    local name="$1"
    local result="$2"

    if [[ "$result" == "ok" ]]; then
        printf '[OK]   %s\n' "$name"
    else
        printf '[FAIL] %s\n' "$name"
        FAILED=1
    fi
}

echo "======================================"
echo " DeceptionX Health Check"
echo "======================================"
echo

# --------------------------------------
# Systemd services
# --------------------------------------

if systemctl is-active --quiet deceptionx-cti.service; then
    print_check "CTI service is running" "ok"
else
    print_check "CTI service is running" "fail"
fi

if systemctl is-active --quiet deceptionx-potctl.service; then
    print_check "Potctl service is running" "ok"
else
    print_check "Potctl service is running" "fail"
fi

# --------------------------------------
# CTI API
# --------------------------------------

if curl -fsS "$CTI_URL/health" >/dev/null 2>&1; then
    print_check "CTI API /health" "ok"
else
    print_check "CTI API /health" "fail"
fi

# --------------------------------------
# Potctl API
# --------------------------------------

if [[ -f "$POTCTL_ENV" ]]; then
    # shellcheck disable=SC1090
    source "$POTCTL_ENV"
else
    print_check "Potctl environment file exists" "fail"
    POTCTL_API_KEY=""
fi

if [[ -n "${POTCTL_API_KEY:-}" ]]; then
    if curl -fsS \
        -H "X-API-Key: ${POTCTL_API_KEY}" \
        "$POTCTL_URL/state" >/dev/null 2>&1; then
        print_check "Potctl API authentication" "ok"
    else
        print_check "Potctl API authentication" "fail"
    fi
else
    print_check "Potctl API key configured" "fail"
fi

# --------------------------------------
# Docker
# --------------------------------------

if docker info >/dev/null 2>&1; then
    print_check "Docker daemon accessible" "ok"
else
    print_check "Docker daemon accessible" "fail"
fi

# --------------------------------------
# Suricata
# --------------------------------------

if systemctl is-active --quiet suricata.service; then
    print_check "Suricata service is running" "ok"
else
    print_check "Suricata service is running" "fail"
fi

if [[ -f /var/log/suricata/eve.json ]]; then
    print_check "Suricata eve.json exists" "ok"
else
    print_check "Suricata eve.json exists" "fail"
fi

# --------------------------------------
# Honeypots
# --------------------------------------

if docker ps --format '{{.Names}}' | grep -qx 'cowrie'; then
    print_check "Cowrie container is running" "ok"
else
    print_check "Cowrie container is running" "fail"
fi

if docker ps --format '{{.Names}}' | grep -qx 'http-decoy'; then
    print_check "HTTP decoy container is running" "ok"
else
    print_check "HTTP decoy container is running" "fail"
fi

echo
echo "======================================"

if [[ "$FAILED" -eq 0 ]]; then
    echo " DeceptionX health check: PASS"
    echo "======================================"
    exit 0
else
    echo " DeceptionX health check: FAIL"
    echo "======================================"
    exit 1
fi