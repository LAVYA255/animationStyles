/* world.js — Fairy-tale farm ("He tried to scale the golden goose"). Cast (original): Farmer Tod (hustle bro: straw hat,
   headset mic, blond, plaid shirt), Goldie the goose (white, orange beak, lashes + pink bow; perky -> tired -> wrecked ->
   asleep, can bite). Set: red barn wall with a window (day / night), hay, hustle posters, a 24/7 shift clock, the week
   board; Goldie's nest crate (foreground right), the fence rail (foreground, cuts Tod at the waist). Props: golden / bronze
   eggs, egg stack, sleep mask + blanket + lamp, eggs-per-week card, podcast mic. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, GOLD = "#F2C14E";
  W.TOD = { hairStyle: "short", hair: "#E2B54A", skin: "#F0C7A4", outfit: "cowboy", cloth: "#D9534F", cloth2: "#3A6EA5", hat: "cowboy", hatC: "#E8C872", headset: 1, thickBrows: 1, blush: 0.5 };
  W.barn = (p, { t = 0, night = 0, posters = 0, clock = 0, week = 0, dark = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#C0443A", "#5A2A2E", Math.max(night * 0.6, dark)) }, g);
    for (let i = 0; i < 20; i++) el("line", { x1: -700 + i * 130, y1: -700, x2: -700 + i * 130, y2: 2700, stroke: "#8E2F28", "stroke-width": 6, opacity: 0.6 }, g);
    // window
    el("rect", { x: 80, y: 180, width: 360, height: 280, fill: lerpC("#9AD4EE", "#1E2A4A", night), stroke: INK, "stroke-width": 8 }, g);
    if (night < 0.5) el("circle", { cx: 330, cy: 260, r: 46, fill: "#FFD25A", stroke: INK, "stroke-width": 5, opacity: 1 - night * 2 }, g);
    else { el("circle", { cx: 330, cy: 260, r: 40, fill: "#F3EFD8", stroke: INK, "stroke-width": 5 }, g); for (let i = 0; i < 6; i++) { const r = MK.rng(i + 2); el("circle", { cx: 110 + r() * 300, cy: 200 + r() * 230, r: 4, fill: WH }, g); } }
    el("path", { d: "M80,320 L440,320 M260,180 L260,460", stroke: "#F3E9D2", "stroke-width": 10 }, g); el("rect", { x: 80, y: 180, width: 360, height: 280, fill: "none", stroke: INK, "stroke-width": 8 }, g);
    // hustle posters
    [["RISE &", "GRIND", 130, 905, -5, "#1d1b1a", GOLD], ["NO DAYS", "OFF", 600, 900, 4, "#3A6EA5", WH], ["EGGS DON'T", "LAY THEMSELVES", 1010, 905, -3, GOLD, INK]].forEach(([a, b, x, y, r, f, ink], i) => {
      const k = clamp(posters * 3 - i); if (k <= 0) return; const pg = el("g", { transform: `translate(${x} ${y}) rotate(${r}) scale(${0.62 * E2(k)})` }, g);
      el("rect", { x: -150, y: -110, width: 300, height: 220, fill: f, stroke: INK, "stroke-width": 7 }, pg); K.txt(pg, 0, -10, a, 46, ink); K.txt(pg, 0, 60, b, b.length > 8 ? 34 : 56, ink); });
    if (clock > 0) { const cg = el("g", { transform: `translate(430 900) scale(${0.75 * E2(clock)})` }, g); el("circle", { cx: 0, cy: 0, r: 90, fill: WH, stroke: INK, "stroke-width": 8 }, cg); K.txt(cg, 0, 20, "24/7", 56, "#C0443A");
      el("line", { x1: 0, y1: 0, x2: Math.cos(t * 6) * 60, y2: Math.sin(t * 6) * 60, stroke: INK, "stroke-width": 6 }, cg); }
    if (week > 0) { const wg = el("g", { transform: "translate(1010 1060) scale(0.8)" }, g); el("rect", { x: -120, y: -70, width: 240, height: 140, rx: 12, fill: "#F3E9D2", stroke: INK, "stroke-width": 6 }, wg); K.txt(wg, 0, 30, "WEEK " + week, 54, INK); }
    // hay + floor
    el("rect", { x: -700, y: 1150, width: 2600, height: 1600, fill: "#C9A55A", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 30; i++) { const r = MK.rng(i + 9); el("line", { x1: -200 + r() * 1500, y1: 1170 + r() * 220, x2: -180 + r() * 1500, y2: 1180 + r() * 220, stroke: "#E8C872", "stroke-width": 5 }, g); }
    if (dark > 0) el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: "#0A0E1E", opacity: dark * 0.45 }, g);
    return g; };
  const E2 = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
  W.rail = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: "#8A5A3A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 9; i++) el("line", { x1: -400 + i * 220, y1: y + 20, x2: -400 + i * 220, y2: y + 900, stroke: "#6B4428", "stroke-width": 6 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 8, fill: "#A8754A", stroke: INK, "stroke-width": 8 }, g); return g; };
  W.crate = (p, { x, y, s = 1, bed = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("ellipse", { cx: 0, cy: -10, rx: 210, ry: 50, fill: "#E8C872", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 12; i++) el("line", { x1: -190 + i * 34, y1: -30, x2: -170 + i * 34, y2: 10, stroke: "#C9A55A", "stroke-width": 5 }, g);
    el("rect", { x: -220, y: 0, width: 440, height: 220, rx: 10, fill: "#A8754A", stroke: INK, "stroke-width": 7 }, g);
    for (let i = 0; i < 3; i++) el("line", { x1: -220, y1: 60 + i * 60, x2: 220, y2: 60 + i * 60, stroke: "#8A5A3A", "stroke-width": 5 }, g);
    K.txt(g, 0, 140, "GOLDIE", 52, "#5A3A22"); return g; };
  // Goldie: origin at the bottom of her body (sits on the nest). mood: perky | tired | wrecked | angry | asleep; tired 0..1
  W.goose = (p, { x, y, s = 1, t = 0, mood = "perky", tired = 0, talk = 0, bite = 0, look = 0, blanket = 0, bob = 1, flip = 1 }) => {
    const g = el("g", { transform: `translate(${x} ${y + (bob ? Math.sin(t * 2) * 4 : 0)}) scale(${s * flip} ${s})` }, p), droop = mood === "wrecked" ? 1 : tired * 0.6;
    el("path", { d: "M-170,-40 Q-200,-170 -60,-190 Q60,-200 150,-110 Q190,-50 150,-10 Q0,20 -170,-40 Z", fill: WH, stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-120,-110 Q-40,-150 40,-110 Q-20,-80 -120,-110 Z", fill: "#EDEDED", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: "M-170,-60 l-50,-30 l20,40 Z", fill: WH, stroke: INK, "stroke-width": 5 }, g);
    // neck + head (droops when tired, lunges when biting)
    const hx = 110 + bite * 160, hy = -330 + droop * 140 - bite * 20, nk = el("path", { d: `M90,-140 Q${130 + look * 20},${-230 + droop * 60} ${hx},${hy + 40}`, fill: "none", stroke: INK, "stroke-width": 64, "stroke-linecap": "round" }, g);
    el("path", { d: `M90,-140 Q${130 + look * 20},${-230 + droop * 60} ${hx},${hy + 40}`, fill: "none", stroke: WH, "stroke-width": 50, "stroke-linecap": "round" }, g);
    const hg = el("g", { transform: `translate(${hx} ${hy}) rotate(${droop * 30 - bite * 10})` }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 62, ry: 54, fill: WH, stroke: INK, "stroke-width": 7 }, hg);
    const op = Math.max(talk * 0.5, bite);
    el("path", { d: `M40,-6 L${130 + bite * 30},${6 - op * 20} L46,14 Z`, fill: "#F28C28", stroke: INK, "stroke-width": 5 }, hg);
    el("path", { d: `M44,18 L${124 + bite * 30},${20 + op * 30} L46,34 Z`, fill: "#E0761A", stroke: INK, "stroke-width": 5 }, hg);
    el("path", { d: "M-20,-58 q-14,-22 6,-28 q4,14 12,4 q16,-6 14,16 q-12,10 -32,8 Z", fill: "#FF8FB1", stroke: INK, "stroke-width": 4 }, hg); // bow
    const ex = 14, ey = -14;
    if (mood === "asleep") { el("path", { d: `M${ex - 20},${ey} q20,14 40,0`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg); }
    else { el("circle", { cx: ex, cy: ey, r: 16, fill: WH, stroke: INK, "stroke-width": 4 }, hg); el("circle", { cx: ex + 5, cy: ey + 2, r: 7, fill: INK }, hg);
      el("path", { d: `M${ex - 12},${ey - 14} l-8,-10 M${ex - 2},${ey - 17} l-2,-12 M${ex + 8},${ey - 16} l4,-11`, stroke: INK, "stroke-width": 3.5, "stroke-linecap": "round" }, hg); // lashes
      const lid = mood === "angry" ? 0.45 : clamp(tired * 0.7 + (mood === "wrecked" ? 0.3 : 0));
      if (lid > 0.05) el("path", { d: `M${ex - 17},${ey} A17,17 0 0,1 ${ex + 17},${ey} L${ex + 17},${ey - 17 + lid * 30} L${ex - 17},${ey - 17 + lid * 30} Z`, fill: WH, stroke: INK, "stroke-width": 4 }, hg);
      if (mood === "angry") el("path", { d: `M${ex - 22},${ey - 30} L${ex + 22},${ey - 18}`, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, hg);
      if (tired > 0.3 || mood === "wrecked") el("path", { d: `M${ex - 14},${ey + 18} q14,10 28,0`, fill: "none", stroke: "#9A7AB8", "stroke-width": 4, opacity: Math.max(tired, mood === "wrecked" ? 1 : 0) }, hg); }
    if (mood === "asleep") { el("path", { d: "M-40,-30 Q20,-50 60,-26 L58,0 Q16,-16 -40,0 Z", fill: "#3A6EA5", stroke: INK, "stroke-width": 4 }, hg); }
    if (mood === "wrecked") for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; el("circle", { cx: hx - 40 + i * 30, cy: hy - 80 - ph * 60, r: 8 + ph * 10, fill: "#9AA0A6", opacity: 0.6 * (1 - ph) }, g); }
    if (blanket > 0) el("path", { d: `M-200,${-20 - 140 * blanket} Q0,${-60 - 150 * blanket} 180,${-20 - 120 * blanket} L190,0 L-200,0 Z`, fill: "#6FA8DC", stroke: INK, "stroke-width": 6 }, g);
    return g; };
  W.egg = (p, { x, y, s = 1, kind = "gold", k = 1, t = 0, rot = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, p);
    const f = kind === "gold" ? GOLD : kind === "bronze" ? "#B8733A" : "#D9D2C6";
    el("ellipse", { cx: 0, cy: -46, rx: 38, ry: 48, fill: f, stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-18,-74 q8,-10 20,-8", fill: "none", stroke: WH, "stroke-width": 6, "stroke-linecap": "round", opacity: 0.8 }, g);
    if (kind === "gold") for (let i = 0; i < 2; i++) { const ph = (t * 1.3 + i / 2) % 1; el("path", { d: `M${-40 + i * 80},${-100 - ph * 20} l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4 Z`, fill: WH, opacity: Math.sin(ph * Math.PI) }, g); }
    return g; };
  W.lamp = (p, { x, y, on = 1 }) => { const g = el("g", { transform: `translate(${x} ${y})` }, p);
    if (on) el("circle", { cx: 0, cy: -90, r: 120, fill: "#FFE27A", opacity: 0.25 }, g);
    el("path", { d: "M-50,-60 L50,-60 L30,-130 L-30,-130 Z", fill: "#FFE27A", stroke: INK, "stroke-width": 5 }, g); el("rect", { x: -8, y: -60, width: 16, height: 60, fill: "#6B4428", stroke: INK, "stroke-width": 4 }, g); return g; };
  W.mic = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -10, y: 0, width: 20, height: 120, rx: 8, fill: "#3A3F45", stroke: INK, "stroke-width": 5 }, g); el("rect", { x: -40, y: -110, width: 80, height: 120, rx: 40, fill: "#6E7681", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 4; i++) el("line", { x1: -30, y1: -80 + i * 22, x2: 30, y2: -80 + i * 22, stroke: INK, "stroke-width": 3, opacity: 0.6 }, g); return g; };
  W.chart = (p, { x, y, s = 1, k = 1, rest = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -430, y: -320, width: 860, height: 640, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -248, "GOLDEN EGGS PER DAY", 46, INK);
    const bars = [["GRIND\nWK 1", 2, GOLD], ["WK 2", 1, GOLD], ["WK 3", 0.3, "#B8733A"]];
    bars.forEach(([lab, v, c], i) => { const bx = -330 + i * 140, h = v * 170; el("rect", { x: bx - 45, y: 200 - h, width: 90, height: h, fill: c, stroke: INK, "stroke-width": 5 }, g); K.txt(g, bx, 250, lab.split("\n").pop(), 30, "#555"); });
    if (rest > 0) { const n = Math.round(rest * 6); for (let i = 0; i < n; i++) { const bx = 110 + i * 54; el("rect", { x: bx - 20, y: 30, width: 40, height: 170, fill: GOLD, stroke: INK, "stroke-width": 4 }, g); }
      K.txt(g, 230, 250, "RESTED: EVERY DAY", 30, "#24857E"); }
    el("line", { x1: -400, y1: 200, x2: 400, y2: 200, stroke: INK, "stroke-width": 6 }, g); return g; };

  W.sheet = (s) => {
    window.FONT = "Chewy"; const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 15 · FAIRY-TALE FARM · \"He tried to scale the golden goose\" — cast & props", 42);
    [["Tod", F.happy], ["Tod: SCALING!", F.shout], ["Tod: shh", F.worried]].forEach(([n, face], i) => { const x = 220 + i * 380, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.66 }, W.TOD, face)); lab(x, y + 50, n); });
    [["perky", {}], ["tired", { mood: "tired", tired: 1 }], ["wrecked", { mood: "wrecked", tired: 1 }], ["angry / bite", { mood: "angry", bite: 1 }], ["asleep", { mood: "asleep", blanket: 1 }]].forEach(([n, o], i) => {
      const x = 1320 + i * 230; W.goose(s, Object.assign({ x, y: 620, s: 0.5 }, o)); lab(x, 670, n); });
    const cp = el("clipPath", { id: "bn" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#bn)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -300)" }, dg);
    W.barn(sg, { t: 0.3, posters: 1, clock: 1, week: 2 }); Person.draw(sg, Object.assign({ x: 300, y: 1420, s: 1 }, W.TOD, F.happy)); W.rail(sg, {}); W.crate(sg, { x: 760, y: 1380 }); W.goose(sg, { x: 760, y: 1370, s: 0.9 }); lab(610, 1700, "barn + posters + 24/7 clock + nest crate");
    W.egg(s, { x: 1350, y: 1000 }); W.egg(s, { x: 1460, y: 1000, kind: "bronze", s: 0.45 }); lab(1400, 1050, "eggs");
    W.lamp(s, { x: 1650, y: 1000 }); W.mic(s, { x: 1850, y: 950 }); lab(1750, 1050, "lamp / podcast mic");
    W.chart(s, { x: 1700, y: 1450, s: 0.5, rest: 1 }); lab(1700, 1640, "eggs-per-day card");
  };
  root.World = W;
})(window);
