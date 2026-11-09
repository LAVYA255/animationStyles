// Timeline of the slasher short (The Slasher Who Never Existed, TOON3D style 2: night street), built on the bridge engine. Original header:
// Timeline of the bridge short: shots timed to the the voice words (~/bridge-short/voice/words.json),
// story physics (column position, march phase, deck bounce, collapse) and the camera grammar measured in the
// reference study: continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 1864;
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
export type Light = "day" | "golden" | "night";
export type Crowd = "march" | "fall" | "water" | "bank" | "tourists" | "none"
  | "hook" | "solo" | "husband" | "week" | "hundreds" | "council" | "stage" | "more" | "sad" | "yawn" | "grow" | "ban" | "leave" | "stops" | "end"
  | "mob" | "town" | "women" | "buckles" | "victims" | "poster" | "patrols" | "beating" | "helper" | "yard" | "rumor" | "confess" | "gone" | "prison" | "hunters";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
const T0 = (t: number) => t;
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 126, light: "night", crowd: "mob", tau: T0 },
  { id: 2, a: 126, b: 271, light: "night", crowd: "town", tau: T0 },
  { id: 3, a: 271, b: 367, light: "night", crowd: "women", tau: T0 },
  { id: 4, a: 367, b: 487, light: "night", crowd: "buckles", tau: T0 },
  { id: 5, a: 487, b: 638, light: "night", crowd: "victims", tau: T0 },
  { id: 6, a: 638, b: 732, light: "night", crowd: "poster", tau: T0 },
  { id: 7, a: 732, b: 846, light: "night", crowd: "patrols", tau: T0 },
  { id: 8, a: 846, b: 958, light: "night", crowd: "beating", tau: T0 },
  { id: 9, a: 958, b: 1089, light: "night", crowd: "helper", tau: T0 },
  { id: 10, a: 1089, b: 1168, light: "night", crowd: "yard", tau: T0 },
  { id: 11, a: 1168, b: 1395, light: "night", crowd: "rumor", tau: T0 },
  { id: 12, a: 1395, b: 1546, light: "night", crowd: "confess", tau: T0 },
  { id: 13, a: 1546, b: 1622, light: "night", crowd: "gone", tau: T0 },
  { id: 14, a: 1622, b: 1739, light: "night", crowd: "prison", tau: T0 },
  { id: 15, a: 1739, b: TOTAL, light: "night", crowd: "hunters", tau: T0 },
];
/** crossfades (frames) into the analogy, the vanishing and the ending; no white flash in this one */
export const XFADE: Record<number, number> = { 11: 8, 13: 6, 15: 8 };
export const FLASH_AT = -100;
/** narration beats (frames, from shorts/slasher/voice/words.json) shared by cast.ts and the sound mix */
export const BEAT = { stepOut: 0, startDance: 0, noMusic: 0, husband: 0, cant: 0, week: 0, hundreds: 0, plan: 0, danceOut: 0, stage: 0, band: 0, strong: 0,
  more: 0, fear: 0, yawn1: 0, yawn2: 0, yawn3: 0, yawn4: 0, jumps: 0, g30: 0, g100: 0, ban: 0, music: 0, inPublic: 0, off: 0, offEnd: 0,
  nervous: 237, jumped: 325, face: 389, buckles: 451, buckles2: 458, cut1: 539, another: 575, man: 611, slasher: 711, shops: 741, alone: 766,
  patrols: 806, shit: 888, anyone: 903, slashy: 933, runs: 967, mob: 1012, decides: 1019, chants: 1056, head: 1073, yard: 1099,
  show: 1284, shadow: 1347, bigger: 1368, percy: 1419, admits: 1433, himself: 1448, another2: 1480, another3: 1519,
  noSlasher: 1558, noMallet: 1582, noBuckles: 1601, charged: 1644, four: 1687, prison: 1705, hurt: 1793, hunting: 1824 } as const;
/** street lamps along the main street (x = +-5.2, every 8 m) */
export const LAMPS: [number, number][] = [[-5.2, -41], [5.2, -49], [-5.2, -57], [5.2, -65], [-5.2, -73], [5.2, -81]];
const FLICK = [1, 0.15, 0.9, 0.1, 0.1, 0.8, 0.05, 0.6, 0.05, 0.05, 0.3, 0.05, 0.05, 0.05, 0.05, 0.04];
/** lamp brightness 0..1: the lamp over the battered hunters (index 1) sputters out at the very end */
export const lampK = (f: number, i: number) => (i === 1 && f >= 1836 ? FLICK[Math.min(FLICK.length - 1, f - 1836)] : 1);

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

// ---- framings for the slasher short (main street x = 0 running -z from the quay; house fronts at x = +-6; lamps LAMPS;
// notice board with the WANTED poster at (3.6, -60.5) facing -z) ----
const W1a = (f: number) => dolly([0.8, D0 + 1.8, -49.6], [0, D0 + 1.6, -60], pushK(f, 0, 0.0025), { fov: 44 });
const W1b = (f: number) => dolly([0.5, D0 + 1.6, -51.8], [0, D0 + 1.75, -58], pushK(f, 64, 0.0022), { fov: 40, roll: -0.03 });
const W2a = (f: number) => zoom([14, D0 + 13, -37], [0, D0 + 1, -62], 46, pushK(f, 126, 0.002));
const W2b = (f: number) => dolly([-2.3, D0 + 1.6, -52.2], [-4.0, D0 + 1.5, -56.6], pushK(f, 226, 0.003), { fov: 38 });
const W3a = (f: number) => dolly([-1.6, D0 + 1.6, -52.4], [-3.8, D0 + 1.4, -58.4], pushK(f, 271, 0.0025), { fov: 40 });
const W4a = (f: number) => dolly([-3.1, D0 + 1.95, -57.6], [-3.7, D0 + 1.75, -61.0], pushK(f, 367, 0.002), { fov: 34 });
const W4b = (f: number) => dolly([-3.3, D0 + 0.55, -58.9], [-3.7, D0 + 0.2, -61.0], pushK(f, 430, 0.002), { fov: 34 });
const W5a = (f: number) => dolly([0, D0 + 1.6, -43.4], [0, D0 + 1.3, -51.2], pushK(f, 487, 0.0022), { fov: 42 });
const W6a = (f: number) => dolly([3.0, D0 + 1.8, -66.4], [3.6, D0 + 1.62, -60.5], pushK(f, 638, 0.0025), { fov: 44 });
const W6b = (f: number) => dolly([3.45, D0 + 1.68, -64.1], [3.6, D0 + 1.62, -60.5], pushK(f, 704, 0.002), { fov: 40 });
const W7a = (f: number) => dolly([0.5, D0 + 2.4, -42.5], [0, D0 + 1.2, -60], pushK(f, 732, 0.002), { fov: 46 });
const W7b = (f: number) => dolly([0.3, D0 + 1.4, -55.0], [0, D0 + 1.75, -63], pushK(f, 806, 0.003), { fov: 40 });
const W8a = (f: number) => dolly([1.6, D0 + 1.7, -52.6], [0.4, D0 + 1.3, -57.8], pushK(f, 846, 0.0025), { fov: 40 });
const W9a = (f: number) => dolly([0.6, D0 + 1.7, -51.0], [-0.3, D0 + 1.2, -57.2], pushK(f, 958, 0.002), { fov: 44 });
const W9b = (f: number) => dolly([1.5, D0 + 1.7, -53.6], [0.6, D0 + 1.5, -59.6], pushK(f, 1040, 0.002), { fov: 40 });
const W10a = (f: number) => dolly([0, D0 + 0.75, -55.6], [0, D0 + 1.8, -64], pushK(f, 1089, 0.003), { fov: 38 });
const W11a = (f: number) => dolly([-2.4, D0 + 1.5, -51.0], [-4.2, D0 + 1.9, -58.5], pushK(f, 1168, 0.0018), { fov: 40 });
const W11b = (f: number) => dolly([-1.9, D0 + 1.6, -48.6], [-4.0, D0 + 3.0, -60.5], pushK(f, 1320, 0.0015), { fov: 48 });
const W12a = (f: number) => dolly([0.2, D0 + 1.75, -51.8], [0, D0 + 1.65, -55], pushK(f, 1395, 0.002), { fov: 34 });
const W12b = (f: number) => dolly([0.3, D0 + 1.8, -48.6], [0, D0 + 1.4, -55], pushK(f, 1470, 0.002), { fov: 44 });
const W13a = (f: number) => dolly([-0.4, D0 + 1.6, -53.4], [-1.2, D0 + 1.5, -60], pushK(f, 1546, 0.0028), { fov: 40 });
const W14a = (f: number) => dolly([0, D0 + 1.6, -47.6], [0, D0 + 1.3, -55], pushK(f, 1622, 0.0022), { fov: 44 });
const W15a = (f: number) => dolly([1.4, D0 + 1.7, -45.2], [2.2, D0 + 1.4, -50.6], pushK(f, 1739, 0.002), { fov: 40 });
const W15b = (f: number) => dolly([0.4, D0 + 3.4, -40.6], [1.6, D0 + 1.1, -51.0], pushK(f, 1800, 0.0012), { fov: 48 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: W1a }, { f: 64, dur: 30, s: W1b }],
  2: [{ f: 122, s: W2a }, { f: 226, cut: true, s: W2b }],
  3: [{ f: 271, s: W3a }],
  4: [{ f: 367, s: W4a }, { f: 430, dur: 18, s: W4b }],
  5: [{ f: 487, s: W5a }],
  6: [{ f: 638, s: W6a }, { f: 704, dur: 8, s: W6b }],
  7: [{ f: 732, s: W7a }, { f: 806, cut: true, s: W7b }],
  8: [{ f: 846, s: W8a }],
  9: [{ f: 958, s: W9a }, { f: 1040, dur: 20, s: W9b }],
  10: [{ f: 1089, s: W10a }],
  11: [{ f: 1164, s: W11a }, { f: 1320, dur: 34, s: W11b }],
  12: [{ f: 1395, s: W12a }, { f: 1470, dur: 22, s: W12b }],
  13: [{ f: 1543, s: W13a }],
  14: [{ f: 1622, s: W14a }],
  15: [{ f: 1735, s: W15a }, { f: 1800, dur: 40, s: W15b }],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
const KICKS: [number, number][] = [325, 711, 888, 903, 933, 1019, 1558, 1705].map((f, k) => [f / FPS, [0.6, 0.5, 0.5, 0.5, 0.6, 0.35, 0.4, 0.6][k]]);
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
  { f: 0, cInf: 0 }, { f: 64, dur: 30, cInf: 10 }, // the mob: wide -> MS of the front row
  { f: 126, cInf: 0 }, { f: 226, cInf: 12 }, // foggy town aerial / two nervous neighbours
  { f: 271, cInf: 10 }, { f: 367, cInf: 14 }, { f: 487, cInf: 8 }, // women + the shape / CU + buckles / the victims
  { f: 638, cInf: 12, focus: () => [3.6, D0 + 1.62, -60.5] }, { f: 732, cInf: 0 }, { f: 806, cInf: 8 }, // poster / street / patrol
  { f: 846, cInf: 10 }, { f: 958, cInf: 8 }, { f: 1089, cInf: 9 }, { f: 1168, cInf: 6 }, // beating / helper / the Yard / analogy
  { f: 1395, cInf: 13 }, { f: 1470, dur: 22, cInf: 9 }, { f: 1546, cInf: 8 }, { f: 1622, cInf: 8 }, // confessions / gone / prison
  { f: 1739, cInf: 10 }, { f: 1800, dur: 40, cInf: 4 }, // the battered hunters
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
