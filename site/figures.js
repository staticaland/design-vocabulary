// Figures drawn in the browser, measured on the fonts the reader actually gets.
// A note asks for one with <figure data-figure="name">.
const SVG = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, text) => {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, typeof v === 'number' ? v.toFixed(1) : v);
  if (text != null) node.textContent = text;
  return node;
};
const htmlEl = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};

const ctx = document.createElement('canvas').getContext('2d');
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const measure = (font, size, text) => {
  ctx.font = `${size}px ${font}`;
  const m = ctx.measureText(text);
  return { width: m.width, up: m.actualBoundingBoxAscent, down: m.actualBoundingBoxDescent };
};
const px = (n) => `${Math.round(n * 10) / 10}px`;

// A bordered box, and the width available inside it.
function panel(host) {
  const box = htmlEl('div', 'figure-panel');
  const inner = htmlEl('div');
  box.append(inner);
  host.append(box);
  return { box, inner, width: inner.clientWidth };
}

// The word "Hdxpo" with the five lines of a font marked on it.
function fontLines(host) {
  const { inner, width: W } = panel(host);
  const serif = token('--serif');
  const sans = token('--sans');
  const wide = W >= 520;
  const labelX = wide ? 128 : 92;
  const lineX0 = labelX + (wide ? 36 : 24);
  const glyphX = lineX0 + (wide ? 28 : 8);
  const word = 'Hdxpo';
  const F = Math.min(168, (W - glyphX - (wide ? 28 : 8)) / (measure(serif, 100, word).width / 100));
  const m = (t) => measure(serif, F, t);

  const lines = [
    { key: 'ascender', name: 'Ascender line', hint: 'top of d', y: -m('d').up },
    { key: 'cap', name: 'Cap height', hint: 'top of H', y: -m('H').up },
    { key: 'x', name: 'x-height', hint: 'top of x', y: -m('x').up },
    { key: 'baseline', name: 'Baseline', hint: 'where letters stand', y: 0 },
    { key: 'descender', name: 'Descender line', hint: 'bottom of p', y: m('p').down },
  ].sort((a, b) => a.y - b.y);

  // Labels start level with their line, then move apart until none overlap.
  const slot = wide ? 32 : 19;
  const ys = lines.map((l) => l.y);
  for (let step = 0; step < 300; step++) {
    let moved = false;
    for (let i = 1; i < ys.length; i++) {
      const short = slot - (ys[i] - ys[i - 1]);
      if (short > 0.01) {
        ys[i - 1] -= short / 2;
        ys[i] += short / 2;
        moved = true;
      }
    }
    if (!moved) break;
  }

  const o = m('o');
  const descender = Math.max(...lines.map((l) => l.y));
  const showOvershoot = o.down > 0.4;
  const calloutY = descender + 34;
  const top = Math.min(ys[0] - 16, lines[0].y - 12);
  const bottom = Math.max(
    ys[ys.length - 1] + (wide ? 26 : 10),
    showOvershoot ? calloutY + (wide ? 22 : 8) : descender + 12,
  );

  const svg = svgEl('svg', {
    class: 'type-figure',
    width: W,
    height: bottom - top,
    viewBox: `0 ${top.toFixed(1)} ${W} ${(bottom - top).toFixed(1)}`,
    role: 'img',
    'aria-label':
      'The letters H, d, x, p and o on a baseline, with lines marking the ascender line, cap height, x-height, baseline and descender line.',
  });
  svg.append(svgEl('text', { class: 'glyphs', x: glyphX, y: 0, 'font-size': F, 'font-family': serif }, word));
  lines.forEach((l, i) => {
    svg.append(
      svgEl('polyline', {
        class: `rule ${l.key}`,
        points: `${labelX + 8},${ys[i].toFixed(1)} ${lineX0},${l.y.toFixed(1)} ${W},${l.y.toFixed(1)}`,
      }),
      svgEl('text', { class: `name ${l.key}`, x: labelX, y: ys[i] + 4, 'text-anchor': 'end' }, l.name),
    );
    if (wide) svg.append(svgEl('text', { class: 'hint', x: labelX, y: ys[i] + 17, 'text-anchor': 'end' }, l.hint));
  });
  if (showOvershoot) {
    const ox = glyphX + m(word).width - o.width / 2;
    const hint = 'o dips just below the baseline';
    const half = (wide ? measure(sans, 11, hint).width : measure(sans, 12, 'Overshoot').width * 1.08) / 2 + 4;
    const cx = Math.min(W - half, Math.max(half, ox));
    svg.append(
      svgEl('line', { class: 'rule overshoot', x1: ox, x2: ox, y1: o.down + 3, y2: calloutY - 14 }),
      svgEl('text', { class: 'name overshoot', x: cx, y: calloutY, 'text-anchor': 'middle' }, 'Overshoot'),
    );
    if (wide) svg.append(svgEl('text', { class: 'hint', x: cx, y: calloutY + 13, 'text-anchor': 'middle' }, hint));
  }
  inner.append(svg);
}

// Code inside a sentence: once at the same font size, once at the same x-height.
function xHeightMatch(host) {
  const serif = token('--serif');
  const mono = token('--mono');
  const text = 'wrap at ';
  const code = 'min-width';
  const xText = measure(serif, 100, 'x').up / 100;
  const xCode = measure(mono, 100, 'x').up / 100;
  const ratio = xText / xCode;
  const unitWidth = (k) => (measure(serif, 100, text).width + k * measure(mono, 100, code).width) / 100;

  const cases = [
    { label: 'Bad: same font size', k: 1 },
    { label: 'Good: same x-height', k: ratio },
  ];
  for (const c of cases) {
    const { box, inner, width: W } = panel(host);
    const S = Math.max(16, Math.floor(Math.min(56, (W - 8) / Math.max(unitWidth(1), unitWidth(ratio)))));
    const note =
      c.k === 1
        ? `Text and code both at ${px(S)}. The x-height is ${px(xText * S)} in the text and ${px(xCode * S)} in the code.`
        : `Code at ${px(S * c.k)} in ${px(S)} text. The x-height is ${px(xText * S)} in both.`;
    box.prepend(htmlEl('p', 'figure-label', c.label), htmlEl('p', 'figure-note', note));

    const base = S * 1.15;
    const svg = svgEl('svg', {
      class: 'type-figure',
      width: W,
      height: S * 1.55,
      viewBox: `0 0 ${W} ${(S * 1.55).toFixed(1)}`,
      role: 'img',
      'aria-label': `The words "${text}${code}", with "${code}" in the code font. ${note}`,
    });
    const line = svgEl('text', { class: 'glyphs', x: 4, y: base, 'font-size': S, 'font-family': serif, 'xml:space': 'preserve' });
    line.style.whiteSpace = 'pre';
    line.append(text, svgEl('tspan', { 'font-family': mono, 'font-size': S * c.k }, code));
    svg.append(
      line,
      svgEl('line', { class: 'rule baseline', x1: 0, x2: W, y1: base, y2: base }),
      svgEl('line', { class: 'rule x dashed', x1: 0, x2: W, y1: base - xText * S, y2: base - xText * S }),
    );
    inner.append(svg);
  }
  const key = htmlEl('ul', 'figure-key');
  for (const [cls, label] of [['baseline', 'Baseline'], ['x dashed', 'x-height of the text font']]) {
    const li = htmlEl('li');
    li.append(htmlEl('i', cls), label);
    key.append(li);
  }
  host.append(key);
}

// A tall panel, a small box, and a short panel in a row: once top-aligned, once on a shared centre line.
function centreLine(host) {
  const cases = [
    { label: 'Top edges on one line', note: 'The tops line up, so the short items hang from the top.', align: 'top' },
    { label: 'Centres on one line', note: 'Each midpoint sits on the same line, so the row reads as one band.', align: 'centre' },
  ];
  for (const c of cases) {
    const { box, inner, width: W } = panel(host);
    box.prepend(htmlEl('p', 'figure-label', c.label), htmlEl('p', 'figure-note', c.note));

    const H = 140;
    const pad = 10;
    const gap = Math.max(12, W * 0.06);
    const panelW = Math.min(180, (W - 4 * gap) * 0.36);
    const smallW = Math.min(64, (W - 4 * gap) * 0.18);
    const rowW = 2 * panelW + smallW + 2 * gap;
    const x0 = (W - rowW) / 2;
    const items = [
      { x: x0, w: panelW, h: H - 2 * pad },
      { x: x0 + panelW + gap, w: smallW, h: 32 },
      { x: x0 + panelW + gap + smallW + gap, w: panelW, h: 64 },
    ];
    const lineY = c.align === 'top' ? pad : H / 2;
    const topOf = (it) => (c.align === 'top' ? pad : H / 2 - it.h / 2);

    const svg = svgEl('svg', {
      class: 'type-figure',
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      role: 'img',
      'aria-label': `A tall panel, a small box, and a short panel in a row. ${c.note}`,
    });
    for (const it of items) {
      svg.append(svgEl('rect', { class: 'shape', x: it.x, y: topOf(it), width: it.w, height: it.h, rx: 6 }));
    }
    svg.append(svgEl('line', { class: 'rule x dashed', x1: 0, x2: W, y1: lineY, y2: lineY }));
    inner.append(svg);
  }
  const key = htmlEl('ul', 'figure-key');
  const li = htmlEl('li');
  li.append(htmlEl('i', 'x'), 'The shared line');
  key.append(li);
  host.append(key);
}

const FIGURES = { 'font-lines': fontLines, 'x-height-match': xHeightMatch, 'centre-line': centreLine };

// Draws every figure inside root, and again whenever its width changes.
export function mountFigures(root) {
  for (const figure of root.querySelectorAll('figure[data-figure]')) {
    const draw = FIGURES[figure.dataset.figure];
    if (!draw) continue;
    const host = htmlEl('div', 'figure-body');
    figure.prepend(host);
    let last = 0;
    new ResizeObserver(() => {
      const width = host.clientWidth;
      if (!width || width === last) return;
      last = width;
      host.replaceChildren();
      draw(host);
    }).observe(host);
  }
}
