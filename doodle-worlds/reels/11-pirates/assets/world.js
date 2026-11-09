/* world.js — Pirate ship ("How different IQ pirates split the treasure"). Cast (original): Gus (low IQ: wild ginger hair + beard),
   Fen (medium: eyepatch, blue stripes), Captain Ada (high: tricorn, long hair, coat), Pip the parrot. Set: ship deck at sea
   (sky, waves, mast, sail, rigging), a treasure chest + gold pile on a barrel-top table (foreground rail). Props: coins, the two
   piles, brawl cloud, tally marks, sun/moon time-lapse, the IQ cards, the "I cut, you choose" card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.GUS = { hairStyle: "wild", hair: "#C0612B", beard: 1, skin: "#E9B48A", outfit: "pirate", cloth: "#E5484D", cloth2: "#5A3A22", thickBrows: 1, earring: 1, blush: 0.4 };
  W.FEN = { hairStyle: "short", hair: "#2A1E1A", eyepatch: 1, skin: "#C98E62", outfit: "pirate", cloth: "#2F6FB0", cloth2: "#3A3A4A", blush: 0.3 };
  W.ADA = { hairStyle: "long", hair: "#6B4428", skin: "#F0C7A4", outfit: "coat", cloth: "#7A2E46", cloth2: "#5A1E32", hat: "tricorn", hatC: "#2B2B3A", earring: 1, blush: 0.5 };
  W.deck = (p, { t = 0, sky = 0 }) => { const g = el("g", {}, p);
    const top = lerpC("#7EC8E3", "#1E2A4A", sky), bot = lerpC("#D9F0FA", "#3A4A72", sky);
    const d = el("defs", {}, g), lg = el("linearGradient", { id: "psky" + Math.round(sky * 10), x1: 0, y1: 0, x2: 0, y2: 1 }, d); el("stop", { offset: "0", "stop-color": top }, lg); el("stop", { offset: "1", "stop-color": bot }, lg);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: `url(#psky${Math.round(sky * 10)})` }, g);
    for (let i = 0; i < 4; i++) el("path", { d: `M-700,${980 + i * 40} Q${-400 + Math.sin(t * 2 + i) * 40},${960 + i * 40} -100,${980 + i * 40} T500,${980 + i * 40} T1100,${980 + i * 40} T1700,${980 + i * 40} L1700,1300 L-700,1300 Z`, fill: lerpC(["#4FA3C9", "#3F93B9", "#2F83A9", "#1F7399"][i], "#22305A", sky), opacity: 0.95 }, g);
    // mast + sail + rigging
    el("rect", { x: 500, y: -200, width: 50, height: 1300, fill: "#8A5A3A", stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: `M550,120 Q${780 + Math.sin(t * 1.5) * 20},380 560,700 L560,120 Z`, fill: "#F3E9D2", stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M600,300 L660,300 L640,380 Z M640,380 l-30,40 m30,-40 l30,40", fill: "none", stroke: INK, "stroke-width": 6 }, g);
    for (const [x1, x2] of [[525, -200], [525, 1300]]) el("line", { x1, y1: 0, x2, y2: 1100, stroke: "#6B4428", "stroke-width": 5 }, g);
    for (let i = 0; i < 6; i++) el("line", { x1: lerp(525, -200, 0.15 + i * 0.13), y1: 150 + i * 150, x2: lerp(525, 1300, 0.15 + i * 0.13), y2: 150 + i * 150, stroke: "#6B4428", "stroke-width": 3, opacity: 0.6 }, g);
    el("path", { d: "M-700,1100 L1800,1100 L1800,2600 L-700,2600 Z", fill: "#B8895A", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 14; i++) el("line", { x1: -700 + i * 190, y1: 1100, x2: -900 + i * 240, y2: 1500, stroke: "#9A6A44", "stroke-width": 5 }, g);
    return g; };
  W.rail = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 26, width: 1880, height: 900, fill: "#8A5A3A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 14; i++) el("rect", { x: -380 + i * 140, y: y + 50, width: 30, height: 260, rx: 10, fill: "#A8754A", stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: -420, y, width: 1920, height: 36, rx: 8, fill: "#C9935E", stroke: INK, "stroke-width": 8 }, g);
    el("circle", { cx: 980, cy: y + 160, r: 70, fill: "none", stroke: "#E5484D", "stroke-width": 22 }, g); el("circle", { cx: 980, cy: y + 160, r: 70, fill: "none", stroke: WH, "stroke-width": 22, "stroke-dasharray": "36 36" }, g); return g; };
  // the gold: a heap (amount 0..1), or split into two piles (split 0..1, bias -1..1 = which pile is bigger)
  W.gold = (p, { x, y, s = 1, amount = 1, split = 0, bias = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const heap = (cx, n, w0) => { for (let i = 0; i < n; i++) { const row = Math.floor(Math.sqrt(i * 2)), col = i - row * (row + 1) / 2; const cx2 = cx + (col - row / 2) * 34 * w0, cy2 = -12 - (Math.floor(n / 6) - row) * 20;
        el("ellipse", { cx: cx2, cy: cy2, rx: 22, ry: 11, fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g); } };
    if (split <= 0) { const n = Math.round(30 * amount); for (let i = 0; i < n; i++) { const r = MK.rng(i + 3), a = r() * Math.PI, rr = r() * 130 * Math.sqrt(amount);
        el("ellipse", { cx: Math.cos(a) * rr * 1.4, cy: -Math.sin(a) * rr * 0.7 - 6, rx: 22, ry: 11, fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g); } }
    else { const off = 130 * split, nL = Math.round(15 * (1 + bias * 0.3)), nR = Math.round(15 * (1 - bias * 0.3));
      for (const [cx, n] of [[-off, nL], [off, nR]]) for (let i = 0; i < n; i++) { const r = MK.rng(i + (cx < 0 ? 5 : 9)), a = r() * Math.PI, rr = r() * 90; el("ellipse", { cx: cx + Math.cos(a) * rr * 1.2, cy: -Math.sin(a) * rr * 0.7 - 6, rx: 22, ry: 11, fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g); } }
    for (let i = 0; i < 3; i++) { const ph = (t * 1.2 + i / 3) % 1, sx = -100 + i * 100; el("path", { d: `M${sx},${-80 - ph * 30} l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4 Z`, fill: WH, opacity: Math.sin(ph * Math.PI) * amount }, g); }
    return g; };
  W.chest = (p, { x, y, s = 1, open = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -120, y: -100, width: 240, height: 100, rx: 8, fill: "#8A5A3A", stroke: INK, "stroke-width": 6 }, g);
    for (const sx of [-80, 80]) el("rect", { x: sx - 10, y: -100, width: 20, height: 100, fill: "#C48E1C", stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: `M-120,-100 Q0,${-100 - 90 * (1 - open) - 40} 120,-100 L120,${-100 - 60 * open} Q0,${-190 - 40 * open} -120,${-100 - 60 * open} Z`, fill: "#A8754A", stroke: INK, "stroke-width": 6 }, g); return g; };
  W.brawl = (p, { x, y, s = 1, t = 0, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + t * 3; el("circle", { cx: Math.cos(a) * 120, cy: Math.sin(a) * 80, r: 80 + 10 * Math.sin(t * 8 + i), fill: "#E8E2DA", stroke: INK, "stroke-width": 6 }, g); }
    el("circle", { cx: 0, cy: 0, r: 110, fill: "#E8E2DA" }, g);
    for (const [ch, x0, y0] of [["*", -60, -20], ["!", 50, -30], ["#", 0, 40], ["@", -90, 50]]) K.txt(g, x0 + Math.sin(t * 12 + x0) * 10, y0, ch, 60, INK);
    for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i / 3) % 1; el("rect", { x: -10 + (i - 1) * 90 + ph * 40, y: -100 - ph * 140, width: 18, height: 22, rx: 6, fill: WH, stroke: INK, "stroke-width": 3, transform: `rotate(${ph * 400} ${(i - 1) * 90} ${-90 - ph * 140})`, opacity: 1 - ph }, g); }
    return g; };
  W.tally = (p, { x, y, s = 1, n = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, gx = grp * 90;
      if (j < 4) el("line", { x1: gx + j * 16, y1: 0, x2: gx + j * 16, y2: 60, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
      else el("line", { x1: gx - 6, y1: 10, x2: gx + 58, y2: 50, stroke: "#E5484D", "stroke-width": 6, "stroke-linecap": "round" }, g); } return g; };
  W.parrot = (p, { x, y, s = 1, t = 0, beak = 0, flap = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const fl = flap ? Math.sin(t * 30) * 40 : 0;
    el("path", { d: `M-20,-20 Q${-110},${-60 - fl} ${-100},${30 - fl} Q-60,10 -30,20 Z`, fill: "#3FA35A", stroke: INK, "stroke-width": 5 }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 50, ry: 70, fill: "#4FC36A", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M-10,60 L-30,130 L0,110 L20,140 L20,60 Z", fill: "#2F8A4A", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 10, cy: -70, r: 44, fill: "#4FC36A", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M0,-120 q10,-30 30,-10 M14,-116 q20,-24 34,0", fill: "none", stroke: "#E5484D", "stroke-width": 8, "stroke-linecap": "round" }, g);
    el("circle", { cx: 24, cy: -80, r: 13, fill: WH, stroke: INK, "stroke-width": 3 }, g); el("circle", { cx: 28, cy: -80, r: 6, fill: INK }, g);
    el("path", { d: `M44,-76 Q86,-70 70,-36 Q60,-${30 - beak * 10} 46,-50 Z`, fill: "#F2C14E", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.iq = (p, { x, y, level = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(-4) scale(${k})` }, p);
    const txt = ["LOW IQ", "MEDIUM IQ", "HIGH IQ"][level - 1], col = ["#E5484D", "#F2C14E", "#3FB8AF"][level - 1], w = 180 + txt.length * 42;
    el("rect", { x: -w / 2, y: -70, width: w, height: 130, rx: 24, fill: WH, stroke: INK, "stroke-width": 8 }, g);
    const bs = 0.5 + level * 0.25, bg = el("g", { transform: `translate(${-w / 2 + 70} -6) scale(${bs})` }, g);
    el("path", { d: "M-40,20 Q-60,-10 -40,-34 Q-30,-56 0,-50 Q30,-56 40,-34 Q60,-10 40,20 Q20,40 0,30 Q-20,40 -40,20 Z", fill: "#FF9FB3", stroke: INK, "stroke-width": 6 / bs }, bg);
    K.txt(g, -w / 2 + 140 + (w - 160) / 2, 20, txt, 64, col, "middle", { stroke: INK, "stroke-width": 3, "paint-order": "stroke" }); return g; };
  W.cut = (p, { x, y, s = 1, k = 1, stage = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -460, y: -300, width: 920, height: 600, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    if (stage > 0) { K.txt(g, -230, -200, "1. I CUT", 56, "#7A2E46"); W.gold(g, { x: -230, y: 40, s: 1.0, split: 1, t }); }
    if (stage > 1) { K.txt(g, 230, -200, "2. YOU CHOOSE", 56, "#2F6FB0"); W.gold(g, { x: 230, y: 40, s: 1.0, split: 1, t }); K.arrow(g, { x1: 60, y1: 150, x2: 130, y2: 70, k: 1, color: "#2F6FB0" }); }
    if (stage > 2) K.txt(g, 0, 210, "= FAIR, EVERY TIME", 52, "#3FB8AF"); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 11 · PIRATE SHIP · \"How different IQ pirates split the treasure\" — cast & props", 42);
    [["Gus (low IQ)", W.GUS, F.happy], ["Gus: MINE!", W.GUS, F.shout], ["Fen (medium)", W.FEN, F.think], ["Fen: still counting", W.FEN, { eyes: "half", lid: 0.6, tired: 1, mouth: "flat" }], ["Captain Ada (high)", W.ADA, F.smug]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    W.parrot(s, { x: 2200, y: 520, s: 1.0, beak: 1 }); lab(2200, 690, "Pip the parrot");
    const cp = el("clipPath", { id: "dk" }, s); el("rect", { x: 60, y: 780, width: 1100, height: 860, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#dk)" }, s), sg = el("g", { transform: "translate(60 780) scale(0.62) translate(0 -300)" }, dg);
    W.deck(sg, { t: 0.3 }); W.rail(sg, {}); W.chest(sg, { x: 300, y: 1405, s: 0.7 }); W.gold(sg, { x: 600, y: 1405, s: 0.9 }); lab(610, 1680, "the deck, the chest, the gold");
    W.gold(s, { x: 1450, y: 1100, s: 0.8 }); W.gold(s, { x: 1950, y: 1100, s: 0.8, split: 1, bias: 0.3 }); lab(1700, 1170, "gold: heap / two piles");
    W.brawl(s, { x: 1450, y: 1400, s: 0.7, t: 0.3 }); W.tally(s, { x: 1800, y: 1380, s: 1, n: 12 }); lab(1700, 1560, "brawl / tally marks");
    W.iq(s, { x: 450, y: 1900, level: 1 }); W.iq(s, { x: 1150, y: 1900, level: 2 }); W.iq(s, { x: 1850, y: 1900, level: 3 }); lab(1150, 2040, "IQ cards");
    W.cut(s, { x: 1200, y: 2400, s: 0.45, stage: 3, t: 0.3 }); lab(1200, 2580, "I cut, you choose");
  };
  root.World = W;
})(window);
