# DeceptionX

> **An adaptive, AI-driven honeynet designed to dynamically control deception infrastructure based on observed attacker activity.**

**Status:** 🚧 MVP in active development

DeceptionX is an open-source security research project exploring how honeypots, IDS telemetry, automated reasoning, and controlled infrastructure can work together to create an adaptive deception environment.

The goal is to move beyond static honeypots toward a system that can **observe → reason → decide → adapt**, while maintaining strong security boundaries and an auditable control layer.

---

## Why DeceptionX?

Traditional honeypots are largely static. They expose a predefined service, collect activity, and leave the analysis to the operator.

This creates several limitations:

* Attackers can fingerprint predictable environments.
* Raw security alerts require manual interpretation.
* Honeypot exposure usually does not adapt to attacker behavior.
* Security decisions may not have a structured audit trail.

DeceptionX explores a closed-loop approach:

```text
Security Telemetry
        ↓
    Perception
        ↓
Decision / Agent
        ↓
     potctl
        ↓
Controlled Honeypot Actions
        ↓
New Telemetry
        ↺
```

The system is designed so that **reasoning is separated from enforcement**. The agent can propose a decision, while the Go-based control layer is responsible for validating and executing permitted infrastructure actions.

---

## Architecture

```text
                         ┌──────────────────┐
                         │    Honeypots     │
                         │   SSH / HTTP     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Suricata     │
                         │       IDS        │
                         │    eve.json      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Perception    │
                         │  Parse /         │
                         │  Normalize      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Agent / Decision │
                         │    Reasoning     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      potctl      │
                         │ Go Control Layer │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Controlled       │
                         │ Docker Actions   │
                         └──────────────────┘

                                  │
                                  ▼
                         ┌──────────────────┐
                         │ SQLite / Audit   │
                         │     History      │
                         └──────────────────┘
```

### Core design principle

DeceptionX separates **decision-making** from **infrastructure enforcement**.

The reasoning layer should not directly control Docker or the honeynet. Instead:

```text
Agent
  ↓
Decision
  ↓
Validation
  ↓
potctl
  ↓
Allowed Action
```

This provides a clear security boundary between probabilistic reasoning and deterministic infrastructure control.

---

## Current Implementation

The project is being developed incrementally.

### Honeynet

* [x] Isolated Linux honeynet environment
* [x] Cowrie SSH honeypot
* [x] HTTP decoy service
* [x] Docker-based service deployment
* [x] Suricata IDS
* [x] JSON-based security telemetry

### Perception

* [x] Suricata `eve.json` monitoring
* [x] Event parsing
* [x] Event normalization
* [x] File offset tracking
* [x] Protection against duplicate processing
* [x] Partial-line handling
* [x] Automated tests

### `potctl` Control Layer

* [x] Go-based control plane
* [x] Docker integration
* [x] Structured logging with zerolog
* [x] SQLite state and audit storage
* [x] REST API
* [x] `/state` endpoint
* [x] `/toggle` endpoint
* [x] API key authentication
* [x] Target allow-list validation
* [x] Local-only API exposure

### Agent

* [x] Structured decision model
* [x] Decision validation
* [x] Supported actions such as `expose`, `hide`, and `no_change`

The broader agent reasoning and adaptive decision loop is still under active development.

---

## Security Design

Security is a core part of DeceptionX rather than an additional feature.

The project follows several principles:

### Least privilege

Components should receive only the permissions required for their function.

### Controlled actions

The enforcement layer validates decisions before performing infrastructure changes.

### Allow-listing

Security-sensitive targets and actions are explicitly restricted rather than accepting arbitrary input.

### Local-only control

The `potctl` API is designed for local communication and should not be exposed directly to an untrusted network.

### Authentication

API access requires authentication rather than relying only on network location.

### Auditability

Important state changes and decisions are stored so that system behavior can be reviewed later.

### Isolation

The honeynet should run inside an isolated lab environment and must not be used against systems or networks without authorization.

---

## Technology Stack

| Component           | Technology                       |
| ------------------- | -------------------------------- |
| Control layer       | Go                               |
| Perception          | Go, fsnotify                     |
| Docker control      | Moby/Docker API                  |
| Logging             | zerolog                          |
| Storage             | SQLite                           |
| IDS                 | Suricata                         |
| SSH honeypot        | Cowrie                           |
| HTTP decoy          | Custom HTTP service              |
| Agent               | Python                           |
| Decision validation | Pydantic                         |
| Dashboard           | React *(planned/in development)* |

The technology stack may evolve as the project develops.

---

## Repository Structure

```text
DeceptionX/
│
├── agent/          # Python agent and decision logic
├── core/           # Core security/control components
├── honeypots/      # Honeypot and decoy services
├── infra/          # Lab and infrastructure configuration
├── frontend/       # Dashboard
├── docs/           # Architecture and build documentation
├── scripts/        # Testing and attack simulations
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

The structure is evolving alongside the project.

---

## Getting Started

DeceptionX is currently designed primarily for an **isolated Linux security lab**.

### Prerequisites

Depending on the component being developed:

* Git
* Linux
* Docker
* Docker Compose
* Go
* Python
* Basic networking knowledge

### Clone the repository

```bash
git clone https://github.com/codewithMohak/DeceptionX.git
cd DeceptionX
```

### Run Go tests

From the appropriate Go module:

```bash
go test ./...
```

For the perception package:

```bash
go test ./internal/perception
```

Additional setup instructions are being documented as the project develops.

> ⚠️ **Important:** DeceptionX is a security research project. Run the honeynet only inside an isolated environment and only against systems you are authorized to test.

---

## Development

DeceptionX is being developed incrementally through focused milestones.

The development process emphasizes:

```text
Research
   ↓
Design
   ↓
Implementation
   ↓
Testing
   ↓
Security Review
   ↓
Documentation
```

Contributions are welcome in areas such as:

* Security research
* Honeypot development
* Detection engineering
* Go development
* Python development
* Agent systems
* Testing
* Documentation
* Frontend/dashboard development

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution guidelines.

---

## Project Status

DeceptionX is currently an **MVP / active research build**.

The current implementation focuses on establishing the core pipeline:

```text
Telemetry
    ↓
Perception
    ↓
Decision
    ↓
Control
    ↓
Audit
```

More advanced capabilities will be added incrementally and documented as they become implemented and tested.

---

## Roadmap

Planned areas of development include:

* Adaptive exposure policies
* Expanded attacker behavior modeling
* MITRE ATT&CK mapping
* Attack graph construction
* Improved deception personas
* Anti-fingerprinting techniques
* Rich security telemetry
* Dashboard visualization
* Expanded evaluation and benchmarking
* Multi-agent experimentation
* Kubernetes-based scaling
* Structured CTI output such as STIX/TAXII

The roadmap will evolve as research and implementation progress.

---

## Research & Related Work

DeceptionX builds upon ideas from research in cyber deception, autonomous honeynets, and intelligent security systems.

Relevant work includes:

* **Mirra (2025)** — *Towards Autonomous Cyber Deception: An AI Agent for Dynamic Honeynet Management*
* **De Gaspari et al. (2019)** — *Towards Intelligent Cyber Deception Systems*
* **Newsham et al. (2025)** — *Inducing Personality in LLM-Based Honeypot Agents*
* **Mirra et al. (2026)** — *Towards Agentic Honeynet Configuration*

The project's architecture and research direction are documented further in:

[`docs/architecture.md`](docs/architecture.md)

---

## Documentation

Additional project documentation is available under [`docs/`](docs/).

This includes:

* Architecture
* Lab setup
* Development notes
* Evaluation
* Build logs
* Research notes

As the project grows, documentation will be expanded alongside implementation.

---

## Contributing

Contributions, security research, testing, documentation improvements, and ideas are welcome.

Before contributing, please read:

* [`CONTRIBUTING.md`](CONTRIBUTING.md)
* [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

For security-sensitive issues, please follow the project's security reporting process.

---

## License

DeceptionX is released under the [MIT License](LICENSE).

---

## Author

**Mohak Agarwal**

Security researcher and engineer building DeceptionX as an open-source security research project.

* [LinkedIn](https://www.linkedin.com/in/mohak-agarwal/)
* [Medium](https://medium.com/@mohakagarwal.sec)

---

> **DeceptionX is an evolving research project.**
>
> Build it. Break it. Observe it. Improve it.
