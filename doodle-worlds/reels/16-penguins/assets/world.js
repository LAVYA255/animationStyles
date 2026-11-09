/* world.js — Arctic ("She tried to sell ice to penguins"). Cast (original penguin rig): Pemmy (pink scarf, lashes, bow:
   the founder), Grump (old penguin: bushy white brows, tiny bowler hat, cane), plain penguins (crowd). Set: arctic sky
   (aurora at night), icebergs, sea strip, snow field; Pemmy's ice-block stall with a sign (ICE -> SOCKS). Props: ice cube
   with umbrella, ice swan, PREMIUM tag, SUBSCRIBE sign, clipboard, question bubble, wool socks, SOLD OUT banner, sales
   counter, the pitch-vs-ask card, a rolling snowball. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, ICE = "#CFEFF8", ICE2 = "#9FD8EA";
  W.arctic = (p, { t = 0, night = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#BFE6F5", "#1B2447", night) }, g);
    if (night > 0.2) for (let i = 0; i < 3; i++) el("path", { d: `M-200,${360 + i * 60} Q300,${220 + i * 50 + Math.sin(t + i) * 30} 700,${360 + i * 40} T1500,${330 + i * 60}`, fill: "none", stroke: ["#5FE3B0", "#7FD8F0", "#B98AF0"][i], "stroke-width": 40, opacity: 0.35 * night, "stroke-linecap": "round" }, g);
    if (night < 0.5) el("circle", { cx: 880, cy: 300, r: 70, fill: "#FFF3B0", stroke: INK, "stroke-width": 6, opacity: 1 - night * 2 }, g);
    for (const [x, w0, h] of [[-300, 520, 360], [260, 380, 260], [700, 600, 420]]) el("path", { d: `M${x},1080 L${x + w0 * 0.3},${1080 - h} L${x + w0 * 0.55},${1080 - h * 0.8} L${x + w0 * 0.75},${1080 - h * 0.95} L${x + w0},1080 Z`, fill: lerpC(WH, "#8FA3C8", night), stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -700, y: 1060, width: 2600, height: 90, fill: lerpC("#3F93C9", "#1F3A6A", night), stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: -100 + i * 380 + Math.sin(t * 0.6 + i) * 20, cy: 1105, rx: 70, ry: 16, fill: WH, stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-700,1150 Q0,1110 600,1150 T1900,1140 L1900,2800 L-700,2800 Z", fill: lerpC("#F4FAFD", "#B7C4DE", night), stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 16; i++) { const r = MK.rng(i + 4); el("path", { d: `M${-200 + r() * 1500},${1250 + r() * 700} q30,-12 60,0`, fill: "none", stroke: ICE2, "stroke-width": 5 }, g); }
    return g; };
  // a penguin, origin at its feet. kind: pemmy | grump | plain. face: happy | flat | shock | angry | sad | squint
  W.penguin = (p, { x, y, s = 1, t = 0, kind = "plain", face = "happy", talk = 0, flap = 0, socks = 0, look = 0, shiver = 0, hold = null, palm = 0, tone = 0, flip = 1, hop = 0 }) => {
    const sv = shiver ? Math.sin(t * 50) * 4 * shiver : 0, hy = hop ? -Math.abs(Math.sin(t * 8 + x)) * 24 : 0;
    const g = el("g", { transform: `translate(${x + sv} ${y + hy}) scale(${s * flip} ${s})` }, p), B = ["#22262E", "#2E3440", "#353B47"][tone % 3];
    // feet (+ socks)
    for (const fx of [-40, 40]) { el("path", { d: `M${fx - 30},0 Q${fx},-26 ${fx + 32},0 Z`, fill: "#F28C28", stroke: INK, "stroke-width": 5 }, g);
      if (socks > 0) { const sg = el("g", { transform: `translate(${fx} 0) scale(${socks})` }, g); el("path", { d: "M-30,0 Q-32,-46 -10,-50 L14,-50 Q32,-40 32,0 Z", fill: "#E5484D", stroke: INK, "stroke-width": 5 }, sg);
        for (let i = 0; i < 2; i++) el("line", { x1: -28, y1: -14 - i * 16, x2: 30, y2: -14 - i * 16, stroke: WH, "stroke-width": 6 }, sg); } }
    if (shiver > 0.5 && socks < 0.5) for (const fx of [-40, 40]) el("path", { d: `M${fx - 20},-4 l8,-10 l8,10 l8,-10`, fill: "none", stroke: "#7FD8F0", "stroke-width": 4 }, g);
    // body
    el("path", { d: "M-110,-30 Q-140,-250 0,-300 Q140,-250 110,-30 Q0,10 -110,-30 Z", fill: B, stroke: INK, "stroke-width": 7 }, g);
    el("path", { d: "M-70,-34 Q-90,-210 0,-236 Q90,-210 70,-34 Q0,-6 -70,-34 Z", fill: "#FBFBF8" }, g);
    // flippers
    const fa = flap ? Math.sin(t * 16) * 30 : 0, pa = palm * 1;
    el("path", { d: `M-100,-210 Q${-170 - fa * 0.3},${-150 - fa} ${-130},${-90 - fa}`, fill: "none", stroke: B, "stroke-width": 34, "stroke-linecap": "round" }, g);
    if (palm > 0) el("path", { d: `M100,-210 Q${150 - pa * 60},${-250 - pa * 40} ${110 - pa * 100},${-300}`, fill: "none", stroke: B, "stroke-width": 34, "stroke-linecap": "round" }, g);
    else el("path", { d: `M100,-210 Q${170 + fa * 0.3},${-150 - (hold ? 60 : -fa)} ${130},${-90 - (hold ? 90 : -fa)}`, fill: "none", stroke: B, "stroke-width": 34, "stroke-linecap": "round" }, g);
    // head
    const hg = el("g", { transform: `translate(${look * 10} -300)` }, g);
    el("ellipse", { cx: 0, cy: -10, rx: 92, ry: 80, fill: B, stroke: INK, "stroke-width": 7 }, hg);
    el("path", { d: "M-62,-6 Q-60,-62 -14,-46 Q0,-36 14,-46 Q60,-62 62,-6 Q40,44 0,48 Q-40,44 -62,-6 Z", fill: "#FBFBF8" }, hg);
    const ey = -12;
    for (const sx of [-1, 1]) { const ex = sx * 28 + look * 6;
      if (face === "happy") el("path", { d: `M${ex - 13},${ey + 4} q13,-16 26,0`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg);
      else if (face === "squint" || face === "flat" || face === "angry") { el("circle", { cx: ex, cy: ey, r: 11, fill: INK }, hg); el("rect", { x: ex - 16, y: ey - 18, width: 32, height: face === "flat" ? 12 : 9, fill: "#FBFBF8" }, hg); }
      else { el("circle", { cx: ex, cy: ey, r: face === "shock" ? 14 : 11, fill: INK }, hg); el("circle", { cx: ex + 4, cy: ey - 4, r: 4, fill: WH }, hg); }
      if (face === "angry") el("path", { d: `M${ex - sx * 20},${ey - 30} L${ex + sx * 16},${ey - 18}`, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, hg);
      if (face === "sad") el("path", { d: `M${ex - sx * 18},${ey - 20} L${ex + sx * 14},${ey - 30}`, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg); }
    const op = talk * 18;
    el("path", { d: `M-24,10 Q0,0 24,10 L0,${32 + op * 0.4} Z`, fill: "#F28C28", stroke: INK, "stroke-width": 5 }, hg);
    if (op > 4) el("path", { d: `M-20,16 Q0,${20 + op} 20,16`, fill: "#C0392B", stroke: INK, "stroke-width": 3 }, hg);
    el("ellipse", { cx: -50, cy: 14, rx: 14, ry: 8, fill: "#FF9FB3", opacity: 0.6 }, hg); el("ellipse", { cx: 50, cy: 14, rx: 14, ry: 8, fill: "#FF9FB3", opacity: 0.6 }, hg);
    if (kind === "pemmy") { for (const sx of [-1, 1]) el("path", { d: `M${sx * 28 - 14},${ey - 12} l-6,-10 M${sx * 28},${ey - 15} l0,-11 M${sx * 28 + 14},${ey - 12} l6,-10`, stroke: INK, "stroke-width": 3.5, "stroke-linecap": "round" }, hg);
      el("path", { d: "M30,-84 q-10,-26 12,-30 q4,16 12,4 q18,-4 14,18 q-12,12 -38,8 Z", fill: "#FF8FB1", stroke: INK, "stroke-width": 4 }, hg);
      el("path", { d: "M-84,-250 Q0,-210 84,-250 L80,-224 Q0,-186 -80,-224 Z", fill: "#FF6F91", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M50,-226 L70,-150 L40,-150 Z", fill: "#FF6F91", stroke: INK, "stroke-width": 5 }, g); }
    if (kind === "grump") { for (const sx of [-1, 1]) el("path", { d: `M${sx * 10},${ey - 26} q${sx * 24},-22 ${sx * 50},-6 q${-sx * 10},4 ${-sx * 4},10`, fill: WH, stroke: INK, "stroke-width": 4 }, hg);
      el("path", { d: "M-46,-74 Q0,-96 46,-74 L44,-62 Q0,-80 -44,-62 Z", fill: "#3A2E26", stroke: INK, "stroke-width": 4 }, hg); el("path", { d: "M-34,-66 Q-30,-120 0,-122 Q30,-120 34,-66 Z", fill: "#3A2E26", stroke: INK, "stroke-width": 5 }, hg);
      el("path", { d: "M-150,-90 L-150,0 M-150,-90 q0,-26 24,-22", fill: "none", stroke: "#8A5A3A", "stroke-width": 10, "stroke-linecap": "round" }, g); }
    if (palm > 0) { const d = `M100,-210 Q${150 - pa * 60},${-250 - pa * 40} ${110 - pa * 100},${-300}`; // facepalm: flipper over the face
      el("path", { d, fill: "none", stroke: INK, "stroke-width": 44, "stroke-linecap": "round" }, g); el("path", { d, fill: "none", stroke: B, "stroke-width": 34, "stroke-linecap": "round" }, g); }
    return g; };
  W.stall = (p, { x = 760, y = 1380, sign = "ICE", t = 0, soldout = 0 }) => { const g = el("g", { transform: `translate(${x} ${y})` }, p);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) el("rect", { x: -230 + c * 115, y: r * 105, width: 112, height: 102, rx: 8, fill: r ? ICE2 : ICE, stroke: INK, "stroke-width": 5, opacity: 0.95 }, g);
    K.sign(g, { x: 0, y: 150, s: 0.9, text: "PEMMY'S " + sign, w: 470, h: 100, size: 52, fill: sign === "ICE" ? ICE : "#FFD6E0", hang: 0, rot: -2 });
    if (soldout > 0) { const sg = el("g", { transform: `translate(0 40) rotate(-8) scale(${soldout})` }, g); el("rect", { x: -230, y: -50, width: 460, height: 100, rx: 14, fill: "#E5484D", stroke: INK, "stroke-width": 7 }, sg); K.txt(sg, 0, 22, "SOLD OUT", 66, WH); }
    return g; };
  W.cube = (p, { x, y, s = 1, k = 1, umbrella = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("path", { d: "M-50,0 L-50,-90 L30,-110 L60,-80 L60,10 L-20,24 Z", fill: ICE, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-50,-90 L-20,-66 L60,-80 M-20,-66 L-20,24", fill: "none", stroke: ICE2, "stroke-width": 4 }, g);
    if (umbrella) { el("line", { x1: 10, y1: -100, x2: 30, y2: -190, stroke: INK, "stroke-width": 4 }, g); el("path", { d: "M-30,-180 Q30,-240 90,-190 Z", fill: "#FF6F91", stroke: INK, "stroke-width": 4 }, g); }
    return g; };
  W.swan = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("path", { d: "M-90,0 Q-110,-70 -20,-70 Q40,-70 70,-30 L80,0 Z", fill: ICE, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M40,-50 Q30,-150 70,-170 Q100,-170 92,-140", fill: "none", stroke: INK, "stroke-width": 26, "stroke-linecap": "round" }, g);
    el("path", { d: "M40,-50 Q30,-150 70,-170 Q100,-170 92,-140", fill: "none", stroke: ICE, "stroke-width": 16, "stroke-linecap": "round" }, g); return g; };
  W.sock = (p, { x, y, s = 1, k = 1, rot = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, p);
    el("path", { d: "M-24,-90 L22,-90 L22,-20 Q60,-14 60,14 Q60,30 30,30 L-24,30 Z", fill: "#E5484D", stroke: INK, "stroke-width": 5 }, g);
    for (let i = 0; i < 3; i++) el("line", { x1: -22, y1: -74 + i * 22, x2: 20, y2: -74 + i * 22, stroke: WH, "stroke-width": 7 }, g); return g; };
  W.clipboard = (p, { x, y, s = 1, k = 1 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(-8) scale(${s * k})` }, p);
    el("rect", { x: -60, y: -80, width: 120, height: 160, rx: 10, fill: "#C9935E", stroke: INK, "stroke-width": 5 }, g); el("rect", { x: -48, y: -66, width: 96, height: 136, fill: WH }, g);
    el("rect", { x: -24, y: -90, width: 48, height: 22, rx: 6, fill: "#9AA0A6", stroke: INK, "stroke-width": 4 }, g);
    for (let i = 0; i < 4; i++) el("line", { x1: -38, y1: -40 + i * 26, x2: 38, y2: -40 + i * 26, stroke: "#9AA0A6", "stroke-width": 4 }, g); return g; };
  W.snowball = (p, { x, y, s = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${t * 400}) scale(${s})` }, p);
    el("circle", { cx: 0, cy: 0, r: 40, fill: WH, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M-20,-10 q10,-12 24,-4 M0,14 q12,4 18,-6", fill: "none", stroke: ICE2, "stroke-width": 4 }, g); return g; };
  W.askCard = (p, { x, y, s = 1, k = 1, ask = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -300, width: 880, height: 600, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    K.txt(g, 0, -220, "CUSTOMER DISCOVERY", 52, "#3F93C9");
    el("rect", { x: -380, y: -150, width: 760, height: 150, rx: 22, fill: "#FFE3E3", stroke: "#E5484D", "stroke-width": 6 }, g); K.txt(g, -330, -55, "✗", 70, "#E5484D", "start"); K.txt(g, 40, -58, "“Would you buy my ice?”", 46, "#B03A3A");
    if (ask > 0) { const ag = el("g", { opacity: ask }, g); el("rect", { x: -380, y: 40, width: 760, height: 150, rx: 22, fill: "#E3F7EE", stroke: "#24857E", "stroke-width": 6 }, ag); K.txt(ag, -330, 135, "✓", 70, "#24857E", "start");
      K.txt(ag, 40, 105, "“What's your biggest", 44, "#1F6E56"); K.txt(ag, 40, 160, "problem right now?”", 44, "#1F6E56"); }
    return g; };

  W.sheet = (s) => {
    window.FONT = "Fredoka One"; const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555");
    lab(1200, 64, "WORLD 16 · ARCTIC · \"She tried to sell ice to penguins\" — cast & props", 42);
    [["Pemmy", { kind: "pemmy", face: "happy" }], ["Pemmy: pitch", { kind: "pemmy", face: "open", talk: 1, hold: 1 }], ["Grump", { kind: "grump", face: "flat" }], ["Grump: freezing", { kind: "grump", face: "angry", shiver: 1 }], ["Grump: socks!", { kind: "grump", face: "happy", socks: 1 }], ["crowd", { tone: 1, face: "open" }]].forEach(([n, o], i) => {
      const x = 200 + i * 380; W.penguin(s, Object.assign({ x, y: 640, s: 1, t: 0.2 }, o)); lab(x, 690, n); });
    const cp = el("clipPath", { id: "ar" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#ar)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -500)" }, dg);
    W.arctic(sg, { t: 0.3 }); W.penguin(sg, { x: 760, y: 1500, s: 1.25, kind: "pemmy" }); W.stall(sg, {}); W.cube(sg, { x: 640, y: 1380 }); W.swan(sg, { x: 860, y: 1380 });
    W.penguin(sg, { x: 300, y: 1680, s: 1.2, kind: "grump", face: "flat" }); W.penguin(sg, { x: 110, y: 1600, s: 1, tone: 1, face: "flat" }); lab(610, 1700, "the ice stall (day)");
    const cp2 = el("clipPath", { id: "ar2" }, s); el("rect", { x: 1240, y: 760, width: 1100, height: 900, rx: 16 }, cp2);
    const dg2 = el("g", { "clip-path": "url(#ar2)" }, s), sg2 = el("g", { transform: "translate(1240 760) scale(0.62) translate(0 -500)" }, dg2);
    W.arctic(sg2, { t: 0.3, night: 1 }); W.penguin(sg2, { x: 760, y: 1500, s: 1.25, kind: "pemmy" }); W.stall(sg2, { sign: "SOCKS", soldout: 1 });
    [100, 300, 480].forEach((x, i) => W.penguin(sg2, { x, y: 1680, s: 1.1, kind: i === 1 ? "grump" : "plain", face: "happy", socks: 1, tone: i })); lab(1790, 1700, "socks: sold out (night)");
    W.cube(s, { x: 300, y: 1950 }); W.swan(s, { x: 520, y: 1950 }); W.sock(s, { x: 720, y: 1950 }); W.clipboard(s, { x: 900, y: 1900 }); W.snowball(s, { x: 1080, y: 1910 }); lab(690, 2020, "cube / swan / sock / clipboard / snowball");
    W.askCard(s, { x: 1750, y: 2150, s: 0.55, ask: 1 }); lab(1750, 2340, "pitch vs ask card");
  };
  root.World = W;
})(window);
