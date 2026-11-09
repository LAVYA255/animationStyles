/* world.js — Dinosaur age ("The dinosaurs ignored a tiny competitor"). Cast (original): Rex (T-rex CEO: green, red tie, tiny
   arms, can go skinny), Mo (tiny shrew: big round ears, pink pointy nose, green apron), a long-neck customer, tiny critter
   customers. Set: prehistoric valley (sky day/night/ash, volcano, ferns), Rex's giant stall "REX'S BIG FOOD" (meat + leaves),
   Mo's tiny crate stall "NIGHT SNACKS" (lantern, beetle jar, upgrades). Props: meteor, niche diagram, price sign. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  const SK = (night, ash) => { let a = lerpC("#8FD3F0", "#1B2447", night), b = lerpC("#E6F6FB", "#3B3F6E", night);
    if (ash > 0) { a = lerpC(a, "#7A4A3A", ash); b = lerpC(b, "#E08A4A", ash); } return [a, b]; };
  W.valley = (p, { t = 0, night = 0, ash = 0 }) => { const g = el("g", {}, p), [a, b] = SK(night, ash), id = "vs" + Math.round(night * 10) + "_" + Math.round(ash * 10);
    const d = el("defs", {}, g), lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d); el("stop", { offset: "0", "stop-color": a }, lg); el("stop", { offset: "1", "stop-color": b }, lg);
    el("rect", { x: -800, y: -800, width: 2700, height: 3600, fill: `url(#${id})` }, g);
    if (night > 0.3 && ash < 0.5) for (let i = 0; i < 26; i++) { const r = MK.rng(i + 11); el("circle", { cx: -300 + r() * 1700, cy: -100 + r() * 800, r: 2 + r() * 4, fill: WH, opacity: (night - 0.3) * (0.6 + 0.4 * Math.sin(t * 3 + i)) }, g); }
    if (night < 0.5 && ash < 0.3) el("circle", { cx: 160, cy: 300, r: 80, fill: "#FFE27A", stroke: INK, "stroke-width": 6, opacity: 1 - night * 2 }, g);
    if (night > 0.5 && ash < 0.3) { el("circle", { cx: 860, cy: 260, r: 64, fill: "#F3EFD8", stroke: INK, "stroke-width": 6, opacity: (night - 0.5) * 2 }, g); }
    // volcano + smoke
    el("path", { d: "M380,1180 L620,700 L700,700 L980,1180 Z", fill: lerpC("#7A6A5A", "#3A2E36", night), stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M620,700 L700,700 L690,760 L660,740 L640,770 Z", fill: "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.25 + i / 3) % 1; el("circle", { cx: 660 + Math.sin(ph * 5 + i) * 30, cy: 680 - ph * 300, r: 30 + ph * 60 + ash * 40, fill: ash > 0 ? "#5A4A48" : "#BFB8B0", opacity: (0.7 + ash * 0.3) * (1 - ph) }, g); }
    // far hills + ferns
    el("path", { d: "M-800,1120 Q-300,960 100,1100 T900,1080 T1900,1100 L1900,1300 L-800,1300 Z", fill: lerpC(lerpC("#6FB36A", "#2A3F52", night), "#6A5A40", ash), stroke: INK, "stroke-width": 6 }, g);
    const fern = (x, y, s, f) => { const fg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g); el("line", { x1: 0, y1: 0, x2: 10, y2: -260, stroke: "#6B4428", "stroke-width": 14 }, fg);
      for (let i = 0; i < 6; i++) { const a = -150 + i * 24 + Math.sin(t * 1.2 + i + x) * 4; el("path", { d: `M10,-260 q${Math.cos(a * Math.PI / 180) * 120},${Math.sin(a * Math.PI / 180) * 120 - 40} ${Math.cos(a * Math.PI / 180) * 220},${Math.sin(a * Math.PI / 180) * 220 + 60}`, fill: "none", stroke: f, "stroke-width": 18, "stroke-linecap": "round" }, fg); } };
    const fc = lerpC(lerpC("#3F9A4A", "#1F3A3A", night), "#5A4A30", ash); fern(-120, 1300, 1.3, fc); fern(1080, 1280, 1.2, fc); fern(980, 1320, 0.9, fc);
    el("rect", { x: -800, y: 1250, width: 2700, height: 1500, fill: lerpC(lerpC("#C9A46A", "#4A4048", night), "#6A4A3A", ash), stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 18; i++) { const r = MK.rng(i + 40); el("ellipse", { cx: -200 + r() * 1500, cy: 1300 + r() * 600, rx: 20 + r() * 30, ry: 8 + r() * 8, fill: "#00000018" }, g); }
    return g; };
  // Rex: origin at the waist (cut by the stall counter), facing right
  W.rex = (p, { x, y, s = 1, t = 0, jaw = 0, eye = "open", look = [0.6, 0], lean = 0, skinny = 0, arms = 0, brow = 0, sweat = 0, tear = 0, blushK = 0 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), G = lerpC("#5DBB63", "#8FA27A", skinny), B = lerpC("#D6EDB4", "#D9D2B0", skinny);
    const bx = 1 - 0.32 * skinny;
    el("path", { d: `M${-230 * bx},40 Q${-260 * bx},-420 ${-40 * bx},-540 Q${200 * bx},-560 ${230 * bx},-300 L${240 * bx},40 Z`, fill: G, stroke: INK, "stroke-width": 9 }, g);
    for (let i = 0; i < 5; i++) el("path", { d: `M${(-210 + i * 50) * bx},${-430 - i * 22} l${-30},-40 l40,6 Z`, fill: "#3F8A45", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: `M${-60 * bx},40 Q${-80 * bx},-300 ${60 * bx},-420 Q${200 * bx},-300 ${170 * bx},40 Z`, fill: B, stroke: INK, "stroke-width": 6 }, g);
    if (skinny > 0.3) for (let i = 0; i < 4; i++) el("path", { d: `M${-20 * bx},${-300 + i * 55} q${70 * bx},20 ${140 * bx},0`, fill: "none", stroke: INK, "stroke-width": 4, opacity: skinny }, g);
    // tie
    el("path", { d: "M70,-500 L110,-500 L104,-470 L130,-330 L90,-290 L66,-330 L84,-470 Z", fill: "#E5484D", stroke: INK, "stroke-width": 6 }, g);
    // tiny arms
    const armA = arms === 1 ? Math.sin(t * 9) * 30 : arms === 2 ? -50 : 0;
    for (const [ax, ay] of [[150, -370], [120, -330]]) { const ag = el("g", { transform: `translate(${ax * bx} ${ay}) rotate(${armA + (ax === 150 ? 0 : 15)})` }, g);
      el("path", { d: "M0,0 Q40,-10 70,20 L60,34 Q34,14 0,24 Z", fill: G, stroke: INK, "stroke-width": 6 }, ag); el("path", { d: "M66,22 l14,-8 M64,30 l16,4", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, ag); }
    // head (pivot at the neck)
    const hg = el("g", { transform: `translate(${40 * bx} -520) rotate(${lean})` }, g);
    const jg = el("g", { transform: `rotate(${jaw * 26} -60 -40)` }, hg);
    el("path", { d: "M-80,-60 L330,-40 Q360,-30 340,-6 L-60,30 Q-110,0 -80,-60 Z", fill: G, stroke: INK, "stroke-width": 8 }, jg);
    for (let i = 0; i < 7; i++) el("path", { d: `M${20 + i * 44},${-44 + i * 1} l14,-26 l14,26 Z`, fill: WH, stroke: INK, "stroke-width": 3 }, jg);
    el("path", { d: "M-160,-120 Q-170,-260 0,-280 Q200,-290 330,-200 Q380,-160 360,-90 Q350,-50 300,-46 L-80,-60 Q-150,-60 -160,-120 Z", fill: G, stroke: INK, "stroke-width": 8 }, hg);
    for (let i = 0; i < 7; i++) el("path", { d: `M${20 + i * 44},${-50 - i * 0.5} l14,26 l14,-26 Z`, fill: WH, stroke: INK, "stroke-width": 3 }, hg);
    el("ellipse", { cx: 330, cy: -150, rx: 10, ry: 6, fill: INK }, hg);
    if (blushK > 0) el("ellipse", { cx: 150, cy: -110, rx: 40, ry: 18, fill: "#FF9FB3", opacity: blushK }, hg);
    const ex = 70, ey = -190;
    if (eye === "closed") el("path", { d: `M${ex - 32},${ey} q32,22 64,0`, fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, hg);
    else if (eye === "happy") el("path", { d: `M${ex - 32},${ey + 6} q32,-30 64,0`, fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, hg);
    else { const r = eye === "wide" ? 46 : 36; el("circle", { cx: ex, cy: ey, r, fill: "#FFF6C8", stroke: INK, "stroke-width": 6 }, hg); el("circle", { cx: ex + look[0] * 12, cy: ey + look[1] * 10, r: eye === "tiny" ? 7 : 14, fill: INK }, hg);
      if (eye === "half") el("path", { d: `M${ex - r},${ey} A${r},${r} 0 0,1 ${ex + r},${ey} Z`, fill: G, stroke: INK, "stroke-width": 6 }, hg); }
    el("path", { d: `M${ex - 44},${ey - 50 + brow * 10} L${ex + 40},${ey - 60 - brow * 16}`, stroke: INK, "stroke-width": 12, "stroke-linecap": "round" }, hg);
    if (sweat) el("path", { d: "M-30,-230 q-14,26 0,36 q14,-10 0,-36 Z", fill: "#7FD8F0", stroke: INK, "stroke-width": 3 }, hg);
    if (tear) el("path", { d: `M${ex + 10},${ey + 40} q-10,30 0,44 q10,-14 0,-44 Z`, fill: "#7FD8F0", stroke: INK, "stroke-width": 3 }, hg);
    return g; };
  // Mo: origin at his feet
  W.mo = (p, { x, y, s = 1, t = 0, talk = 0, eye = "open", arm = 0, look = 0, bounce = 0, apronC = "#3FA35A" }) => {
    const b = bounce ? Math.abs(Math.sin(t * 10)) * 14 : 0, g = el("g", { transform: `translate(${x} ${y - b}) scale(${s})` }, p), BR = "#9A6B4A";
    el("path", { d: "M-50,-20 Q-130,-30 -120,-110 Q-110,-150 -80,-130", fill: "none", stroke: BR, "stroke-width": 12, "stroke-linecap": "round" }, g);
    el("path", { d: "M-60,0 Q-70,-120 0,-140 Q70,-120 60,0 Z", fill: BR, stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-40,0 Q-46,-90 0,-104 Q46,-90 40,0 Z", fill: apronC, stroke: INK, "stroke-width": 5 }, g);
    const ag = (sx, raise) => { const a = el("g", { transform: `translate(${sx * 44} -96) rotate(${sx * (30 - raise * 150)})` }, g); el("path", { d: "M0,0 Q6,40 0,56", fill: "none", stroke: BR, "stroke-width": 16, "stroke-linecap": "round" }, a); el("circle", { cx: 0, cy: 60, r: 12, fill: "#F4B8B0", stroke: INK, "stroke-width": 4 }, a); };
    ag(-1, arm === 2 ? 1 : 0); ag(1, arm >= 1 ? 1 : 0);
    const hg = el("g", { transform: `translate(0 -170) rotate(${look * 8})` }, g);
    for (const sx of [-1, 1]) { el("circle", { cx: sx * 56, cy: -50, r: 40, fill: BR, stroke: INK, "stroke-width": 6 }, hg); el("circle", { cx: sx * 56, cy: -50, r: 24, fill: "#F4B8B0" }, hg); }
    el("ellipse", { cx: 0, cy: 0, rx: 62, ry: 56, fill: BR, stroke: INK, "stroke-width": 6 }, hg);
    el("path", { d: `M30,-10 Q110,${4 + talk * 6} 118,18 Q100,${34 + talk * 10} 30,30 Z`, fill: "#C08A64", stroke: INK, "stroke-width": 5 }, hg);
    el("circle", { cx: 118, cy: 18, r: 13, fill: "#F06A8A", stroke: INK, "stroke-width": 4 }, hg);
    if (talk > 0.1) el("ellipse", { cx: 70, cy: 30, rx: 14, ry: 8 * talk, fill: "#7A2E2E", stroke: INK, "stroke-width": 3 }, hg);
    for (const dy of [8, 22]) el("line", { x1: 90, y1: dy, x2: 140, y2: dy + (dy - 15) * 1.5, stroke: INK, "stroke-width": 2.5 }, hg);
    if (eye === "happy") el("path", { d: "M12,-16 q14,-16 28,0", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg);
    else if (eye === "closed") el("path", { d: "M12,-12 q14,10 28,0", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg);
    else { el("circle", { cx: 26, cy: -14, r: eye === "wide" ? 14 : 10, fill: INK }, hg); el("circle", { cx: 30, cy: -18, r: 4, fill: WH }, hg); }
    el("ellipse", { cx: -10, cy: 14, rx: 14, ry: 8, fill: "#FF9FB3", opacity: 0.6 }, hg);
    return g; };
  W.longneck = (p, { x, y, s = 1, t = 0, chew = 0, sad = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), C = lerpC("#8A7BC8", "#A8A0B8", sad);
    const hx = -420, hy = 420 + sad * 120;
    el("path", { d: `M300,-200 Q${-100},-100 ${hx + 60},${hy - 20}`, fill: "none", stroke: INK, "stroke-width": 96, "stroke-linecap": "round" }, g);
    el("path", { d: `M300,-200 Q${-100},-100 ${hx + 60},${hy - 20}`, fill: "none", stroke: C, "stroke-width": 82, "stroke-linecap": "round" }, g);
    const hg = el("g", { transform: `translate(${hx} ${hy}) rotate(${-10 + sad * 25})` }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 110, ry: 66, fill: C, stroke: INK, "stroke-width": 7 }, hg);
    el("path", { d: `M-100,20 Q-40,${44 + chew * 16} 40,30`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg);
    if (sad > 0.5) el("path", { d: "M-30,-30 q16,10 32,0", fill: "none", stroke: INK, "stroke-width": 6 }, hg); else { el("circle", { cx: -16, cy: -22, r: 12, fill: INK }, hg); el("circle", { cx: -12, cy: -26, r: 4, fill: WH }, hg); }
    if (chew > 0) el("path", { d: "M-110,24 l-50,10 l40,16 l-30,20", fill: "none", stroke: "#3F9A4A", "stroke-width": 12, "stroke-linecap": "round" }, hg);
    return g; };
  W.rexStall = (p, { y = 1430, food = 1, closed = 0, t = 0 }) => { const g = el("g", {}, p);
    if (food > 0.05) { const n = Math.ceil(food * 3); for (let i = 0; i < n; i++) { const fx = 40 + i * 190, fy = y - 10;
        const mg = el("g", { transform: `translate(${fx} ${fy}) rotate(${-15 + i * 12})` }, g); el("ellipse", { cx: 0, cy: -50, rx: 90, ry: 60, fill: "#C9583E", stroke: INK, "stroke-width": 6 }, mg);
        el("ellipse", { cx: -10, cy: -60, rx: 50, ry: 30, fill: "#E57A5E" }, mg); el("rect", { x: 70, y: -66, width: 90, height: 26, rx: 12, fill: "#F3EAD8", stroke: INK, "stroke-width": 5 }, mg); el("circle", { cx: 160, cy: -66, r: 20, fill: "#F3EAD8", stroke: INK, "stroke-width": 5 }, mg); el("circle", { cx: 160, cy: -40, r: 20, fill: "#F3EAD8", stroke: INK, "stroke-width": 5 }, mg); } }
    el("rect", { x: -120, y, width: 820, height: 260, rx: 10, fill: "#A8754A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 5; i++) el("line", { x1: -120, y1: y + 50 + i * 50, x2: 700, y2: y + 50 + i * 50, stroke: "#8A5A3A", "stroke-width": 5 }, g);
    K.sign(g, { x: 300, y: y + 40, s: 1, text: "REX'S BIG FOOD", w: 600, h: 110, size: 62, fill: "#E9B400", hang: 0, rot: -2 });
    if (closed > 0) K.sign(g, { x: 330, y: y + 30, s: closed, text: "CLOSED", w: 380, h: 120, size: 80, fill: "#C9C9C9", hang: 0, rot: 8 });
    return g; };
  W.moStall = (p, { x = 870, y = 1490, lvl = 0, t = 0, k = 1, glow = 1, price = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${k})` }, p);
    el("line", { x1: -90, y1: 0, x2: -90, y2: -260, stroke: "#6B4428", "stroke-width": 8 }, g);
    K.sign(g, { x: price ? -120 : -90, y: -280, s: price ? 0.85 : 0.42 + lvl * 0.18, text: price ? "PREMIUM PRICE" : "NIGHT SNACKS", w: 420, h: 100, size: 50, fill: price ? "#E9B400" : "#F3EAD8", hang: 0, rot: -4 });
    const lan = (lx, ly) => { el("circle", { cx: lx, cy: ly, r: 60, fill: "#FFE27A", opacity: 0.25 * glow * (0.85 + 0.15 * Math.sin(t * 6)) }, g); el("rect", { x: lx - 16, y: ly - 22, width: 32, height: 44, rx: 8, fill: "#FFE27A", stroke: INK, "stroke-width": 4 }, g); };
    lan(80, -150); if (lvl > 0.5) lan(-150, -170);
    el("rect", { x: -80, y: -90, width: 170, height: 100, rx: 6, fill: "#C9935E", stroke: INK, "stroke-width": 6 }, g);
    el("line", { x1: -80, y1: -40, x2: 90, y2: -40, stroke: "#8A5A3A", "stroke-width": 4 }, g);
    // beetle jar
    el("rect", { x: 30, y: -150, width: 54, height: 64, rx: 12, fill: "#CFEFF5", stroke: INK, "stroke-width": 4, opacity: 0.9 }, g);
    for (let i = 0; i < 3; i++) el("circle", { cx: 44 + i * 13, cy: -110 + Math.sin(t * 7 + i) * 6, r: 6, fill: "#2F6FB0", stroke: INK, "stroke-width": 2 }, g);
    return g; };
  W.critter = (p, { x, y, s = 1, kind = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y + Math.abs(Math.sin(t * 6 + x)) * -6}) scale(${s})` }, p), C = ["#7CC46A", "#6FA8DC", "#E9A23B", "#C47CC4"][kind % 4];
    el("ellipse", { cx: 0, cy: -40, rx: 46, ry: 40, fill: C, stroke: INK, "stroke-width": 5 }, g); el("circle", { cx: 26, cy: -82, r: 30, fill: C, stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 34, cy: -88, r: 7, fill: INK }, g); el("path", { d: "M44,-72 q8,6 16,0", fill: "none", stroke: INK, "stroke-width": 4 }, g);
    if (kind % 4 === 1) el("path", { d: "M52,-82 l24,6 l-24,8 Z", fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g);
    if (kind % 4 === 0) el("path", { d: "M-44,-34 Q-100,-30 -110,-60", fill: "none", stroke: C, "stroke-width": 12, "stroke-linecap": "round" }, g);
    for (const fx of [-20, 20]) el("line", { x1: fx, y1: -6, x2: fx, y2: 6, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g); return g; };
  W.meteor = (p, { k = 0 }) => { if (k <= 0 || k >= 1) return; const x = lerp(-200, 650, k), y = lerp(-300, 760, k);
    el("path", { d: `M${x},${y} L${x - 520},${y - 600}`, stroke: "#FFB15A", "stroke-width": 50, "stroke-linecap": "round", opacity: 0.6 }, p);
    el("path", { d: `M${x},${y} L${x - 360},${y - 420}`, stroke: "#FFE27A", "stroke-width": 26, "stroke-linecap": "round" }, p);
    el("circle", { cx: x, cy: y, r: 46, fill: "#7A4A3A", stroke: INK, "stroke-width": 7 }, p); };
  W.niche = (p, { x, y, s = 1, k = 1, glow = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -420, y: -300, width: 840, height: 600, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    el("circle", { cx: -70, cy: 10, r: 230, fill: "#D6EDB4", stroke: INK, "stroke-width": 7 }, g); K.txt(g, -70, 0, "BIG MARKET", 54, "#3F8A45"); K.txt(g, -70, 60, "(the giants)", 36, "#555");
    const r = 26 + glow * 10 + Math.sin(t * 6) * 4 * glow; el("circle", { cx: 280, cy: -150, r: r + 22, fill: "#FFE27A", opacity: 0.6 * glow }, g); el("circle", { cx: 280, cy: -150, r, fill: "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    K.txt(g, 280, -64, "TINY NICHE", 40, "#E5484D"); K.txt(g, 280, -20, "(start here)", 32, "#555"); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555");
    lab(1200, 64, "WORLD 13 · DINOSAUR AGE · \"The dinosaurs ignored a tiny competitor\" — cast & props", 42);
    W.rex(s, { x: 300, y: 820, s: 0.55, jaw: 0.2, brow: 1 }); lab(300, 870, "Rex (CEO)");
    W.rex(s, { x: 760, y: 820, s: 0.55, jaw: 0.8, eye: "happy", arms: 2 }); lab(760, 870, "Rex: laughing");
    W.rex(s, { x: 1220, y: 820, s: 0.55, skinny: 1, eye: "half", sweat: 1 }); lab(1220, 870, "Rex: starving");
    W.mo(s, { x: 1650, y: 700, s: 1.2, arm: 1, talk: 1 }); lab(1650, 750, "Mo");
    W.mo(s, { x: 1900, y: 700, s: 1.2, eye: "happy", arm: 2 }); lab(1900, 750, "Mo: happy");
    [0, 1, 2, 3].forEach((k) => W.critter(s, { x: 1650 + k * 160, y: 900, s: 0.9, kind: k })); lab(1890, 940, "tiny customers");
    const tile = (x0, y0, f, lb) => { const id = "cl" + x0 + y0, cp = el("clipPath", { id }, s); el("rect", { x: x0, y: y0, width: 700, height: 900, rx: 14 }, cp);
      const g = el("g", { "clip-path": `url(#${id})` }, s), sg = el("g", { transform: `translate(${x0} ${y0}) scale(0.62) translate(0 -380)` }, g); f(sg); lab(x0 + 350, y0 + 940, lb); };
    tile(60, 1000, (g) => { W.valley(g, { t: 0.3 }); W.longneck(g, { x: 1100, y: 600, chew: 1 }); W.rex(g, { x: 300, y: 1450, jaw: 0.1 }); W.rexStall(g, {}); W.moStall(g, {}); }, "day: Rex's stall + long-neck");
    tile(840, 1000, (g) => { W.valley(g, { t: 0.3, night: 1 }); W.rex(g, { x: 300, y: 1450, eye: "closed" }); W.rexStall(g, {}); W.mo(g, { x: 870, y: 1490, s: 0.9, arm: 1 }); W.moStall(g, { lvl: 1 }); [0, 1, 2].forEach((k) => W.critter(g, { x: 700 - k * 120, y: 1600, s: 0.8, kind: k })); }, "night: Mo's stall + queue");
    tile(1620, 1000, (g) => { W.valley(g, { t: 0.3, ash: 1 }); W.longneck(g, { x: 1100, y: 600, sad: 1 }); W.rex(g, { x: 300, y: 1450, skinny: 1, eye: "half" }); W.rexStall(g, { food: 0, closed: 1 }); W.mo(g, { x: 870, y: 1490, s: 0.9, eye: "happy" }); W.moStall(g, { lvl: 1 }); W.meteor(g, { k: 0.6 }); }, "after the meteor (+ meteor)");
    W.niche(s, { x: 1200, y: 2400, s: 0.5 }); lab(1200, 2580, "niche diagram");
  };
  root.World = W;
})(window);
