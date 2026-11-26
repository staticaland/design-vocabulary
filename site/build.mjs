// Builds the static site: reads notes/*.md, resolves Obsidian-style
// [[wikilinks]], and writes dist/ with the app and a notes.json index.
import { readFile, writeFile, readdir, mkdir, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notesDir = path.join(root, 'notes');
const siteDir = path.join(root, 'site');
const outDir = path.join(root, 'dist');
const REPO = 'https://github.com/staticaland/design-vocabulary';

const WIKILINK = /\[\[([^\]|\\#]+)(?:#[^\]|\\]*)?(?:\\?\|([^\]]+))?\]\]/g;
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

// Markdown to plain text, for summaries and search.
const plain = (md) =>
  md
    .replace(WIKILINK, (_, target, alias) => alias || target.trim())
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\|?[\s:|-]+\|?$/gm, '')
    .replace(/[*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const files = (await readdir(notesDir)).filter((f) => f.endsWith('.md')).sort();
const ids = new Set(files.map((f) => f.slice(0, -3)));
const errors = [];
const notes = [];

for (const file of files) {
  const id = file.slice(0, -3);
  const { meta, body } = parseFrontmatter(await readFile(path.join(notesDir, file), 'utf8'));

  const titleMatch = body.match(/^#\s+(.+)$/m);
  if (!titleMatch) errors.push(`${file}: no "# Title" heading`);
  const title = titleMatch ? titleMatch[1].trim() : id;
  const content = body.replace(/^#\s+.+\n/m, '').trim();
  if (!/\n## Flashcard\n\n<details>\n<summary>.+<\/summary>\n\n[\s\S]+?\n\n<\/details>(\n\n## Related\n|$)/.test(content)) {
    errors.push(`${file}: no "## Flashcard" section with a <details> block, above "## Related" or at the end`);
  }

  const links = [];
  // Links inside code spans and code blocks are left alone, as in Obsidian.
  const CODE_OR_LINK = new RegExp('(```[\\s\\S]*?```|`[^`\\n]*`)|' + WIKILINK.source, 'g');
  const withLinks = content.replace(CODE_OR_LINK, (match, code, rawTarget, alias) => {
    if (code) return code;
    const target = rawTarget.trim();
    const text = escapeHtml((alias || target).trim());
    if (!ids.has(target)) {
      errors.push(`${file}: link to missing note [[${target}]]`);
      return text;
    }
    if (target !== id && !links.includes(target)) links.push(target);
    return `<a class="wikilink" href="#/${target}" data-note="${target}">${text}</a>`;
  });

  const summary = plain(content.split(/\n\s*\n/)[0] || '');
  notes.push({
    id,
    title,
    type: meta.type || 'concept',
    summary,
    text: plain(content),
    html: marked.parse(withLinks),
    links,
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
for (const f of ['index.html', 'style.css', 'app.js', 'figures.js']) {
  await copyFile(path.join(siteDir, f), path.join(outDir, f));
}
// The fonts are served from the site itself, so a visit makes no third-party request.
const FONTS = [
  '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2',
  '@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2',
  '@fontsource/lato/files/lato-latin-400-normal.woff2',
  '@fontsource/lato/files/lato-latin-700-normal.woff2',
];
await mkdir(path.join(outDir, 'fonts'));
for (const f of FONTS) {
  await copyFile(path.join(root, 'node_modules', f), path.join(outDir, 'fonts', path.basename(f)));
}
await writeFile(path.join(outDir, 'notes.json'), JSON.stringify({ repo: REPO, notes }));
await writeFile(path.join(outDir, '.nojekyll'), '');
console.log(`Built ${notes.length} notes into dist/`);
