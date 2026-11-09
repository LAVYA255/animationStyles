/* world.js — Zombie apocalypse ("She survived the zombies. Her files didn't."). Cast (original): Kai (survivor), Gerald (a polite
   zombie: pale green-lavender skin, stitched cheek, round glasses, knitted mustard sweater, "HELLO I'M GERALD" tag), the old
   survivor (long white beard). Set: ruined overgrown city at dusk, an abandoned car, a sandbag + plank barricade (foreground).
   Props: laptop (maps / lists / plans / bite marks / FILES: 0), flying spreadsheets, USB stick, cloud locker, off-site vault on a
   far hill, the 3-2-1 card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.KAI = { hairStyle: "bob", pony: 1, hair: "#2A1E1A", skin: "#D9A07A", outfit: "coat", cloth: "#6E7F4E", cloth2: "#56653C", blush: 0.4 };
  W.GERALD = { hairStyle: "short", hair: "#9A9A90", mustache: 1, thickBrows: 1, skin: "#BFD0B8", outfit: "hoodie", cloth: "#E0A93C", cloth2: "#C48E1C", glasses: 1, tired: 1, blush: 0 };
  W.OLDIE = { hairStyle: "bald", hair: "#E8E2DA", beard: 1, mustache: 1, skin: "#E9B48A", outfit: "coat", cloth: "#8A6A4A", cloth2: "#6B4A2E", thickBrows: 1, blush: 0.3 };
  // zombie extras drawn on top of the person rig: stitches, name tag
  W.zombieBits = (p, P0) => { const h = Person.head(P0), s = P0.s || 1; const g = el("g", { transform: `translate(${h[0]} ${h[1]}) scale(${s})` }, p);
    el("path", { d: "M50,20 L90,40 M58,16 l-6,14 M70,26 l-6,14 M82,32 l-6,14", fill: "none", stroke: "#7A4A6A", "stroke-width": 4 }, g);
    const tg = el("g", { transform: `translate(${P0.x} ${P0.y})` }, p), tg2 = el("g", { transform: `scale(${s})` }, tg);
    el("rect", { x: -90, y: -130, width: 120, height: 66, rx: 8, fill: WH, stroke: INK, "stroke-width": 4 }, tg2); el("rect", { x: -90, y: -130, width: 120, height: 20, rx: 8, fill: "#E5484D" }, tg2);
    K.txt(tg2, -30, -116, "HELLO I'M", 12, WH); K.txt(tg2, -30, -80, "GERALD", 26, INK); };
  W.city = (p, { t = 0 }) => { const g = el("g", {}, p);
    const d = el("defs", {}, g), lg = el("linearGradient", { id: "zsky", x1: 0, y1: 0, x2: 0, y2: 1 }, d); el("stop", { offset: "0", "stop-color": "#8FA88A" }, lg); el("stop", { offset: "1", "stop-color": "#F2B37A" }, lg);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: "url(#zsky)" }, g);
    el("circle", { cx: 820, cy: 520, r: 90, fill: "#FFD9A0", stroke: INK, "stroke-width": 6, opacity: 0.9 }, g);
    for (const [x, top, wd, bro] of [[-260, 420, 240, 1], [20, 560, 200, 0], [300, 380, 220, 1], [620, 520, 230, 0], [900, 440, 220, 1], [1180, 600, 220, 0]]) {
      const bt = bro ? `L${x + wd},${top + 40} L${x + wd * 0.7},${top} L${x + wd * 0.5},${top + 60} L${x + wd * 0.2},${top + 10} L${x},${top + 30}` : `L${x + wd},${top} L${x},${top}`;
      el("path", { d: `M${x},1150 L${x + wd},1150 ${bt} Z`, fill: "#8A8F98", stroke: INK, "stroke-width": 6 }, g);
      for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) { const wx = x + 24 + c * (wd - 48) / 3, wy = top + 90 + r * 60; if (wy > 1120) continue; el("rect", { x: wx, y: wy, width: (wd - 48) / 3 - 14, height: 34, fill: (r + c + x) % 3 ? "#3A3F4A" : "#5A6070", stroke: INK, "stroke-width": 2 }, g); }
      el("path", { d: `M${x + 10},${top + 200} q30,80 0,160 q-20,60 10,140`, fill: "none", stroke: "#4E8A3A", "stroke-width": 10 }, g); }
    el("path", { d: "M-700,1140 Q300,1110 1800,1150 L1800,2600 L-700,2600 Z", fill: "#9A8C78", stroke: INK, "stroke-width": 7 }, g);
    const car = el("g", { transform: "translate(860 1180) rotate(-6)" }, g); el("path", { d: "M-150,0 L-130,-70 L-60,-110 L70,-110 L130,-60 L160,0 Z", fill: "#B85C3C", stroke: INK, "stroke-width": 6 }, car);
    el("path", { d: "M-40,-100 L60,-100 L100,-64 L-110,-64 Z", fill: "#3A3F4A", stroke: INK, "stroke-width": 4 }, car); for (const sx of [-90, 100]) el("circle", { cx: sx, cy: 0, r: 30, fill: "#2B2B3A", stroke: INK, "stroke-width": 5 }, car);
    return g; };
  W.barricade = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 26, width: 1880, height: 900, fill: "#8A7A5E", stroke: INK, "stroke-width": 8 }, g);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 10; c++) el("ellipse", { cx: -340 + c * 200 + (r % 2) * 100, cy: y + 40 + r * 70, rx: 104, ry: 38, fill: "#C9B58A", stroke: INK, "stroke-width": 6 }, g);
    for (const [x, r] of [[60, -8], [700, 6]]) el("rect", { x, y: y - 26, width: 320, height: 34, rx: 6, fill: "#A8754A", stroke: INK, "stroke-width": 6, transform: `rotate(${r} ${x + 160} ${y})` }, g); return g; };
  // laptop (opened, facing us): screen 'files' | 'maps' etc.; bitten 0..1 removes a bite from the top-right corner
  W.laptop = (p, { x, y, s = 1, rot = 0, icons = 0, bitten = 0, zero = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    const cp = el("clipPath", { id: "bite" + Math.round(x) + Math.round(bitten * 10) }, g); let d = "M-200,-300 L200,-300 L200,40 L-200,40 Z";
    if (bitten > 0) d = `M-200,-300 L${200 - 160 * bitten},-300 A30,30 0 0 0 ${200 - 110 * bitten},-260 A30,30 0 0 0 ${200 - 60 * bitten},-230 A30,30 0 0 0 200,${-300 + 140 * bitten} L200,40 L-200,40 Z`;
    el("path", { d }, cp); const lg = el("g", { "clip-path": `url(#bite${Math.round(x)}${Math.round(bitten * 10)})` }, g);
    el("rect", { x: -180, y: -280, width: 360, height: 240, rx: 14, fill: "#3A3F4A", stroke: INK, "stroke-width": 7 }, lg);
    el("rect", { x: -162, y: -262, width: 324, height: 204, rx: 8, fill: zero ? "#20242C" : "#DFF3FF" }, lg);
    if (zero) K.txt(lg, 0, -140, "FILES: 0", 50, "#FF6B6B");
    else { const ic = [["MAPS", "#7FB35A"], ["SUPPLIES", "#F2C14E"], ["PLANS", "#7FA7C9"]];
      ic.forEach(([lab, c], i) => { if (icons <= i) return; const ix = -110 + i * 110; el("rect", { x: ix - 40, y: -230, width: 80, height: 70, rx: 10, fill: c, stroke: INK, "stroke-width": 4 }, lg); K.txt(lg, ix, -130, lab, 22, INK); }); }
    el("path", { d: "M-210,-40 L210,-40 L240,10 L-240,10 Z", fill: "#9AA6B3", stroke: INK, "stroke-width": 6 }, lg);
    if (bitten > 0.5) for (const [cx, cy] of [[150, -250], [180, -210]]) el("circle", { cx, cy, r: 4, fill: "#9AA6B3" }, g); return g; };
  W.paper = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -60, y: -76, width: 120, height: 152, fill: WH, stroke: INK, "stroke-width": 4 }, g);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) el("rect", { x: -48 + c * 34, y: -62 + r * 26, width: 30, height: 20, fill: (r + c) % 2 ? "#E4F2EE" : "#FFF", stroke: "#9AA6B3", "stroke-width": 2 }, g); return g; };
  W.usb = (p, { x, y, s = 1, rot = 0, glow = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    if (glow > 0) el("circle", { cx: 0, cy: 0, r: 120, fill: "#B5E8E3", opacity: 0.6 * glow }, g);
    el("rect", { x: -34, y: -70, width: 68, height: 110, rx: 12, fill: "#3FB8AF", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -22, y: -110, width: 44, height: 44, fill: "#C9D3DE", stroke: INK, "stroke-width": 5 }, g);
    for (const sx of [-8, 8]) el("rect", { x: sx - 4, y: -100, width: 8, height: 12, fill: INK }, g); return g; };
  W.cloud = (p, { x, y, s = 1, glow = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    if (glow > 0) el("circle", { cx: 0, cy: 0, r: 150, fill: "#B5E8E3", opacity: 0.6 * glow }, g);
    el("path", { d: "M-110,40 Q-150,40 -150,0 Q-150,-50 -90,-50 Q-80,-110 -10,-110 Q60,-110 70,-50 Q140,-50 140,0 Q140,40 100,40 Z", fill: WH, stroke: INK, "stroke-width": 7 }, g);
    el("rect", { x: -30, y: -30, width: 60, height: 50, rx: 8, fill: "#F2C14E", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-18,-30 L-18,-50 Q0,-70 18,-50 L18,-30", fill: "none", stroke: INK, "stroke-width": 6 }, g); return g; };
  W.vault = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-260,80 Q0,-140 260,80 Z", fill: "#7FA05A", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -60, y: -60, width: 120, height: 110, rx: 10, fill: "#8A8F98", stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: 0, cy: -6, r: 30, fill: "#C9D3DE", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-20,-6 L20,-6 M0,-26 L0,14", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.rule = (p, { x, y, s = 1, k = 1, stage = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -470, y: -320, width: 940, height: 640, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    const kk = (i) => clamp(stage - i);
    if (kk(0) > 0) { K.txt(g, -400, -230, "3", 120, "#E5484D", "start"); K.txt(g, -290, -250, "copies", 44, "#555", "start");
      W.laptop(g, { x: -240, y: -20, s: 0.42 * kk(0), icons: 3 }); W.usb(g, { x: 0, y: -70, s: 0.7 * kk(0) }); W.cloud(g, { x: 250, y: -80, s: 0.62 * kk(0) }); }
    if (kk(1) > 0) { K.txt(g, -400, 90, "2", 120, "#F2C14E", "start"); K.txt(g, -290, 70, "kinds of storage", 40, "#555", "start"); el("path", { d: "M-300,20 Q-120,60 60,20", fill: "none", stroke: "#F2C14E", "stroke-width": 10, opacity: kk(1) }, g); }
    if (kk(2) > 0) { K.txt(g, -400, 260, "1", 120, "#3FB8AF", "start"); K.txt(g, -290, 240, "somewhere else", 40, "#555", "start"); W.vault(g, { x: 300, y: 200, s: 0.55 * kk(2) }); K.arrow(g, { x1: 250, y1: 0, x2: 300, y2: 150, k: kk(2), color: "#3FB8AF" }); }
    return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 10 · ZOMBIE APOCALYPSE · \"She survived the zombies. Her files didn't.\" — cast & props", 40);
    [["Kai", W.KAI, F.calm], ["Kai: MY SPREADSHEETS!", W.KAI, F.shout], ["Kai: bon appetit", W.KAI, F.smug]].forEach(([n, look, face], i) => { const x = 200 + i * 380, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    [["Gerald (polite zombie)", { eyes: "half", lid: 0.4, mouth: "smile" }], ["Gerald: braaains", { eyes: "half", lid: 0.4, mouth: "o", open: 0.8, armL: { x: -150, y: -200 }, armR: { x: 150, y: -200 } }]].forEach(([n, face], i) => { const x = 1350 + i * 380, y = 640, P0 = Object.assign({ x, y, s: 0.7 }, W.GERALD, face); Person.draw(s, P0); W.zombieBits(s, P0); lab(x, y + 50, n); });
    Person.draw(s, Object.assign({ x: 2150, y: 640, s: 0.7 }, W.OLDIE, F.smug)); lab(2150, 690, "the old survivor");
    const cp = el("clipPath", { id: "c" }, s); el("rect", { x: 60, y: 780, width: 1100, height: 860, rx: 16 }, cp);
    const cg = el("g", { "clip-path": "url(#c)" }, s), sg = el("g", { transform: "translate(60 780) scale(0.62) translate(0 -400)" }, cg);
    W.city(sg, {}); W.barricade(sg, {}); W.laptop(sg, { x: 540, y: 1400, s: 0.7, icons: 3 }); lab(610, 1680, "the ruined city + barricade");
    W.laptop(s, { x: 1450, y: 1150, s: 0.7, icons: 3 }); W.laptop(s, { x: 1900, y: 1150, s: 0.7, bitten: 1, zero: 1 }); lab(1675, 1260, "laptop: files / bitten, FILES: 0");
    W.paper(s, { x: 1350, y: 1450, rot: -10 }); W.usb(s, { x: 1600, y: 1460, glow: 1 }); W.cloud(s, { x: 1850, y: 1460, s: 0.8 }); W.vault(s, { x: 2150, y: 1460, s: 0.7 }); lab(1750, 1600, "spreadsheet / USB / cloud locker / vault");
    W.rule(s, { x: 1200, y: 2150, s: 0.7, stage: 3 }); lab(1200, 2420, "the 3-2-1 card");
  };
  root.World = W;
})(window);
