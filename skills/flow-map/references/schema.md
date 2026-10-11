# flow.json schema

The build rejects unknown kinds, severities, roles and ids, missing files, line ranges
outside a file and excerpts over 40 lines. Paths are relative to `--root` and must stay inside it.

```jsonc
{
  "title": "flow-map build",                   // page name: the system or flow, 2 to 4 words
  "subtitle": "How build.mjs turns flow.json into one page.",
  "root": "main",                              // first view shown
  "views": {
    "main": {
      "title": "build.mjs",                    // breadcrumb label
      "layers": [                              // top to bottom, from the person to storage
        { "id": "caller", "label": "Caller" },
        { "id": "cli", "label": "build.mjs" }
      ],
      "nodes": [
        {
          "id": "entry", "label": "Entry", "kind": "function", "layer": "cli",
          "sub": "CLI entry",                  // optional second line; defaults to the file name
          "file": "scripts/build.mjs", "lines": [21, 35],
          "note": "Takes two paths and an optional --root, then loads flow.json.",
          "drill": "excerpt"                   // optional: a view that opens from this node
        },
        { "id": "validate", "label": "Flow checks", "kind": "function", "layer": "cli",
          "file": "scripts/build.mjs", "lines": [74, 112] }
      ],
      "edges": [
        { "id": "run", "from": "agent", "to": "entry", "label": "node build.mjs", "data": "flow, out, --root" }
      ],
      "scenarios": [
        {
          "id": "build", "title": "Build a page", "kind": "data",   // user | data | system | failure
          "steps": [
            {
              "say": "The agent runs build.mjs on its flow.json.",           // one plain sentence
              "nodes": ["agent", "entry"], "edges": ["run"],
              "state": { "root": "--root or cwd" },                          // optional values that change
              "files": [
                { "path": "scripts/build.mjs", "lines": [21, 27], "role": "reads",
                  "note": "Paths in flow.json resolve against this root." }
              ]
            }
          ]
        }
      ]
    }
  },
  "issues": [
    {
      "id": "file-without-path", "severity": "risk",  // bug | risk | smell | question
      "view": "main", "node": "validate",       // or "edge": "<edge id>"
      "file": "scripts/build.mjs", "line": 108,
      "title": "A step file without a path crashes the build",
      "detail": "excerpt() calls path.endsWith on undefined, so the build exits with a TypeError.",
      "fix": "Fail the step when a file entry has no path."
    }
  ]
}
```

## Vocabulary

| Field | Values |
|---|---|
| `kind` | people and surfaces: `user`, `ui`, `page`, `component`, `hook`; server: `api`, `route`, `service`, `function`, `job`, `event`, `auth`, `state`, `ai`, `external`; data: `db`, `table`, `cache`, `bucket`, `queue`, `search`, `vector`; documents: `file`, `doc`, `folder` |
| `role` | `reads`, `writes`, `calls`, `defines` |
| `severity` | `bug` (wrong behavior you can show), `risk` (breaks under a reachable condition), `smell` (works, costs later), `question` (could not verify; say what would settle it) |
| scenario `kind` | `user`, `data`, `system`, `failure` |

The page colours kinds by family and tells kinds apart inside a family by icon: people and
surfaces (`user`, `ui`, `page`, `component`, `hook`), server interface (`api`, `route`, `auth`),
logic (`service`, `function`, `state`), async (`job`, `event`, `queue`), `ai`, `external`, data
(`db`, `table`, `cache`, `bucket`, `search`, `vector`) and documents (`file`, `doc`, `folder`).
Severity colours are reserved for issues.

Files are colour-coded by extension on the page: code, doc, data, media, slides, config
and folders (a path ending in `/`). Excerpts of `.md` files are drawn as formatted Markdown
with their file line numbers; other files stay numbered code.
