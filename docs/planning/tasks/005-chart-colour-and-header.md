# CV-005: Clarify chart colours and emphasise the page header

Status: Open
Backlog: [CV-005](../../backlog.jsonld)
Blocks: none

## Problem

The viewer's colour carries meaning on the chart, but several pairs cannot be told
apart and one kind has no colour at all. The page header is also plain text on the
page background, so the first thing a reader sees is not the thing being mapped.

Measured on [template.html](../../../skills/flow-map/assets/template.html) before the
change:

| Pair | Result |
| --- | --- |
| `--c-doc` | Never defined, so active doc nodes fill black |
| Edge wire and node outline against the lane | 1.2:1 light, 1.35:1 dark (3:1 minimum) |
| Inactive node sub-label and label against the lane | 1.8:1 and 2.5:1 light |
| `--c-data` and `--question` | 0.0 apart, the same hex in both themes |
| `--c-user` and `--risk` | 1.4 apart in light, the same hex in dark |
| `--c-api` and `--smell` | 4.3 apart in light, the same hex in dark |
| `--c-queue` and `--c-ai` | 6.6 apart in light, 3.8 in dark |
| `--c-ui` and `--c-api` | 8.6 apart in dark, 0.5 under deuteranopia |

Distances are OKLab Delta E x100, the data-viz validator's unit. Its floor is 15 under
normal vision and 8 under protanopia and deuteranopia.

## Subtask 1: chart colour

- Define the missing doc colour and map `file`, `doc` and `folder` to it.
- Draw wires and outlines at 3:1 or more against their lane, and keep inactive node
  text at 4.5:1 or more.
- Give each kind family a distinct hue chosen with the data-viz palette validator,
  separate from the four severity colours, in light and dark.

## Subtask 2: header emphasis

- Give the title block a stronger weight and a clear boundary from the controls
  below it, with no new content.

## Acceptance

- No node renders black in either theme.
- The contrast pairs above meet their minimums in light and dark, measured again and
  recorded in the backlog entry.
- No two kind or severity colours are indistinguishable under normal vision or
  protanopia and deuteranopia.
- The header reads as the first level of the page in light, dark and a 390px viewport.
- `npm run check` passes and `docs/demo/index.html` is rebuilt.
