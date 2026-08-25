# DeceptionX

**An adaptive, AI-driven honeynet that autonomously reconfigures its exposure based on inferred attacker intent — and automatically generates MITRE ATT&CK-aligned threat intelligence from live sessions.**

> Status: 🚧 MVP in active development. This README reflects the current scoped build — see [Roadmap](#roadmap) for the full vision.

---

## Why this exists

Traditional honeypots are static: they run fixed emulated services and log whatever hits them. A patient attacker fingerprints them quickly, and the operator gets raw alerts with no structured intelligence.

DeceptionX closes that loop. A perception layer reads IDS alerts, an LLM-based reasoning agent infers the attacker's multi-stage progression as an attack graph, and an enforcement layer dynamically exposes or hides honeypot services in real time to keep the attacker engaged — while a mapping layer turns the whole session into structured, MITRE-tagged threat intelligence.

Full research context, related work, and architectural derivation are in [`docs/architecture.md`](docs/architecture.md).

---

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌───────────────────┐      ┌──────────────┐
│  Honeypots   │      │  Suricata    │      │   Perception       │      │  Reasoning    │
│  (Docker)    │─────▶│  (IDS)       │─────▶│   Service (Go)     │─────▶│  Agent        │
│  SSH / HTTP  │      │  eve.json    │      │  poll + normalize  │      │  (Python/LLM) │
└─────────────┘      └──────────────┘      └───────────────────┘      └──────┬───────┘
       ▲                                                                     │
       │                                                                     ▼
┌──────┴───────┐      ┌──────────────┐      ┌───────────────────┐    attack graph +
│  Enforcement  │◀─────│  potctl API  │◀─────│  Episodic Memory   │    exposure decision
│  (Docker SDK) │      │  (Go, REST)  │      │  (SQLite, append-  │
└──────────────┘      └──────────────┘      │  only)             │
                                             └───────────────────┘
                                                       │
                                                       ▼
                                             ┌───────────────────┐
                                             │  CTI Mapping        │
                                             │  (MITRE ATT&CK IDs) │
                                             └───────────────────┘
                                                       │
                                                       ▼
                                             ┌───────────────────┐
                                             │  Dashboard (React)  │
                                             │  state / graph / CTI│
                                             └───────────────────┘
```

**Design principle:** enforcement (Go) is fully decoupled from reasoning (Python/LLM) over a REST/gRPC boundary. Fast, deterministic infrastructure actions never block on slow, probabilistic LLM calls — and either side can be modified or replaced independently.

---

## Tech stack

| Layer | Technology |
|---|---|
| Enforcement / perception | Go, Docker SDK, zerolog |
| Reasoning agent | Python, FastAPI, LLM API |
| IDS | Suricata |
| Honeypots | Cowrie (SSH), custom HTTP decoy |
| Memory / audit log | SQLite (append-only via triggers) |
| CTI mapping | Rule-based Suricata → MITRE ATT&CK lookup |
| Dashboard | React, TanStack Query, react-flow, Tailwind |
| Inter-service auth | Short-lived tokens (no standing credentials) |

---

## Repository structure

```
deceptionx/
├── core/           # Go: enforcement + perception (potctl)
├── agent/          # Python: LLM reasoning, CTI mapping
├── honeypots/       # Container definitions (Cowrie, HTTP decoy)
├── infra/           # docker-compose, Suricata config
├── frontend/        # React dashboard
├── scripts/          # Attack simulation scenarios
├── docs/             # Architecture, evaluation, weekly build log
└── tests/
```

---

## Getting started

### Prerequisites
- Docker + Docker Compose
- Go 1.22+
- Python 3.11+
- Node.js 20+
- An LLM API key (set as `LLM_API_KEY` in `.env`)

### Local setup

```bash
git clone https://github.com/<your-username>/deceptionx.git
cd deceptionx

# bring up honeypots + Suricata
cd infra && docker compose up -d

# run the Go enforcement/perception core
cd ../core && go run cmd/potctl/main.go

# run the Python reasoning agent
cd ../agent && pip install -r requirements.txt && uvicorn main:app --reload

# run the dashboard
cd ../frontend && npm install && npm run dev
```

Dashboard available at `http://localhost:5173`.

### Running an attack scenario

```bash
cd scripts/scenarios
./deterministic.sh   # scripted recon → exploit sequence against the lab honeynet
```

Watch the dashboard update live as alerts are inferred into an attack graph and exposure decisions are enforced.

> ⚠️ Run only against the isolated lab network defined in `infra/docker-compose.yml`. Never point this at a network you don't own.

---

## What it does today (MVP scope)

- [x] Containerized honeynet (SSH + HTTP decoy) with Suricata IDS
- [x] Go enforcement core with structured, append-only audit logging
- [x] LLM-based attack-graph inference + exposure decision (single combined prompt)
- [x] Closed loop: perception → inference → enforcement, fully automated at runtime
- [x] Rule-based MITRE ATT&CK mapping from IDS signatures
- [x] Live dashboard: honeypot state, attack graph, CTI feed
- [ ] Persona-driven decoy content (SANDMAN-inspired)
- [ ] Anti-fingerprinting hardening
- [ ] Multi-agent / Kubernetes scaling
- [ ] Full STIX/TAXII-compliant CTI output

Infrastructure (containers, Suricata) is provisioned manually via `docker compose`; only the runtime exposure behavior is autonomously managed by the agent loop.

---

## Evaluation

Metrics from scripted attack scenarios (deterministic, stealthy) are tracked in [`docs/evaluation.md`](docs/evaluation.md), including attack-graph inference accuracy, exposure efficiency, and per-cycle latency.

---

## Roadmap

Full 16-week research roadmap (persona engine, anti-fingerprinting, Kubernetes scaling, STIX output) is outlined in [`docs/architecture.md`](docs/architecture.md).

---

## Related work

This project synthesizes ideas from:
- Mirra (2025) — *Towards Autonomous Cyber Deception: An AI Agent for Dynamic Honeynet Management*
- De Gaspari et al. (2019) — *Towards Intelligent Cyber Deception Systems* (ADARCH/AHEAD)
- Newsham et al. (2025) — *Inducing Personality in LLM-Based Honeypot Agents* (SANDMAN)
- Mirra et al. (2026) — *Towards Agentic Honeynet Configuration*

Full breakdown and how each maps to this system's design in [`docs/architecture.md`](docs/architecture.md).

---

## License

[MIT](LICENSE)

## Author

Built by Mohak Agarwal — security researcher and engineer. [LinkedIn](https://www.linkedin.com/in/mohak-agarwal/) · [Medium](https://medium.com/@mohakagarwal.sec)
