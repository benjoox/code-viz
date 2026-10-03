---
name: doc-this
description: Capture a code-viz finding, technique, decision or proposed feature in this repository's documentation system. Use when asked to document a discussion or preserve engineering knowledge.
---

# Document this

Use [the documentation guide](../../../docs/README.md) as the placement and lifecycle
authority. This skill maintains code-viz itself; documentation for a project being
mapped belongs in that project's own documentation tree.

1. Identify the durable result from the current discussion and inspected source.
   Separate verified behavior from proposals and unresolved questions.
2. Search `docs/`, `README.md` and related skill references before creating a file.
   Follow their cross-links and extend an existing owner when it covers the subject.
3. Choose the destination:
   - A decision and its rationale: `docs/decision-log.md`.
   - A reusable procedure: `docs/playbooks/guide-*.md`.
   - Verified architecture: `docs/architecture/{arch,flow,system,tech}-*.md`.
   - Future work: `docs/planning/*-plan.md`, linked to a `CV-###` backlog entry;
     add numbered task docs when implementation needs a sequence.
4. Match neighboring docs and keep each document focused, normally under 150 lines.
   Prefer contracts, ownership and useful evidence over a transcript of the discussion.
5. For a completed plan, distill permanent contracts into architecture, decisions into
   the decision log, and procedures into playbooks. Retire obsolete planning/task docs
   after updating inbound links; keep historical evidence in the ticket and Git history.
6. Keep the roadmap and backlog consistent with the actual state. Planning a feature
   does not make it implemented or close its ticket.
7. Validate internal links and changed JSON. Report the paths and what each doc owns.

Preserve existing task authorization. Recording a proposal does not authorize runtime
changes, publication or a new external integration.
