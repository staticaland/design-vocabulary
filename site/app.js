// Note explorer: a list, a note, and a graph of how the notes connect.
import { mountFigures } from './figures.js';

const SVG = 'http://www.w3.org/2000/svg';
const TYPE_LABEL = { concept: 'Concept', 'steering-word': 'Steering word', source: 'Source', map: 'Map' };
// Each group: the note type, its heading, and the line under that heading on the front page.
const GROUPS = [
  ['concept', 'Concepts', 'The parts a design is made of, and the words for what is wrong with them.'],
  ['steering-word', 'Steering words', 'Words for the direction a design should move in.'],
  ['map', 'Maps', 'Lists that lead from a tool or a topic to the notes behind it.'],
  ['source', 'Sources', 'Where this vocabulary comes from.'],
];

// The concepts the front page leads with, each with a small drawing of the idea.
// They are the ones the other notes lean on, across hierarchy, grouping, layout, colour and use.
const ESSENTIALS = [
  ['visual-hierarchy', '<rect class="a" x="44" y="26" width="152" height="28" rx="3"/><rect class="m" x="44" y="66" width="104" height="14" rx="2"/><rect class="l" x="44" y="92" width="136" height="8" rx="2"/><rect class="l" x="44" y="108" width="96" height="8" rx="2"/>'],
  ['affordance', '<rect class="s" x="62" y="54" width="116" height="44" rx="8"/><rect class="a" x="62" y="44" width="116" height="44" rx="8"/><path class="p" d="M150 70v36l9-8 6 14 7-3-6-14h12Z"/>'],
  ['proximity', '<g class="t"><circle cx="58" cy="48" r="7"/><circle cx="80" cy="48" r="7"/><circle cx="58" cy="70" r="7"/><circle cx="80" cy="70" r="7"/><circle cx="58" cy="92" r="7"/><circle cx="80" cy="92" r="7"/><circle cx="160" cy="48" r="7"/><circle cx="182" cy="48" r="7"/><circle cx="160" cy="70" r="7"/><circle cx="182" cy="70" r="7"/><circle cx="160" cy="92" r="7"/><circle cx="182" cy="92" r="7"/></g>'],
  ['alignment', '<path class="d" d="M64 16v108"/><rect class="m" x="64" y="30" width="112" height="12" rx="2"/><rect class="l" x="64" y="54" width="68" height="12" rx="2"/><rect class="l" x="64" y="78" width="128" height="12" rx="2"/><rect class="l" x="64" y="102" width="48" height="12" rx="2"/>'],
  ['contrast', '<circle class="s" cx="120" cy="70" r="44"/><path class="k" d="M120 26a44 44 0 0 0 0 88Z"/><circle class="o" cx="120" cy="70" r="44"/>'],
  ['white-space', '<rect class="o" x="40" y="18" width="160" height="104" rx="4"/><rect class="k" x="94" y="58" width="52" height="10" rx="2"/><rect class="l" x="102" y="76" width="36" height="6" rx="2"/>'],
];

// The concepts on the front page, sorted into topics. A concept that is not listed goes under "Other".
const TOPICS = [
  ['Hierarchy and emphasis', ['visual-hierarchy', 'visual-weight', 'emphasis', 'squint-test', 'accent-bar']],
  ['Grouping', ['gestalt-principles', 'proximity', 'similarity', 'common-region', 'card', 'nesting']],
  ['Layout and alignment', ['alignment', 'alignment-axis', 'grid', 'optical-alignment', 'ragged-edge', 'overflow', 'truncation']],
  ['Spacing', ['white-space', 'padding', 'gap', 'spacing-scale']],
  ['Colour', ['colour-palette', 'accent-colour', 'contrast', 'wcag-aa']],
  ['Type', ['typographic-hierarchy', 'type-scale', 'font-size', 'font-weight', 'line-height', 'line-length', 'typographic-colour', 'tabular-figures', 'baseline', 'x-height', 'cap-height', 'ascender', 'descender', 'overshoot']],
  ['Practice', ['affordance', 'visual-polish', 'steering-words', 'design-tokens']],
];

// A small mark for each type of note, drawn beside its title on the front page.
const MARKS = {
  concept: '<circle cx="10" cy="10" r="8"/><path d="M10 3.5 16.5 10 10 16.5 3.5 10Z"/>',
  'steering-word': '<circle cx="10" cy="10" r="8"/><path d="m13.5 6.5-2 5-5 2 2-5Z"/>',
  map: '<path d="m3 5 4.5-1.5 5 1.5L17 3.5V15l-4.5 1.5-5-1.5L3 16.5ZM7.5 3.5V15m5-10v11.5"/>',
  source: '<path d="M10 5.5C8 4 5 3.8 2.5 4.5v10.5C5 14.3 8 14.5 10 16c2-1.5 5-1.7 7.5-1V4.5C15 3.8 12 4 10 5.5Zm0 0V16"/>',
};

const $ = (id) => document.getElementById(id);
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  node.append(...children);
  return node;
};

// A blockquote in a note is a prompt to copy. A first line that is only bold text becomes its label.
const COPY_ICON =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5v5A1.5 1.5 0 0 0 4 9.5h.5"/></svg>';
const DONE_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';

function mountPrompts(root) {
  for (const box of root.querySelectorAll('blockquote')) {
    const first = box.firstElementChild;
    let label = 'Prompt';
    if (first?.matches('p') && first.childElementCount === 1 && first.firstElementChild.matches('strong') && first.textContent.trim() === first.firstElementChild.textContent.trim()) {
      label = first.textContent.trim();
      first.remove();
    }
    const text = [...box.children].map((p) => p.textContent.trim()).join('\n\n');
    const status = el('span', { class: 'prompt-status', html: COPY_ICON });
    box.prepend(el('div', { class: 'prompt-head' }, el('span', { class: 'prompt-label' }, label), status));
    box.classList.add('prompt');
    box.tabIndex = 0;
    box.setAttribute('role', 'button');
    box.setAttribute('aria-label', `Copy prompt: ${label}`);

    let timer;
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      status.innerHTML = `${DONE_ICON}<span>Copied</span>`;
      box.classList.add('copied');
      clearTimeout(timer);
      timer = setTimeout(() => {
        status.innerHTML = COPY_ICON;
        box.classList.remove('copied');
      }, 1500);
    };
    box.addEventListener('click', copy);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copy();
      }
    });
  }
}

const data = await (await fetch('notes.json')).json();
const notes = data.notes;
const byId = new Map(notes.map((n) => [n.id, n]));
for (const n of notes) n.backlinks = [];
for (const n of notes) for (const t of n.links) byId.get(t).backlinks.push(n.id);
for (const n of notes) n.neighbours = [...new Set([...n.links, ...n.backlinks])];

// Undirected edges, each pair once.
const edges = [];
const seen = new Set();
for (const n of notes) {
  for (const t of n.links) {
    const key = [n.id, t].sort().join('|');
    if (!seen.has(key)) {
      seen.add(key);
      edges.push([n.id, t]);
    }
  }
}

const byTitle = (a, b) => a.title.localeCompare(b.title);

/* ---------- Graph ---------- */

const labelText = (id) => byId.get(id).title.replace(' (source map)', '');
const radius = (id) => 3.5 + Math.sqrt(byId.get(id).neighbours.length);

// Deterministic force layout (Fruchterman-Reingold), scaled to fill the box.
function layout(ids, links, width, height, pad) {
  const n = ids.length;
  const pos = new Map(
    ids.map((id, i) => {
      const a = (i / n) * Math.PI * 2;
      return [id, { x: Math.cos(a) * 100, y: Math.sin(a) * 100 }];
    }),
  );
  const k = 60;
  for (let step = 0; step < 500; step++) {
    const temp = 30 * (1 - step / 500) + 0.5;
    const disp = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = pos.get(ids[i]);
        const b = pos.get(ids[j]);
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const f = (k * k) / d / d;
        dx *= f;
        dy *= f;
        disp.get(ids[i]).x += dx;
        disp.get(ids[i]).y += dy;
        disp.get(ids[j]).x -= dx;
        disp.get(ids[j]).y -= dy;
      }
    }
    for (const [s, t] of links) {
      const a = pos.get(s);
      const b = pos.get(t);
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy) || 0.01;
      const f = d / k;
      disp.get(s).x -= dx * f;
      disp.get(s).y -= dy * f;
      disp.get(t).x += dx * f;
      disp.get(t).y += dy * f;
    }
    for (const id of ids) {
      const p = pos.get(id);
      const d = disp.get(id);
      d.x -= p.x * 0.05;
      d.y -= p.y * 0.05;
      const len = Math.hypot(d.x, d.y) || 0.01;
      p.x += (d.x / len) * Math.min(len, temp);
      p.y += (d.y / len) * Math.min(len, temp);
    }
  }
  const xs = [...pos.values()].map((p) => p.x);
  const ys = [...pos.values()].map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  for (const p of pos.values()) {
    p.x = pad.x + ((p.x - x0) / (x1 - x0 || 1)) * (width - pad.x * 2);
    p.y = pad.top + ((p.y - y0) / (y1 - y0 || 1)) * (height - pad.top - pad.bottom);
  }
  // Nudge nodes apart until no label sits on another node or label.
  const box = (id) => {
    const p = pos.get(id);
    const r = radius(id);
    const half = Math.max(r, labelText(id).length * 3.1) + 4;
    return { x0: p.x - half, x1: p.x + half, y0: p.y - r - 2, y1: p.y + r + 18 };
  };
  for (let step = 0; step < 80; step++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = box(ids[i]);
        const b = box(ids[j]);
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        const pa = pos.get(ids[i]);
        const pb = pos.get(ids[j]);
        if (oy <= ox) {
          const dir = pa.y <= pb.y ? -1 : 1;
          pa.y += (dir * oy) / 2;
          pb.y -= (dir * oy) / 2;
        } else {
          const dir = pa.x <= pb.x ? -1 : 1;
          pa.x += (dir * ox) / 2;
          pb.x -= (dir * ox) / 2;
        }
      }
    }
    for (const [id, p] of pos) {
      // A long label needs more room than the padding, or it runs off the side.
      const edge = Math.max(pad.x, labelText(id).length * 3.3 + 4);
      p.x = Math.min(width - edge, Math.max(edge, p.x));
      p.y = Math.min(height - pad.bottom, Math.max(pad.top, p.y));
    }
    if (!moved) break;
  }
  return pos;
}

function drawGraph(ids, { width, height, current, label }) {
  const idSet = new Set(ids);
  const links = edges.filter(([s, t]) => idSet.has(s) && idSet.has(t));
  const pos = layout(ids, links, width, height, { x: 56, top: 16, bottom: 30 });

  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'graph');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', label);

  const lineEls = links.map(([s, t]) => {
    const line = document.createElementNS(SVG, 'line');
    const a = pos.get(s);
    const b = pos.get(t);
    for (const [k, v] of [['x1', a.x], ['y1', a.y], ['x2', b.x], ['y2', b.y]]) {
      line.setAttribute(k, v.toFixed(1));
    }
    svg.append(line);
    return { line, s, t };
  });

  const nodeEls = new Map();
  for (const id of ids) {
    const note = byId.get(id);
    const p = pos.get(id);
    const r = radius(id);
    const g = document.createElementNS(SVG, 'a');
    g.setAttribute('href', `#/${id}`);
    g.setAttribute('class', `node ${note.type}${id === current ? ' current' : ''}`);
    g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    g.dataset.note = id;
    const circle = document.createElementNS(SVG, 'circle');
    circle.setAttribute('r', r.toFixed(1));
    const text = document.createElementNS(SVG, 'text');
    text.setAttribute('y', (r + 13).toFixed(1));
    text.textContent = labelText(id);
    g.append(circle, text);
    svg.append(g);
    nodeEls.set(id, g);
  }

  const light = (id) => {
    svg.classList.toggle('hovering', !!id);
    for (const g of nodeEls.values()) g.classList.remove('lit');
    for (const { line, s, t } of lineEls) {
      const on = id && (s === id || t === id);
      line.classList.toggle('lit', !!on);
      if (on) {
        nodeEls.get(s).classList.add('lit');
        nodeEls.get(t).classList.add('lit');
      }
    }
    if (id) nodeEls.get(id).classList.add('lit');
  };
  for (const [id, g] of nodeEls) {
    g.addEventListener('mouseenter', () => light(id));
    g.addEventListener('focus', () => light(id));
    g.addEventListener('mouseleave', () => light(null));
    g.addEventListener('blur', () => light(null));
  }
  return svg;
}

const legend = () =>
  el(
    'ul',
    { class: 'legend', 'aria-label': 'Legend' },
    ...['concept', 'steering-word', 'source', 'map'].map((type) => [type, TYPE_LABEL[type]]).map(
      ([type, text]) => el('li', { class: type }, el('i'), text),
    ),
  );

/* ---------- Sidebar ---------- */

const search = $('search');
const list = $('note-list');
let currentId = null;

function renderList() {
  const q = search.value.trim().toLowerCase();
  const match = (n) => !q || n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q);
  // Title matches first, then matches in the body.
  const rank = (n) => (q && n.title.toLowerCase().includes(q) ? 0 : 1);
  list.replaceChildren();
  let total = 0;
  for (const [type, label] of GROUPS) {
    const items = notes
      .filter((n) => n.type === type && match(n))
      .sort((a, b) => rank(a) - rank(b) || byTitle(a, b));
    if (!items.length) continue;
    total += items.length;
    list.append(
      el('p', { class: 'group-label' }, label),
      el(
        'ul',
        { class: 'note-list' },
        ...items.map((n) => {
          const a = el('a', { href: `#/${n.id}` }, n.title.replace(' (source map)', ''));
          if (n.id === currentId) a.setAttribute('aria-current', 'page');
          return el('li', {}, a);
        }),
      ),
    );
  }
  if (!total) list.append(el('p', { class: 'empty' }, `No notes match "${search.value.trim()}".`));
}

search.addEventListener('input', renderList);
search.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const first = list.querySelector('a');
    if (first) location.hash = first.getAttribute('href');
  }
  if (e.key === 'Escape') {
    search.value = '';
    renderList();
    search.blur();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== search && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    search.focus();
  }
});

const toggle = $('menu-toggle');
const nav = $('nav');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

/* ---------- Views ---------- */

const main = $('main');

// The graph of connected notes is closed until asked for, so that the page reads calmly.
// The choice is remembered for the next page.
function connectionsSection(ids, graph, count) {
  const section = el(
    'details',
    { class: 'connections' },
    el('summary', {}, el('span', { class: 'section-label' }, 'Connections'), el('span', { class: 'count' }, count)),
    drawGraph(ids, graph),
    legend(),
  );
  try {
    section.open = localStorage.getItem('connections') === 'open';
  } catch {}
  section.addEventListener('toggle', () => {
    try {
      localStorage.setItem('connections', section.open ? 'open' : 'closed');
    } catch {}
  });
  return section;
}

function renderNote(note) {
  const prose = el('div', { class: 'prose', html: note.html });
  // The flashcard carries its own label, so the "Flashcard" heading above it goes.
  const card = prose.querySelector('details');
  if (card) {
    card.className = 'flashcard';
    card.previousElementSibling.remove();
  }
  for (const table of prose.querySelectorAll('table')) {
    const wrap = el('div', { class: 'table-wrap' });
    table.replaceWith(wrap);
    wrap.append(table);
  }
  // The definition, the first paragraph, goes into the head with the title.
  const definition = prose.querySelector(':scope > p:first-child');
  if (definition) definition.className = 'definition';
  const article = el(
    'article',
    { class: 'note' },
    el('header', { class: 'head' }, el('p', { class: `eyebrow ${note.type}` }, TYPE_LABEL[note.type] || note.type), el('h1', {}, note.title)),
    prose,
  );

  // Notes that link here but that this note does not already link to.
  const incoming = note.backlinks
    .filter((id) => !note.links.includes(id))
    .map((id) => byId.get(id))
    .sort(byTitle);
  if (incoming.length) {
    article.append(
      el('h2', { class: 'section-label' }, 'Also linked from'),
      el(
        'ul',
        { class: 'backlinks' },
        ...incoming.map((n) =>
          el('li', {}, el('a', { href: `#/${n.id}`, 'data-note': n.id }, n.title), el('span', {}, n.summary)),
        ),
      ),
    );
  }
  const ids = [note.id, ...note.neighbours];
  const height = ids.length > 14 ? 560 : ids.length > 6 ? 420 : 300;
  const connections = connectionsSection(
    ids,
    { width: 700, height, current: note.id, label: `Notes connected to ${note.title}` },
    `${note.neighbours.length} ${note.neighbours.length === 1 ? 'note' : 'notes'}`,
  );
  article.append(
    connections,
    el('a', { class: 'source-link', href: `${data.repo}/blob/main/notes/${note.id}.md` }, 'View source on GitHub'),
  );
  if (definition) article.querySelector('.head').append(definition);
  main.replaceChildren(article);
  mountFigures(prose);
  mountPrompts(prose);
  document.title = `${note.title} · Design vocabulary`;
}

function renderHome() {
  const title = (n) => n.title.replace(' (source map)', '');
  // Each note is a line in a list: a mark, the title, and the definition.
  const item = (n) =>
    el(
      'li',
      {},
      el('span', { html: `<svg viewBox="0 0 20 20" aria-hidden="true">${MARKS[n.type] || MARKS.concept}</svg>` }),
      el('a', { href: `#/${n.id}` }, title(n)),
      // The heading above the maps already says what a map is.
      el('span', { class: 'summary' }, n.summary.replace(/^An entry point, not a concept\. /, '')),
    );
  // The essentials are cards: a drawing, the title, and the definition.
  const card = ([id, art]) => {
    const n = byId.get(id);
    return el(
      'li',
      {},
      el('span', { html: `<svg class="art" viewBox="0 0 240 140" aria-hidden="true">${art}</svg>` }),
      el('a', { href: `#/${n.id}` }, title(n)),
      el('span', { class: 'summary' }, n.summary),
    );
  };
  const essentials = el(
    'section',
    { class: 'group' },
    el('h2', {}, 'Essentials'),
    el('p', { class: 'about' }, 'Six ideas that most of the other notes lean on.'),
    el('ul', { class: 'cards' }, ...ESSENTIALS.filter(([id]) => byId.has(id)).map(card)),
  );
  // The concepts are too many to list with their definitions. They are an index instead:
  // titles under topic headings, with the definition shown on hover.
  const index = (concepts) => {
    const placed = new Set(TOPICS.flatMap(([, ids]) => ids));
    const other = concepts.filter((n) => !placed.has(n.id)).map((n) => n.id);
    return el(
      'div',
      { class: 'topics' },
      ...[...TOPICS, ['Other', other]]
        .map(([name, ids]) => [name, ids.map((id) => byId.get(id)).filter((n) => n && n.type === 'concept')])
        .filter(([, list]) => list.length)
        .map(([name, list]) =>
          el(
            'section',
            { class: 'topic' },
            el('h3', {}, name),
            el('ul', {}, ...list.map((n) => el('li', {}, el('a', { href: `#/${n.id}`, 'data-note': n.id }, title(n))))),
          ),
        ),
    );
  };
  const groups = GROUPS.map(([type, label, about]) => {
    const items = notes.filter((n) => n.type === type).sort(byTitle);
    return el(
      'section',
      { class: `group ${type}${type === 'concept' ? '' : ' short'}` },
      el('h2', {}, label),
      el('p', { class: 'about' }, about),
      type === 'concept' ? index(items) : el('ul', { class: 'items' }, ...items.map(item)),
    );
  });
  main.replaceChildren(
    el(
      'div',
      { class: 'home' },
      el(
        'header',
        { class: 'head' },
        el('h1', {}, 'Design vocabulary'),
        el(
          'p',
          { class: 'lede' },
          `${notes.length} short notes on the words designers use, one concept per note, linked to each other.`,
        ),
      ),
      el('div', { class: 'groups' }, essentials, ...groups),
      connectionsSection(
        notes.map((n) => n.id),
        { width: 1040, height: 700, label: 'All notes and their links' },
        `${notes.length} notes`,
      ),
    ),
  );
  document.title = 'Design vocabulary';
}

function renderMissing(id) {
  main.replaceChildren(
    el(
      'div',
      { class: 'note' },
      el('h1', {}, 'Note not found'),
      el('div', { class: 'prose' }, el('p', {}, `There is no note called "${id}". `, el('a', { href: '#/' }, 'See all notes'), '.')),
    ),
  );
  document.title = 'Note not found · Design vocabulary';
}

function route() {
  const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  currentId = id || null;
  if (!id) renderHome();
  else if (byId.has(id)) renderNote(byId.get(id));
  else renderMissing(id);
  renderList();
  setMenu(false);
  hidePreview();
  window.scrollTo(0, 0);
}

/* ---------- Hover preview ---------- */

const preview = $('preview');
function hidePreview() {
  preview.hidden = true;
}
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest?.('.prose a[data-note], .backlinks a[data-note], .graph a[data-note], .topics a[data-note]');
  if (!link) return;
  const note = byId.get(link.dataset.note);
  if (!note || note.id === currentId) return;
  preview.replaceChildren(el('strong', {}, note.title), el('span', {}, note.summary));
  preview.hidden = false;
  const box = link.getBoundingClientRect();
  const width = preview.offsetWidth;
  const left = Math.max(8, Math.min(box.left + scrollX, scrollX + innerWidth - width - 8));
  let top = box.bottom + scrollY + 8;
  if (box.bottom + preview.offsetHeight + 16 > innerHeight) top = box.top + scrollY - preview.offsetHeight - 8;
  // In the index the preview goes beside the title, so that it does not cover the titles below.
  if (link.closest('.topics') && box.right + 16 + width + 8 < innerWidth) {
    preview.style.left = `${box.right + scrollX + 16}px`;
    preview.style.top = `${box.top + scrollY - 12}px`;
    return;
  }
  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest?.('a[data-note]')) hidePreview();
});

window.addEventListener('hashchange', route);
route();
