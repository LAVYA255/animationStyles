/* world.js — Samurai dojo ("He wanted to master the sword in one day"). Cast (original): Kenji (eager young student: topknot,
   red headband, white kimono / navy hakama), Sensei Hoshi (old master: bald, white beard + brows, grey robe, teacup).
   Set: dojo (shoji walls, a window whose sky goes day -> sunset -> night, an ink-circle scroll, a bokken rack), low wooden
   foreground rail. Props: bokken (wooden sword) with swing blur, rice bowl + chopstick, tear-off calendar, compounding chart
   (1.00 vs 1.01 per day), 365-day grid, bamboo stalk that gets sliced, teacup that gets sliced, slash streak. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.KENJI = { hairStyle: "spiky", hair: "#1E1A1A", skin: "#F1C9A5", outfit: "kimono", cloth: "#F4F1EA", cloth2: "#26324F", hat: "headband", hatC: "#E5484D", thickBrows: 1, blush: 0.2 };
  W.HOSHI = { hairStyle: "bald", hair: "#EDEAE4", beard: 1, mustache: 1, thickBrows: 1, skin: "#E2B48C", outfit: "robe", cloth: "#7C7F86", cloth2: "#4A4D55", blush: 0.3 };
  // sky: 0 day, 1 sunset, 2 night
  const skyC = (k) => k <= 1 ? [lerpC("#8FD3F0", "#F6A04D", k), lerpC("#D8F1FB", "#FBD38D", k)] : [lerpC("#F6A04D", "#1E2A4A", k - 1), lerpC("#FBD38D", "#3A4A72", k - 1)];
  W.dojo = (p, { t = 0, sky = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2500, height: 3400, fill: "#E9D9B8" }, g);
    // window with sky + sun / moon
    const [a, b] = skyC(sky), id = "dsky" + Math.round(sky * 20), d = el("defs", {}, g), lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: "0", "stop-color": a }, lg); el("stop", { offset: "1", "stop-color": b }, lg);
    el("rect", { x: 620, y: 300, width: 420, height: 460, fill: `url(#${id})`, stroke: INK, "stroke-width": 8 }, g);
    if (sky < 1.6) el("circle", { cx: 830, cy: lerp(400, 720, clamp(sky)), r: 54, fill: sky < 0.6 ? "#FFE27A" : "#FF8A4C", stroke: INK, "stroke-width": 5 }, g);
    else { el("circle", { cx: 900, cy: 420, r: 44, fill: "#F3EFD8", stroke: INK, "stroke-width": 5 }, g); el("circle", { cx: 920, cy: 410, r: 40, fill: skyC(sky)[0] }, g); }
    el("path", { d: "M620,640 Q700,590 780,640 T940,630 L1040,600 L1040,760 L620,760 Z", fill: lerpC("#6FA36A", "#24304F", clamp(sky - 1)), stroke: INK, "stroke-width": 5 }, g);
    for (const x of [760, 900]) el("line", { x1: x, y1: 300, x2: x, y2: 760, stroke: "#6B4428", "stroke-width": 8 }, g);
    el("line", { x1: 620, y1: 530, x2: 1040, y2: 530, stroke: "#6B4428", "stroke-width": 8 }, g);
    // shoji panels left
    for (let i = 0; i < 3; i++) { const x = -260 + i * 260; el("rect", { x, y: 160, width: 240, height: 940, fill: "#FBF6EA", stroke: "#6B4428", "stroke-width": 10 }, g);
      for (let j = 1; j < 4; j++) el("line", { x1: x + j * 60, y1: 160, x2: x + j * 60, y2: 1100, stroke: "#B89A74", "stroke-width": 4 }, g);
      for (let j = 1; j < 6; j++) el("line", { x1: x, y1: 160 + j * 156, x2: x + 240, y2: 160 + j * 156, stroke: "#B89A74", "stroke-width": 4 }, g); }
    // hanging scroll with an ink circle
    el("rect", { x: 1110, y: 240, width: 220, height: 560, fill: "#F7F0DE", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: 1096, y: 226, width: 248, height: 22, rx: 8, fill: "#6B4428", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: "M1220,400 m-70,0 a70,70 0 1,0 140,-10 a70,70 0 0,0 -110,-50", fill: "none", stroke: INK, "stroke-width": 16, "stroke-linecap": "round" }, g);
    // beams + floor
    el("rect", { x: -700, y: 110, width: 2500, height: 50, fill: "#8A5A3A", stroke: INK, "stroke-width": 7 }, g);
    el("rect", { x: -700, y: 1100, width: 2500, height: 1600, fill: "#C99A62", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 12; i++) el("line", { x1: -700, y1: 1130 + i * 40, x2: 1800, y2: 1130 + i * 40, stroke: "#B5864F", "stroke-width": 4 }, g);
    // bokken rack
    el("rect", { x: 1100, y: 880, width: 240, height: 24, fill: "#6B4428", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 3; i++) el("rect", { x: 1120 + i * 70, y: 840, width: 16, height: 260, rx: 6, fill: "#D8B07A", stroke: INK, "stroke-width": 4 }, g);
    return g; };
  W.rail = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: "#7A4E30", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 9; i++) el("line", { x1: -400 + i * 220, y1: y + 20, x2: -400 + i * 220, y2: y + 900, stroke: "#5E3A22", "stroke-width": 6 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 8, fill: "#A8754A", stroke: INK, "stroke-width": 8 }, g); return g; };
  // bokken: hilt at (x,y), ang in degrees (0 = pointing right, -90 = up)
  W.bokken = (p, { x, y, ang = -90, s = 1, blur = 0, prev = null }) => { const g = el("g", {}, p);
    if (blur > 0 && prev !== null) { const a0 = prev * Math.PI / 180, a1 = ang * Math.PI / 180, L = 400 * s;
      el("path", { d: `M${x},${y} L${x + Math.cos(a0) * L},${y + Math.sin(a0) * L} A${L},${L} 0 0,${a1 > a0 ? 1 : 0} ${x + Math.cos(a1) * L},${y + Math.sin(a1) * L} Z`, fill: "#FFFFFF", opacity: 0.55 * blur }, g); }
    const sg = el("g", { transform: `translate(${x} ${y}) rotate(${ang}) scale(${s})` }, g);
    el("rect", { x: -40, y: -11, width: 100, height: 22, rx: 8, fill: "#3B2A25", stroke: INK, "stroke-width": 5 }, sg);
    el("ellipse", { cx: 62, cy: 0, rx: 10, ry: 28, fill: "#2B2B3A", stroke: INK, "stroke-width": 4 }, sg);
    el("path", { d: "M70,-10 L380,-8 Q404,0 380,9 L70,10 Z", fill: "#D8B07A", stroke: INK, "stroke-width": 6 }, sg); return g; };
  W.bowl = (p, { x, y, s = 1, lift = 0, shake = 0, drop = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-90,-50 Q0,-120 90,-50 Z", fill: WH, stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 7; i++) el("ellipse", { cx: -60 + i * 20, cy: -62 - Math.sin(i) * 8, rx: 9, ry: 6, fill: "#F6F3EA", stroke: "#BBB", "stroke-width": 2 }, g);
    el("path", { d: "M-100,-50 L100,-50 Q90,20 0,24 Q-90,20 -100,-50 Z", fill: "#3F6FB0", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-70,-20 q20,-10 40,0 t40,0 t40,0", fill: "none", stroke: WH, "stroke-width": 5 }, g);
    const ly = -lift * 120 + drop * 140, rot = -30 + shake * Math.sin(lift * 60) * 6 + drop * 70;
    const cg = el("g", { transform: `translate(${60} ${-70 + ly}) rotate(${rot})` }, g);
    el("line", { x1: 0, y1: 0, x2: -160, y2: -40, stroke: "#8A5A3A", "stroke-width": 8, "stroke-linecap": "round" }, cg); el("line", { x1: 10, y1: 14, x2: -150, y2: -18, stroke: "#8A5A3A", "stroke-width": 8, "stroke-linecap": "round" }, cg); return g; };
  W.cal = (p, { x, y, s = 1, day = 1, flip = 0, rot = 3 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -130, y: -40, width: 260, height: 290, rx: 14, fill: WH, stroke: INK, "stroke-width": 7 }, g);
    el("rect", { x: -130, y: -40, width: 260, height: 70, rx: 14, fill: "#E5484D", stroke: INK, "stroke-width": 7 }, g);
    for (const cx of [-70, 70]) el("circle", { cx, cy: -40, r: 12, fill: "#555", stroke: INK, "stroke-width": 4 }, g);
    K.txt(g, 0, 20, "DAY", 46, WH); K.txt(g, 0, 190, String(day), day > 99 ? 104 : 132, INK);
    if (flip > 0 && flip < 1) { const pg = el("g", { transform: `translate(0 ${-40 - flip * 160}) rotate(${flip * 50}) ` }, g); el("rect", { x: -130, y: 70, width: 260, height: 220, fill: "#F3F3F3", stroke: INK, "stroke-width": 5, opacity: 1 - flip }, pg); }
    return g; };
  // compounding chart: k = how far the curves have drawn (0..1)
  W.chart = (p, { x, y, s = 1, k = 1, label = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -400, y: -330, width: 800, height: 640, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    const X0 = -330, Y0 = 220, Wd = 640, H = 470; el("path", { d: `M${X0},${Y0 - H} L${X0},${Y0} L${X0 + Wd},${Y0}`, fill: "none", stroke: INK, "stroke-width": 6 }, g);
    const N = Math.round(365 * k); let a = "", b = "";
    for (let i = 0; i <= N; i += 5) { const px = X0 + (i / 365) * Wd; a += (i ? "L" : "M") + px + "," + (Y0 - (Math.pow(1.01, i) / 38) * H); b += (i ? "L" : "M") + px + "," + (Y0 - (1 / 38) * H - 6); }
    if (N > 0) { el("path", { d: b, fill: "none", stroke: "#9AA0A6", "stroke-width": 9, "stroke-linecap": "round" }, g); el("path", { d: a, fill: "none", stroke: "#3FB8AF", "stroke-width": 12, "stroke-linecap": "round", "stroke-linejoin": "round" }, g); }
    K.txt(g, X0 + Wd / 2, Y0 + 66, "365 DAYS", 40, "#555");
    if (label > 0) { K.txt(g, X0 + Wd - 40, Y0 - 40, "SAME EVERY DAY = 1x", 32, "#777", "end");
      if (k > 0.85) K.txt(g, X0 + 190, Y0 - H + 40, "+1% A DAY = 38x", 46, "#24857E"); }
    return g; };
  W.days = (p, { x, y, s = 1, n = 365, cols = 25 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), c = 26;
    el("rect", { x: -cols * c / 2 - 30, y: -40, width: cols * c + 60, height: Math.ceil(365 / cols) * c + 70, rx: 24, fill: WH, stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 365; i++) { const cx = -cols * c / 2 + (i % cols) * c, cy = -10 + Math.floor(i / cols) * c;
      el("rect", { x: cx + 3, y: cy + 3, width: c - 6, height: c - 6, rx: 4, fill: i < n ? "#3FB8AF" : "#EEE", stroke: i < n ? "#24857E" : "#DDD", "stroke-width": 2 }, g); }
    return g; };
  W.bamboo = (p, { x, y, s = 1, cut = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), n = 5;
    for (let i = 0; i < n; i++) { const fly = cut > 0 ? cut : 0, dx = fly * (i - 2) * 90 + fly * Math.sin(i * 7) * 40, dy = -fly * (200 - i * 30) + fly * fly * 380, r = fly * (i % 2 ? 1 : -1) * (120 + i * 40);
      const sg = el("g", { transform: `translate(${dx} ${-i * 110 + dy}) rotate(${r} 0 -55)` }, g);
      el("rect", { x: -32, y: -110, width: 64, height: 110, rx: 10, fill: "#7CC46A", stroke: INK, "stroke-width": 6 }, sg); el("line", { x1: -32, y1: -6, x2: 32, y2: -6, stroke: INK, "stroke-width": 6 }, sg);
      el("line", { x1: -12, y1: -96, x2: -12, y2: -20, stroke: "#B7E3A8", "stroke-width": 7, "stroke-linecap": "round" }, sg); }
    el("path", { d: `M0,${-n * 110} q40,-60 90,-50 M0,${-n * 110} q-30,-70 -80,-60`, fill: "none", stroke: "#4E9A40", "stroke-width": 10, "stroke-linecap": "round", opacity: 1 - cut }, g); return g; };
  W.tea = (p, { x, y, s = 1, cut = 0, steam = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const half = (sx, k) => { const hg = el("g", { transform: `translate(${sx * k * 40} ${k * 18}) rotate(${sx * k * 18} 0 0)` }, g);
      el("path", { d: sx < 0 ? "M-56,-70 L0,-70 L0,0 Q-40,2 -50,-30 Z" : "M0,-70 L56,-70 L50,-30 Q40,2 0,0 Z", fill: "#D9E3E8", stroke: INK, "stroke-width": 6 }, hg);
      el("path", { d: sx < 0 ? "M-50,-58 L0,-58" : "M0,-58 L50,-58", stroke: "#7DA35A", "stroke-width": 10 }, hg); };
    half(-1, cut); half(1, cut);
    if (cut > 0.2) for (let i = 0; i < 3; i++) el("path", { d: `M${-8 + i * 8},-10 q-4,${30 + i * 10} 0,${70 + i * 20}`, fill: "none", stroke: "#7DA35A", "stroke-width": 8, "stroke-linecap": "round", opacity: clamp(cut * 1.5 - 0.3) }, g);
    if (steam > 0 && cut < 0.2) for (let i = 0; i < 2; i++) { const ph = (t * 0.6 + i / 2) % 1; el("path", { d: `M${-14 + i * 28},${-90 - ph * 70} q12,-14 0,-28 q-12,-14 0,-28`, fill: "none", stroke: "#BBB", "stroke-width": 6, "stroke-linecap": "round", opacity: Math.sin(ph * Math.PI) * steam }, g); }
    return g; };
  W.slash = (p, { k = 0, x1 = -100, y1 = 1300, x2 = 1200, y2 = 700 }) => { if (k <= 0 || k >= 1) return; const a = clamp(k * 2.2), b = clamp(k * 2.2 - 1.2);
    el("line", { x1: lerp(x1, x2, b), y1: lerp(y1, y2, b), x2: lerp(x1, x2, a), y2: lerp(y1, y2, a), stroke: WH, "stroke-width": 26, "stroke-linecap": "round" }, p);
    el("line", { x1: lerp(x1, x2, b), y1: lerp(y1, y2, b), x2: lerp(x1, x2, a), y2: lerp(y1, y2, a), stroke: "#7FD8F0", "stroke-width": 8, "stroke-linecap": "round" }, p); };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 12 · SAMURAI DOJO · \"He wanted to master the sword in one day\" — cast & props", 42);
    [["Kenji (eager)", W.KENJI, F.happy, {}], ["Kenji: swing!", W.KENJI, F.shout, { armL: { x: -40, y: -380 }, armR: { x: 30, y: -380 } }], ["Kenji: sunset, wrecked", W.KENJI, { eyes: "half", tired: 1, mouth: "wavy", sweat: 1 }, {}],
      ["Sensei Hoshi", W.HOSHI, F.calm, {}], ["Hoshi: deadpan", W.HOSHI, F.deadpan, {}]].forEach(([n, look, face, ex], i) => {
      const x = 220 + i * 420, y = 640, c = Object.assign({ x, y, s: 0.7 }, look, face, ex); Person.draw(s, c);
      if (i === 1) { const h = Person.hand(c, "R"); W.bokken(s, { x: h[0], y: h[1], ang: -80, s: 0.7 }); } lab(x, y + 50, n); });
    const cp = el("clipPath", { id: "dj" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#dj)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(150 -150)" }, dg);
    W.dojo(sg, { sky: 0.2 }); W.rail(sg, {}); W.bowl(sg, { x: 300, y: 1405 }); W.tea(sg, { x: 760, y: 1405 }); lab(610, 1700, "dojo (day), rail, rice bowl, tea");
    [[1250, 1], [1700, 2]].forEach(([x0, k], i) => { const c2 = el("clipPath", { id: "dw" + i }, s); el("rect", { x: x0, y: 840, width: 400, height: 300, rx: 12 }, c2); const g2 = el("g", { "clip-path": `url(#dw${i})` }, s); W.dojo(el("g", { transform: `translate(${x0 - 160} 760) scale(0.6)` }, g2), { sky: k }); }); lab(1650, 1180, "sunset / night window");
    W.bokken(s, { x: 1300, y: 1400, ang: -20, s: 0.8, blur: 1, prev: -110 }); lab(1450, 1460, "bokken + swing blur");
    W.bowl(s, { x: 1900, y: 1420, lift: 0.5, shake: 1 }); lab(1900, 1460, "chopstick lift");
    W.cal(s, { x: 1350, y: 1600, s: 0.6, day: 1 }); W.cal(s, { x: 1580, y: 1600, s: 0.6, day: 30 }); W.cal(s, { x: 1810, y: 1600, s: 0.6, day: 365 }); W.cal(s, { x: 2040, y: 1600, s: 0.6, day: 366, flip: 0.4 });
    W.chart(s, { x: 450, y: 2150, s: 0.7, k: 1 }); lab(450, 2420, "compounding chart");
    W.days(s, { x: 1150, y: 1950, s: 0.7, n: 200 }); lab(1150, 2420, "365-day grid");
    W.bamboo(s, { x: 1700, y: 2350, s: 0.6 }); W.bamboo(s, { x: 1900, y: 2350, s: 0.6, cut: 0.5 }); lab(1800, 2420, "bamboo / sliced");
    W.tea(s, { x: 2150, y: 2300, s: 1, cut: 0 }); W.tea(s, { x: 2300, y: 2300, s: 1, cut: 1 }); lab(2220, 2420, "tea / sliced");
    W.slash(s, { k: 0.5, x1: 1500, y1: 2600, x2: 2300, y2: 2450 });
  };
  root.World = W;
})(window);
