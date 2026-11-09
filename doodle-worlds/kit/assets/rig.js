/* rig.js: Clawd (the Claude mascot) as a posable cartoon rig + the props of "Idea Hunt". Clean marker style:
   black ink outlines, flat fills, Claude orange as the only accent, yellow only for a lit idea. No pencil, no hatching, no boil.
   Every draw is a pure function of its params (seek-safe). Origin of the character = between its feet on the floor. */
(function (root) {
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#1d1b1a", OR = "#D97757", ORD = "#B85C3C", ORL = "#EBA184", WH = "#ffffff", YEL = "#FFD43B", YELD = "#F2A900";
  const el = (tag, a = {}, p) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const LINE = 7;

  // hand-drawn rounded rectangle: a tiny fixed wobble so outlines look inked, never jittery
  function wobRect(x, y, w, h, r, seed = 1) {
    const n = (i) => Math.sin(i * 12.9898 + seed * 78.233) * 1.2;
    return `M${x + r},${y + n(1)} L${x + w - r},${y + n(2)} Q${x + w + n(3)},${y} ${x + w},${y + r} L${x + w + n(4)},${y + h - r} Q${x + w},${y + h + n(5)} ${x + w - r},${y + h}`
      + ` L${x + r},${y + h + n(6)} Q${x + n(7)},${y + h} ${x},${y + h - r} L${x + n(8)},${y + r} Q${x},${y + n(9)} ${x + r},${y} Z`;
  }

  /* ------------------------------------------------------------------ the character
     P = { x, y, s, sx, sy, rot, lean (deg skew), look:[x,y] (-1..1), eyeScale, eyes:'open'|'happy'|'closed'|'x'|'spiral'|'tiny',
           lid 0..1, brow:{l,r} angles (deg, + = inner end down = angry), browUp px, mouth:'none'|'smile'|'grin'|'o'|'flat'|'wavy'|'shout',
           mouthOpen 0..1, armL:{x,y}, armR:{x,y} hand targets in character space, armBehind:'L'|'R'|null,
           legs:{phase, swing, lift}, blush, spin (spiral rotation), flipX } */
  const DEF = { x: 0, y: 0, s: 1, sx: 1, sy: 1, rot: 0, lean: 0, look: [0, 0], eyeScale: 1, eyes: "open", lid: 0, brow: { l: 0, r: 0 }, browUp: 0, browOn: 1,
    mouth: "none", mouthOpen: 0.5, armL: { x: -165, y: -22 }, armR: { x: 165, y: -22 }, armBehind: null, legs: { phase: 0, swing: 0, lift: 0 }, blush: 0, spin: 0, flipX: 1 };
  const BODY = { w: 230, h: 150, cy: -112 };                     // body rectangle centred at (0, cy)
  function clawd(parent, p0) {
    const P = Object.assign({}, DEF, p0); P.brow = Object.assign({ l: 0, r: 0 }, p0.brow || {}); P.legs = Object.assign({ phase: 0, swing: 0, lift: 0 }, p0.legs || {});
    const g = el("g", { transform: `translate(${P.x} ${P.y}) rotate(${P.rot}) scale(${P.s * P.sx * P.flipX} ${P.s * P.sy}) skewX(${P.lean})` }, parent);
    const top = BODY.cy - BODY.h / 2, bot = BODY.cy + BODY.h / 2;
    const arm = (side, tgt, behind) => {
      const sx0 = side * (BODY.w / 2 - 6), sy0 = BODY.cy + 8, hx = tgt.x, hy = tgt.y;
      const d = Math.hypot(hx - sx0, hy - sy0) || 1, L = 128, slack = Math.sqrt(Math.max(0, L * L - d * d)) * 0.45;   // rubber-hose slack
      let nx = -(hy - sy0) / d, ny = (hx - sx0) / d;                                       // perpendicular; the elbow always bows down/outward
      if (ny < 0 || (Math.abs(ny) < 0.2 && nx * side < 0)) { nx = -nx; ny = -ny; }
      const mx = (sx0 + hx) / 2 + nx * slack, my = (sy0 + hy) / 2 + ny * slack;
      const path = `M${sx0},${sy0} Q${mx},${my} ${hx},${hy}`, a = el("g", { opacity: behind ? 1 : 1 }, g);
      el("path", { d: path, fill: "none", stroke: INK, "stroke-width": 26, "stroke-linecap": "round" }, a);
      el("path", { d: path, fill: "none", stroke: OR, "stroke-width": 13, "stroke-linecap": "round" }, a);
      el("circle", { cx: hx, cy: hy, r: 16, fill: OR, stroke: INK, "stroke-width": LINE }, a);
      return a;
    };
    // arms reaching behind the body are drawn first
    if (P.armBehind === "L") arm(-1, P.armL, true); if (P.armBehind === "R") arm(1, P.armR, true);
    // legs: four pegs; walk = alternate lift + swing
    [-82, -50, 50, 82].forEach((lx, i) => {
      const ph = P.legs.phase + (i % 2 ? Math.PI : 0), lift = Math.max(0, Math.sin(ph)) * P.legs.lift, sw = Math.cos(ph) * P.legs.swing;
      el("path", { d: wobRect(lx - 12 + sw, bot - 8 - lift, 24, 50 - lift * 0.4, 9, i + 3), fill: OR, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    });
    // body with a darker belly band for volume and a light rim on top
    el("path", { d: wobRect(-BODY.w / 2, top, BODY.w, BODY.h, 26, 7), fill: OR, stroke: "none" }, g);
    el("path", { d: `M${-BODY.w / 2 + 10},${bot - 30} Q0,${bot - 18} ${BODY.w / 2 - 10},${bot - 30} L${BODY.w / 2 - 10},${bot - 12} Q0,${bot} ${-BODY.w / 2 + 10},${bot - 12} Z`, fill: ORD, opacity: 0.55 }, g);
    el("path", { d: `M${-BODY.w / 2 + 30},${top + 16} Q${-BODY.w / 2 + 70},${top + 8} ${-BODY.w / 2 + 110},${top + 14}`, fill: "none", stroke: ORL, "stroke-width": 8, "stroke-linecap": "round" }, g);
    el("path", { d: wobRect(-BODY.w / 2, top, BODY.w, BODY.h, 26, 7), fill: "none", stroke: INK, "stroke-width": LINE + 1, "stroke-linejoin": "round" }, g);
    if (P.blush > 0) [-78, 78].forEach((bx) => el("ellipse", { cx: bx, cy: BODY.cy + 12, rx: 18, ry: 9, fill: "#ff8a8a", opacity: 0.55 * P.blush }, g));
    // eyes
    const lx = P.look[0] * 10, ly = P.look[1] * 9, es = P.eyeScale;
    [-48, 48].forEach((ex, i) => {
      const cx = ex + lx, cy = BODY.cy - 10 + ly, e = el("g", { transform: `translate(${cx} ${cy}) scale(${es})` }, g);
      if (P.eyes === "happy") el("path", { d: "M-15,6 Q0,-16 15,6", fill: "none", stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, e);
      else if (P.eyes === "closed") el("path", { d: "M-14,2 Q0,9 14,2", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e);
      else if (P.eyes === "x") { el("path", { d: "M-12,-12 L12,12 M12,-12 L-12,12", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, e); }
      else if (P.eyes === "spiral") { let d = ""; for (let k = 0; k <= 40; k++) { const a = k * 0.45 + P.spin * (i ? -1 : 1), r = k * 0.42; d += (k ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + "," + (Math.sin(a) * r).toFixed(1); }
        el("path", { d, fill: "none", stroke: INK, "stroke-width": 4.5, "stroke-linecap": "round" }, e); }
      else if (P.eyes === "tiny") el("circle", { cx: 0, cy: 0, r: 6, fill: INK }, e);
      else {                                                       // the classic pill eye with a glint, and an eyelid that can drop
        el("rect", { x: -11, y: -22, width: 22, height: 44, rx: 11, fill: INK }, e);
        el("ellipse", { cx: -3, cy: -11, rx: 4, ry: 6, fill: WH }, e);
        if (P.lid > 0) { const lh = 44 * clamp(P.lid); el("rect", { x: -16, y: -26, width: 32, height: lh + 4, fill: OR }, e);
          el("line", { x1: -14, y1: -22 + lh, x2: 14, y2: -22 + lh, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, e); }
      }
    });
    // eyebrows: angle per side (+ = inner end down = angry, - = worried), raised by browUp
    if (P.browOn) [-1, 1].forEach((sd) => {                          // + angle = inner end down (angry), - = inner end up (worried)
      const a = (sd < 0 ? P.brow.l : P.brow.r) * Math.PI / 180, cx = sd * 48 + lx * 0.6, cy = BODY.cy - 47 - P.browUp * 0.8 - (P.eyeScale - 1) * 30 + ly * 0.4, h = 19;
      el("line", { x1: cx - sd * h * Math.cos(a), y1: cy + h * Math.sin(a), x2: cx + sd * h * Math.cos(a), y2: cy - h * Math.sin(a), stroke: INK, "stroke-width": 8, "stroke-linecap": "round" }, g);
    });
    // mouth (only for big acting moments, so the classic face stays the default)
    const my = BODY.cy + 36, mo = P.mouthOpen;
    if (P.mouth === "smile") el("path", { d: `M-24,${my - 4} Q0,${my + 14} 24,${my - 4}`, fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g);
    else if (P.mouth === "grin") el("path", { d: `M-30,${my - 8} Q0,${my + 26 * mo + 8} 30,${my - 8} Z`, fill: INK, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    else if (P.mouth === "o") el("ellipse", { cx: 0, cy: my + 2, rx: 9 + 6 * mo, ry: 11 + 12 * mo, fill: INK }, g);
    else if (P.mouth === "flat") el("line", { x1: -16, y1: my, x2: 16, y2: my, stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, g);
    else if (P.mouth === "wavy") el("path", { d: `M-26,${my} q6.5,-8 13,0 t13,0 t13,0 t13,0`, fill: "none", stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    else if (P.mouth === "shout") el("path", { d: `M-26,${my - 10} Q0,${my - 18} 26,${my - 10} Q24,${my + 30 * mo + 10} 0,${my + 30 * mo + 12} Q-24,${my + 30 * mo + 10} -26,${my - 10} Z`, fill: INK }, g);
    if (P.armBehind !== "L") arm(-1, P.armL, false); if (P.armBehind !== "R") arm(1, P.armR, false);
    return g;
  }
  // blend two poses (numbers lerp, discrete fields switch at the middle)
  function mix(a, b, k) {
    const o = {};
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const A = a[key] ?? DEF[key], B = b[key] ?? DEF[key];
      if (typeof A === "number" && typeof B === "number") o[key] = lerp(A, B, k);
      else if (Array.isArray(A) && Array.isArray(B)) o[key] = A.map((v, i) => lerp(v, B[i], k));
      else if (A && B && typeof A === "object") o[key] = mix(A, B, k);
      else o[key] = k < 0.5 ? A : B;
    }
    return o;
  }
  // named poses (arm targets in character space; shoulders at (+-109, -104))
  const POSES = {
    stand: { armL: { x: -165, y: -22 }, armR: { x: 165, y: -22 } },
    take: { eyeScale: 1.5, browUp: 6, brow: { l: -8, r: -8 }, mouth: "o", mouthOpen: 0.7, sy: 1.12, sx: 0.92, armL: { x: -175, y: -170 }, armR: { x: 175, y: -170 } },
    crouch: { sy: 0.78, sx: 1.16, brow: { l: 18, r: 18 }, mouth: "flat", armL: { x: -170, y: -10 }, armR: { x: 170, y: -10 }, look: [0, -1] },
    deadpan: { lid: 0.48, brow: { l: 0, r: 0 }, browUp: -4, mouth: "flat", look: [0, 0], armL: { x: -160, y: -18 }, armR: { x: 160, y: -18 } },
    proud: { eyes: "happy", mouth: "grin", mouthOpen: 0.6, browUp: 8, armL: { x: -165, y: -22 }, armR: { x: 120, y: -260 } },
    worried: { brow: { l: -22, r: -22 }, browUp: 10, mouth: "wavy", armL: { x: -150, y: -150 }, armR: { x: 150, y: -150 } },
    angry: { brow: { l: 26, r: 26 }, browUp: -6, mouth: "flat", lid: 0.25, armL: { x: -175, y: -40 }, armR: { x: 175, y: -40 } },
    cheer: { eyes: "happy", mouth: "grin", mouthOpen: 1, browUp: 14, armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, sy: 1.08, sx: 0.95 },
    dizzy: { eyes: "spiral", mouth: "wavy", brow: { l: -10, r: -10 }, browOn: 0, armL: { x: -170, y: -20 }, armR: { x: 170, y: -20 } },
    scream: { eyeScale: 1.35, mouth: "shout", mouthOpen: 1, browUp: 18, brow: { l: -16, r: -16 }, armL: { x: -170, y: -240 }, armR: { x: 170, y: -240 } },
    shrug: { lid: 0.3, mouth: "flat", browUp: 12, brow: { l: -10, r: -10 }, armL: { x: -190, y: -150 }, armR: { x: 190, y: -150 } },
    reachBack: { look: [1, 0], armR: { x: 30, y: -150 }, armBehind: "R" },
  };

  /* ------------------------------------------------------------------ props */
  const P = {};
  // the idea: a hanging light bulb. lit 0..1 fills it yellow, rays and glow grow
  P.bulb = (parent, { x, y, s = 1, rot = 0, lit = 0, t = 0, cord = 0 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, parent);
    if (cord > 0) el("line", { x1: 0, y1: -82, x2: 0, y2: -82 - cord, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    if (lit > 0) {
      el("circle", { cx: 0, cy: 0, r: 140 * lit, fill: YEL, opacity: 0.22 }, g); el("circle", { cx: 0, cy: 0, r: 100 * lit, fill: YEL, opacity: 0.35 }, g);
      for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.3, r0 = 92, r1 = 92 + (38 + 10 * Math.sin(t * 6 + i)) * lit;
        el("line", { x1: Math.cos(a) * r0, y1: Math.sin(a) * r0, x2: Math.cos(a) * r1, y2: Math.sin(a) * r1, stroke: YELD, "stroke-width": 8, "stroke-linecap": "round" }, g); }
    }
    el("path", { d: "M-30,40 C-30,18 -64,6 -64,-22 C-64,-60 -34,-80 0,-80 C34,-80 64,-60 64,-22 C64,6 30,18 30,40 Z", fill: lit > 0 ? YEL : WH, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-34,-40 Q-30,-62 -10,-66", fill: "none", stroke: WH, "stroke-width": 8, "stroke-linecap": "round", opacity: lit > 0 ? 0.9 : 0.0 }, g);
    el("path", { d: "M-16,38 L-16,8 L-6,-8 L4,8 L14,-8 L16,38", fill: "none", stroke: lit > 0 ? YELD : INK, "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
    el("path", { d: "M-30,40 L30,40 L28,70 Q0,80 -28,70 Z", fill: "#cfd2d6", stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    for (const yy of [50, 60]) el("line", { x1: -28, y1: yy, x2: 28, y2: yy + 4, stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-12,78 Q0,90 12,78", fill: INK, stroke: INK, "stroke-width": 5 }, g);
    return g;
  };
  P.ladder = (parent, { x, y, s = 1, rot = 0 }) => {                 // x,y = bottom centre
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, parent);
    for (const rx of [-22, 22]) el("path", { d: wobRect(rx - 5, -96, 10, 96, 4, rx), fill: OR, stroke: INK, "stroke-width": 5 }, g);
    for (const ry of [-24, -50, -76]) el("line", { x1: -22, y1: ry, x2: 22, y2: ry + 2, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g);
    return g;
  };
  P.spring = (parent, { x, y, s = 1, h = 1 }) => {                   // x,y = bottom centre; h = height factor (squash)
    const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, parent), H = 230 * h, n = 7;
    el("rect", { x: -95, y: -14, width: 190, height: 18, rx: 6, fill: "#cfd2d6", stroke: INK, "stroke-width": LINE }, g);
    let back = "", front = "";
    for (let i = 0; i < n; i++) { const y0 = -14 - i * H / n, y1 = y0 - H / n / 2, y2 = y0 - H / n;
      back += `M-70,${y0} Q0,${y1 - 22} 70,${y1}`; front += `M70,${y1} Q0,${y2 + 22 + H / n * 0.15} -70,${y2}`; }
    el("path", { d: back, fill: "none", stroke: "#8b9096", "stroke-width": 9, "stroke-linecap": "round" }, g);
    el("path", { d: front, fill: "none", stroke: INK, "stroke-width": 11, "stroke-linecap": "round" }, g);
    el("rect", { x: -80, y: -14 - H - 16, width: 160, height: 16, rx: 6, fill: "#cfd2d6", stroke: INK, "stroke-width": LINE }, g);
    return { g, top: -14 - H - 16 };
  };
  P.rocket = (parent, { x, y, s = 1, rot = 0, flame = 0, t = 0 }) => {  // centre of the body; nose points up (-y) before rot
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, parent);
    if (flame > 0) { const f = flame * (1 + 0.18 * Math.sin(t * 50)), f2 = flame * (1 + 0.25 * Math.sin(t * 37 + 1));
      el("path", { d: `M-40,150 Q-30,${150 + 150 * f} 0,${160 + 230 * f} Q30,${150 + 150 * f} 40,150 Z`, fill: OR, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
      el("path", { d: `M-20,150 Q-14,${150 + 90 * f2} 0,${155 + 130 * f2} Q14,${150 + 90 * f2} 20,150 Z`, fill: YEL, stroke: "none" }, g); }
    for (const sd of [-1, 1]) el("path", { d: `M${sd * 55},60 L${sd * 110},150 L${sd * 105},170 L${sd * 52},140 Z`, fill: OR, stroke: INK, "stroke-width": LINE, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-58,150 L-58,-40 C-58,-110 -20,-170 0,-190 C20,-170 58,-110 58,-40 L58,150 Z", fill: WH, stroke: INK, "stroke-width": LINE + 1, "stroke-linejoin": "round" }, g);
    el("path", { d: "M-46,-80 C-36,-130 -14,-165 0,-180 C14,-165 36,-130 46,-80 Z", fill: OR, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    el("circle", { cx: 0, cy: -10, r: 30, fill: "#d9ecff", stroke: INK, "stroke-width": LINE }, g);
    el("path", { d: "M-14,-22 Q-6,-30 6,-30", fill: "none", stroke: WH, "stroke-width": 6, "stroke-linecap": "round" }, g);
    el("rect", { x: -58, y: 90, width: 116, height: 22, fill: OR, stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -40, y: 150, width: 80, height: 22, rx: 6, fill: "#cfd2d6", stroke: INK, "stroke-width": 6 }, g);
    return g;
  };
  // effects
  P.speedLines = (parent, { x, y, ang = -90, n = 5, len = 140, gap = 34, spread = 1 }) => {
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${ang})` }, parent);
    for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * gap * spread, d = 130 + (i % 2) * 50;
      el("line", { x1: -d, y1: off, x2: -d - len * (0.7 + 0.3 * ((i * 7) % 3) / 2), y2: off, stroke: INK, "stroke-width": 6, "stroke-linecap": "round" }, g); }
    return g;
  };
  P.dust = (parent, { x, y, k, n = 3, size = 1 }) => {               // puffs spreading from a landing
    const g = el("g", { opacity: 1 - k * k }, parent);
    for (const sd of [-1, 1]) for (let i = 0; i < n; i++) { const r = (16 + i * 7) * size * (0.6 + 0.6 * k), cx = x + sd * (130 + 90 * k + i * 38) * size, cy = y - 12 - i * 8 - 30 * k;
      el("circle", { cx, cy, r, fill: WH, stroke: INK, "stroke-width": 5 }, g); }
    return g;
  };
  P.impact = (parent, { x, y, s = 1, k = 1, fill = YEL }) => {        // comic burst star
    const g = el("g", { transform: `translate(${x} ${y}) scale(${s * (0.4 + 0.6 * k)})`, opacity: k < 1 ? 1 : 1 }, parent);
    let d = ""; for (let i = 0; i < 20; i++) { const a = i * Math.PI / 10, r = i % 2 ? 46 : 92 + ((i * 13) % 5) * 6; d += (i ? "L" : "M") + Math.cos(a) * r + "," + Math.sin(a) * r; }
    el("path", { d: d + "Z", fill, stroke: INK, "stroke-width": 6, "stroke-linejoin": "round" }, g);
    return g;
  };
  P.stars = (parent, { x, y, t, r = 120, n = 4 }) => {               // dizzy stars orbiting the head
    const g = el("g", {}, parent);
    for (let i = 0; i < n; i++) { const a = t * 5 + i * Math.PI * 2 / n, sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r * 0.3;
      let d = ""; for (let k = 0; k < 10; k++) { const aa = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? 7 : 18; d += (k ? "L" : "M") + (sx + Math.cos(aa) * rr) + "," + (sy + Math.sin(aa) * rr); }
      el("path", { d: d + "Z", fill: YEL, stroke: INK, "stroke-width": 4, "stroke-linejoin": "round", opacity: Math.sin(a) > -0.2 ? 1 : 0.5 }, g); }
    return g;
  };
  P.sparkle = (parent, { x, y, k, n = 8, r = 160, s = 1 }) => {      // burst of 4-point sparkles
    const g = el("g", { opacity: k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3 }, parent);
    for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + 0.2, rr = r * (0.3 + 0.7 * k), cx = x + Math.cos(a) * rr, cy = y + Math.sin(a) * rr, z = (1 - k * 0.6) * 18 * s;
      el("path", { d: `M${cx},${cy - z} Q${cx},${cy} ${cx + z},${cy} Q${cx},${cy} ${cx},${cy + z} Q${cx},${cy} ${cx - z},${cy} Q${cx},${cy} ${cx},${cy - z} Z`, fill: i % 2 ? YEL : OR, stroke: INK, "stroke-width": 3 }, g); }
    return g;
  };
  P.mark = (parent, { x, y, ch = "!", s = 1, k = 1, rot = 0 }) => {  // ! ? pops
    const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s * k})` }, parent);
    const t = el("text", { x: 0, y: 0, "text-anchor": "middle", "font-family": "Permanent Marker", "font-size": 110, fill: OR, stroke: INK, "stroke-width": 5, "paint-order": "stroke" }, g); t.textContent = ch;
    return g;
  };
  P.notes = (parent, { x, y, t }) => {                               // whistling notes
    const g = el("g", {}, parent);
    for (let i = 0; i < 3; i++) { const p = ((t * 0.9 + i / 3) % 1), cx = x + i * 26 + Math.sin(p * 8) * 10, cy = y - p * 120;
      const n = el("text", { x: cx, y: cy, "font-family": "Permanent Marker", "font-size": 44, fill: INK, opacity: Math.sin(p * Math.PI) }, g); n.textContent = i % 2 ? "♪" : "♫"; }
    return g;
  };
  P.smoke = (parent, { pts, t }) => { const g = el("g", {}, parent);   // puff trail
    pts.forEach(([x, y, age], i) => el("circle", { cx: x, cy: y, r: 14 + age * 26, fill: WH, stroke: INK, "stroke-width": 4, opacity: Math.max(0, 1 - age) }, g)); return g; };
  P.shadow = (parent, { x, y, w = 200, k = 1 }) => el("ellipse", { cx: x, cy: y, rx: w / 2 * k, ry: 12 * k, fill: "rgba(0,0,0,.10)" }, parent);

  root.Rig = { clawd, mix, POSES, DEF, props: P, el, clamp, lerp, COLORS: { INK, OR, ORD, ORL, WH, YEL, YELD } };
})(typeof window !== "undefined" ? window : globalThis);
