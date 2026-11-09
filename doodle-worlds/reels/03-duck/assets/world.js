/* world.js — Space station ("How different IQ astronauts fix a broken spaceship"). Cast: Bo (low IQ), Gwen (medium), Juno (high).
   Set: station wall panels, ceiling light strip (alarm red / normal / blackout), porthole (planet, stars; streaks when the engines
   fire), the console (foreground). Props: holo code screen (line highlight, the minus that becomes a plus), rubber duck, the
   900-page manual, oxygen gauge, the bug that jumps out, sparks, floating junk, the IQ cards. Original designs. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.BO = { hairStyle: "spiky", hair: "#F2C14E", skin: "#F1C9A5", outfit: "space", cloth: "#F3F5F8", cloth2: "#D5DCE4", thickBrows: 1, blush: 0.4 };
  W.GWEN = { hairStyle: "bob", hair: "#C0392B", skin: "#FFE1CF", outfit: "space", cloth: "#F3F5F8", cloth2: "#D5DCE4", glasses: 1, blush: 0.5 };
  W.JUNO = { hairStyle: "curly", pony: 1, hair: "#1E1614", skin: "#8D5A3B", outfit: "space", cloth: "#F3F5F8", cloth2: "#D5DCE4", earring: 1, blush: 0.55 };

  // light: 0 = red alarm (blinking), 1 = normal, -1 = blackout; warp 0..1 streaks the stars
  W.set = (p, { light = 0, t = 0, warp = 0 }) => { const g = el("g", {}, p);
    const blink = light === 0 ? 0.55 + 0.45 * Math.sin(t * 8) : 0;
    const base = light < 0 ? "#2A2F3A" : lerpC("#C9D3DE", "#E3E9EF", Math.max(0, light));
    el("rect", { x: -600, y: -600, width: 2300, height: 2600, fill: base }, g);
    for (let c = -3; c < 9; c++) for (let r = 0; r < 4; r++) el("rect", { x: c * 220 + 10, y: 300 + r * 260, width: 200, height: 240, rx: 18, fill: "none", stroke: light < 0 ? "#3A4150" : "#AEB8C4", "stroke-width": 5 }, g);
    for (let i = 0; i < 6; i++) el("circle", { cx: -200 + i * 300, cy: 280, r: 8, fill: "#8E99A6" }, g);
    // porthole
    const pg = el("g", { transform: "translate(800 900) scale(0.85)" }, g);
    el("circle", { cx: 0, cy: 0, r: 230, fill: "#9AA6B3", stroke: INK, "stroke-width": 8 }, pg);
    el("circle", { cx: 0, cy: 0, r: 190, fill: "#0E1430", stroke: INK, "stroke-width": 7 }, pg);
    const cp = el("clipPath", { id: "port" }, pg); el("circle", { cx: 0, cy: 0, r: 186 }, cp); const sg = el("g", { "clip-path": "url(#port)" }, pg);
    const r = MK.rng(7); for (let i = 0; i < 40; i++) { const x = -200 + r() * 400, y = -200 + r() * 400, len = 4 + warp * 140; el("line", { x1: x, y1: y, x2: x - len, y2: y, stroke: "#FFF6D8", "stroke-width": 4, "stroke-linecap": "round" }, sg); }
    el("circle", { cx: 70 - warp * 200, cy: 60, r: 110, fill: "#5FA8D3", stroke: INK, "stroke-width": 6 }, sg);
    el("path", { d: `M${10 - warp * 200},20 q40,-40 90,-10 q20,30 -20,50 q-50,10 -70,-40 Z`, fill: "#7FB35A" }, sg);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; el("circle", { cx: Math.cos(a) * 210, cy: Math.sin(a) * 210, r: 9, fill: "#C9D3DE", stroke: INK, "stroke-width": 3 }, pg); }
    // ceiling light strip
    el("rect", { x: -600, y: 140, width: 2300, height: 60, fill: light < 0 ? "#1A1D24" : light === 0 ? lerpC("#7A2C2C", "#FF4A4A", blink) : "#F7FBFF", stroke: INK, "stroke-width": 6 }, g);
    if (light === 0) el("rect", { x: -600, y: -600, width: 2300, height: 2600, fill: "#FF3B3B", opacity: 0.1 * blink }, g);
    if (light < 0) el("rect", { x: -600, y: -600, width: 2300, height: 2600, fill: "#000", opacity: 0.35 }, g);
    return g; };
  // the console (foreground). screens show static/green; dents = how many times Bo hit it
  W.console = (p, { y = 1405, light = 0, t = 0, dents = 0, panelOff = 0 }) => { const g = el("g", {}, p);
    el("path", { d: `M-400,${y + 30} L-300,${y} L1380,${y} L1480,${y + 30} L1480,${y + 900} L-400,${y + 900} Z`, fill: "#7C8796", stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
    el("rect", { x: -400, y: y - 6, width: 1880, height: 30, rx: 8, fill: "#9AA6B3", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 4; i++) { const x = 40 + i * 270, on = light > 0 ? 1 : light === 0 ? (Math.sin(t * 6 + i) > 0 ? 1 : 0.3) : 0.1;
      el("rect", { x, y: y + 70, width: 200, height: 110, rx: 10, fill: light > 0 ? "#1D3B2E" : "#2B1D1D", stroke: INK, "stroke-width": 6 }, g);
      for (let l = 0; l < 3; l++) el("rect", { x: x + 20, y: y + 92 + l * 26, width: 60 + ((i * 37 + l * 53) % 100), height: 10, rx: 5, fill: light > 0 ? "#7CE38B" : "#FF6B6B", opacity: on }, g);
      for (let b = 0; b < 4; b++) el("circle", { cx: x + 30 + b * 46, cy: y + 230, r: 13, fill: ["#E5484D", "#F2C14E", "#3FB8AF", "#7FA7C9"][b], stroke: INK, "stroke-width": 4 }, g); }
    for (let d = 0; d < dents; d++) { const dx = 180 + d * 60; el("path", { d: `M${dx},${y + 2} q30,30 60,0`, fill: "#5C6672", stroke: INK, "stroke-width": 5 }, g); }
    if (panelOff > 0) { el("rect", { x: 300, y: y + 60, width: 200, height: 120, fill: "#1d1b1a" }, g); for (let i = 0; i < 4; i++) el("path", { d: `M${320 + i * 40},${y + 70} q20,${60 + i * 10} -10,${100}`, fill: "none", stroke: ["#E5484D", "#F2C14E", "#3FB8AF", "#7FA7C9"][i], "stroke-width": 7 }, g); }
    return g; };
  // the holo code screen: hl = highlighted line (0..2, -1 none); fixed 0..1 turns the minus into a plus
  W.code = (p, { x, y, s = 1, k = 1, hl = -1, fixed = 0, bad = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -250, y: -170, width: 500, height: 340, rx: 24, fill: "rgba(14,34,52,.9)", stroke: "#4FD6FF", "stroke-width": 6 }, g);
    K.txt(g, -220, -110, "engine.code", 30, "#4FD6FF", "start");
    const lines = ["fuel = read()", "speed = speed + 5", fixed > 0.5 ? "go = speed + fuel" : "go = speed - fuel"];
    lines.forEach((ln, i) => { const yy = -40 + i * 70;
      if (i === hl) el("rect", { x: -236, y: yy - 42, width: 472, height: 58, rx: 10, fill: i === 2 && bad ? "rgba(229,72,77,.45)" : "rgba(255,230,120,.35)" }, g);
      K.txt(g, -220, yy, (i + 1) + "  " + ln, 38, i === 2 && fixed > 0.5 ? "#7CE38B" : "#DFF8FF", "start"); });
    return g; };
  W.duck = (p, { x, y, s = 1, rot = 0, nod = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot + nod * 12}) scale(${s})` }, p);
    el("path", { d: "M-70,10 Q-80,-40 -30,-50 Q20,-56 60,-30 Q86,10 50,40 Q0,60 -50,46 Q-80,36 -70,10 Z", fill: "#FFD43B", stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: 20, cy: -70, r: 42, fill: "#FFD43B", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M54,-70 Q88,-72 92,-60 Q86,-48 54,-54 Z", fill: "#FF8A3D", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 34, cy: -82, r: 7, fill: INK }, g); el("path", { d: "M-40,0 Q-10,20 20,0", fill: "none", stroke: "#E9B400", "stroke-width": 6 }, g); return g; };
  W.manual = (p, { x, y, s = 1, rot = 0, thick = 1, open = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    const h = 40 + 160 * thick;
    el("rect", { x: -150, y: -h / 2, width: 300, height: h, rx: 10, fill: "#F7F2E6", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 1; i < 8; i++) el("line", { x1: -146, y1: -h / 2 + i * h / 8, x2: 146, y2: -h / 2 + i * h / 8, stroke: "#D9D2BF", "stroke-width": 3 }, g);
    el("rect", { x: -160, y: -h / 2 - 30, width: 320, height: 40, rx: 8, fill: "#2F6FB0", stroke: INK, "stroke-width": 6 }, g);
    K.txt(g, 0, -h / 2 - 2, "MANUAL · 900 PAGES", 24, WH); return g; };
  W.gauge = (p, { x, y, s = 1, v = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("circle", { cx: 0, cy: 0, r: 150, fill: WH, stroke: INK, "stroke-width": 8 }, g);
    el("path", { d: "M-120,40 A126,126 0 0 1 120,40", fill: "none", stroke: "#3FB8AF", "stroke-width": 20 }, g);
    el("path", { d: "M-120,40 A126,126 0 0 1 -86,-60", fill: "none", stroke: "#E5484D", "stroke-width": 20 }, g);
    const a = Math.PI * (1.12 - 0.86 * v) + Math.sin(t * 20) * 0.02; el("line", { x1: 0, y1: 20, x2: Math.cos(a) * 110, y2: 20 - Math.sin(a) * 110, stroke: INK, "stroke-width": 10, "stroke-linecap": "round" }, g);
    el("circle", { cx: 0, cy: 20, r: 14, fill: INK }, g); K.txt(g, 0, 100, "O₂", 44, INK); return g; };
  W.bug = (p, { x, y, s = 1, rot = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) el("path", { d: `M${sd * 30},${-10 + i * 18} q${sd * 30},${-10 + Math.sin(t * 30 + i) * 10} ${sd * 50},${10}`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 40, ry: 50, fill: "#4E8A3A", stroke: INK, "stroke-width": 6 }, g); el("line", { x1: 0, y1: -46, x2: 0, y2: 46, stroke: INK, "stroke-width": 4 }, g);
    el("circle", { cx: 0, cy: -58, r: 24, fill: "#3A6A2E", stroke: INK, "stroke-width": 5 }, g);
    for (const sd of [-1, 1]) { el("circle", { cx: sd * 9, cy: -62, r: 7, fill: WH }, g); el("circle", { cx: sd * 9, cy: -62, r: 3, fill: INK }, g); el("path", { d: `M${sd * 8},-80 q${sd * 10},-24 ${sd * 22},-28`, fill: "none", stroke: INK, "stroke-width": 4 }, g); }
    return g; };
  W.sparks = (p, { x, y, k, n = 8 }) => { if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + 0.8 * i / (n - 1)), v = 160 + (i % 3) * 60;
      el("line", { x1: x + Math.cos(a) * v * k, y1: y + Math.sin(a) * v * k + 200 * k * k, x2: x + Math.cos(a) * v * (k + 0.12), y2: y + Math.sin(a) * v * (k + 0.12) + 200 * k * k, stroke: "#FFC93C", "stroke-width": 8, "stroke-linecap": "round" }, p); } };
  W.junk = (p, { t }) => { const items = [["wrench", 120, 980], ["cup", 960, 1020], ["sock", 860, 420], ["pen", 220, 470]];
    items.forEach(([n, x, y], i) => { const g = el("g", { transform: `translate(${x + Math.sin(t * 0.7 + i) * 20} ${y + Math.cos(t * 0.9 + i) * 16}) rotate(${t * 20 * (i % 2 ? 1 : -1) + i * 40})` }, p);
      if (n === "wrench") { el("rect", { x: -8, y: -50, width: 16, height: 100, rx: 6, fill: "#AEB3BB", stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: 0, cy: -56, r: 18, fill: "#AEB3BB", stroke: INK, "stroke-width": 4 }, g); }
      else if (n === "cup") { el("path", { d: "M-24,-30 L24,-30 L18,26 L-18,26 Z", fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g); }
      else if (n === "sock") { el("path", { d: "M-14,-40 L14,-40 L14,10 Q14,30 34,30 L34,44 L-6,44 Q-14,44 -14,30 Z", fill: "#7FA7C9", stroke: INK, "stroke-width": 4 }, g); }
      else el("rect", { x: -5, y: -40, width: 10, height: 80, rx: 4, fill: "#F2C14E", stroke: INK, "stroke-width": 4 }, g); }); };
  W.iq = (p, { x, y, level = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(-4) scale(${k})` }, p);
    const txt = ["LOW IQ", "MEDIUM IQ", "HIGH IQ"][level - 1], col = ["#E5484D", "#F2C14E", "#3FB8AF"][level - 1], w = 180 + txt.length * 42;
    el("rect", { x: -w / 2, y: -70, width: w, height: 130, rx: 24, fill: WH, stroke: INK, "stroke-width": 8 }, g);
    const bs = 0.5 + level * 0.25, bg = el("g", { transform: `translate(${-w / 2 + 70} -6) scale(${bs})` }, g);
    el("path", { d: "M-40,20 Q-60,-10 -40,-34 Q-30,-56 0,-50 Q30,-56 40,-34 Q60,-10 40,20 Q20,40 0,30 Q-20,40 -40,20 Z", fill: "#FF9FB3", stroke: INK, "stroke-width": 6 / bs }, bg);
    el("path", { d: "M0,-46 L0,28 M-26,-20 q14,8 0,22 M26,-20 q-14,8 0,22", fill: "none", stroke: INK, "stroke-width": 4 / bs }, bg);
    K.txt(g, -w / 2 + 140 + (w - 160) / 2, 20, txt, 64, col, "middle", { stroke: INK, "stroke-width": 3, "paint-order": "stroke" }); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 3 · SPACE · \"How different IQ astronauts fix a broken spaceship\" — cast & props", 42);
    [["Bo (low IQ)", W.BO, F.happy], ["Bo: FIX!", W.BO, F.shout], ["Gwen (medium)", W.GWEN, F.think], ["Gwen: 900 pages", W.GWEN, F.worried], ["Juno (high)", W.JUNO, F.calm], ["Juno: wait...", W.JUNO, F.shock]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    const box = (x, y, w, h, id, fn, label) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s);
      fn(el("g", { transform: `translate(${x} ${y}) scale(0.5) translate(0 0)` }, g)); lab(x + w / 2, y + h + 40, label); };
    box(60, 760, 740, 760, "a", (g) => { W.set(g, { light: 0, t: 0.1 }); W.console(g, { light: 0, t: 0.1, dents: 2, panelOff: 1 }); }, "alarm (red)");
    box(830, 760, 740, 760, "b", (g) => { W.set(g, { light: 1, t: 0.1, warp: 1 }); W.console(g, { light: 1, t: 0.1 }); }, "fixed (engines on)");
    box(1600, 760, 740, 760, "c", (g) => { W.set(g, { light: -1, t: 0.1 }); W.console(g, { light: -1, t: 0.1 }); }, "blackout");
    W.code(s, { x: 360, y: 1900, s: 0.8, hl: 2, bad: 1 }); W.code(s, { x: 860, y: 1900, s: 0.8, hl: 2, fixed: 1 }); lab(610, 2080, "holo code: the minus -> plus");
    W.duck(s, { x: 1180, y: 1920, s: 1.1 }); W.manual(s, { x: 1450, y: 1920, s: 0.8, thick: 1 }); W.gauge(s, { x: 1760, y: 1900, s: 0.7, v: 0.2 }); W.bug(s, { x: 2050, y: 1900, s: 1.2, t: 0.2 }); lab(1600, 2080, "duck / manual / O2 gauge / the bug");
    W.iq(s, { x: 400, y: 2300, level: 1 }); W.iq(s, { x: 1050, y: 2300, level: 2 }); W.iq(s, { x: 1750, y: 2300, level: 3 }); lab(1100, 2440, "the IQ cards");
    W.sparks(s, { x: 2200, y: 2400, k: 0.4 });
  };
  root.World = W;
})(window);
