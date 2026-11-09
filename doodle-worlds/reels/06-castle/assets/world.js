/* world.js — Medieval ("The king wanted a perfect castle"). Cast: King Aldo (crown, beard, red robe), Wren (peasant builder).
   Set: rolling hills, a castle site that never starts (pegs + a planning tent), the king's planning table (foreground left),
   Wren's low fence (foreground right) and her hut that improves (patched roof, chimney + fire, window light, flower box);
   winter (snow on everything, falling snow). Props: the blueprint scroll (towers, gates, moat, swans), plan pile, spyglass,
   hammer, gold coins, the MVP card. Original designs; clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.KING = { hairStyle: "short", hair: "#D9D2C6", beard: 1, mustache: 1, skin: "#F0C7A4", outfit: "robe", cloth: "#B83A3A", cloth2: "#F2C14E", hat: "crown", thickBrows: 1, blush: 0.5 };
  W.WREN = { hairStyle: "bob", hair: "#8A5A3A", skin: "#E9B48A", outfit: "tunic", cloth: "#7FA05A", hat: "none", blush: 0.6 };

  W.land = (p, { snow = 0, t = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: lerpC("#BFE3F5", "#C9D3DE", snow) }, g);
    for (let i = 0; i < 3; i++) el("ellipse", { cx: 100 + i * 420 + Math.sin(t * 0.2 + i) * 20, cy: 380 + i * 40, rx: 150, ry: 50, fill: WH, stroke: INK, "stroke-width": 5, opacity: 0.9 }, g);
    el("path", { d: "M-700,1000 Q-200,860 300,980 Q800,880 1300,990 Q1600,930 1800,1000 L1800,2600 L-700,2600 Z", fill: lerpC("#9CC27A", "#EEF3F7", snow), stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-700,1180 Q300,1120 1800,1190 L1800,2600 L-700,2600 Z", fill: lerpC("#88B068", "#E2E9EF", snow), stroke: INK, "stroke-width": 7 }, g);
    // the castle site on the far hill: pegs, string, a planning tent (never more)
    const sg = el("g", { transform: "translate(560 985) scale(0.8)" }, g);
    for (let i = 0; i < 6; i++) el("line", { x1: -150 + i * 60, y1: 0, x2: -150 + i * 60, y2: -40, stroke: "#7A5230", "stroke-width": 7 }, sg);
    el("path", { d: "M-150,-30 L150,-30", stroke: "#E5484D", "stroke-width": 3, "stroke-dasharray": "8 6" }, sg);
    el("path", { d: "M90,0 L150,-110 L210,0 Z", fill: lerpC("#F2C14E", "#F3F5F8", snow), stroke: INK, "stroke-width": 5 }, sg); K.txt(sg, 150, -130, "SITE", 26, INK);
    return g; };
  // Wren's hut: build 0..1, then upgrades: roof (patch), fire (chimney + glow), window (light), flowers; snow cap
  W.hut = (p, { x, y, s = 1, build = 1, roof = 0, fire = 0, window = 0, flowers = 0, snow = 0, t = 0, wobble = 0 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${Math.sin(t * 9) * 3 * wobble}) scale(${s})` }, p);
    if (fire > 0) { el("rect", { x: 90, y: -360, width: 60, height: 120, fill: "#9A8F86", stroke: INK, "stroke-width": 6 }, g);
      for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; el("circle", { cx: 120 + Math.sin(ph * 6) * 16, cy: -380 - ph * 200, r: 18 + ph * 26, fill: "#E3E6EA", opacity: 0.8 * (1 - ph) * fire }, g); } }
    const id = "hut" + Math.round(build * 100), cp = el("clipPath", { id }, g); el("rect", { x: -260, y: -400 * build, width: 520, height: 420 }, cp);
    const hg = el("g", { "clip-path": `url(#${id})` }, g);
    el("rect", { x: -170, y: -200, width: 340, height: 200, fill: "#C9935E", stroke: INK, "stroke-width": 7 }, hg);
    for (let i = 0; i < 4; i++) el("line", { x1: -170, y1: -160 + i * 44, x2: 170, y2: -160 + i * 44, stroke: "#9A6A3E", "stroke-width": 4 }, hg);
    el("path", { d: "M-220,-190 L0,-330 L220,-190 Z", fill: lerpC("#D9B25A", "#F3F5F8", snow * 0.85), stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, hg);
    for (let i = 0; i < 3; i++) el("path", { d: `M${-180 + i * 30},${-210 - i * 34} L${180 - i * 30},${-210 - i * 34}`, stroke: lerpC("#B8913E", "#D5DCE4", snow), "stroke-width": 5 }, hg);
    if (roof > 0) { el("rect", { x: -60, y: -280, width: 90, height: 50, rx: 6, fill: "#8A6A3E", stroke: INK, "stroke-width": 5, transform: "rotate(-14 -15 -255)", opacity: roof }, hg);
      el("path", { d: "M-50,-270 l70,-12 M-48,-246 l70,-12", stroke: INK, "stroke-width": 3, opacity: roof }, hg); }
    el("path", { d: "M-40,0 L-40,-120 Q0,-150 40,-120 L40,0 Z", fill: "#6B4428", stroke: INK, "stroke-width": 6 }, hg);
    if (window > 0) { el("rect", { x: 70, y: -150, width: 70, height: 64, rx: 6, fill: lerpC("#3A2A1E", "#FFD97A", window), stroke: INK, "stroke-width": 6 }, hg);
      el("path", { d: "M105,-150 L105,-86 M70,-118 L140,-118", stroke: INK, "stroke-width": 5 }, hg);
      if (window > 0.5) el("ellipse", { cx: 105, cy: -40, rx: 90, ry: 30, fill: "#FFE7A0", opacity: 0.4 * window }, hg); }
    if (flowers > 0) { el("rect", { x: -150, y: -110, width: 80, height: 26, fill: "#8A5A3A", stroke: INK, "stroke-width": 5 }, hg);
      for (let i = 0; i < 3; i++) { const fx = -136 + i * 26; el("line", { x1: fx, y1: -110, x2: fx, y2: -140 * flowers, stroke: "#4E8A3A", "stroke-width": 5 }, hg); el("circle", { cx: fx, cy: -146 * flowers, r: 11 * flowers, fill: ["#FF8FB1", "#F2C14E", "#E5484D"][i], stroke: INK, "stroke-width": 3 }, hg); } }
    if (snow > 0) el("path", { d: "M-226,-188 Q-120,-236 0,-334 Q120,-236 226,-188 Q200,-170 170,-184 Q120,-160 80,-186 Q30,-164 0,-188 Q-40,-164 -80,-186 Q-130,-160 -170,-184 Q-200,-170 -226,-188 Z", fill: WH, stroke: INK, "stroke-width": 5, opacity: snow }, g);
    return g; };
  W.table = (p, { x0 = -300, x1 = 560, y = 1405, snow = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: x0, y: y + 26, width: x1 - x0, height: 900, fill: "#8A5A3A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 6; i++) el("line", { x1: x0 + 20, y1: y + 80 + i * 60, x2: x1 - 20, y2: y + 80 + i * 60, stroke: "#6B4428", "stroke-width": 4 }, g);
    el("rect", { x: x0 - 16, y, width: x1 - x0 + 32, height: 36, rx: 8, fill: "#A8754A", stroke: INK, "stroke-width": 8 }, g);
    if (snow > 0) el("path", { d: `M${x0 - 16},${y + 4} Q${(x0 + x1) / 2},${y - 40 * snow} ${x1 + 16},${y + 4} Z`, fill: WH, stroke: INK, "stroke-width": 5 }, g); return g; };
  W.fence = (p, { x0 = 560, x1 = 1400, y = 1405, snow = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: x0, y: y + 26, width: x1 - x0, height: 900, fill: "#B8895A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 10; i++) el("path", { d: `M${x0 + 30 + i * 90},${y + 26} L${x0 + 30 + i * 90},${y - 30} L${x0 + 50 + i * 90},${y - 50} L${x0 + 70 + i * 90},${y - 30} L${x0 + 70 + i * 90},${y + 26}`, fill: "#D9B07A", stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: x0, y: y - 10, width: x1 - x0, height: 26, fill: "#C9935E", stroke: INK, "stroke-width": 6 }, g);
    if (snow > 0) el("rect", { x: x0, y: y - 26, width: x1 - x0, height: 18 * snow, rx: 8, fill: WH, stroke: INK, "stroke-width": 4 }, g); return g; };
  // the blueprint scroll: items 0..4 drawn (towers, gates, moat, swans)
  W.plans = (p, { x, y, s = 1, rot = 0, open = 1, items = 0, flap = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot + Math.sin(t * 9) * 3 * flap}) scale(${s})` }, p);
    const w0 = 560 * open; el("rect", { x: -w0 / 2, y: -200, width: w0, height: 400, fill: "#BFD9F2", stroke: INK, "stroke-width": 7 }, g);
    for (const sd of [-1, 1]) el("rect", { x: sd * w0 / 2 - 22, y: -214, width: 44, height: 428, rx: 20, fill: "#E8D9B5", stroke: INK, "stroke-width": 6 }, g);
    if (open > 0.9) { const ink = "#2F6FB0";
      if (items > 0) for (let i = 0; i < 7; i++) { const tx = -220 + i * 38, th = 120 + (i % 3) * 30; el("rect", { x: tx, y: 60 - th, width: 26, height: th, fill: "none", stroke: ink, "stroke-width": 4 }, g); el("path", { d: `M${tx - 4},${60 - th} l17,-24 l17,24`, fill: "none", stroke: ink, "stroke-width": 4 }, g); }
      if (items > 1) { el("path", { d: "M60,60 L60,-40 Q110,-90 160,-40 L160,60", fill: "none", stroke: "#C48E1C", "stroke-width": 6 }, g); K.txt(g, 110, 0, "GOLD", 22, "#C48E1C"); }
      if (items > 2) el("path", { d: "M-240,110 Q0,150 240,110", fill: "none", stroke: ink, "stroke-width": 10 }, g);
      if (items > 3) for (const sx of [-120, 120]) el("path", { d: `M${sx},120 q-18,-6 -24,-28 q14,4 18,14 q4,-26 22,-18 q8,18 -16,32 Z`, fill: WH, stroke: ink, "stroke-width": 4 }, g);
      K.txt(g, 0, -150, "THE PERFECT CASTLE", 30, ink); }
    return g; };
  W.pile = (p, { x, y, n = 0, s = 1 }) => { for (let i = 0; i < n; i++) { const g = el("g", { transform: `translate(${x + (i % 2 ? 14 : -10)} ${y - i * 26}) rotate(${(i % 3 - 1) * 8}) scale(${s})` }, p);
      el("rect", { x: -150, y: -18, width: 300, height: 36, rx: 16, fill: "#BFD9F2", stroke: INK, "stroke-width": 5 }, g); for (const sd of [-1, 1]) el("circle", { cx: sd * 150, cy: 0, r: 20, fill: "#E8D9B5", stroke: INK, "stroke-width": 5 }, g); } };
  W.hammer = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -8, y: -10, width: 16, height: 120, rx: 6, fill: "#A8754A", stroke: INK, "stroke-width": 5 }, g); el("rect", { x: -40, y: -40, width: 80, height: 34, rx: 6, fill: "#9AA6B3", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.spyglass = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("path", { d: "M0,-14 L150,-24 L150,24 L0,14 Z", fill: "#C48E1C", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: 140, y: -28, width: 24, height: 56, rx: 6, fill: "#8A6A3E", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.snowfall = (p, { t, k = 1 }) => { if (k <= 0) return; const r = MK.rng(5); for (let i = 0; i < 60; i++) { const x0 = r() * 1600 - 260, sp = 120 + r() * 160, y = ((r() * 2000 + t * sp) % 2100) - 200;
      el("circle", { cx: x0 + Math.sin(t * 1.5 + i) * 30, cy: y, r: 6 + r() * 6, fill: WH, stroke: "#C9D3DE", "stroke-width": 2, opacity: k }, p); } };
  W.drip = (p, { x, y, t }) => { for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; el("path", { d: `M${x},${y + ph * 140} q8,16 0,24 q-8,-8 0,-24 Z`, fill: "#7FB3D5", stroke: INK, "stroke-width": 3, opacity: 1 - ph }, p); } };
  W.mvp = (p, { x, y, s = 1, k = 1, stage = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -460, y: -260, width: 920, height: 520, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    [["BUILD SMALL", { build: 1 }], ["LEARN", { build: 1, roof: 1 }], ["IMPROVE", { build: 1, roof: 1, fire: 1, window: 1, flowers: 1 }]].forEach(([lab, h], i) => {
      const kk = clamp(stage - i); if (kk <= 0) return; const cx = -300 + i * 300;
      W.hut(g, Object.assign({ x: cx, y: 80, s: 0.55 * E2(kk), t }, h)); K.txt(g, cx, 170, lab, 40, i === 2 ? "#3FB8AF" : INK);
      if (i > 0) K.arrow(g, { x1: cx - 220, y1: -40, x2: cx - 90, y2: -40, k: 1, color: "#E9A23B" }); });
    return g; };
  const E2 = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 6 · MEDIEVAL · \"The king wanted a perfect castle\" — cast & props", 46);
    [["King Aldo", W.KING, F.smug], ["King: forty towers!", W.KING, F.shout], ["King: a hut? how tiny", W.KING, { eyes: "half", lid: 0.4, mouth: "frown", look: [1, 0] }], ["King: shivering", W.KING, Object.assign({}, F.worried, { sweat: 0 })], ["Wren", W.WREN, F.happy], ["Wren: two coins", W.WREN, F.smug]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    const box = (x, y, w, h, id, fn, label) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s);
      fn(el("g", { transform: `translate(${x} ${y}) scale(0.62) translate(0 -600)` }, g)); lab(x + w / 2, y + h + 40, label); };
    box(60, 760, 1100, 820, "a", (g) => { W.land(g, { t: 0.2 }); W.hut(g, { x: 860, y: 1250, s: 0.9, build: 1, t: 0.2 }); W.table(g, {}); W.fence(g, {}); W.plans(g, { x: 300, y: 1300, s: 0.6, items: 4 }); }, "the kingdom: castle site, the king's table, Wren's hut");
    box(1240, 760, 1100, 820, "b", (g) => { W.land(g, { snow: 1, t: 0.2 }); W.hut(g, { x: 860, y: 1250, s: 0.9, roof: 1, fire: 1, window: 1, flowers: 1, snow: 1, t: 0.2 }); W.table(g, { snow: 1 }); W.fence(g, { snow: 1 }); W.snowfall(g, { t: 0.4 }); }, "winter: the hut, upgraded");
    W.plans(s, { x: 400, y: 1950, s: 0.7, items: 4 }); W.pile(s, { x: 820, y: 2050, n: 5, s: 0.6 }); lab(600, 2140, "the blueprint / the plan pile");
    W.hut(s, { x: 1150, y: 2050, s: 0.5, build: 0.6, wobble: 1, t: 0.1 }); W.hut(s, { x: 1400, y: 2050, s: 0.5, roof: 1, t: 0.1 }); W.drip(s, { x: 1380, y: 1910, t: 0.3 }); lab(1275, 2140, "the hut: building / patched");
    W.hammer(s, { x: 1650, y: 1950 }); W.spyglass(s, { x: 1800, y: 1960 }); Kit.coin(s, { x: 2100, y: 1960, s: 0.6, sym: "" }); Kit.coin(s, { x: 2200, y: 1990, s: 0.6, sym: "" }); lab(1900, 2140, "hammer / spyglass / gold");
    W.mvp(s, { x: 1200, y: 2450, s: 0.55, stage: 3, t: 0.2 }); lab(1200, 2640, "the MVP card");
  };
  root.World = W;
})(window);
