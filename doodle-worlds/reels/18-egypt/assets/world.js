/* world.js — Ancient Egypt ("The pyramid builders were paid in beer"). Cast (original): Overseer Nakht (striped nemes
   headdress, white tunic, gold collar, staff), the Worker (chill builder: short black hair, white headband, tank, beer jar).
   Set: desert sky (sun, day cycles), dunes, palms, the Nile strip, the pyramid under construction (layers, crooked, lean,
   golden capstone), a sandstone ledge (foreground). Props: beer jar with straw, flying block, snail hauling a block,
   +1 BEER tag, papyrus rule, plumb line, pay-for card, tiny tourist. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, SAND = "#E8C88A", STONE = "#D9B87A", STONE2 = "#C49A5A";
  W.NAKHT = { hairStyle: "short", hair: "#1E1A1A", skin: "#B07A4E", outfit: "tunic", cloth: "#F3EFE2", cloth2: "#F2C14E", hat: "nemes", hatC: "#2F6FB0", thickBrows: 1, blush: 0.2 };
  W.WORKER = { hairStyle: "short", hair: "#1E1A1A", skin: "#9A6440", outfit: "tank", cloth: "#F3EFE2", cloth2: "#D9CCAE", hat: "headband", hatC: "#FFFFFF", blush: 0.3 };
  W.desert = (p, { t = 0, cycle = 0 }) => { const g = el("g", {}, p), nite = cycle > 0 ? 0.5 - 0.5 * Math.cos(cycle * Math.PI * 2) : 0;
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#FFD9A0", "#2A2E5A", nite) }, g);
    el("rect", { x: -700, y: -700, width: 2600, height: 1100, fill: lerpC("#8FCFEA", "#1B2447", nite), opacity: 0.8 }, g);
    const sa = cycle > 0 ? cycle * Math.PI * 2 : 0; el("circle", { cx: 880 - Math.sin(sa) * 300, cy: 260 + (1 - Math.cos(sa)) * 200, r: 78, fill: "#FFE27A", stroke: INK, "stroke-width": 6, opacity: 1 - nite }, g);
    el("path", { d: "M-700,1080 Q-200,960 300,1060 T1300,1040 T1900,1060 L1900,1200 L-700,1200 Z", fill: lerpC("#E8B86A", "#5A4A6A", nite), stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -700, y: 1120, width: 2600, height: 50, fill: lerpC("#4FA3C9", "#22305A", nite), stroke: INK, "stroke-width": 5 }, g);
    for (const [px, s] of [[-80, 1], [1040, 0.9]]) { const pg = el("g", { transform: `translate(${px} 1130) scale(${s})` }, g); el("path", { d: "M0,0 Q10,-150 -10,-300", fill: "none", stroke: "#8A5A3A", "stroke-width": 16 }, pg);
      for (let i = 0; i < 5; i++) { const a = -160 + i * 35 + Math.sin(t + i) * 4; el("path", { d: `M-10,-300 q${Math.cos(a * Math.PI / 180) * 90},${Math.sin(a * Math.PI / 180) * 90 - 30} ${Math.cos(a * Math.PI / 180) * 170},${Math.sin(a * Math.PI / 180) * 170 + 50}`, fill: "none", stroke: "#3F9A4A", "stroke-width": 16, "stroke-linecap": "round" }, pg); } }
    el("rect", { x: -700, y: 1165, width: 2600, height: 1600, fill: lerpC(SAND, "#7A6A7A", nite), stroke: INK, "stroke-width": 6 }, g);
    if (nite > 0.3) for (let i = 0; i < 20; i++) { const r = MK.rng(i + 2); el("circle", { cx: -200 + r() * 1500, cy: r() * 700, r: 3, fill: WH, opacity: nite }, g); }
    return g; };
  // pyramid: layers built (0..8), crooked 0..1, lean -1..1, cap 0..1 (golden capstone), glow
  W.pyramid = (p, { x = 560, y = 1150, s = 1, layers = 3, crooked = 0, lean = 0, cap = 0, glow = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s}) skewX(${lean * -18})` }, p);
    const N = 8, H = 52, B = 880;
    if (glow > 0) el("path", { d: `M${-B / 2 - 40},10 L0,${-N * H - 80} L${B / 2 + 40},10 Z`, fill: "#FFE27A", opacity: 0.35 * glow }, g);
    for (let i = 0; i < N; i++) { const wd = B * (1 - i / N), yy = -(i + 1) * H, built = clamp(layers - i); if (built <= 0) continue;
      const r = MK.rng(i + 7), dx = crooked * (r() - 0.5) * 70, rot = crooked * (r() - 0.5) * 10;
      const lg = el("g", { transform: `translate(${dx} ${yy + (1 - built) * -40}) rotate(${rot})`, opacity: built }, g);
      el("rect", { x: -wd / 2, y: 0, width: wd, height: H, fill: i % 2 ? STONE : STONE2, stroke: INK, "stroke-width": 5 }, lg);
      for (let j = 1; j < Math.floor(wd / 90); j++) el("line", { x1: -wd / 2 + j * 90 + (i % 2) * 45, y1: 0, x2: -wd / 2 + j * 90 + (i % 2) * 45, y2: H, stroke: "#A8804A", "stroke-width": 3 }, lg); }
    if (cap > 0) { const cg = el("g", { transform: `translate(0 ${-N * H}) scale(${cap})` }, g); el("path", { d: "M-56,0 L0,-70 L56,0 Z", fill: "#F2C14E", stroke: INK, "stroke-width": 5 }, cg); el("path", { d: "M-20,-30 l14,-20", stroke: WH, "stroke-width": 6, "stroke-linecap": "round" }, cg); }
    return g; };
  W.ledge = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: STONE2, stroke: INK, "stroke-width": 8 }, g);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) el("rect", { x: -400 + c * 200 + (r % 2) * 100, y: y + 30 + r * 90, width: 200, height: 90, fill: "none", stroke: "#A8804A", "stroke-width": 4 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 6, fill: STONE, stroke: INK, "stroke-width": 8 }, g); return g; };
  W.beer = (p, { x, y, s = 1, k = 1, rot = 0, straw = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, p);
    el("path", { d: "M-50,-110 Q-70,-50 -44,0 L44,0 Q70,-50 50,-110 Z", fill: "#C46A3E", stroke: INK, "stroke-width": 6 }, g);
    el("ellipse", { cx: 0, cy: -110, rx: 52, ry: 14, fill: "#8A4A2A", stroke: INK, "stroke-width": 5 }, g); el("ellipse", { cx: 0, cy: -112, rx: 44, ry: 9, fill: "#F2E2B0" }, g);
    el("path", { d: "M-24,-60 l12,-14 l12,14 l12,-14 l12,14", fill: "none", stroke: "#F2C14E", "stroke-width": 5 }, g);
    if (straw) el("line", { x1: 10, y1: -110, x2: 60, y2: -200, stroke: "#E8C872", "stroke-width": 8, "stroke-linecap": "round" }, g); return g; };
  W.block = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -60, y: -40, width: 120, height: 80, fill: STONE, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-40,-20 h30 M10,10 h30", stroke: "#A8804A", "stroke-width": 4 }, g); return g; };
  W.snail = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    W.block(g, { x: 10, y: -110, s: 0.7 });
    el("path", { d: "M-60,0 Q-70,-30 -40,-34 L60,-30 Q90,-28 96,0 Z", fill: "#9AC46A", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 0, cy: -46, r: 40, fill: "#D9A05A", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M0,-46 m-20,0 a20,20 0 1,0 20,-20", fill: "none", stroke: INK, "stroke-width": 4 }, g);
    el("line", { x1: 80, y1: -26, x2: 96, y2: -70, stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: 96, cy: -72, r: 7, fill: INK }, g);
    el("path", { d: "M70,-8 q8,6 16,0", fill: "none", stroke: INK, "stroke-width": 3 }, g); return g; };
  W.papyrus = (p, { x, y, s = 1, k = 1, rot = -3 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, p);
    el("rect", { x: -200, y: -120, width: 400, height: 240, fill: "#F3E2B0", stroke: INK, "stroke-width": 6 }, g);
    for (const yy of [-120, 120]) el("rect", { x: -214, y: yy - 14, width: 428, height: 28, rx: 14, fill: "#C49A5A", stroke: INK, "stroke-width": 5 }, g);
    K.txt(g, 0, -30, "NEW RULE:", 40, "#5A3A22"); K.txt(g, 0, 30, "STRAIGHT BLOCKS", 40, "#2F6FB0"); K.txt(g, 0, 80, "= BEER", 44, "#C46A3E"); return g; };
  W.plumb = (p, { x, y, len = 300, sw = 0 }) => { el("line", { x1: x, y1: y, x2: x + sw * 40, y2: y + len, stroke: INK, "stroke-width": 4 }, p);
    el("path", { d: `M${x + sw * 40 - 18},${y + len} L${x + sw * 40 + 18},${y + len} L${x + sw * 40},${y + len + 40} Z`, fill: "#F2C14E", stroke: INK, "stroke-width": 4 }, p); };
  W.tourist = (p, { x, y, s = 1, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("circle", { cx: 0, cy: -150, r: 26, fill: "#F0C7A4", stroke: INK, "stroke-width": 4 }, g); el("path", { d: "M-30,-176 Q0,-200 30,-176 L36,-168 L-36,-168 Z", fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g);
    el("rect", { x: -26, y: -124, width: 52, height: 80, rx: 12, fill: "#3FB8AF", stroke: INK, "stroke-width": 4 }, g); el("line", { x1: -14, y1: -44, x2: -16, y2: 0, stroke: INK, "stroke-width": 8 }, g); el("line", { x1: 14, y1: -44, x2: 16, y2: 0, stroke: INK, "stroke-width": 8 }, g);
    el("line", { x1: 20, y1: -110, x2: 60, y2: -170, stroke: INK, "stroke-width": 7 }, g); el("rect", { x: 48, y: -200, width: 26, height: 40, rx: 5, fill: "#3A3F45", stroke: INK, "stroke-width": 3 }, g);
    if (Math.sin(t * 6) > 0.9) el("circle", { cx: 61, cy: -180, r: 30, fill: WH, opacity: 0.7 }, g); return g; };
  W.payCard = (p, { x, y, s = 1, k = 1, good = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -300, width: 880, height: 600, rx: 36, fill: "#FBF3DE", stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -224, "YOU GET WHAT YOU PAY FOR", 44, "#5A3A22");
    const row = (yy, a, b, ok, op) => { const rg = el("g", { opacity: op }, g); el("rect", { x: -390, y: yy - 70, width: 780, height: 140, rx: 20, fill: ok ? "#E3F7EE" : "#FFE3E3", stroke: ok ? "#24857E" : "#E5484D", "stroke-width": 6 }, rg);
      K.txt(rg, -360, yy - 10, "PAY FOR:", 34, "#555", "start"); K.txt(rg, -360, yy + 40, a, 40, ok ? "#1F6E56" : "#B03A3A", "start"); K.txt(rg, 360, yy + 18, b, 44, ok ? "#24857E" : "#E5484D", "end"); };
    row(-60, "BLOCKS", "CROOKED ✗", 0, 1); row(150, "STRAIGHT BLOCKS", "PYRAMID ✓", 1, good); return g; };

  W.sheet = (s) => {
    window.FONT = "Bungee"; const lab = (x, y, t, z = 26) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 18 · ANCIENT EGYPT · \"The pyramid builders were paid in beer\"", 36);
    [["Nakht", W.NAKHT, F.smug], ["Nakht: FASTER!", W.NAKHT, F.shout], ["Nakht: leaning?!", W.NAKHT, Object.assign({}, F.shock, { sweat: 1 })], ["Worker", W.WORKER, F.calm], ["Worker: proud", W.WORKER, F.happy]].forEach(([n, look, face], i) => {
      const x = 220 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.66 }, look, face)); lab(x, y + 50, n); });
    const cp = el("clipPath", { id: "eg" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#eg)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -250)" }, dg);
    W.desert(sg, { t: 0.3 }); W.pyramid(sg, { layers: 5 }); Person.draw(sg, Object.assign({ x: 300, y: 1420, s: 1 }, W.NAKHT, F.smug)); Person.draw(sg, Object.assign({ x: 800, y: 1420, s: 1 }, W.WORKER, F.calm)); W.ledge(sg, {}); W.beer(sg, { x: 900, y: 1405, s: 0.8 }); lab(610, 1700, "desert + pyramid (building)");
    W.pyramid(s, { x: 1450, y: 1150, s: 0.4, layers: 8, crooked: 1, lean: 0.7 }); lab(1450, 1190, "crooked + leaning");
    W.pyramid(s, { x: 1950, y: 1150, s: 0.4, layers: 8, cap: 1, glow: 1 }); lab(1950, 1190, "finished + capstone");
    W.beer(s, { x: 1350, y: 1450 }); W.block(s, { x: 1550, y: 1420, rot: 12 }); W.snail(s, { x: 1780, y: 1450 }); W.tourist(s, { x: 2050, y: 1450 }); lab(1700, 1500, "beer / block / snail / tourist");
    W.papyrus(s, { x: 450, y: 2000, s: 0.8 }); W.payCard(s, { x: 1150, y: 2050, s: 0.55, good: 1 }); lab(800, 2250, "papyrus rule / pay-for card");
  };
  root.World = W;
})(window);
