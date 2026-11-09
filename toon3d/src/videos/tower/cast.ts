// Our cast as lit flat sprites in the 3D world. Each frame every character asks for a drawing (a key + a draw call);
// the pool keeps one canvas per distinct drawing, so soldiers marching in step share canvases (7 head shapes x 4
// outfits). Characters are yaw-only billboards shaded by cardShade() (scene tint, bright floor, side gradient toward
// the sun, painted crescent in the drawing); standing ones get a soft multiply contact blob. Effects are unlit cards.
// Cards, effects and blobs live on the NOINK layer so the world ink pass never outlines their quads.
import * as THREE from "three";
import {
  Pen, bodyFront, bodySide, swingKid, soldier, townsfolk, OFFICER, KID, PARENT, SKINS, fxNote, fxBurst, fxSplash, fxStars, fxCreak, fxRing, fxBlob, fxShadow, fxContact, fxPlank, fxDrum, fxPuff,
  Outfit, Expr, FrontOpts, SideOpts,
} from "./toon";
import {
  SUITE, CELL, BT, FPS, D0, FILES, ROW_GAP, COUNT, PARK, SHOTS, SNAP, DROP0, DROP1, DROP_H, V3, front, marchPhase, stomp, deckY, dropW, dropU, shapeZ,
  smooth, clamp01, BridgeState, BEAT,
} from "./story";
import { LIGHTS } from "./lights";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";

// ---------------- canvas pool ----------------
type Entry = { cv: HTMLCanvasElement; tex: THREE.CanvasTexture; w: number; h: number };
export type Req = { key: string; w: number; h: number; k: number; draw: (p: Pen) => void; tex?: THREE.CanvasTexture };
const makeEntry = (w: number, h: number): Entry => {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { cv, tex, w, h };
};
export class Pool {
  private live = new Map<string, Entry>();
  private free: Entry[] = [];
  private reqs: Req[] = [];
  req(key: string, w: number, h: number, k: number, draw: (p: Pen) => void) {
    const r: Req = { key: `${w}x${h}|${key}`, w, h, k, draw };
    this.reqs.push(r);
    return r;
  }
  flush() {
    const want = new Map<string, Req[]>();
    for (const r of this.reqs) { const l = want.get(r.key); if (l) l.push(r); else want.set(r.key, [r]); }
    for (const [key, e] of this.live) if (!want.has(key)) { this.live.delete(key); this.free.push(e); }
    for (const [key, rs] of want) {
      let e = this.live.get(key);
      if (!e) {
        const r = rs[0], i = this.free.findIndex((x) => x.w === r.w && x.h === r.h);
        e = i >= 0 ? this.free.splice(i, 1)[0] : makeEntry(r.w, r.h);
        const g = e.cv.getContext("2d")!;
        g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, e.w, e.h); g.setTransform(r.k, 0, 0, r.k, 0, 0);
        r.draw(new Pen(g));
        e.tex.needsUpdate = true;
        this.live.set(key, e);
      }
      for (const r of rs) r.tex = e.tex;
    }
    this.reqs = [];
  }
}

// ---------------- sprite meshes ----------------
const blank = (() => { const c = document.createElement("canvas"); c.width = c.height = 2; return new THREE.CanvasTexture(c); })();
export const SU = 0.00216; // metres per design unit: 1000 units = 2.16 m
export const SU_SWING = 2.3 / 1830; // swing canvas: rope of 1830 units = 2.3 m
const BODY = (() => { const g = new THREE.PlaneGeometry(600 * SU, 1000 * SU); g.translate(0, (975 - 500) * SU, 0); return g; })();
const CARD = new THREE.PlaneGeometry(1, 1);
/** world roots that hold actors (to find the scene's sun when world.ts does not pass it) */
const ROOTS = new Set<THREE.Object3D>();

/** lit flat character: cardShade() material, receives shadows (dims to the bright floor only), casts its silhouette
 *  when world.ts says so (golden). Drawn after the contact blobs (renderOrder 1). */
export class Actor {
  mesh: THREE.Mesh; mat: THREE.MeshLambertMaterial; dmat: THREE.MeshDepthMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D, geo: THREE.BufferGeometry = BODY) {
    this.mat = cardShade(new THREE.MeshLambertMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide }));
    this.mat.alphaToCoverage = false; // A2C + MSAA left 1 px sky-depth seams on blurred far cards (POST)
    this.dmat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.customDepthMaterial = this.dmat;
    // rim width is in output pixels: tell the card shader the render height (1920 = 1080 x 1920 frame)
    this.mesh.onBeforeRender = (r) => { const rt = r.getRenderTarget(); CARD_K.uPx.value = (rt ? rt.height : r.domElement.height) / 1920; };
    this.mesh.castShadow = false; this.mesh.receiveShadow = true; this.mesh.visible = false;
    this.mesh.rotation.order = "YXZ"; this.mesh.renderOrder = 1; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
    ROOTS.add(parent);
  }
  bind() { const t = this.r?.tex; if (t) { this.mat.map = t; this.dmat.map = t; } }
}
/** unlit effect card: hard cut-out (ink drawings), soft see-through (dust, mist) or a multiply ground blob */
export class Fx {
  mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; soft: THREE.MeshBasicMaterial; blob: THREE.MeshBasicMaterial; r: Req | null = null;
  constructor(parent: THREE.Object3D) {
    this.mat = new THREE.MeshBasicMaterial({ map: blank, alphaTest: 0.5, side: THREE.DoubleSide });
    this.mat.alphaToCoverage = false; // A2C + MSAA left 1 px sky-depth seams on blurred far cards (POST)
    this.soft = new THREE.MeshBasicMaterial({ map: blank, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.blob = blobMaterial(blank);
    this.mesh = new THREE.Mesh(CARD, this.mat);
    this.mesh.visible = false; this.mesh.layers.set(NOINK);
    parent.add(this.mesh);
  }
  use(soft: boolean) { this.mesh.material = soft ? this.soft : this.mat; }
  bind() {
    const t = this.r?.tex;
    if (!t) return;
    if (this.r!.key.includes("|blob|")) {
      // no mipmaps: at grazing views the mip chain averages the blob with its white surround and it fades out
      if (t.generateMipmaps) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; }
      this.blob.map = t; this.mesh.material = this.blob; this.mesh.renderOrder = 0.5;
    }
    else { this.mat.map = t; this.soft.map = t; this.mesh.renderOrder = 0; }
  }
}

// ---------------- placements ----------------
export type Place = {
  key: string; draw: (p: Pen) => void; x: number; y: number; z: number;
  scale?: number; mirror?: boolean; yaw?: number; geo?: "body" | "swing"; roll?: number; size?: [number, number, number];
};
export type FxPlace = { key: string; cw: number; ch: number; draw: (p: Pen) => void; x: number; y: number; z: number; w: number; h: number; flat?: boolean; rot?: number; soft?: boolean };
/** sun = world direction TOWARD the sun (optional: when absent the scene's shadow-casting light is used) */
export type CamInfo = { pos: THREE.Vector3; right: THREE.Vector3; sun?: THREE.Vector3 };

const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const q = (v: number, n = 120) => Math.round(v * n) / n;
const INK_C = "#241726";
const SOLDIER = [0, 1, 2, 3].map((v) => soldier(v));
const BARE = [0, 1, 2, 3].map((v) => soldier(v, { hat: null }));
const FOLK = [0, 1, 2, 3, 4, 5].map((v) => townsfolk(v));
const vOf = (i: number) => (i * 7 + (i >> 2)) % 4;
/** head-shape seed: 7 shapes, so marching soldiers in step still share canvases */
const seedOf = (i: number) => ((i * 5 + 3) % 7) + 1;
/** drawing resolution by distance: [canvas w, h, scale from the 600 x 1000 design]; sized for the 1440 x 2560 final */
const tier = (d: number): [number, number, number] =>
  d < 3.2 ? [1800, 3000, 3.0] : d < 6.5 ? [1080, 1800, 1.8] : d < 16 ? [480, 800, 0.8] : [240, 400, 0.4];

// ---------------- light ----------------
const SUN = new THREE.Vector3(0.5, 0.75, -0.4).normalize();
const tmp = new THREE.Vector3();
let LNAME: "day" | "golden" | "night" | "casino" | "suite" = "day";
const sunOf = (root: THREE.Object3D) => {
  let s: THREE.DirectionalLight | null = null;
  root.traverse((o) => { if (!s && o instanceof THREE.DirectionalLight && o.castShadow) s = o; });
  return s as THREE.DirectionalLight | null;
};
/** the sun of the world that is calling: the attached root whose sun target sits on this camera's view axis */
const findSun = (cam: CamInfo, out: THREE.Vector3) => {
  if (cam.sun) return out.copy(cam.sun).normalize();
  let best: THREE.DirectionalLight | null = null, err = Infinity;
  for (const r of ROOTS) {
    if (!r.parent) continue;
    const s = sunOf(r);
    if (!s) continue;
    const d = tmp.copy(s.target.position).sub(cam.pos), e = Math.abs(d.dot(cam.right)) / (d.length() || 1);
    if (e < err) { err = e; best = s; }
  }
  return best ? out.copy(best.position).sub(best.target.position).normalize() : out;
};
/** canvas angle the sun comes FROM on an upright card facing the camera, in 45-degree steps (small texture cache) */
const light2D = (cam: CamInfo, mirror: boolean) => {
  const sx = SUN.dot(cam.right) * (mirror ? -1 : 1), sy = -SUN.y;
  return Math.round(Math.atan2(sy, sx) / (Math.PI / 4)) * (Math.PI / 4);
};

/** front / side view and mirroring for someone at (x, z) walking along (dx, dz); fs = foreshortening of the walk */
const viewOf = (cam: CamInfo, x: number, z: number, dx: number, dz: number) => {
  const tx = cam.pos.x - x, tz = cam.pos.z - z, tl = Math.hypot(tx, tz) || 1;
  const c = (tx * dx + tz * dz) / tl;
  return { side: c < 0.57, mirror: dx * cam.right.x + dz * cam.right.z < 0, fs: Math.round(Math.sqrt(Math.max(0, 1 - c * c)) * 20) / 20 };
};

// ---------------- life: blinks and reaction timing ----------------
/** reference expression and action changes land 0-3 f before the word onset */
const LEAD = 2 / FPS;
/** eyelid 0 open .. 1 shut. Reference: gaps 0.5-2.3 s, 4-frame blink half / shut / shut / half, plus a blink across
 *  every expression swap (the shut frames hide the swap) */
const LID = [0.5, 1, 1, 0.5];
const SWAPS: Record<number, number[]> = { 4: [16.17, 17.3], 5: [19.48, 20.6], 6: [21.9, 23.7], 7: [29.4, 30.6], 8: [SNAP] };
const lidAt = (t: number, i: number, swaps: number[] = []) => {
  const f = Math.round(t * FPS);
  for (const ts of swaps) { const k = f - Math.round((ts - LEAD) * FPS) + 1; if (k >= 0 && k < 4) return LID[k]; }
  let s = Math.round(-60 * hh(i, 9));
  for (let n = 0; s <= f && n < 400; n++) {
    const k = f - s;
    if (k >= 0 && k < 4) return LID[k];
    s += Math.round(15 + 54 * hh(i * 31 + n, 13)); // next blink 0.5-2.3 s later
  }
  return 0;
};
const fkey = (o: object) => JSON.stringify(o, (_k, v) => (typeof v === "number" ? q(v) : v));

type Who = { i: number; o: Outfit; okey: string };
/** one character drawing in the 600 x 1000 design space, sized by distance, lit from the scene's sun */
const person = (cam: CamInfo, who: Who, x: number, y: number, z: number, view: { side: boolean; mirror: boolean }, fo: FrontOpts, so: SideOpts, scale = 1): Place & { tierKey: string } => {
  const d = cam.pos.distanceTo(tmp.set(x, y + 1.2, z)) / scale;
  const [w, h, k] = tier(d);
  const mirror = view.side && view.mirror, light = light2D(cam, mirror), seed = seedOf(who.i);
  const f2: FrontOpts = { ...fo, light, seed }, s2: SideOpts = { ...so, light, seed };
  const key = view.side ? `S|${who.okey}|${fkey(s2)}` : `F|${who.okey}|${fkey(f2)}`;
  return {
    key, x, y, z, scale, mirror, tierKey: `${w}`,
    draw: (p) => (view.side ? bodySide(p, who.o, s2) : bodyFront(p, who.o, f2)),
    size: [w, h, k],
  };
};

/** ground shadow under a standing / sitting card (review rounds 2-4), multiply, blue-violet: a TIGHT contact pool right under
 *  the feet (~.5 on screen at the core) so nobody floats, plus by day (cards cast no real shadow) a lighter soft tail
 *  stretched AWAY from the sun, length ~1.6 m / tan(sun elevation), capped. Golden: world.ts casts real card shadows. */
const CONTACT: Record<"day" | "golden" | "night" | "casino" | "suite", [number, number, number]> = { day: [0.2, 0.21, 0.33], golden: [0.24, 0.2, 0.33], night: [0.22, 0.2, 0.36], casino: [0.3, 0.18, 0.24], suite: [0.3, 0.28, 0.36] };
const TAIL: [number, number, number] = [0.42, 0.44, 0.62];
const toSrgb = (v: number) => { const c = clamp01(v); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
const hexOf = (c: [number, number, number], k: number) => "#" + c.map((v) => Math.round(255 * toSrgb(1 - (1 - v) * k)).toString(16).padStart(2, "0")).join("");
const blob = (out: Stage, x: number, y: number, z: number, sc = 1, k = 1) => {
  const hl = Math.hypot(SUN.x, SUN.z) || 1, ox = -SUN.x / hl, oz = -SUN.z / hl, rot = Math.atan2(-ox, -oz);
  if (LNAME === "day") {
    const el = Math.asin(Math.min(0.99, Math.max(0.1, SUN.y)));
    const len = Math.min(2.4, Math.max(0.5, 1.6 / Math.tan(el))) * sc, h = len + 0.55 * sc, c = 0.3 * h; // feet at v = .2 of the card
    const tc = hexOf(TAIL, k);
    out.fx.push({ key: `blob|shadow|${tc}`, cw: 128, ch: 256, draw: (p) => fxShadow(p, tc), x: x + ox * c, y: y + 0.018, z: z + oz * c,
      w: 0.72 * sc, h, flat: true, rot });
  }
  const cc = hexOf(CONTACT[LNAME], k);
  out.fx.push({ key: `blob|contact|${cc}`, cw: 128, ch: 128, draw: (p) => fxContact(p, cc), x: x + ox * 0.03 * sc, y: y + 0.022, z: z + oz * 0.03 * sc,
    w: 0.52 * sc, h: 0.4 * sc, flat: true, rot });
};

// ---------------- crowd by shot ----------------
export type Stage = { places: Place[]; fx: FxPlace[] };

const exprMarch = (id: number, t: number, i: number, tau: number): { expr: Expr; look: number } => {
  const lau = i % 3 === 0, whi = i % 5 === 1, L = LEAD;
  switch (id) {
    case 1: return { expr: lau ? "laugh" : whi ? "whistle" : "grin", look: 0 };
    case 2: case 3: return { expr: i % 4 === 3 ? "smile_closed" : i % 2 ? "neutral" : "stern", look: 0 };
    case 4: return t < 16.17 - L ? { expr: i % 2 ? "neutral" : "stern", look: 0 } : t < 17.3 - L ? { expr: lau ? "shock" : "nervous", look: 0 } : { expr: "neutral", look: 0 };
    case 5: return { expr: t < 19.48 - L ? "neutral" : t < 20.6 - L ? "grin" : i % 2 ? "laugh" : "grin", look: 0 };
    case 6: return { expr: (i === 2 && t > 21.9 - L) || (t > 23.7 - L && i % 4 === 1) ? "whistle" : t > 23.7 - L && lau ? "laugh" : "grin", look: 0 };
    case 7: return t < 29.4 - L ? { expr: lau ? "laugh" : "grin", look: 0 } : t < 30.6 - L ? { expr: i % 2 ? "nervous" : "grin", look: -1 } : { expr: "nervous", look: 0 };
    case 8: return { expr: tau < SNAP - L ? "nervous" : "shock", look: tau < SNAP + 0.6 ? -1 : 0 };
    default: return { expr: whi ? "whistle" : "grin", look: 0 };
  }
};

/** the marching column (shots 1-8, 13) */
const column = (id: number, t: number, b: BridgeState, cam: CamInfo, out: Stage) => {
  const s = SHOTS[id - 1], tau = s.tau(t);
  const stopT = SNAP + 0.3, walkT = id === 8 ? Math.min(tau, stopT) : tau;
  const F = front(walkT), ph = marchPhase(walkT), st = stomp(tau);
  const falling = id === 8 && tau >= DROP0;
  for (let i = 0; i < COUNT; i++) {
    const row = i >> 2, x0 = FILES[i & 3] + (hh(i) - 0.5) * 0.08, z = F + row * ROW_GAP + (hh(i, 2) - 0.5) * 0.1;
    let x = x0, y = Math.abs(z) <= 30 ? deckY(z, b) : D0;
    const who: Who = { i, o: SOLDIER[vOf(i)], okey: `s${vOf(i)}` };
    let { expr, look } = exprMarch(id, t, i, tau);
    let mode: "march" | "stand" | "fall" | "sit" = id === 8 && tau >= SNAP + 0.25 ? "stand" : "march";
    let tilt = 0;
    if (falling) {
      // the soldiers lag the falling deck a little (cartoon hang time), then sit in the water
      const lagY = D0 + b.bounce * shapeZ(z) - dropU(tau - 0.13) * DROP_H * dropW(z);
      const air = Math.max(0, lagY - y);
      y += air;
      const u = clamp01((tau - DROP0) / (DROP1 - DROP0));
      x = x0 + (hh(i, 3) - 0.5) * 0.7 * u;
      mode = tau < DROP1 + 0.13 ? "fall" : "sit";
      tilt = mode === "fall" ? (hh(i, 4) - 0.5) * 50 * u : 0;
      if (mode === "sit") expr = i % 3 ? "dazed" : "shock";
    }
    const view = viewOf(cam, x, z, 0, -1);
    const blink = expr !== "whistle" ? lidAt(t, i, SWAPS[id]) : 0;
    const fo: FrontOpts = { phase: mode === "march" ? ph : 0, expr, mode, look, blink, lift: 60 * st, tilt };
    // side views: the stance foot keeps pace with the column (0.8 m steps at 2 steps/s), foreshortened by the view
    const so: SideOpts = { phase: mode === "march" ? ph : 0, expr, mode: mode === "march" ? "march" : "stand", blink, stomp: st, stride: view.fs };
    out.places.push(person(cam, who, x, y, z, mode === "fall" || mode === "sit" ? { side: false, mirror: false } : view, fo, so));
    if (mode === "march" || mode === "stand") blob(out, x, y, z);
    // whistled notes drift up from whistlers near the lens
    if (expr === "whistle" && (id === 6 || id === 1 || id === 13) && cam.pos.distanceTo(tmp.set(x, y, z)) < 16) {
      for (let n = 0; n < 4; n++) {
        const age = ((t - 21.9 + n * 0.42 + hh(i, 5)) % 1.68) / 1.68;
        const pop = Math.min(1, age * 7) * (age > 0.82 ? (1 - age) / 0.18 : 1);
        if (pop <= 0.02) continue;
        const kind = (n + i) % 2, side = 0.16 + 0.32 * age + 0.05 * Math.sin(age * 9 + n);
        out.fx.push({ key: `note${kind}`, cw: 220, ch: 260, draw: (p) => fxNote(p, kind), x: x + cam.right.x * side, y: y + 1.5 + 0.85 * age, z: z + cam.right.z * side - 0.1,
          w: 0.17 * pop, h: 0.2 * pop, rot: 0.3 * Math.sin(age * 6 + n) });
      }
    }
  }
};

const sitters = (cam: CamInfo, t: number, out: Stage, spots: [number, number, number][], exprs: (i: number) => Expr, stars: (i: number) => boolean, water: boolean) => {
  spots.forEach(([x, y, z], i) => {
    const bare = i % 3 === 1;
    const v = vOf(i + 3), who: Who = { i, o: bare ? BARE[v] : SOLDIER[v], okey: `${bare ? "b" : "s"}${v}` };
    const expr = exprs(i), bob = water ? 0.03 * Math.sin(t * 2.2 + i) : 0;
    out.places.push(person(cam, who, x, y + bob, z, { side: false, mirror: false }, { mode: "sit", expr, blink: lidAt(t, i), look: 0 }, {}));
    if (stars(i)) {
      const u = (t * 0.9 + hh(i)) % 1;
      out.fx.push({ key: `stars${q(u, 30)}`, cw: 420, ch: 210, draw: (p) => fxStars(p, q(u, 30)), x, y: y + bob + 1.3, z, w: 0.75, h: 0.375 });
    }
    if (water) {
      const u = ((t + hh(i, 7) * 2) % 2.2) / 2.2;
      out.fx.push({ key: `ring${q(u, 30)}`, cw: 600, ch: 600, draw: (p) => fxRing(p, q(u, 30)), x, y: 0.03, z, w: 2.0, h: 2.0, flat: true });
      // darker water right where the body meets the surface (only the front arc shows below the card)
      out.fx.push({ key: `blob|contact|${WATERLINE}`, cw: 128, ch: 128, draw: (p) => fxContact(p, WATERLINE), x, y: 0.034 + bob * 0.3, z, w: 0.7, h: 0.5, flat: true });
      if (bare) out.fx.push({ key: "shako", cw: 200, ch: 200, draw: shakoAlone, x: x + 0.55 + 0.3 * hh(i, 8), y: 0.12 + 0.03 * Math.sin(t * 2 + i), z: z - 0.3, w: 0.42, h: 0.42, rot: -0.5 + hh(i, 6) });
    } else {
      out.fx.push({ key: "puddle", cw: 300, ch: 150, draw: puddle, x, y: D0 + 0.02, z: z - 0.05, w: 1.5, h: 0.75, flat: true });
      blob(out, x, y, z, 1.05, 0.8);
    }
  });
};
const WATERLINE = hexOf([0.3, 0.36, 0.52], 1);
/** flotsam in the near water of the river shots (9-10), so the bottom of the frame is not empty: hats, planks, a drum.
 *  World positions 2.5-5 m in front of both river cameras (z -27 / -25.4 looking +z); half under the surface, bobbing. */
const FLOAT: { kind: "shako" | "plank" | "drum"; x: number; z: number; s: number; r: number }[] = [
  // round-4 river cameras sit at z -24.6 / -24.2: the two nearest pieces were 0.7-1.5 m from the lens (cut-off blobs)
  { kind: "shako", x: -0.25, z: -22.5, s: 0.46, r: 0.6 }, // (drum removed: cut by the frame edge it read as a blob)
  { kind: "shako", x: 0.95, z: -24.6, s: 0.42, r: 0.25 }, // (near plank removed: cut by the frame edge)
];
const flotsam = (t: number, out: Stage) =>
  FLOAT.forEach((f, i) => {
    const bob = 0.03 * Math.sin(t * 1.9 + i * 1.7), r = f.r + 0.08 * Math.sin(t * 1.3 + i);
    const [cw, ch, draw, ar] = f.kind === "shako" ? [200, 200, shakoAlone, 1] as const : f.kind === "plank" ? [320, 110, fxPlank, 110 / 320] as const : [260, 240, fxDrum, 240 / 260] as const;
    const w = f.s, h = f.s * ar;
    out.fx.push({ key: f.kind, cw, ch, draw, x: f.x, y: 0.28 * h + bob, z: f.z, w, h, rot: r });
    out.fx.push({ key: `ring${q(((t * 0.45 + i * 0.3) % 1), 30)}`, cw: 600, ch: 600, draw: (p) => fxRing(p, q(((t * 0.45 + i * 0.3) % 1), 30)), x: f.x, y: 0.03, z: f.z, w: 1.1 * f.s + 0.5, h: 1.1 * f.s + 0.5, flat: true });
  });
const shakoAlone = (p: Pen) => {
  p.poly([[42, 160], [158, 160], [166, 50], [34, 50]], "#3a3d47", 8);
  p.ell(100, 158, 60, 10, "#16171b", 7, 0, 180);
  p.ell(100, 96, 14, 12, "#c9ccd2", 6);
  p.ell(100, 36, 14, 14, "#2b7a4b", 6);
};
const puddle = (p: Pen) => { p.ell(150, 75, 140, 58, "#6f97c6", 0); p.ell(120, 62, 60, 16, "#a9c9ea", 0); };

/** the extras hold still and only cheer on cue: "pride of the whole town", "like a crowd of tourists" */
const CHEER: [number, number][] = [[8.01 - LEAD, 9.45], [65.96 - LEAD, 67.5]];
const townsfolkAt = (cam: CamInfo, t: number, out: Stage) => {
  const spots: [number, number][] = [];
  for (let i = 0; i < 26; i++) {
    const bank = i < 13 ? -1 : 1, k = i % 13, sx = k % 2 ? 1 : -1;
    spots.push([sx * (5.2 + (k >> 1) * 1.7 + hh(i) * 0.6), bank * (31.6 + hh(i, 2) * 3.2)]);
  }
  const on = CHEER.some(([a, b]) => t >= a && t < b);
  spots.forEach(([x, z], i) => {
    const kid = i % 5 === 2, o = kid ? KID : FOLK[i % 6], hop = kid && on ? Math.max(0, Math.sin(t * 7 + i)) * 0.18 : 0;
    const who: Who = { i: i + 200, o, okey: kid ? "kid" : `f${i % 6}` };
    const expr: Expr = (["smile", "grin", "laugh", "smile_closed"] as Expr[])[i % 4];
    const fo: FrontOpts = { mode: "stand", expr, wave: i % 3 === 2 || !on ? undefined : q(Math.sin(t * 9 + i * 1.3), 30), blink: lidAt(t, i + 40) };
    out.places.push(person(cam, who, x, D0 + hop, z, { side: false, mirror: false }, fo, {}, kid ? 0.72 : 1));
    blob(out, x, D0, z, kid ? 0.72 : 1, hop > 0 ? 0.6 : 1);
  });
};

/** soldiers strolling out of step across the rebuilt bridge (shot 15): own pace kept (sound), poses on ones */
const tourists = (cam: CamInfo, t: number, out: Stage) => {
  const t0 = 62.08;
  for (let i = 0; i < 24; i++) {
    const sp = 0.55 + hh(i) * 0.5, z = -4 + (i / 24) * 28 + hh(i, 2) * 1.5 - sp * (t - t0), x = (hh(i, 3) - 0.5) * 4.0;
    const bare = i % 5 === 2, v = vOf(i), who: Who = { i, o: bare ? BARE[v] : SOLDIER[v], okey: `${bare ? "b" : "s"}${v}` };
    const prop = i % 7 === 3 ? "icecream" : bare ? "shako" : null;
    const lick = prop === "icecream" && (t * 0.7 + hh(i, 4)) % 1 < 0.45;
    const expr: Expr = lick ? "lick" : (["smile", "smile_closed", "grin", "smile"] as Expr[])[i % 4];
    const phase = q(((t - t0) * sp / 1.4 + hh(i, 5)) % 1, 120); // cadence sp/1.4 Hz unchanged = 0.7 m per step
    const look = Math.round(Math.sin(t * 0.8 + i * 1.7) * 1.2);
    const fo: FrontOpts = { mode: "stroll", phase, expr, look: Math.max(-1, Math.min(1, look)), prop, blink: lidAt(t, i) };
    const view = viewOf(cam, x, z, 0, -1);
    const so: SideOpts = { mode: "march", phase, expr, stomp: 0.55, stride: 0.875 * view.fs };
    out.places.push(person(cam, who, x, D0, z, view, fo, so));
    blob(out, x, D0, z);
  }
};

// officer hammering the new rule onto a sign at the bridge end (shot 14)
export const HITS = [BEAT.ban / FPS, BEAT.music / FPS, BEAT.inPublic / FPS];
export const SIGN_AT: V3 = [3.6, D0, -60.5];
/** 0 = hammer up, 1 = struck. Reference action timing: 4 f wind-up, held ~7 f at the top, a 1-frame strike on the word */
const hammerK = (t: number) => {
  let k = 1;
  for (const th of HITS) {
    const n = (t - th) * FPS; // frames to contact
    if (n >= -11 && n < -7) k = Math.min(k, 1 - smooth((n + 11) / 4));
    else if (n >= -7 && n < 0) k = 0;
  }
  return k;
};
const officer = (cam: CamInfo, t: number, out: Stage) => {
  const fo: FrontOpts = { mode: "stand", expr: "stern", prop: ["hammer", q(hammerK(t), 30)], blink: lidAt(t, 99), facing: 1 };
  out.places.push(person(cam, { i: 99, o: COUNCIL[0], okey: "c0" }, 3.35, D0, -31.55, { side: false, mirror: false }, fo, {}));
  blob(out, 3.35, D0, -31.55, 1.1);
  for (const th of HITS) if (t >= th && t < th + 5 / FPS) {
    const u = (t - th) / (5 / FPS);
    out.fx.push({ key: `burst${q(u, 30)}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, q(u, 30)), x: 2.95, y: D0 + 1.55, z: -31.0, w: 0.9, h: 0.9 });
  }
};

// swing in the park (shot 12): pushes land at the back end of every swing, the arc grows
export const SWING_T = 1.55, PUSH0 = 48.79;
const pushes = [0, 1, 2, 3].map((k) => PUSH0 + k * SWING_T);
export const swingAmp = (t: number) => 6 + pushes.reduce((a, tp) => a + 11 * smooth((t - tp) / 0.3), 0);
export const swingAngle = (t: number) => -((swingAmp(t) * Math.PI) / 180) * Math.cos((2 * Math.PI * (t - PUSH0)) / SWING_T);
/** the swing kid's back (seat + ~.12 m, ~8 cm behind the rope) in world space when the swing is at angle th */
const kidBack = (th: number): [number, number] => {
  const lx = -0.083, ly = -2.174; // local to the swing card (pivot at the origin), card yawed by PI
  return [PARK[0] - (lx * Math.cos(th) - ly * Math.sin(th)), PARK[1] + 2.88 + lx * Math.sin(th) + ly * Math.cos(th)];
};
/** where the parent stands for push k: hands reach the kid's back at the back of the arc with the arms ~ straight */
const pushSpot = (k: number) => {
  const A = (swingAmp(pushes[k]) * Math.PI) / 180, [bx, by] = kidBack(-A);
  const cy = 975 - (by - D0) / SU, dy = cy - 515, dx = Math.sqrt(Math.max(120 * 120, 222 * 222 - dy * dy));
  return { px: bx + (53 + dx) * SU, hand: [300 + 53 + dx, cy] as [number, number] };
};
const park = (cam: CamInfo, t: number, out: Stage) => {
  const th = swingAngle(t), vel = Math.sin((2 * Math.PI * (t - PUSH0)) / SWING_T);
  const A = (swingAmp(t) * Math.PI) / 180, kick = q(0.35 + 0.55 * vel, 40);
  const expr: Expr = A < 0.35 ? "smile" : A < 0.6 ? "grin" : "laugh";
  const light = light2D(cam, true), lid = lidAt(t, 78);
  out.places.push({ key: `swing|${kick}|${expr}|${q(light)}|${lid}`, geo: "swing", x: PARK[0], y: PARK[1] + 2.88, z: PARK[2], yaw: Math.PI, roll: th,
    draw: (p) => swingKid(p, KID, kick, expr, light, lid), size: [490, 1610, 0.7] });
  const push = Math.max(0, ...pushes.map((tp) => 1 - Math.abs(t - tp + 0.05) / 0.32));
  // stand at this push's spot; step back to the next spot between pushes (the arc grows after every push)
  let k = 0;
  while (k < pushes.length - 1 && t > pushes[k] + 0.35) k++;
  const cur = pushSpot(k), prev = pushSpot(Math.max(0, k - 1));
  const step = k > 0 ? smooth((t - (pushes[k - 1] + 0.35)) / (SWING_T - 0.7)) : 1;
  const px = prev.px + (cur.px - prev.px) * step, pz = PARK[2] + 0.1;
  const so: SideOpts = { mode: "push", pose: q(push, 40), expr: push > 0.3 ? "grin" : "smile", blink: lidAt(t, 77), hand: cur.hand };
  out.places.push({ ...person(cam, { i: 77, o: PARENT, okey: "parent" }, px, D0, pz, { side: true, mirror: true }, {}, so), mirror: false, yaw: Math.PI });
  blob(out, px, D0, pz);
};

// ================= the dance short =================
const F = (f: number) => f / FPS;
const TROFFEA: Outfit = { jacket: "#8c3b4a", pants: "#3b3f52", boots: "#4a3426", skin: SKINS[1], hat: "bonnet", dress: "#d0453a" };
const HUSBAND: Outfit = { jacket: "#3f6fb5", pants: "#3b3f52", boots: "#4a3426", skin: SKINS[1], hat: "hair", hair: "#5a3b2a", moustache: "#5a3b2a" };
const COUNCIL: Outfit[] = [
  { jacket: "#2c2b3d", pants: "#2c2b3d", boots: INK_C, hat: "tophat", sash: "#c0353a", moustache: "#4a3020", build: "stout", skin: SKINS[0] },
  { jacket: "#3b2f4a", pants: "#2c2b3d", boots: INK_C, hat: "tophat", sash: "#e8c45a", skin: SKINS[2] },
  { jacket: "#2f3f3a", pants: "#2c2b3d", boots: INK_C, hat: "tophat", sash: "#e8c45a", moustache: "#2a201a", skin: SKINS[3] },
];
const BAND: Outfit[] = [
  { jacket: "#d9a441", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#2f5f6a", skin: SKINS[3] },
  { jacket: "#5d7a3a", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#2a201a", skin: SKINS[0] },
  { jacket: "#b5653f", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#8c3b4a", skin: SKINS[2] },
];
const STRONG: Outfit = { jacket: "#7a4b2a", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#3a2a1a", build: "stout", skin: SKINS[3] };
export const STAGE_AT: V3 = [8.5, D0, -34.3];
export const STAGE_H = 0.7;
const MOOD_HOOK: Expr[] = ["grin", "nervous", "laugh", "dazed", "stern", "grin"];
const MOOD_TIRED: Expr[] = ["dazed", "pained", "nervous", "stern"];
/** street / quay / bridge-deck positions for the crowd (deterministic) */
const crowdSpot = (i: number): [number, number] => {
  if (i === 0) return [-2.2, -54];
  if (i < 62) return [(hh(i, 21) - 0.5) * 10.4, -47 - hh(i, 22) * 27];
  if (i < 92) {
    // quay dancers: a packed half-ring in front of and beside the stage (deck x 6.2..10.8, front edge z -33), kept 3 m off the quay cameras
    // (biased toward the stage; a clear lane at x 7.8..9.4 so the quay cameras see the band)
    let x = 8.5 + (hh(i, 23) - 0.5) * 15; let z = -29.4 - hh(i, 24) * 4.4;
    if (x > 7.8 && x < 9.4) x += x < 8.6 ? -1.6 : 1.6;
    if (x > 5.6 && x < 11.4) z = -30.8 - hh(i, 24) * 1.9; else if (x > 3 && x <= 5.6) z = Math.min(z, -31);
    return [x, z];
  }
  return [(hh(i, 25) - 0.5) * 3.6, -24 + hh(i, 26) * 40];
};
const folkOf = (i: number): Who => { const v = (i * 5 + 1) % 6; return { i: i + 300, o: FOLK[v], okey: `f${v}` }; };
/** one dancer: a jig step (phase), sway (tilt), an arm flung up (wave), a little hop; energy 0..1 */
const dancer = (cam: CamInfo, t: number, out: Stage, who: Who, x: number, z: number, energy: number, expr: Expr, y = D0, scale = 1, k = 1) => {
  if (k <= 0) return;
  const i = who.i, speed = 1.6 * (0.85 + 0.3 * hh(i, 1));
  const phase = energy > 0.02 ? q(((t * speed + hh(i, 2)) % 1), 12) : 0;
  const tilt = Math.round(9 * energy * Math.sin(2 * Math.PI * (t * 0.8 + hh(i, 3))) / 2) * 2;
  const wave = energy > 0.3 && i % 3 !== 0 ? q(Math.sin(t * 6.5 + i), 4) : undefined;
  const hop = energy * 0.07 * Math.abs(Math.sin(Math.PI * 2 * phase));
  const fo: FrontOpts = { mode: energy > 0.02 ? "march" : "stand", phase, expr, wave, lift: Math.round(60 + 50 * energy), tilt, blink: lidAt(t, i) };
  out.places.push(person(cam, who, x, y + hop * k, z, { side: false, mirror: false }, fo, {}, scale * k));
  blob(out, x, y, z, scale * k, hop > 0.03 ? 0.7 : 1);
};
const notesAt = (out: Stage, t: number, x: number, y: number, z: number, cam: CamInfo, seed: number, k = 1) => {
  for (let n = 0; n < 3; n++) {
    const age = ((t * 0.9 + n * 0.33 + hh(seed, 5)) % 1);
    const pop = Math.min(1, age * 7) * (age > 0.8 ? (1 - age) / 0.2 : 1) * k;
    if (pop <= 0.02) continue;
    const kind = (n + seed) % 2, side = 0.2 + 0.4 * age;
    out.fx.push({ key: `note${kind}`, cw: 220, ch: 260, draw: (p) => fxNote(p, kind), x: x + cam.right.x * side, y: y + 1.6 + 0.9 * age, z: z + cam.right.z * side,
      w: 0.24 * pop, h: 0.28 * pop, rot: 0.3 * Math.sin(age * 6 + n) });
  }
};
/** the crowd: n dancers (index 0 = Troffea) fading in at their own frames */
const crowd = (cam: CamInfo, t: number, out: Stage, n: number, appear: (i: number) => number, mood: Expr[], energy = 1) => {
  for (let i = 0; i < n; i++) {
    const a = appear(i), k = smooth((t - a) / 0.25);
    if (k <= 0) continue;
    const [x, z] = crowdSpot(i), y = D0;
    const who = i === 0 ? { i: 1, o: TROFFEA, okey: "trof" } : folkOf(i);
    dancer(cam, t, out, who, x, z, energy, i === 0 ? "stern" : mood[i % mood.length], y, 1, k);
  }
};
const band = (cam: CamInfo, t: number, out: Stage, playing: number) => {
  const [sx, sy, sz] = STAGE_AT, y = sy + STAGE_H;
  const spots: [number, number][] = [[sx - 1.4, sz + 0.2], [sx, sz - 0.1], [sx + 1.4, sz + 0.25]];
  spots.forEach(([x, z], j) => {
    const play = playing > 0.5, bow = play ? q(0.5 + 0.5 * Math.sin(t * (j === 1 ? 9 : 7) + j), 6) : 0.5;
    const prop = (j === 1 ? ["drum", bow] : ["fiddle", bow]) as FrontOpts["prop"];
    const fo: FrontOpts = { mode: play ? "march" : "stand", phase: play ? q((t * 1.6 + j * 0.3) % 1, 12) : 0, lift: 30, expr: play ? (j === 1 ? "grin" : "smile_closed") : "neutral", prop, blink: lidAt(t, 400 + j) };
    out.places.push(person(cam, { i: 400 + j, o: BAND[j], okey: `band${j}` }, x, y, z, { side: false, mirror: false }, fo, {}));
    blob(out, x, y, z);
    if (play) notesAt(out, t, x, y, z, cam, j);
  });
};
const council = (cam: CamInfo, t: number, out: Stage) => {
  const f = t * FPS;
  COUNCIL.forEach((o, j) => {
    const x = -4.6 + (j - 1) * 0.15, z = -61.2 + (j - 1) * 1.15;
    let expr: Expr = j === 0 ? "stern" : "neutral", wave: number | undefined;
    if (f >= BEAT.plan - 2) expr = j === 0 ? "grin" : "smile";
    if (j === 0 && f >= BEAT.danceOut - 2) { expr = "laugh"; wave = q(Math.sin(t * 7), 4); }
    const fo: FrontOpts = { mode: "stand", expr, wave, blink: lidAt(t, 500 + j), facing: 1 };
    out.places.push(person(cam, { i: 500 + j, o, okey: `c${j}` }, x, D0, z, { side: false, mirror: false }, fo, {}));
    blob(out, x, D0, z);
  });
};
const yawners = (cam: CamInfo, t: number, out: Stage) => {
  const at = [BEAT.yawn1, BEAT.yawn2, BEAT.yawn3, BEAT.yawn4, BEAT.jumps];
  for (let j = 0; j < 5; j++) {
    const x = 67.9 + j * 0.8, z = -71 - (j % 2) * 0.5, kid = j === 4;
    const a = F(at[j]), yawn = t >= a - LEAD && t < a + 1.1;
    const expr: Expr = yawn ? "yawn" : t > a + 1.1 ? "smile_closed" : "neutral";
    const fo: FrontOpts = { mode: "stand", expr, blink: yawn ? 0 : lidAt(t, 600 + j), headTilt: yawn ? -6 : 0, wave: yawn && j % 2 === 0 ? 0.6 : undefined };
    out.places.push(person(cam, { i: 600 + j, o: kid ? KID : FOLK[j], okey: kid ? "kid" : `f${j}` }, x, D0, z, { side: false, mirror: false }, fo, {}, kid ? 0.72 : 1));
    blob(out, x, D0, z, kid ? 0.72 : 1);
  }
};
const sadQuay = (cam: CamInfo, t: number, out: Stage) => {
  const spots: [number, number, number][] = [[-7.2, D0, -33.6], [-6.1, D0, -32.1], [-5.0, D0, -34.3], [-4.3, D0, -31.6], [-3.4, D0, -33.2],
    [-2.4, D0, -31.9], [-6.8, D0, -35.4], [-4.1, D0, -35.6], [-1.9, D0, -34.6]];
  const fear = F(BEAT.fear);
  spots.forEach(([x, y, z], i) => {
    const turn = fear + i * 0.12, expr: Expr = t >= turn - LEAD ? (i % 2 ? "nervous" : "shock") : (["pained", "stern", "nervous"] as Expr[])[i % 3];
    out.places.push(person(cam, folkOf(i + 40), x, y, z, { side: false, mirror: false }, { mode: "sit", expr, blink: lidAt(t, i + 40), look: 0 }, {}));
    blob(out, x, y, z, 1.05, 0.8);
  });
};
const leaving = (cam: CamInfo, t: number, out: Stage) => {
  const t0 = F(1598);
  for (let i = 0; i < 26; i++) {
    const sp = 0.6 + hh(i, 31) * 0.4, z = -30 + (i / 26) * 30 + hh(i, 32) * 1.5 + sp * (t - t0), x = (hh(i, 33) - 0.5) * 3.6;
    const who = folkOf(i + 70), phase = q(((t - t0) * sp / 1.4 + hh(i, 35)) % 1, 12);
    const view = viewOf(cam, x, z, 0, 1);
    const fo: FrontOpts = { mode: "stroll", phase, expr: (["dazed", "relief", "stern", "smile_closed"] as Expr[])[i % 4], blink: lidAt(t, i + 70) };
    const so: SideOpts = { mode: "march", phase, expr: "dazed", stomp: 0.5, stride: 0.875 * view.fs };
    out.places.push(person(cam, who, x, D0, z, view, fo, so));
    blob(out, x, D0, z);
  }
};
const strongMen = (cam: CamInfo, t: number, out: Stage, k: number) => {
  [[3.4, -30.6], [-1.6, -31.0]].forEach(([x, z], j) => {
    const fo: FrontOpts = { mode: "stand", expr: "grin", wave: q(Math.sin(t * 8 + j * 2), 4), blink: lidAt(t, 700 + j) };
    out.places.push(person(cam, { i: 700 + j, o: STRONG, okey: "strong" }, x, D0, z, { side: false, mirror: false }, fo, {}, 1.05 * k));
    blob(out, x, D0, z, 1.05 * k);
  });
};

// ================= the casino short =================
const FRONT = { side: false, mirror: false };
const put = (cam: CamInfo, t: number, out: Stage, i: number, o: Outfit, okey: string, x: number, z: number, fo: FrontOpts, sc = 1, y = D0) => {
  if (sc <= 0.001) return;
  out.places.push(person(cam, { i, o, okey }, x, y, z, FRONT, { mode: "stand", blink: lidAt(t, i), ...fo }, {}, sc));
  blob(out, x, y, z, sc);
};
const walker = (cam: CamInfo, t: number, out: Stage, i: number, o: Outfit, okey: string, x: number, z: number, dx: number, dz: number, speed: number, expr: Expr) => {
  const view = viewOf(cam, x, z, dx, dz), phase = q(((t * speed) / 1.4 + hh(i, 35)) % 1, 12);
  out.places.push(person(cam, { i, o, okey }, x, D0, z, view, { mode: "stroll", phase, expr, blink: lidAt(t, i) },
    { mode: "march", phase, expr, stomp: 0.5, stride: 0.875 * view.fs }));
  blob(out, x, D0, z);
};
const LUST: Outfit = { jacket: "#3a3f52", pants: "#2a2d38", boots: "#1d1b22", hat: "bowler", moustache: "#2b2420", skin: SKINS[0], buttons: "#c9c9d0" };
const LUSTO: Outfit = { ...LUST, hat: "tophat", sash: "#c0353a", buttons: "#e8c45a" };
const LUSTP: Outfit = { jacket: "#c8c0aa", pants: "#a8a090", boots: "#3a3530", hat: "hair", hair: "#2b2420", moustache: "#2b2420", skin: SKINS[0], buttons: "#8a8070" };
const POIS: Outfit = { jacket: "#8a6a4a", pants: "#4a3e34", boots: "#2b2420", hat: "bowler", build: "stout", moustache: "#6a4a2a", skin: SKINS[1] };
const DEAL = [0, 1, 2, 3, 4, 5, 6, 7].map((v): Outfit => ({ jacket: ["#4a5a3a", "#5a4a6a", "#6a5a3a", "#3a4a5a", "#7a4a3a", "#3a5a5a", "#5a5a5a", "#6a3a4a"][v], pants: "#2e2c34",
  boots: "#2b2420", hat: v % 3 === 0 ? "cap" : v % 3 === 1 ? "tophat" : "bowler", cap: "#5a4a3a", moustache: v % 2 ? "#4a3020" : undefined, skin: SKINS[v % 4], build: v === 2 ? "stout" : "adult" }));
const POLICE: Outfit = { jacket: "#2a3a6a", pants: "#22283a", boots: "#121016", hat: "shako", buttons: "#e8c45a", belt: "#f1efe6", skin: SKINS[2] };
const GUARD: Outfit = { jacket: "#5a6070", pants: "#3a3e48", boots: "#1d1b22", hat: "cap", cap: "#3a4050", moustache: "#3a3020", skin: SKINS[1], build: "stout" };
const SX = (x: number) => SUITE[0] + x, SZ = (z: number) => SUITE[2] + z, QX = (x: number) => CELL[0] + x, QZ = (z: number) => CELL[2] + z;
// ---- painted props ----
const BAG = (p: Pen) => {
  p.poly([[60, 90], [140, 90], [175, 150], [170, 215], [30, 215], [25, 150]], "#c9a26a", 6);
  p.poly([[70, 70], [130, 70], [140, 92], [60, 92]], "#a8824a", 5);
  p.g.fillStyle = "#3a2a14"; p.g.font = "bold 70px Georgia, serif"; p.g.textAlign = "center"; p.g.fillText("F", 100, 190);
};
const PAPER = (p: Pen) => {
  p.poly([[8, 8], [392, 8], [392, 492], [8, 492]], "#efe8d6", 6);
  const g = p.g; g.fillStyle = "#1d1b22"; g.textAlign = "center";
  g.font = "bold 46px Georgia, serif"; g.fillText("LE PETIT JOURNAL", 200, 62); g.fillRect(24, 76, 352, 5);
  g.font = "bold 50px Georgia, serif"; g.fillText("LA TOUR", 200, 140); g.fillText("ROUILLE !", 200, 194);
  g.fillStyle = "#6a5a50"; g.beginPath(); g.moveTo(140, 440); g.quadraticCurveTo(190, 330, 196, 222); g.lineTo(204, 222); g.quadraticCurveTo(210, 330, 260, 440);
  g.lineTo(240, 440); g.quadraticCurveTo(200, 380, 160, 440); g.closePath(); g.fill(); g.fillRect(160, 340, 80, 8);
  g.fillStyle = "#b5653f"; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(165 + ((k * 37) % 70), 300 + ((k * 53) % 130), 7, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#8a8070"; for (let k = 0; k < 6; k++) { g.fillRect(28, 230 + k * 36, 100, 6); g.fillRect(272, 230 + k * 36, 100, 6); }
};
const LETTERS = (p: Pen) => {
  for (let k = 0; k < 4; k++) p.poly([[20 + k * 6, 120 - k * 18], [260 + k * 6, 110 - k * 18], [270 + k * 6, 170 - k * 18], [30 + k * 6, 180 - k * 18]], "#f6f2ea", 3);
  p.g.fillStyle = "#c0353a"; p.g.beginPath(); p.g.arc(220, 80, 22, 0, Math.PI * 2); p.g.fill();
  p.g.fillStyle = "#1d1b22"; p.g.font = "bold 22px Georgia, serif"; p.g.fillText("MINISTÈRE", 50, 80);
};
const CUP = (p: Pen) => { p.poly([[30, 20], [130, 20], [150, 150], [10, 150]], "#c0353a", 6); p.band([[14, 140], [146, 140]], "#e8c45a", 10, 2); };
const COIN = (p: Pen) => { p.ell(40, 40, 32, 32, "#e8c45a", 5); };
const PHONE = (p: Pen) => {
  p.poly([[70, 210], [130, 210], [140, 240], [60, 240]], "#1d1b22", 4); p.band([[100, 210], [100, 70]], "#1d1b22", 14, 3);
  p.poly([[75, 40], [125, 40], [118, 80], [82, 80]], "#1d1b22", 4); p.band([[150, 120], [190, 120], [190, 200]], "#1d1b22", 8, 2);
  p.ell(186, 105, 16, 22, "#1d1b22", 3);
};
const FORSALE = (p: Pen) => {
  p.poly([[10, 10], [290, 10], [290, 150], [10, 150]], "#f4efe2", 8);
  p.g.fillStyle = "#c0262e"; p.g.font = "bold 58px Georgia, serif"; p.g.textAlign = "center"; p.g.fillText("FOR SALE", 150, 102);
};
const BARS = (p: Pen) => {
  for (let k = 0; k < 6; k++) p.band([[28 + k * 49, 14], [28 + k * 49, 406]], "#2c2c36", 13, 3);
  p.band([[8, 22], [292, 22]], "#2c2c36", 18, 3); p.band([[8, 398], [292, 398]], "#2c2c36", 18, 3);
};
const burst = (out: Stage, f: number, at: number, x: number, y: number, z: number, w = 1.2, col = "#ffe08a") => {
  const u = (f - at) / 12;
  if (u < 0 || u >= 1) return;
  const uq = q(u, 24);
  out.fx.push({ key: `burst${col}${uq}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, uq, col), x, y, z, w, h: w });
};
const card = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, x: number, y: number, z: number, w: number, rot = 0) =>
  out.fx.push({ key, cw, ch, draw, x, y, z, w, h: (w * ch) / cw, rot });
/** the dealers behind the table (four, set 0 or the second group) and Poisson in his seat */
const dealers = (cam: CamInfo, t: number, out: Stage, set: number, expr: (j: number) => Expr, lean = 0) =>
  [-1.7, -0.9, -0.1, 0.7].forEach((x, j) => {
    if (set === 0 && j === 3) return; // seat 4 of the first group is Poisson
    put(cam, t, out, 600 + set * 10 + j, DEAL[set * 4 + j], `deal${set * 4 + j}`, SX(x), SZ(-2.0 - (j % 2) * 0.12), { expr: expr(j), headTilt: lean * (x < 1 ? 1 : -1) });
  });
const pois = (cam: CamInfo, t: number, out: Stage, fo: FrontOpts, sc = 1) => put(cam, t, out, 620, POIS, "pois", SX(0.7), SZ(-2.05), fo, sc);
const lust = (cam: CamInfo, t: number, out: Stage, o: Outfit, k: string, fo: FrontOpts, x = 2.45, z = -1.35) => put(cam, t, out, 630, o, k, SX(x), SZ(z), fo);

/** everything with a face in shot `id` at time t */
export const stage = (id: number, t: number, b: BridgeState, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  const s = SHOTS[id - 1];
  LNAME = s.light;
  findSun(cam, SUN);
  const f = t * FPS, B = BT;
  switch (s.crowd) {
    case "sold": {
      dealers(cam, t, out, 0, (j) => (j % 2 ? "grin" : "smile"));
      pois(cam, t, out, { expr: "laugh", wave: q(0.5 + 0.5 * Math.sin(t * 6), 4) });
      lust(cam, t, out, LUSTO, "lusto", { expr: "grin", wave: 0.5 }, 1.6, -1.95);
      card(out, "bag", 200, 230, BAG, SX(1.15), D0 + 1.2, SZ(-1.6), 0.5);
      break;
    }
    case "paper": {
      put(cam, t, out, 630, LUST, "lust", 0.3, -55.2, { expr: f < B.rusting ? "neutral" : "grin", look: -1 });
      card(out, "paper", 400, 500, PAPER, 0.38, D0 + 1.32, -54.6, 0.82);
      break;
    }
    case "letters": {
      const off = f >= B.deputy - 2;
      put(cam, t, out, 630, off ? LUSTO : LUST, off ? "lusto" : "lust", SX(-6.2), SZ(-5.4), { expr: off ? "grin" : "stern", prop: off ? undefined : ["hammer", q(0.5 + 0.5 * Math.sin(t * 9), 4)] });
      card(out, "letters", 300, 200, LETTERS, SX(-6.0), D0 + 0.98, SZ(-4.75), 0.62);
      burst(out, f, B.deputy - 3, SX(-6.2), D0 + 1.7, SZ(-5.3), 1.3);
      break;
    }
    case "invite": {
      const t0 = F(441);
      [-1.7, -0.9, -0.1, 0.7].forEach((x, j) => {
        const arrive = smooth((t - t0 - j * 0.35) / 1.8), xx = SX(-4.8 + (x + 4.8) * arrive);
        if (arrive < 1) walker(cam, t, out, j === 3 ? 620 : 600 + j, j === 3 ? POIS : DEAL[j], j === 3 ? "pois" : `deal${j}`, xx, SZ(-2.0 - (j % 2) * 0.12), 1, 0, 1.3, "smile");
        else put(cam, t, out, j === 3 ? 620 : 600 + j, j === 3 ? POIS : DEAL[j], j === 3 ? "pois" : `deal${j}`, xx, SZ(-2.0 - (j % 2) * 0.12), { expr: "smile" });
      });
      lust(cam, t, out, LUSTO, "lusto", { expr: "smile_closed" });
      break;
    }
    case "whisper": {
      const shock = f >= B.scrap - 2, hush = f >= B.nobody - 2;
      dealers(cam, t, out, 0, () => (shock ? "shock" : "neutral"), f >= B.whispers ? 6 : 0);
      pois(cam, t, out, { expr: shock ? "shock" : "neutral", headTilt: f >= B.whispers ? 6 : 0 });
      lust(cam, t, out, LUSTO, "lusto", { expr: hush ? "whistle" : f >= B.whispers - 2 ? "smile_closed" : "neutral", wave: hush ? 0.15 : undefined, headTilt: -5 });
      break;
    }
    case "poisson": {
      const big = smooth((f - (B.bigShot - 6)) / 6);
      dealers(cam, t, out, 0, () => "neutral");
      pois(cam, t, out, { expr: f >= B.bigShot - 4 ? "grin" : f >= B.newInTown - 2 ? "nervous" : "grin", look: f < B.newInTown ? 1 : 0 }, 1 + 0.08 * big);
      burst(out, f, B.bigShot - 2, SX(0.7), D0 + 1.8, SZ(-2.2), 1.4);
      break;
    }
    case "move": lust(cam, t, out, LUSTO, "lusto", { expr: f >= B.confesses - 2 ? "nervous" : "smile_closed", look: -1 }); break;
    case "crooked": {
      pois(cam, t, out, { expr: "neutral", look: 1 });
      const poor = f >= B.tiny - 16, ask = f >= B.monsieur - 2;
      lust(cam, t, out, LUSTO, "lusto", { expr: ask ? "smile" : poor ? "pained" : "nervous", wave: ask ? 0.55 : poor ? q(0.3 + 0.2 * Math.sin(t * 5), 4) : undefined });
      if (f >= B.tiny - 4 && f < B.monsieur) card(out, "coin", 80, 80, COIN, SX(2.25), D0 + 1.55, SZ(-1.0), 0.12);
      break;
    }
    case "relaxes": {
      dealers(cam, t, out, 0, () => "neutral");
      pois(cam, t, out, { expr: f >= B.works - 2 ? "laugh" : f >= B.bribe - 2 ? "grin" : f >= B.relaxes - 2 ? "relief" : "neutral" });
      break;
    }
    case "pays": {
      const k = smooth((f - (B.pays + 6)) / 30), run = f >= B.grabs;
      pois(cam, t, out, { expr: "grin", wave: f < B.pays + 40 ? 0.5 : undefined });
      dealers(cam, t, out, 0, () => "neutral");
      const lx = run ? 2.45 + 3.2 * smooth((f - B.grabs) / 28) : 2.45;
      if (run && lx < 5.6) walker(cam, t, out, 630, LUSTO, "lusto", SX(lx), SZ(-1.35), 1, 0, 3.0, "grin");
      else if (!run) lust(cam, t, out, LUSTO, "lusto", { expr: k > 0.9 ? "grin" : "smile_closed" });
      if (lx < 5.6) card(out, "bag", 200, 230, BAG, SX(0.95 + (lx + 0.3 - 0.95) * k), D0 + 1.15, SZ(-1.25), 0.5);
      break;
    }
    case "magic": {
      const sh = (t - F(1368)) * 2.2;
      lust(cam, t, out, LUSTO, "lusto", { expr: f >= B.figure ? "smile_closed" : "grin", wave: q(0.4 + 0.3 * Math.sin(t * 4), 4) }, 1.3, -1.9);
      pois(cam, t, out, { expr: f >= B.figure - 2 ? "grin" : f >= B.show ? "nervous" : "neutral", look: 1 });
      [0, 1, 2].forEach((c) => {
        const ph = sh + (c * Math.PI * 2) / 3, x = 1.0 + 0.32 * Math.cos(ph), z = -0.55 + 0.1 * Math.sin(ph);
        card(out, "cup", 160, 160, CUP, SX(x), D0 + 0.98, SZ(z), 0.24);
      });
      burst(out, f, B.figure - 2, SX(0.7), D0 + 2.2, SZ(-2.1), 1.0, "#fff3b0");
      break;
    }
    case "shame": {
      pois(cam, t, out, { expr: f >= B.embarrassed - 2 ? "nervous" : "pained", look: f >= B.police1 - 4 && f < B.police1 + 16 ? -1 : 1 });
      card(out, "phone", 220, 260, PHONE, SX(0.15), D0 + 1.05, SZ(-0.75), 0.36);
      break;
    }
    case "back": walker(cam, t, out, 630, LUST, "lust", 0, -58.2 + 0.9 * (t - F(1692)), 0, 1, 0.9, "grin"); break;
    case "again": {
      const pol = f >= B.police2 - 6, run = f >= B.escapes - 4;
      dealers(cam, t, out, 1, (j) => (j === 1 && f >= B.someone ? "stern" : pol ? "shock" : "neutral"));
      const lx = run ? 2.45 + 3.6 * smooth((f - (B.escapes - 4)) / 24) : 2.45;
      if (run) { if (lx < 5.9) walker(cam, t, out, 630, LUSTO, "lusto", SX(lx), SZ(-1.35), 1, 0, 3.4, "shock"); }
      else lust(cam, t, out, LUSTO, "lusto", { expr: pol ? "shock" : "whistle" });
      if (pol) {
        const px = -5.5 + 3.4 * smooth((f - (B.police2 - 6)) / 22);
        if (px < -2.2) walker(cam, t, out, 640, POLICE, "police", SX(px), SZ(-0.2), 1, 0, 2.4, "angry");
        else put(cam, t, out, 640, POLICE, "police", SX(px), SZ(-0.2), { expr: "angry", wave: q(Math.sin(t * 7), 4) });
      }
      break;
    }
    case "prison": {
      const sale = f >= B.landmark - 2;
      put(cam, t, out, 650, LUSTP, "lustp", QX(-0.07), QZ(-0.7), { expr: sale ? "grin" : f >= B.alcatraz ? "nervous" : "neutral", wave: sale ? 0.5 : undefined });
      if (sale) card(out, "forsale", 300, 160, FORSALE, QX(0.02), D0 + 0.95, QZ(2.45), 0.62 * smooth((f - (B.landmark - 2)) / 4), -0.05);
      [-1.05, 0, 1.05].forEach((x) => card(out, "bars", 300, 420, BARS, QX(x), D0 + 1.1, QZ(2.3), 1.06));
      put(cam, t, out, 651, GUARD, "guard", QX(1.75), QZ(3.1), { expr: sale ? "stern" : "neutral", look: -1 });
      break;
    }
    default: break;
  }
  return out;
};

export const snapFx = (tau: number, at: V3, out: Stage) => {
  if (tau >= SNAP && tau < SNAP + 0.45) {
    const u = (tau - SNAP) / 0.45;
    out.fx.push({ key: `bigburst${q(u, 30)}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, q(u, 30)), x: at[0], y: at[1] + 0.12, z: at[2] - 0.15, w: 1.5, h: 1.5 });
  }
};
export const splashFx = (tau: number, out: Stage) => {
  const u = (tau - DROP1) / 1.1;
  if (u < 0 || u >= 1) return;
  for (const [x, z, s] of [[-2.9, -24, 1], [2.9, -21, 0.9], [-2.9, -15, 0.85], [2.9, -9, 0.8], [0, -27.5, 1.2], [-2.9, -5, 0.6]] as const)
    out.fx.push({ key: `splash${q(u, 30)}`, cw: 800, ch: 800, draw: (p) => fxSplash(p, q(u, 30)), x, y: 2.6 * s, z, w: 7 * s, h: 7 * s }); // base of the drawing on the water line
};
export const creakFx = (t: number, pts: V3[], out: Stage, size = 0.8) =>
  pts.forEach(([x, y, z], i) => {
    const u = q((t * 1.3 + i * 0.37) % 1, 30);
    out.fx.push({ key: `creak${u}`, cw: 300, ch: 300, draw: (p) => fxCreak(p, u), x, y, z, w: size, h: size, rot: i * 0.6 - 0.6 });
  });
export { FPS };
