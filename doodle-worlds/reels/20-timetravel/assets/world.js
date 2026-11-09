/* world.js — Time travel ("She time travelled to meet her 25 year old self"). Cast (original): Asha at 25 (long dark hair,
   lavender hoodie, earring), Old Asha at 75 (white bun, glasses, beige cardigan; after the twist: a baker's apron + flour).
   Set: young Asha's small kitchen (window, shelves, fridge with "someday" sticky notes, a cold oven that lights up), the
   kitchen counter (foreground). Props: the clock portal, a tray of cookies, the bakery shopfront card, the start-today
   calendar card, time-shimmer rings. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, PU = "#8A5CFF", TE = "#3FB8AF", CK = "#C9873E";
  W.ASHA = { hairStyle: "long", hair: "#2A1A14", skin: "#C98E62", outfit: "hoodie", cloth: "#B9A3F0", cloth2: "#9A84D8", earring: 1, blush: 0.5 };
  W.OLD = { hairStyle: "bob", topBun: 1, hair: "#ECEAE6", skin: "#C98E62", outfit: "coat", cloth: "#D9C6A8", cloth2: "#B8A27E", glasses: 1, earring: 1, blush: 0.4 };
  W.kitchen = (p, { t = 0, oven = 0, notes = 0, started = 0, warm = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#E8E1F2", "#FFE9CC", warm) }, g);
    for (let i = 0; i < 12; i++) el("rect", { x: -700 + i * 220, y: 1000, width: 216, height: 400, fill: i % 2 ? "#D9D2E8" : "#E2DCF0", stroke: "#C9C2DA", "stroke-width": 3 }, g);
    // window (high, clear of the captions)
    el("rect", { x: 420, y: 120, width: 360, height: 260, fill: "#9AD4EE", stroke: INK, "stroke-width": 8 }, g);
    el("path", { d: "M420,300 L480,260 L540,285 L600,220 L680,265 L780,240 L780,380 L420,380 Z", fill: "#8A9AB8" }, g);
    el("path", { d: "M420,250 L780,250 M600,120 L600,380", stroke: WH, "stroke-width": 10 }, g); el("rect", { x: 420, y: 120, width: 360, height: 260, fill: "none", stroke: INK, "stroke-width": 8 }, g);
    // fridge (left) with sticky notes
    el("rect", { x: 20, y: 380, width: 300, height: 760, rx: 24, fill: "#F3F5F8", stroke: INK, "stroke-width": 7 }, g); el("line", { x1: 20, y1: 640, x2: 320, y2: 640, stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: 284, y: 460, width: 14, height: 120, rx: 6, fill: "#9AA0A6", stroke: INK, "stroke-width": 3 }, g); el("rect", { x: 284, y: 700, width: 14, height: 160, rx: 6, fill: "#9AA0A6", stroke: INK, "stroke-width": 3 }, g);
    [["COURSE", "FIRST"], ["SAVE", "MORE"], ["PERFECT", "RECIPE"]].forEach(([a, b], i) => { const k = clamp(notes * 3 - i); if (k <= 0) return; const ng = el("g", { transform: `translate(${100 + (i % 2) * 120} ${720 + i * 130}) rotate(${(i - 1) * 6}) scale(${k})` }, g);
      el("rect", { x: -60, y: -55, width: 120, height: 110, fill: "#FFE27A", stroke: INK, "stroke-width": 4, opacity: 1 - started * 0.6 }, ng); K.txt(ng, 0, -6, a, 26, INK); K.txt(ng, 0, 28, b, 26, INK);
      if (started > 0) el("line", { x1: -50, y1: -40, x2: lerp(-50, 50, started), y2: lerp(-40, 40, started), stroke: "#E5484D", "stroke-width": 7 }, ng); });
    // oven (right)
    el("rect", { x: 900, y: 760, width: 330, height: 640, rx: 16, fill: "#5A6378", stroke: INK, "stroke-width": 7 }, g);
    el("rect", { x: 930, y: 880, width: 270, height: 200, rx: 12, fill: lerpC("#2A2F3A", "#FF9A3C", oven), stroke: INK, "stroke-width": 6 }, g);
    if (oven > 0.5) el("circle", { cx: 1065, cy: 980, r: 160, fill: "#FFB15A", opacity: 0.25 * oven }, g);
    for (let i = 0; i < 4; i++) el("circle", { cx: 950 + i * 70, cy: 810, r: 16, fill: oven > 0.5 && i === 1 ? "#E5484D" : "#9AA0A6", stroke: INK, "stroke-width": 4 }, g);
    if (oven < 0.2) for (let i = 0; i < 3; i++) el("path", { d: `M${960 + i * 80},900 l14,20 l-14,20`, fill: "none", stroke: "#9FD8EA", "stroke-width": 4, opacity: 0.8 }, g);
    return g; };
  W.counter = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: "#C9A27A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 6; i++) el("rect", { x: -380 + i * 320, y: y + 60, width: 280, height: 200, rx: 10, fill: "none", stroke: "#A8804A", "stroke-width": 5 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 8, fill: "#EDE6DA", stroke: INK, "stroke-width": 8 }, g); return g; };
  W.portal = (p, { x, y, s = 1, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: 0, cy: 0, rx: 230 - i * 40, ry: 330 - i * 56, fill: "none", stroke: i % 2 ? PU : TE, "stroke-width": 16 - i * 2, opacity: 0.85, "stroke-dasharray": "60 30", "stroke-dashoffset": t * (i % 2 ? 300 : -300) }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 100, ry: 150, fill: "#2A1E5A", opacity: 0.6 }, g);
    el("circle", { cx: 0, cy: 0, r: 60, fill: WH, stroke: INK, "stroke-width": 5, opacity: 0.9 }, g);
    el("line", { x1: 0, y1: 0, x2: Math.cos(t * 8) * 44, y2: Math.sin(t * 8) * 44, stroke: INK, "stroke-width": 6 }, g); el("line", { x1: 0, y1: 0, x2: Math.cos(t * 1.5) * 30, y2: Math.sin(t * 1.5) * 30, stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 8; i++) { const a = t * 2 + i; el("circle", { cx: Math.cos(a) * 260, cy: Math.sin(a) * 340, r: 6, fill: "#FFE27A" }, g); } return g; };
  W.tray = (p, { x, y, s = 1, k = 1, n = 12, left = 12, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -170, y: -24, width: 340, height: 30, rx: 8, fill: "#9AA0A6", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < Math.min(n, left); i++) { const cx = -130 + (i % 6) * 52, cy = -40 - Math.floor(i / 6) * 34; el("ellipse", { cx, cy, rx: 24, ry: 14, fill: CK, stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: cx - 6, cy: cy - 2, r: 3, fill: "#5A3A22" }, g); el("circle", { cx: cx + 8, cy: cy + 2, r: 3, fill: "#5A3A22" }, g); }
    for (let i = 0; i < 2; i++) { const ph = (t * 0.7 + i / 2) % 1; el("path", { d: `M${-40 + i * 80},${-90 - ph * 60} q10,-14 0,-28 q-10,-14 0,-28`, fill: "none", stroke: "#C9C2DA", "stroke-width": 5, opacity: Math.sin(ph * Math.PI) }, g); }
    return g; };
  W.cookie = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p); el("circle", { cx: 0, cy: 0, r: 30, fill: CK, stroke: INK, "stroke-width": 4 }, g);
    for (const [a, b] of [[-10, -6], [8, 4], [-4, 12]]) el("circle", { cx: a, cy: b, r: 4, fill: "#5A3A22" }, g); return g; };
  W.shop = (p, { x, y, s = 1, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -400, y: -300, width: 800, height: 600, rx: 30, fill: "#FFF3D6", stroke: INK, "stroke-width": 9 }, g);
    for (let i = 0; i < 8; i++) el("path", { d: `M${-360 + i * 90},-190 l45,0 l-10,60 q-12,20 -25,0 Z`, fill: i % 2 ? "#E5484D" : WH, stroke: INK, "stroke-width": 4 }, g);
    el("rect", { x: -360, y: -200, width: 720, height: 20, fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g);
    K.txt(g, 0, -226, "ASHA'S BAKERY", 58, "#8A3A1E");
    el("rect", { x: -300, y: -90, width: 260, height: 280, rx: 10, fill: "#9AD4EE", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: 60, y: -90, width: 220, height: 380, rx: 10, fill: "#8A5A3A", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 3; i++) W.cookie(g, { x: -230 + i * 80, y: 120, s: 0.9 }); el("circle", { cx: 250, cy: 120, r: 10, fill: "#F2C14E", stroke: INK, "stroke-width": 3 }, g);
    K.txt(g, -170, 245, "since 2026", 32, "#8A5A3A"); return g; };
  W.todayCard = (p, { x, y, s = 1, k = 1, circle = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -420, y: -300, width: 840, height: 600, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    el("rect", { x: -420, y: -300, width: 840, height: 90, rx: 36, fill: "#E5484D", stroke: INK, "stroke-width": 9 }, g); K.txt(g, 0, -238, "WHEN TO START", 50, WH);
    K.txt(g, -380, -110, "BEST TIME:", 40, "#555", "start"); K.txt(g, 380, -110, "YEARS AGO", 48, "#9AA0A6", "end"); el("line", { x1: 60, y1: -124, x2: 380, y2: -124, stroke: "#9AA0A6", "stroke-width": 6 }, g);
    K.txt(g, -380, 30, "2ND BEST:", 40, "#555", "start"); K.txt(g, 380, 30, "TODAY", 72, TE, "end");
    if (circle > 0) el("ellipse", { cx: 260, cy: 6, rx: 150 * circle, ry: 66 * circle, fill: "none", stroke: "#E5484D", "stroke-width": 8 }, g);
    K.txt(g, 0, 200, "one tray. one neighbor. one sale.", 34, "#8A5A3A"); return g; };
  W.shimmer = (p, { x, y, k = 0, t = 0 }) => { if (k <= 0) return; for (let i = 0; i < 3; i++) { const ph = (t * 1.5 + i / 3) % 1; el("ellipse", { cx: x, cy: y, rx: 120 + ph * 160, ry: 180 + ph * 200, fill: "none", stroke: i % 2 ? PU : TE, "stroke-width": 8, opacity: k * (1 - ph) }, p); } };
  W.apron = (p, { c, k = 1 }) => { if (k <= 0) return; const P = Person, h = P.head(c), cx = c.x, cy = c.y, s = c.s;
    const g = el("g", { transform: `translate(${cx} ${cy}) scale(${s})`, opacity: k }, p);
    el("path", { d: "M-70,-170 L70,-170 L86,0 L-86,0 Z", fill: WH, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-70,-170 Q0,-230 70,-170", fill: "none", stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: -40, y: -110, width: 80, height: 50, rx: 8, fill: "none", stroke: "#E5484D", "stroke-width": 4 }, g); W.cookie(g, { x: 0, y: -85, s: 0.6 });
    for (let i = 0; i < 6; i++) { const r = MK.rng(i + 3); el("circle", { cx: -70 + r() * 140, cy: -160 + r() * 140, r: 4, fill: WH, opacity: 0.9 }, g); } };

  W.sheet = (s) => {
    window.FONT = "Caveat Brush"; const lab = (x, y, t, z = 32) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 20 · TIME TRAVEL · \"She time travelled to meet her 25 year old self\" — cast & props", 44);
    [["Asha, 25", W.ASHA, F.happy], ["Asha: did we open it?!", W.ASHA, F.shock], ["Old Asha, 75", W.OLD, F.calm], ["Old Asha: no.", W.OLD, F.sad]].forEach(([n, look, face], i) => {
      const x = 220 + i * 400, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.66 }, look, face)); lab(x, y + 50, n); });
    const ob = Object.assign({ x: 1820, y: 640, s: 0.66 }, W.OLD, F.happy); Person.draw(s, ob); W.apron(s, { c: ob }); lab(1820, 690, "Old Asha: baker (twist)");
    const cp = el("clipPath", { id: "tt" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#tt)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -250)" }, dg);
    W.kitchen(sg, { t: 0.3, notes: 1 }); W.portal(sg, { x: 300, y: 1000, s: 0.9, t: 0.3 }); Person.draw(sg, Object.assign({ x: 300, y: 1420, s: 1 }, W.OLD, F.calm)); Person.draw(sg, Object.assign({ x: 780, y: 1420, s: 1 }, W.ASHA, F.shock)); W.counter(sg, {}); lab(610, 1700, "kitchen (cold oven, someday notes) + portal");
    const cp2 = el("clipPath", { id: "tt2" }, s); el("rect", { x: 1240, y: 760, width: 1100, height: 900, rx: 16 }, cp2);
    const dg2 = el("g", { "clip-path": "url(#tt2)" }, s), sg2 = el("g", { transform: "translate(1240 760) scale(0.62) translate(0 -250)" }, dg2);
    W.kitchen(sg2, { t: 0.3, notes: 1, started: 1, oven: 1, warm: 1 }); Person.draw(sg2, Object.assign({ x: 780, y: 1420, s: 1 }, W.ASHA, F.happy)); W.counter(sg2, {}); W.tray(sg2, { x: 560, y: 1405, t: 0.3 }); lab(1790, 1700, "oven on, notes crossed, cookies");
    W.shop(s, { x: 500, y: 2100, s: 0.5 }); W.todayCard(s, { x: 1150, y: 2100, s: 0.5, circle: 1 }); W.shimmer(s, { x: 1800, y: 2100, k: 1, t: 0.3 }); lab(1150, 2300, "bakery card / start-today card / time shimmer");
  };
  root.World = W;
})(window);
