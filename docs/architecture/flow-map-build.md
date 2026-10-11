# Flow-map build and browser boundaries

Status: Current implementation
Updated: 2026-10-11

## Overview

The agent traces a target repository and writes a `flow.json` model. The Node builder
validates that model, reads the referenced source excerpts and embeds the result into
one HTML file. The browser plays and explores that snapshot.

```mermaid
flowchart LR
  Source[Target repository] --> Trace[Agent traces paths]
  Trace --> Model[flow.json]
  Model --> Build[build.mjs]
  Source --> Build
  Template[HTML template and icon sprite] --> Build
  Build --> HTML[Generated HTML snapshot]
  HTML --> Browser[Play, step, zoom and drill]
```

## Contract and ownership

- The agent owns the trace, descriptions, selected excerpts and reviewed issues.
- [The schema](../../skills/flow-map/references/schema.md) owns the model vocabulary.
- The builder validates model shapes before following references, then checks node/edge
  references, file existence, root containment, line bounds and the maximum 40-line
  excerpt length. Real-path containment is checked before reading source files.
- Source excerpts are read at build time and common secret patterns are redacted.
  That pattern-based redaction is not a guarantee that all sensitive content is removed.
- Excerpts of `.md` and `.markdown` files are parsed after redaction into a small block
  list and embedded beside the lines. The builder overwrites any block list supplied in
  `flow.json`. The template draws blocks from text nodes only, so excerpt text cannot
  become markup. Only `http(s)` links stay links, and images show their alt text.
- The template owns navigation, playback and the source/state/issue panel, and the colour
  tokens. Node kinds map to six hue families plus two neutrals that are kept apart from the
  four reserved severity colours. Wires and node outlines are drawn at 3:1 or more against
  their lane, and inactive nodes keep full-contrast text.
- Excerpts are snapshots. After source changes, update the model's paths, ranges and
  explanation, then rebuild; an existing HTML file does not watch the repository.

## Browser boundary

The current template does not send questions to Codex, read arbitrary local source
files or launch shell commands. It works offline with system fonts and no external
font, script or analytics requests. Map data, application JavaScript and icons are
embedded in the generated artifact.

Connecting a question box to Codex requires additional runtime integration. The
[Codex questions plan](../planning/flow-map-codex-questions-plan.md) describes that
future work; its session-routing behavior is not part of today's contract.

## Key files

| File | Responsibility |
| --- | --- |
| [SKILL.md](../../skills/flow-map/SKILL.md) | Trace, model, review and delivery workflow |
| [build.mjs](../../skills/flow-map/scripts/build.mjs) | Reference validation, excerpt loading and HTML generation |
| [validate.mjs](../../skills/flow-map/scripts/validate.mjs) | Model shape validation before file access |
| [markdown.mjs](../../skills/flow-map/scripts/markdown.mjs) | Markdown excerpt lines to blocks, with link and image policy |
| [template.html](../../skills/flow-map/assets/template.html) | Browser presentation and interaction |
| [schema.md](../../skills/flow-map/references/schema.md) | Authoring contract |
| [example.flow.json](../../skills/flow-map/assets/example.flow.json) | Runnable builder example |
