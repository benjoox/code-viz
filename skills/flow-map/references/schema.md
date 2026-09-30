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
          "file": "scripts/build.mjs", "lines": [21, 34],
          "note": "Parses arguments and loads flow.json.",
          "drill": "excerpt"                   // optional: a view that opens from this node
        }
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
                { "path": "scripts/build.mjs", "lines": [21, 26], "role": "reads",
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
      "id": "extra-args", "severity": "smell",        // bug | risk | smell | question
      "view": "main", "node": "entry",          // or "edge": "<edge id>"
      "file": "scripts/build.mjs", "line": 25,
      "title": "Extra arguments are ignored silently",
      "detail": "Only the first two positional arguments are read, so a mistyped flag is dropped without a warning.",
      "fix": "Print the usage when more than two positional arguments remain."
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

Files are colour-coded by extension on the page: code, doc, data, media, slides, config
and folders (a path ending in `/`).
