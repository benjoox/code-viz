# Documentation guide

This is the documentation and backlog system for maintaining code-viz. Start with
[the roadmap](roadmap.md), [the backlog](backlog.jsonld) and
[the decision log](decision-log.md).

## Placement

| Location | Owns |
| --- | --- |
| `roadmap.md` | Direction, outcomes and links to tracked initiatives |
| `decision-log.md` | Dated choices and their rationale |
| `backlog.jsonld` | Canonical ticket IDs, priorities, dependencies and status |
| `architecture/` | Verified contracts and current system behavior |
| `playbooks/guide-*.md` | Repeatable operational procedures, created when needed |
| `planning/*-plan.md` | Proposed or active initiatives |
| `planning/tasks/NNN-*.md` | Ordered implementation work linked to backlog IDs |
| `templates/backlog.jsonld` | Reusable example of the backlog entry shape |

Code-viz is a skill/plugin repository, so it has no app business-docs tree. Docs for
the code being mapped remain in that project's repository. Skill input schemas and
usage instructions remain in `skills/flow-map/`; link to them instead of copying them.

## Current references

- [Flow-map build and browser boundaries](architecture/flow-map-build.md).
- [Contextual Codex questions plan](planning/flow-map-codex-questions-plan.md).
- [CV-001: verify transport and thread access](planning/tasks/001-codex-connection-spike.md).
- [CV-002: dedicated map conversation](planning/tasks/002-contextual-codex-questions.md).
- [CV-003: existing-thread routing](planning/tasks/003-existing-thread-routing.md).
- [CV-004: Markdown excerpts as formatted text](planning/tasks/004-markdown-excerpts.md).
- [CV-005: chart colours and page header](planning/tasks/005-chart-colour-and-header.md).

## Backlog contract

The `.jsonld` file follows the source repository's naming convention: its contents
are an ordinary JSON array of ticket objects. No JSON-LD processor is required.

Every object has exactly these fields:

| Field | Contract |
| --- | --- |
| `id` | Unique, stable `CV-###` identifier; allocate the next number |
| `title` | Short imperative title |
| `type` | `feature`, `chore`, `fix`, `refactor`, or `docs` |
| `status` | `open`, `in-progress`, or `done` |
| `priority` | `high`, `medium`, or `low` |
| `blocks` | IDs of downstream tickets this ticket prevents from proceeding |
| `area` | Short area label; reuse existing labels when applicable |
| `description` | Problem, scope, evidence, acceptance criteria and relevant doc paths |

Keep dependencies acyclic and within the live backlog. Dependency-blocked tickets
remain `open`; explain readiness in their descriptions. Do not delete completed
entries merely to clean up the list, and never reuse an ID.

## Lifecycle and maintenance skills

1. Capture a proposal in the backlog and link it from the roadmap.
2. Add a plan and tasks when needed; tickets stay `open` until implementation starts.
3. Verify acceptance before closing tickets, then update the roadmap.
4. Distill finished plans into permanent contracts, decisions or playbooks and retire
   obsolete planning docs after repairing links. Git and the backlog preserve history.

Repository-local skills implement this workflow:

- [`doc-this`](../.agents/skills/doc-this/SKILL.md): `/doc-this` in Claude Code or
  `$doc-this` in Codex.
- [`ticket-triage`](../.agents/skills/ticket-triage/SKILL.md): `/ticket-triage` in Claude
  Code or `$ticket-triage` in Codex.

Their canonical files are in `.agents/skills/`; `.claude/skills/` links to them.
They are maintainer workflows, separate from the public `skills/flow-map` plugin.

Before a documentation PR, parse edited JSON, verify ticket fields and dependency
references, and check internal Markdown links. Mark unverified behavior explicitly.
