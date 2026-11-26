// Note explorer: a list, a note, and a graph of how the notes connect.
import { mountFigures } from './figures.js';

const SVG = 'http://www.w3.org/2000/svg';
const TYPE_LABEL = { concept: 'Concept', 'steering-word': 'Steering word', source: 'Source', map: 'Entry point' };
const GROUPS = [
  ['map', 'Start here'],
  ['steering-word', 'Steering words'],
  ['concept', 'Concepts'],
  ['source', 'Sources'],
];

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
    for (const p of pos.values()) {
      p.x = Math.min(width - pad.x, Math.max(pad.x, p.x));
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
const rail = $('rail');

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
  const article = el(
    'article',
    { class: 'note' },
    el('p', { class: `eyebrow ${note.type}` }, TYPE_LABEL[note.type] || note.type),
    el('h1', {}, note.title),
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
  article.append(
    el('a', { class: 'source-link', href: `${data.repo}/blob/main/notes/${note.id}.md` }, 'View source on GitHub'),
  );
  main.replaceChildren(article);
  mountFigures(prose);
  mountPrompts(prose);

  const ids = [note.id, ...note.neighbours];
  const height = ids.length > 14 ? 620 : ids.length > 6 ? 400 : 260;
  rail.replaceChildren(
    el('h2', { class: 'section-label' }, 'Connections'),
    drawGraph(ids, { width: 300, height, current: note.id, label: `Notes connected to ${note.title}` }),
    el('p', { class: 'count' }, `${note.neighbours.length} connected ${note.neighbours.length === 1 ? 'note' : 'notes'}`),
    legend(),
  );
  document.title = `${note.title} · Design vocabulary`;
}

function renderHome() {
  const maps = notes.filter((n) => n.type === 'map').sort(byTitle);
  main.replaceChildren(
    el(
      'div',
      { class: 'home' },
      el('h1', {}, 'Design vocabulary'),
      el(
        'p',
        { class: 'lede' },
        `${notes.length} short notes on the words designers use, one concept per note, linked to each other.`,
      ),
      el('p', { class: 'hint' }, 'Every dot is a note. Pick one to start reading, or search the list.'),
      drawGraph(notes.map((n) => n.id), { width: 860, height: 620, label: 'All notes and their links' }),
      legend(),
      el('h2', { class: 'section-label' }, 'Start here'),
      el(
        'ul',
        { class: 'starts' },
        ...maps.map((n) =>
          el('li', {}, el('a', { href: `#/${n.id}` }, n.title.replace(' (source map)', '')), el('span', {}, n.summary)),
        ),
      ),
    ),
  );
  rail.replaceChildren();
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
  rail.replaceChildren();
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
  const link = e.target.closest?.('.prose a[data-note], .backlinks a[data-note], .graph a[data-note]');
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
  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest?.('a[data-note]')) hidePreview();
});

window.addEventListener('hashchange', route);
route();
