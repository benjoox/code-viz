# Security policy

## Reporting a vulnerability

Use [GitHub's private vulnerability report form](https://github.com/benjoox/code-viz/security/advisories/new).
Include the affected version, a minimal sanitized reproduction, expected behavior and impact.
Do not include real credentials or proprietary source. Do not open a public issue for an
unpatched vulnerability. If the form is unavailable, wait for a private reporting route
rather than posting sensitive details publicly.

This is a small, volunteer-maintained project. Reports are reviewed as capacity permits;
there is no guaranteed response or fix time. Security fixes target the latest release.
Older versions are not maintained separately. Update to the latest release before reproducing a report.

## What the tool does and does not protect

- The builder reads the referenced project files and embeds excerpts in an HTML file.
  Anyone receiving that file can read the embedded data, including content hidden by the UI.
- Real-path checks reject file and symlink references outside `--root` before reading them.
  This is not an operating-system sandbox; use a trusted local checkout, and do not build
  against a directory another process can maliciously modify during the build.
- Redaction catches some common secret formats. It does not guarantee removal of secrets,
  personal data, proprietary logic or sensitive filenames. Inspect the model and generated
  HTML before sharing. Rotate any credential that has been disclosed.
- The generated viewer has no external fonts, scripts, analytics or network dependencies.
  The agent used to create the model may send project content to its provider according
  to that agent's settings; the builder does not control that behavior.
- A valid file and line range proves that text exists, not that the agent's explanation
  or security finding is correct. Review those claims yourself.
