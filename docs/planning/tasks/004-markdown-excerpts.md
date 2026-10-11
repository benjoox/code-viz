# CV-004: Render Markdown excerpts as formatted text

Status: Done 2026-10-11
Backlog: [CV-004](../../backlog.jsonld)
Blocks: none

## Problem

A flow map of a document shows its sections as excerpts. Today every excerpt is drawn
as raw monospaced source. Headings keep their `#` marks, tables show pipes, and long
lines run past the pane, so the map explains a doc in a form the doc was never meant
to be read in.

## Subtask 1: draw `.md` excerpts as formatted text

- Parse the redacted lines of a `.md` or `.markdown` excerpt in the builder
  ([markdown.mjs](../../../skills/flow-map/scripts/markdown.mjs)) into blocks:
  headings, paragraphs, lists, tables, quotes, rules and fenced code, with inline
  code, emphasis and `http(s)` links.
- Draw the blocks in the template from text nodes only, with the file line number of
  each block in the gutter and the issue line highlighted.
- Leave every other file type as the existing numbered code view.
- Tell the agent to start and end Markdown ranges on block boundaries.

## Acceptance

- Node, step-file and issue excerpts of `.md` files render as formatted text; a table
  renders as a table and a fenced block as code.
- Raw HTML, `<script>`, images and `javascript:` or relative links in the source stay
  inert text, and the page makes no network request.
- Secrets are redacted before parsing, and a `doc` supplied in `flow.json` is ignored.
- `npm run check` passes and `docs/demo/index.html` is rebuilt.
