// Our cast as lit flat sprites in the 3D world. Each frame every character asks for a drawing (a key + a draw call);
// the pool keeps one canvas per distinct drawing, so soldiers marching in step share canvases (7 head shapes x 4
// outfits). Characters are yaw-only billboards shaded by cardShade() (scene tint, bright floor, side gradient toward
// the sun, painted crescent in the drawing); standing ones get a soft multiply contact blob. Effects are unlit cards.
// Cards, effects and blobs live on the NOINK layer so the world ink pass never outlines their quads.
import * as THREE from "three";
import {
  INK, Pen, bodyFront, bodySide, swingKid, soldier, townsfolk, OFFICER, KID, PARENT, SKINS, fxNote, fxBurst, fxSplash, fxStars, fxCreak, fxRing, fxBlob, fxShadow, fxContact, fxPlank, fxDrum, fxPuff,
  Outfit, Expr, FrontOpts, SideOpts,
} from "./toon";
import {
  SUITE, CELL, BT, FPS, D0, FILES, ROW_GAP, COUNT, PARK, SHOTS, SNAP, DROP0, DROP1, DROP_H, V3, front, marchPhase, stomp, deckY, dropW, dropU, shapeZ,
  smooth, clamp01, BridgeState, BEAT,
} from "./story";
import { LIGHTS } from "./lights";
import { NOINK } from "./ink";
import { cardShade, blobMaterial, CARD_K } from "./cardshade";
import { avatarFrame } from "../../vendor/open-bot-avatar/index";
import type { AvatarFrame } from "../../vendor/open-bot-avatar/index";
import { blinkAt, hashString } from "../../vendor/open-bot-avatar/motion";
import { moodProgress } from "../../vendor/open-bot-avatar/mood";
import type { AvatarDefinition, AvatarMotion, AvatarMotionBlend } from "../../vendor/open-bot-avatar/types";
import { ALL as AV_ALL, BY as AVB, COLOR as AVC, CLAPPER } from "../obapromo/avatars";

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
const ROBOT: Outfit = { jacket: "#9aa3ad", pants: "#6a7380", boots: "#4a5260", skin: "#d4dce4", hat: "antenna", buttons: "#D97757" };
const ASKER: Outfit = { jacket: "#3f6fb5", pants: "#33343f", boots: "#2b2420", hat: "cap", cap: "#e2453c", skin: SKINS[2] };
const CHEF: Outfit = { jacket: "#f4f1ea", pants: "#4a4a52", boots: "#2b2420", hat: "cap", cap: "#f4f1ea", moustache: "#2b2420", build: "stout", skin: SKINS[1], buttons: "#c0353a" };
const WAIT2: Outfit = { jacket: "#1d1b22", pants: "#1d1b22", boots: "#121016", hat: "hair", hair: "#5a3b2a", buttons: "#f4f1ea", skin: SKINS[3] };
const BERRY = (p: Pen) => { // a cartoon strawberry
  p.poly([[150, 60], [250, 90], [270, 170], [220, 260], [150, 300], [80, 260], [30, 170], [50, 90]], "#d93a3a", 8);
  p.g.fillStyle = "#ffe08a"; for (let k = 0; k < 14; k++) { p.g.beginPath(); p.g.ellipse(80 + ((k * 53) % 150), 110 + ((k * 37) % 150), 5, 8, 0.3, 0, Math.PI * 2); p.g.fill(); }
  p.poly([[150, 70], [100, 30], [130, 62], [150, 20], [170, 62], [200, 30]], "#3f9a4a", 6);
};
const label = (text: string, bg: string, fg: string, w: number, h: number, font = 0.62) => (p: Pen) => {
  p.poly([[8, 8], [w - 8, 8], [w - 8, h - 8], [8, h - 8]], bg, 8);
  p.g.fillStyle = fg; p.g.font = `bold ${Math.round(h * font)}px Georgia, serif`; p.g.textAlign = "center"; p.g.textBaseline = "middle"; p.g.fillText(text, w / 2, h / 2 + 4);
};
const bubble = (text: string) => (p: Pen) => {
  p.ell(150, 120, 135, 100, "#ffffff", 7); p.poly([[110, 205], [150, 215], [90, 280]], "#ffffff", 0);
  p.stroke([[112, 212], [90, 280], [150, 214]], 7, INK);
  p.g.fillStyle = "#1d1b22"; p.g.font = `bold ${text.length > 2 ? 70 : 120}px Georgia, serif`; p.g.textAlign = "center"; p.g.textBaseline = "middle"; p.g.fillText(text, 150, 124);
};
const MENU = (p: Pen) => {
  p.poly([[10, 10], [290, 10], [290, 410], [10, 410]], "#f6efe0", 8);
  const g = p.g; g.fillStyle = "#7b2a3a"; g.textAlign = "center"; g.font = "bold 48px Georgia, serif"; g.fillText("MENU", 150, 66);
  g.fillStyle = "#1d1b22"; g.font = "bold 40px Georgia, serif";
  ["1 ........ 4", "2 ........ 9", "3 ........ 6", "7 ........ 8", "9 ........ 5"].forEach((r, k) => g.fillText(r, 150, 130 + k * 58));
};
const PIZZA = (p: Pen) => {
  p.ell(150, 150, 135, 135, "#e8b04a", 8); p.ell(150, 150, 112, 112, "#d9532e", 0);
  p.g.fillStyle = "#f6e6a8"; for (let k = 0; k < 9; k++) { p.g.beginPath(); p.g.arc(150 + 70 * Math.cos(k * 2.4), 150 + 70 * Math.sin(k * 2.4), 18, 0, Math.PI * 2); p.g.fill(); }
  for (let k = 0; k < 11; k++) { const x = 150 + ((k * 61) % 160) - 80, y = 150 + ((k * 43) % 160) - 80; p.ell(x, y, 11, 11, "#1d1b22", 0); p.ell(x, y, 4, 4, "#d9532e", 0); }
};
const THINK = (p: Pen) => { p.ell(160, 110, 130, 90, "#ffffff", 7); p.ell(60, 230, 22, 18, "#ffffff", 6); p.ell(30, 275, 12, 10, "#ffffff", 5);
  p.g.save(); p.g.globalAlpha = 0.5; p.g.translate(88, 30); p.g.scale(0.48, 0.48); BERRY(p); p.g.restore(); };
const burst = (out: Stage, f: number, at: number, x: number, y: number, z: number, w = 1.2, col = "#ffe08a") => {
  const u = (f - at) / 12;
  if (u < 0 || u >= 1) return;
  const uq = q(u, 24);
  out.fx.push({ key: `burst${col}${uq}`, cw: 500, ch: 500, draw: (p) => fxBurst(p, uq, col), x, y, z, w, h: w });
};
const card = (out: Stage, key: string, cw: number, ch: number, draw: (p: Pen) => void, x: number, y: number, z: number, w: number, rot = 0) =>
  out.fx.push({ key, cw, ch, draw, x, y, z, w, h: (w * ch) / cw, rot });
const pop = (f: number, at: number, n = 5) => smooth((f - at) / n);
const SX = (x: number) => SUITE[0] + x, SZ = (z: number) => SUITE[2] + z;
const robot = (cam: CamInfo, t: number, out: Stage, x: number, z: number, fo: FrontOpts, y = D0) => put(cam, t, out, 700, ROBOT, "robot", x, z, fo, 1, y);
const asker = (cam: CamInfo, t: number, out: Stage, x: number, z: number, fo: FrontOpts) => put(cam, t, out, 701, ASKER, "asker", x, z, fo);
const TOK = [["str", "#7b5ac9", "41"], ["aw", "#2f8a6a", "7"], ["berry", "#D97757", "903"]] as const;

// ================= the Open Bot Avatar short =================
// Avatars are drawn from the library's own frame data (avatarFrame: the projected cross-sections + eyes, with its idle
// motion, blinks, moods and gaze at time t) onto a lit 600 x 1000 character card, with an ink silhouette outline so they
// sit in the toon world. Base of the 0..100 box (y 92) on the card's feet line (975); 540 units wide = 1.17 m at scale 1.
const AVP = new Map<string, Path2D>();
const p2d = (d: string) => { let x = AVP.get(d); if (!x) { x = new Path2D(d); AVP.set(d, x); } return x; };
const drawAv = (fr: AvatarFrame) => (p: Pen) => {
  const g = p.g, paths = new Map(fr.paths.map((x) => [x.id, x]));
  g.save(); g.translate(30, 975 - 92 * 5.4); g.scale(5.4, 5.4);
  const r = fr.root; g.transform(r[0], r[1], r[2], r[3], r[4], r[5]);
  g.lineJoin = "round"; g.strokeStyle = INK; g.lineWidth = 2.4;
  for (const s of fr.shapes) if (s.kind === "slice") { const m = s.matrix; g.save(); g.transform(m[0], m[1], m[2], m[3], m[4], m[5]); g.stroke(p2d(paths.get(s.path)!.d)); g.restore(); }
  for (const s of fr.shapes) {
    const m = s.matrix; g.save(); g.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    if (s.kind === "slice") { const d = paths.get(s.path)!; g.fillStyle = fr.color; g.fill(p2d(d.d), d.evenOdd ? "evenodd" : "nonzero"); }
    else if (s.mark.shape === "arc") { g.strokeStyle = fr.ink; g.lineWidth = s.mark.strokeWidth; g.lineCap = "round"; g.stroke(p2d(s.mark.d)); }
    else { const k = s.mark; g.fillStyle = fr.ink; g.beginPath(); g.roundRect(k.x, k.y, k.width, k.height, k.radius); g.fill(); }
    g.restore();
  }
  g.restore();
};
type AvOpt = { motion?: AvatarMotion; blend?: AvatarMotionBlend; gaze?: { x: number; y: number; weight?: number }; view?: { yaw: number; pitch: number }; color?: string; toff?: number };
/** one avatar standing at (x, y, z), sc x 1.17 m wide, with its contact shadow */
const avatar = (cam: CamInfo, t: number, out: Stage, def: AvatarDefinition, x: number, z: number, sc: number, o: AvOpt = {}, y = D0, shadow = true) => {
  if (sc <= 0.001) return;
  const opts = { color: o.color ?? AVC[def.id] ?? "#ff6a1a", time: t + (o.toff ?? 0), motion: o.motion, motionBlend: o.blend, gaze: o.gaze, view: o.view };
  const fr = avatarFrame(def, opts);
  const d = cam.pos.distanceTo(tmp.set(x, y + 0.6 * sc, z)) / sc;
  const [w, h, k] = tier(d);
  const key = `AV|${def.id}|${fkey({ ...opts, time: q(opts.time, 30) })}`;
  out.places.push({ key, x, y, z, scale: sc, draw: drawAv(fr), size: [w, h, k] });
  if (shadow) blob(out, x, y, z, sc * 1.25);
};
/** clock offset that lands this avatar's library blink on time T (s) */
const blinkOff = (def: AvatarDefinition, T: number) => {
  const seed = hashString(def.id); let best = 0, v = -1;
  for (let o = 0; o < 4.2; o += 1 / 60) { const b = blinkAt(seed, T + o); if (b > v) { v = b; best = o; } }
  return best;
};
/** gaze toward a world point, from the avatar's face (~0.65 sc m up) */
const gazeAt = (cam: CamInfo, x: number, y: number, z: number, tx: number, ty: number, tz: number, weight = 1) => {
  const dx = (tx - x) * cam.right.x + (tz - z) * cam.right.z;
  return { x: Math.max(-1, Math.min(1, dx / 1.1)), y: Math.max(-1, Math.min(1, -(ty - y) / 1.1)), weight };
};
const moodAt = (f: number, ch: [number, AvatarMotion][]): { motion: AvatarMotion; blend?: AvatarMotionBlend } => {
  let i = -1; ch.forEach(([a], j) => { if (a <= f) i = j; });
  if (i < 0) return { motion: "idle" };
  const tt = moodProgress(((f - ch[i][0]) / FPS) * 1000);
  return tt >= 1 || i === 0 ? { motion: ch[i][1] } : { motion: ch[i][1], blend: { from: ch[i - 1][1], t: tt } };
};
/** back-out pop 0 -> 1.12 -> 1 over n frames */
const popB = (f: number, at: number, n = 9) => { const u = clamp01((f - at) / n) - 1; return u >= 0 ? 1 : Math.max(0, 1 + 3.4 * u * u * u + 2.4 * u * u); };
const puff = (out: Stage, f: number, at: number, x: number, y: number, z: number, s = 1.6) => {
  const u = (f - at) / 14; if (u < 0 || u >= 1) return;
  const uq = q(u, 30); out.fx.push({ key: `puff${uq}`, cw: 300, ch: 300, draw: (p) => fxPuff(p, uq), x, y, z: z + 0.15, w: s, h: s, soft: true });
};
const say = (text: string, w = 560, h = 200) => (p: Pen) => {
  const g = p.g; g.beginPath(); g.roundRect(10, 10, w - 20, h - 70, 46); g.fillStyle = "#ffffff"; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  p.poly([[w * 0.3, h - 64], [w * 0.22, h - 12], [w * 0.42, h - 64]], "#ffffff", 0); p.stroke([[w * 0.3, h - 62], [w * 0.22, h - 12], [w * 0.42, h - 62]], 8, INK);
  g.fillStyle = "#1d1b22"; g.font = `bold ${Math.round((h - 70) * 0.46)}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, w / 2, (h - 60) / 2 + 6);
};
const thinkDots = (n: number) => (p: Pen) => {
  p.ell(160, 110, 130, 90, "#ffffff", 7); p.ell(60, 230, 22, 18, "#ffffff", 6); p.ell(30, 275, 12, 10, "#ffffff", 5);
  for (let i = 0; i < n; i++) p.ell(105 + i * 55, 112, 16, 16, "#1f7cf2", 0);
};
const ENVELOPE = (p: Pen) => {
  p.poly([[10, 20], [190, 20], [190, 130], [10, 130]], "#fbf7ee", 7);
  p.stroke([[10, 20], [100, 85], [190, 20]], 7, INK);
};
const MONO = "bold 36px Consolas, 'Courier New', monospace";
const JSONCARD = (p: Pen) => {
  const g = p.g; g.beginPath(); g.roundRect(8, 8, 984, 544, 40); g.fillStyle = "#16161c"; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  g.fillStyle = "#ff6a1a"; g.font = "bold 34px Georgia, serif"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("controller.json", 48, 66);
  const L: [string, string][][] = [
    [["#8a8a96", "{"]],
    [["#8a8a96", "  "], ["#9ecbff", '"name"'], ["#8a8a96", ": "], ["#ffb86b", '"Controller"'], ["#8a8a96", ","]],
    [["#8a8a96", "  "], ["#9ecbff", '"body"'], ["#8a8a96", ": { "], ["#9ecbff", '"path"'], ["#8a8a96", ": "], ["#ffb86b", '"M18 30 C…"'], ["#8a8a96", " },"]],
    [["#8a8a96", "  "], ["#9ecbff", '"eyes"'], ["#8a8a96", ": { "], ["#9ecbff", '"x"'], ["#8a8a96", ": "], ["#c3e88d", "50"], ["#8a8a96", ", "], ["#9ecbff", '"y"'], ["#8a8a96", ": "], ["#c3e88d", "46"], ["#8a8a96", ","]],
    [["#8a8a96", "            "], ["#9ecbff", '"spacing"'], ["#8a8a96", ": "], ["#c3e88d", "15"], ["#8a8a96", " }"]],
    [["#8a8a96", "}"]],
  ];
  g.font = MONO;
  L.forEach((line, i) => { let x = 48; for (const [c, s] of line) { g.fillStyle = c; g.fillText(s, x, 140 + i * 64); x += g.measureText(s).width; } });
};
const SHAPECARD = (def: AvatarDefinition, eyes: boolean) => (p: Pen) => {
  const g = p.g; g.beginPath(); g.roundRect(8, 8, 984, 544, 40); g.fillStyle = "#16161c"; g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.stroke();
  g.save(); g.translate(500 - 250, 280 - 250); g.scale(5, 5);
  g.lineJoin = "round"; g.lineWidth = 1.2; g.strokeStyle = "#ffffff"; g.setLineDash([3, 2]); g.stroke(p2d(def.body.path)); g.setLineDash([]);
  if (eyes) {
    const e = def.eyes, ew = 4 * e.scale * 1.3, eh = 11 * e.scale * 1.3;
    g.fillStyle = "#ffffff";
    for (const s of [-1, 1]) { g.beginPath(); g.roundRect(e.x + (s * e.spacing) / 2 - ew / 2, e.y - eh / 2, ew, eh, ew / 2); g.fill(); }
  }
  g.restore();
  g.fillStyle = eyes ? "#ffffff" : "#9a9aa6"; g.font = "bold 46px Georgia, serif"; g.textAlign = "center";
  g.fillText(eyes ? "+ two eyes" : "one shape", 500, 520);
};
const BOTS = ["controller", "ghost", "magnifier", "mug"] as const;
const ROWX: [number, number][] = [[-0.05, -54.6], [0.55, -55.8], [1.15, -57.0], [1.75, -58.2]];
const crowdSpots = (() => {
  const out: { def: AvatarDefinition; x: number; z: number; sc: number; i: number }[] = [];
  const rows: [number, number, number, number][] = [[8, -59.4, 0.46, 0.5], [8, -58.3, 0.5, 0.55], [6, -57.2, 0.58, 0.62]]; // n, z, spacing, scale
  let i = 0;
  for (const [n, z, sp, sc] of rows) for (let k = 0; k < n; k++) { out.push({ def: AV_ALL[i], x: (k - (n - 1) / 2) * sp + (z === -58.3 ? 0.2 : 0), z: z + 0.15 * Math.sin(i * 2.1), sc, i }); i++; }
  return out;
})();

/** everything with a face in shot `id` at time t */
export const stage = (id: number, t: number, b: BridgeState, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  const s = SHOTS[id - 1];
  LNAME = s.light;
  findSun(cam, SUN);
  const f = t * FPS, B = BT;
  switch (s.crowd) {
    case "same": case "faces": {
      const poofAt = (k: number) => B.faces - 8 + k * 5;
      asker(cam, t, out, -0.5, -53.8, { expr: s.crowd === "faces" && f >= poofAt(0) + 4 ? "shock" : "dazed", look: 1 });
      ROWX.forEach(([x, z], k) => {
        const tp = s.crowd === "faces" ? poofAt(k) : 1e9;
        if (f < tp + 2) put(cam, t, out, 700, ROBOT, "robot", x, z, { expr: "neutral" }); // one blink clock: they blink in unison
        puff(out, f, tp, x, D0 + 0.9, z, 1.9); burst(out, f, tp + 1, x, D0 + 1.2, z + 0.1, 1.3, "#fff6d0");
        if (f >= tp + 2) avatar(cam, t, out, AVB[BOTS[k]], x, z, 0.8 * popB(f, tp + 2), { motion: f >= tp + 14 ? "happy" : "idle", toff: k * 1.3 });
      });
      if (s.crowd === "same") { const k = pop(f, B.same - 4); if (k > 0) card(out, "bubq", 300, 300, bubble("?"), -0.3, D0 + 2.4, -53.8, 0.5 * k); }
      break;
    }
    case "wrongbot": {
      asker(cam, t, out, -0.7, -55.1, { expr: f >= B.shows + 6 ? "stern" : "smile", look: 1, wave: f < B.coding + 18 ? 0.5 : undefined });
      const k1 = pop(f, B.coding - 4) * (1 - pop(f, B.email - 2)); if (k1 > 0) card(out, "askcode", 600, 220, say("coding bot?", 600, 220), -0.55, D0 + 2.45, -55.0, 1.1 * k1);
      const u = clamp01((f - (B.email - 14)) / 26), x = 2.3 - 1.65 * smooth(u);
      if (f < B.email - 14) put(cam, t, out, 700, ROBOT, "robot", 2.4, -55.4, { expr: "neutral" });
      else if (u < 1) walker(cam, t, out, 700, ROBOT, "robot", x, -55.4, -1, 0, 1.6, "grin");
      else put(cam, t, out, 700, ROBOT, "robot", x, -55.4, { expr: "grin" });
      if (f >= B.email - 14) card(out, "env", 200, 150, ENVELOPE, x - 0.35, D0 + 1.0, -55.2, 0.36, -0.15);
      const k2 = pop(f, B.shows); if (k2 > 0) card(out, "dearsir", 600, 220, say("Dear Sir,", 600, 220), 0.4, D0 + 2.55, -55.3, 1.05 * k2);
      break;
    }
    case "spec": {
      const hero = AVB.controller;
      avatar(cam, t, out, hero, 0, -55.6, 1.0, { motion: f >= B.eyes + 2 ? "happy" : "idle" });
      const kb = popB(f, B.avatar - 8); if (kb > 0) card(out, "banner", 1100, 200, label("OPEN BOT AVATAR", "#ff6a1a", "#ffffff", 1100, 200, 0.5), 0, D0 + 3.1, -55.4, 1.9 * kb);
      burst(out, f, B.avatar - 8, 0, D0 + 3.2, -55.3, 2.0);
      const kc = popB(f, B.json - 6);
      if (kc > 0) {
        const step = f >= B.eyes - 3 ? 2 : f >= B.shape - 3 ? 1 : 0;
        card(out, `spec${step}`, 1000, 560, step === 0 ? JSONCARD : SHAPECARD(hero, step === 2), 0, D0 + 2.05, -55.5, 1.95 * kc);
        burst(out, f, B.shape - 3, 0, D0 + 2.05, -55.4, 1.4); burst(out, f, B.eyes - 3, 0, D0 + 2.15, -55.4, 1.2, "#ffffff");
      }
      break;
    }
    case "render": {
      const xs = [-0.72, 0, 0.72], ids = ["controller", "ghost", "magnifier"];
      const kx = -2.6 + 5.2 * clamp01((f - (B.follow - 18)) / 52), wk = clamp01((f - (B.follow - 14)) / 10) * (1 - clamp01((f - 612) / 8));
      ids.forEach((id, k) => {
        const def = AVB[id], toff = blinkOff(def, B.blink / FPS + (k - 1) * 0.07);
        const yaw = f >= B.depth - 4 && f < B.depth + 40 ? 0.62 * Math.sin((Math.PI * 2 * (f - B.depth + 4)) / 44) : 0;
        avatar(cam, t, out, def, xs[k], -55.4, 0.58, { toff, view: { yaw, pitch: 0 }, gaze: wk > 0 ? gazeAt(cam, xs[k], D0 + 0.5, -55.4, kx, D0 + 0.9, -54.0, wk) : undefined });
      });
      if (f >= B.follow - 18 && f < 619) walker(cam, t, out, 720, KID, "kid", kx, -54.0, 1, 0, 3.0, "grin");
      break;
    }
    case "moods": {
      const m = moodAt(f, [[0, "idle"], [B.thinking - 3, "thinking"], [B.happy - 3, "happy"]]);
      asker(cam, t, out, -0.6, -55.1, { expr: f >= B.done ? "laugh" : "smile", look: 1, wave: f >= B.done ? q(Math.sin(t * 7), 4) : undefined });
      const hop = f >= B.happy ? Math.abs(Math.sin(((f - B.happy) / 9) * Math.PI)) * 0.12 * Math.max(0, 1 - (f - B.happy) / 50) : 0;
      avatar(cam, t, out, AVB.magnifier, 0.42, -55.5, 0.82, { ...m }, D0 + hop);
      const k0 = pop(f, B.moods - 14) * (1 - pop(f, B.thinking - 6)); if (k0 > 0) card(out, "askkeys", 600, 220, say("find my keys?", 600, 220), -0.6, D0 + 2.45, -55.0, 1.05 * k0);
      const kt = pop(f, B.thinking - 2) * (1 - pop(f, B.happy - 4, 4)); if (kt > 0) card(out, `think${1 + (Math.floor(f / 8) % 3)}`, 300, 300, thinkDots(1 + (Math.floor(f / 8) % 3)), 0.55, D0 + 1.75, -55.3, 0.62 * kt);
      burst(out, f, B.happy - 2, 0.42, D0 + 0.7, -55.4, 1.5, "#ffe08a");
      const kd = popB(f, B.done - 4); if (kd > 0) card(out, "done", 420, 160, label("DONE!", "#1fbf68", "#ffffff", 420, 160, 0.56), 0.4, D0 + 1.55, -55.2, 0.75 * kd);
      break;
    }
    case "crowd": {
      crowdSpots.forEach(({ def, x, z, sc, i }) => {
        const at = B.n22 - 4 + i * 1.6;
        if (f < at) return;
        avatar(cam, t, out, def, x, z, sc * popB(f, at, 8), { toff: i * 0.77, motion: i % 3 === 0 && f > at + 20 ? "happy" : "idle" });
      });
      asker(cam, t, out, -0.72, -54.6, { expr: f >= B.write ? "laugh" : "smile", look: 1 });
      const kq = pop(f, B.describe - 4) * (1 - pop(f, B.write + 14)); if (kq > 0) card(out, "clap?", 640, 220, say("a clapperboard!", 640, 220), -0.35, D0 + 2.3, -54.5, 1.1 * kq);
      const tc = B.write - 1;
      puff(out, f, tc - 2, 0.55, D0 + 0.6, -55.2, 1.6); burst(out, f, tc, 0.55, D0 + 0.8, -55.1, 1.4);
      if (f >= tc) avatar(cam, t, out, CLAPPER, 0.55, -55.2, 0.7 * popB(f, tc, 9), { color: "#f2384b", motion: f >= tc + 12 ? "happy" : "idle" });
      break;
    }
    case "free": {
      crowdSpots.forEach(({ def, x, z, sc, i }) => {
        const hop = Math.abs(Math.sin(t * 6 + i * 0.9)) * 0.1 * sc;
        avatar(cam, t, out, def, x, z, sc, { toff: i * 0.77, motion: "happy" }, D0 + hop);
      });
      avatar(cam, t, out, CLAPPER, 0.55, -55.2, 0.7, { color: "#f2384b", motion: "happy" }, D0 + Math.abs(Math.sin(t * 6)) * 0.08);
      asker(cam, t, out, -0.72, -54.6, { expr: "laugh", look: 1, wave: q(Math.sin(t * 7), 4) });
      ([[B.free, "FREE", "#1fbf68", -0.85, 3.25, 0.8], [B.open, "OPEN SOURCE", "#1f7cf2", 0.55, 3.25, 1.3], [B.mit, "MIT", "#ff6a1a", -0.05, 2.75, 0.62]] as const).forEach(([at, txt, c, x, y, w]) => {
        const k = popB(f, at - 3); if (k > 0) card(out, `sign${txt}`, Math.round(140 + txt.length * 52), 170, label(txt, c, "#ffffff", Math.round(140 + txt.length * 52), 170, 0.52), x, D0 + y, -55.6, w * k);
        burst(out, f, at - 3, x, D0 + y, -55.5, 1.0);
      });
      const kg = popB(f, B.search - 4); if (kg > 0) card(out, "github", 1500, 170, label("github.com/DominikScholz/open-bot-avatar", "#16161c", "#ffffff", 1500, 170, 0.34), 0, D0 + 2.15, -55.0, 2.3 * kg);
      break;
    }
    case "replyall": {
      const gx = 0, gz = -55.8;
      avatar(cam, t, out, AVB.ghost, gx, gz, 1.0, { motion: "happy" });
      const hit = f >= B.replyall;
      ([["controller", -1.05, -55.1, 0.62], ["magnifier", 1.05, -55.2, 0.62]] as const).forEach(([id, x, z, sc], k) =>
        avatar(cam, t, out, AVB[id], x, z, sc, { motion: hit ? "thinking" : "idle", toff: k * 1.7, gaze: gazeAt(cam, x, D0 + 0.4, z, gx, D0 + 0.8, gz, hit ? 1 : 0.6) }));
      asker(cam, t, out, -0.55, -54.7, { expr: hit ? "shock" : "neutral", look: 1, tilt: hit ? -4 : 0 });
      // a few envelopes before the line lands, then reply-all: a fountain of them for the rest of the shot
      const sends = [B.email2 - 4, B.email2 + 10, B.email2 + 22];
      const emit: number[] = [...sends]; if (hit) for (let e = B.replyall - 2; e < f; e += 1.5) emit.push(e);
      emit.forEach((e0, n) => {
        const u = (f - e0) / FPS; if (u < 0 || u > 1.4) return;
        const a = n < 3 ? [-2.4, 2.5, -2.2][n] : (hh(n, 41) - 0.5) * 5.2, v = 2.6 + hh(n, 42) * 2.4;
        const x = gx + Math.sin(a * 0.55) * v * u * 0.9, y = D0 + 0.8 + Math.cos(a * 0.3) * (3.2 + hh(n, 43) * 1.4) * u - 4.9 * u * u, z = gz + 0.4 + hh(n, 44) * 1.2 * u;
        if (y < D0 - 0.1) return;
        card(out, "env", 200, 150, ENVELOPE, x, y, z, 0.3, u * (hh(n, 45) - 0.5) * 12);
      });
      burst(out, f, B.replyall - 1, gx, D0 + 0.8, gz + 0.2, 1.8, "#ffffff");
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
