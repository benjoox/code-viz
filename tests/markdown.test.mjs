import test from 'node:test';
import assert from 'node:assert/strict';
import { isMarkdown, openFence, parseMarkdown } from '../skills/flow-map/scripts/markdown.mjs';

const kinds = blocks => blocks.map(b => b.type);

test('recognises Markdown files by extension', () => {
  assert.equal(isMarkdown('docs/README.md'), true);
  assert.equal(isMarkdown('NOTES.MARKDOWN'), true);
  assert.equal(isMarkdown('page.mdx'), false);
  assert.equal(isMarkdown('src/readme.md.js'), false);
});

test('reads headings, paragraphs and rules with their file lines', () => {
  const blocks = parseMarkdown(['## Title', '', 'First line', 'second line', '', '---'], 10);
  assert.deepEqual(blocks, [
    { type: 'heading', level: 2, line: 10, end: 10, inline: ['Title'] },
    { type: 'paragraph', line: 12, end: 13, inline: ['First line second line'] },
    { type: 'rule', line: 15, end: 15 },
  ]);
});

test('reads inline code, emphasis, escapes and links', () => {
  const [p] = parseMarkdown(['Use `npm test` with **care**, *often* and \\*never\\* [docs](https://example.com/a).'], 1);
  assert.deepEqual(p.inline, [
    'Use ', { code: 'npm test' }, ' with ', { strong: ['care'] }, ', ', { em: ['often'] }, ' and ', '*', 'never', '*', ' ',
    { href: 'https://example.com/a', text: ['docs'] }, '.',
  ]);
});

test('keeps snake_case words and spaced asterisks literal', () => {
  const [p] = parseMarkdown(['read build_page_now and 2 * 3 * 4'], 1);
  assert.deepEqual(p.inline, ['read build_page_now and 2 * 3 * 4']);
});

test('only http and https links stay links, and images become alt text', () => {
  const [p] = parseMarkdown(['[a](javascript:alert(1)) [b](data:text/html,x) [c](../docs/x.md) ![logo](https://example.com/x.png) [d](HTTP://example.com)'], 1);
  assert.deepEqual(p.inline.filter(item => typeof item !== 'string'), [{ href: 'HTTP://example.com', text: ['d'] }]);
  const flat = JSON.stringify(p.inline);
  assert.doesNotMatch(flat, /javascript:|data:|x\.png|\.\.\/docs/);
});

test('treats raw HTML as text', () => {
  const blocks = parseMarkdown(['<img src=x onerror=alert(1)>', '', '<script>alert(2)</script>'], 1);
  assert.deepEqual(kinds(blocks), ['paragraph', 'paragraph']);
  assert.deepEqual(blocks[0].inline, ['<img src=x onerror=alert(1)>']);
  assert.deepEqual(blocks[1].inline, ['<script>alert(2)</script>']);
});

test('reads bullet and numbered lists with nesting, wrapped items and a blank between items', () => {
  const [list] = parseMarkdown(['- one', '  continues here', '', '- two', '  - nested', '3. three'], 5);
  assert.equal(list.type, 'list');
  assert.deepEqual(list.items.map(({ depth, mark, line, end }) => ({ depth, mark, line, end })), [
    { depth: 0, mark: '•', line: 5, end: 6 },
    { depth: 0, mark: '•', line: 8, end: 8 },
    { depth: 1, mark: '•', line: 9, end: 9 },
    { depth: 0, mark: '3.', line: 10, end: 10 },
  ]);
  assert.deepEqual(list.items[0].inline, ['one continues here']);
});

test('reads a table with a header and inline cells', () => {
  const [table] = parseMarkdown(['| Field | Use |', '| --- | :-: |', '| `id` | Stable \\| key |'], 3);
  assert.equal(table.type, 'table');
  assert.deepEqual([table.line, table.end], [3, 5]);
  assert.deepEqual(table.head, [['Field'], ['Use']]);
  assert.deepEqual(table.rows, [[[{ code: 'id' }], ['Stable ', '|', ' key']]]);
});

test('reads a table that starts below its header', () => {
  const [table] = parseMarkdown(['| --- | --- |', '| a | b |', '| c | d |'], 20);
  assert.equal(table.head, null);
  assert.equal(table.rows.length, 2);
});

test('reads fenced code and runs an unclosed fence to the end of the excerpt', () => {
  const closed = parseMarkdown(['```mermaid', 'flowchart LR', '  A --> B', '```', 'after'], 1);
  assert.deepEqual(closed[0], { type: 'code', lang: 'mermaid', line: 1, end: 4, from: 2, lines: ['flowchart LR', '  A --> B'] });
  assert.equal(closed[1].type, 'paragraph');
  const open = parseMarkdown(['~~~', 'still code', '# not a heading'], 7);
  assert.deepEqual(open, [{ type: 'code', lang: '', line: 7, end: 9, from: 8, lines: ['still code', '# not a heading'] }]);
});

test('reads front matter only at the first line of a file', () => {
  const lines = ['---', 'name: demo', '---', '# Title'];
  assert.deepEqual(kinds(parseMarkdown(lines, 1)), ['code', 'heading']);
  assert.equal(parseMarkdown(lines, 1)[0].lang, 'front matter');
  assert.deepEqual(kinds(parseMarkdown(lines, 30)), ['rule', 'paragraph', 'rule', 'heading']);
});

test('reads block quotes and ignores Windows line endings', () => {
  const blocks = parseMarkdown(['> quoted\r', '> text\r', '\r', '# Heading\r'], 1);
  assert.deepEqual(kinds(blocks), ['quote', 'heading']);
  assert.deepEqual(blocks[0].inline, ['quoted text']);
  assert.deepEqual(blocks[1].inline, ['Heading']);
});

test('returns no blocks for an empty or blank excerpt', () => {
  assert.deepEqual(parseMarkdown([], 1), []);
  assert.deepEqual(parseMarkdown(['', '   '], 1), []);
});

test('finds the fence that is still open before an excerpt', () => {
  const file = ['intro', '```bash', 'node -e "1"', 'echo hi', '```', 'after', '~~~~', 'tilde', '~~~', 'still open'];
  assert.equal(openFence(file, 0), '');
  assert.equal(openFence(file, 2), '```');
  assert.equal(openFence(file, 4), '```');
  assert.equal(openFence(file, 5), '');
  assert.equal(openFence(file, 8), '~~~~');
  assert.equal(openFence(file, 9), '~~~~');
});

test('reads an excerpt that starts inside a fence as code, not prose', () => {
  const blocks = parseMarkdown(['const a = 1;', 'const b = 2;', '```', '', 'Back to prose.'], 98, '```');
  assert.deepEqual(blocks[0], { type: 'code', lang: '', line: 98, end: 100, from: 98, lines: ['const a = 1;', 'const b = 2;'] });
  assert.deepEqual(blocks[1], { type: 'paragraph', line: 102, end: 102, inline: ['Back to prose.'] });
});

test('an excerpt wholly inside a fence is one code block with every line', () => {
  const blocks = parseMarkdown(['# looks like a heading', '| a | b |'], 40, '```');
  assert.deepEqual(blocks, [{ type: 'code', lang: '', line: 40, end: 41, from: 40, lines: ['# looks like a heading', '| a | b |'] }]);
});
