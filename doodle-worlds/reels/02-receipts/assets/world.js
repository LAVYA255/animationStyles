/* world.js — Sumer, 3100 BC ("Humans invented writing for receipts"). Cast: Nisa (keeps the city's grain), Duru (cheeky farmer).
   Set: desert sky, ziggurat, mudbrick wall + doorway, date palms, granary sacks, a mudbrick counter (foreground), harvest wheat.
   Props: clay tablet (marks pressed one by one + a seal roll), reed stylus, cylinder seal, grain sack, beer jar with straws,
   a fancy poem scroll (for the hook's cross-out). Original designs; clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.NISA = { hairStyle: "long", hair: "#1E1614", skin: "#C68B5E", outfit: "robe", cloth: "#EFE3C6", cloth2: "#D9A441", earring: 1, blush: 0.4 };
  W.DURU = { hairStyle: "bald", hair: "#1E1614", beard: 1, skin: "#B97A4E", outfit: "fur", cloth: "#EFE6D2", cloth2: "#D9CCAE", thickBrows: 1, blush: 0.3 };
  const MUD = "#D9A86C", MUDD = "#B9864F", MUDL = "#E8C08A";

  W.set = (p, { harvest = 0, t = 0 }) => { const g = el("g", {}, p);
    const id = "sg" + Math.round(harvest * 100), d = el("defs", {}, g), lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: "0", "stop-color": lerpC("#F6D9A0", "#F2B866", harvest) }, lg); el("stop", { offset: "1", "stop-color": lerpC("#FBEBC8", "#F8D69A", harvest) }, lg);
    el("rect", { x: -600, y: -600, width: 2300, height: 2000, fill: `url(#${id})` }, g);
    el("circle", { cx: 900, cy: 520, r: 80, fill: "#FFF1B0", stroke: INK, "stroke-width": 6 }, g);
    // ziggurat on the horizon
    const zg = el("g", { transform: "translate(200 1020)" }, g);
    [[0, 420, 120], [-30, 320, 100], [-60, 220, 90], [-90, 130, 70]].forEach(([y0, w0, h0], i) => el("rect", { x: -w0 / 2, y: y0 - h0 - i * 0, width: w0, height: h0, fill: i % 2 ? MUDL : MUD, stroke: INK, "stroke-width": 6, transform: `translate(0 ${-[0, 120, 220, 310][i]})` }, zg));
    el("path", { d: "M-20,-120 L20,-120 L60,0 L-60,0 Z", fill: MUDD, stroke: INK, "stroke-width": 5 }, zg);
    // ground + harvest wheat
    el("path", { d: "M-600,1060 Q300,1000 1700,1070 L1700,2600 L-600,2600 Z", fill: lerpC("#E2C48E", "#E9B95A", harvest), stroke: INK, "stroke-width": 7 }, g);
    if (harvest > 0) for (let i = 0; i < 26; i++) { const x = -300 + i * 70, sw = Math.sin(t * 2 + i) * 10;
      el("path", { d: `M${x},1150 Q${x + sw},1060 ${x + sw * 1.5},1010`, fill: "none", stroke: "#C8902E", "stroke-width": 8, opacity: harvest }, g);
      el("ellipse", { cx: x + sw * 1.5, cy: 996, rx: 12, ry: 26, fill: "#F2C14E", stroke: INK, "stroke-width": 4, opacity: harvest }, g); }
    // palms
    for (const [x, s] of [[-140, 1], [1230, 0.9]]) { const pg = el("g", { transform: `translate(${x} 1090) scale(${s})` }, g);
      el("path", { d: "M-14,0 Q-30,-200 10,-380 L30,-376 Q-6,-200 14,0 Z", fill: "#8A6A3E", stroke: INK, "stroke-width": 6 }, pg);
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(t * 1.5 + i) * 0.03; el("path", { d: `M20,-380 Q${20 + Math.cos(a) * 120},${-380 + Math.sin(a) * 120 - 30} ${20 + Math.cos(a) * 220},${-380 + Math.sin(a) * 220 + 60}`, fill: "none", stroke: "#4E8A3A", "stroke-width": 22, "stroke-linecap": "round" }, pg); } }
    // mudbrick back wall with a doorway behind the counter
    el("rect", { x: -600, y: 900, width: 2300, height: 280, fill: MUD, stroke: INK, "stroke-width": 7, opacity: 1 - harvest }, g);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 26; c++) el("rect", { x: -600 + c * 92 + (r % 2) * 46, y: 910 + r * 68, width: 88, height: 62, fill: "none", stroke: MUDD, "stroke-width": 3, opacity: 1 - harvest }, g);
    el("path", { d: "M470,1180 L470,990 Q540,930 610,990 L610,1180 Z", fill: "#5A3A22", stroke: INK, "stroke-width": 7, opacity: 1 - harvest }, g);
    return g; };
  // granary: a stack of n sacks (x,y = bottom centre)
  W.sack = (p, { x, y, s = 1, rot = 0, mark = "" }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("path", { d: "M-70,0 Q-90,-80 -60,-140 Q-40,-160 -20,-150 L-30,-176 Q0,-190 30,-176 L20,-150 Q40,-160 60,-140 Q90,-80 70,0 Z", fill: "#D6B47A", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-22,-152 Q0,-140 22,-152", fill: "none", stroke: "#8A6A3E", "stroke-width": 7 }, g);
    for (let i = 0; i < 5; i++) el("ellipse", { cx: -8 + (i % 3) * 8, cy: -186 - Math.floor(i / 3) * 6, rx: 5, ry: 8, fill: "#F2C14E", stroke: INK, "stroke-width": 2 }, g);
    if (mark) K.txt(g, 0, -50, mark, 46, "#8A6A3E"); return g; };
  W.sacks = (p, { x, y, n = 10, s = 0.7, t = 0 }) => { for (let i = 0; i < n; i++) { const row = Math.floor(i / 4), col = i % 4; W.sack(p, { x: x + (col - 1.5) * 110 * s + (row % 2) * 40 * s, y: y - row * 120 * s, s }); } };
  W.counter = (p, { x0 = -300, x1 = 1380, y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: x0, y: y + 22, width: x1 - x0, height: 900, fill: MUD, stroke: INK, "stroke-width": 8 }, g);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 20; c++) el("rect", { x: x0 + c * 96 + (r % 2) * 48, y: y + 40 + r * 74, width: 90, height: 66, fill: "none", stroke: MUDD, "stroke-width": 4 }, g);
    el("rect", { x: x0 - 20, y, width: x1 - x0 + 40, height: 34, rx: 8, fill: MUDL, stroke: INK, "stroke-width": 8 }, g); return g; };
  // the clay tablet: marks 0..n pressed (each a wedge), seal 0..1 rolled across the bottom; wet = darker clay
  W.tablet = (p, { x, y, s = 1, rot = 0, marks = 0, seal = 0, wet = 1, glow = 0, label = "" }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    if (glow > 0) el("circle", { cx: 0, cy: 0, r: 330, fill: "#FFE7A0", opacity: 0.55 * glow }, g);
    el("path", { d: "M-220,-150 Q-230,-170 -200,-176 L200,-176 Q230,-170 220,-150 L226,150 Q230,176 200,176 L-200,176 Q-230,176 -226,150 Z", fill: wet ? "#B9774A" : "#C99A6E", stroke: INK, "stroke-width": 8 }, g);
    el("path", { d: "M-196,-150 L196,-150", stroke: "rgba(255,255,255,.25)", "stroke-width": 10, "stroke-linecap": "round" }, g);
    const n = Math.floor(marks); for (let i = 0; i < Math.min(10, n); i++) { const cx = -160 + (i % 5) * 80, cy = -90 + Math.floor(i / 5) * 90;
      el("path", { d: `M${cx - 18},${cy - 26} L${cx + 18},${cy - 26} L${cx},${cy + 22} Z`, fill: "#7A4A2A", stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g); }
    if (seal > 0) { const cl = el("clipPath", { id: "seal" + Math.round(x) }, g); el("rect", { x: -200, y: 80, width: 400 * seal, height: 80 }, cl);
      const sg = el("g", { "clip-path": `url(#seal${Math.round(x)})` }, g); el("rect", { x: -200, y: 86, width: 400, height: 66, rx: 8, fill: "#9A5E36", stroke: INK, "stroke-width": 4 }, sg);
      for (let i = 0; i < 8; i++) { const cx = -175 + i * 50; el("circle", { cx, cy: 110, r: 9, fill: "#6E3E20" }, sg); el("path", { d: `M${cx - 14},140 L${cx},122 L${cx + 14},140`, fill: "none", stroke: "#6E3E20", "stroke-width": 5 }, sg); } }
    if (label) K.txt(g, 0, 60, label, 50, "#5A2E14"); return g; };
  W.stylus = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("path", { d: "M-8,-180 L8,-180 L8,0 L0,22 L-8,0 Z", fill: "#C9B57A", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
    for (let i = 0; i < 3; i++) el("line", { x1: -8, y1: -150 + i * 50, x2: 8, y2: -150 + i * 50, stroke: "#8A7A4A", "stroke-width": 4 }, g); return g; };
  W.seal = (p, { x, y, s = 1, rot = 0, roll = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -34, y: -70, width: 68, height: 140, rx: 16, fill: "#7FA7C9", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 4; i++) el("line", { x1: -34, y1: -50 + i * 34 + (roll * 34) % 34, x2: 34, y2: -50 + i * 34 + (roll * 34) % 34, stroke: "#4E7BA3", "stroke-width": 5 }, g);
    el("ellipse", { cx: 0, cy: -70, rx: 34, ry: 10, fill: "#A9C8E2", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.beer = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    for (const [dx, a] of [[-20, -18], [10, 8], [36, 22]]) el("line", { x1: dx, y1: -170, x2: dx + Math.sin(a * Math.PI / 180) * 160, y2: -170 - Math.cos(a * Math.PI / 180) * 160, stroke: "#C9B57A", "stroke-width": 9, "stroke-linecap": "round" }, g);
    el("path", { d: "M-90,-170 Q-130,-80 -80,0 L80,0 Q130,-80 90,-170 Z", fill: "#B9774A", stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g);
    el("ellipse", { cx: 0, cy: -170, rx: 92, ry: 18, fill: "#E9C46A", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M-70,-110 Q0,-90 70,-110", fill: "none", stroke: "#7A4A2A", "stroke-width": 6 }, g); return g; };
  W.scroll = (p, { x, y, s = 1, rot = 0, cross = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    K.sheet(g, { x: 0, y: 0, kind: "scroll", title: "A POEM", w: 420, h: 420, size: 34, lines: ["Oh moon, oh stars,", "my heart is a", "river of..."] });
    for (const [hx, hy] of [[-150, 150], [150, 150]]) K.txt(g, hx, hy, "♥", 54, "#E5484D");
    if (cross > 0) { el("path", { d: `M-200,-200 L${-200 + 400 * clamp(cross * 2)},${-200 + 400 * clamp(cross * 2)}`, stroke: "#E5484D", "stroke-width": 28, "stroke-linecap": "round" }, g);
      if (cross > 0.5) el("path", { d: `M200,-200 L${200 - 400 * clamp(cross * 2 - 1)},${-200 + 400 * clamp(cross * 2 - 1)}`, stroke: "#E5484D", "stroke-width": 28, "stroke-linecap": "round" }, g); }
    return g; };
  W.shelf = (p, { x, y, s = 1, n = 12 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    for (let r = 0; r < 3; r++) { el("rect", { x: -260, y: -r * 150, width: 520, height: 20, fill: "#8A6A3E", stroke: INK, "stroke-width": 5 }, g);
      for (let c = 0; c < 5 && r * 5 + c < n; c++) W.tablet(g, { x: -200 + c * 100, y: -r * 150 - 60, s: 0.2, marks: 6 + c, seal: 1, wet: 0 }); } return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 2 · SUMER, 3100 BC · \"Humans invented writing for receipts\" — cast & props", 44);
    [["Nisa", W.NISA, F.calm], ["Nisa: no proof", W.NISA, F.worried], ["Nisa: the clay says ten", W.NISA, F.smug], ["Duru", W.DURU, F.happy], ["Duru: 'I borrowed three'", W.DURU, { eyes: "half", lid: 0.3, mouth: "smile", look: [-1, -0.5] }], ["Duru: beer?", W.DURU, F.worried]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    const cp = el("clipPath", { id: "bx" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 800, rx: 16 }, cp);
    const bg = el("g", { "clip-path": "url(#bx)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.75) translate(0 -620)" }, bg);
    W.set(sg, { t: 0.3 }); W.sacks(sg, { x: 300, y: 1410, n: 10, s: 0.6 }); W.counter(sg, {}); lab(610, 1600, "the granary (mudbrick wall, ziggurat, palms, counter)");
    const cp2 = el("clipPath", { id: "bx2" }, s); el("rect", { x: 1240, y: 760, width: 1100, height: 800, rx: 16 }, cp2);
    const bg2 = el("g", { "clip-path": "url(#bx2)" }, s), sg2 = el("g", { transform: "translate(1240 760) scale(0.75) translate(0 -620)" }, bg2);
    W.set(sg2, { harvest: 1, t: 0.3 }); W.counter(sg2, {}); lab(1790, 1600, "harvest time");
    W.tablet(s, { x: 300, y: 1900, s: 0.7, marks: 4 }); W.tablet(s, { x: 700, y: 1900, s: 0.7, marks: 10, seal: 1, glow: 1 }); lab(500, 2060, "the tablet: pressing / sealed");
    W.stylus(s, { x: 960, y: 1950, rot: 20 }); W.seal(s, { x: 1100, y: 1900 }); W.sack(s, { x: 1300, y: 1990, s: 0.8, mark: "10" }); W.beer(s, { x: 1520, y: 1990, s: 0.8 }); lab(1240, 2060, "stylus / seal / sack / beer");
    W.scroll(s, { x: 1850, y: 1900, s: 0.6, cross: 1 }); lab(1850, 2060, "the poem (crossed out)");
    W.shelf(s, { x: 600, y: 2500, s: 0.8 }); lab(600, 2560, "the first archive");
    K.bubble(s, { x: 1400, y: 2380, text: "", w: 260, think: 1, tail: [-50, 110] }); W.sacks(s, { x: 1400, y: 2420, n: 3, s: 0.3 }); lab(1400, 2560, "memory bubble");
  };
  root.World = W;
})(window);
