// Timeline of the tower short (The Man Who Sold the Eiffel Tower, TOON3D style 4: flat-colour interior), built on the bridge engine. Original header:
// Timeline of the bridge short: shots timed to the the voice words (~/bridge-short/voice/words.json),
// story physics (column position, march phase, deck bounce, collapse) and the camera grammar measured in the
// reference study: continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 2107;
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
  | "sold" | "paper" | "letters" | "invite" | "whisper" | "poisson" | "move" | "crooked" | "relaxes" | "pays" | "magic" | "shame" | "back" | "again";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
const T0 = (t: number) => t;
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 148, light: "suite", crowd: "sold", tau: T0 },
  { id: 2, a: 148, b: 290, light: "day", crowd: "paper", tau: T0 },
  { id: 3, a: 290, b: 437, light: "suite", crowd: "letters", tau: T0 },
  { id: 4, a: 437, b: 564, light: "suite", crowd: "invite", tau: T0 },
  { id: 5, a: 564, b: 704, light: "suite", crowd: "whisper", tau: T0 },
  { id: 6, a: 704, b: 878, light: "suite", crowd: "poisson", tau: T0 },
  { id: 7, a: 878, b: 956, light: "suite", crowd: "move", tau: T0 },
  { id: 8, a: 956, b: 1086, light: "suite", crowd: "crooked", tau: T0 },
  { id: 9, a: 1086, b: 1209, light: "suite", crowd: "relaxes", tau: T0 },
  { id: 10, a: 1209, b: 1368, light: "suite", crowd: "pays", tau: T0 },
  { id: 11, a: 1368, b: 1579, light: "suite", crowd: "magic", tau: T0 },
  { id: 12, a: 1579, b: 1692, light: "suite", crowd: "shame", tau: T0 },
  { id: 13, a: 1692, b: 1743, light: "day", crowd: "back", tau: T0 },
  { id: 14, a: 1743, b: 1924, light: "suite", crowd: "again", tau: T0 },
  { id: 15, a: 1924, b: TOTAL, light: "suite", crowd: "prison", tau: T0 },
];
/** crossfades (frames) into the magic-trick analogy and into the prison */
export const XFADE: Record<number, number> = { 11: 8, 15: 8 };
export const FLASH_AT = -100;
/** narration beats (frames, from shorts/tower/voice/words.json) */
/** the earlier shorts' beat table (kept so the shared helpers in cast.ts still resolve) */
export const BEAT = {} as Record<string, number>;
export const BT = { rusting: 213, deputy: 379, hotel: 528, whispers: 586, scrap: 635, nobody: 665, newInTown: 794, bigShot: 853,
  confesses: 933, tiny: 1013, monsieur: 1035, relaxes: 1097, bribe: 1126, works: 1187, pays: 1213, grabs: 1300, runs: 1327,
  show: 1488, figure: 1540, embarrassed: 1623, police1: 1660, comesBack: 1708, tries: 1743, someone: 1828, police2: 1855, escapes: 1874,
  alcatraz: 1991, landmark: 2033 } as const;
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
const W1a = (f: number) => dolly(S(0.6, 1.9, 4.2), S(0.9, 1.6, -1.6), pushK(f, 0, 0.0025), { fov: 44 });
const W2a = (f: number) => dolly([0.5, D0 + 1.75, -51.8], [0.3, D0 + 1.55, -55], pushK(f, 148, 0.002), { fov: 38 });
const W3a = (f: number) => dolly(S(-5.6, 1.75, -0.4), S(-6.2, 1.35, -5.2), pushK(f, 290, 0.002), { fov: 40 });
const W4a = (f: number) => dolly(S(0.3, 2.2, 5.2), S(0.1, 1.5, -2.0), pushK(f, 437, 0.0018), { fov: 50 });
const W5a = (f: number) => dolly(S(1.9, 1.8, 3.4), S(1.75, 1.5, -1.7), pushK(f, 564, 0.002), { fov: 48 });
const W6a = (f: number) => dolly(S(0.75, 1.85, 0.5), S(0.7, 1.7, -2.0), pushK(f, 704, 0.002), { fov: 34 });
const W7a = (f: number) => dolly(S(2.2, 1.85, 0.7), S(2.45, 1.7, -1.3), pushK(f, 878, 0.002), { fov: 34 });
const W8a = (f: number) => dolly(S(1.9, 1.8, 3.2), S(1.75, 1.5, -1.7), pushK(f, 956, 0.002), { fov: 48 });
const W9a = (f: number) => dolly(S(0.75, 1.85, 0.5), S(0.7, 1.7, -2.0), pushK(f, 1086, 0.002), { fov: 34 });
const W10a = (f: number) => dolly(S(1.2, 2.0, 3.8), S(1.5, 1.4, -1.6), pushK(f, 1209, 0.002), { fov: 46 });
const W11a = (f: number) => dolly(S(1.0, 1.75, 1.6), S(1.0, 1.25, -1.2), pushK(f, 1368, 0.002), { fov: 42 });
const W12a = (f: number) => dolly(S(0.7, 1.8, 2.0), S(0.7, 1.45, -1.8), pushK(f, 1579, 0.002), { fov: 40 });
const W13a = (f: number) => dolly([0.4, D0 + 1.6, -49.5], [0, D0 + 1.5, -57], pushK(f, 1692, 0.0025), { fov: 42 });
const W14a = (f: number) => dolly(S(0.3, 2.2, 5.2), S(0.4, 1.5, -2.0), pushK(f, 1743, 0.0018), { fov: 50 });
const W15a = (f: number) => dolly(Q(0.1, 1.6, 6.6), Q(-0.1, 1.4, -0.4), pushK(f, 1924, 0.002), { fov: 40 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: W1a }], 2: [{ f: 148, s: W2a }], 3: [{ f: 290, s: W3a }], 4: [{ f: 437, s: W4a }], 5: [{ f: 564, s: W5a }],
  6: [{ f: 704, s: W6a }], 7: [{ f: 878, s: W7a }], 8: [{ f: 956, s: W8a }], 9: [{ f: 1086, s: W9a }], 10: [{ f: 1209, s: W10a }],
  11: [{ f: 1364, s: W11a }], 12: [{ f: 1579, s: W12a }], 13: [{ f: 1692, s: W13a }], 14: [{ f: 1743, s: W14a }], 15: [{ f: 1920, s: W15a }],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
const KICKS: [number, number][] = [379, 635, 856, 1300, 1540, 1855, 1991, 2033].map((f, k) => [f / FPS, [0.4, 0.4, 0.4, 0.4, 0.35, 0.5, 0.6, 0.4][k]]);
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
  { f: 0, cInf: 8 }, { f: 148, cInf: 13 }, { f: 290, cInf: 10 }, { f: 437, cInf: 4 }, { f: 564, cInf: 9 }, { f: 704, cInf: 14 },
  { f: 878, cInf: 14 }, { f: 956, cInf: 10 }, { f: 1086, cInf: 14 }, { f: 1209, cInf: 7 }, { f: 1368, cInf: 11 }, { f: 1579, cInf: 10 },
  { f: 1692, cInf: 8 }, { f: 1743, cInf: 4 }, { f: 1924, cInf: 8 },
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
