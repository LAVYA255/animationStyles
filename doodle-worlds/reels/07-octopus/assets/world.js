/* world.js — Coral reef ("An octopus had 8 arms and still couldn't run his shop"). Cast (original): Otto the octopus
   (8 independently animated arms, bandana), the crab (eye stalks, claws), the pufferfish customer (inflates when grumpy).
   Set: underwater gradient, light rays, kelp, coral, sand, bubbles, the shop counter ("OTTO'S SNACKS").
   Props: frying pan, sponge, register, parcel, envelope, tax sheet, coffee mug, recipe book, heart bubble, mop, schedule board,
   winged auto-reply envelope, the ONLY YOU / DELEGATE card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  const OC = "#B56BC9", OCD = "#8E4AA3", OCL = "#E3B8EE";
  W.reef = (p, { t = 0 }) => { const g = el("g", {}, p);
    const d = el("defs", {}, g), lg = el("linearGradient", { id: "sea", x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: "0", "stop-color": "#7FD3F0" }, lg); el("stop", { offset: "1", "stop-color": "#1F6FA8" }, lg);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: "url(#sea)" }, g);
    for (let i = 0; i < 5; i++) el("path", { d: `M${-100 + i * 280},-200 L${40 + i * 280 + Math.sin(t + i) * 30},1300 L${-20 + i * 280 + Math.sin(t + i) * 30},1300 L${-160 + i * 280},-200 Z`, fill: "#FFFFFF", opacity: 0.07 }, g);
    for (const [x, h, c] of [[-80, 700, "#4E9A5A"], [120, 520, "#5FB06A"], [960, 640, "#4E9A5A"], [1160, 480, "#5FB06A"]]) { const sw = Math.sin(t * 1.2 + x) * 20;
      el("path", { d: `M${x},1260 Q${x + sw},${1260 - h / 2} ${x - sw},${1260 - h}`, fill: "none", stroke: c, "stroke-width": 26, "stroke-linecap": "round" }, g); }
    el("path", { d: "M-700,1200 Q300,1150 1800,1210 L1800,2600 L-700,2600 Z", fill: "#F2DDA8", stroke: INK, "stroke-width": 7 }, g);
    for (const [x, c] of [[40, "#FF8F8F"], [300, "#FFB86B"], [860, "#FF8FC2"], [1060, "#FF8F8F"]]) { const cg = el("g", { transform: `translate(${x} 1210)` }, g);
      for (let i = -2; i <= 2; i++) el("path", { d: `M0,0 Q${i * 30},-60 ${i * 50},-${100 + Math.abs(i) * 10}`, fill: "none", stroke: c, "stroke-width": 22, "stroke-linecap": "round" }, cg); }
    for (let i = 0; i < 12; i++) { const ph = (t * 0.25 + i / 12) % 1; el("circle", { cx: (i * 173) % 1080 + Math.sin(t * 2 + i) * 14, cy: 1250 - ph * 1500, r: 8 + (i % 3) * 5, fill: "none", stroke: WH, "stroke-width": 4, opacity: 0.7 * (1 - ph) }, g); }
    return g; };
  W.counter = (p, { y = 1450 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 26, width: 1880, height: 900, fill: "#A8754A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 7; i++) el("line", { x1: -400, y1: y + 90 + i * 70, x2: 1480, y2: y + 90 + i * 70, stroke: "#7A5032", "stroke-width": 5 }, g);
    el("rect", { x: -420, y, width: 1920, height: 36, rx: 8, fill: "#C9935E", stroke: INK, "stroke-width": 8 }, g);
    const sg = el("g", { transform: `translate(540 ${y + 170})` }, g); el("rect", { x: -260, y: -60, width: 520, height: 110, rx: 18, fill: "#FFE07A", stroke: INK, "stroke-width": 7 }, sg); K.txt(sg, 0, 20, "OTTO'S SNACKS", 58, INK); return g; };
  // ---- Otto. arms: 8 tip targets [x,y] relative to the body centre; mood face; t for idle wiggle
  W.octo = (p, { x, y, s = 1, arms = null, eyes = "open", mouth = "smile", look = [0, 0], open = 0.5, sweat = 0, blush = 0.5, t = 0, sy = 1, brow = 0, tint = 0 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) scale(${s} ${s * sy})` }, p);
    const A = arms || W.ARMS.rest, body = lerpC(OC, "#8A8FA8", tint);
    A.forEach(([ax, ay], i) => { const sx0 = (i - 3.5) * 34, sy0 = 40, wig = Math.sin(t * 3 + i) * 20, mx = (sx0 + ax) / 2 + (i < 4 ? -60 : 60) + wig, my = (sy0 + ay) / 2 + 80;
      const d = `M${sx0},${sy0} Q${mx},${my} ${ax},${ay}`;
      el("path", { d, fill: "none", stroke: INK, "stroke-width": 46, "stroke-linecap": "round" }, g); el("path", { d, fill: "none", stroke: body, "stroke-width": 32, "stroke-linecap": "round" }, g);
      for (let k = 0.3; k < 0.95; k += 0.17) { const qx = (1 - k) * (1 - k) * sx0 + 2 * (1 - k) * k * mx + k * k * ax, qy = (1 - k) * (1 - k) * sy0 + 2 * (1 - k) * k * my + k * k * ay; el("circle", { cx: qx, cy: qy + 8, r: 6, fill: OCL, stroke: INK, "stroke-width": 2 }, g); } });
    el("path", { d: "M-150,60 Q-190,-150 -90,-250 Q0,-320 90,-250 Q190,-150 150,60 Q0,110 -150,60 Z", fill: body, stroke: INK, "stroke-width": 8 }, g);
    for (const [cx, cy, r] of [[-70, -200, 18], [60, -230, 14], [100, -150, 11], [-110, -110, 12]]) el("circle", { cx, cy, r, fill: OCD, opacity: 0.6 }, g);
    el("path", { d: "M-150,-150 Q0,-210 150,-150 L150,-118 Q0,-178 -150,-118 Z", fill: "#E5484D", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M150,-140 q40,-10 50,20 M150,-130 q34,14 40,44", fill: "none", stroke: "#E5484D", "stroke-width": 14, "stroke-linecap": "round" }, g);
    const lx = look[0] * 10, ly = look[1] * 8;
    for (const sd of [-1, 1]) { const e = el("g", { transform: `translate(${sd * 54 + lx} ${-60 + ly})` }, g);
      el("ellipse", { cx: 0, cy: 0, rx: 34, ry: 40, fill: WH, stroke: INK, "stroke-width": 6 }, e);
      if (eyes === "closed") el("path", { d: "M-20,4 Q0,18 20,4", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e);
      else if (eyes === "happy") el("path", { d: "M-20,8 Q0,-14 20,8", fill: "none", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, e);
      else if (eyes === "spiral") { let d2 = ""; for (let k = 0; k <= 30; k++) { const a = k * 0.5 + t * 6 * sd, r = k * 0.8; d2 += (k ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + "," + (Math.sin(a) * r).toFixed(1); } el("path", { d: d2, fill: "none", stroke: INK, "stroke-width": 4 }, e); }
      else { el("circle", { cx: lx * 0.6, cy: 4, r: eyes === "wide" ? 12 : 18, fill: INK }, e); el("circle", { cx: lx * 0.6 + 6, cy: -4, r: 6, fill: WH }, e); }
      if (eyes === "half") { el("rect", { x: -36, y: -42, width: 72, height: 40, fill: body }, e); el("line", { x1: -32, y1: -2, x2: 32, y2: -2, stroke: INK, "stroke-width": 6 }, e); }
      el("line", { x1: -22, y1: -54 - brow * 4, x2: 22, y2: -54 + sd * brow * 6, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e); }
    if (blush > 0) for (const sd of [-1, 1]) el("ellipse", { cx: sd * 96, cy: -10, rx: 18, ry: 10, fill: "#F4A3A0", opacity: blush }, g);
    const my = 20;
    if (mouth === "smile") el("path", { d: `M-30,${my} Q0,${my + 24} 30,${my}`, fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g);
    else if (mouth === "grin") el("path", { d: `M-34,${my - 4} Q0,${my + 40 + 14 * open} 34,${my - 4} Z`, fill: INK }, g);
    else if (mouth === "o") el("ellipse", { cx: 0, cy: my + 8, rx: 12 + 6 * open, ry: 12 + 12 * open, fill: INK }, g);
    else if (mouth === "wavy") el("path", { d: `M-30,${my + 6} q7.5,-8 15,0 t15,0 t15,0 t15,0`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    else if (mouth === "flat") el("line", { x1: -20, y1: my + 6, x2: 20, y2: my + 6, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g);
    if (sweat > 0) el("path", { d: "M130,-210 q16,30 0,42 q-16,-12 0,-42 Z", fill: "#BFE8FF", stroke: INK, "stroke-width": 4, opacity: sweat }, g);
    return g; };
  // arm tip layouts (relative to the body centre at the counter)
  W.ARMS = {
    rest: [[-330, 120], [-260, 160], [-170, 180], [-60, 190], [60, 190], [170, 180], [260, 160], [330, 120]],
    busy: [[-380, -260], [-420, -60], [-360, 140], [-160, 200], [160, 200], [360, 140], [420, -60], [380, -260]],
    coffee: [[-330, 120], [-260, 160], [-170, 180], [-70, 70], [70, 70], [170, 180], [260, 160], [330, 120]],
    fan: [[-430, -40], [-400, -250], [-300, -420], [-110, -500], [110, -500], [300, -420], [400, -250], [430, -40]],
  };
  W.armTip = (o, A, i) => [o.x + A[i][0] * o.s, o.y + A[i][1] * o.s * (o.sy || 1)];
  W.crab = (p, { x, y, s = 1, t = 0, claw = 0, mood = "flat" }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) el("path", { d: `M${sd * 60},${-10 + i * 16} q${sd * 40},${10 + Math.sin(t * 10 + i) * 6} ${sd * 70},${40}`, fill: "none", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, g);
    el("ellipse", { cx: 0, cy: -40, rx: 100, ry: 64, fill: "#F2734A", stroke: INK, "stroke-width": 7 }, g);
    for (const sd of [-1, 1]) { el("line", { x1: sd * 30, y1: -96, x2: sd * 36, y2: -150, stroke: INK, "stroke-width": 7 }, g); el("circle", { cx: sd * 36, cy: -160, r: 18, fill: WH, stroke: INK, "stroke-width": 5 }, g); el("circle", { cx: sd * 38, cy: -158, r: 8, fill: INK }, g); }
    for (const sd of [-1, 1]) { const up = sd > 0 ? claw : 0; el("path", { d: `M${sd * 80},-50 Q${sd * 120},-60 ${sd * 110},${-70 - up * 90}`, fill: "none", stroke: INK, "stroke-width": 20, "stroke-linecap": "round" }, g); el("path", { d: `M${sd * 80},-50 Q${sd * 120},-60 ${sd * 110},${-70 - up * 90}`, fill: "none", stroke: "#F2734A", "stroke-width": 10, "stroke-linecap": "round" }, g);
      const cg = el("g", { transform: `translate(${sd * 110} ${-70 - up * 90}) rotate(${sd * (20 + up * 30)})` }, g);
      el("path", { d: "M0,0 Q30,-40 10,-70 L-6,-36 Q-30,-60 -26,-20 Z", fill: "#F2734A", stroke: INK, "stroke-width": 6 }, cg); }
    el("path", mood === "smile" ? { d: "M-20,-30 Q0,-14 20,-30", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" } : { d: "M-18,-24 L18,-24", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g); return g; };
  W.puffer = (p, { x, y, s = 1, puff = 0, t = 0, mood = "grumpy" }) => { const g = el("g", { transform: `translate(${x} ${y + Math.sin(t * 2) * 10}) scale(${s})` }, p), r = 80 + 60 * puff;
    el("path", { d: `M${r - 10},0 L${r + 60},-40 L${r + 50},0 L${r + 60},40 Z`, fill: "#F2C14E", stroke: INK, "stroke-width": 6 }, g);
    if (puff > 0.2) for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; el("path", { d: `M${Math.cos(a) * r},${Math.sin(a) * r} L${Math.cos(a) * (r + 30 * puff)},${Math.sin(a) * (r + 30 * puff)}`, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g); }
    el("circle", { cx: 0, cy: 0, r, fill: "#FFD45C", stroke: INK, "stroke-width": 7 }, g); el("path", { d: `M${-r * 0.8},${r * 0.3} Q0,${r} ${r * 0.8},${r * 0.3}`, fill: "#FFF1B0" }, g);
    el("circle", { cx: -r * 0.4, cy: -r * 0.2, r: 14, fill: INK }, g);
    if (mood === "grumpy") { el("line", { x1: -r * 0.6, y1: -r * 0.45, x2: -r * 0.2, y2: -r * 0.3, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g); el("path", { d: `M${-r * 0.75},${r * 0.2} q14,-12 28,0`, fill: "none", stroke: INK, "stroke-width": 6 }, g); }
    else el("path", { d: `M${-r * 0.8},${r * 0.12} q16,16 32,0`, fill: "none", stroke: INK, "stroke-width": 6 }, g); return g; };
  // the job props (drawn at an arm tip)
  W.item = (p, { x, y, kind, s = 1, rot = 0, glow = 0, grey = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})`, opacity: 1 - 0.55 * grey }, p);
    if (glow > 0) el("circle", { cx: 0, cy: -20, r: 110, fill: "#FFE7A0", opacity: 0.6 * glow }, g);
    if (kind === "pan") { el("rect", { x: 50, y: -10, width: 110, height: 20, rx: 8, fill: "#3A3A44", stroke: INK, "stroke-width": 5 }, g); el("ellipse", { cx: 0, cy: 0, rx: 64, ry: 24, fill: "#5A5F6A", stroke: INK, "stroke-width": 6 }, g); el("ellipse", { cx: -6, cy: -6, rx: 26, ry: 16, fill: "#FFD45C", stroke: INK, "stroke-width": 4 }, g); }
    else if (kind === "sponge") { el("rect", { x: -44, y: -30, width: 88, height: 60, rx: 12, fill: "#FFE07A", stroke: INK, "stroke-width": 6 }, g); for (const [cx, cy] of [[-20, -8], [14, 6], [24, -14]]) el("circle", { cx, cy, r: 6, fill: "#E9B400" }, g); }
    else if (kind === "cash") { el("rect", { x: -60, y: -50, width: 120, height: 90, rx: 10, fill: "#9AA6B3", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -40, y: -80, width: 80, height: 36, rx: 6, fill: "#20303A", stroke: INK, "stroke-width": 5 }, g); K.txt(g, 0, -54, "$", 26, "#7CE38B"); }
    else if (kind === "parcel") { el("rect", { x: -54, y: -44, width: 108, height: 88, rx: 6, fill: "#C9935E", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M0,-44 L0,44 M-54,0 L54,0", stroke: "#8A5A3A", "stroke-width": 6 }, g); }
    else if (kind === "mail") { el("rect", { x: -60, y: -40, width: 120, height: 80, rx: 6, fill: WH, stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M-60,-40 L0,6 L60,-40", fill: "none", stroke: INK, "stroke-width": 6 }, g); el("circle", { cx: 50, cy: -40, r: 16, fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g); }
    else if (kind === "tax") { el("rect", { x: -46, y: -60, width: 92, height: 120, rx: 6, fill: WH, stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, -20, "TAX", 30, "#E5484D"); for (let i = 0; i < 3; i++) el("line", { x1: -30, y1: 10 + i * 16, x2: 30, y2: 10 + i * 16, stroke: "#AEB3BB", "stroke-width": 5 }, g); }
    else if (kind === "coffee") { el("path", { d: "M-40,-50 L40,-50 L34,30 Q32,40 22,40 L-22,40 Q-32,40 -34,30 Z", fill: WH, stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M40,-30 q30,0 26,24 q-4,20 -30,16", fill: "none", stroke: INK, "stroke-width": 7 }, g); el("ellipse", { cx: 0, cy: -50, rx: 40, ry: 8, fill: "#6B4428" }, g);
      for (let i = 0; i < 2; i++) el("path", { d: `M${-10 + i * 20},-64 q-8,-16 0,-32`, fill: "none", stroke: "#E3E6EA", "stroke-width": 5, opacity: 0.5 + 0.5 * Math.sin(t * 4 + i) }, g); }
    else if (kind === "ads") { el("path", { d: "M-50,-20 L30,-60 L30,60 L-50,20 Z", fill: "#E5484D", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -70, y: -20, width: 24, height: 40, fill: "#AEB3BB", stroke: INK, "stroke-width": 5 }, g); }
    else if (kind === "recipe") { el("rect", { x: -60, y: -46, width: 120, height: 92, rx: 8, fill: "#7A4A9A", stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, -4, "SECRET", 22, "#FFE07A"); K.txt(g, 0, 22, "RECIPE", 22, "#FFE07A"); }
    else if (kind === "heart") { K.bubble(g, { x: 0, y: -10, text: "♥", size: 46, w: 120, tail: [-30, 60], tone: WH }); }
    return g; };
  W.mop = (p, { x, y, s = 1, rot = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot + Math.sin(t * 8) * 10}) scale(${s})` }, p);
    el("rect", { x: -6, y: -220, width: 12, height: 220, fill: "#A8754A", stroke: INK, "stroke-width": 4 }, g); for (let i = -3; i <= 3; i++) el("path", { d: `M0,0 q${i * 8},30 ${i * 14},60`, fill: "none", stroke: "#E8E2DA", "stroke-width": 10, "stroke-linecap": "round" }, g); return g; };
  W.schedule = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -150, y: -130, width: 300, height: 260, rx: 14, fill: WH, stroke: INK, "stroke-width": 7 }, g); el("rect", { x: -150, y: -130, width: 300, height: 50, rx: 14, fill: "#3FB8AF", stroke: INK, "stroke-width": 7 }, g);
    K.txt(g, 0, -94, "DELIVERIES", 30, WH); ["MON 9AM", "WED 9AM", "FRI 9AM"].forEach((d, i) => { K.txt(g, -110, -30 + i * 56, d, 30, INK, "start"); el("path", { d: `M90,${-42 + i * 56} l10,12 l18,-22`, fill: "none", stroke: "#24857E", "stroke-width": 6 }, g); }); return g; };
  W.autoreply = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    for (const sd of [-1, 1]) el("path", { d: `M${sd * 50},-20 q${sd * 50},${-40 - Math.sin(t * 20) * 20} ${sd * 90},-10 q${-sd * 40},20 ${-sd * 90},30 Z`, fill: WH, stroke: INK, "stroke-width": 5 }, g);
    W.item(g, { x: 0, y: 0, kind: "mail" }); K.txt(g, 0, 70, "AUTO-REPLY", 26, INK); return g; };
  W.split = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -470, y: -300, width: 940, height: 600, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g); el("line", { x1: 0, y1: -260, x2: 0, y2: 260, stroke: "#C9D3DE", "stroke-width": 6 }, g);
    K.txt(g, -235, -200, "ONLY YOU", 54, "#7A4A9A"); K.txt(g, 235, -200, "DELEGATE", 50, "#24857E"); K.txt(g, 235, -146, "or AUTOMATE", 34, "#24857E");
    W.item(g, { x: -320, y: 0, kind: "recipe", s: 1.2 }); W.item(g, { x: -150, y: 0, kind: "heart", s: 1.1 });
    W.mop(g, { x: 120, y: 120, s: 0.8, rot: -10 }); W.schedule(g, { x: 260, y: 30, s: 0.45 }); W.item(g, { x: 390, y: 20, kind: "mail", s: 0.8 }); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555");
    lab(1200, 64, "WORLD 7 · CORAL REEF · \"An octopus had 8 arms and still couldn't run his shop\" — cast & props", 40);
    W.octo(s, { x: 330, y: 560, s: 0.62, arms: W.ARMS.rest, t: 0.2 }); lab(330, 760, "Otto: calm");
    W.octo(s, { x: 820, y: 560, s: 0.62, arms: W.ARMS.busy, eyes: "spiral", mouth: "wavy", sweat: 1, t: 0.2 }); lab(820, 760, "Otto: drowning (in work)");
    W.octo(s, { x: 1320, y: 560, s: 0.62, arms: W.ARMS.coffee, eyes: "happy", mouth: "grin", t: 0.2 }); W.item(s, { x: 1320, y: 540, kind: "coffee", s: 0.6, t: 0.3 }); lab(1320, 760, "Otto: two hands");
    W.crab(s, { x: 1750, y: 600, s: 0.9, claw: 1 }); lab(1750, 760, "the crab");
    W.puffer(s, { x: 2080, y: 420, s: 0.6 }); W.puffer(s, { x: 2080, y: 640, s: 0.6, puff: 1 }); lab(2120, 760, "the pufferfish");
    const cp = el("clipPath", { id: "r" }, s); el("rect", { x: 60, y: 820, width: 1100, height: 900, rx: 16 }, cp);
    const rg = el("g", { "clip-path": "url(#r)" }, s), sg = el("g", { transform: "translate(60 820) scale(0.62) translate(0 -550)" }, rg);
    W.reef(sg, { t: 0.3 }); W.octo(sg, { x: 540, y: 1330, s: 0.95, arms: W.ARMS.rest, t: 0.2 }); W.counter(sg, {}); lab(610, 1760, "the shop on the reef");
    ["pan", "sponge", "cash", "parcel", "mail", "tax", "ads", "coffee", "recipe", "heart"].forEach((k, i) => { W.item(s, { x: 1330 + (i % 5) * 200, y: 980 + Math.floor(i / 5) * 240, kind: k, s: 0.9, t: 0.3 }); lab(1330 + (i % 5) * 200, 1090 + Math.floor(i / 5) * 240, k); });
    W.mop(s, { x: 1350, y: 1680, s: 0.9 }); W.schedule(s, { x: 1650, y: 1560, s: 0.7 }); W.autoreply(s, { x: 2050, y: 1560, s: 0.9, t: 0.2 }); lab(1700, 1760, "mop / schedule / auto-reply");
    W.split(s, { x: 1200, y: 2250, s: 0.7 }); lab(1200, 2490, "the ONLY YOU / DELEGATE card");
  };
  root.World = W;
})(window);
