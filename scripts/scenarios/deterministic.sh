#!/usr/bin/env bash

# DeceptionX Week 4 - Deterministic Attack Scenario
# Ground truth:
# 1. Network/service discovery
# 2. SSH brute-force attempts
# 3. SSH honeypot interaction
# 4. HTTP path scanning

TARGET="192.168.242.142"

echo "[1/4] Network discovery"
nmap -sV -p 2222,8080 "$TARGET"

echo "[2/4] SSH brute-force attempts"
hydra -l root -P "$HOME/deceptionx-wordlists/ssh-passwords.txt" \
    -s 2222 ssh://"$TARGET" -t 4 -f

echo "[3/4] SSH honeypot interaction"
ssh -p 2222 root@"$TARGET"

echo "[4/4] HTTP path scanning"
for path in admin login robots.txt server-status backup test; do
    curl -s -o /dev/null -w "%{http_code} $path\n" \
        "http://$TARGET:8080/$path"
done