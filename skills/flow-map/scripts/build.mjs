#!/usr/bin/env node
// Builds one self-contained flow-map page from flow.json. Every excerpt is read from disk here,
// so the page can only show code and doc lines that exist.
import { readFileSync, writeFileSync, existsSync, statSync, realpathSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const USAGE = 'Usage: node build.mjs <flow.json> <out.html> [--root <repo-root>]';
const MAX_EXCERPT = 40;
const KINDS = new Set(['user', 'ui', 'page', 'component', 'hook', 'api', 'route', 'service', 'function', 'job', 'event', 'auth', 'state', 'external', 'ai', 'db', 'table', 'cache', 'bucket', 'queue', 'search', 'vector', 'file', 'doc', 'folder']);
const SEVERITIES = new Set(['bug', 'risk', 'smell', 'question']);
const ROLES = new Set(['reads', 'writes', 'calls', 'defines']);
const SECRETS = [
  [/((?:api[_-]?key|secret|token|password|passwd|private[_-]?key|service[_-]?role)[\w-]*["']?\s*[:=]\s*)(["']?)[^"'\s,;]{6,}\2/gi, '$1[redacted]'],
  [/\b((?:Bearer|Basic)\s+)[\w.~+/=-]{8,}/g, '$1[redacted]'],
  [/([?&](?:key|sig|signature|access_token)=)[^&#\s"']{6,}/gi, '$1[redacted]'],
  [/\b(?:sk|pk|rk)[-_][\w-]{16,}|\bgh[pousr]_\w{20,}|\bgithub_pat_\w{20,}|\bAIza[\w-]{30,}|\bxox[abprs]-[\w-]{10,}|\bAKIA[0-9A-Z]{16}\b|\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]{8,}/g, '[redacted]'],
];
const redact = line => SECRETS.reduce((l, [re, to]) => l.replace(re, to), line);

const args = process.argv.slice(2);
const rootIx = args.indexOf('--root');
if (rootIx >= 0 && !args[rootIx + 1]) { console.error(USAGE); process.exit(2); }
const root = resolve(rootIx >= 0 ? args[rootIx + 1] : process.cwd());
const [flowPath, outPath] = rootIx >= 0 ? args.filter((_, i) => i !== rootIx && i !== rootIx + 1) : args;
if (!flowPath || !outPath) { console.error(USAGE); process.exit(2); }

const here = dirname(fileURLToPath(import.meta.url));
let flow;
try { flow = JSON.parse(readFileSync(flowPath, 'utf8')); }
catch (e) { console.error(`flow-map: cannot read ${flowPath}: ${e.message}`); process.exit(1); }
const errors = [];
const fail = msg => errors.push(msg);
const fileCache = new Map();

function readLines(path) {
  if (fileCache.has(path)) return fileCache.get(path);
  const abs = resolve(root, path);
  const lines = existsSync(abs) && statSync(abs).isFile() ? readFileSync(abs, 'utf8').split('\n') : null;
  fileCache.set(path, lines);
  return lines;
}
/** Resolves symlinks on both sides, so a link inside the project cannot reach outside it. */
function inRoot(path) {
  const rel = relative(realpathSync(root), realpathSync(resolve(root, path)));
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}
function excerpt(where, path, lines) {
  if (path.endsWith('/')) {
    if (!existsSync(resolve(root, path))) fail(`${where}: folder ${path} does not exist`);
    else if (!inRoot(path)) fail(`${where}: ${path} is outside ${root}`);
    if (lines) fail(`${where}: a folder takes no line range`);
    return undefined;
  }
  const all = readLines(path);
  if (!all) { fail(`${where}: file ${path} does not exist under ${root}`); return undefined; }
  if (!inRoot(path)) { fail(`${where}: ${path} is outside ${root}`); return undefined; }
  if (!lines) return undefined;
  const [a, b] = lines;
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a) { fail(`${where}: bad line range ${JSON.stringify(lines)}`); return undefined; }
  if (b > all.length) { fail(`${where}: ${path} has ${all.length} lines, range ends at ${b}`); return undefined; }
  if (b - a + 1 > MAX_EXCERPT) { fail(`${where}: excerpt of ${b - a + 1} lines exceeds ${MAX_EXCERPT}; narrow it`); return undefined; }
  return all.slice(a - 1, b).map(redact);
}

if (typeof flow.title !== 'string' || !flow.title) fail('title is required');
if (!flow.views || typeof flow.views !== 'object') fail('views is required');
if (!flow.views?.[flow.root]) fail(`root "${flow.root}" is not a view`);
flow.issues ??= [];

for (const [vid, v] of Object.entries(flow.views ?? {})) {
  const at = `views.${vid}`;
  if (!v.title) fail(`${at}: title is required`);
  const layers = new Set((v.layers ?? []).map(l => l.id));
  if (!layers.size) fail(`${at}: needs at least one layer`);
  const nodes = new Set();
  for (const n of v.nodes ?? []) {
    const w = `${at}.nodes.${n.id}`;
    if (nodes.has(n.id)) fail(`${w}: duplicate id`);
    nodes.add(n.id);
    if (!layers.has(n.layer)) fail(`${w}: unknown layer "${n.layer}"`);
    if (!KINDS.has(n.kind)) fail(`${w}: unknown kind "${n.kind}"`);
    if (n.drill && !flow.views[n.drill]) fail(`${w}: drill target "${n.drill}" is not a view`);
    if (n.file) n.excerpt = excerpt(w, n.file, n.lines);
  }
  const edges = new Set();
  for (const e of v.edges ?? []) {
    const w = `${at}.edges.${e.id}`;
    if (edges.has(e.id)) fail(`${w}: duplicate id`);
    edges.add(e.id);
    if (!nodes.has(e.from)) fail(`${w}: unknown from "${e.from}"`);
    if (!nodes.has(e.to)) fail(`${w}: unknown to "${e.to}"`);
  }
  if (!v.scenarios?.length) fail(`${at}: needs at least one scenario`);
  for (const sc of v.scenarios ?? []) {
    if (!sc.steps?.length) fail(`${at}.scenarios.${sc.id}: needs steps`);
    sc.steps?.forEach((st, i) => {
      const w = `${at}.scenarios.${sc.id}.steps[${i}]`;
      if (!st.say) fail(`${w}: say is required`);
      for (const id of st.nodes ?? []) if (!nodes.has(id)) fail(`${w}: unknown node "${id}"`);
      for (const id of st.edges ?? []) if (!edges.has(id)) fail(`${w}: unknown edge "${id}"`);
      st.nodes ??= [];
      for (const f of st.files ?? []) {
        if (f.role && !ROLES.has(f.role)) fail(`${w}: unknown role "${f.role}"`);
        f.excerpt = excerpt(`${w} ${f.path}`, f.path, f.lines);
      }
    });
  }
  v.nodes ??= []; v.edges ??= [];
}

for (const i of flow.issues) {
  const w = `issues.${i.id}`;
  if (!SEVERITIES.has(i.severity)) fail(`${w}: severity must be one of ${[...SEVERITIES].join(', ')}`);
  const v = flow.views?.[i.view];
  if (!v) { fail(`${w}: unknown view "${i.view}"`); continue; }
  if (!i.node && !i.edge) fail(`${w}: needs a node or an edge`);
  if (i.node && !v.nodes.some(n => n.id === i.node)) fail(`${w}: unknown node "${i.node}"`);
  if (i.edge && !v.edges.some(e => e.id === i.edge)) fail(`${w}: unknown edge "${i.edge}"`);
  if (!i.file) { fail(`${w}: file is required`); continue; }
  const all = readLines(i.file);
  if (!all) { fail(`${w}: file ${i.file} does not exist`); continue; }
  if (!inRoot(i.file)) { fail(`${w}: ${i.file} is outside ${root}`); continue; }
  if (!Number.isInteger(i.line) || i.line < 1 || i.line > all.length) { fail(`${w}: line ${i.line} is outside ${i.file}`); continue; }
  i.from = Math.max(1, i.line - 2);
  i.excerpt = all.slice(i.from - 1, Math.min(all.length, i.line + 2)).map(redact);
}

if (errors.length) {
  console.error(`flow-map: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const template = readFileSync(resolve(here, '../assets/template.html'), 'utf8');
const sprite = readFileSync(resolve(here, '../assets/icons.svg'), 'utf8');
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// Replacer functions keep $' and $& in excerpts literal.
const html = template
  .replace('__TITLE__', () => esc(flow.title))
  .replace('<!--__SPRITE__-->', () => sprite)
  .replace('/*__FLOW_DATA__*/null', () => JSON.stringify(flow).replace(/</g, '\\u003c'));
writeFileSync(outPath, html);

const views = Object.values(flow.views);
const count = sev => flow.issues.filter(i => i.severity === sev).length;
console.log(`flow-map: wrote ${outPath}`);
console.log(`  ${views.length} view(s), ${views.reduce((s, v) => s + v.nodes.length, 0)} nodes, ${views.reduce((s, v) => s + v.scenarios.length, 0)} flows, ${views.reduce((s, v) => s + v.scenarios.reduce((t, sc) => t + sc.steps.length, 0), 0)} steps`);
console.log(`  issues: ${[...SEVERITIES].map(s => `${count(s)} ${s}`).join(', ')}`);
