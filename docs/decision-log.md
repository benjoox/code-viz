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

## 2026-10-11: Parse Markdown at build time and group node colours into validated families

Markdown excerpts are parsed by the builder into a block list and the template draws it
from text nodes. The viewer gains no HTML sink and no runtime dependency, and the parser,
link policy and redaction order can be tested without a browser. Only `http(s)` links stay
links, because a snapshot has no place for a relative link to resolve.

Node kinds share six hue families plus two neutrals instead of eleven near-identical hues.
The six hues pass the data-viz palette checks all-pairs in light and dark and sit at
least 9 from the reserved severity colours under normal vision. Icons and labels tell kinds
apart inside a family. More families cannot hold the separation floors beside the four
severity colours.
