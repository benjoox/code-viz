# CV-001 — Verify the local Codex connection

Status: Open
Plan: [Ask Codex from a flow map](../flow-map-codex-questions-plan.md)
Backlog: [CV-001](../../backlog.jsonld)
Blocks: CV-002 and CV-003

## Work

- Check the current official App Server contract and installed CLI version.
- Prototype initialization, a dedicated thread, a question and streamed responses
  against a disposable workspace. Exercise persistence and resume after restart.
- Verify authentication, workspace binding, approval requests, denial, cancellation,
  disconnect/reconnect and process cleanup without weakening configured permissions.
- Determine how a browser reaches the local service through an authenticated loopback
  origin; compare stdio and existing-daemon access using supported interfaces.
- Separately investigate whether the current host session is accessible, who owns it
  and how active turns are handled. Record unsupported cases instead of guessing.

## Acceptance

Record reproducible commands, tested versions and evidence for a new thread, resumed
thread, failure/denial handling and cleanup. Record a separate verdict for existing
host-session access. Update the plan with the selected connection contract and link
durable findings from architecture; CV-002 proceeds only after its dependencies work.
