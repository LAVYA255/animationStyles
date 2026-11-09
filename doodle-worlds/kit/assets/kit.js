/* kit.js: props shared by every "Weird Worlds" reel (same clean marker style as person.js). A world adds its own pieces in
   assets/world.js; anything reused twice moves here. Every draw is a pure function of its params. */
(function (root) {
  const el = Person.el, INK = "#1d1b1a", WH = "#ffffff", OR = "#D97757", GOLD = "#F2C14E", GOLDD = "#C48E1C", RED = "#E5484D", TL = "#3FB8AF", TLD = "#24857E";
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const txt = (p, x, y, s, size, fill = INK, anchor = "middle", extra = {}) => { const t = el("text", Object.assign({ x, y, "text-anchor": anchor, "font-family": window.FONT || "Permanent Marker", "font-size": size, fill }, extra), p); t.textContent = s; return t; };
  const K = { txt };

  // speech / thought bubble with text (and an optional emoji-like icon drawn by fn). k = pop 0..1; tail = [x, y] in local space
  K.bubble = (p, { x, y, k = 1, text = "", size = 40, tail = [-40, 90], tone = WH, rot = 0, think = 0, icon = null, w = null }) => {
    if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${k})` }, p);
    const W = w || Math.max(140, text.length * size * 0.56 + (icon ? 90 : 60)), H = size * 2.3;
    if (think) { for (const [i, r] of [[0, 18], [1, 11]]) el("circle", { cx: tail[0] * (0.55 + i * 0.35), cy: H / 2 + (tail[1] - H / 2) * (0.5 + i * 0.4), r, fill: tone, stroke: INK, "stroke-width": 5 }, g); }
    else el("path", { d: `M${tail[0] - 26},${H / 2 - 6} L${tail[0]},${tail[1]} L${tail[0] + 24},${H / 2 - 6} Z`, fill: tone, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    el("rect", { x: -W / 2, y: -H / 2, width: W, height: H, rx: H / 2.2, fill: tone, stroke: INK, "stroke-width": 6 }, g);
    if (!think) el("rect", { x: tail[0] - 24, y: H / 2 - 12, width: 46, height: 14, fill: tone }, g);
    if (icon) { const ig = el("g", { transform: `translate(${-W / 2 + 54} 0)` }, g); icon(ig); txt(g, 30, size * 0.36, text, size); }
    else txt(g, 0, size * 0.36, text, size);
    return g; };
  // a sheet: paper / scroll / stone tablet / screen with a title and lines (lines: [{text, tick 0..1, color}] or strings). k = scale
  K.sheet = (p, { x, y, s = 1, rot = 0, kind = "paper", title = "", lines = [], write = 99, w = 560, h = 700, size = 42 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    const fill = { paper: "#F7F2E6", scroll: "#EED9A8", stone: "#B9B2A6", screen: "#20303A", clay: "#C98A5B" }[kind] || "#F7F2E6", ink = kind === "screen" ? "#B5E8E3" : INK;
    if (kind === "scroll") { el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, fill, stroke: INK, "stroke-width": 7 }, g);
      for (const sy of [-h / 2, h / 2]) el("rect", { x: -w / 2 - 30, y: sy - 22, width: w + 60, height: 44, rx: 22, fill: "#C9A46A", stroke: INK, "stroke-width": 7 }, g); }
    else if (kind === "stone" || kind === "clay") { el("path", { d: `M${-w / 2 + 30},${-h / 2} L${w / 2 - 20},${-h / 2 + 10} L${w / 2},${h / 2 - 30} L${w / 2 - 40},${h / 2} L${-w / 2 + 10},${h / 2 - 10} L${-w / 2},${-h / 2 + 40} Z`, fill, stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
      for (const [cx, cy] of [[-w / 3, h / 3], [w / 4, -h / 3]]) el("path", { d: `M${cx},${cy} l18,10 l-6,16`, fill: "none", stroke: "rgba(0,0,0,.25)", "stroke-width": 4 }, g); }
    else { el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: kind === "screen" ? 30 : 16, fill, stroke: INK, "stroke-width": 8 }, g);
      if (kind === "paper") for (let i = 0; i < 9; i++) el("line", { x1: -w / 2 + 40, y1: -h / 2 + 150 + i * 62, x2: w / 2 - 40, y2: -h / 2 + 150 + i * 62, stroke: "#C9D9E8", "stroke-width": 3 }, g); }
    if (title) txt(g, 0, -h / 2 + 90, title, size * 1.15, kind === "screen" ? "#B5E8E3" : OR);
    lines.forEach((ln, i) => { const L0 = typeof ln === "string" ? { text: ln } : ln, k = clamp(write - i); if (k <= 0) return; const yy = -h / 2 + 190 + i * (size * 1.7);
      const id = "sh" + Math.round(x) + "_" + Math.round(y) + "_" + i, cl = el("clipPath", { id }, g); el("rect", { x: -w / 2, y: yy - size, width: w * k, height: size * 1.5 }, cl);
      const lg = el("g", { "clip-path": `url(#${id})` }, g);
      if (L0.tick !== undefined) { el("rect", { x: -w / 2 + 40, y: yy - size * 0.8, width: size, height: size, rx: 8, fill: kind === "screen" ? "#20303A" : WH, stroke: ink, "stroke-width": 5 }, lg);
        if (L0.tick > 0) el("path", { d: `M${-w / 2 + 48},${yy - size * 0.35} l${size * 0.3},${size * 0.35} l${size * 0.55},${-size * 0.75}`, fill: "none", stroke: TLD, "stroke-width": 10, "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-dasharray": 120, "stroke-dashoffset": 120 * (1 - clamp(L0.tick)) }, lg);
        txt(lg, -w / 2 + 60 + size, yy, L0.text, size, L0.color || ink, "start"); }
      else txt(lg, -w / 2 + 44, yy, L0.text, size, L0.color || ink, "start"); });
    return g; };
  // coin (spin 0..1 squashes it), with an optional ribbon label
  K.coin = (p, { x, y, s = 1, rot = 0, spin = 0, label = "", sym = "$", fill = GOLD }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p), sx = Math.max(0.12, Math.abs(Math.cos(spin * Math.PI)));
    const c = el("g", { transform: `scale(${sx} 1)` }, g);
    el("circle", { cx: 0, cy: 0, r: 90, fill, stroke: INK, "stroke-width": 7 }, c); el("circle", { cx: 0, cy: 0, r: 66, fill: "none", stroke: GOLDD, "stroke-width": 7 }, c);
    if (sx > 0.5 && sym) txt(c, 0, 32, sym, 96, GOLDD);
    if (label) { const r = el("g", { transform: "translate(0 112)" }, g); el("path", { d: "M-120,-28 L120,-28 L104,0 L120,28 L-120,28 L-104,0 Z", fill: TL, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, r); txt(r, 0, 13, label, 36, WH); }
    return g; };
  // a notification card (screen space friendly). k = slide-in 0..1
  K.card = (p, { x, y, k = 1, title = "", value = "", icon = "₹", tone = TL, from = 700 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x + (1 - k) * from} ${y})` }, p);
    el("rect", { x: -230, y: -64, width: 460, height: 128, rx: 30, fill: WH, stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: -168, cy: 0, r: 38, fill: tone, stroke: INK, "stroke-width": 5 }, g); txt(g, -168, 16, icon, 44, WH);
    txt(g, -112, -12, title, 32, "#666", "start"); txt(g, -112, 38, value, 44, TLD, "start"); return g; };
  // a big number display (counter), n animated by the caller
  K.counter = (p, { x, y, s = 1, n = 0, label = "", rot = 0, tone = "#20303A", ink = "#B5E8E3", fmt = (v) => String(Math.round(v)) }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -190, y: -120, width: 380, height: 240, rx: 26, fill: tone, stroke: INK, "stroke-width": 7 }, g);
    txt(g, 0, 40, fmt(n), 130, ink); if (label) txt(g, 0, 96, label, 30, WH); return g; };
  // a hanging sign / plank with text
  K.sign = (p, { x, y, s = 1, rot = 0, text = "", w = 360, h = 110, fill = "#D9B48A", ink = INK, size = 50, hang = 1 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    if (hang) for (const sd of [-1, 1]) el("line", { x1: sd * w * 0.35, y1: -h / 2, x2: sd * w * 0.25, y2: -h / 2 - 60, stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill, stroke: INK, "stroke-width": 7 }, g); txt(g, 0, size * 0.36, text, size, ink); return g; };
  // fire (flicker by t), x,y = base centre
  K.fire = (p, { x, y, s = 1, t = 0, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    const f = (sc, c, ph) => { const j = Math.sin(t * 13 + ph) * 8, j2 = Math.sin(t * 9 + ph * 2) * 6;
      el("path", { d: `M${-60 * sc},0 C${-80 * sc},${-60 * sc} ${-30 * sc + j2},${-90 * sc} ${-10 * sc},${-150 * sc + j} C${0},${-110 * sc} ${30 * sc},${-120 * sc + j2} ${24 * sc + j},${-190 * sc} C${70 * sc},${-130 * sc} ${80 * sc},${-60 * sc} ${60 * sc},0 Z`, fill: c, stroke: sc > 0.8 ? INK : "none", "stroke-width": 6, "stroke-linejoin": "round" }, g); };
    f(1, "#FF8A3D", 0); f(0.7, "#FFC93C", 1); f(0.4, "#FFF3B0", 2); return g; };
  // simple background crowd head (silhouette-ish), for tribes / crowds
  K.crowd = (p, { x, y, s = 1, tone = "#8C7B6B", n = 5, spread = 90, t = 0, seed = 1 }) => { const g = el("g", {}, p);
    for (let i = 0; i < n; i++) { const r = MK.rng(seed + i * 7), xx = x + (i - (n - 1) / 2) * spread + (r() - 0.5) * 20, yy = y + (r() - 0.5) * 16 + Math.sin(t * 3 + i) * 3, sc = s * (0.85 + r() * 0.3);
      el("path", { d: `M${xx - 60 * sc},${yy + 120 * sc} Q${xx - 60 * sc},${yy + 30 * sc} ${xx},${yy + 30 * sc} Q${xx + 60 * sc},${yy + 30 * sc} ${xx + 60 * sc},${yy + 120 * sc} Z`, fill: tone, stroke: INK, "stroke-width": 5 }, g);
      el("circle", { cx: xx, cy: yy - 20 * sc, r: 44 * sc, fill: tone, stroke: INK, "stroke-width": 5 }, g); } return g; };
  K.stars = (p, { w = 1400, h = 2200, n = 80, t = 0, seed = 3, x0 = -200, y0 = -200 }) => { const r = MK.rng(seed);
    for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + r() * h, s = 2 + r() * 4; el("circle", { cx: x, cy: y, r: s * (0.7 + 0.3 * Math.sin(t * 3 + i)), fill: "#FFF6D8" }, p); } };
  K.arrow = (p, { x1, y1, x2, y2, k = 1, color = OR }) => { if (k <= 0) return; const x = lerp(x1, x2, k), y = lerp(y1, y2, k), a = Math.atan2(y - y1, x - x1);
    el("path", { d: `M${x1},${y1} Q${(x1 + x) / 2 + 30},${(y1 + y) / 2 - 40} ${x},${y}`, fill: "none", stroke: color, "stroke-width": 12, "stroke-linecap": "round" }, p);
    el("path", { d: `M${x},${y} l${-30 * Math.cos(a - 0.5)},${-30 * Math.sin(a - 0.5)} M${x},${y} l${-30 * Math.cos(a + 0.5)},${-30 * Math.sin(a + 0.5)}`, stroke: color, "stroke-width": 12, "stroke-linecap": "round" }, p); };
  K.label = (p, { x, y, text, size = 46, k = 1, tone = WH, ink = INK, rot = -3 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${k})` }, p), W = text.length * size * 0.6 + 50;
    el("rect", { x: -W / 2, y: -size * 0.8, width: W, height: size * 1.5, rx: 12, fill: tone, stroke: INK, "stroke-width": 5 }, g); txt(g, 0, size * 0.3, text, size, ink); return g; };
  K.COL = { INK, WH, OR, GOLD, GOLDD, RED, TL, TLD };
  root.Kit = K;
})(window);
