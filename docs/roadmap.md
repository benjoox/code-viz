# Roadmap

Updated: 2026-10-11

## Available

Flow-map traces source into an interactive HTML snapshot with layered nodes, playable
steps, source excerpts and pinned issues. Its builder validates references, confines
excerpts to the project root and redacts common secret patterns. See
[the current architecture](architecture/flow-map-build.md).

## Viewer readability

Mapped Markdown should read as Markdown, and the chart and header should be legible
at a glance in light and dark.

| Ticket | Outcome | State |
| --- | --- | --- |
| CV-004 | Excerpts of `.md` files render as formatted text | Done |
| CV-005 | Chart colours are distinct and the header is emphasised | Done |

The [backlog](backlog.jsonld) owns ticket status and acceptance criteria.

## Next: ask questions inside the map

Let a reader select a node or step, ask a question in the HTML, and receive a Codex
answer grounded in that context and the mapped repository.

| Sequence | Outcome | Ticket | State |
| --- | --- | --- | --- |
| 1 | Verify local transport, authentication, approvals and thread access | CV-001 | Open |
| 2 | Ask and follow up in a dedicated map conversation | CV-002 | Open; depends on CV-001 |
| 3 | Explicitly select a supported existing Codex thread | CV-003 | Open; depends on CV-001 and CV-002 |

The [plan](planning/flow-map-codex-questions-plan.md) proposes an optional local
service connected to Codex App Server. Dedicated conversation first is a proposed
delivery order; forwarding into an already-running host session is unverified.
The [backlog](backlog.jsonld) owns ticket status and acceptance criteria.

This roadmap records future work. The generated HTML currently has no Codex chat
connection or local command execution service.
