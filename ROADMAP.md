# DeceptionX Roadmap

DeceptionX is being developed incrementally as an experimental security research and engineering project.

The roadmap reflects the current development direction and may change as the project evolves.

---

## 🟢 Completed

### Foundation & Lab

- [x] Define project scope and threat model
- [x] Design an isolated honeynet environment
- [x] Set up the Ubuntu Server lab
- [x] Configure basic OS hardening and firewall controls
- [x] Set up Docker-based infrastructure
- [x] Set up Suricata IDS telemetry
- [x] Set up Cowrie SSH honeypot
- [x] Set up HTTP decoy service

### potctl Control Plane

- [x] Create the Go-based `potctl` control plane
- [x] Implement Docker container control
- [x] Add structured logging
- [x] Add SQLite-based state and audit storage
- [x] Implement REST API endpoints
- [x] Add API authentication
- [x] Add target allow-list validation
- [x] Restrict the API to local access
- [x] Add tests for core functionality

### Perception

- [x] Implement Suricata telemetry parsing
- [x] Normalize raw security events
- [x] Monitor continuously written telemetry
- [x] Handle file offsets
- [x] Prevent duplicate event processing
- [x] Handle incomplete log lines
- [x] Add perception tests

### Agent / Decision Model

- [x] Define a structured decision model
- [x] Validate permitted actions
- [x] Validate permitted targets
- [x] Reject invalid decisions

### Open-Source Foundation

- [x] Clean project README
- [x] Add contribution guidelines
- [x] Add Code of Conduct
- [x] Add MIT License
- [x] Add issue templates
- [x] Add pull request template
- [x] Add GitHub Actions CI
- [x] Add evaluation methodology

---

## 🟡 Current Development

### Adaptive Security Pipeline

- [ ] Connect perception output to the decision layer
- [ ] Implement the agent reasoning workflow
- [ ] Connect decisions to `potctl`
- [ ] Validate controlled honeypot actions
- [ ] Record decisions and actions for auditing
- [ ] Demonstrate an end-to-end adaptive response

### Security Intelligence

- [ ] Map security events to MITRE ATT&CK techniques
- [ ] Build deterministic technique-mapping logic
- [ ] Integrate mapped techniques into the decision context
- [ ] Evaluate decision behavior using repeatable attack scenarios

---

## 🔵 Near-Term Development

### Dashboard

- [ ] Build the DeceptionX monitoring dashboard
- [ ] Display live security events
- [ ] Display normalized events
- [ ] Display current honeypot state
- [ ] Display decisions and actions
- [ ] Display audit information
- [ ] Visualize the DeceptionX architecture and event flow

### Evaluation

- [ ] Build repeatable evaluation scenarios
- [ ] Measure detection latency
- [ ] Measure response latency
- [ ] Evaluate perception correctness
- [ ] Evaluate decision validity
- [ ] Measure duplicate-event handling
- [ ] Evaluate false positives
- [ ] Measure resource usage
- [ ] Document experimental results

---

## 🟣 Future Research

Future research directions may include:

- [ ] Adaptive deception strategies
- [ ] Threat-intelligence integration
- [ ] Improved agent reasoning
- [ ] Honeypot engagement analysis
- [ ] Anti-fingerprinting techniques
- [ ] Additional honeypot types
- [ ] Advanced MITRE ATT&CK coverage
- [ ] Long-running reliability experiments
- [ ] Comparative evaluation of deception strategies

---

## 🤝 Community Contributions

DeceptionX is intended to become an open-source security research project.

Potential contribution areas include:

- Honeypot development
- IDS and telemetry processing
- Go development
- Python / agent development
- Security research
- MITRE ATT&CK mapping
- Threat intelligence
- Frontend / dashboard development
- Testing and evaluation
- Documentation

Good first contributions will be marked with:

- `good-first-issue`
- `help-wanted`

See [CONTRIBUTING.md](CONTRIBUTING.md) for development and contribution guidelines.

---

## 📌 Project Status

DeceptionX is currently under active development.

Some components are functional and tested, while the adaptive reasoning, end-to-end orchestration, dashboard, and broader evaluation capabilities are still being developed.

The roadmap is intentionally iterative and may change as implementation and research findings evolve.