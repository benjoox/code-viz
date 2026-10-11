# CV-006: Add a light and dark theme toggle button

Status: Done 2026-10-11
Backlog: [CV-006](../../backlog.jsonld)
Blocks: none

## Problem

The viewer ships a light and a dark token set and picks one from the OS setting. A
reader who wants the other one has no control on the page. They must open DevTools or
edit the HTML.

## Subtask 1: one toggle button in the header

- Add one icon button to the page header that flips between light and dark.
- Start from the OS setting. Keep no third state and store no preference.
- Name the action in the button's accessible name and show the icon of the theme the
  click switches to.
- Keep the icon in step when the OS setting changes before the first click.

## Acceptance

- One button flips the whole page, the chart and details pane included.
- It works with the OS set to light and with it set to dark.
- The accessible name and icon match the action, and the button takes keyboard focus.
- The page gains no dependency and no network request.
- `npm run check` passes and `docs/demo/index.html` is rebuilt.
