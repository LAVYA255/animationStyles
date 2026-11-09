/* world.js — Dystopia 2087 ("In 2087 you pay with your attention"). Cast: Nova; the City (a cheerful screen with a face).
   Set: a smoggy night skyline of towers with giant ad screens and drones; warms to a sunrise once Nova switches off
   (sat 0 -> 1); a balcony rail (foreground). Props: phone (glowing / dark), notification cards, the 30-second-ad coffee,
   the attention-balance meter, books, a little gadget she builds, her own stall sign. Original designs. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  W.NOVA = { hairStyle: "bob", hair: "#6A4C93", skin: "#E8B896", outfit: "hoodie", cloth: "#3A3F4B", cloth2: "#2A2E37", blush: 0.4 };
  const ADS = ["SCROLL", "LIKE!", "BUY", "WOW!", "MORE", "OMG", "SALE"];

  W.city = (p, { sat = 0, t = 0, ads = 1 }) => { const g = el("g", {}, p);
    const id = "cg" + Math.round(sat * 100), d = el("defs", {}, g), lg = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
    el("stop", { offset: "0", "stop-color": lerpC("#2B2440", "#7FB8E8", sat) }, lg); el("stop", { offset: "0.7", "stop-color": lerpC("#5A4A6E", "#FFD9A0", sat) }, lg);
    el("stop", { offset: "1", "stop-color": lerpC("#7A6A86", "#FFB878", sat) }, lg);
    el("rect", { x: -700, y: -700, width: 2500, height: 2800, fill: `url(#${id})` }, g);
    if (sat > 0) el("circle", { cx: 800, cy: 1180 - 260 * sat, r: 120, fill: "#FFE07A", stroke: INK, "stroke-width": 6, opacity: sat }, g);
    const towers = [[-380, 360, 220], [-120, 560, 200], [120, 300, 240], [400, 480, 190], [640, 260, 230], [900, 520, 210], [1150, 380, 240], [1400, 600, 200]];
    towers.forEach(([x, top, wd], i) => { const col = lerpC("#3B3350", "#9A8FB0", sat * 0.6);
      el("rect", { x, y: top, width: wd, height: 1600, fill: col, stroke: INK, "stroke-width": 6 }, g);
      for (let r = 0; r < 14; r++) for (let c = 0; c < 4; c++) { const on = ((i * 7 + r * 3 + c * 5) % 4) !== 0; el("rect", { x: x + 20 + c * (wd - 40) / 4, y: top + 40 + r * 60, width: (wd - 40) / 4 - 12, height: 30, fill: on ? lerpC("#FFDD7A", "#FFF3D6", sat) : lerpC("#2A2438", "#7F7798", sat), opacity: on ? 0.8 : 0.6 }, g); }
      if (i % 2 === 0 && ads > 0) { const blink = 0.6 + 0.4 * Math.sin(t * 6 + i * 2), sx = x + 14, sy = top + 120, sw = wd - 28, sh = 150;
        el("rect", { x: sx, y: sy, width: sw, height: sh, rx: 12, fill: ["#FF3D7F", "#3DDCFF", "#FFC93C", "#9D6BFF"][i % 4], stroke: INK, "stroke-width": 6, opacity: ads * blink }, g);
        K.txt(g, sx + sw / 2, sy + sh / 2 + 22, ADS[(i + Math.floor(t * 1.5)) % ADS.length], 56, WH, "middle", { opacity: ads }); } });
    // drones
    if (ads > 0) for (let i = 0; i < 4; i++) { const x = ((t * 80 + i * 400) % 1800) - 400, y = 380 + i * 120 + Math.sin(t * 2 + i) * 20;
      el("rect", { x: x - 30, y: y - 10, width: 60, height: 20, rx: 8, fill: "#2A2E37", stroke: INK, "stroke-width": 4, opacity: ads }, g);
      el("circle", { cx: x, cy: y + 16, r: 6, fill: Math.sin(t * 10 + i) > 0 ? "#FF3D3D" : "#661111", opacity: ads }, g); }
    // smog bands
    for (let i = 0; i < 3; i++) el("path", { d: `M-700,${900 + i * 160} Q200,${860 + i * 160 + Math.sin(t + i) * 20} 1800,${920 + i * 160} L1800,${980 + i * 160} L-700,${980 + i * 160} Z`, fill: lerpC("#8A7C99", "#FFFFFF", sat), opacity: 0.25 * (1 - sat * 0.7) }, g);
    return g; };
  W.rail = (p, { y = 1405, sat = 0, planters = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 30, width: 1900, height: 900, fill: lerpC("#4A4560", "#C9B79C", sat), stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 24; i++) el("line", { x1: -380 + i * 80, y1: y + 30, x2: -380 + i * 80, y2: y + 400, stroke: lerpC("#35314A", "#A8957A", sat), "stroke-width": 10 }, g);
    el("rect", { x: -420, y, width: 1940, height: 40, rx: 12, fill: lerpC("#6E6A86", "#E4D3B6", sat), stroke: INK, "stroke-width": 8 }, g);
    if (planters > 0) for (const [x, c] of [[80, "#7FB35A"], [990, "#5FA05A"]]) { const s = planters; el("rect", { x: x - 70 * s, y: y - 90 * s, width: 140 * s, height: 90 * s, rx: 10, fill: "#C46B3E", stroke: INK, "stroke-width": 6 }, g);
      for (let l = 0; l < 5; l++) el("ellipse", { cx: x + (l - 2) * 26 * s, cy: y - 110 * s - (l % 2) * 30 * s, rx: 22 * s, ry: 40 * s, fill: c, stroke: INK, "stroke-width": 5, transform: `rotate(${(l - 2) * 14} ${x + (l - 2) * 26 * s} ${y - 110 * s})` }, g); }
    return g; };
  // the City: a cheerful screen with a face. glitch 0..1, text under the face
  W.screen = (p, { x, y, s = 1, k = 1, glitch = 0, text = "", t = 0, mood = "smile" }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -260, y: -190, width: 520, height: 380, rx: 36, fill: "#20303A", stroke: INK, "stroke-width": 10 }, g);
    el("rect", { x: -230, y: -160, width: 460, height: 320, rx: 26, fill: "#2FD3C9" }, g);
    const j = glitch ? Math.sin(t * 50) * 14 * glitch : 0, fg = el("g", { transform: `translate(${j} 0)` }, g);
    for (const sd of [-1, 1]) { if (mood === "panic") el("ellipse", { cx: sd * 90, cy: -40, rx: 34, ry: 44, fill: WH, stroke: INK, "stroke-width": 6 }, fg); el("circle", { cx: sd * 90, cy: -40, r: mood === "panic" ? 14 : 26, fill: INK }, fg); }
    if (mood === "panic") el("path", { d: "M-80,70 q20,-20 40,0 t40,0 t40,0 t40,0", fill: "none", stroke: INK, "stroke-width": 10, "stroke-linecap": "round" }, fg);
    else el("path", { d: "M-110,40 Q0,130 110,40", fill: "none", stroke: INK, "stroke-width": 14, "stroke-linecap": "round" }, fg);
    if (glitch > 0) for (let i = 0; i < 5; i++) { const yy = -150 + ((t * 700 + i * 90) % 300); el("rect", { x: -230, y: yy, width: 460, height: 14 + i * 3, fill: ["#FF3D7F", "#3DDCFF", "#FFF"][i % 3], opacity: 0.7 * glitch }, g); }
    if (text) { el("rect", { x: -200, y: 200, width: 400, height: 80, rx: 16, fill: WH, stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, 254, text, 44, INK); }
    for (const sd of [-1, 1]) el("line", { x1: sd * 160, y1: -190, x2: sd * 200, y2: -320, stroke: INK, "stroke-width": 8 }, g);
    return g; };
  W.phone = (p, { x, y, s = 1, rot = 0, on = 1, t = 0, off = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    if (on > 0) el("ellipse", { cx: 0, cy: -60, rx: 150, ry: 120, fill: "#7DE8FF", opacity: 0.25 * on }, g);
    el("rect", { x: -62, y: -120, width: 124, height: 230, rx: 18, fill: "#20242C", stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -52, y: -106, width: 104, height: 200, rx: 10, fill: on > 0 ? lerpC("#0E1116", "#9BEFFF", on) : "#0E1116" }, g);
    if (on > 0.5) for (let i = 0; i < 4; i++) el("rect", { x: -42, y: -94 + ((i * 50 + t * 160) % 200), width: 84, height: 34, rx: 6, fill: "#FFFFFF", opacity: 0.8 }, g);
    if (off > 0) K.txt(g, 0, 10, "OFF", 34, "#7CE38B", "middle", { opacity: off }); return g; };
  W.notif = (p, { x, y, k = 1, text = "PING!", rot = 0, red = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${k})` }, p), w = 80 + text.length * 22;
    el("rect", { x: -w / 2, y: -44, width: w, height: 88, rx: 22, fill: WH, stroke: INK, "stroke-width": 6 }, g);
    el("circle", { cx: -w / 2 + 40, cy: 0, r: 22, fill: red ? "#FF3D3D" : "#3DDCFF", stroke: INK, "stroke-width": 4 }, g); K.txt(g, -w / 2 + 40, 11, "!", 32, WH);
    K.txt(g, 20, 13, text, 34, INK); return g; };
  W.coffee = (p, { x, y, s = 1, timer = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-60,-140 L60,-140 L50,0 L-50,0 Z", fill: WH, stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g);
    el("rect", { x: -66, y: -156, width: 132, height: 24, rx: 8, fill: "#6B4A2E", stroke: INK, "stroke-width": 6 }, g); el("rect", { x: -60, y: -96, width: 120, height: 34, fill: "#FF3D7F" }, g);
    K.txt(g, 0, -70, "AD", 28, WH);
    const r = 70, a = timer * Math.PI * 2; el("circle", { cx: 0, cy: -260, r, fill: WH, stroke: INK, "stroke-width": 6 }, g);
    if (timer > 0) el("path", { d: `M0,-260 L0,${-260 - r} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${Math.sin(a) * r},${-260 - Math.cos(a) * r} Z`, fill: "#FF3D7F" }, g);
    K.txt(g, 0, -250, Math.max(0, Math.ceil(30 * (1 - timer))) + "s", 40, INK); return g; };
  W.meter = (p, { x, y, s = 1, v = 1, label = "ATTENTION", k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -230, y: -60, width: 460, height: 120, rx: 26, fill: WH, stroke: INK, "stroke-width": 7 }, g);
    el("rect", { x: -200, y: -10, width: 400, height: 46, rx: 12, fill: "#EEE", stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: -196, y: -6, width: 392 * clamp(v), height: 38, rx: 10, fill: v > 0.3 ? "#3FB8AF" : "#FF3D3D" }, g);
    K.txt(g, -200, -22, label, 30, "#555", "start"); return g; };
  W.books = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    [["#E5484D", 0], ["#3FB8AF", -8], ["#F2C14E", 6]].forEach(([c, r], i) => el("rect", { x: -90, y: -50 - i * 46, width: 180, height: 40, rx: 6, fill: c, stroke: INK, "stroke-width": 5, transform: `rotate(${r} 0 ${-30 - i * 46})` }, g)); return g; };
  W.gadget = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("rect", { x: -80, y: -110, width: 160, height: 110, rx: 14, fill: "#C9D3DE", stroke: INK, "stroke-width": 6 }, g);
    for (const sd of [-1, 1]) el("circle", { cx: sd * 40, cy: -60, r: 16, fill: "#3FB8AF", stroke: INK, "stroke-width": 4 }, g);
    el("line", { x1: 0, y1: -110, x2: 0, y2: -160, stroke: INK, "stroke-width": 6 }, g); el("circle", { cx: 0, cy: -166, r: 12, fill: Math.sin(t * 6) > 0 ? "#FF3D3D" : "#FFC93C", stroke: INK, "stroke-width": 4 }, g); return g; };
  W.stall = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    for (let i = 0; i < 6; i++) el("path", { d: `M${-210 + i * 70},-260 L${-140 + i * 70},-260 L${-140 + i * 70},-200 Q${-175 + i * 70},-170 ${-210 + i * 70},-200 Z`, fill: i % 2 ? WH : "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    el("rect", { x: -200, y: -200, width: 400, height: 90, rx: 10, fill: "#F2C14E", stroke: INK, "stroke-width": 6 }, g); K.txt(g, 0, -140, "NOVA'S", 56, INK); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 4 · DYSTOPIA 2087 · \"In 2087 you pay with your attention\" — cast & props", 44);
    [["Nova: scrolling", { tired: 1, eyes: "half", lid: 0.5, mouth: "flat", look: [0, 0.8] }], ["Nova: overwhelmed", F.worried], ["Nova: decides", F.angry], ["Nova: free", F.happy]].forEach(([n, face], i) => {
      const x = 200 + i * 360, y = 640; Person.draw(s, Object.assign({ x, y, s: 0.7 }, W.NOVA, face)); lab(x, y + 50, n); });
    W.screen(s, { x: 1700, y: 420, s: 0.55, text: "BALANCE: 0" }); W.screen(s, { x: 2150, y: 420, s: 0.55, glitch: 1, t: 0.3, mood: "panic" }); lab(1925, 680, "the City: cheerful / glitching");
    const box = (x, y, w, h, id, fn, label) => { const cp = el("clipPath", { id }, s); el("rect", { x, y, width: w, height: h, rx: 16 }, cp); const g = el("g", { "clip-path": `url(#${id})` }, s); el("rect", { x, y, width: w, height: h, rx: 16, fill: "none", stroke: "#999", "stroke-width": 3 }, s);
      fn(el("g", { transform: `translate(${x} ${y}) scale(0.62) translate(0 -250)` }, g)); lab(x + w / 2, y + h + 40, label); };
    box(60, 760, 1100, 860, "a", (g) => { W.city(g, { sat: 0, t: 0.4 }); W.rail(g, {}); }, "2087: ads everywhere");
    box(1240, 760, 1100, 860, "b", (g) => { W.city(g, { sat: 1, t: 0.4, ads: 0 }); W.rail(g, { sat: 1, planters: 1 }); }, "after switching off");
    W.phone(s, { x: 180, y: 2000, t: 0.3 }); W.phone(s, { x: 380, y: 2000, on: 0, off: 1 }); lab(280, 2160, "phone: on / OFF");
    W.notif(s, { x: 700, y: 1880, text: "PING!" }); W.notif(s, { x: 760, y: 1990, text: "You won't believe this" , rot: -4 }); W.notif(s, { x: 700, y: 2100, text: "BUZZ", rot: 5 }); lab(760, 2180, "notifications");
    W.coffee(s, { x: 1180, y: 2120, s: 0.8, timer: 0.4 }); lab(1180, 2180, "30-second-ad coffee");
    W.meter(s, { x: 1600, y: 1950, s: 0.8, v: 0.1 }); lab(1600, 2050, "attention balance");
    W.books(s, { x: 1950, y: 2100, s: 0.8 }); W.gadget(s, { x: 2200, y: 2100, s: 0.8, t: 0.2 }); lab(2080, 2160, "she read / she built");
    W.stall(s, { x: 600, y: 2600, s: 0.8 }); lab(600, 2640, "her own thing");
  };
  root.World = W;
})(window);
