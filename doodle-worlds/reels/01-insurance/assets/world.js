/* world.js — Stone Age ("How insurance was invented"). Cast: Thog (the inventor), Bonk (the neighbour). Set: sky (sun/moon),
   hills, huts (burn / ash / rebuild), a foreground rock. Props: the clay pot of fish, fish, torch, the stone-age lightbulb
   (a tiny flame idea), the cave-wall diagram. Original designs; clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.THOG = { hairStyle: "wild", hair: "#B8502A", beard: 1, skin: "#E9B48A", outfit: "fur", cloth: "#8B5A2B", cloth2: "#6B4423", thickBrows: 1, blush: 0.3 };
  W.BONK = { hairStyle: "spiky", hair: "#2A1E1A", beard: 0.4, skin: "#C98E62", outfit: "fur", cloth: "#9A9184", cloth2: "#77705F", thickBrows: 1, blush: 0.2 };

  // sky: phase 0 = day, 1 = dusk, 2 = night (blends); sun / moon positions by arc 0..1; moonPhase 0..1 (new -> full)
  W.sky = (p, { phase = 0, sun = 0.3, moon = -1, moonPhase = 1 }) => {
    const top = phase < 1 ? lerpC("#9ED8F0", "#F4A261", phase) : lerpC("#F4A261", "#1E2A4A", phase - 1);
    const bot = phase < 1 ? lerpC("#E6F6FB", "#FFE0A8", phase) : lerpC("#FFE0A8", "#3A4A72", phase - 1);
    const id = "skyg" + Math.round(phase * 100); const d = el("defs", {}, p), lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: "0", "stop-color": top }, lg); el("stop", { offset: "1", "stop-color": bot }, lg);
    el("rect", { x: -600, y: -600, width: 2300, height: 2000, fill: `url(#${id})` }, p);
    if (sun >= 0 && phase < 1.6) { const a = Math.PI * (1 - sun); el("circle", { cx: 540 + Math.cos(a) * 520, cy: 980 - Math.sin(a) * 620, r: 70, fill: "#FFD45C", stroke: INK, "stroke-width": 6 }, p); }
    if (moon >= 0) { const a = Math.PI * (1 - moon), mx = 540 + Math.cos(a) * 480, my = 900 - Math.sin(a) * 560;
      el("circle", { cx: mx, cy: my, r: 58, fill: "#FFF4C8", stroke: INK, "stroke-width": 6 }, p);
      if (moonPhase < 1) el("circle", { cx: mx + 116 * moonPhase - 10, cy: my - 4, r: 56, fill: top }, p); }
    if (phase > 1.4) K.stars(p, { w: 1700, h: 1100, n: 50, x0: -300, y0: -300, seed: 9 });
  };
  W.ground = (p, { tone = 0 }) => { const g = el("g", {}, p);
    el("path", { d: "M-600,1180 Q-200,1040 200,1150 Q600,1060 1000,1140 Q1400,1060 1700,1150 L1700,2600 L-600,2600 Z", fill: lerpC("#9CC27A", "#4F6A52", tone), stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-600,1260 Q100,1210 800,1250 Q1300,1230 1700,1270 L1700,2600 L-600,2600 Z", fill: lerpC("#C9A66B", "#6E5A43", tone), stroke: INK, "stroke-width": 7 }, g);
    for (const [x, y, s] of [[-120, 1200, 1], [980, 1190, 0.8], [1250, 1215, 1.1]]) for (let i = -2; i <= 2; i++)
      el("path", { d: `M${x},${y} q${i * 18},-50 ${i * 30},-90`, fill: "none", stroke: "#4E7A3A", "stroke-width": 10 * s, "stroke-linecap": "round" }, g);
    return g; };
  // a hut: x,y = ground centre. burn 0..1 flames; ash 0..1 collapses to a smoking pile; build 0..1 (0 = only poles); t for flicker
  W.hut = (p, { x, y, s = 1, burn = 0, ash = 0, build = 1, t = 0, door = 1 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    if (ash > 0.5) { el("path", { d: "M-170,0 Q-120,-60 -40,-50 Q0,-90 50,-55 Q130,-70 170,0 Z", fill: "#4A4442", stroke: INK, "stroke-width": 7 }, g);
      for (let i = 0; i < 5; i++) el("line", { x1: -120 + i * 60, y1: -20 - (i % 2) * 20, x2: -80 + i * 55, y2: -50 + (i % 3) * 12, stroke: "#2b2523", "stroke-width": 12, "stroke-linecap": "round" }, g);
      for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; el("circle", { cx: -40 + i * 40 + Math.sin(ph * 6) * 20, cy: -70 - ph * 260, r: 26 + ph * 40, fill: "#9a9a9a", opacity: 0.55 * (1 - ph) }, g); }
      return g; }
    const sq = 1 - ash * 0.6, hg = el("g", { transform: `scale(${1 + ash * 0.2} ${sq})` }, g);
    for (let i = -3; i <= 3; i++) el("line", { x1: i * 52, y1: 0, x2: i * 9, y2: -330, stroke: "#7A5230", "stroke-width": 14, "stroke-linecap": "round" }, hg);
    if (build > 0) { const id = "hc" + Math.round(x) + "_" + Math.round(build * 100); const cp = el("clipPath", { id }, hg); el("rect", { x: -260, y: -340 * build - 10, width: 520, height: 360 }, cp);
      const tg = el("g", { "clip-path": `url(#${id})` }, hg);
      el("path", { d: "M-190,0 Q-170,-220 0,-320 Q170,-220 190,0 Z", fill: lerpC("#C9A35A", "#3A302A", burn * 0.6), stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, tg);
      for (let r = 0; r < 4; r++) el("path", { d: `M${-170 + r * 22},${-40 - r * 66} Q0,${-90 - r * 70} ${170 - r * 22},${-40 - r * 66}`, fill: "none", stroke: lerpC("#A88440", "#2a2420", burn * 0.6), "stroke-width": 7 }, tg);
      if (door) el("path", { d: "M-46,0 Q-46,-120 0,-124 Q46,-120 46,0 Z", fill: "#3A2A1E", stroke: INK, "stroke-width": 6 }, tg); }
    if (burn > 0) { K.fire(g, { x: -70, y: -60, s: 0.9 * burn, t }); K.fire(g, { x: 60, y: -120, s: 1.1 * burn, t: t + 1 }); K.fire(g, { x: 0, y: -230, s: 0.8 * burn, t: t + 2 });
      for (let i = 0; i < 6; i++) { const ph = (t * 0.9 + i / 6) % 1; el("circle", { cx: Math.sin(i * 3 + t) * 80, cy: -300 - ph * 240, r: 5, fill: "#FFB347", opacity: 1 - ph }, g); } }
    return g; };
  W.rock = (p, { x0 = -300, x1 = 1380, y = 1405, tone = "#8E8A84" }) => { const g = el("g", {}, p);
    el("path", { d: `M${x0},${y + 30} Q${x0 + 120},${y - 30} ${x0 + 300},${y - 6} Q${(x0 + x1) / 2 - 100},${y - 46} ${(x0 + x1) / 2 + 80},${y - 12} Q${x1 - 260},${y - 50} ${x1 - 80},${y - 10} L${x1},${y + 40} L${x1},${y + 900} L${x0},${y + 900} Z`, fill: tone, stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
    for (const [cx, cy] of [[x0 + 260, y + 80], [(x0 + x1) / 2 + 120, y + 140], [x1 - 300, y + 60]]) el("path", { d: `M${cx},${cy} q30,-14 60,4`, fill: "none", stroke: "rgba(0,0,0,.25)", "stroke-width": 6, "stroke-linecap": "round" }, g);
    for (const [cx, cy, rx] of [[x0 + 380, y + 30, 90], [(x0 + x1) / 2 - 60, y + 26, 70], [x1 - 420, y + 34, 110]]) el("ellipse", { cx, cy, rx, ry: 18, fill: "#7FA05A", stroke: INK, "stroke-width": 5 }, g);   // moss
    for (let i = 0; i < 14; i++) { const r = MK.rng(i + 11), px = x0 + 200 + r() * (x1 - x0 - 400), py = y + 180 + r() * 360;
      el("ellipse", { cx: px, cy: py, rx: 16 + r() * 22, ry: 10 + r() * 12, fill: "#A5A19A", stroke: INK, "stroke-width": 4 }, g); }                 // pebbles
    for (const [bx, by] of [[x0 + 520, y + 300], [x1 - 520, y + 420]]) { el("path", { d: `M${bx},${by} l70,-14`, stroke: "#EDE6D6", "stroke-width": 14, "stroke-linecap": "round" }, g);
      for (const [ex, ey] of [[bx, by], [bx + 70, by - 14]]) for (const d of [-1, 1]) el("circle", { cx: ex, cy: ey + d * 8, r: 9, fill: "#EDE6D6", stroke: INK, "stroke-width": 3 }, g); }   // a bone or two
    return g; };
  W.fish = (p, { x, y, s = 1, rot = 0, tone = "#7FB3D5" }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("path", { d: "M-60,0 Q-20,-36 34,-14 L64,-34 L58,0 L64,34 L34,14 Q-20,36 -60,0 Z", fill: tone, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    el("circle", { cx: -36, cy: -6, r: 6, fill: INK }, g); el("path", { d: "M-6,-20 Q4,0 -6,20", fill: "none", stroke: INK, "stroke-width": 4 }, g); return g; };
  // the clay pot: fill 0..1 = fish pile height; x,y = bottom centre
  W.pot = (p, { x, y, s = 1, rot = 0, fill = 0, glow = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    if (glow > 0) el("circle", { cx: 0, cy: -130, r: 220, fill: "#FFE7A0", opacity: 0.5 * glow }, g);
    const n = Math.round(fill * 9);
    for (let i = 0; i < n; i++) W.fish(g, { x: -70 + (i % 3) * 70, y: -250 - Math.floor(i / 3) * 34, s: 0.7, rot: -60 + (i * 47) % 120, tone: ["#7FB3D5", "#F2A65A", "#9AD1A0"][i % 3] });
    el("path", { d: "M-130,-250 Q-170,-140 -110,-30 Q-80,0 0,0 Q80,0 110,-30 Q170,-140 130,-250 Z", fill: "#C46B3E", stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
    el("ellipse", { cx: 0, cy: -250, rx: 136, ry: 26, fill: "#A65A33", stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-130,-170 Q0,-140 130,-170", fill: "none", stroke: "#F2D06B", "stroke-width": 9 }, g);
    for (let i = -2; i <= 2; i++) el("path", { d: `M${i * 46 - 12},-110 l12,-18 l12,18`, fill: "none", stroke: "#F2D06B", "stroke-width": 6 }, g);
    return g; };
  W.torch = (p, { x, y, s = 1, rot = 0, t = 0, lit = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -12, y: -20, width: 24, height: 190, rx: 10, fill: "#7A5230", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-26,-20 L26,-20 L20,-50 L-20,-50 Z", fill: "#9A9184", stroke: INK, "stroke-width": 5 }, g);
    if (lit) K.fire(g, { x: 0, y: -46, s: 0.55, t }); return g; };
  // the stone-age lightbulb: a tiny flame in a thought burst over a head
  W.idea = (p, { x, y, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${k})` }, p);
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + t; el("line", { x1: Math.cos(a) * 90, y1: Math.sin(a) * 90, x2: Math.cos(a) * 130, y2: Math.sin(a) * 130, stroke: "#FFC93C", "stroke-width": 10, "stroke-linecap": "round" }, g); }
    el("circle", { cx: 0, cy: 0, r: 76, fill: WH, stroke: INK, "stroke-width": 6 }, g); K.fire(g, { x: 0, y: 40, s: 0.45, t }); return g; };
  // the cave-wall lesson: stage 0..4 draws: ten people -> arrows -> pot -> one hut saved
  W.caveWall = (p, { x, y, s = 1, stage = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-420,-330 Q-200,-380 0,-350 Q220,-390 420,-330 Q450,0 420,330 Q200,370 0,350 Q-200,380 -420,330 Q-450,0 -420,-330 Z", fill: "#B9A58A", stroke: INK, "stroke-width": 9 }, g);
    const paint = "#8B3A1E", stick = (cx, cy, sc) => { el("circle", { cx, cy: cy - 40 * sc, r: 14 * sc, fill: "none", stroke: paint, "stroke-width": 7 }, g);
      el("path", { d: `M${cx},${cy - 26 * sc} L${cx},${cy + 16 * sc} M${cx - 20 * sc},${cy - 8 * sc} L${cx + 20 * sc},${cy - 8 * sc} M${cx},${cy + 16 * sc} L${cx - 14 * sc},${cy + 44 * sc} M${cx},${cy + 16 * sc} L${cx + 14 * sc},${cy + 44 * sc}`, fill: "none", stroke: paint, "stroke-width": 7, "stroke-linecap": "round" }, g); };
    const n = Math.round(clamp(stage) * 10); for (let i = 0; i < n; i++) stick(-330 + (i % 5) * 60, -200 + Math.floor(i / 5) * 130, 1);
    if (stage > 1) { const k = clamp(stage - 1); el("path", { d: `M-40,-120 L${-40 + 140 * k},-120`, stroke: paint, "stroke-width": 10, "stroke-linecap": "round" }, g); if (k > 0.9) el("path", { d: "M80,-140 L104,-120 L80,-100", fill: "none", stroke: paint, "stroke-width": 10, "stroke-linecap": "round" }, g); }
    if (stage > 2) { const k = clamp(stage - 2); el("path", { d: "M160,-200 Q140,-120 180,-60 L260,-60 Q300,-120 280,-200 Z", fill: "none", stroke: paint, "stroke-width": 9, opacity: k }, g); }
    if (stage > 3) { const k = clamp(stage - 3); el("path", { d: `M220,-30 L220,${-30 + 120 * k}`, stroke: paint, "stroke-width": 10, "stroke-linecap": "round" }, g);
      if (k > 0.8) { el("path", { d: "M140,250 Q150,140 220,110 Q290,140 300,250 Z", fill: "none", stroke: paint, "stroke-width": 9 }, g); el("path", { d: "M200,250 Q200,200 220,196 Q240,200 240,250", fill: "none", stroke: paint, "stroke-width": 7 }, g); } }
    return g; };
  W.notes = (p, { x, y, t }) => { for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; K.txt(p, x + ph * 80 + Math.sin(ph * 7) * 12, y - ph * 140, i % 2 ? "♪" : "♫", 46 + ph * 20, INK, "middle", { opacity: Math.sin(ph * Math.PI) }); } };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555");
    lab(1200, 64, "WORLD 1 · STONE AGE · \"How insurance was invented\" — cast & props", 46);
    const F = Person.FACES;
    [["Thog", W.THOG, F.calm], ["Thog: sad", W.THOG, F.sad], ["Thog: idea!", W.THOG, F.happy], ["Bonk", W.BONK, F.smug], ["Bonk: panic", W.BONK, F.shout], ["Bonk: innocent", W.BONK, { eyes: "half", lid: 0.4, mouth: "o", open: 0.2, look: [-1, -0.6] }]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    W.idea(s, { x: 1000, y: 180, k: 0.7, t: 0.3 }); lab(1000, 300, "stone-age lightbulb");
    const box = (x, y, w, h, id) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s); return g; };
    [[0, 0.3, "day"], [1, 0.9, "dusk"], [2, -1, "night (moons pass)"]].forEach(([ph, sun, n], i) => { const g = box(60 + i * 780, 760, 740, 700, "b" + i), sg = el("g", { transform: `translate(${60 + i * 780} 760) scale(0.68) translate(0 -800)` }, g);
      W.sky(sg, { phase: ph, sun, moon: ph === 2 ? 0.4 : -1, moonPhase: 0.6 }); W.ground(sg, { tone: ph / 2 }); W.hut(sg, { x: 300, y: 1260, s: 0.9, t: 0.2, burn: i === 1 ? 1 : 0 }); W.hut(sg, { x: 800, y: 1250, s: 0.8, ash: i === 2 ? 1 : 0, t: 0.4 }); W.rock(sg, { y: 1500 }); lab(430 + i * 780, 1500, n); });
    W.hut(s, { x: 200, y: 1950, s: 0.6, build: 0.4 }); W.hut(s, { x: 450, y: 1950, s: 0.6, burn: 1, t: 0.5 }); W.hut(s, { x: 700, y: 1950, s: 0.6, ash: 1, t: 0.2 }); lab(450, 2000, "hut: building / burning / ash");
    W.pot(s, { x: 1000, y: 1980, s: 0.7, fill: 0.2 }); W.pot(s, { x: 1260, y: 1980, s: 0.7, fill: 1, glow: 1 }); lab(1130, 2030, "the pot: empty / full");
    W.fish(s, { x: 1500, y: 1860 }); W.fish(s, { x: 1520, y: 1950, tone: "#F2A65A", rot: 20 }); W.torch(s, { x: 1700, y: 1960, t: 0.3 }); lab(1600, 2030, "fish / torch");
    W.caveWall(s, { x: 2050, y: 1880, s: 0.42, stage: 4 }); lab(2050, 2060, "cave-wall diagram");
    K.bubble(s, { x: 600, y: 2300, text: "EVERY FIRE... ZERO.", size: 40, tail: [-60, 90] }); K.label(s, { x: 1300, y: 2320, text: "INSURANCE FRAUD", size: 50, tone: "#FFE0A8" }); lab(950, 2460, "bubble / stamp");
  };
  root.World = W;
})(window);
