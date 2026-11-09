// Timeline of the casino short (The Man Who Beat the Wheel, TOON3D style 3: casino interior), built on the bridge engine. Original header:
// Timeline of the bridge short: shots timed to the the voice words (~/bridge-short/voice/words.json),
// story physics (column position, march phase, deck bounce, collapse) and the camera grammar measured in the
// reference study: continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 1908;
export const D0 = 6.0; // bank top + deck height (m)
export const HALF = 27; // towers at z = +-27, span 54 m
export const FILES = [-1.65, -0.55, 0.55, 1.65];
export const ROW_GAP = 1.3;
export const COUNT = 74;
export const PARK: V3 = [70, D0, -75]; // swing pivot base (x, ground y, z)
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
const lin = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
};

// ---------------- story physics (tau = story time in seconds) ----------------
export const front = (tau: number) => 26 - 1.6 * (tau - 4.4); // z of the front row, marching toward -z
export const marchPhase = (tau: number) => ((tau % 1) + 1) % 1; // 1 Hz cycle = 2 steps/s, footfalls at 0 and 0.5
export const SNAP = 34.62, DROP0 = 36.35, DROP1 = 36.95;
export const amp = (tau: number) =>
  lin([[14.85, 0], [17.8, 0.07], [21.4, 0.13], [27.4, 0.26], [33.0, 0.46], [SNAP, 0.55], [SNAP + 0.35, 0.0]], tau);
export const stomp = (tau: number) => lin([[21.4, 1.0], [27.4, 1.35], [33, 1.5]], tau); // "a little harder every step"
export const shapeZ = (z: number) => (Math.abs(z) < HALF ? Math.cos((Math.PI * z) / (2 * HALF)) : 0);
export const dropW = (z: number) => smooth((20 - z) / 26); // 1 on the near half, 0 at the far tower
export const dropU = (tau: number) => (tau < DROP0 ? 0 : Math.min(1, ((tau - DROP0) / (DROP1 - DROP0)) ** 2));
export const DROP_H = 6.6;

export type BridgeState = { bounce: number; drop: number; snap: number; collapsed: boolean };
export const deckY = (z: number, b: BridgeState) => D0 + b.bounce * shapeZ(z) - b.drop * DROP_H * dropW(z);

// ---------------- shots ----------------
export type Light = "day" | "golden" | "night" | "casino";
export type Crowd = "march" | "fall" | "water" | "bank" | "tourists" | "none"
  | "hook" | "solo" | "husband" | "week" | "hundreds" | "council" | "stage" | "more" | "sad" | "yawn" | "grow" | "ban" | "leave" | "stops" | "end"
  | "mob" | "town" | "women" | "buckles" | "victims" | "poster" | "patrols" | "beating" | "helper" | "yard" | "rumor" | "confess" | "gone" | "prison" | "hunters"
  | "winner" | "mill" | "broke" | "balance" | "trip" | "watch" | "lazy" | "betting" | "empties" | "cart" | "millions" | "panic" | "home" | "houses";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
const T0 = (t: number) => t;
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 124, light: "casino", crowd: "winner", tau: T0 },
  { id: 2, a: 124, b: 253, light: "day", crowd: "mill", tau: T0 },
  { id: 3, a: 253, b: 361, light: "golden", crowd: "broke", tau: T0 },
  { id: 4, a: 361, b: 511, light: "day", crowd: "balance", tau: T0 },
  { id: 5, a: 511, b: 639, light: "golden", crowd: "trip", tau: T0 },
  { id: 6, a: 639, b: 805, light: "casino", crowd: "watch", tau: T0 },
  { id: 7, a: 805, b: 938, light: "casino", crowd: "lazy", tau: T0 },
  { id: 8, a: 938, b: 1083, light: "casino", crowd: "betting", tau: T0 },
  { id: 9, a: 1083, b: 1251, light: "casino", crowd: "empties", tau: T0 },
  { id: 10, a: 1251, b: 1449, light: "day", crowd: "cart", tau: T0 },
  { id: 11, a: 1449, b: 1525, light: "casino", crowd: "millions", tau: T0 },
  { id: 12, a: 1525, b: 1673, light: "casino", crowd: "panic", tau: T0 },
  { id: 13, a: 1673, b: 1771, light: "golden", crowd: "home", tau: T0 },
  { id: 14, a: 1771, b: TOTAL, light: "day", crowd: "houses", tau: T0 },
];
/** crossfades (frames) at the trip to Monte Carlo, into and out of the analogy, and the trip home */
export const XFADE: Record<number, number> = { 6: 8, 10: 8, 11: 6, 13: 8, 14: 8 };
export const FLASH_AT = -100;
/** narration beats (frames, from shorts/casino/voice/words.json) shared by cast.ts and the sound mix */
export const BEAT = { stepOut: 0, startDance: 0, noMusic: 0, husband: 0, cant: 0, week: 0, hundreds: 0, plan: 0, danceOut: 0, stage: 0, band: 0, strong: 0,
  more: 0, fear: 0, yawn1: 0, yawn2: 0, yawn3: 0, yawn4: 0, jumps: 0, g30: 0, g100: 0, ban: 0, music: 0, inPublic: 0, off: 0, offEnd: 0,
  nervous: 0, jumped: 0, face: 0, buckles: 0, buckles2: 0, cut1: 0, another: 0, man: 0, slasher: 0, shops: 0, alone: 0,
  patrols: 0, shit: 0, anyone: 0, slashy: 0, runs: 0, mob: 0, decides: 0, chants: 0, head: 0, yard: 0,
  show: 0, shadow: 0, bigger: 0, percy: 0, admits: 0, himself: 0, another2: 0, another3: 0,
  noSlasher: 0, noMallet: 0, noBuckles: 0, charged: 0, four: 323, prison: 0, hurt: 0, hunting: 0,
  fails: 271, nothing: 431, balanced: 484, son: 562, monte: 608, write: 754, lazyW: 828, some: 868, win1: 1005, win2: 1033, win3: 1063,
  empties: 1160, stops: 1190, bring: 1217, bad: 1340, push: 1407, thousand: 1420, million: 1491, panics: 1538, makers: 1568,
  add: 1577, parts: 1586, move: 1599, gone: 1738, bought: 1865, housesW: 1871 } as const;
/** street lamps (night only; none lit in this short) */
export const LAMPS: [number, number][] = [];
export const lampK = (_f: number, _i: number) => 1;
/** the casino room (floor centre) and the hero table's wheel */
export const CASINO: V3 = [300, D0, 0];
export const WHEEL: V3 = [298.85, D0 + 1.056, 0];
const stepTo = (f: number, steps: [number, number][]) => { let v = steps[0][1]; for (let k = 1; k < steps.length; k++) v += (steps[k][1] - steps[k - 1][1]) * smooth((f - steps[k][0]) / 5); return v; };
/** chip stack height factor: a mountain in the hook, a few chips to start, jumps on every "wins", a tower at "two million" */
export const chipsK = (f: number) => (f < 124 ? 2.2 : stepTo(f, [[0, 0.25], [1003, 0.7], [1031, 1.15], [1061, 1.6], [1440, 2.4], [1489, 3.2]]));
/** the black cloth thrown over the table while the bank is empty */
export const clothK = (f: number) => (f >= 1188 && f < 1251 ? 1 : 0);
export const wheelSpin = (f: number) => f * 0.12;
/** the lazy wheel wobbles in its close-up */
export const wheelWobble = (f: number) => (f >= 805 && f < 862 ? 0.05 * Math.sin(f * 0.3) : 0);

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
/** layers to draw at frame f: base shot, plus the next shot fading in during a crossfade */
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

export const bridgeState = (_id: number, _t: number): BridgeState => ({ bounce: 0, drop: 0, snap: 0, collapsed: false });

// ---------------- camera ----------------
// Grammar (motion.md): every move is a symmetric smootherstep glide of 18-40 f (peak speed = 1.875 x distance / dur,
// so dur >= 0.075 x the move in 720p px keeps the peak near the reference 14-25 px/f); a reframe bigger than about
// half a frame width or 40 % zoom is a hard cut on its key frame. Glides are centred on the old key frame (the
// whoosh in the sound mix peaks there), so a glide key starts dur/2 earlier. Holds push in (dolly toward the look
// point or a fov zoom near walls/towers): 0.15-0.35 %/f, ~0.6 %/f for ~35 f on the punch words. Rolls of 4-8 deg
// over >= 18 f on emphasis beats, held tilt <= 0.07 rad.
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep (attack = release, ~10 f each on a 23 f move) */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const mix = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mix(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
const T = (f: number) => f / FPS;
const Fz = (id: number, f: number) => front(SHOTS[id - 1].tau(T(f)));
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (with 8 f soft edges) for the first n frames */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put, for lenses next to towers / houses): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** a roll-only move on top of an existing framing */
const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });

// near-left anchorage where the bolt lives, and the free end of the snapped backstay
export const ANCHOR: V3 = [-2.7, D0 + 0.62, -37];
export const snapEnd = (snap: number): V3 => {
  const u = easeOut(snap);
  return [ANCHOR[0] - 0.6 * u, ANCHOR[1] + 5.5 * u - 2.0 * u * u, ANCHOR[2] + 4.5 * u];
};

// ---- framings for the casino short (casino room at CASINO = (300, D0, 0): hero table at its centre, players behind
// it at z -1.3, lens on the +z side; the mill yard at (-41, -65) in front of the mill facade (z -70); main street x = 0) ----
const C = (x: number, y: number, z: number): V3 => [300 + x, D0 + y, z];
const W1a = (f: number) => dolly(C(0.9, 2.1, 4.6), C(0.3, 1.4, -0.6), pushK(f, 0, 0.0025), { fov: 42 });
const W1b = (f: number) => dolly(C(0.6, 1.7, 2.6), C(0.5, 1.5, -0.8), pushK(f, 60, 0.002), { fov: 38 });
const W2a = (f: number) => dolly([-39.6, D0 + 1.7, -59.5], [-41.2, D0 + 1.9, -66.5], pushK(f, 124, 0.002), { fov: 46 });
const W3a = (f: number) => dolly([0.3, D0 + 1.6, -48.4], [0.3, D0 + 1.2, -56.2], pushK(f, 253, 0.0025), { fov: 42 });
const W4a = (f: number) => dolly([-40.4, D0 + 1.85, -61.6], [-41, D0 + 1.7, -65], pushK(f, 361, 0.002), { fov: 36 });
const W4b = (f: number) => dolly([-41.0, D0 + 1.8, -61.0], [-41.6, D0 + 1.75, -64.4], pushK(f, 431, 0.002), { fov: 38 });
const W5a = (f: number) => dolly([0.4, D0 + 1.6, -49.0], [0, D0 + 1.5, -58], pushK(f, 511, 0.002), { fov: 42 });
const W6a = (f: number) => dolly(C(0.4, 2.0, 4.2), C(0.6, 1.4, -0.9), pushK(f, 639, 0.002), { fov: 44 });
const W7a = (f: number) => dolly(C(-1.15, 3.2, 0.7), C(-1.15, 1.05, 0.0), pushK(f, 805, 0.002), { fov: 46 });
const W7b = (f: number) => dolly(C(0.75, 1.9, 1.6), C(0.6, 1.7, -1.35), pushK(f, 862, 0.002), { fov: 34 });
const W8a = (f: number) => dolly(C(1.6, 1.9, 3.2), C(0.4, 1.3, -0.7), pushK(f, 938, 0.002), { fov: 42 });
const W9a = (f: number) => dolly(C(-0.6, 1.8, 3.0), C(-0.8, 1.35, -0.8), pushK(f, 1083, 0.002), { fov: 42 });
const W10a = (f: number) => dolly([0, D0 + 1.5, -47.0], [0, D0 + 1.0, -55], pushK(f, 1251, 0.0018), { fov: 46 });
const W11a = (f: number) => dolly(C(0.9, 1.9, 3.4), C(0.5, 1.6, -0.6), pushK(f, 1449, 0.003), { fov: 44 });
const W12a = (f: number) => dolly(C(-0.4, 1.9, 3.0), C(-0.6, 1.4, -0.9), pushK(f, 1525, 0.002), { fov: 44 });
const W13a = (f: number) => dolly([0.6, D0 + 1.7, -4.0], [0, D0 + 1.5, 8.0], pushK(f, 1673, 0.002), { fov: 42 });
const W14a = (f: number) => dolly([0.4, D0 + 1.7, -46.0], [0, D0 + 1.5, -55], pushK(f, 1771, 0.002), { fov: 44 });
const W14b = (f: number) => dolly([0.2, D0 + 3.2, -41.5], [0, D0 + 1.9, -58], pushK(f, 1840, 0.0012), { fov: 50 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: W1a }, { f: 60, dur: 28, s: W1b }],
  2: [{ f: 124, s: W2a }],
  3: [{ f: 253, s: W3a }],
  4: [{ f: 361, s: W4a }, { f: 431, dur: 20, s: W4b }],
  5: [{ f: 511, s: W5a }],
  6: [{ f: 635, s: W6a }],
  7: [{ f: 805, s: W7a }, { f: 862, cut: true, s: W7b }],
  8: [{ f: 938, s: W8a }],
  9: [{ f: 1083, s: W9a }],
  10: [{ f: 1247, s: W10a }],
  11: [{ f: 1446, s: W11a }],
  12: [{ f: 1525, s: W12a }],
  13: [{ f: 1669, s: W13a }],
  14: [{ f: 1767, s: W14a }, { f: 1840, dur: 30, s: W14b }],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
const KICKS: [number, number][] = [1005, 1033, 1063, 1188, 1491, 1577, 1586, 1599, 1865].map((f, k) => [f / FPS, [0.4, 0.45, 0.5, 0.5, 0.6, 0.45, 0.45, 0.55, 0.6][k]]);
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(T(f));
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a; // metres at the look distance for 3 px x a
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
/** frame at which the current key's move has finished (for picking billboard views per key, not per frame) */
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field + foreground framing ----------------
/** Lens blur per shot (thin lens). cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
 *  Reference: DOF on in ~1/3 of shots; when on, background sigma720 CU 4.2, MS 4.0, FS 2.7, WS 1.9,
 *  foreground objects 4-8 (disc radius at 1080p = 3 x sigma720). Establishing/wide/most full shots stay sharp.
 *  Entries switch on cuts (no dur) or ramp with the camera glide they share f/dur with. focus = world point (else the
 *  camera look point). */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 8 }, { f: 60, dur: 28, cInf: 12 }, // the winner
  { f: 124, cInf: 6 }, { f: 253, cInf: 10 }, { f: 361, cInf: 13 }, { f: 511, cInf: 8 }, // mill / broke / CU + wheel / the trip
  { f: 639, cInf: 9 }, { f: 805, cInf: 6 }, { f: 862, cInf: 14 }, { f: 938, cInf: 10 }, { f: 1083, cInf: 10 }, // casino
  { f: 1251, cInf: 4 }, { f: 1449, cInf: 10 }, { f: 1525, cInf: 9 }, { f: 1673, cInf: 6 }, // cart / millions / panic / home
  { f: 1771, cInf: 8 }, { f: 1840, dur: 30, cInf: 0 }, // houses
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
/** what the lens focuses on (DOF): the DOF table's focus point, else the camera look point */
export const focusAt = (id: number, f: number): V3 => {
  const d = dofAt(f);
  return d.focus ? d.focus(f) : camAt(id, f).look;
};

/** near framing objects: visible while a <= f < b; kit = a GLB name accepted by build.ts prop() */
// pos = base point (prop()'s x, y, z: the model's base sits on y), s = height in metres (prop()'s h), yaw in radians.
// They sit at 0.3-0.5 x the focus distance and cover 10-25 % of one frame edge, never a face; they are meant to be
// in front of the lens, so build them outside prop()'s sight-line test.
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [];
