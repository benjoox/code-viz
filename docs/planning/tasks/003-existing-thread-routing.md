# CV-003 — Route questions to an existing Codex thread

Status: Open; depends on CV-001 and CV-002
Plan: [Ask Codex from a flow map](../flow-map-codex-questions-plan.md)
Backlog: [CV-003](../../backlog.jsonld)

## Work

- Use CV-001's compatibility findings to expose only supported existing destinations.
- Show the destination thread, owning runtime and workspace for explicit selection.
- Resume or attach through supported interfaces and correlate responses to the
  selected thread and submitted question.
- Handle active turns using verified steering or queuing behavior, including stale
  thread IDs, inaccessible runtimes and disconnections.
- If a host conversation cannot be reached, show that limitation and offer the
  dedicated map conversation explicitly; do not silently switch, fork or inject input
  by UI automation.

## Acceptance

Prove that a question and reply land in the selected existing thread, preserving
its history and permissions. Verify busy-thread and inaccessible-thread behavior
and make any fallback explicit. If access is unsupported, record that evidence and
leave the delivery ticket open unless the user explicitly revises its scope.
