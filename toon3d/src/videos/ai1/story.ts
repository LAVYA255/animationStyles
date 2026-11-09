// Timeline of AI explainer 1 (Why AI Can't Count the R's in Strawberry), built on the bridge engine. Original header:
// Timeline of the bridge short: shots timed to the the voice words (~/bridge-short/voice/words.json),
// story physics (column position, march phase, deck bounce, collapse) and the camera grammar measured in the
// reference study: continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 1278;
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
export type Light = "day" | "golden" | "night" | "casino" | "suite";
export type Crowd = "march" | "fall" | "water" | "bank" | "tourists" | "none"
  | "hook" | "solo" | "husband" | "week" | "hundreds" | "council" | "stage" | "more" | "sad" | "yawn" | "grow" | "ban" | "leave" | "stops" | "end"
  | "mob" | "town" | "women" | "buckles" | "victims" | "poster" | "patrols" | "beating" | "helper" | "yard" | "rumor" | "confess" | "gone" | "prison" | "hunters"
  | "winner" | "mill" | "broke" | "balance" | "trip" | "watch" | "lazy" | "betting" | "empties" | "cart" | "millions" | "panic" | "home" | "houses"
  | "sold" | "paper" | "letters" | "invite" | "whisper" | "poisson" | "move" | "crooked" | "relaxes" | "pays" | "magic" | "shame" | "back" | "again"
  | "ask" | "poem" | "chop" | "tokens" | "menu" | "guess" | "spell" | "fruit";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
const T0 = (t: number) => t;
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 131, light: "day", crowd: "ask", tau: T0 },
  { id: 2, a: 131, b: 235, light: "day", crowd: "poem", tau: T0 },
  { id: 3, a: 235, b: 418, light: "day", crowd: "chop", tau: T0 },
  { id: 4, a: 418, b: 653, light: "day", crowd: "tokens", tau: T0 },
  { id: 5, a: 653, b: 903, light: "suite", crowd: "menu", tau: T0 },
  { id: 6, a: 903, b: 1016, light: "day", crowd: "guess", tau: T0 },
  { id: 7, a: 1016, b: 1162, light: "day", crowd: "spell", tau: T0 },
  { id: 8, a: 1162, b: TOTAL, light: "golden", crowd: "fruit", tau: T0 },
];
export const XFADE: Record<number, number> = { 5: 8, 6: 8, 8: 8 };
export const FLASH_AT = -100;
export const BEAT = {} as Record<string, number>;
/** narration beats (frames, from shorts/ai1/voice/words.json) */
export const BT = { two: 110, poem: 150, count: 178, why: 207, never: 241, letters: 262, chopped: 355, chunks: 370, tokens: 393,
  str: 479, aw: 502, berry: 531, three: 562, swapped: 610, number: 629, menu: 710, dish: 736, num7: 796, pizza: 811, olives: 865,
  counting: 957, guessing: 978, spell: 1045, letterBy: 1090, count2: 1127, smartest: 1165, beaten: 1214, fruit: 1238 } as const;
/** the hotel suite (floor centre; table at z - 1, players behind it at z - 2) and the prison cell (open toward +z) */
export const SUITE: V3 = [-300, D0, -8];
export const CELL: V3 = [-300, D0, 18];
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

// ---- framings for the tower short (suite at SUITE: back wall + window at z - 7, table centre z - 1, players at z - 2,
// Lustig at the table's right end; the desk at x - 6.2, z - 4.6; the cell at CELL, open toward +z) ----
const S = (x: number, y: number, z: number): V3 => [SUITE[0] + x, D0 + y, SUITE[2] + z];
const Q = (x: number, y: number, z: number): V3 => [CELL[0] + x, D0 + y, CELL[2] + z];
const W1a = (f: number) => dolly([0, D0 + 1.6, -49.4], [0, D0 + 1.4, -55.4], pushK(f, 0, 0.0025), { fov: 42 });
const W1b = (f: number) => dolly([0.1, D0 + 1.75, -50.6], [0.2, D0 + 1.6, -55.3], pushK(f, 100, 0.002), { fov: 42 });
const W2a = (f: number) => dolly([0.35, D0 + 1.75, -51.4], [0.35, D0 + 1.5, -55.3], pushK(f, 131, 0.002), { fov: 46 });
const W3a = (f: number) => dolly([-0.3, D0 + 1.8, -48.6], [-0.3, D0 + 1.3, -55.6], pushK(f, 235, 0.0018), { fov: 46 });
const W4a = (f: number) => dolly([0, D0 + 1.6, -48.6], [0, D0 + 1.3, -55.2], pushK(f, 418, 0.0015), { fov: 44 });
const W5a = (f: number) => dolly(S(1.0, 1.8, 2.4), S(1.0, 1.4, -1.6), pushK(f, 653, 0.002), { fov: 44 });
const W5b = (f: number) => dolly(S(0.9, 1.45, 0.4), S(0.9, 1.0, -0.8), pushK(f, 850, 0.002), { fov: 38 });
const W6a = (f: number) => dolly([0.7, D0 + 1.75, -51.8], [0.8, D0 + 1.6, -55.3], pushK(f, 903, 0.002), { fov: 38 });
const W7a = (f: number) => dolly([0, D0 + 1.6, -48.4], [0, D0 + 1.35, -55.4], pushK(f, 1016, 0.0015), { fov: 44 });
const W8a = (f: number) => dolly([0, D0 + 1.6, -49.8], [0, D0 + 1.3, -55.3], pushK(f, 1162, 0.0022), { fov: 44 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: W1a }, { f: 100, dur: 14, s: W1b }], 2: [{ f: 131, s: W2a }], 3: [{ f: 235, s: W3a }], 4: [{ f: 418, s: W4a }],
  5: [{ f: 649, s: W5a }, { f: 850, dur: 20, s: W5b }], 6: [{ f: 899, s: W6a }], 7: [{ f: 1012, s: W7a }], 8: [{ f: 1158, s: W8a }],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
const KICKS: [number, number][] = [110, 355, 370, 1127, 1238].map((f, k) => [f / FPS, [0.4, 0.5, 0.4, 0.35, 0.7][k]]);
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
  { f: 0, cInf: 8 }, { f: 100, dur: 14, cInf: 13 }, { f: 131, cInf: 12 }, { f: 235, cInf: 8 }, { f: 418, cInf: 8 },
  { f: 653, cInf: 8 }, { f: 850, dur: 20, cInf: 12 }, { f: 903, cInf: 13 }, { f: 1016, cInf: 8 }, { f: 1162, cInf: 10 },
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
