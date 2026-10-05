import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const pkg = json('package.json');
const plugin = json('.claude-plugin/plugin.json');
const marketplace = json('.claude-plugin/marketplace.json');
assert.equal(plugin.name, pkg.name);
assert.equal(plugin.version, pkg.version);
assert.equal(plugin.license, pkg.license);
assert.equal(marketplace.plugins[0].name, pkg.name);
assert.equal(marketplace.plugins[0].source, './');
assert.equal(marketplace.plugins[0].version, pkg.version);
json('skills/flow-map/assets/example.flow.json');
for (const file of ['skills/flow-map/SKILL.md', 'skills/flow-map/assets/template.html', 'skills/flow-map/assets/icons.svg', 'LICENSE']) {
  assert.ok(readFileSync(file, 'utf8').trim(), `${file} must not be empty`);
}
console.log('Manifest versions and required assets verified.');
