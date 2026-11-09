/* world.js — Stone age pasture ("Interest was invented by goats"). Cast (original): Kira (sharp herder: long auburn hair,
   fur dress, earring), Brok (dopey borrower: wild hair, big beard, fur), goats (adult: horns + beard; baby: round, no horns).
   Set: valley with a cave in the hillside, meadow, trees; seasons (autumn, winter snow, spring flowers); a stick fence
   (foreground, cuts the people at the waist) with the herd grazing in front of it. Props: herd, hearts, clay tablet (MAS =
   baby goat = interest), compound tree card, contract rock + handprint. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.KIRA = { hairStyle: "long", hair: "#8A3A1E", skin: "#E9B48A", outfit: "fur", cloth: "#D9B27A", cloth2: "#A8804A", earring: 1, blush: 0.55 };
  W.BROK = { hairStyle: "wild", hair: "#3A2A1E", beard: 1, thickBrows: 1, skin: "#C98E62", outfit: "fur", cloth: "#8B5A2B", cloth2: "#6B4423", blush: 0.3 };
  // season: 0 autumn, 1 winter, 2 spring
  W.valley = (p, { t = 0, season = 0 }) => { const g = el("g", {}, p), snow = season <= 1 ? clamp(season) : clamp(2 - season) * 0, spring = clamp(season - 1);
    const sk = lerpC(lerpC("#9AD4EE", "#C9D6E2", snow), "#8FD3F0", spring);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: sk }, g);
    el("circle", { cx: 880, cy: 260, r: 78, fill: lerpC("#FFD25A", "#F3F0E0", snow), stroke: INK, "stroke-width": 6 }, g);
    for (const [x, y, w0] of [[-200, 1000, 700], [500, 980, 900]]) el("path", { d: `M${x},1150 L${x + w0 * 0.45},${y - 380} L${x + w0 * 0.55},${y - 400} L${x + w0},1150 Z`, fill: lerpC("#8A9AA8", "#E8EEF3", snow), stroke: INK, "stroke-width": 6 }, g);
    // hillside with the cave
    el("path", { d: "M-700,1180 Q-200,700 380,820 Q560,860 620,1180 Z", fill: lerpC(lerpC("#B98A4A", "#E8EEF3", snow), "#7CC46A", spring), stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M40,1180 Q60,960 200,940 Q340,960 360,1180 Z", fill: "#2A1E1A", stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-700,1100 Q0,1040 600,1100 T1900,1080 L1900,2800 L-700,2800 Z", fill: lerpC(lerpC("#C9A85A", "#F2F5F8", snow), "#8FD07A", spring), stroke: INK, "stroke-width": 6 }, g);
    // trees
    for (const tx of [760, 1000]) { el("rect", { x: tx - 16, y: 900, width: 32, height: 240, fill: "#6B4428", stroke: INK, "stroke-width": 6 }, g);
      if (snow < 0.5) el("circle", { cx: tx, cy: 860, r: 110, fill: lerpC("#E0952E", "#6FB35A", spring), stroke: INK, "stroke-width": 6 }, g);
      else { el("path", { d: `M${tx},920 l-70,-90 M${tx},900 l60,-110 M${tx - 40},860 l-30,-50`, stroke: "#6B4428", "stroke-width": 12, "stroke-linecap": "round" }, g); el("ellipse", { cx: tx, cy: 830, rx: 90, ry: 26, fill: WH, opacity: 0.9 }, g); } }
    if (spring > 0) for (let i = 0; i < 22; i++) { const r = MK.rng(i + 31); el("circle", { cx: -300 + r() * 1700, cy: 1130 + r() * 260, r: 9 * spring, fill: ["#FF8FB1", "#FFE27A", WH][i % 3], stroke: INK, "stroke-width": 2 }, g); }
    if (snow > 0.05) for (let i = 0; i < 60; i++) { const r = MK.rng(i + 7), y = ((r() * 2200 + t * (120 + r() * 80)) % 2200) - 300; el("circle", { cx: -200 + r() * 1500 + Math.sin(t + i) * 20, cy: y, r: 5 + r() * 6, fill: WH, opacity: snow }, g); }
    return g; };
  W.fence = (p, { y = 1405, snow = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: y + 10, width: 2600, height: 1500, fill: lerpC("#B8954A", "#E8EEF3", snow), stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 14; i++) { const x = -300 + i * 120; el("path", { d: `M${x},${y - 60} l14,-24 l14,24 L${x + 26},${y + 120} L${x + 2},${y + 120} Z`, fill: "#A8754A", stroke: INK, "stroke-width": 6 }, g); }
    for (const yy of [y - 10, y + 60]) el("rect", { x: -400, y: yy, width: 1900, height: 24, rx: 10, fill: "#8A5A3A", stroke: INK, "stroke-width": 6 }, g);
    if (snow > 0.3) el("rect", { x: -400, y: y - 18, width: 1900, height: 12, rx: 6, fill: WH, opacity: snow }, g);
    return g; };
  // a goat (origin at its feet). face: happy | shock | smug | love | sleep
  W.goat = (p, { x, y, s = 1, t = 0, baby = 0, flip = 1, face = "happy", hop = 0, chew = 0, col = 0, k = 1, label = 0 }) => { if (k <= 0) return;
    const hy = hop ? -Math.abs(Math.sin(t * 9 + x)) * 22 : 0, sc = s * k * (baby ? 0.62 : 1), g = el("g", { transform: `translate(${x} ${y + hy}) scale(${sc * flip} ${sc})` }, p);
    const C = ["#F6F2EA", "#E8D7BC", "#C9B29A", "#8A7462"][col % 4], P2 = ["#C9B29A", "#8A7462", "#5E4A3A", "#3A2E26"][col % 4];
    for (const lx of [-50, -20, 30, 58]) el("rect", { x: lx - 9, y: -60, width: 18, height: 60, rx: 6, fill: C, stroke: INK, "stroke-width": 5 }, g);
    el("ellipse", { cx: 0, cy: -84, rx: 86, ry: baby ? 52 : 48, fill: C, stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-30,-120 q20,-10 40,6 q-10,24 -36,18 Z", fill: P2, opacity: 0.7 }, g);
    el("path", { d: "M-86,-96 q-26,-8 -30,12", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    const hg = el("g", { transform: `translate(78 -128) rotate(${chew ? Math.sin(t * 14) * 4 : 0})` }, g);
    if (!baby) for (const hx of [-12, 12]) el("path", { d: `M${hx},-40 q${hx * 2},-50 ${hx * 3.4},-46`, fill: "none", stroke: "#8A7462", "stroke-width": 10, "stroke-linecap": "round" }, hg);
    el("path", { d: "M-46,-30 q-34,-6 -38,14 q20,8 40,-2 Z", fill: C, stroke: INK, "stroke-width": 5 }, hg);
    el("ellipse", { cx: 0, cy: 0, rx: 44, ry: 52, fill: C, stroke: INK, "stroke-width": 6 }, hg);
    el("ellipse", { cx: 14, cy: 30, rx: 28, ry: 20, fill: baby ? "#FFC9C9" : "#EDE0CC", stroke: INK, "stroke-width": 4 }, hg);
    el("circle", { cx: 6, cy: 26, r: 4, fill: INK }, hg); el("circle", { cx: 24, cy: 26, r: 4, fill: INK }, hg);
    if (!baby) el("path", { d: "M0,50 l8,40 l10,-38", fill: P2, stroke: INK, "stroke-width": 4 }, hg);
    if (face === "sleep") el("path", { d: "M-10,-10 q10,8 20,0", fill: "none", stroke: INK, "stroke-width": 5 }, hg);
    else if (face === "love") el("path", { d: "M2,-14 c-4,-10 -16,-4 -8,6 l8,8 l8,-8 c8,-10 -4,-16 -8,-6 Z", fill: "#E5484D", stroke: INK, "stroke-width": 2 }, hg);
    else { const r = face === "shock" ? 13 : 10; el("ellipse", { cx: 4, cy: -10, rx: r, ry: r * 1.2, fill: WH, stroke: INK, "stroke-width": 4 }, hg);
      el("rect", { x: -2, y: -14, width: 12, height: 6, rx: 3, fill: INK }, hg); // goat pupils are sideways rectangles
      if (face === "smug") el("path", { d: "M-10,-20 l26,-4", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg); }
    if (face === "happy" || face === "smug" || face === "love") el("path", { d: "M0,40 q10,8 22,0", fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, hg);
    if (label) K.label(p, { x, y: y + hy - 175 * sc, text: "INTEREST", size: 34 * Math.max(0.8, sc), k: label, tone: "#3FB8AF", rot: -6 });
    return g; };
  // a herd in front of the fence: n goats spread over [x0, x1], depth-sorted; babies flagged by index >= adults
  W.herd = (p, { n = 10, adults = 10, x0 = -60, x1 = 1140, y0 = 1560, y1 = 1860, t = 0, seed = 5, pop = 1, hop = 0, faces = null, labelK = 0, s = 0.8 }) => {
    const items = []; for (let i = 0; i < n; i++) { const r = MK.rng(i * 13 + seed); items.push({ i, x: lerp(x0, x1, r()), y: lerp(y0, y1, r()), flip: r() > 0.5 ? 1 : -1, col: Math.floor(r() * 4), baby: i >= adults }); }
    items.sort((a, b) => a.y - b.y).forEach((it) => { const k = typeof pop === "function" ? pop(it.i) : pop; W.goat(p, { x: it.x, y: it.y, s: s * lerp(0.8, 1.1, (it.y - y0) / Math.max(1, y1 - y0)), t, baby: it.baby, flip: it.flip, col: it.col, k, hop, chew: !hop, face: faces ? faces(it) : "happy", label: it.baby ? labelK : 0 }); }); };
  W.tablet = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(-3) scale(${s * k})` }, p);
    el("path", { d: "M-380,-260 Q-400,0 -370,250 Q0,280 370,250 Q400,0 380,-260 Q0,-290 -380,-260 Z", fill: "#C9A27A", stroke: INK, "stroke-width": 9 }, g);
    for (let i = 0; i < 18; i++) { const r = MK.rng(i + 3); el("path", { d: `M${-320 + (i % 9) * 72},${-200 + Math.floor(i / 9) * 60} l20,0 l-10,22 Z`, fill: "#8A6A4A", opacity: 0.6 + r() * 0.3 }, g); }
    K.txt(g, 0, 20, "MÁŠ", 120, "#5A3A22"); K.txt(g, 0, 100, "= BABY GOAT", 48, "#5A3A22"); K.txt(g, 0, 170, "= INTEREST", 60, "#24857E");
    K.txt(g, 0, 230, "Sumerian, ~3000 BC", 26, "#6B4A2E"); return g; };
  W.tree = (p, { x, y, s = 1, k = 1, gen = 3, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -330, width: 880, height: 660, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -268, "YOUR MONEY HAS BABIES", 46, "#24857E");
    const rows = [[0], [-200, 200], [-300, -100, 100, 300]], ys = [-100, 70, 240];
    rows.forEach((row, r) => { if (r >= gen) return; row.forEach((cx, i) => { if (r > 0) { const px = rows[r - 1][Math.floor(i / 2)]; el("line", { x1: px, y1: ys[r - 1] + 10, x2: cx, y2: ys[r] - 70, stroke: "#C9B29A", "stroke-width": 7 }, g); }
      W.goat(g, { x: cx, y: ys[r] + 20, s: r === 0 ? 0.75 : 0.62, baby: r > 0 ? 1 : 0, t, col: r, hop: 1 }); }); });
    return g; };
  W.rock = (p, { x, y, s = 1, k = 1, hand = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("path", { d: "M-260,0 Q-290,-200 -150,-300 Q20,-360 180,-290 Q300,-200 270,0 Z", fill: "#9AA0A6", stroke: INK, "stroke-width": 8 }, g);
    K.txt(g, 0, -220, "LOAN: 10 GOATS", 40, "#3A3F45"); K.txt(g, 0, -160, "INTEREST:", 40, "#3A3F45"); K.txt(g, 0, -105, "2 BABIES PER GOAT", 40, "#E5484D");
    if (hand > 0) { const hg = el("g", { transform: `translate(200 -14) scale(${0.8 * hand})`, opacity: hand }, g); el("path", { d: "M-30,20 Q-40,-20 -20,-30 L-24,-80 Q-20,-90 -12,-80 L-6,-40 L-4,-96 Q2,-104 8,-96 L10,-40 L16,-90 Q22,-98 28,-88 L26,-34 L36,-70 Q44,-74 46,-64 L38,-10 Q30,30 -30,20 Z", fill: "#8A3A1E", opacity: 0.85 }, hg); }
    return g; };
  W.hearts = (p, { x, y, t = 0, k = 1 }) => { if (k <= 0) return; for (let i = 0; i < 4; i++) { const ph = (t * 0.8 + i / 4) % 1, hx = x + Math.sin(ph * 6 + i) * 30, hy = y - ph * 160;
      el("path", { d: `M${hx},${hy} c-6,-14 -24,-6 -12,8 l12,12 l12,-12 c12,-14 -6,-22 -12,-8 Z`, fill: "#FF6F91", stroke: INK, "stroke-width": 3, opacity: k * (1 - ph) }, p); } };

  W.sheet = (s) => {
    window.FONT = "Lilita One"; const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 02 · STONE AGE PASTURE · \"Interest was invented by goats\" — cast & props", 42);
    [["Kira", W.KIRA, F.smug], ["Kira: whose damn babies?", W.KIRA, F.angry], ["Brok", W.BROK, F.happy], ["Brok: not me!", W.BROK, Object.assign({}, F.shock, { sweat: 1 })]].forEach(([n, look, face], i) => {
      const x = 220 + i * 400, y = 620; Person.draw(s, Object.assign({ x, y, s: 0.66 }, look, face)); lab(x, y + 50, n); });
    W.goat(s, { x: 1820, y: 600, s: 1 }); W.goat(s, { x: 2080, y: 600, s: 1, baby: 1, face: "shock", flip: -1, label: 1 }); lab(1950, 650, "goat / baby goat");
    const tile = (x0, y0, wd, season, lb) => { const id = "gt" + x0, cp = el("clipPath", { id }, s); el("rect", { x: x0, y: y0, width: wd, height: 760, rx: 14 }, cp);
      const g = el("g", { "clip-path": `url(#${id})` }, s), sg = el("g", { transform: `translate(${x0} ${y0}) scale(0.5) translate(0 -300)` }, g);
      W.valley(sg, { t: 0.4, season }); Person.draw(sg, Object.assign({ x: 280, y: 1420, s: 1 }, W.KIRA, F.smug)); Person.draw(sg, Object.assign({ x: 800, y: 1420, s: 1 }, W.BROK, F.happy));
      W.fence(sg, { snow: season === 1 ? 1 : 0 }); W.herd(sg, { n: season === 2 ? 24 : 10, adults: 10, t: 0.4 }); lab(x0 + wd / 2, y0 + 800, lb); };
    tile(60, 760, 540, 0, "autumn: 10 goats"); tile(640, 760, 540, 1, "winter"); tile(1220, 760, 540, 2, "spring: + 14 babies");
    W.tablet(s, { x: 2080, y: 1100, s: 0.42 }); lab(2080, 1260, "clay tablet");
    W.tree(s, { x: 500, y: 2150, s: 0.55, t: 0.3 }); lab(500, 2360, "compound tree");
    W.rock(s, { x: 1150, y: 2300, s: 0.8, hand: 1 }); lab(1150, 2360, "contract rock");
    W.hearts(s, { x: 1700, y: 2250, t: 0.3 }); lab(1700, 2360, "hearts");
  };
  root.World = W;
})(window);
