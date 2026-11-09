/* world.js — Forest ("Why does everything cost 99?", animal economics). Cast (original critter rig): Hazel the squirrel
   (shopkeeper, green apron), Nutmeg the chipmunk (customer, stripes, stuffable cheeks). Set: forest clearing, dappled light,
   a tree-stump counter (foreground), a price board hanging from a branch (100 -> 99 flip). Props: acorn baskets, acorns,
   coins, IOU note, woodland queue (rabbits, a hedgehog), price tags, the left-to-right digits card. Clean marker style. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {};
  // ---- the critter rig (waist-up behind the stump; origin = waist)
  const CDEF = { x: 0, y: 0, s: 1, sx: 1, sy: 1, rot: 0, kind: "squirrel", fur: "#C46A2E", belly: "#F3D3A8", look: [0, 0], eyes: "open", lid: 0, brow: { l: 0, r: 0 }, browUp: 0,
    mouth: "smile", open: 0.5, cheeks: 0, armL: { x: -120, y: -40 }, armR: { x: 120, y: -40 }, t: 0, blush: 0.5, sweat: 0, apron: 0, headTilt: 0 };
  W.critter = (p, c0) => {
    const C = Object.assign({}, CDEF, c0); C.brow = Object.assign({ l: 0, r: 0 }, c0.brow || {});
    const g = el("g", { transform: `translate(${C.x} ${C.y}) rotate(${C.rot}) scale(${C.s * C.sx} ${C.s * C.sy})` }, p);
    const sq = C.kind === "squirrel", F = C.fur, FD = Person.shade(F, 0.25), B = C.belly;
    // tail (behind)
    const sw = Math.sin(C.t * 2.2) * 14;
    if (sq) el("path", { d: `M90,-40 C220,-60 ${260 + sw},-260 ${190 + sw},-420 C${150 + sw},-500 ${60 + sw},-480 ${70 + sw},-400 C${130 + sw},-380 ${150 + sw},-250 60,-150 Z`, fill: F, stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g);
    else el("path", { d: `M80,-40 C170,-60 ${190 + sw},-200 ${150 + sw},-300 C${130 + sw},-330 ${100 + sw},-320 ${110 + sw},-280 C${140 + sw},-210 120,-120 60,-110 Z`, fill: F, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    if (sq) el("path", { d: `M${150 + sw},-330 Q${200 + sw},-300 ${190 + sw},-250`, fill: "none", stroke: Person.tint(F, 0.3), "stroke-width": 10, "stroke-linecap": "round" }, g);
    // body
    el("path", { d: "M-130,0 Q-150,-150 -70,-200 L70,-200 Q150,-150 130,0 Z", fill: F, stroke: INK, "stroke-width": 7, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-80,0 Q-90,-120 -40,-170 L40,-170 Q90,-120 80,0 Z", fill: B }, g);
    if (!sq) el("path", { d: "M-128,-40 Q-140,-130 -90,-180", fill: "none", stroke: FD, "stroke-width": 12, "stroke-linecap": "round" }, g);
    if (C.apron) { el("path", { d: "M-95,0 L-80,-150 L80,-150 L95,0 Z", fill: "#7FB35A", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
      el("rect", { x: -40, y: -90, width: 80, height: 50, rx: 6, fill: "none", stroke: INK, "stroke-width": 4 }, g); el("path", { d: "M-80,-150 L-60,-200 M80,-150 L60,-200", stroke: "#5E8F3F", "stroke-width": 8 }, g); }
    // head
    const hg = el("g", { transform: `rotate(${C.headTilt} 0 -200)` }, g);
    for (const sd of [-1, 1]) { if (sq) { el("path", { d: `M${sd * 50},-380 L${sd * 92},-470 L${sd * 110},-370 Z`, fill: F, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, hg); el("path", { d: `M${sd * 92},-470 l${sd * 6},-26 M${sd * 92},-470 l${sd * 18},-14`, stroke: INK, "stroke-width": 5 }, hg); }
      else { el("circle", { cx: sd * 82, cy: -392, r: 32, fill: F, stroke: INK, "stroke-width": 6 }, hg); el("circle", { cx: sd * 82, cy: -392, r: 16, fill: B }, hg); } }
    el("ellipse", { cx: 0, cy: -305, rx: 116, ry: 108, fill: F, stroke: INK, "stroke-width": 7 }, hg);
    if (!sq) { el("path", { d: "M-14,-410 Q0,-330 -6,-270 M14,-410 Q0,-330 6,-270", fill: "none", stroke: FD, "stroke-width": 10, "stroke-linecap": "round" }, hg);
      for (const sd of [-1, 1]) el("path", { d: `M${sd * 100},-340 Q${sd * 60},-330 ${sd * 22},-322`, fill: "none", stroke: FD, "stroke-width": 9, "stroke-linecap": "round" }, hg); }
    const ck = C.cheeks; el("ellipse", { cx: 0, cy: -258, rx: 70 + 40 * ck, ry: 48 + 14 * ck, fill: B, stroke: INK, "stroke-width": 5 }, hg);
    if (ck > 0) for (const sd of [-1, 1]) el("circle", { cx: sd * (78 + 10 * ck), cy: -258, r: 30 * ck, fill: B, stroke: INK, "stroke-width": 5 }, hg);
    const lx = C.look[0] * 8, ly = C.look[1] * 7;
    [-1, 1].forEach((sd) => { const e = el("g", { transform: `translate(${sd * 42 + lx} ${-322 + ly})` }, hg), t = C.eyes;
      if (t === "closed") el("path", { d: "M-14,0 Q0,10 14,0", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, e);
      else if (t === "happy") el("path", { d: "M-14,6 Q0,-12 14,6", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e);
      else if (t === "wide") { el("ellipse", { cx: 0, cy: 0, rx: 17, ry: 22, fill: WH, stroke: INK, "stroke-width": 5 }, e); el("circle", { cx: lx * 0.5, cy: 2, r: 6, fill: INK }, e); }
      else if (t === "sparkle") { el("ellipse", { cx: 0, cy: 0, rx: 16, ry: 22, fill: "#7A4A2A", stroke: INK, "stroke-width": 5 }, e); el("path", { d: "M0,-12 L4,-4 L12,0 L4,4 L0,12 L-4,4 L-12,0 L-4,-4 Z", fill: WH, transform: "translate(3 -5) scale(0.8)" }, e); }
      else { const lid = t === "half" ? Math.max(0.5, C.lid) : C.lid; el("ellipse", { cx: 0, cy: 0, rx: 12, ry: 18, fill: INK }, e); el("circle", { cx: 4, cy: -7, r: 5, fill: WH }, e);
        if (lid > 0) { const h = 38 * lid; el("rect", { x: -17, y: -22, width: 34, height: h, fill: F }, e); el("line", { x1: -15, y1: -22 + h, x2: 15, y2: -22 + h, stroke: INK, "stroke-width": 5 }, e); } }
      const a = (sd < 0 ? C.brow.l : C.brow.r) * Math.PI / 180, bx = sd * 42 + lx * 0.5, by = -360 - C.browUp + ly * 0.4;
      el("line", { x1: bx - 14 * Math.cos(a), y1: by + sd * 14 * Math.sin(a), x2: bx + 14 * Math.cos(a), y2: by - sd * 14 * Math.sin(a), stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg); });
    if (C.blush > 0) for (const sd of [-1, 1]) el("ellipse", { cx: sd * 72, cy: -280, rx: 16, ry: 9, fill: "#F4A3A0", opacity: C.blush }, hg);
    el("ellipse", { cx: 0, cy: -282, rx: 16, ry: 11, fill: "#4A2E22", stroke: INK, "stroke-width": 4 }, hg);
    const my = -252, M = C.mouth, op = C.open;
    if (M === "smile") el("path", { d: `M-20,${my - 4} Q0,${my + 12} 20,${my - 4}`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "grin") { el("path", { d: `M-26,${my - 8} Q0,${my + 22 + 14 * op} 26,${my - 8} Z`, fill: INK }, hg); if (sq) el("rect", { x: -10, y: my - 8, width: 20, height: 14, fill: WH, stroke: INK, "stroke-width": 3 }, hg); else el("ellipse", { cx: 0, cy: my + 8 + 6 * op, rx: 10, ry: 5, fill: "#F07C86" }, hg); }
    else if (M === "o") el("ellipse", { cx: 0, cy: my + 2, rx: 8 + 5 * op, ry: 10 + 10 * op, fill: INK }, hg);
    else if (M === "shout") el("path", { d: `M-24,${my - 8} Q0,${my - 14} 24,${my - 8} Q22,${my + 26 * op + 8} 0,${my + 26 * op + 10} Q-22,${my + 26 * op + 8} -24,${my - 8} Z`, fill: INK }, hg);
    else if (M === "flat") el("line", { x1: -14, y1: my, x2: 14, y2: my, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "wavy") el("path", { d: `M-20,${my} q5,-6 10,0 t10,0 t10,0 t10,0`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "frown") el("path", { d: `M-16,${my + 6} Q0,${my - 8} 16,${my + 6}`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    if (C.sweat > 0) el("path", { d: "M106,-370 q14,26 0,36 q-14,-10 0,-36 Z", fill: "#8fc6e8", stroke: INK, "stroke-width": 3, opacity: C.sweat }, hg);
    // stubby arms
    for (const [sd, tg] of [[-1, C.armL], [1, C.armR]]) { const sx0 = sd * 96, sy0 = -150, path = `M${sx0},${sy0} Q${(sx0 + tg.x) / 2 + sd * 20},${(sy0 + tg.y) / 2 + 20} ${tg.x},${tg.y}`;
      el("path", { d: path, fill: "none", stroke: INK, "stroke-width": 34, "stroke-linecap": "round" }, g); el("path", { d: path, fill: "none", stroke: F, "stroke-width": 22, "stroke-linecap": "round" }, g);
      el("circle", { cx: tg.x, cy: tg.y, r: 18, fill: B, stroke: INK, "stroke-width": 5 }, g); }
    return g; };
  W.hand = (C0, side) => { const C = Object.assign({}, CDEF, C0), h = side === "L" ? C.armL : C.armR; return [C.x + h.x * C.s * C.sx, C.y + h.y * C.s * C.sy]; };
  W.HAZEL = { kind: "squirrel", fur: "#C46A2E", belly: "#F3D3A8", apron: 1 };
  W.NUTMEG = { kind: "chipmunk", fur: "#B8875A", belly: "#F6E2C2" };

  // ---- set
  W.forest = (p, { t = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -600, y: -600, width: 2300, height: 2800, fill: "#CFE8C2" }, g);
    for (let i = 0; i < 6; i++) el("ellipse", { cx: -200 + i * 300, cy: 300 + (i % 2) * 80, rx: 260, ry: 180, fill: i % 2 ? "#9CCB7E" : "#88BC6A", stroke: INK, "stroke-width": 6 }, g);
    for (const [x, w] of [[-60, 120], [250, 90], [880, 130], [1180, 100]]) { el("rect", { x: x - w / 2, y: 380, width: w, height: 900, fill: "#8A5A3A", stroke: INK, "stroke-width": 7 }, g);
      for (let k = 0; k < 4; k++) el("path", { d: `M${x - w / 4},${520 + k * 160} q${w / 4},20 ${w / 2},0`, fill: "none", stroke: "#6B4428", "stroke-width": 5 }, g); }
    for (let i = 0; i < 5; i++) { const ph = (t * 0.15 + i / 5) % 1; el("ellipse", { cx: 100 + i * 220, cy: 700 + Math.sin(i) * 120, rx: 70, ry: 30, fill: "#FFF7C2", opacity: 0.35 + 0.15 * Math.sin(t * 2 + i) }, g); }
    el("path", { d: "M-600,1180 Q300,1120 1700,1190 L1700,2600 L-600,2600 Z", fill: "#9AC27A", stroke: INK, "stroke-width": 7 }, g);
    for (const x of [-100, 120, 960, 1180]) for (let i = -2; i <= 2; i++) el("path", { d: `M${x},1200 q${i * 20},-60 ${i * 36},-110`, fill: "none", stroke: "#4E7A3A", "stroke-width": 11, "stroke-linecap": "round" }, g);
    return g; };
  // the price board, hanging from a branch; flip 0..1 turns "100" into "99"
  W.board = (p, { x, y, s = 1, flip = 0, t = 0, glow = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    el("path", { d: "M-500,-220 Q0,-260 500,-200", fill: "none", stroke: "#7A4A2A", "stroke-width": 34, "stroke-linecap": "round" }, g);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: -380 + i * 260, cy: -250, rx: 60, ry: 26, fill: "#88BC6A", stroke: INK, "stroke-width": 5 }, g);
    const sway = Math.sin(t * 1.6) * 2, bg = el("g", { transform: `rotate(${sway} 0 -220)` }, g);
    for (const sd of [-1, 1]) el("line", { x1: sd * 120, y1: -220, x2: sd * 150, y2: -110, stroke: INK, "stroke-width": 5 }, bg);
    if (glow > 0) el("circle", { cx: 0, cy: 0, r: 260, fill: "#FFE7A0", opacity: 0.5 * glow }, bg);
    const sc = Math.abs(Math.cos(flip * Math.PI)), cg = el("g", { transform: `scale(1 ${Math.max(0.05, sc)})` }, bg);
    el("rect", { x: -210, y: -110, width: 420, height: 220, rx: 18, fill: "#E8C9A0", stroke: INK, "stroke-width": 8 }, cg);
    K.txt(cg, 0, 62, flip < 0.5 ? "100" : "99", 170, flip < 0.5 ? "#7A4A2A" : "#E5484D", "middle", { stroke: INK, "stroke-width": 4, "paint-order": "stroke" });
    K.txt(cg, 150, -60, "•", 40, INK); return g; };
  W.stump = (p, { y = 1405 }) => { const g = el("g", {}, p);
    el("path", { d: `M-400,${y + 30} Q540,${y - 10} 1480,${y + 30} L1480,${y + 900} L-400,${y + 900} Z`, fill: "#9A6A44", stroke: INK, "stroke-width": 8 }, g);
    el("ellipse", { cx: 540, cy: y + 10, rx: 980, ry: 40, fill: "#D9B07A", stroke: INK, "stroke-width": 8 }, g);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: 540, cy: y + 10, rx: 860 - i * 200, ry: 30 - i * 6, fill: "none", stroke: "#B8895A", "stroke-width": 4 }, g);
    for (let i = 0; i < 14; i++) el("line", { x1: -340 + i * 140, y1: y + 70, x2: -330 + i * 140 + (i % 3) * 8, y2: y + 500, stroke: "#7A5032", "stroke-width": 7 }, g); return g; };
  W.acorn = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("ellipse", { cx: 0, cy: 6, rx: 26, ry: 32, fill: "#C98A4A", stroke: INK, "stroke-width": 5 }, g);
    el("path", { d: "M-32,-10 Q0,-44 32,-10 Q0,-2 -32,-10 Z", fill: "#7A4A2A", stroke: INK, "stroke-width": 5 }, g); el("line", { x1: 0, y1: -30, x2: 6, y2: -46, stroke: INK, "stroke-width": 5 }, g); return g; };
  W.basket = (p, { x, y, s = 1, fill = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const n = Math.round(fill * 9); for (let i = 0; i < n; i++) W.acorn(g, { x: -70 + (i % 4) * 46 + (Math.floor(i / 4) % 2) * 23, y: -80 - Math.floor(i / 4) * 34, s: 0.8, rot: (i * 37) % 40 - 20 });
    el("path", { d: "M-110,-80 L110,-80 L90,0 L-90,0 Z", fill: "#C9A46A", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    for (let i = 0; i < 4; i++) el("line", { x1: -100 + i * 6, y1: -60 + i * 18, x2: 100 - i * 6, y2: -60 + i * 18, stroke: "#9A7A44", "stroke-width": 5 }, g); return g; };
  W.bunny = (p, { x, y, s = 1, t = 0, hop = 0, tone = "#E8E2DA" }) => { const g = el("g", { transform: `translate(${x} ${y - Math.abs(Math.sin(hop)) * 30}) scale(${s})` }, p);
    for (const sd of [-1, 1]) el("ellipse", { cx: sd * 30, cy: -250, rx: 22, ry: 70, fill: tone, stroke: INK, "stroke-width": 6, transform: `rotate(${sd * 10} ${sd * 30} -200)` }, g);
    el("ellipse", { cx: 0, cy: -90, rx: 90, ry: 100, fill: tone, stroke: INK, "stroke-width": 6 }, g); el("circle", { cx: 0, cy: -180, r: 70, fill: tone, stroke: INK, "stroke-width": 6 }, g);
    for (const sd of [-1, 1]) el("ellipse", { cx: sd * 24, cy: -190, rx: 8, ry: 12, fill: INK }, g); el("ellipse", { cx: 0, cy: -160, rx: 10, ry: 7, fill: "#F07C86" }, g); return g; };
  W.hedgehog = (p, { x, y, s = 1 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    let d = "M-110,0"; for (let i = 0; i <= 12; i++) { const a = Math.PI * (1 + i / 12), r = i % 2 ? 150 : 115; d += ` L${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; } d += " Z";
    el("path", { d, fill: "#6E5A48", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g); el("ellipse", { cx: 60, cy: -50, rx: 60, ry: 46, fill: "#E8C9A0", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 80, cy: -60, r: 7, fill: INK }, g); el("circle", { cx: 118, cy: -44, r: 9, fill: INK }, g); return g; };
  W.tag = (p, { x, y, s = 1, rot = 0, text = "99" }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p), w = 60 + text.length * 34;
    el("path", { d: `M${-w / 2},-44 L${w / 2 - 30},-44 L${w / 2},0 L${w / 2 - 30},44 L${-w / 2},44 Z`, fill: "#FFE07A", stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    el("circle", { cx: w / 2 - 28, cy: 0, r: 8, fill: WH, stroke: INK, "stroke-width": 4 }, g); K.txt(g, -14, 20, text, 56, "#E5484D"); return g; };
  W.iou = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -90, y: -60, width: 180, height: 120, fill: "#F7F2E6", stroke: INK, "stroke-width": 5 }, g); K.txt(g, 0, -6, "I.O.U.", 40, INK); K.txt(g, 0, 40, "1 acorn", 28, "#7A4A2A"); return g; };
  // the left-to-right card: digits with the reading eye; scan 0..1 moves the eye; stop = first digit circled + STOP
  W.digits = (p, { x, y, s = 1, k = 1, text = "99", scan = 0, stop = 0, sub = "" }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -380, y: -230, width: 760, height: 460, rx: 40, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    const ds = text.split(""), sp = 170, x0 = -(ds.length - 1) * sp / 2;
    ds.forEach((d, i) => K.txt(g, x0 + i * sp, 80, d, 240, i === 0 && stop > 0 ? "#E5484D" : INK));
    if (stop > 0) el("ellipse", { cx: x0, cy: 0, rx: 100, ry: 130, fill: "none", stroke: "#E5484D", "stroke-width": 12, opacity: stop }, g);
    const ex = lerp(-340, x0 + 40, clamp(scan * 1.6)), eg = el("g", { transform: `translate(${ex} -170)` }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 60, ry: 34, fill: WH, stroke: INK, "stroke-width": 6 }, eg); el("circle", { cx: 8, cy: 0, r: 18, fill: INK }, eg);
    if (stop > 0) { const sg = el("g", { transform: `translate(250 -150) scale(${stop})` }, g); let d = ""; for (let i = 0; i < 8; i++) { const a = (i + 0.5) / 8 * Math.PI * 2; d += (i ? "L" : "M") + (Math.cos(a) * 70).toFixed(1) + "," + (Math.sin(a) * 70).toFixed(1); }
      el("path", { d: d + "Z", fill: "#E5484D", stroke: INK, "stroke-width": 6 }, sg); K.txt(sg, 0, 14, "STOP", 34, WH); }
    if (sub) K.txt(g, 0, 190, sub, 52, "#666"); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555");
    lab(1200, 64, "WORLD 5 · FOREST · \"Why does everything cost 99?\" — cast & props (animal economics)", 42);
    [["Hazel", W.HAZEL, {}], ["Hazel: bored", W.HAZEL, { eyes: "half", lid: 0.55, mouth: "flat" }], ["Hazel: sold out!", W.HAZEL, { eyes: "happy", mouth: "grin" }], ["Nutmeg", W.NUTMEG, {}], ["Nutmeg: A HUNDRED?!", W.NUTMEG, { eyes: "wide", mouth: "shout", open: 1, cheeks: 1 }], ["Nutmeg: basically 90!", W.NUTMEG, { eyes: "sparkle", mouth: "grin" }]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 680; W.critter(s, Object.assign({ x, y, s: 0.62, t: 0.3 }, look, face)); lab(x, y + 50, n); });
    const cp = el("clipPath", { id: "f" }, s); el("rect", { x: 60, y: 800, width: 1100, height: 900, rx: 16 }, cp);
    const fg = el("g", { "clip-path": "url(#f)" }, s), sg = el("g", { transform: "translate(60 800) scale(0.62) translate(0 -300)" }, fg);
    W.forest(sg, { t: 0.3 }); W.board(sg, { x: 540, y: 800, flip: 1, t: 0.3 }); W.critter(sg, Object.assign({ x: 380, y: 1420, s: 1.05 }, W.HAZEL)); W.stump(sg, {}); W.basket(sg, { x: 760, y: 1405, s: 0.8 }); lab(610, 1740, "the shop: forest, price board, stump counter");
    W.board(s, { x: 1600, y: 1080, s: 0.5 }); W.board(s, { x: 2050, y: 1080, s: 0.5, flip: 1, glow: 1 }); lab(1825, 1260, "the board: 100 -> 99");
    W.basket(s, { x: 1450, y: 1520, s: 0.8 }); W.basket(s, { x: 1700, y: 1520, s: 0.8, fill: 0 }); W.iou(s, { x: 1950, y: 1460 }); W.tag(s, { x: 2200, y: 1460, text: "₹99" }); lab(1820, 1600, "baskets / IOU / price tag");
    W.bunny(s, { x: 300, y: 2200, s: 0.8 }); W.hedgehog(s, { x: 600, y: 2200, s: 0.8 }); W.bunny(s, { x: 850, y: 2200, s: 0.7, tone: "#C9B8A6" }); lab(560, 2260, "the woodland queue");
    W.digits(s, { x: 1650, y: 2050, s: 0.7, text: "100", scan: 1, stop: 1, sub: "your brain reads this" }); lab(1650, 2260, "left-to-right card");
  };
  root.World = W;
})(window);
