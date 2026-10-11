# Changelog

## Unreleased

- Markdown excerpts render as formatted text with their file line numbers, and node and file
  notes render as Markdown.
- Doc nodes no longer draw black. Node kinds use six validated hue families, wires and outlines
  meet 3:1 contrast, and inactive nodes keep readable text in light and dark.
- The page header has a larger, heavier title and an accent rule.

## 0.1.0

First public release of code-viz with the `flow-map` skill.

- Interactive layered maps with playback, scenarios, drill-down, source excerpts and issues.
- A dependency-free Node.js builder and offline HTML viewer.
- Shape and reference validation, confined file access, bounded excerpts and best-effort redaction.
- Regression tests, cross-platform CI, contribution guidelines and private security reporting.

This is an early release. Agent explanations require review, and redaction is not a guarantee
that a generated map is safe to share. See [SECURITY.md](SECURITY.md).
