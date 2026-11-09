/* world.js — Volcano island ("This smoothie stand hooked a whole island without a single ad"). Cast (original): Lani (long
   black hair, hibiscus flower, coral tank: the founder), Koa (big curly-haired guy, teal tank, conch-shell megaphone),
   Mele (teen girl: bob + ponytail, flower, yellow tank), Koa's mom (grey bun), islander folk (simple full-body crowd rig).
   Set: tropical sky, ocean, smoking volcano, palms, beach; Lani's bamboo smoothie hut (sign on the counter front) and a low
   bamboo rail (foreground). Props: smoothie (coconut cup + straw + umbrella), lightbulb, BRING A FRIEND sign, canoes, crab,
   referral-tree card, Dropbox growth card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, TEAL = "#3FB8AF", CORAL = "#FF7A6B";
  W.LANI = { hairStyle: "long", hair: "#1E1614", skin: "#B97A4E", outfit: "tank", cloth: CORAL, cloth2: "#E0604F", hat: "flower", hatC: "#FF4F8B", earring: 1, blush: 0.5 };
  W.KOA = { hairStyle: "curly", hair: "#1E1614", skin: "#9A6440", outfit: "tank", cloth: TEAL, cloth2: "#2E8F88", thickBrows: 1, mustache: 1, blush: 0.3 };
  W.MELE = { hairStyle: "bob", pony: 1, hair: "#3A2418", skin: "#C98E62", outfit: "tank", cloth: "#F2C14E", cloth2: "#D9A441", hat: "flower", hatC: "#FFFFFF", earring: 1, blush: 0.6 };
  W.MOM = { hairStyle: "bob", topBun: 1, hair: "#BFBFC6", skin: "#9A6440", outfit: "tank", cloth: "#B98AF0", cloth2: "#9A6AD8", glasses: 1, earring: 1, blush: 0.5 };
  W.island = (p, { t = 0, smoke = 1, canoes = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: "#7FD4F0" }, g); el("rect", { x: -700, y: 500, width: 2600, height: 600, fill: "#B9E8F6", opacity: 0.6 }, g);
    el("circle", { cx: 150, cy: 300, r: 80, fill: "#FFE27A", stroke: INK, "stroke-width": 6 }, g);
    // volcano
    el("path", { d: "M380,1040 L640,640 L740,640 L1060,1040 Z", fill: "#6E8F5A", stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M640,640 L740,640 L720,700 L690,680 L660,710 Z", fill: "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.25 + i / 3) % 1; el("circle", { cx: 690 + Math.sin(ph * 5 + i) * 30, cy: 620 - ph * 260, r: (26 + ph * 50) * smoke, fill: "#E8E2DA", stroke: INK, "stroke-width": 3, opacity: 0.9 * (1 - ph) }, g); }
    // ocean
    el("rect", { x: -700, y: 1030, width: 2600, height: 150, fill: "#2FA8D8", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 6; i++) el("path", { d: `M${-300 + i * 260 + Math.sin(t + i) * 20},1080 q30,-14 60,0`, fill: "none", stroke: WH, "stroke-width": 5 }, g);
    for (let i = 0; i < 4; i++) { const k = clamp(canoes * 4 - i); if (k <= 0) continue; const cx = lerp(1400 - i * 80, 120 + i * 230, E2(k)), cg = el("g", { transform: `translate(${cx} ${1105 + (i % 2) * 20}) scale(0.7)` }, g);
      el("path", { d: "M-110,0 Q0,40 110,0 L90,-16 L-90,-16 Z", fill: "#A8754A", stroke: INK, "stroke-width": 5 }, cg);
      for (let j = 0; j < 3; j++) { el("circle", { cx: -50 + j * 50, cy: -50, r: 18, fill: ["#B97A4E", "#9A6440", "#C98E62"][j], stroke: INK, "stroke-width": 4 }, cg); el("rect", { x: -64 + j * 50, y: -34, width: 28, height: 22, rx: 8, fill: [CORAL, TEAL, "#F2C14E"][(i + j) % 3], stroke: INK, "stroke-width": 3 }, cg); } }
    // beach + palms
    el("path", { d: "M-700,1170 Q0,1130 700,1170 T1900,1160 L1900,2800 L-700,2800 Z", fill: "#F3DDA8", stroke: INK, "stroke-width": 6 }, g);
    for (const [px, s, f] of [[-40, 1.1, 1], [1100, 1, -1]]) { const pg = el("g", { transform: `translate(${px} 1190) scale(${s * f} ${s})` }, g); el("path", { d: "M0,0 Q40,-200 10,-420", fill: "none", stroke: "#8A5A3A", "stroke-width": 20 }, pg);
      for (let i = 0; i < 6; i++) { const a = -170 + i * 32 + Math.sin(t * 1.2 + i) * 4; el("path", { d: `M10,-420 q${Math.cos(a * Math.PI / 180) * 110},${Math.sin(a * Math.PI / 180) * 110 - 30} ${Math.cos(a * Math.PI / 180) * 200},${Math.sin(a * Math.PI / 180) * 200 + 60}`, fill: "none", stroke: "#3F9A4A", "stroke-width": 20, "stroke-linecap": "round" }, pg); }
      for (let i = 0; i < 3; i++) el("circle", { cx: 6 + (i - 1) * 22, cy: -400, r: 16, fill: "#7A5A2A", stroke: INK, "stroke-width": 4 }, pg); }
    return g; };
  const E2 = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
  W.hut = (p, { x = 640, y = 1405, t = 0 }) => { const g = el("g", { transform: `translate(${x} 0)` }, p);
    for (const px of [-230, 210]) el("rect", { x: px, y: y - 470, width: 22, height: 470, fill: "#C9A55A", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: `M-280,${y - 470} L0,${y - 600} L280,${y - 470} Z`, fill: "#E2B65A", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 9; i++) el("line", { x1: -250 + i * 62, y1: y - 470, x2: -130 + i * 30, y2: y - 560, stroke: "#C49A3A", "stroke-width": 4 }, g);
    return g; };
  W.hutFront = (p, { x = 640, y = 1405, sign = 1 }) => { const g = el("g", { transform: `translate(${x} 0)` }, p);
    el("rect", { x: -250, y, width: 500, height: 220, fill: "#D9B87A", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 10; i++) el("line", { x1: -250 + i * 50, y1: y, x2: -250 + i * 50, y2: y + 220, stroke: "#B8955A", "stroke-width": 4 }, g);
    el("rect", { x: -270, y: y - 16, width: 540, height: 30, rx: 8, fill: "#C9A55A", stroke: INK, "stroke-width": 7 }, g);
    if (sign) K.sign(g, { x: 0, y: y + 110, s: 0.9, text: "LANI'S SMOOTHIES", w: 470, h: 96, size: 46, fill: "#FFF3D6", hang: 0, rot: -2 }); return g; };
  W.rail = (p, { y = 1405 }) => { const g = el("g", {}, p);
    for (const yy of [y + 40, y + 120]) el("rect", { x: -500, y: yy, width: 2100, height: 22, rx: 10, fill: "#C9A55A", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 16; i++) el("rect", { x: -440 + i * 130, y: y + 10, width: 20, height: 170, rx: 8, fill: "#D9B87A", stroke: INK, "stroke-width": 4 }, g); return g; };
  W.smoothie = (p, { x, y, s = 1, k = 1, rot = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, p);
    el("path", { d: "M-46,-70 Q-50,10 0,14 Q50,10 46,-70 Z", fill: "#8A5A3A", stroke: INK, "stroke-width": 5 }, g); el("ellipse", { cx: 0, cy: -70, rx: 46, ry: 14, fill: "#FF8FB1", stroke: INK, "stroke-width": 4 }, g);
    el("line", { x1: 10, y1: -76, x2: 40, y2: -150, stroke: "#E5484D", "stroke-width": 7, "stroke-linecap": "round" }, g);
    el("line", { x1: -16, y1: -76, x2: -36, y2: -130, stroke: INK, "stroke-width": 3 }, g); el("path", { d: "M-70,-124 Q-36,-160 0,-128 Z", fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g); return g; };
  W.conch = (p, { x, y, s = 1, rot = 0, blast = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("path", { d: "M-20,-20 Q40,-60 110,-50 Q140,0 110,50 Q40,60 -20,20 Z", fill: "#FFD6C9", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M10,-30 q20,30 0,60 M40,-40 q24,40 0,80", fill: "none", stroke: "#E0A090", "stroke-width": 4 }, g);
    if (blast > 0) for (let i = 0; i < 3; i++) { const ph = (t * 2 + i / 3) % 1; el("path", { d: `M${130 + ph * 160},${-60 - ph * 40} q${30 + ph * 20},${60 + ph * 40} 0,${120 + ph * 80}`, fill: "none", stroke: INK, "stroke-width": 6, opacity: blast * (1 - ph) }, g); }
    return g; };
  // simple full-body islander (origin at feet)
  W.folk = (p, { x, y, s = 1, i = 0, t = 0, hop = 0, k = 1, cup = 0, flip = 1 }) => { if (k <= 0) return; const r = MK.rng(i * 7 + 1), skin = ["#B97A4E", "#9A6440", "#C98E62", "#7A4A2E"][i % 4], shirt = [CORAL, TEAL, "#F2C14E", "#B98AF0", "#6FB35A"][i % 5];
    const hy = hop ? -Math.abs(Math.sin(t * 8 + i)) * 26 : 0, g = el("g", { transform: `translate(${x} ${y + hy}) scale(${s * k * flip} ${s * k})` }, p);
    el("line", { x1: -14, y1: -70, x2: -18, y2: 0, stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }, g); el("line", { x1: 14, y1: -70, x2: 18, y2: 0, stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }, g);
    el("rect", { x: -38, y: -180, width: 76, height: 120, rx: 30, fill: shirt, stroke: INK, "stroke-width": 5 }, g);
    const ar = hop ? -60 : 0; el("path", { d: `M-34,-160 L-60,${-100 + ar}`, stroke: skin, "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: `M34,-160 L60,${-100 + ar}`, stroke: skin, "stroke-width": 14, "stroke-linecap": "round" }, g);
    el("circle", { cx: 0, cy: -222, r: 44, fill: skin, stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: r() > 0.5 ? "M-44,-232 Q-40,-282 0,-280 Q40,-282 44,-232 Q20,-256 -44,-232 Z" : "M-46,-226 Q-50,-290 0,-284 Q50,-290 46,-226 L46,-180 L36,-226 Q0,-250 -36,-226 L-46,-180 Z", fill: "#1E1614", stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-18,-222 q6,-8 12,0 M8,-222 q6,-8 12,0", fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, g); el("path", { d: "M-12,-204 q12,10 24,0", fill: "none", stroke: INK, "stroke-width": 4 }, g);
    if (cup) W.smoothie(g, { x: 60, y: -110 + ar, s: 0.45 }); return g; };
  W.crab = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("ellipse", { cx: 0, cy: -24, rx: 40, ry: 24, fill: "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    for (const sx of [-1, 1]) { el("path", { d: `M${sx * 30},-30 q${sx * 30},-30 ${sx * 50},-10`, fill: "none", stroke: INK, "stroke-width": 5 }, g); el("circle", { cx: sx * 56, cy: -40, r: 12, fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g);
      for (let j = 0; j < 3; j++) el("line", { x1: sx * 24, y1: -14, x2: sx * (44 + j * 6), y2: 4 + Math.sin(t * 20 + j) * 4, stroke: INK, "stroke-width": 4 }, g); }
    for (const sx of [-10, 10]) { el("line", { x1: sx, y1: -40, x2: sx, y2: -62, stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: sx, cy: -64, r: 6, fill: INK }, g); } return g; };
  W.bulb = (p, { x, y, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${k})` }, p);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; el("line", { x1: Math.cos(a) * 64, y1: Math.sin(a) * 64, x2: Math.cos(a) * 86, y2: Math.sin(a) * 86, stroke: "#F2C14E", "stroke-width": 6, "stroke-linecap": "round" }, g); }
    el("circle", { cx: 0, cy: 0, r: 46, fill: "#FFE27A", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -20, y: 40, width: 40, height: 24, rx: 4, fill: "#9AA0A6", stroke: INK, "stroke-width": 4 }, g); return g; };
  W.offer = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(4) scale(${s * k})` }, p);
    el("rect", { x: -230, y: -100, width: 460, height: 200, rx: 20, fill: "#FFF3D6", stroke: INK, "stroke-width": 7 }, g);
    K.txt(g, 0, -30, "BRING A FRIEND", 50, CORAL); K.txt(g, 0, 50, "= BOTH FREE!", 56, TEAL); return g; };
  W.treeCard = (p, { x, y, s = 1, k = 1, gen = 4, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -320, width: 880, height: 640, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -250, "THE REFERRAL LOOP", 54, TEAL);
    const rows = [[0], [-160, 160], [-270, -90, 90, 270], [-360, -260, -160, -60, 60, 160, 260, 360]], ys = [-130, -10, 110, 240];
    rows.forEach((row, r) => { if (r >= gen) return; row.forEach((cx, i) => { if (r > 0) { const px = rows[r - 1][Math.floor(i / 2)]; el("line", { x1: px, y1: ys[r - 1] + 10, x2: cx, y2: ys[r] - 70, stroke: "#C9C9C9", "stroke-width": 5 }, g); }
      W.folk(g, { x: cx, y: ys[r] + 10, s: 0.36, i: r * 3 + i, t, hop: 1 }); }); });
    return g; };
  W.dropCard = (p, { x, y, s = 1, k = 1, grow = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -320, width: 880, height: 640, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -244, "DROPBOX: GIVE BOTH SIDES", 44, "#2F6FB0"); K.txt(g, 0, -190, "free storage", 38, "#555");
    el("rect", { x: -300, y: 180 - 20, width: 160, height: 20, fill: "#9AD4EE", stroke: INK, "stroke-width": 5 }, g); K.txt(g, -220, 240, "100K", 44, INK);
    const h = 360 * grow; el("rect", { x: 140, y: 180 - h, width: 160, height: h, fill: "#2F6FB0", stroke: INK, "stroke-width": 5 }, g); K.txt(g, 220, 240, "4M", 52, "#2F6FB0");
    K.arrow(g, { x1: -100, y1: 100, x2: 100, y2: 0, k: grow, color: CORAL }); K.txt(g, 0, 290, "in 15 months", 36, "#555"); return g; };

  W.sheet = (s) => {
    window.FONT = "Luckiest Guy"; const lab = (x, y, t, z = 28) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 19 · VOLCANO ISLAND · \"This smoothie stand hooked a whole island\"", 38);
    [["Lani", W.LANI, F.happy], ["Lani: no, Koa", W.LANI, F.deadpan], ["Koa", W.KOA, F.shout], ["Mele", W.MELE, F.happy], ["Koa's mom", W.MOM, F.smug]].forEach(([n, look, face], i) => {
      const x = 220 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.66 }, look, face)); lab(x, y + 50, n); });
    W.conch(s, { x: 2150, y: 500, blast: 1, t: 0.3 }); lab(2250, 640, "conch megaphone");
    const cp = el("clipPath", { id: "is" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#is)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -400)" }, dg);
    W.island(sg, { t: 0.3, canoes: 1 }); W.hut(sg, {}); Person.draw(sg, Object.assign({ x: 640, y: 1420, s: 1 }, W.LANI, F.happy)); W.hutFront(sg, {}); W.smoothie(sg, { x: 520, y: 1390 });
    Person.draw(sg, Object.assign({ x: 200, y: 1420, s: 1.1 }, W.KOA, F.shout)); W.rail(sg, {}); for (let i = 0; i < 8; i++) W.folk(sg, { x: -40 + i * 150, y: 1760 + (i % 2) * 60, s: 0.9, i, hop: 1, t: 0.3, cup: i % 2 }); lab(610, 1700, "beach + hut + rail + crowd");
    W.smoothie(s, { x: 1350, y: 1050, s: 1.2 }); W.crab(s, { x: 1550, y: 1050 }); W.bulb(s, { x: 1750, y: 980 }); W.offer(s, { x: 2100, y: 1000, s: 0.6 }); lab(1700, 1120, "smoothie / crab / bulb / offer");
    W.treeCard(s, { x: 1500, y: 1500, s: 0.45, t: 0.3 }); W.dropCard(s, { x: 2000, y: 1500, s: 0.45 }); lab(1750, 1680, "referral tree / Dropbox card");
  };
  root.World = W;
})(window);
