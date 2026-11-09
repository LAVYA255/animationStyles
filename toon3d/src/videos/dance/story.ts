// Timeline of the dance short (The Town That Couldn't Stop Dancing), built on the bridge engine. Original header:
// Timeline of the bridge short: shots timed to the the voice words (~/bridge-short/voice/words.json),
// story physics (column position, march phase, deck bounce, collapse) and the camera grammar measured in the
// reference study: continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
export const FPS = 30;
export const TOTAL = 1915;
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
export type Light = "day" | "golden";
export type Crowd = "march" | "fall" | "water" | "bank" | "tourists" | "none"
  | "hook" | "solo" | "husband" | "week" | "hundreds" | "council" | "stage" | "more" | "sad" | "yawn" | "grow" | "ban" | "leave" | "stops" | "end";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
const T0 = (t: number) => t;
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 139, light: "day", crowd: "hook", tau: T0 },
  { id: 2, a: 139, b: 214, light: "day", crowd: "none", tau: T0 },
  { id: 3, a: 214, b: 345, light: "day", crowd: "solo", tau: T0 },
  { id: 4, a: 345, b: 461, light: "day", crowd: "husband", tau: T0 },
  { id: 5, a: 461, b: 546, light: "day", crowd: "week", tau: T0 },
  { id: 6, a: 546, b: 611, light: "day", crowd: "hundreds", tau: T0 },
  { id: 7, a: 611, b: 777, light: "day", crowd: "council", tau: T0 },
  { id: 8, a: 777, b: 916, light: "day", crowd: "stage", tau: T0 },
  { id: 9, a: 916, b: 1013, light: "day", crowd: "more", tau: T0 },
  { id: 10, a: 1013, b: 1199, light: "golden", crowd: "sad", tau: T0 },
  { id: 11, a: 1199, b: 1381, light: "day", crowd: "yawn", tau: T0 },
  { id: 12, a: 1381, b: 1484, light: "day", crowd: "grow", tau: T0 },
  { id: 13, a: 1484, b: 1598, light: "day", crowd: "ban", tau: T0 },
  { id: 14, a: 1598, b: 1668, light: "golden", crowd: "leave", tau: T0 },
  { id: 15, a: 1668, b: 1736, light: "golden", crowd: "stops", tau: T0 },
  { id: 16, a: 1736, b: TOTAL, light: "day", crowd: "end", tau: T0 },
];
/** crossfades (frames) at place/time changes; a white 4-frame flash after the hook */
export const XFADE: Record<number, number> = { 10: 8, 11: 8, 14: 8, 16: 8 };
export const FLASH_AT = 139;
/** narration beats (frames, from shorts/dance/voice/words.json) shared by cast.ts and the sound mix */
export const BEAT = { stepOut: 214, startDance: 257, noMusic: 294, husband: 345, cant: 391, week: 491, hundreds: 584, plan: 682,
  danceOut: 745, stage: 789, band: 818, strong: 850, more: 946, fear: 1123, yawn1: 1229, yawn2: 1261, yawn3: 1268, yawn4: 1280, jumps: 1355,
  g30: 1415, g100: 1460, ban: 1554, music: 1561, inPublic: 1570, off: 1864, offEnd: 1882 } as const;

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

// ---- framings for the dance short (world: main street x = 0 running -z from the quay; houses at x = +-10, fronts at
// x = +-6; quay z -29..-36 with the stage at (8.5, -34.3); park at PARK; church across the river at +z) ----
const W1a = (f: number) => dolly([4, D0 + 4.5, -40], [0, D0 + 1.2, -58], pushK(f, 0, 0.0025), { fov: 46 });
const W1b = (f: number) => dolly([1.2, D0 + 1.7, -46.5], [-0.6, D0 + 1.5, -53], pushK(f, 58, 0.002), { fov: 40, roll: -0.04 });
const W2a = (f: number) => zoom([20, D0 + 18, -28], [0, D0 + 2, -60], 46, pushK(f, 139, 0.002));
const W2b = (f: number) => zoom([12, D0 + 11, -38], [-2.5, D0 + 1.5, -55], 42, pushK(f, 170, 0.002));
const W3a = (f: number) => dolly([2.2, D0 + 1.6, -48.5], [-3.5, D0 + 1.4, -54.5], pushK(f, 214, 0.0025), { fov: 40 });
const W3b = (f: number) => dolly([1.2, D0 + 1.6, -49.5], [-2.2, D0 + 1.5, -54], pushK(f, 245, 0.002), { fov: 38, roll: 0.04 });
const W3c = (f: number) => dolly([-1.4, D0 + 1.75, -51.4], [-2.2, D0 + 1.7, -54], pushK(f, 292, 0.0025, 0.006, 30), { fov: 34 });
const W4a = (f: number) => dolly([0.4, D0 + 1.6, -48.4], [-2.6, D0 + 1.45, -54], pushK(f, 345, 0.0025), { fov: 40 });
const W4b = (f: number) => dolly([-1.1, D0 + 1.65, -51.0], [-2.2, D0 + 1.55, -54], pushK(f, 400, 0.002), { fov: 36, roll: -0.04 });
const W5a = (f: number) => dolly([3, D0 + 3.2, -42], [0, D0 + 1.2, -57], pushK(f, 461, 0.0025), { fov: 44 });
const W5b = (f: number) => dolly([1.6, D0 + 2.3, -45.5], [0, D0 + 1.3, -56], pushK(f, 480, 0.002), { fov: 42 });
const W6a = (f: number) => zoom([24, D0 + 24, -20], [0, D0, -46], 48, pushK(f, 546, 0.0018, 0.005, 30));
const W7a = (f: number) => dolly([2.6, D0 + 1.6, -56.5], [-4.6, D0 + 1.4, -61.2], pushK(f, 611, 0.0025), { fov: 40 });
const W7b = (f: number) => dolly([0.2, D0 + 1.6, -58.3], [-4.4, D0 + 1.55, -61], pushK(f, 672, 0.002), { fov: 38 });
const W8a = (f: number) => dolly([6.0, D0 + 2.0, -27.6], [8.6, D0 + 1.4, -34.3], pushK(f, 777, 0.0025), { fov: 44 });
const W8b = (f: number) => dolly([5.4, D0 + 2.8, -27.2], [8.0, D0 + 1.1, -34.4], pushK(f, 836, 0.002), { fov: 48 });
const W9a = (f: number) => dolly([6.5, D0 + 4.4, -27.0], [6.5, D0 + 0.8, -36.0], pushK(f, 916, 0.0022), { fov: 50 });
const W10a = (f: number) => dolly([-4.7, D0 + 1.5, -26.4], [-4.6, D0 + 0.85, -33], pushK(f, 1009, 0.002), { fov: 42 });
const W10b = (f: number) => dolly([-4.2, D0 + 1.3, -29.2], [-4.6, D0 + 0.9, -33], pushK(f, 1110, 0.002), { fov: 38 });
const W11a = (f: number) => dolly([69.5, D0 + 1.6, -62.2], [69.5, D0 + 1.3, -71], pushK(f, 1195, 0.002), { fov: 42 });
const W11b = (f: number) => dolly([70.6, D0 + 1.4, -66.0], [71.0, D0 + 1.2, -71], pushK(f, 1330, 0.003), { fov: 38 });
const W12a = (f: number) => zoom([18, D0 + 20, -30], [0, D0, -58], 46, pushK(f, 1381, 0.0018, 0.005, 30));
const W13a = (f: number) => zoom([1.3, D0 + 1.6, -36.6], [2.9, D0 + 1.3, -31.2], 42, pushK(f, 1484, 0.0025, 0.004, 24));
const W14a = (f: number) => dolly([1.2, D0 + 2.6, -36], [0, D0 + 1.3, 0], pushK(f, 1594, 0.0015), { fov: 40 });
const W15a = (f: number) => dolly([1.2, D0 + 1.6, -49.5], [-2.2, D0 + 1.5, -54], pushK(f, 1664, 0.0025), { fov: 38 });
const W16a = (f: number) => dolly([6.0, D0 + 2.0, -27.6], [8.6, D0 + 1.4, -34.3], pushK(f, 1732, 0.002), { fov: 44 });
const W16b = (f: number) => dolly([7.6, D0 + 2.1, -28.0], [8.6, D0 + 1.75, -34.0], pushK(f, 1820, 0.002, 0.005, 30), { fov: 34 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: W1a }, { f: 58, dur: 34, s: W1b }],
  2: [{ f: 135, s: W2a }, { f: 170, dur: 26, s: W2b }],
  3: [{ f: 214, s: W3a }, { f: 245, dur: 24, s: W3b }, { f: 292, cut: true, s: W3c }],
  4: [{ f: 345, s: W4a }, { f: 400, dur: 26, s: W4b }],
  5: [{ f: 461, s: W5a }, { f: 480, dur: 30, s: W5b }],
  6: [{ f: 546, s: W6a }],
  7: [{ f: 611, s: W7a }, { f: 672, dur: 24, s: W7b }, { f: 740, dur: 20, s: rolled(W7b, 0.04) }],
  8: [{ f: 777, s: W8a }, { f: 836, dur: 30, s: W8b }],
  9: [{ f: 912, s: W9a }],
  10: [{ f: 1009, s: W10a }, { f: 1110, dur: 28, s: W10b }],
  11: [{ f: 1195, s: W11a }, { f: 1330, dur: 26, s: W11b }],
  12: [{ f: 1381, s: W12a }],
  13: [{ f: 1484, s: W13a }],
  14: [{ f: 1594, s: W14a }],
  15: [{ f: 1664, s: W15a }],
  16: [{ f: 1732, s: W16a }, { f: 1820, dur: 30, s: W16b }],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
const KICKS: [number, number][] = [[1554 / FPS, 0.5], [1561 / FPS, 0.5], [1570 / FPS, 0.7], [584 / FPS, 0.4], [1864 / FPS, 0.5]];
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
  { f: 0, cInf: 0 }, { f: 58, dur: 34, cInf: 12 }, // hook: wide street sharp -> MS of the front dancers
  { f: 139, cInf: 0 }, // town aerial
  { f: 214, cInf: 12 }, { f: 292, cInf: 15 }, // Troffea steps out / CU "no music, no smile"
  { f: 345, cInf: 12 }, { f: 461, cInf: 0 }, // husband / the week (wide street)
  { f: 611, cInf: 11 }, { f: 777, cInf: 8 }, { f: 916, cInf: 0 }, // council / stage / more dancers (wide)
  { f: 1013, cInf: 10 }, { f: 1199, cInf: 9 }, { f: 1381, cInf: 0 }, // sad (golden) / park yawns / aerial growth
  { f: 1484, cInf: 12, focus: () => [3.35, D0 + 1.6, -31.55] }, { f: 1598, cInf: 0 }, // the rule sign / leaving over the bridge
  { f: 1668, cInf: 12 }, { f: 1736, cInf: 8 }, { f: 1820, dur: 30, cInf: 10 }, // the dancing stops / the band, music off
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
