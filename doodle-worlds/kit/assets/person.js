/* person.js: the shared human rig for "Weird Worlds" (grown from the Mira/Matcha-Girl rig). Clean marker style: ink outlines,
   flat fills, no pencil, no boil. Waist-up: origin = the waist, where a foreground object (desk, rock, console, rail) cuts the body.
   Every draw is a pure function of its params (seek-safe). All looks are original; mix hair + outfit + hat per world.

   P = { x, y, s, sx, sy, rot, headTilt, look:[x,y], eyes:'open'|'closed'|'happy'|'wide'|'half'|'x'|'tiny' or [L,R], lid, brow:{l,r}, browUp,
         mouth:'flat'|'smile'|'grin'|'o'|'cat'|'wavy'|'teeth'|'frown'|'shout', open 0..1, blush, tired, sweat, tear,
         armL:{x,y}, armR:{x,y}, handL/handR:'fist'|'open'|'point',
         skin, hair (colour), hairStyle:'bob'|'short'|'spiky'|'wild'|'long'|'bald'|'curly', topBun 0|1, pony 0..1, beard 0..1, mustache 0|1, brows thick 0|1,
         outfit:'hoodie'|'scrubs'|'fur'|'robe'|'kimono'|'coat'|'space'|'pirate'|'cowboy'|'tunic'|'rags'|'suit'|'tank', cloth, cloth2,
         hat:'none'|'crown'|'tricorn'|'cowboy'|'fedora'|'headband'|'nemes'|'helmet'|'hood'|'cap'|'flower', hatC, glasses, eyepatch, headset, earring } */
(function (root) {
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#1d1b1a", OR = "#D97757", WH = "#ffffff", BLUSH = "#F4A3A0", TONGUE = "#F07C86", GOLD = "#F2C14E", GOLDD = "#C48E1C";
  const el = (tag, a = {}, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const hex = (h) => h.startsWith("rgb") ? h.match(/\d+/g).map(Number) : [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lerpC = (a, b, k) => { const A = hex(a), B = hex(b); return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(",") + ")"; };
  const shade = (c, k) => lerpC(c, "#000000", k), tint = (c, k) => lerpC(c, "#ffffff", k);
  const LINE = 6;
  const DEF = { x: 0, y: 0, s: 1, sx: 1, sy: 1, rot: 0, headTilt: 0, look: [0, 0], eyes: "open", lid: 0, brow: { l: 0, r: 0 }, browUp: 0, mouth: "smile", open: 0.5,
    blush: 0.5, tired: 0, sweat: 0, tear: 0, armL: { x: -170, y: -10 }, armR: { x: 170, y: -10 }, handL: "fist", handR: "fist",
    skin: "#FFE1CF", hair: "#3B2A25", hairStyle: "bob", topBun: 0, pony: 0, ponyT: 0, beard: 0, mustache: 0, thickBrows: 0,
    outfit: "hoodie", cloth: "#A9B3C1", cloth2: null, hat: "none", hatC: null, glasses: 0, eyepatch: 0, headset: 0, earring: 0 };
  const HEAD = { cx: 0, cy: -295, rx: 100, ry: 102 };

  function person(parent, p0) {
    const P = Object.assign({}, DEF, p0); P.brow = Object.assign({ l: 0, r: 0 }, p0.brow || {});
    const g = el("g", { transform: `translate(${P.x} ${P.y}) rotate(${P.rot}) scale(${P.s * P.sx} ${P.s * P.sy})` }, parent);
    const SK = P.skin, HC = P.hair, HH = tint(HC, 0.3), CL = P.cloth, C2 = P.cloth2 || shade(CL, 0.18);
    const sleeve = P.outfit === "tank" || P.outfit === "fur" ? SK : CL;
    const arm = (side, tgt, hand) => {
      const sx0 = side * 112, sy0 = -150, hx = tgt.x, hy = tgt.y, d = Math.hypot(hx - sx0, hy - sy0) || 1, L = 150;
      const slack = Math.sqrt(Math.max(0, L * L - d * d)) * 0.45; let nx = -(hy - sy0) / d, ny = (hx - sx0) / d; if (ny < 0 || (Math.abs(ny) < 0.2 && nx * side < 0)) { nx = -nx; ny = -ny; }
      const path = `M${sx0},${sy0} Q${(sx0 + hx) / 2 + nx * slack},${(sy0 + hy) / 2 + ny * slack} ${hx},${hy}`;
      el("path", { d: path, fill: "none", stroke: INK, "stroke-width": 40, "stroke-linecap": "round" }, g);
      el("path", { d: path, fill: "none", stroke: sleeve, "stroke-width": 28, "stroke-linecap": "round" }, g);
      if (P.outfit === "space") el("circle", { cx: hx - (hx - sx0) / d * 16, cy: hy - (hy - sy0) / d * 16, r: 17, fill: "#E9EEF3", stroke: INK, "stroke-width": 4 }, g);
      if (hand === "point") { const a = Math.atan2(hy - sy0, hx - sx0);
        el("line", { x1: hx, y1: hy, x2: hx + Math.cos(a) * 42, y2: hy + Math.sin(a) * 42, stroke: INK, "stroke-width": 20, "stroke-linecap": "round" }, g);
        el("line", { x1: hx, y1: hy, x2: hx + Math.cos(a) * 42, y2: hy + Math.sin(a) * 42, stroke: SK, "stroke-width": 10, "stroke-linecap": "round" }, g); }
      el("circle", { cx: hx, cy: hy, r: hand === "open" ? 22 : 19, fill: P.outfit === "space" ? "#E9EEF3" : SK, stroke: INK, "stroke-width": LINE }, g);
    };
    // ---- back hair / ponytail (behind everything)
    if (P.pony > 0) { const sw = Math.sin(P.ponyT * 5) * 6;
      el("path", { d: `M70,-392 C150,-400 ${170 + sw},-320 ${150 + sw},-210 C${140 + sw},-170 ${118 + sw},-160 ${112 + sw},-200 C118,-290 108,-340 62,-360 Z`, fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g); }
    if (P.hairStyle === "bob") el("path", { d: "M-122,-300 C-128,-388 -72,-430 0,-430 C72,-430 128,-388 122,-300 L118,-222 Q104,-204 88,-224 L84,-300 L-84,-300 L-88,-224 Q-104,-204 -118,-222 Z", fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    if (P.hairStyle === "long") el("path", { d: "M-124,-300 C-130,-392 -72,-432 0,-432 C72,-432 130,-392 124,-300 L132,-150 Q110,-128 86,-150 L84,-300 L-84,-300 L-86,-150 Q-110,-128 -132,-150 Z", fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    if (P.hairStyle === "wild") { let d = "M-130,-250"; for (let i = 0; i <= 14; i++) { const a = Math.PI * (1.05 + i / 14 * 0.9), r = i % 2 ? 150 : 128; d += ` L${(Math.cos(a) * r * 1.02).toFixed(1)},${(-300 + Math.sin(a) * r).toFixed(1)}`; } d += " L130,-250 L118,-200 L96,-236 L-96,-236 L-118,-200 Z";
      el("path", { d, fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g); }
    if (P.hairStyle === "curly") for (let i = 0; i < 11; i++) { const a = Math.PI * (1.0 + i / 10), r = 112; el("circle", { cx: Math.cos(a) * r, cy: -300 + Math.sin(a) * r * 1.02, r: 34, fill: HC, stroke: INK, "stroke-width": LINE }, g); }
    // ---- torso + outfit
    el("path", { d: "M-160,0 L-146,-118 Q-136,-170 -84,-178 L84,-178 Q136,-170 146,-118 L160,0 Z", fill: CL, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    const o = P.outfit;
    if (o === "hoodie") { el("path", { d: "M-96,-176 Q0,-130 96,-176", fill: "none", stroke: C2, "stroke-width": 10, "stroke-linecap": "round" }, g);
      for (const sd of [-1, 1]) { el("line", { x1: sd * 26, y1: -160, x2: sd * 32, y2: -86, stroke: INK, "stroke-width": 4 }, g); el("circle", { cx: sd * 32, cy: -82, r: 6, fill: WH, stroke: INK, "stroke-width": 3 }, g); }
      el("path", { d: "M-84,0 L-74,-56 L74,-56 L84,0", fill: "none", stroke: C2, "stroke-width": 5 }, g); }
    else if (o === "scrubs") { el("path", { d: "M-62,-178 L0,-104 L62,-178", fill: "none", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      el("rect", { x: 56, y: -120, width: 50, height: 40, rx: 5, fill: "none", stroke: INK, "stroke-width": 4 }, g); }
    else if (o === "fur") { el("path", { d: "M-150,-40 L-120,-170 L60,-176 L150,-60 L160,0 L-160,0 Z", fill: CL, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-160,0 L-150,-40 L-130,-20 L-110,-44 L-86,-18 L-60,-40 L-36,-16 L-10,-42 L16,-18 L40,-40 L66,-18 L92,-42 L118,-20 L150,-60 L160,0 Z", fill: C2, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g);
      for (const [sx, sy] of [[-80, -110], [10, -130], [70, -90], [-20, -70]]) el("ellipse", { cx: sx, cy: sy, rx: 16, ry: 10, fill: C2 }, g);
      el("path", { d: "M60,-176 L84,-178 Q136,-170 146,-118 L150,-60 Z", fill: SK, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g); }
    else if (o === "robe") { el("path", { d: "M-120,-176 Q0,-60 120,-176 L104,-150 Q0,-84 -104,-150 Z", fill: P.cloth2 || GOLD, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-108,-160 Q0,-74 108,-160", fill: "none", stroke: "#2F6FB0", "stroke-width": 7 }, g); el("path", { d: "M-96,-146 Q0,-66 96,-146", fill: "none", stroke: "#C0392B", "stroke-width": 5 }, g); }
    else if (o === "kimono") { el("path", { d: "M-80,-178 L40,0 M80,-178 L-10,-60", fill: "none", stroke: INK, "stroke-width": 6 }, g);
      el("path", { d: "M-80,-178 L40,0 L70,0 L-50,-178 Z", fill: C2, stroke: INK, "stroke-width": 4 }, g);
      el("rect", { x: -150, y: -60, width: 300, height: 36, fill: P.cloth2 || "#2B2B3A", stroke: INK, "stroke-width": 5 }, g); }
    else if (o === "coat") { for (const sd of [-1, 1]) el("path", { d: `M${sd * 30},-176 L${sd * 92},-176 L${sd * 64},-96 L${sd * 10},-40 Z`, fill: C2, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-20,-176 L0,-120 L20,-176 Z", fill: WH, stroke: INK, "stroke-width": 4 }, g);
      el("rect", { x: -156, y: -44, width: 312, height: 26, fill: C2, stroke: INK, "stroke-width": 5 }, g); el("rect", { x: -18, y: -48, width: 36, height: 34, rx: 4, fill: GOLD, stroke: INK, "stroke-width": 4 }, g); }
    else if (o === "space") { el("rect", { x: -60, y: -130, width: 120, height: 80, rx: 12, fill: "#DCE3EA", stroke: INK, "stroke-width": 5 }, g);
      [[-30, -105, "#E5484D"], [0, -105, "#3FB8AF"], [30, -105, GOLD]].forEach(([bx, by, c]) => el("circle", { cx: bx, cy: by, r: 10, fill: c, stroke: INK, "stroke-width": 3 }, g));
      el("rect", { x: -40, y: -82, width: 80, height: 16, rx: 5, fill: "#20303A" }, g);
      el("path", { d: "M-100,-180 Q0,-150 100,-180 L96,-162 Q0,-132 -96,-162 Z", fill: "#AEB3BB", stroke: INK, "stroke-width": 5 }, g);
      el("rect", { x: 90, y: -150, width: 40, height: 26, rx: 4, fill: OR, stroke: INK, "stroke-width": 3 }, g); }
    else if (o === "pirate") { for (let i = 0; i < 6; i++) el("line", { x1: -150 + i * 4, y1: -150 + i * 26, x2: 150 - i * 4, y2: -150 + i * 26, stroke: tint(CL, 0.7), "stroke-width": 9 }, g);
      for (const sd of [-1, 1]) el("path", { d: `M${sd * 40},-178 L${sd * 140},-150 L${sd * 158},0 L${sd * 60},0 Z`, fill: C2, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g); }
    else if (o === "cowboy") { for (const sd of [-1, 1]) el("path", { d: `M${sd * 30},-178 L${sd * 140},-150 L${sd * 158},0 L${sd * 46},0 Z`, fill: C2, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-70,-180 L70,-180 L0,-110 Z", fill: "#C0392B", stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      for (const sd of [-1, 1]) el("circle", { cx: sd * 100, cy: -100, r: 7, fill: GOLD, stroke: INK, "stroke-width": 3 }, g); }
    else if (o === "tunic") { el("path", { d: "M-60,-178 L0,-130 L60,-178", fill: "none", stroke: INK, "stroke-width": 5 }, g);
      for (let i = 0; i < 3; i++) el("line", { x1: -14, y1: -160 + i * 14, x2: 14, y2: -152 + i * 14, stroke: INK, "stroke-width": 3 }, g);
      el("rect", { x: -156, y: -50, width: 312, height: 24, fill: "#6B4A2E", stroke: INK, "stroke-width": 5 }, g); }
    else if (o === "rags") { el("path", { d: "M-160,0 L-140,-30 L-120,0 L-96,-36 L-70,0 L-40,-24 L-14,0 L20,-40 L46,0 L80,-28 L104,0 L130,-34 L160,0 Z", fill: C2, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-60,-120 l20,10 l-12,16 M50,-80 l18,-8 l4,20", fill: "none", stroke: INK, "stroke-width": 4 }, g); }
    else if (o === "suit") { for (const sd of [-1, 1]) el("path", { d: `M${sd * 24},-176 L${sd * 92},-176 L${sd * 60},-90 L${sd * 6},-30 Z`, fill: C2, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g);
      el("path", { d: "M-24,-176 L0,-120 L24,-176 Z", fill: WH, stroke: INK, "stroke-width": 4 }, g); el("path", { d: "M-10,-160 L10,-160 L14,-80 L0,-64 L-14,-80 Z", fill: P.cloth2 ? shade(P.cloth2, 0.1) : "#C0392B", stroke: INK, "stroke-width": 4 }, g); }
    else if (o === "tank") { el("path", { d: "M-84,-178 L-60,-178 Q0,-120 60,-178 L84,-178 L100,0 L-100,0 Z", fill: CL, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, g); }
    // ---- neck, head
    el("rect", { x: -24, y: -205, width: 48, height: 34, fill: SK, stroke: INK, "stroke-width": LINE }, g);
    const hg = el("g", { transform: `rotate(${P.headTilt} 0 -200)` }, g);
    for (const sd of [-1, 1]) el("ellipse", { cx: sd * 99, cy: -286, rx: 17, ry: 21, fill: SK, stroke: INK, "stroke-width": LINE }, hg);
    if (P.earring) el("circle", { cx: 99, cy: -258, r: 8, fill: GOLD, stroke: INK, "stroke-width": 3 }, hg);
    el("ellipse", { cx: HEAD.cx, cy: HEAD.cy, rx: HEAD.rx, ry: HEAD.ry, fill: SK, stroke: INK, "stroke-width": LINE }, hg);
    if (P.beard > 0) el("path", { d: `M-98,-290 Q-104,${-200 + 20 * P.beard} 0,${-176 + 40 * P.beard} Q104,${-200 + 20 * P.beard} 98,-290 Q80,-240 52,-236 Q20,-252 0,-246 Q-20,-252 -52,-236 Q-80,-240 -98,-290 Z`, fill: HC, stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, hg);
    // ---- face
    const lx = P.look[0] * 8, ly = P.look[1] * 7, types = Array.isArray(P.eyes) ? P.eyes : [P.eyes, P.eyes];
    [-1, 1].forEach((sd, i) => {
      const t = types[i], e = el("g", { transform: `translate(${sd * 40 + lx} ${-288 + ly})` }, hg);
      if (P.eyepatch && sd > 0) { el("ellipse", { cx: 0, cy: 0, rx: 24, ry: 22, fill: INK }, e); return; }
      if (t === "closed") el("path", { d: `M-15,0 Q0,11 15,0 M${sd * 15},0 l${sd * 7},-5`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, e);
      else if (t === "happy") el("path", { d: "M-15,6 Q0,-13 15,6", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e);
      else if (t === "wide") { el("ellipse", { cx: 0, cy: 0, rx: 17, ry: 23, fill: WH, stroke: INK, "stroke-width": 5 }, e); el("circle", { cx: lx * 0.5, cy: 2, r: 6, fill: INK }, e); }
      else if (t === "x") el("path", { d: "M-12,-12 L12,12 M12,-12 L-12,12", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, e);
      else if (t === "tiny") el("circle", { cx: 0, cy: 0, r: 6, fill: INK }, e);
      else { const lid = t === "half" ? Math.max(0.5, P.lid) : P.lid;
        el("ellipse", { cx: 0, cy: 0, rx: 13, ry: 19, fill: INK, stroke: INK, "stroke-width": 3 }, e);
        el("circle", { cx: 4, cy: -7, r: 5, fill: WH }, e); el("circle", { cx: -4, cy: 7, r: 2.5, fill: WH }, e);
        if (lid > 0) { const h = 40 * lid; el("rect", { x: -18, y: -24, width: 36, height: h, fill: SK }, e); el("line", { x1: -16, y1: -24 + h, x2: 16, y2: -24 + h, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, e); } }
      if (P.tired > 0) el("path", { d: "M-15,27 Q0,35 15,27", fill: "none", stroke: "#8C7BA6", "stroke-width": 4, opacity: P.tired, "stroke-linecap": "round" }, e);
      const a = (sd < 0 ? P.brow.l : P.brow.r) * Math.PI / 180, bx = sd * 40 + lx * 0.5, by = -330 - P.browUp + ly * 0.4;
      el("line", { x1: bx - 15 * Math.cos(a), y1: by + sd * 15 * Math.sin(a), x2: bx + 15 * Math.cos(a), y2: by - sd * 15 * Math.sin(a), stroke: INK, "stroke-width": P.thickBrows ? 10 : 5, "stroke-linecap": "round" }, hg);
    });
    if (P.eyepatch) el("path", { d: "M-100,-320 L104,-262", stroke: INK, "stroke-width": 5 }, hg);
    if (P.blush > 0) for (const sd of [-1, 1]) el("ellipse", { cx: sd * 66, cy: -252, rx: 17, ry: 9, fill: BLUSH, opacity: P.blush }, hg);
    const my = -236 + ly * 0.5, mx = lx * 0.5, op = P.open, M = P.mouth;
    if (M === "flat") el("line", { x1: mx - 13, y1: my, x2: mx + 13, y2: my, stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "smile") el("path", { d: `M${mx - 17},${my - 3} Q${mx},${my + 12} ${mx + 17},${my - 3}`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "frown") el("path", { d: `M${mx - 16},${my + 6} Q${mx},${my - 8} ${mx + 16},${my + 6}`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    else if (M === "grin") { el("path", { d: `M${mx - 24},${my - 6} Q${mx},${my + 20 + 14 * op} ${mx + 24},${my - 6} Z`, fill: INK, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, hg);
      el("ellipse", { cx: mx, cy: my + 6 + 6 * op, rx: 10, ry: 5 + 3 * op, fill: TONGUE }, hg); }
    else if (M === "teeth") { el("rect", { x: mx - 24, y: my - 10, width: 48, height: 22, rx: 8, fill: WH, stroke: INK, "stroke-width": 4 }, hg); el("line", { x1: mx - 24, y1: my + 1, x2: mx + 24, y2: my + 1, stroke: INK, "stroke-width": 3 }, hg); }
    else if (M === "o") el("ellipse", { cx: mx, cy: my + 2, rx: 8 + 5 * op, ry: 10 + 10 * op, fill: INK }, hg);
    else if (M === "shout") el("path", { d: `M${mx - 22},${my - 8} Q${mx},${my - 14} ${mx + 22},${my - 8} Q${mx + 20},${my + 26 * op + 8} ${mx},${my + 26 * op + 10} Q${mx - 20},${my + 26 * op + 8} ${mx - 22},${my - 8} Z`, fill: INK }, hg);
    else if (M === "cat") el("path", { d: `M${mx - 16},${my - 3} q8,9 16,0 q8,9 16,0`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }, hg);
    else if (M === "wavy") el("path", { d: `M${mx - 20},${my} q5,-6 10,0 t10,0 t10,0 t10,0`, fill: "none", stroke: INK, "stroke-width": 5, "stroke-linecap": "round" }, hg);
    if (P.mustache) el("path", { d: `M${mx},${my - 14} C${mx - 20},${my - 26} ${mx - 46},${my - 16} ${mx - 50},${my - 4} C${mx - 34},${my - 12} ${mx - 14},${my - 6} ${mx},${my - 10} C${mx + 14},${my - 6} ${mx + 34},${my - 12} ${mx + 50},${my - 4} C${mx + 46},${my - 16} ${mx + 20},${my - 26} ${mx},${my - 14} Z`, fill: HC, stroke: INK, "stroke-width": 4 }, hg);
    if (P.tear > 0) el("path", { d: `M${-40 + lx},${-266 + ly} q8,${22 * P.tear} 0,${32 * P.tear} q-8,${-10 * P.tear} 0,${-32 * P.tear} Z`, fill: "#8fc6e8", stroke: INK, "stroke-width": 3 }, hg);
    // ---- front hair
    const HS = P.hairStyle;
    if (HS === "bob" || HS === "long") { el("path", { d: "M-104,-310 C-104,-396 -52,-414 0,-414 C52,-414 104,-396 104,-310 Q84,-342 58,-328 Q32,-364 2,-334 Q-28,-366 -56,-328 Q-84,-346 -104,-310 Z", fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-62,-388 Q-36,-404 -6,-402", fill: "none", stroke: HH, "stroke-width": 8, "stroke-linecap": "round" }, hg); }
    else if (HS === "short" || HS === "curly") el("path", { d: "M-106,-300 C-112,-410 112,-410 106,-300 Q96,-336 70,-344 Q40,-330 14,-350 Q-20,-334 -50,-350 Q-84,-340 -106,-300 Z", fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
    else if (HS === "spiky") { let d = "M-106,-300"; for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.08 + i / 10 * 0.84), r = i % 2 ? 132 : 104; d += ` L${(Math.cos(a) * r).toFixed(1)},${(-300 + Math.sin(a) * r).toFixed(1)}`; } d += " L106,-300 Q60,-340 0,-334 Q-60,-340 -106,-300 Z";
      el("path", { d, fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg); }
    else if (HS === "wild") el("path", { d: "M-106,-300 C-110,-410 110,-410 106,-300 L92,-330 L74,-306 L58,-342 L36,-312 L14,-346 L-8,-312 L-30,-344 L-52,-310 L-72,-340 L-90,-306 Z", fill: HC, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
    else if (HS === "bald") { el("path", { d: "M-60,-392 Q-40,-404 -16,-400", fill: "none", stroke: WH, "stroke-width": 8, "stroke-linecap": "round", opacity: 0.7 }, hg); for (const sd of [-1, 1]) el("path", { d: `M${sd * 98},-330 Q${sd * 110},-300 ${sd * 100},-270`, fill: "none", stroke: HC, "stroke-width": 14, "stroke-linecap": "round" }, hg); }
    if (P.topBun && HS === "bob") { el("circle", { cx: 0, cy: -438, r: 44, fill: HC, stroke: INK, "stroke-width": LINE }, hg); el("path", { d: "M-40,-404 Q0,-392 40,-404", stroke: OR, "stroke-width": 12, fill: "none", "stroke-linecap": "round" }, hg); }
    // ---- glasses, headset, hats
    if (P.glasses) for (const sd of [-1, 1]) { const gx = sd * 40 + lx * 0.4; el("circle", { cx: gx, cy: -288, r: 27, fill: "rgba(255,255,255,.18)", stroke: INK, "stroke-width": 5 }, hg);
      if (sd < 0) el("path", { d: `M${-13 + lx * 0.4},-292 Q${lx * 0.4},-300 ${13 + lx * 0.4},-292`, fill: "none", stroke: INK, "stroke-width": 5 }, hg); }
    if (P.headset) { el("path", { d: "M-110,-296 C-118,-452 118,-452 110,-296", fill: "none", stroke: INK, "stroke-width": 14 }, hg); el("path", { d: "M-110,-296 C-118,-452 118,-452 110,-296", fill: "none", stroke: "#5a6270", "stroke-width": 6 }, hg);
      for (const sd of [-1, 1]) el("rect", { x: sd * 108 - 15, y: -318, width: 30, height: 52, rx: 12, fill: "#5a6270", stroke: INK, "stroke-width": 5 }, hg);
      el("path", { d: "M-104,-272 Q-96,-226 -36,-230", fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, hg); el("circle", { cx: -32, cy: -230, r: 9, fill: OR, stroke: INK, "stroke-width": 4 }, hg); }
    const H = P.hat, HCc = P.hatC;
    if (H === "crown") { el("path", { d: "M-80,-380 L-90,-470 L-46,-424 L0,-486 L46,-424 L90,-470 L80,-380 Z", fill: HCc || GOLD, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      for (const cx of [-46, 0, 46]) el("circle", { cx, cy: -400, r: 10, fill: "#E5484D", stroke: INK, "stroke-width": 3 }, hg); }
    else if (H === "tricorn") { el("path", { d: "M-150,-360 Q-60,-330 0,-336 Q60,-330 150,-360 Q120,-420 60,-440 Q0,-470 -60,-440 Q-120,-420 -150,-360 Z", fill: HCc || "#2B2B3A", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-120,-366 Q0,-340 120,-366", fill: "none", stroke: GOLD, "stroke-width": 7 }, hg);
      el("circle", { cx: 0, cy: -406, r: 16, fill: WH, stroke: INK, "stroke-width": 4 }, hg); }
    else if (H === "cowboy") { el("path", { d: "M-170,-352 Q0,-300 170,-352 Q150,-326 0,-322 Q-150,-326 -170,-352 Z", fill: HCc || "#A0703F", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-84,-344 L-74,-450 Q0,-430 74,-450 L84,-344 Q0,-326 -84,-344 Z", fill: HCc || "#A0703F", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-84,-366 Q0,-350 84,-366", fill: "none", stroke: "#4A2E1A", "stroke-width": 12 }, hg); }
    else if (H === "fedora") { el("path", { d: "M-150,-352 Q0,-318 150,-352 Q130,-336 0,-330 Q-130,-336 -150,-352 Z", fill: HCc || "#3A3A44", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-90,-346 L-80,-436 Q-40,-420 0,-440 Q40,-420 80,-436 L90,-346 Z", fill: HCc || "#3A3A44", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      el("path", { d: "M-90,-370 Q0,-356 90,-370", fill: "none", stroke: "#1d1b1a", "stroke-width": 12 }, hg); }
    else if (H === "headband") { el("path", { d: "M-104,-344 Q0,-370 104,-344 L102,-322 Q0,-348 -102,-322 Z", fill: HCc || WH, stroke: INK, "stroke-width": 5 }, hg);
      el("circle", { cx: 0, cy: -344, r: 12, fill: "#E5484D" }, hg); el("path", { d: "M100,-336 Q140,-330 150,-300 M100,-332 Q136,-346 156,-330", fill: "none", stroke: HCc || WH, "stroke-width": 10, "stroke-linecap": "round" }, hg); }
    else if (H === "nemes") { el("path", { d: "M-110,-320 C-118,-430 118,-430 110,-320 L150,-180 L96,-180 L94,-300 L-94,-300 L-96,-180 L-150,-180 Z", fill: HCc || "#F2D06B", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
      for (let i = 0; i < 6; i++) { el("path", { d: `M${-150 + i * 4},${-190 - i * 22} L-96,${-190 - i * 22}`, stroke: "#2F6FB0", "stroke-width": 9 }, hg); el("path", { d: `M${150 - i * 4},${-190 - i * 22} L96,${-190 - i * 22}`, stroke: "#2F6FB0", "stroke-width": 9 }, hg); }
      el("path", { d: "M-104,-330 Q0,-350 104,-330", fill: "none", stroke: "#2F6FB0", "stroke-width": 10 }, hg); el("circle", { cx: 0, cy: -372, r: 14, fill: GOLD, stroke: INK, "stroke-width": 4 }, hg); }
    else if (H === "cap") { el("path", { d: "M-106,-320 C-112,-420 112,-420 106,-320 Z", fill: HCc || "#C0392B", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg); el("path", { d: "M-20,-324 L150,-320 Q140,-300 20,-306 Z", fill: shade(HCc || "#C0392B", 0.15), stroke: INK, "stroke-width": 5, "stroke-linejoin": "round" }, hg); }
    else if (H === "hood") el("path", { d: "M-140,-180 C-150,-440 150,-440 140,-180 L110,-180 C120,-380 -120,-380 -110,-180 Z", fill: HCc || CL, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, hg);
    else if (H === "flower") { for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; el("circle", { cx: 74 + Math.cos(a) * 16, cy: -380 + Math.sin(a) * 16, r: 13, fill: HCc || "#FF8FB1", stroke: INK, "stroke-width": 3 }, hg); } el("circle", { cx: 74, cy: -380, r: 9, fill: GOLD, stroke: INK, "stroke-width": 3 }, hg); }
    else if (H === "helmet") { el("circle", { cx: 0, cy: -296, r: 150, fill: "rgba(210,236,255,.22)", stroke: INK, "stroke-width": 7 }, hg);
      el("path", { d: "M-96,-370 Q-70,-420 -20,-436", fill: "none", stroke: WH, "stroke-width": 12, "stroke-linecap": "round", opacity: 0.85 }, hg); }
    if (P.sweat > 0) el("path", { d: "M100,-350 q14,26 0,36 q-14,-10 0,-36 Z", fill: "#8fc6e8", stroke: INK, "stroke-width": 3, opacity: P.sweat, transform: `translate(0 ${P.sweat * 14})` }, hg);
    arm(-1, P.armL, P.handL); arm(1, P.armR, P.handR);
    return g;
  }
  function hand(P0, side) { const P = Object.assign({}, DEF, P0), h = side === "L" ? P.armL : P.armR, a = P.rot * Math.PI / 180, s = P.s;
    const lx = h.x * s * P.sx, ly = h.y * s * P.sy; return [P.x + lx * Math.cos(a) - ly * Math.sin(a), P.y + lx * Math.sin(a) + ly * Math.cos(a)]; }
  function head(P0) { const P = Object.assign({}, DEF, P0); return [P.x, P.y - 295 * P.s * P.sy]; }
  function mix(a, b, k) { const o = {};
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = a[key] ?? DEF[key], B = b[key] ?? DEF[key];
      if (typeof A === "number" && typeof B === "number") o[key] = lerp(A, B, k);
      else if (Array.isArray(A) && Array.isArray(B) && typeof A[0] === "number") o[key] = A.map((v, i) => lerp(v, B[i], k));
      else if (A && B && typeof A === "object" && !Array.isArray(A)) o[key] = mix(A, B, k);
      else o[key] = k < 0.5 ? A : B; }
    return o; }
  // shared expression presets (merge into a character's look)
  const FACES = {
    calm: { eyes: "open", mouth: "smile" }, deadpan: { eyes: "half", lid: 0.55, mouth: "flat", look: [0, 0] },
    shock: { eyes: "wide", mouth: "o", open: 0.8, browUp: 12 }, happy: { eyes: "happy", mouth: "grin", open: 0.6, blush: 0.9 },
    worried: { eyes: "open", mouth: "wavy", brow: { l: -18, r: -18 }, browUp: 10 }, angry: { eyes: "open", mouth: "frown", brow: { l: 22, r: 22 }, browUp: -4 },
    smug: { eyes: "half", lid: 0.35, mouth: "smile", brow: { l: -6, r: 10 } }, sad: { eyes: "open", look: [0, 0.6], mouth: "frown", brow: { l: -20, r: -20 }, browUp: 6 },
    think: { eyes: "open", look: [0.6, -0.8], mouth: "flat", brow: { l: 8, r: -6 } }, shout: { eyes: "wide", mouth: "shout", open: 1, browUp: 16 },
  };
  root.Person = { draw: person, hand, head, mix, DEF, FACES, el, lerpC, shade, tint };
})(window);
