# DeceptionX Evaluation

This document defines how DeceptionX will be evaluated as the project develops.

The goal is to measure whether the system can reliably:

1. Detect security activity from honeypot and IDS telemetry.
2. Normalize security events into a consistent format.
3. Produce a valid response decision.
4. Apply the decision through the `potctl` control plane.
5. Record actions for later analysis.
6. Reconfigure deception infrastructure without breaking the isolated lab.

> DeceptionX is an experimental security research project. The evaluation results will be updated as experiments are performed.

---

## 1. Evaluation Environment

Experiments should be performed inside the isolated DeceptionX laboratory environment.

The environment may include:

- Ubuntu Server
- Suricata IDS
- Cowrie SSH honeypot
- HTTP decoy
- Docker containers
- DeceptionX perception service
- DeceptionX agent / decision layer
- `potctl` control plane
- SQLite-based state and audit storage

Testing should only be performed against systems that are owned or explicitly authorized for testing.

---

## 2. Evaluation Pipeline

The primary evaluation flow is:

```text
Attack / Simulated Activity
          |
          v
Honeypot / IDS Telemetry
          |
          v
       Perception
          |
          v
    Normalized Event
          |
          v
   Decision / Agent
          |
          v
        potctl
          |
          v
 Controlled Honeypot Action
          |
          v
     Audit / Storage
Each stage should be evaluated independently as well as as part of the complete pipeline.

3. Metrics
3.1 Detection Latency

Definition: Time between security activity occurring and the corresponding event becoming available to the perception layer.

Example:

Attack occurs
     |
     |---- detection latency ----|
     |
Suricata / honeypot event

This can be measured using timestamps from the generated security telemetry.

3.2 Perception Correctness

The perception layer should correctly extract relevant information from raw telemetry.

Example fields include:

Timestamp
Source IP
Destination port
Event type
HTTP information
SSH information

The resulting normalized event should contain the expected:

Timestamp
Source IP
Service
Summary

Evaluation should compare the normalized output against known test inputs and expected results.

3.3 Duplicate Event Handling

The perception service should not process the same log entry multiple times.

Evaluation should verify that:

Existing events are not repeatedly emitted.
Appending new events processes only the new data.
Partial log lines are not processed prematurely.
File updates do not cause duplicate events.

This is particularly important for continuously written security telemetry.

3.4 Decision Validity

The decision layer should produce decisions that conform to the defined decision model.

For example, supported actions may include:

expose
hide
no_change

Evaluation should verify:

Valid actions are accepted.
Invalid actions are rejected.
Required fields are present.
Targets conform to the permitted target model.
Malformed decisions do not reach the enforcement layer.
3.5 Response Latency

Definition: Time between a valid decision being produced and the corresponding controlled action being applied.

Example:

Normalized Event
       |
       v
Decision
       |
       |---- response latency ----|
       |
       v
potctl action

This metric should be measured during end-to-end experiments.

3.6 Decision Accuracy

Decision accuracy evaluates whether the selected response is appropriate for a predefined test scenario.

Test scenarios should define:

Input security activity
Expected normalized event
Expected decision
Expected target
Expected action

The actual system output can then be compared against the expected result.

3.7 False Positives

A false positive occurs when normal or benign activity results in an unnecessary security response.

Evaluation should include representative benign activity and measure:

Benign events
     |
     v
Unexpected security decision

The exact false-positive rate should be reported only after sufficient experiments have been performed.

3.8 System Reliability

The system should be evaluated for stability during continuous operation.

Possible measurements include:

Processing failures
Service crashes
Lost events
Duplicate events
Failed actions
Database errors
Container control failures

Longer-running experiments can be used to identify reliability problems that may not appear during short tests.

3.9 Resource Usage

The resource overhead of DeceptionX can be evaluated using:

CPU usage
Memory usage
Disk usage
Docker container resource usage

Measurements should be collected under defined workloads so that results can be compared between experiments.

4. Test Scenarios

Evaluation should use repeatable scenarios rather than isolated demonstrations.

Scenario A — SSH Activity
Kali / authorized test system
          |
          v
    Cowrie SSH honeypot
          |
          v
       Telemetry
          |
          v
      Perception
          |
          v
       Decision
          |
          v
        potctl

Measure:

Event detection
Event normalization
Decision generation
Response
Audit record
Scenario B — HTTP Activity

Generate authorized HTTP activity against the HTTP decoy.

Verify that relevant telemetry is:

Generated.
Observed by the perception layer.
Normalized correctly.
Available to the decision layer.
Associated with the expected response.
Scenario C — Repeated Activity

Generate repeated activity from the same source.

The purpose is to evaluate whether repeated events are handled consistently and whether duplicate log processing is avoided.

Scenario D — Invalid Decision

Provide an intentionally invalid decision to the decision model.

Expected behavior:

Invalid decision
       |
       v
Validation failure
       |
       v
No enforcement action

The invalid decision should not be allowed to reach the enforcement layer.

5. End-to-End Evaluation

Once the individual components are stable, evaluate the complete pipeline:

Security Activity
       |
       v
Telemetry
       |
       v
Perception
       |
       v
Decision
       |
       v
potctl
       |
       v
Honeypot Reconfiguration
       |
       v
Audit Record

The end-to-end experiment should record timestamps at important stages.

This allows the total response path to be analyzed rather than measuring only individual components.

6. Reproducibility

Each evaluation should document:

Date of experiment
Environment
Software versions
Configuration
Test scenario
Input activity
Expected result
Actual result
Metrics collected
Observed limitations

Where possible, experiments should use repeatable inputs and configurations.

7. Results

Experimental results will be added here as DeceptionX is tested.

Results should distinguish between:

Measured results
Expected behavior
Qualitative observations
Known limitations

No performance metric should be presented as measured until it has been experimentally collected.

8. Limitations

DeceptionX is currently an experimental project.

Evaluation results may be affected by:

Lab hardware
Network configuration
Docker performance
Telemetry generation rate
Honeypot configuration
IDS configuration
Test workload
Agent configuration

Results from the isolated development environment should not automatically be interpreted as production performance.

9. Future Evaluation Areas

Future experiments may evaluate:

Adaptive deception effectiveness
MITRE ATT&CK technique coverage
Threat-intelligence integration
Agent decision quality
Honeypot engagement
Anti-fingerprinting behavior
Long-running system stability
Comparative deception strategies

### Why this version is useful

Notice what we're **not** saying:

> "DeceptionX detects attacks in 50 ms."

We haven't measured that yet.

Instead we're saying:

> **"Here's exactly how we're going to measure detection latency."**

That's much stronger from a research/recruiter perspective because later you can replace the empty results with **your actual Kali → Suricata → perception → agent → potctl measurements**.

---

### One small correction

I deliberately wrote:

```text
DeceptionX agent / decision layer

rather than claiming that the full LLM-driven autonomous pipeline is already complete. Your current implementation has the structured decision model, while the larger agent/reasoning pipeline is still being developed.