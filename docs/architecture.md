# AI Honeynet Lab Architecture

## Overview

The AI Honeynet Lab is an isolated cybersecurity environment designed to safely collect, monitor, and analyze attacker behavior. The lab consists of multiple Docker-based honeypots monitored by a host-based Intrusion Detection System (Suricata). All services are deployed inside an isolated Docker network to prevent accidental exposure to production systems.

---

# Network Architecture

<p align=center>
    <img src="../docs/image/DeceptionX Architecture (Network) (4).png">
</p>

---

# Components

## Ubuntu Host

The Ubuntu virtual machine serves as the central monitoring host. It runs Docker, hosts all honeypot containers, and executes Suricata IDS for network monitoring.

Responsibilities:

* Docker runtime
* Honeypot deployment
* Network monitoring
* Log collection

---

## Cowrie SSH Honeypot

**Purpose**

Cowrie emulates an SSH server to attract brute-force attacks and interactive attackers.

It records:

* Login attempts
* Usernames
* Passwords
* Commands entered
* Download attempts
* Session activity

**Why it exists**

SSH is one of the most frequently targeted services on the Internet. Cowrie allows observation of attacker behavior without exposing a real system.

---

## HTTP Decoy

**Purpose**

The HTTP Decoy emulates a simple web application that attackers can discover during reconnaissance.

It records:

* HTTP requests
* Requested URLs
* User-Agent headers
* Client IP addresses
* Response codes

**Why it exists**

Most attackers begin with web reconnaissance. The HTTP decoy provides realistic HTTP traffic for Suricata analysis and future dashboard visualization.

---

## Suricata IDS

Suricata continuously monitors the Docker network interface connecting the honeypots.

It inspects network traffic and generates structured JSON events.

Enabled event types include:

* Alerts
* HTTP
* DNS
* TLS
* SSH

Suricata detects activities such as:

* Port scans
* Nmap service detection
* Suspicious protocol usage
* Known attack signatures

---

# Log Locations

The lab stores logs in separate locations for easier analysis.

| Component  | Log Location                 |
| ---------- | ---------------------------- |
| Cowrie     | `cowrie-logs/`               |
| HTTP Decoy | `http-decoy-logs/`           |
| Suricata   | `/var/log/suricata/eve.json` |

The `eve.json` file contains structured JSON events suitable for ingestion into SIEM platforms such as Elasticsearch, OpenSearch, or Splunk.

---

# Lab Lifecycle

## Start the Lab

```bash
docker compose up -d
```

This command:

* Creates the Docker network
* Starts all honeypot containers
* Restores persistent volumes
* Makes services available for testing

---

## Stop the Lab

```bash
docker compose down
```

This command:

* Stops all containers
* Removes the Docker network
* Preserves log volumes unless explicitly deleted

---

# Traffic Flow

1. An attacker (or Kali VM) sends traffic to the honeypot services.
2. Docker routes traffic to the appropriate container.
3. The honeypot processes the request and records application-level logs.
4. Suricata monitors the network interface simultaneously.
5. Suricata generates IDS events in `eve.json`.
6. Logs are available for future ingestion into a SIEM and visualization dashboards.

---

# Security and Containment

This lab is intentionally isolated to reduce risk during testing.

Current containment measures include:

* Docker containers are deployed on an isolated bridge network.
* The lab is intended for use inside a virtualized environment.
* Only explicitly required ports are exposed for testing.
* No production services are hosted within the environment.
* Internet exposure is disabled during development whenever possible.
* Outbound (egress) connectivity should be restricted using host firewall rules to prevent compromised containers from communicating with external systems.
* The environment is designed for educational and research purposes only.

---

# Future Architecture

Planned enhancements include:

* Filebeat log forwarding
* Elasticsearch for centralized log storage
* Kibana dashboards for visualization
* SOAR automation for alert response
* Additional honeypots (FTP, SMB, DNS)
* MITRE ATT&CK technique mapping
* Threat intelligence enrichment
* Automated alert notifications
