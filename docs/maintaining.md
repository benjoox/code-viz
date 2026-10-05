# Maintaining code-viz

## Change and release workflow

1. Branch from current `main` using `feat/`, `fix/`, `docs/` or `chore/` and open a PR.
2. Run `npm run check` and `npm run demo`. Review changes to agent behavior and generated excerpts.
3. Wait for the `required` CI check, resolve conversations, then squash merge.
4. For a release, update `package.json`, `.claude-plugin/plugin.json` and the marketplace
   entry together in a PR, with changelog and release notes. Use semantic versions;
   during 0.x, minor releases may change the schema, while patches preserve compatibility.
5. After merging and successful CI on `main`, create the tag and GitHub release at that
   exact commit. Attach only reviewed public example artifacts. Never tag an unmerged feature branch.
6. Verify the demo, installation instructions, release link and captions before promoting the release.

## Repository settings

Keep `main` protected by a ruleset: PRs required, `required` GitHub Actions check required,
up-to-date branches required, review conversations resolved, force pushes and deletion blocked.
Use zero required approvals while there is one maintainer; raise to one when another
maintainer can review. Use squash merges and delete merged branches automatically.
Keep secret scanning, push protection and private vulnerability reporting enabled.
Dependabot maintains pinned Actions references monthly. GitHub Pages serves `/docs` from `main`.

## Assets and attribution

The current icon sprite has no upstream attribution metadata. Do not infer provenance
from its appearance: confirm the source with the author before claiming it is original
or copying it into other projects. Preserve any upstream license that applies.
Demo content must reference only public repository source. Keep videos out of git when
large; upload final clips as release assets and link them from the README.
