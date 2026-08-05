# Suricata IDS Setup

## Interface
docker0

## Output
/var/log/suricata/eve.json

## Enabled Events

- alert
- dns
- http
- tls
- ssh

## Test Performed

- Nmap version scan from Kali
- HTTP request to honeypot on port 8080

## Result

Successfully observed alert events in eve.json.