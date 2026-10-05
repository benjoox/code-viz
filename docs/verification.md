# Launch verification

Checked on 2026-10-05. This records observed results, not a guarantee of every agent's behavior.

| Area | Evidence |
| --- | --- |
| Builder | 31 regression tests pass on macOS arm64, Node.js 22.17.0. |
| Claude Code plugin | Claude Code 2.1.289 validates both manifests and installs/enables version 0.1.0 from a local marketplace using an isolated configuration directory. |
| Skills installer | `skills` 1.7.0 installs this local checkout into a temporary project for Claude Code, Codex, Cursor and Gemini CLI. It warns that Node.js 22.20.0 or newer is required; use an up-to-date LTS version. |
| Viewer | Chromium browser check passes playback, next/previous, scenarios, drill-down/back, node selection, zoom/fit, details toggle, reduced-motion default, and 390px mobile width. No JavaScript errors or external network requests. |
| Secret scan | Gitleaks 8.30.1 scans all five commits reachable from local refs, plus the working tree, with no findings. GitHub's secret scanning alert list is empty. Scans cannot prove the absence of all secrets. |
| CI | [Launch CI](https://github.com/benjoox/code-viz/actions/runs/37296775973) passes all six combinations: Node.js 22 and 24 on Ubuntu, macOS and Windows, including deterministic demo regeneration. |

End-to-end map generation through each agent has not been exercised in this launch check.
An installed skill is not evidence that every agent follows its instructions identically.
The manual installation route copies the complete `skills/flow-map` directory; all scripts,
reference documents and assets must remain together.

## Reproduce core checks

```sh
npm run check
npm run demo
git diff --exit-code -- docs/demo/index.html
```

Open `docs/demo/index.html` offline and exercise the controls described above. Keep the
generated page and the example's source ranges in sync when changing the builder.

## Remaining launch assets

The supplied 16:9 video and its 0:02 thumbnail are attached to v0.1.0 and linked from the
README through a watch page. File metadata confirms 1920 × 1080 at 60 fps, 79.168 seconds,
H.264 video and AAC audio. The second aspect ratio and caption file remain outstanding;
caption accuracy has not been verified. Icon provenance has been requested from the author. A social preview PNG
is provided at `docs/social-preview.png`; upload it under repository Settings → General →
Social preview. The LinkedIn copy is a draft in `docs/linkedin-launch.md` and has not been posted.
