/* world.js — Wild West ("Two saloons started a price war"). Cast: Dusty (cowboy hat, moustache), Belle (red hair, pink vest),
   Rosa (black bob, flower, apron). Set: desert sky, mesas, cacti, the street; Dusty's and Belle's saloon fronts (left/right);
   Rosa's place in the middle (boarded "COMING SOON" -> open "ROSA'S": awning shade, piano, ice); a bar counter (foreground).
   Props: price boards, lemonade jug + glasses, ice cubes, tumbleweed, cobweb, empty cash box, the race-to-zero chart. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.DUSTY = { hairStyle: "short", hair: "#6B4428", mustache: 1, skin: "#E9B48A", outfit: "cowboy", cloth: "#E8D9B5", cloth2: "#8A5A3A", hat: "cowboy", hatC: "#A0703F", thickBrows: 1, blush: 0.4 };
  W.BELLE = { hairStyle: "long", hair: "#C0392B", skin: "#F3D1B5", outfit: "cowboy", cloth: "#FFFFFF", cloth2: "#E58FB1", hat: "none", earring: 1, blush: 0.7 };
  W.ROSA = { hairStyle: "bob", hair: "#1E1614", skin: "#C98E62", outfit: "scrubs", cloth: "#FFF3D6", hat: "flower", hatC: "#FF8FB1", blush: 0.6 };
  W.desert = (p, { t = 0 }) => { const g = el("g", {}, p);
    const d = el("defs", {}, g), lg = el("linearGradient", { id: "dsky", x1: 0, y1: 0, x2: 0, y2: 1 }, d); el("stop", { offset: "0", "stop-color": "#7EC8E3" }, lg); el("stop", { offset: "1", "stop-color": "#FFE2B0" }, lg);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: "url(#dsky)" }, g);
    el("circle", { cx: 880, cy: 380, r: 80, fill: "#FFE07A", stroke: INK, "stroke-width": 6 }, g);
    for (const [x, w0, h] of [[-200, 420, 260], [1150, 380, 220]]) el("path", { d: `M${x - w0 / 2},1000 L${x - w0 / 2 + 60},${1000 - h} L${x + w0 / 2 - 60},${1000 - h} L${x + w0 / 2},1000 Z`, fill: "#D9824A", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-700,980 Q300,940 1800,990 L1800,2600 L-700,2600 Z", fill: "#E9C48E", stroke: INK, "stroke-width": 7 }, g);
    return g; };
  W.cactus = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -26, y: -220, width: 52, height: 220, rx: 26, fill: "#5FA05A", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-26,-120 L-70,-120 Q-84,-120 -84,-134 L-84,-180", fill: "none", stroke: INK, "stroke-width": 40, "stroke-linecap": "round" }, g); el("path", { d: "M-26,-120 L-70,-120 Q-84,-120 -84,-134 L-84,-180", fill: "none", stroke: "#5FA05A", "stroke-width": 28, "stroke-linecap": "round" }, g);
    el("path", { d: "M26,-90 L64,-90 Q76,-90 76,-104 L76,-150", fill: "none", stroke: INK, "stroke-width": 40, "stroke-linecap": "round" }, g); el("path", { d: "M26,-90 L64,-90 Q76,-90 76,-104 L76,-150", fill: "none", stroke: "#5FA05A", "stroke-width": 28, "stroke-linecap": "round" }, g); return g; };
  // a saloon front: x = centre, y = ground. name, tone, broke 0..1 (cobwebs, boards)
  W.saloon = (p, { x, y, s = 1, name = "DUSTY'S", tone = "#B8895A", broke = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-260,0 L-260,-420 L-200,-420 L-200,-500 L200,-500 L200,-420 L260,-420 L260,0 Z", fill: tone, stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 8; i++) el("line", { x1: -250, y1: -400 + i * 50, x2: 250, y2: -400 + i * 50, stroke: Person.shade(tone, 0.2), "stroke-width": 4 }, g);
    el("rect", { x: -190, y: -480, width: 380, height: 70, rx: 8, fill: "#F3E2C0", stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, -428, name, 48, "#7A3A1E");
    el("rect", { x: -280, y: -230, width: 560, height: 24, fill: "#7A5032", stroke: INK, "stroke-width": 6 }, g);
    for (const sd of [-1, 1]) el("path", { d: `M${sd * 10},-190 L${sd * 90},-190 L${sd * 90},-80 L${sd * 10},-80 Z`, fill: "#D9B07A", stroke: INK, "stroke-width": 6 }, g);
    if (broke > 0) { el("path", { d: "M-240,-390 Q-200,-360 -170,-400 M-240,-390 L-200,-330 M-240,-390 L-180,-380", fill: "none", stroke: "#888", "stroke-width": 3, opacity: broke }, g);
      el("rect", { x: -120, y: -170, width: 240, height: 30, fill: "#8A5A3A", stroke: INK, "stroke-width": 5, transform: "rotate(-12 0 -155)", opacity: broke }, g); }
    return g; };
  // Rosa's: open 0..1 (boards -> lights + awning), piano notes, ice glints
  W.rosas = (p, { x, y, s = 1, open = 0, t = 0, piano = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-230,0 L-230,-400 L230,-400 L230,0 Z", fill: lerpC("#9A8F86", "#F2A65A", open), stroke: INK, "stroke-width": 8 }, g);
    el("path", { d: "M-250,-400 L0,-520 L250,-400 Z", fill: lerpC("#8A8078", "#E5484D", open), stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
    el("rect", { x: -170, y: -340, width: 340, height: 70, rx: 8, fill: WH, stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, -290, open > 0.5 ? "ROSA'S" : "COMING SOON", open > 0.5 ? 56 : 38, open > 0.5 ? "#E5484D" : "#777");
    el("rect", { x: -90, y: -200, width: 180, height: 200, fill: open > 0.5 ? "#FFE7A0" : "#5A4A3A", stroke: INK, "stroke-width": 6 }, g);
    if (open < 0.5) for (let i = 0; i < 3; i++) el("rect", { x: -110, y: -180 + i * 60, width: 220, height: 26, fill: "#8A5A3A", stroke: INK, "stroke-width": 5, transform: `rotate(${(i % 2 ? 1 : -1) * 8} 0 ${-167 + i * 60})` }, g);
    else { // awning shade
      for (let i = 0; i < 7; i++) el("path", { d: `M${-280 + i * 80},-250 L${-200 + i * 80},-250 L${-200 + i * 80},-190 Q${-240 + i * 80},-160 ${-280 + i * 80},-190 Z`, fill: i % 2 ? WH : "#3FB8AF", stroke: INK, "stroke-width": 5, opacity: open }, g);
      if (piano > 0) for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; K.txt(g, -40 + i * 40 + Math.sin(ph * 6) * 20, -120 - ph * 200, i % 2 ? "♪" : "♫", 50, INK, "middle", { opacity: Math.sin(ph * Math.PI) * piano }); } }
    return g; };
  W.priceBoard = (p, { x, y, s = 1, text = "5¢", hot = 0, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * (1 + 0.15 * hot)})` }, p);
    el("rect", { x: -110, y: -70, width: 220, height: 140, rx: 14, fill: "#2B2B3A", stroke: INK, "stroke-width": 7 }, g);
    K.txt(g, 0, 30, text, text.length > 3 ? 64 : 92, text === "FREE" ? "#7CE38B" : "#FFE07A"); return g; };
  W.bar = (p, { x0 = -400, x1 = 1480, y = 1405 }) => { const g = el("g", {}, p);
    el("rect", { x: x0, y: y + 26, width: x1 - x0, height: 900, fill: "#8A5A3A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 12; i++) el("rect", { x: x0 + 40 + i * 160, y: y + 80, width: 120, height: 300, rx: 8, fill: "none", stroke: "#6B4428", "stroke-width": 6 }, g);
    el("rect", { x: x0 - 16, y, width: x1 - x0 + 32, height: 36, rx: 8, fill: "#B8895A", stroke: INK, "stroke-width": 8 }, g); return g; };
  W.jug = (p, { x, y, s = 1, ice = 0, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-60,0 L-70,-180 Q-70,-200 -50,-200 L50,-200 Q70,-200 70,-180 L60,0 Z", fill: "rgba(220,240,255,.5)", stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M-62,-20 L-68,-150 L68,-150 L62,-20 Z", fill: "#FFE680" }, g); el("path", { d: "M70,-170 q50,10 40,70 q-6,30 -40,30", fill: "none", stroke: INK, "stroke-width": 9 }, g);
    for (let i = 0; i < 3; i++) el("path", { d: "M-20,-30 L20,-30 L20,10 L-20,10 Z", fill: "rgba(255,255,255,.75)", stroke: INK, "stroke-width": 3, transform: `translate(${-30 + i * 30} ${-100 + (i % 2) * 30}) rotate(${i * 20})`, opacity: ice }, g);
    if (ice > 0) for (let i = 0; i < 4; i++) FXs(g, -60 + i * 40, -220 - (i % 2) * 20, t + i); return g; };
  const FXs = (g, x, y, t) => { const k = 0.6 + 0.4 * Math.sin(t * 6); el("path", { d: `M${x},${y - 14 * k} L${x + 4},${y - 4} L${x + 14 * k},${y} L${x + 4},${y + 4} L${x},${y + 14 * k} L${x - 4},${y + 4} L${x - 14 * k},${y} L${x - 4},${y - 4} Z`, fill: "#BFE8FF", stroke: INK, "stroke-width": 2 }, g); };
  W.tumbleweed = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y - Math.abs(Math.sin(t * 5)) * 30}) rotate(${t * 300}) scale(${s})` }, p);
    for (let i = 0; i < 9; i++) el("ellipse", { cx: 0, cy: 0, rx: 60, ry: 22, fill: "none", stroke: "#A0703F", "stroke-width": 5, transform: `rotate(${i * 20})` }, g); return g; };
  W.cashbox = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -70, y: -60, width: 140, height: 60, rx: 6, fill: "#7A8696", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M-70,-60 L-60,-110 L80,-110 L70,-60 Z", fill: "#9AA6B3", stroke: INK, "stroke-width": 6 }, g);
    const mx = Math.sin(t * 3) * 20; el("ellipse", { cx: mx, cy: -140 - Math.abs(Math.sin(t * 6)) * 10, rx: 12, ry: 8, fill: "#C9B8A6", stroke: INK, "stroke-width": 3 }, g);
    for (const sd of [-1, 1]) el("ellipse", { cx: mx + sd * 14, cy: -146, rx: 12, ry: 6, fill: WH, stroke: INK, "stroke-width": 2, transform: `rotate(${sd * 30 + Math.sin(t * 30) * 30} ${mx} -146)` }, g); return g; };
  W.chart = (p, { x, y, s = 1, k = 1, a = 1, b = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -300, width: 880, height: 600, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    el("path", { d: "M-360,220 L-360,-230 M-360,220 L380,220", stroke: INK, "stroke-width": 6 }, g);
    const p1 = `M-350,-160 L${lerp(-350, 340, a)},${lerp(-160, 200, a)}`, p2 = `M-350,-60 L${lerp(-350, 340, b)},${lerp(-60, -240, b)}`;
    el("path", { d: p1, stroke: "#E5484D", "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: p2, stroke: "#3FB8AF", "stroke-width": 14, "stroke-linecap": "round" }, g);
    if (a > 0.3) K.txt(g, -330, -250, "— CUT PRICE → 0", 40, "#E5484D", "start"); if (b > 0.3) K.txt(g, 60, -250, "— DIFFERENT → WIN", 40, "#24857E", "start"); return g; };
  W.stall = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -260, y: 0, width: 520, height: 120, fill: "#D9A06A", stroke: INK, "stroke-width": 7 }, g); el("rect", { x: -280, y: -16, width: 560, height: 30, rx: 8, fill: "#F2C890", stroke: INK, "stroke-width": 7 }, g);
    K.txt(g, 0, 84, "LEMONADE", 44, "#7A3A1E"); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 8 · WILD WEST · \"Two saloons started a price war\" — cast & props", 44);
    [["Dusty", W.DUSTY, F.smug], ["Dusty: THREE!", W.DUSTY, F.shout], ["Dusty: broke", W.DUSTY, F.sad], ["Belle", W.BELLE, F.smug], ["Belle: TWO!", W.BELLE, F.shout], ["Rosa", W.ROSA, F.happy]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 650; Person.draw(s, Object.assign({ x, y, s: 0.7 }, look, face)); lab(x, y + 50, n); });
    const box = (x, y, w, h, id, fn, label) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s);
      fn(el("g", { transform: `translate(${x} ${y}) scale(0.58) translate(0 -500)` }, g)); lab(x + w / 2, y + h + 40, label); };
    box(60, 760, 1100, 800, "a", (g) => { W.desert(g, {}); W.cactus(g, { x: -60, y: 1000 }); W.saloon(g, { x: 150, y: 1000, s: 0.8 }); W.saloon(g, { x: 930, y: 1000, s: 0.8, name: "BELLE'S", tone: "#C98A8A" }); W.rosas(g, { x: 540, y: 1000, s: 0.55 }); W.bar(g, {}); }, "main street: Dusty's, Rosa's (coming soon), Belle's");
    box(1240, 760, 1100, 800, "b", (g) => { W.desert(g, {}); W.saloon(g, { x: 150, y: 1000, s: 0.8, broke: 1 }); W.saloon(g, { x: 930, y: 1000, s: 0.8, name: "BELLE'S", tone: "#C98A8A", broke: 1 }); W.rosas(g, { x: 540, y: 1000, s: 0.55, open: 1, piano: 1, t: 0.3 }); W.bar(g, {}); W.tumbleweed(g, { x: 300, y: 1360, t: 0.2 }); }, "Friday: both broke, Rosa's open");
    ["5¢", "4¢", "3¢", "2¢", "FREE", "10¢"].forEach((tx, i) => W.priceBoard(s, { x: 220 + i * 230, y: 1800, s: 0.8, text: tx })); lab(800, 1920, "the price boards");
    W.jug(s, { x: 1650, y: 1880, ice: 1, t: 0.2 }); W.cashbox(s, { x: 1900, y: 1880, t: 0.3 }); W.cactus(s, { x: 2150, y: 1900, s: 0.7 }); lab(1900, 1940, "ice-cold lemonade / empty cash box / cactus");
    W.chart(s, { x: 1200, y: 2350, s: 0.55, a: 1, b: 1 }); lab(1200, 2560, "race-to-zero chart");
  };
  root.World = W;
})(window);
