import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const build = resolve('skills/flow-map/scripts/build.mjs');
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'code-viz-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const root = join(dir, 'project'); mkdirSync(root);
  writeFileSync(join(root, 'source.txt'), Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join('\n'));
  writeFileSync(join(dir, 'outside.txt'), 'outside project');
  const flow = {
    title: 'Test flow', root: 'main',
    views: { main: { title: 'Main', layers: [{ id: 'one', label: 'One' }],
      nodes: [{ id: 'a', label: 'A', layer: 'one', kind: 'file', file: 'source.txt', lines: [1, 2] }],
      edges: [], scenarios: [{ id: 'run', title: 'Run', steps: [{ say: 'Read A', nodes: ['a'], files: [{ path: 'source.txt', lines: [1, 2] }] }] }] } },
    issues: [],
  };
  const output = join(dir, 'new', 'map.html');
  const run = (value = flow, extra = []) => {
    const input = join(dir, 'flow.json'); writeFileSync(input, JSON.stringify(value));
    return spawnSync(process.execPath, [build, input, output, '--root', root, ...extra], { encoding: 'utf8' });
  };
  return { dir, root, flow, output, run };
}
function reject(t, change, pattern) {
  const f = fixture(t); change(f);
  const result = f.run();
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, pattern);
  assert.doesNotMatch(result.stderr, /TypeError|at file:\/\//);
  assert.equal(existsSync(f.output), false);
}

test('build creates a standalone page with actual excerpts', t => {
  const f = fixture(t); const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  const html = readFileSync(f.output, 'utf8');
  assert.match(html, /line 1/); assert.match(html, /<svg/);
  assert.doesNotMatch(html, /__FLOW_DATA__|__SPRITE__|__TITLE__|fonts.googleapis|fonts.gstatic/);
});
for (const [name, change, pattern] of [
  ['unknown node', f => f.flow.views.main.scenarios[0].steps[0].nodes.push('missing'), /unknown node/],
  ['unknown edge', f => f.flow.views.main.scenarios[0].steps[0].edges = ['missing'], /unknown edge/],
  ['unknown layer', f => f.flow.views.main.nodes[0].layer = 'missing', /unknown layer/],
  ['unknown kind', f => f.flow.views.main.nodes[0].kind = 'missing', /unknown kind/],
  ['unknown drill', f => f.flow.views.main.nodes[0].drill = 'constructor', /not a view/],
  ['unknown root', f => f.flow.root = 'constructor', /not a view/],
  ['duplicate layer', f => f.flow.views.main.layers.push({ id: 'one', label: 'Again' }), /duplicate id/],
  ['duplicate scenario', f => f.flow.views.main.scenarios.push(f.flow.views.main.scenarios[0]), /duplicate id/],
  ['missing file', f => f.flow.views.main.nodes[0].file = 'missing.txt', /does not exist/],
  ['missing path', f => delete f.flow.views.main.scenarios[0].steps[0].files[0].path, /path: expected/],
  ['missing scenario title', f => delete f.flow.views.main.scenarios[0].title, /title: expected/],
  ['bad range shape', f => f.flow.views.main.nodes[0].lines = '1,2', /two integers/],
  ['negative range', f => f.flow.views.main.nodes[0].lines = [-1, 2], /bad line range/],
  ['reversed range', f => f.flow.views.main.nodes[0].lines = [2, 1], /bad line range/],
  ['out of bounds', f => f.flow.views.main.nodes[0].lines = [1, 100], /range ends/],
  ['oversized excerpt', f => f.flow.views.main.nodes[0].lines = [1, 41], /exceeds 40/],
  ['directory traversal', f => f.flow.views.main.nodes[0].file = '../outside.txt', /does not exist|outside/],
  ['absolute escape', f => f.flow.views.main.nodes[0].file = join(f.dir, 'outside.txt'), /does not exist|outside/],
  ['null view', f => f.flow.views.main = null, /expected an object/],
  ['wrong nodes type', f => f.flow.views.main.nodes = {}, /expected an array/],
  ['null step', f => f.flow.views.main.scenarios[0].steps = [null], /expected an object/],
  ['invalid issues', f => f.flow.issues = {}, /expected an array/],
]) test(`rejects ${name}`, t => reject(t, change, pattern));

test('rejects symlink escapes before reading source', t => reject(t, f => {
  symlinkSync(join(f.dir, 'outside.txt'), join(f.root, 'link.txt'));
  f.flow.views.main.nodes[0].file = 'link.txt';
}, /does not exist|outside/));
test('allows symlinks within the root', t => {
  const f = fixture(t); symlinkSync(join(f.root, 'source.txt'), join(f.root, 'link.txt'));
  f.flow.views.main.nodes[0].file = 'link.txt'; assert.equal(f.run().status, 0);
});
test('rejects issue file escape', t => reject(t, f => {
  f.flow.issues = [{ id: 'i', severity: 'risk', view: 'main', node: 'a', file: '../outside.txt', line: 1, title: 'Risk', detail: 'Details', fix: 'Fix' }];
}, /does not exist|outside/));
test('rejects null top-level JSON cleanly', t => {
  const f = fixture(t); const result = f.run(null);
  assert.equal(result.status, 1); assert.match(result.stderr, /expected an object/);
});
test('redacts common secrets in excerpts and model text', t => {
  const f = fixture(t);
  const credential = 'synthetic' + 'Credential123456';
  writeFileSync(join(f.root, 'source.txt'), `password="${credential}"\nAuthorization: Bearer ${credential}`);
  f.flow.subtitle = `token=${credential}`;
  assert.equal(f.run().status, 0);
  const html = readFileSync(f.output, 'utf8');
  assert.doesNotMatch(html, new RegExp(credential)); assert.match(html, /\[redacted\]/);
});
test('ignores supplied excerpts and escapes HTML/script terminators', t => {
  const f = fixture(t);
  f.flow.title = '</title><script>alert(1)</script>';
  f.flow.views.main.nodes[0].excerpt = ['fabricated-excerpt'];
  writeFileSync(join(f.root, 'source.txt'), '</script><script>alert(2)</script>\n$& $\'');
  assert.equal(f.run().status, 0);
  const html = readFileSync(f.output, 'utf8');
  assert.doesNotMatch(html, /fabricated-excerpt|<script>alert/);
  assert.match(html, /\\u003c\/script>/); assert.match(html, /\$& \$'/);
});
test('usage rejects stray arguments', t => {
  const f = fixture(t); assert.equal(f.run(f.flow, ['extra']).status, 2);
});
test('bundled example builds', t => {
  const f = fixture(t);
  const result = spawnSync(process.execPath, [build, 'skills/flow-map/assets/example.flow.json', f.output, '--root', 'skills/flow-map'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
