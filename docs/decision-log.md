# Decision log

## 2026-10-03 — Adopt a repository-local documentation and backlog system

Use `docs/` for code-viz roadmap, decisions, architecture, plans and tasks, with
`docs/backlog.jsonld` as the canonical backlog and stable `CV-###` ticket IDs.
The [documentation guide](README.md) defines placement and lifecycle.

Adapt the existing `doc-this` and `ticket-triage` maintenance workflows to this
repository, keeping one skill source under `.agents/skills/` with Claude Code links.
This gives future maintainers the same process without importing monorepo-specific
app names, paths or policies into the public flow-map skill.

The Codex questions integration is tracked as a proposal in
[its plan](planning/flow-map-codex-questions-plan.md). Its transport and existing-session
compatibility have not been accepted as verified architecture.
