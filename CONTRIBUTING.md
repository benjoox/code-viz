# Contributing

Thanks for helping make code and process maps easier to trust and understand.
Bug fixes, clearer instructions, accessibility improvements and small examples are welcome.
Open an issue before starting a new skill, changing the schema or redesigning the viewer.

## Local setup

Use a supported Node.js LTS release (22 or 24). The builder has no runtime dependencies.

```sh
git clone https://github.com/benjoox/code-viz.git
cd code-viz
git switch -c fix/describe-the-change
npm run check
npm run demo
```

Open `docs/demo/index.html` in a browser. Check play/pause, next/previous, scenario
selection, node selection, drill-down/back, zoom, and a narrow viewport when changing the viewer.
Commit the rebuilt demo when changing its model, source excerpts, template or icons.

## Branches and pull requests

- `main` is the release branch. Make changes through a pull request from a short-lived
  `fix/`, `feat/`, `docs/` or `chore/` branch; fork first if you are not a collaborator.
- Keep a PR focused. Explain the problem, the resulting behavior and how you verified it.
- Use descriptive titles such as `fix: reject invalid excerpt ranges`. PRs are squash merged;
  individual commit messages need only be clear. Merged branches are deleted.
- CI must pass and review conversations must be resolved. Another maintainer's approval
  becomes required when the project has a second maintainer; a sole maintainer cannot approve their own PR.
- Add regression tests for behavior changes, especially validation, escaping, redaction and
  file boundaries. Documentation-only edits do not need artificial tests.
- For agent instruction changes, record the agent/version, sanitized prompt, observed
  output and build result. An agent-generated explanation still needs human verification.

## Project conventions

Use native Node.js modules and keep the generated page usable offline. Avoid adding runtime
dependencies unless an issue establishes the need. Never commit private source, credentials,
customer material or generated maps of private projects. Review source excerpts before sharing.
AI-assisted contributions follow the same review and validation expectations as any other contribution.
Submit only material you have the right to contribute under the [MIT license](LICENSE),
and preserve attribution and license notices for third-party material.

See [security reporting](SECURITY.md), [support](SUPPORT.md), and the
[code of conduct](CODE_OF_CONDUCT.md). Maintainers may decline changes outside the project's scope.
