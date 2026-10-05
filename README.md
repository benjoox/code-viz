# code-viz

[![CI](https://github.com/benjoox/code-viz/actions/workflows/ci.yml/badge.svg)](https://github.com/benjoox/code-viz/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Agent skills that turn code, docs and user journeys into interactive visual maps you can
play, step through and review.

https://github.com/user-attachments/assets/998a349b-ba0f-4b73-8268-80597af36301

[Watch with the thumbnail cover](https://benjoox.github.io/code-viz/watch/) · [Download the video](https://github.com/benjoox/code-viz/releases/download/v0.1.0/CodeVizFlowMapOpenSource.mp4) · [Download the thumbnail](docs/video-thumbnail.png)

**[Try the interactive demo](https://benjoox.github.io/code-viz/demo/)** · [Report a bug](https://github.com/benjoox/code-viz/issues/new/choose)

Install → ask your agent to map one workflow → open the generated HTML and step through it.

## Skills

| Skill | What it does |
|---|---|
| [`flow-map`](skills/flow-map/SKILL.md) | Traces how an app, feature, pipeline or documented process flows and builds one interactive HTML page: layered components with typed icons, flows you can play, pause, step, zoom and drill into, the real files and line excerpts at every step, state changes, and reviewed issues pinned to the parts they affect. |

## Install

**Claude Code**

```
/plugin marketplace add benjoox/code-viz
/plugin install code-viz@code-viz
```

**Other agents** (Cursor, Codex, Gemini CLI and others, via [skills](https://github.com/vercel-labs/skills))

```bash
npx skills add benjoox/code-viz
```

**Manual**

```bash
git clone https://github.com/benjoox/code-viz
cp -R code-viz/skills/flow-map ~/.claude/skills/
```

## Use

Ask in plain words from the root of the project you want mapped:

- "Map how checkout works in this repo."
- "Walk me through `src/auth/` as a flow map."
- "Review the upload pipeline and pin the issues on the map."

Or call it directly: `/code-viz:flow-map src/api/checkout`.

The agent traces real entry points, writes a `flow.json` model and builds the page. It
reads your code and writes a model and HTML map to a scratch folder; it does not edit the source being mapped.

## How it stays honest

- The agent writes only the model. The build reads every excerpt from disk, so the page
  can only show lines that exist.
- The build rejects unknown ids, missing files, paths outside the project (symlinks
  included), out-of-range lines and excerpts over 40 lines.
- Excerpts are redacted before they reach the page: secret-looking assignments, Bearer and
  Basic credentials, `key=` query values and common API token shapes.
- Issues carry a file, a line, a one-sentence detail and a one-line fix. Anything the
  agent could not verify is marked as a question.

## Requirements

Use an up-to-date Node.js 22 or 24 LTS release. The builder has no runtime dependencies.
The `skills` installer currently requires Node.js 22.20.0 or newer.
See [verification notes](docs/verification.md) for tested installations and environments.

## Try the example

The bundled example maps the skill's own build script:

```bash
node skills/flow-map/scripts/build.mjs skills/flow-map/assets/example.flow.json \
  example.html --root skills/flow-map
```

Open `example.html` in a browser.

## Privacy and limitations

The generated HTML **contains source excerpts**. Review it before sharing: automatic
redaction is best-effort and cannot guarantee removal of secrets or private information.
The viewer works offline with no external fonts, scripts or analytics. Your agent's data
handling depends on that agent's provider and settings. Valid source lines do not guarantee
that an agent's explanation is correct. See [SECURITY.md](SECURITY.md).

## Contribute and get help

Start with [CONTRIBUTING.md](CONTRIBUTING.md) for setup and PR expectations, or use the
[issue templates](https://github.com/benjoox/code-viz/issues/new/choose) to report a bug or
suggest a feature. Run `npm run check` and `npm run demo` to validate a local checkout.
[Support](SUPPORT.md) is best-effort; please follow the [code of conduct](CODE_OF_CONDUCT.md).

See the [changelog](CHANGELOG.md) and [releases](https://github.com/benjoox/code-viz/releases)
for versioned updates. This is an early project; the schema may evolve before 1.0.

## Development documentation

See the [documentation guide](docs/README.md), [roadmap](docs/roadmap.md),
[backlog](docs/backlog.jsonld) and [decision log](docs/decision-log.md).
The next proposed initiative is [asking Codex questions inside a flow map](docs/planning/flow-map-codex-questions-plan.md).

Repository maintainers can use `/doc-this` and `/ticket-triage` in Claude Code,
or `$doc-this` and `$ticket-triage` in Codex. These repo-local workflows are separate
from the installed public flow-map skill. See [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE)
