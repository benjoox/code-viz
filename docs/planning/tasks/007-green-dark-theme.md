# CV-007: Use a deep green dark theme and remove the header accent bar

Status: Done 2026-10-11
Backlog: [CV-007](../../backlog.jsonld)
Blocks: none

## Problem

The dark theme is a blue-black. The reader wants it deep green. The header also carries
an accent bar at its left edge, added under CV-005, that the reader asked to remove.

## Subtask 1: deep green dark neutrals

- Replace the page, panel, lane, border and text neutrals in both dark token sets with a
  green ramp.
- Keep text at 4.5:1 or more, wires and outlines at 3:1 or more, and every kind colour at
  3:1 or more against its lane. Leave the kind and severity hues as validated.
- Draw borders darker, about 1.3:1 against the panel, and draw the disclosure arrows and
  chart arrowheads white in dark. Light keeps its current arrows.

## Subtask 2: remove the header accent bar

- Delete the left border and its padding. The heavier title and the accent eyebrow carry
  the header.

## Acceptance

- The dark page, panels and chart lanes read as green, both with the OS set to dark and
  after the toggle.
- The contrast targets above hold, measured and recorded in the backlog entry.
- The header has no bar in light or dark.
- `npm run check` passes and `docs/demo/index.html` is rebuilt.
