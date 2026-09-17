<div align="center">

# ◈ DECEPTIONX

### CONTRIBUTOR CONTROL PLANE

**Observe → Understand → Build → Validate → Contribute**

<br>

[![Contributing](https://img.shields.io/badge/CONTRIBUTIONS-WELCOME-111827?style=for-the-badge)](https://github.com/codewithMohak/DeceptionX)
[![Security Research](https://img.shields.io/badge/FOCUS-SECURITY%20RESEARCH-111827?style=for-the-badge)](https://github.com/codewithMohak/DeceptionX)
[![Open Source](https://img.shields.io/badge/MODE-OPEN%20SOURCE-111827?style=for-the-badge)](https://github.com/codewithMohak/DeceptionX)

</div>

---

> **SIGNAL RECEIVED**
>
> A new contributor has entered the DeceptionX control plane.
>
> Your mission is simple:
>
> **Understand the system. Experiment safely. Improve it. Share what you learn.**

---

## `DECEPTIONX // CONTRIBUTOR PROTOCOL`

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   DECEPTIONX // CONTRIBUTOR PROTOCOL                       │
│                                                            │
│   STATUS   : ACCEPTING CONTRIBUTIONS                       │
│   MODE     : SECURITY RESEARCH                             │
│   PRIORITY : SAFE EXPERIMENTATION                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

DeceptionX is an experimental security research and engineering project focused on:

* Honeypots
* Deception technology
* Intrusion detection
* Security telemetry
* Event perception and normalization
* Adaptive security controls
* Automated security response

The project is being developed in the open, and contributions are welcome from developers, cybersecurity students, researchers, and security practitioners.

> **Project status:** DeceptionX is actively evolving. Some components are experimental or under development and should not be treated as production-ready security controls.

---

# `01 // ENTER THE SYSTEM`

Before contributing code, understand the basic architecture.

The project is being developed around a pipeline similar to:

```text
             SECURITY TELEMETRY
                     │
                     ▼
              ┌─────────────┐
              │  PERCEPTION │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │    AGENT    │
              │  / DECISION │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   POTCTL    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  HONEYPOT   │
              │   ACTION    │
              └─────────────┘
```

Think of the system as a feedback loop:

```text
OBSERVE
   ↓
NORMALIZE
   ↓
DECIDE
   ↓
CONTROL
   ↓
OBSERVE AGAIN
```

The architecture is evolving, so always check the current implementation and documentation before assuming a component is complete.

---

# `02 // SECURITY GATE`

DeceptionX is security-sensitive software.

It interacts with security telemetry, honeypots, Docker containers, network services, and potentially automated control mechanisms.

## ⚠️ Run it safely

Use DeceptionX inside an **isolated security lab**.

Do not expose experimental honeypots or control interfaces directly to the public Internet.

Do not use DeceptionX against systems that you do not own or do not have explicit authorization to test.

### Never commit:

```text
❌ API keys
❌ Passwords
❌ Access tokens
❌ Private keys
❌ Credentials
❌ Sensitive production logs
❌ Real victim data
❌ Local databases containing sensitive information
```

Use sanitized or synthetic data when creating examples or tests.

---

## Security principles

When contributing security-sensitive functionality, think about:

```text
┌───────────────────────┐
│     LEAST PRIVILEGE   │
├───────────────────────┤
│     INPUT VALIDATION  │
├───────────────────────┤
│     ALLOW-LISTING     │
├───────────────────────┤
│     AUTHENTICATION    │
├───────────────────────┤
│     AUDITABILITY      │
├───────────────────────┤
│     SAFE FAILURE      │
└───────────────────────┘
```

Ask yourself:

> **"What happens if the input is controlled by an attacker?"**

That question matters especially for perception, agent decisions, APIs, Docker operations, and automated response.

---

# `03 // YOUR DEVELOPMENT LAB`

Depending on what you are contributing to, you may need:

* Git
* Go
* Python
* Docker
* Linux
* Basic networking knowledge
* Basic cybersecurity knowledge

Some DeceptionX components are designed around an isolated Linux security lab.

### Recommended model

```text
                 YOUR HOST
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
          DEV MACHINE    LAB VM
                            │
                    ┌───────┴────────┐
                    │                │
                    ▼                ▼
                HONEYPOTS        SURICATA
                    │                │
                    └───────┬────────┘
                            ▼
                       DECEPTIONX
```

Keep experimental infrastructure isolated from production networks.

---

# `04 // REPOSITORY MAP`

The project is organized around different parts of the DeceptionX architecture.

Conceptually:

```text
DeceptionX/
│
├── agent/          → Decision / agent components
├── core/           → Core control / enforcement
├── honeypots/      → Honeypot and deception services
├── infra/          → Infrastructure and lab configuration
├── docs/           → Documentation and build notes
├── frontend/       → Dashboard components
└── site/            → Public project content
```

The repository is under active development.

Directories and responsibilities may change as the architecture evolves.

Before creating a new directory, check whether an existing component already provides the appropriate location.

---

# `05 // GET YOUR COPY`

## 1. Fork

Create a fork of the DeceptionX repository.

## 2. Clone

```bash
git clone <your-fork-url>
cd DeceptionX
```

## 3. Create a branch

For an independent contribution:

```bash
git checkout -b feat/your-change
```

Recommended naming:

```text
feat/<description>
fix/<description>
docs/<description>
test/<description>
refactor/<description>
research/<description>
```

Examples:

```text
feat/event-normalization
fix/log-processing
docs/lab-setup
test/perception-tailer
research/mitre-mapping
```

---

# `06 // MAKE YOUR CHANGE`

A healthy contribution loop looks like this:

```text
        ┌───────────────┐
        │ UNDERSTAND    │
        │ THE ISSUE     │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ PLAN THE      │
        │ CHANGE        │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ IMPLEMENT     │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ TEST          │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ REVIEW DIFF   │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ PULL REQUEST  │
        └───────────────┘
```

Keep pull requests focused.

### Good

```text
fix: prevent duplicate perception events
```

### Less useful

```text
update everything
```

One focused change is easier to review, test, understand, and maintain.

---

# `07 // TEST THE SIGNAL`

Testing is part of contributing.

## Go

Run all Go tests:

```bash
go test ./...
```

For a specific package:

```bash
go test ./internal/perception
```

Before submitting a pull request, run the tests relevant to your change.

If you introduce a bug fix, consider adding a regression test so the problem does not return later.

## Python

Run the project's configured Python test command for the component you changed.

If a component currently lacks automated tests, adding appropriate coverage is a valuable contribution.

---

# `08 // INSPECT BEFORE YOU COMMIT`

Before committing:

```bash
git status
git diff
```

Look carefully at the changes.

Check for accidental inclusion of:

```text
❌ build binaries
❌ local databases
❌ logs
❌ .env files containing secrets
❌ temporary files
❌ credentials
```

A clean diff is a good diff.

---

# `09 // COMMIT SIGNAL`

Use short, descriptive commit messages.

Recommended prefixes:

```text
feat:      new functionality
fix:       bug fix
docs:      documentation
test:      tests
refactor:  code restructuring
chore:     maintenance
research:  research/evaluation work
```

Examples:

```text
feat: add event normalization
fix: prevent duplicate eve.json processing
test: add perception tailer coverage
docs: improve lab setup instructions
refactor: isolate Docker control logic
research: document MITRE technique mapping
```

Describe **what changed**.

Prefer:

```text
fix: prevent duplicate perception events
```

over:

```text
worked on perception
```

---

# `10 // PULL REQUEST HANDSHAKE`

Every pull request should explain four things:

### What changed?

Describe the implementation.

### Why?

Explain the problem or use case.

### How was it tested?

Include the commands or tests you ran.

Example:

```text
Tests:
- go test ./internal/perception
- go test ./...
```

### Security impact

Mention whether the change affects:

* Network exposure
* Authentication
* Authorization
* Docker privileges
* Automated actions
* Logging
* Data handling
* Honeypot behavior

If there is no meaningful security impact, say so.

---

# `11 // DOCUMENTATION SIGNAL`

Not every contribution needs to be code.

Documentation contributions are valuable.

You can improve:

* Setup instructions
* Architecture documentation
* Lab configuration
* Troubleshooting
* API documentation
* Security documentation
* Research notes
* Examples
* Diagrams
* Developer documentation

When documenting the project, distinguish clearly between:

```text
IMPLEMENTED
EXPERIMENTAL
PLANNED
```

Never describe planned functionality as implemented functionality.

---

# `12 // SECURITY-SENSITIVE CONTRIBUTIONS`

Extra care is required when changing:

```text
Docker control
Container lifecycle
Network configuration
API authentication
Authorization
Automated response
Honeypot exposure
Agent decisions
Filesystem access
Log ingestion
```

Before opening a pull request, consider:

### Least privilege

Does the component have more permissions than necessary?

### Input validation

Can attacker-controlled data reach this component?

### Allow-listing

Are actions and targets restricted to expected values?

### Authentication

Can an unauthorized user invoke the control?

### Local exposure

Could this change accidentally expose a control interface?

### Auditability

Can important actions be traced later?

### Failure behavior

What happens if:

```text
input = malformed
dependency = unavailable
container = missing
file = corrupted
network = unavailable
agent = unavailable
```

Security-sensitive pull requests should describe relevant considerations.

---

# `13 // WHAT CAN YOU CONTRIBUTE?`

There are several contribution paths.

## `CODE`

```text
Perception
Event normalization
Docker control
API improvements
Agent / decision logic
Storage
Error handling
Testing
Performance
```

## `SECURITY RESEARCH`

```text
Threat modeling
MITRE ATT&CK mapping
Deception techniques
Attack-surface analysis
Detection experiments
Evaluation methodology
False-positive analysis
```

## `DOCUMENTATION`

```text
Setup guides
Troubleshooting
Architecture
Diagrams
Examples
Research notes
Developer documentation
```

## `TESTING`

```text
Unit tests
Integration tests
Edge cases
Malformed-input testing
Regression tests
```

## `DEVELOPER EXPERIENCE`

```text
CI
Linting
Development scripts
Reproducible setup
Docker improvements
```

---

# `14 // FIRST CONTACT`

New to the project?

Start small.

Good first contributions include:

* Fixing documentation
* Improving an explanation
* Adding a missing test
* Adding an edge-case test
* Improving error messages
* Improving troubleshooting
* Adding an example
* Improving code comments
* Documenting existing functionality

Look for issues marked:

```text
good-first-issue
help-wanted
documentation
testing
```

If you're planning a substantial implementation, comment on the relevant issue before starting.

This helps prevent duplicated work and gives the project maintainers an opportunity to discuss the approach.

---

# `15 // ISSUE PROTOCOL`

Before opening an issue, search existing issues first.

## Bug reports

Include:

```text
What happened?

What did you expect?

Steps to reproduce:

Environment:

Relevant logs:

Relevant errors:

Version / commit:
```

Never include secrets or sensitive infrastructure information.

---

## Feature requests

Explain:

```text
Problem:

Who benefits:

Proposed behavior:

Possible alternatives:

Security considerations:
```

---

## Research proposals

For research-oriented contributions, include:

```text
Research question:

Objective:

Hypothesis:

Experimental setup:

Required telemetry:

Evaluation approach:

Expected limitations:
```

---

# `16 // PULL REQUEST CHECKLIST`

Before you transmit the signal:

```text
[ ] Change addresses a specific problem or goal
[ ] Existing implementation was reviewed
[ ] Tests were added or updated where appropriate
[ ] Relevant tests pass
[ ] git diff was reviewed
[ ] No secrets were committed
[ ] No unnecessary build artifacts were committed
[ ] No sensitive logs were committed
[ ] Documentation was updated where necessary
[ ] Security implications were considered
[ ] PR explains what changed
[ ] PR explains why it changed
[ ] PR explains how it was tested
```

---

# `17 // ARCHITECTURE CHANGES`

Large architectural changes should be discussed before implementation.

Examples include:

```text
Changing the event pipeline
Changing control-plane behavior
Introducing a new service
Changing authentication
Changing Docker privileges
Changing network architecture
Replacing a major dependency
Changing the agent decision model
```

For substantial changes, open an issue or discussion describing the proposed design.

This gives contributors and maintainers a chance to evaluate the approach before significant implementation work begins.

---

# `18 // CONTRIBUTION COMPLETE`

If your pull request passes review and is merged:

```text
                    SIGNAL
                      │
                      ▼
                ┌───────────┐
                │   CODE    │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │   TEST    │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │   REVIEW  │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │   MERGE   │
                └─────┬─────┘
                      │
                      ▼
                ┌───────────┐
                │  DECEPTION│
                │     X     │
                └───────────┘
```

Your contribution becomes part of the project's history.

---

# `19 // QUESTIONS`

Not sure how something works?

Open a discussion or comment on the relevant issue before beginning a large implementation.

Good questions are welcome.

Security engineering is a process of experimentation, debugging, failure, and learning.

If you found something confusing, documenting it may help the next contributor.

---

# `20 // LICENSE`

By contributing to DeceptionX, you agree that your contributions will be licensed under the project's existing license.

See the repository `LICENSE` file for the applicable terms.

---

<div align="center">

## `DECEPTIONX // OPEN BY DESIGN`

### Observe.

### Understand.

### Break safely.

### Build better.

<br>

```text
──────────────────────────────────────────────
        SIGNAL CLOSED // CONTRIBUTION LOGGED
──────────────────────────────────────────────
```

**Thank you for helping build DeceptionX.**

</div>
