---
name: ticket-triage
description: Log, classify, prioritize, update and reconcile code-viz tickets in docs/backlog.jsonld, including their roadmap, plans and task documents.
---

# Ticket triage

Read [the documentation guide](../../../docs/README.md), then
[the backlog](../../../docs/backlog.jsonld). The guide owns the field definitions;
[the template](../../../docs/templates/backlog.jsonld) is an example, not a live backlog.

Follow the user's requested operation directly when clear. Ask for missing information
only when it changes the ticket's scope or destination.

- Search the backlog, roadmap and planning docs for duplicate or related work.
- Assign the next unused `CV-###` ID; preserve IDs and history when updating a ticket.
- Use the existing fields only: `id`, `title`, `type`, `status`, `priority`, `blocks`,
  `area`, `description`. Put evidence, acceptance criteria and doc paths in `description`.
- `blocks` lists downstream tickets that cannot proceed until this ticket is done.
  Do not reverse that relationship or add a new `blocked` status.
- Use `high` for urgent failures or essential unblockers, `medium` for meaningful
  planned work and `low` for optional polish. A proposal is normally `open`.
- Mark `in-progress` only when implementation starts. Mark `done` after acceptance is
  verified, recording concise evidence; a planning PR alone does not complete a feature.
- Broad work gets a plan under `docs/planning/`; sequential work gets numbered task
  docs. Link them from the backlog and roadmap without duplicating the full plan.
- Do not reorder unrelated entries or silently change their priority.

After edits, parse the JSON, check required fields and allowed values, ensure unique
IDs and valid acyclic `blocks` references, and verify linked docs exist. Report changed
tickets, their status, and the next actionable step.
