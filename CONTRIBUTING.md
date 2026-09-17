# Contributing to DeceptionX

Thanks for your interest in contributing to **DeceptionX**!

DeceptionX is an experimental security research and engineering project focused on honeypots, deception technology, intrusion detection, security telemetry, adaptive controls, and automated response.

The project is actively evolving, so some components may be experimental or not production-ready.

---

## Contents

* [Code of Conduct](#code-of-conduct)
* [Security First](#security-first)
* [Development Environment](#development-environment)
* [Repository Structure](#repository-structure)
* [Getting Started](#getting-started)
* [Running Tests](#running-tests)
* [Making Changes](#making-changes)
* [Commit Messages](#commit-messages)
* [Pull Requests](#pull-requests)
* [What You Can Contribute](#what-you-can-contribute)
* [Good First Contributions](#good-first-contributions)
* [Issues](#issues)
* [License](#license)

---

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

Keep discussions respectful, constructive, and focused on improving the project.

---

## Security First

DeceptionX is a security project. Please keep these rules in mind:

* Use only systems and networks you are authorized to test.
* Keep the honeynet isolated from production and public networks.
* Never commit passwords, API keys, tokens, private keys, or other secrets.
* Do not include real victim data in issues, logs, tests, or pull requests.
* Be careful when modifying Docker, networking, authentication, filesystem access, or automated response logic.
* Prefer least-privilege designs.
* Validate and restrict security-sensitive inputs.
* Document important security implications of your changes.

If you discover a serious security vulnerability, do not publicly disclose sensitive details in an issue.

---

## Development Environment

Depending on the part of the project you are working on, you may need:

* Git
* Go
* Python
* Docker
* Linux
* Basic networking and cybersecurity knowledge

DeceptionX is designed to be developed and tested in an isolated lab environment.

---

## Repository Structure

The project is organized roughly as follows:

```text
DeceptionX/
├── agent/       # Agent and decision logic
├── core/        # Core enforcement components
├── honeypots/   # Honeypot and decoy services
├── infra/       # Infrastructure and lab configuration
├── docs/        # Documentation and build notes
├── frontend/    # Dashboard
└── site/        # Public project website
```

The structure may change as the project develops.

---

## Getting Started

### 1. Fork the repository

Create your own fork of DeceptionX on GitHub.

### 2. Clone your fork

```bash
git clone <your-fork-url>
cd DeceptionX
```

### 3. Create a branch

Use a descriptive branch name:

```bash
git checkout -b feat/your-change
```

Examples:

```text
feat/perception-improvement
fix/log-processing
docs/contributor-guide
test/decision-validation
refactor/docker-control
```

### 4. Make your changes

Keep changes focused. Avoid mixing unrelated features, refactoring, or documentation changes in the same pull request.

### 5. Run tests

For Go:

```bash
go test ./...
```

For a specific package:

```bash
go test ./internal/perception
```

Run the appropriate Python tests when working on the agent.

### 6. Review your changes

Before committing:

```bash
git status
git diff
```

Make sure you have not included:

* secrets
* `.env` files containing credentials
* local databases
* logs
* binaries
* temporary files

---

## Making Changes

A typical contribution should follow this flow:

```text
Issue / Idea
     ↓
Understand the existing implementation
     ↓
Create a focused branch
     ↓
Implement the change
     ↓
Add or update tests
     ↓
Run tests
     ↓
Review the diff
     ↓
Open a Pull Request
```

For larger architectural or security-sensitive changes, open an issue or discussion first.

---

## Commit Messages

Use clear, descriptive commit messages.

Recommended prefixes:

```text
feat:      new functionality
fix:       bug fix
docs:      documentation
test:      tests
refactor:  code restructuring
chore:     maintenance
research:  research or experimentation
```

Examples:

```text
feat: add event normalization
fix: prevent duplicate eve.json processing
docs: improve contributor guide
test: add perception watcher tests
refactor: simplify docker control
```

---

## Pull Requests

When opening a pull request, explain:

1. **What changed**
2. **Why it was changed**
3. **How it was tested**
4. **Any security considerations**

Before submitting, make sure:

* [ ] Tests pass
* [ ] New functionality has appropriate tests
* [ ] Documentation is updated when necessary
* [ ] No secrets or sensitive data are included
* [ ] No unnecessary generated files are included
* [ ] The change is focused
* [ ] Security implications have been considered

---

## What You Can Contribute

Contributions are welcome in:

* 🔐 Security research
* 💻 Go development
* 🐍 Python / agent development
* 🪤 Honeypots and deception
* 🌐 Networking and IDS
* 🧪 Testing
* 📚 Documentation
* 🎨 Dashboard / frontend
* 🛠️ Developer experience

---

## Good First Contributions

If you are new to the project, good starting points include:

* Documentation improvements
* Adding tests
* Improving error messages
* Fixing small bugs
* Adding examples
* Improving troubleshooting documentation

Useful GitHub labels include:

```text
good-first-issue
help-wanted
documentation
testing
```

For larger changes, please discuss the idea before starting implementation.

---

## Issues

### Bug reports

Include:

* What happened
* Expected behavior
* Steps to reproduce
* Relevant logs or error messages
* Environment information

### Feature requests

Explain:

* The problem
* The proposed solution
* Why it would be useful

### Research proposals

Include:

* Research question
* Proposed approach
* Expected security relevance
* Any assumptions or limitations

**Never include secrets, credentials, private keys, or sensitive victim data in an issue.**

---

## License

By contributing to DeceptionX, you agree that your contributions will be licensed under the project's existing license.

See [LICENSE](LICENSE) for details.

---

Thank you for helping improve DeceptionX! 🚀
