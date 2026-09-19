# Deterministic Attack Scenario — Ground Truth

## Attacker
WSL/Ubuntu attacker

## Target
Kali DeceptionX honeynet

## Expected attack stages

| Stage | Activity | Expected Target |
|---|---|---|
| 1 | Network/service discovery with Nmap | Kali / honeynet |
| 2 | SSH brute-force attempts | Cowrie |
| 3 | SSH honeypot interaction | Cowrie |
| 4 | HTTP path scanning | HTTP decoy |

## Expected sequence

1. Nmap discovers exposed services.
2. Hydra performs SSH login attempts against Cowrie.
3. Attacker connects/interacts with Cowrie.
4. HTTP path scanning probes the HTTP decoy.

## Ground-truth stages

Total stages: 4

1. Discovery
2. Credential Access
3. Honeypot Interaction
4. Web Reconnaissance