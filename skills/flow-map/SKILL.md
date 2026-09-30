---
name: flow-map
description: Map code, a doc or a user journey into one interactive HTML flow map. Layered components with typed icons, flows you can play, pause, step, zoom and drill into, the real files and line excerpts at every step, state changes, and reviewed issues pinned to the parts they affect. Use when asked to visualise, map, explain, walk through or review how an app, feature, pipeline, data or documented process flows.
allowed-tools: [Bash, Read, Write, Artifact]
---

# Flow Map

Produce one private HTML page that shows how something actually works: who acts, which
parts run, what data moves, which files are read or written at each step, and what is
wrong with it. Left pane: the animated flow. Right pane, in step: the files, state and
issues for the current step. The engine, icon sprite and build are in this folder; you
write only `flow.json`.

## 1. Scope

Identify the target (folder, files, doc or described journey) and the question: explain,
onboard or review. Choose one to four flows worth playing: the main user journey, the
main data path, and a failure path when one matters. Ask only when the target is
ambiguous. Read-only: never edit the target unless asked.

## 2. Trace, never infer

Start at real entry points (routes, pages, CLI `main`, handlers, jobs) and follow calls,
imports, queries, writes and events. Every node, edge, file path and line range must come
from something you read. Record `file:line` ranges as you go. For a doc, nodes are its
actors and stages and files are its sections by line range. Name things as the code names
them. When a part cannot be traced, leave it out or raise a `question` issue.

## 3. Model

Write `flow.json` following [the schema](references/schema.md).

- Layers run top to bottom from the person to storage, for example
  User → UI → API → Services → Data → External. Use the right `kind` so each database,
  queue, bucket or model gets its own icon.
- Keep a view to about 14 nodes. Put detail behind a node with `drill` and a second view,
  instead of crowding the first.
- Each step: one plain sentence (`say`), the active nodes and edges, the files it touches
  with `role` and a line range of 40 lines or fewer, and `state` values when something
  meaningful changes (status, counts, auth, cache hit).
- A user flow follows what the person does and sees; a data flow follows one record from
  input to storage and back.

## 4. Review

Unless the request is explain-only, check the traced paths for bugs, reachable failure
conditions, missing error handling, auth or ownership gaps, races, dead paths and contract
mismatches between parts. Record each as an issue on the node or edge it affects, with
`file`, `line`, a one-sentence detail and a one-line fix. Report only what the code shows;
use `question` for anything you could not verify and say what would settle it. No
issues is a valid result.

## 5. Build

Keep work files in the scratchpad (or a temp folder) under `flow-maps/<slug>/`. From the
root of the project being mapped, so file paths in `flow.json` are relative to it:

```bash
node <skill-dir>/scripts/build.mjs <scratch>/flow-maps/<slug>/flow.json \
  <scratch>/flow-maps/<slug>/<slug>.html --root .
```

`<skill-dir>` is the folder that holds this SKILL.md. A worked example that maps this
skill's own build script is [`assets/example.flow.json`](assets/example.flow.json); build
it with `--root <skill-dir>`.

Fix every problem it reports and rebuild. The build reads every excerpt from disk and
redacts obvious secrets, so never paste code into `flow.json`.

## 6. Publish and report

When the Artifact tool is available, publish the HTML with it (private by default, icon
`flow`, a one-sentence description). Otherwise open the file in the default browser
(`open` on macOS, `xdg-open` on Linux, `start` on Windows). Reply with the link or path,
one line on what it covers, and the issues most severe first as
`severity · file:line · title`. Offer fixes only as a separate step.
