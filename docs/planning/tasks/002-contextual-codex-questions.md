# CV-002 — Ask questions in a dedicated map conversation

Status: Open; depends on CV-001
Plan: [Ask Codex from a flow map](../flow-map-codex-questions-plan.md)
Backlog: [CV-002](../../backlog.jsonld)
Blocks: CV-003

## Work

- Implement the local service using CV-001's verified connection contract.
- Add a question interface associated with the selected node, step or issue and show
  the target repository and dedicated conversation before explicit submission.
- Send relevant map context and project-relative source references with the question;
  identify excerpts as snapshots and keep credentials out of the artifact.
- Stream answers and tool status, forward approvals, and support follow-ups with the
  same thread identity across reload/restart where verified by CV-001.
- Provide distinct disconnected, waiting, running, interrupted, denied, failed and
  completed states, with a recovery action that does not silently duplicate a turn.

## Acceptance

Demonstrate selected-node context reaching the intended thread, a streamed answer,
a follow-up after reload, explicit approval/denial and cancellation behavior, and
unavailable-service recovery. Test the connection boundary with untrusted origins
and workspace/path inputs. Rebuild and exercise the original standalone example with
no service running. Add setup/operation documentation for the verified runtime.
