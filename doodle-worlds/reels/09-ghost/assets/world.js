/* world.js — Haunted mansion ("This ghost was fired from haunting"). Cast (original): Boris, a ghost who is literally a flowery
   bedsheet (eye holes, bow tie, droopy eyes); the Raven (the boss: monocle, tie); Zoe and Kabir (teens). Set: dark hallway
   (striped wallpaper, portraits, candelabra, cobwebs), the dusty sofa (foreground); escape-room mode (neon sign, timer, lock).
   Props: the 5-star "cozy vibes" review, FIRED stamp, cardboard box, Friday calendar, padlock chest, SOLD OUT banner,
   the same-ghost / new-customer card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.ZOE = { hairStyle: "long", hair: "#2A1E1A", skin: "#E9B48A", outfit: "hoodie", cloth: "#7A5AA6", cloth2: "#5E4486", blush: 0.4 };
  W.KABIR = { hairStyle: "short", hair: "#1E1614", skin: "#B97A4E", outfit: "hoodie", cloth: "#3FB8AF", cloth2: "#2E8F88", hat: "cap", hatC: "#E5484D", blush: 0.4 };
  // Boris: x,y = the middle of the sheet; arms raised 0..1; mood: 'meek'|'sad'|'proud'|'think'|'boo'
  W.boris = (p, { x, y, s = 1, t = 0, arms = 0, mood = "meek", look = [0, 0], box = 0 }) => {
    const bob = Math.sin(t * 2.2) * 14, g = el("g", { transform: `translate(${x} ${y + bob}) scale(${s})` }, p);
    let hem = "", n = 7; for (let i = 0; i <= n; i++) { const hx = -170 + i * 340 / n, hy = 260 + Math.sin(t * 4 + i) * 12 + (i % 2 ? 26 : 0); hem += (i ? " L" : "M") + hx.toFixed(1) + "," + hy.toFixed(1); }
    const body = `M-150,-120 C-150,-330 150,-330 150,-120 L170,260 ${hem.replace(/^M/, "L").split(" L").reverse().join(" L")} L-170,260 Z`;
    el("path", { d: `M-150,-120 C-150,-330 150,-330 150,-120 L170,260 L-170,260 Z`, fill: "#F7F3FF", stroke: INK, "stroke-width": 8, "stroke-linejoin": "round" }, g);
    let hd = "M-170,250"; for (let i = 0; i <= 14; i++) { const hx = -170 + i * 340 / 14; hd += ` Q${hx + 12},${284 + Math.sin(t * 4 + i) * 10} ${hx + 24},${250}`; }
    el("path", { d: hd + " L170,230 L-170,230 Z", fill: "#F7F3FF", stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g);
    for (const [fx, fy] of [[-90, -160], [60, -220], [100, -40], [-60, 20], [20, 120], [-110, 160], [110, 190]]) { const fg = el("g", { transform: `translate(${fx} ${fy})` }, g);
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; el("circle", { cx: Math.cos(a) * 12, cy: Math.sin(a) * 12, r: 9, fill: "#C9B8F0" }, fg); } el("circle", { cx: 0, cy: 0, r: 7, fill: "#F2C14E" }, fg); }
    // arms (sheet folds lifting)
    for (const sd of [-1, 1]) { const ax = sd * (150 + 80 * arms), ay = lerp(60, -200, arms);
      el("path", { d: `M${sd * 140},-60 Q${sd * 200},${-40 - 60 * arms} ${ax},${ay} Q${sd * 170},${ay + 70} ${sd * 150},40`, fill: "#F7F3FF", stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g); }
    // eye holes
    const lx = look[0] * 10, ly = look[1] * 8;
    for (const sd of [-1, 1]) { el("ellipse", { cx: sd * 52 + lx, cy: -140 + ly, rx: 28, ry: mood === "boo" ? 36 : 30, fill: "#2B2440" }, g);
      if (mood === "meek" || mood === "sad") el("path", { d: `M${sd * 52 - 30 + lx},${-160 + ly} Q${sd * 52 + lx},${-178 + ly} ${sd * 52 + 30 + lx},${-160 + ly}`, fill: "#F7F3FF" }, g);
      if (mood === "proud") el("path", { d: `M${sd * 52 - 30 + lx},${-126 + ly} Q${sd * 52 + lx},${-108 + ly} ${sd * 52 + 30 + lx},${-126 + ly} L${sd * 52 + 30 + lx},${-100 + ly} L${sd * 52 - 30 + lx},${-100 + ly} Z`, fill: "#F7F3FF" }, g);
      el("circle", { cx: sd * 52 + lx + 8, cy: -150 + ly, r: 6, fill: WH }, g); }
    if (mood === "boo") el("ellipse", { cx: lx, cy: -70 + ly, rx: 22, ry: 30, fill: "#2B2440" }, g);
    else if (mood === "sad") el("path", { d: `M${-22 + lx},${-62 + ly} Q${lx},${-80 + ly} ${22 + lx},${-62 + ly}`, fill: "none", stroke: "#2B2440", "stroke-width": 7, "stroke-linecap": "round" }, g);
    else if (mood === "proud") el("path", { d: `M${-26 + lx},${-76 + ly} Q${lx},${-50 + ly} ${26 + lx},${-76 + ly}`, fill: "none", stroke: "#2B2440", "stroke-width": 7, "stroke-linecap": "round" }, g);
    else el("ellipse", { cx: lx, cy: -68 + ly, rx: 10, ry: 8, fill: "#2B2440" }, g);
    // bow tie
    el("path", { d: "M0,-20 L-44,-44 L-44,4 Z M0,-20 L44,-44 L44,4 Z", fill: "#E5484D", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g); el("circle", { cx: 0, cy: -20, r: 12, fill: "#B83A3A", stroke: INK, "stroke-width": 4 }, g);
    if (box > 0) { const bg = el("g", { transform: `translate(0 120) scale(${box})` }, g); el("path", { d: "M-110,-60 L110,-60 L96,70 L-96,70 Z", fill: "#C9935E", stroke: INK, "stroke-width": 6 }, bg);
      el("path", { d: "M-110,-60 L-140,-100 M110,-60 L140,-100", stroke: INK, "stroke-width": 6 }, bg); K.txt(bg, 0, 20, "BOO STUFF", 30, INK); }
    return g; };
  W.raven = (p, { x, y, s = 1, t = 0, point = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -120, y: 60, width: 240, height: 22, rx: 8, fill: "#6B4428", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: "M-70,60 Q-90,-40 -20,-80 Q40,-110 70,-40 Q90,20 50,60 Z", fill: "#2B2B3A", stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: 20, cy: -100, r: 50, fill: "#2B2B3A", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M60,-110 L120,-90 L60,-80 Z", fill: "#F2C14E", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 34, cy: -110, r: 14, fill: WH, stroke: INK, "stroke-width": 3 }, g); el("circle", { cx: 36, cy: -110, r: 6, fill: INK }, g); el("circle", { cx: 34, cy: -110, r: 20, fill: "none", stroke: "#F2C14E", "stroke-width": 4 }, g);
    el("line", { x1: 54, y1: -110, x2: 64, y2: -60, stroke: "#F2C14E", "stroke-width": 3 }, g); el("line", { x1: 14, y1: -128, x2: 46, y2: -122, stroke: INK, "stroke-width": 6 }, g);
    el("path", { d: "M10,-50 L-6,10 L10,30 L26,10 Z", fill: "#E5484D", stroke: INK, "stroke-width": 4 }, g);
    const wa = point * 70; el("path", { d: `M-40,-20 Q${-120 - wa * 0.4},${-40 - wa} ${-160 - wa * 0.6},${-60 - wa * 1.2} Q-90,0 -50,30 Z`, fill: "#3A3A4A", stroke: INK, "stroke-width": 5 }, g); return g; };
  W.hall = (p, { t = 0, neon = 0, dark = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: lerpC("#4A3A66", "#2B2440", dark) }, g);
    for (let i = 0; i < 30; i++) el("rect", { x: -700 + i * 90, y: -700, width: 40, height: 2800, fill: "#55447A", opacity: 0.6 }, g);
    el("rect", { x: -700, y: 1200, width: 2500, height: 1600, fill: "#3A2A1E" }, g);
    for (const [x, y] of [[180, 620], [880, 600]]) { const fg = el("g", { transform: `translate(${x} ${y})` }, g);
      el("rect", { x: -110, y: -140, width: 220, height: 280, rx: 8, fill: "#C9A46A", stroke: INK, "stroke-width": 8 }, fg); el("rect", { x: -86, y: -116, width: 172, height: 232, fill: "#6E5A48", stroke: INK, "stroke-width": 5 }, fg);
      el("circle", { cx: 0, cy: -20, r: 40, fill: "#E9C9A5", stroke: INK, "stroke-width": 4 }, fg); el("path", { d: "M-60,116 Q0,40 60,116", fill: "#3A3A4A", stroke: INK, "stroke-width": 4 }, fg);
      for (const sd of [-1, 1]) el("circle", { cx: sd * 14 + Math.sin(t * 0.8) * 6, cy: -26, r: 5, fill: INK }, fg); }
    el("path", { d: "M-100,180 Q-40,240 20,180 M-100,180 L-40,300 M-100,180 L10,260", fill: "none", stroke: "#BBB", "stroke-width": 3 }, g);
    el("path", { d: "M1180,180 Q1120,240 1060,180 M1180,180 L1120,300", fill: "none", stroke: "#BBB", "stroke-width": 3 }, g);
    if (neon > 0) { const blink = 0.75 + 0.25 * Math.sin(t * 9), ng = el("g", { transform: `translate(540 920) scale(${neon})` }, g);
      el("rect", { x: -330, y: -110, width: 660, height: 220, rx: 30, fill: "#1A1424", stroke: "#FF4FD8", "stroke-width": 10, opacity: blink }, ng);
      K.txt(ng, 0, -26, "HAUNTED", 70, "#FF4FD8", "middle", { opacity: blink }); K.txt(ng, 0, 64, "ESCAPE ROOM", 64, "#4FD6FF", "middle", { opacity: blink }); }
    return g; };
  W.candles = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-80,-40 Q0,40 80,-40 M0,0 L0,120 M-50,120 L50,120", fill: "none", stroke: "#C9A46A", "stroke-width": 12, "stroke-linecap": "round" }, g);
    for (const cx of [-80, 0, 80]) { el("rect", { x: cx - 12, y: -120, width: 24, height: 80, fill: "#F7F2E6", stroke: INK, "stroke-width": 4 }, g); K.fire(g, { x: cx, y: -120, s: 0.22, t: t + cx }); } return g; };
  W.sofa = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("path", { d: `M-400,${y + 30} Q-380,${y - 40} -300,${y - 30} L1380,${y - 30} Q1460,${y - 40} 1480,${y + 30} L1480,${y + 900} L-400,${y + 900} Z`, fill: "#7A2E46", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 10; i++) el("circle", { cx: -300 + i * 190, cy: y + 60, r: 10, fill: "#5A1E32" }, g);
    el("path", { d: `M-300,${y - 30} L1380,${y - 30}`, stroke: "#9A3E5A", "stroke-width": 10 }, g); el("path", { d: `M200,${y - 20} q30,20 60,0 q30,-20 60,0`, fill: "none", stroke: "#BBB", "stroke-width": 3 }, g); return g; };
  W.review = (p, { x, y, s = 1, k = 1, stars = 5, text = "“cozy vibes”", t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -300, y: -130, width: 600, height: 260, rx: 30, fill: WH, stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 5; i++) { const cx = -200 + i * 100, kk = clamp(stars - i); if (kk <= 0) continue; const sg = el("g", { transform: `translate(${cx} -40) scale(${kk})` }, g); let d = "";
      for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 18 : 42; d += (j ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + "," + (Math.sin(a) * r).toFixed(1); } el("path", { d: d + "Z", fill: "#FFC93C", stroke: INK, "stroke-width": 4 }, sg); }
    K.txt(g, 0, 70, text, 52, "#555"); return g; };
  W.stamp = (p, { x, y, s = 1, k = 1, text = "FIRED", rot = -12, col = "#E5484D" }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * (2 - k)})`, opacity: clamp(k * 1.5) }, p);
    el("rect", { x: -text.length * 40 - 40, y: -80, width: text.length * 80 + 80, height: 160, rx: 20, fill: "rgba(255,255,255,.4)", stroke: col, "stroke-width": 14 }, g); K.txt(g, 0, 40, text, 120, col); return g; };
  W.chest = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -110, y: -90, width: 220, height: 90, rx: 8, fill: "#8A5A3A", stroke: INK, "stroke-width": 6 }, g); el("path", { d: "M-110,-90 Q0,-170 110,-90 Z", fill: "#A8754A", stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -24, y: -80, width: 48, height: 50, rx: 8, fill: "#F2C14E", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-14,-80 L-14,-104 Q0,-124 14,-104 L14,-80", fill: "none", stroke: INK, "stroke-width": 6 }, g); return g; };
  W.timer = (p, { x, y, s = 1, v = "60:00" }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -150, y: -60, width: 300, height: 120, rx: 18, fill: "#120E18", stroke: "#FF3D3D", "stroke-width": 7 }, g); K.txt(g, 0, 26, v, 76, "#FF3D3D"); return g; };
  W.calendar = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -100, y: -110, width: 200, height: 220, rx: 14, fill: WH, stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -100, y: -110, width: 200, height: 60, rx: 14, fill: "#E5484D", stroke: INK, "stroke-width": 6 }, g);
    K.txt(g, 0, -66, "FRIDAY", 36, WH); K.txt(g, 0, 50, "9PM", 76, INK); return g; };
  W.repos = (p, { x, y, s = 1, k = 1, stage = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -460, y: -300, width: 920, height: 600, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    W.boris(g, { x: 0, y: -40, s: 0.42, t, mood: "proud" }); K.txt(g, 0, -230, "SAME GHOST", 50, "#7A5AA6");
    if (stage > 0) { K.arrow(g, { x1: -100, y1: 40, x2: -280, y2: 140, k: 1, color: "#999" }); K.txt(g, -250, 220, "FAMILIES: meh", 40, "#999"); }
    if (stage > 1) { K.arrow(g, { x1: 100, y1: 40, x2: 280, y2: 140, k: 1, color: "#E9A23B" }); K.txt(g, 250, 220, "TEENS: ₹₹₹!", 40, "#E9A23B"); }
    return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 9 · HAUNTED MANSION · \"This ghost was fired from haunting\" — cast & props", 42);
    [["meek", 0, "Boris: 'boo...?'"], ["sad", 0, "Boris: fired"], ["boo", 1, "Boris: BOO!"], ["proud", 0.4, "Boris: sold out"]].forEach(([m, a, n], i) => { W.boris(s, { x: 230 + i * 330, y: 420, s: 0.62, mood: m, arms: a, t: 0.3, box: i === 1 ? 1 : 0 }); lab(230 + i * 330, 680, n); });
    W.raven(s, { x: 1600, y: 500, s: 1.2, point: 1 }); lab(1600, 680, "the Raven (boss)");
    Person.draw(s, Object.assign({ x: 1900, y: 640, s: 0.6 }, W.ZOE, F.deadpan)); lab(1900, 690, "Zoe");
    Person.draw(s, Object.assign({ x: 2200, y: 640, s: 0.6 }, W.KABIR, F.shout)); lab(2200, 690, "Kabir");
    const box = (x, y, w, h, id, fn, label) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s);
      fn(el("g", { transform: `translate(${x} ${y}) scale(0.6) translate(0 -300)` }, g)); lab(x + w / 2, y + h + 40, label); };
    box(60, 780, 1100, 820, "a", (g) => { W.hall(g, { t: 0.2 }); W.candles(g, { x: 540, y: 1250, t: 0.2 }); W.boris(g, { x: 380, y: 1150, s: 0.9, t: 0.2 }); W.sofa(g, {}); }, "the hallway");
    box(1240, 780, 1100, 820, "b", (g) => { W.hall(g, { t: 0.2, neon: 1, dark: 1 }); W.timer(g, { x: 540, y: 1180 }); W.chest(g, { x: 880, y: 1400 }); W.sofa(g, {}); }, "escape-room mode");
    W.review(s, { x: 400, y: 1900, s: 0.8 }); W.stamp(s, { x: 1050, y: 1900, s: 0.6 }); W.stamp(s, { x: 1600, y: 1900, s: 0.6, text: "SOLD OUT", col: "#3FB8AF", rot: 8 }); W.calendar(s, { x: 2100, y: 1900, s: 0.9 }); lab(1250, 2060, "review / stamps / calendar");
    W.repos(s, { x: 1200, y: 2400, s: 0.5, stage: 2, t: 0.2 }); lab(1200, 2580, "same ghost, new customer");
  };
  root.World = W;
})(window);
