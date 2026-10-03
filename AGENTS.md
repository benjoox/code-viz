# Repository instructions

`code-viz` ships the public `flow-map` skill under `skills/`. Repository maintenance
skills live under `.agents/skills/`, with `.claude/skills/` links to the same sources.

## Documentation and backlog

- Follow [the documentation guide](docs/README.md) for placement and lifecycle.
- Use `doc-this` to capture findings, decisions and plans. Search existing docs first.
- Use `ticket-triage` for backlog work. `docs/backlog.jsonld` is the canonical backlog;
  IDs use `CV-###`, and its schema is documented in `docs/README.md`.
- Keep the roadmap, plan, tasks and backlog linked. Record proposed integrations as
  proposed until their behavior has been verified.
- Documentation work does not by itself authorize implementing a planned feature.

## Validation and contributions

- Use Conventional Commits, for example `docs(flow-map): plan contextual Codex questions`.
- Validate edited JSON, internal Markdown links and backlog dependencies.
- For build or template changes, run the bundled example into a temporary directory:
  `node skills/flow-map/scripts/build.mjs skills/flow-map/assets/example.flow.json /tmp/code-viz-example.html --root skills/flow-map`.
- Preserve the builder's root confinement, excerpt limits and redaction behavior.
- Keep code excerpts tied to real files. Generated HTML is a snapshot and must be
  rebuilt when the mapped source or line ranges change.
