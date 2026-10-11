// Reads the redacted lines of one Markdown excerpt into blocks that the page draws as plain text
// nodes. It never produces HTML, so excerpt text cannot become markup. An excerpt is a line range:
// a block may begin or end outside it, so open fences and partial tables are read as far as they go.

const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)/;
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const RULE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
const QUOTE = /^ {0,3}>\s?(.*)$/;
const ITEM = /^( *)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const SEPARATOR = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;
// Escape, code span, strong, emphasis, then link or image. Unmatched markers stay literal text.
const INLINE = /\\([\\`*_{}[\]()#+\-.!|>~])|(`+)([^`]|[^`][\s\S]*?[^`])\2(?!`)|\*\*(?=\S)([\s\S]*?\S)\*\*|__(?=\S)([\s\S]*?\S)__|\*(?=[^\s*])([\s\S]*?[^\s*])\*|(?<!\w)_(?=[^\s_])([\s\S]*?[^\s_])_(?!\w)|(!?)\[([^\]]*)\]\(\s*<?([^\s)>]*)>?(?:\s+"[^"]*")?\s*\)/g;

export const isMarkdown = path => /\.(?:md|markdown)$/i.test(path);

/** Inline items: a string, or { code }, { strong }, { em }, { href, text }. Only http(s) links stay links. */
function inline(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1] !== undefined) out.push(m[1]);
    else if (m[2]) out.push({ code: m[3].replace(/^ ([\s\S]*) $/, '$1') });
    else if (m[4] ?? m[5]) out.push({ strong: inline(m[4] ?? m[5]) });
    else if (m[6] ?? m[7]) out.push({ em: inline(m[6] ?? m[7]) });
    else if (m[8]) out.push(m[9]); // An image becomes its alt text, so the page never fetches one.
    else if (/^https?:\/\//i.test(m[10])) out.push({ href: m[10], text: inline(m[9]) });
    else out.push(...inline(m[9]));
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = row => row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => inline(c.trim()));
const startsTable = (rows, i) => /^\s*\|/.test(rows[i])
  || (rows[i].includes('|') && i + 1 < rows.length && rows[i + 1].includes('|') && SEPARATOR.test(rows[i + 1]));
const startsBlock = (rows, i) => FENCE.test(rows[i]) || HEADING.test(rows[i]) || RULE.test(rows[i])
  || QUOTE.test(rows[i]) || ITEM.test(rows[i]) || startsTable(rows, i);

/** Blocks carry the file lines they cover, so the page keeps its line numbers and issue highlight. */
export function parseMarkdown(lines, first) {
  const rows = lines.map(l => l.replace(/\r$/, ''));
  const blocks = [];
  const at = i => first + i;
  let i = 0;
  const frontMatterEnd = first === 1 && rows[0]?.trim() === '---' ? rows.findIndex((l, k) => k > 0 && l.trim() === '---') : -1;
  if (frontMatterEnd > 0) {
    blocks.push({ type: 'code', lang: 'front matter', line: 1, end: frontMatterEnd + 1, lines: rows.slice(0, frontMatterEnd + 1) });
    i = frontMatterEnd + 1;
  }
  while (i < rows.length) {
    const row = rows[i];
    let m;
    if (!row.trim()) { i++; continue; }
    if ((m = FENCE.exec(row))) {
      const start = i++;
      const close = new RegExp(`^ {0,3}\\${m[1][0]}{${m[1].length},}\\s*$`);
      while (i < rows.length && !close.test(rows[i])) i++;
      blocks.push({ type: 'code', lang: m[2], line: at(start), end: at(Math.min(i, rows.length - 1)), lines: rows.slice(start + 1, i) });
      i++;
    } else if ((m = HEADING.exec(row))) {
      blocks.push({ type: 'heading', level: m[1].length, line: at(i), end: at(i), inline: inline(m[2]) });
      i++;
    } else if (RULE.test(row)) {
      blocks.push({ type: 'rule', line: at(i), end: at(i) });
      i++;
    } else if (QUOTE.test(row)) {
      const start = i;
      const text = [];
      while (i < rows.length && (m = QUOTE.exec(rows[i]))) { text.push(m[1].trim()); i++; }
      blocks.push({ type: 'quote', line: at(start), end: at(i - 1), inline: inline(text.filter(Boolean).join(' ')) });
    } else if (startsTable(rows, i)) {
      const start = i;
      while (i < rows.length && rows[i].trim() && rows[i].includes('|')) i++;
      const table = rows.slice(start, i);
      const headed = table.length > 1 && SEPARATOR.test(table[1]);
      blocks.push({
        type: 'table', line: at(start), end: at(i - 1),
        head: headed ? cells(table[0]) : null,
        rows: table.slice(headed ? 2 : 0).filter(r => !SEPARATOR.test(r)).map(cells),
      });
    } else if ((m = ITEM.exec(row))) {
      const start = i;
      const items = [];
      while (i < rows.length) {
        const item = ITEM.exec(rows[i]);
        if (item) {
          items.push({ depth: Math.min(Math.floor(item[1].length / 2), 4), mark: /\d/.test(item[2]) ? item[2] : '•', text: item[3].trim(), line: at(i), end: at(i) });
        } else if (rows[i].trim() && !startsBlock(rows, i) && items.length) {
          const last = items[items.length - 1];
          last.text += ` ${rows[i].trim()}`;
          last.end = at(i);
        } else if (!rows[i].trim() && i + 1 < rows.length && ITEM.test(rows[i + 1])) {
          // A blank line between items keeps the same list.
        } else break;
        i++;
      }
      blocks.push({ type: 'list', line: at(start), end: at(i - 1), items: items.map(({ text, ...item }) => ({ ...item, inline: inline(text) })) });
    } else {
      const start = i;
      const text = [row.trim()];
      for (i++; i < rows.length && rows[i].trim() && !startsBlock(rows, i); i++) text.push(rows[i].trim());
      blocks.push({ type: 'paragraph', line: at(start), end: at(i - 1), inline: inline(text.join(' ')) });
    }
  }
  return blocks;
}
