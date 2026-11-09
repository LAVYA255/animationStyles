/* motion-kit.js: seek-safe motion maths for HyperFrames / plain-HTML compositions (Motion Lab playbook, shared-tools/motion-lab).
   Every function is a pure function of time, so any frame renders on its own (render contract: no clocks, no timers, no unseeded random).

   <script src="assets/motion-kit.js"></script>   then   MK.ease.outQuint(k), MK.spring(t, 0.8, 2), MK.tween(t, start, dur, "outExpo") ...

   Numbers (from the playbook):
     enter with ease-out, exit with ease-in and 40-50% shorter, move with ease-in-out; linear only for rotation / progress / loop phase
     springs by damping ratio: 1.0 no bounce, 0.7-0.85 premium, 0.4-0.6 playful, <0.3 cartoon. Position/scale may bounce; opacity/colour never
     one hero per shot; secondary moves 50-70% of the hero's travel, 100-200 ms later; ambient < 5% of hero travel on a slow sine
     hero reveal 600-900 ms, UI moves 200-500 ms, letters 1 frame apart, words 60-120 ms, list items 40-80 ms
     text holds at least 0.3 s per word + 0.5 s; during holds push the frame ~2% so it never freezes */
(function (root) {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));

  // CSS cubic-bezier(x1, y1, x2, y2) as a function of progress x in [0,1] (Newton, bisection fallback: same curve the browser draws)
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (u) => ((ax * u + bx) * u + cx) * u, sy = (u) => ((ay * u + by) * u + cy) * u, dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let u = x;
      for (let i = 0; i < 8; i++) { const e = sx(u) - x; if (Math.abs(e) < 1e-6) return sy(u); const d = dx(u); if (Math.abs(d) < 1e-6) break; u -= e / d; }
      let lo = 0, hi = 1; u = x;
      for (let i = 0; i < 30; i++) { const v = sx(u); if (Math.abs(v - x) < 1e-6) break; if (v < x) lo = u; else hi = u; u = (lo + hi) / 2; }
      return sy(u);
    };
  }
  const ease = {
    linear: (x) => clamp(x),
    outExpo: bezier(0.16, 1, 0.3, 1),        // text and logo reveals
    outQuint: bezier(0.22, 1, 0.36, 1),      // premium entrances
    inOutQuart: bezier(0.76, 0, 0.24, 1),    // moves, camera pushes
    inExpo: bezier(0.7, 0, 0.84, 0),         // fast exits
    outBack: bezier(0.34, 1.56, 0.64, 1),    // playful pop (position/scale only)
    inOutSine: (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x)),
  };

  // damped spring from 0 to 1, as a closed form of time: progress at t seconds. zeta = damping ratio, f = natural frequency (Hz)
  function spring(t, zeta = 0.8, f = 2.0) {
    if (t <= 0) return 0;
    const w = 2 * Math.PI * f;
    if (zeta < 1) { const wd = w * Math.sqrt(1 - zeta * zeta); return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t)); }
    if (zeta === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const r1 = -w * (zeta - Math.sqrt(zeta * zeta - 1)), r2 = -w * (zeta + Math.sqrt(zeta * zeta - 1));
    return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
  }
  // spring settle time (to within 1%): useful for scheduling the next element when this one is 30-50% done
  const settle = (zeta = 0.8, f = 2.0) => { for (let t = 0; t < 10; t += 1 / 240) { let ok = true; for (let u = t; u < t + 0.5; u += 1 / 60) if (Math.abs(1 - spring(u, zeta, f)) > 0.01) { ok = false; break; } if (ok) return t; } return 10; };

  // tween: 0..1 progress of a move that starts at `a` and lasts `dur`, through a named or custom ease
  const tween = (t, a, dur, e = "outQuint") => (typeof e === "function" ? e : ease[e])(seg(t, a, a + dur));
  const lerp = (a, b, k) => a + (b - a) * k;

  // beat grid: compute each beat from its index (never by adding rounded values: that drifts)
  function beats(bpm, fps = 30, offset = 0) {
    const spb = 60 / bpm;
    return { spb, framesPerBeat: fps * spb, time: (n) => offset + n * spb, frame: (n) => Math.round((offset + n * spb) * fps), index: (t) => Math.floor((t - offset) / spb),
             phase: (t) => (((t - offset) / spb) % 1 + 1) % 1, pulse: (t, width = 0.12) => { const p = (((t - offset) / spb) % 1 + 1) % 1; return p < width ? 1 - p / width : 0; } };
  }

  // seeded random (mulberry32): same numbers every render
  function rng(seed = 1) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  function noise2(x, y, s = 0) {                                           // value noise, smooth
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return lerp(lerp(a, b, u), lerp(c, d, u), v) * 2 - 1;
  }
  // loop-safe drift: noise sampled on a circle, so phase 0 and phase 1 are the same value (seamless loops)
  const loopNoise = (phase, seed = 0, radius = 1) => noise2(Math.cos(2 * Math.PI * phase) * radius + 10, Math.sin(2 * Math.PI * phase) * radius + 10, seed);
  const loopPhase = (frame, totalFrames, cycles = 1) => ((frame / totalFrames) * cycles) % 1;      // whole-number cycles only

  // timing helpers
  const holdFor = (words) => 0.3 * words + 0.5;                            // seconds a text state must stay readable
  const stagger = (i, gap = 0.08) => i * gap;
  const secondary = (heroStart, heroTravel, delay = 0.15, ratio = 0.6) => ({ start: heroStart + delay, travel: heroTravel * ratio });
  const ambient = (t, travel, period = 6, seed = 0) => travel * 0.04 * Math.sin((2 * Math.PI * t) / period + seed);   // < 5% of hero travel, never stops
  const holdPush = (t, a, b, amount = 0.02) => 1 + amount * ease.inOutSine(seg(t, a, b));                           // keeps holds alive
  const pop = (t, at, frames = 6, fps = 30, amount = 0.08) => { const k = seg(t, at - (frames / fps) / 2, at + (frames / fps) / 2); return 1 + amount * Math.sin(Math.PI * k); }; // "make it pop", peaks on `at`

  // async setup (fonts, SVG fetches, audio JSON) before HyperFrames captures frame 0: the runtime holds render-ready while
  // window.__hfTimelinesBuilding is true and resumes on the "hf-timelines-built" event (hyperframes runtime contract).
  //   MK.build(async () => { await Doodle.loadFont(...); ...; window.__timelines["root"] = tl; });
  async function build(fn) {
    root.__hfTimelinesBuilding = true;
    try { await fn(); } finally { root.__hfTimelinesBuilding = false; root.dispatchEvent && root.dispatchEvent(new Event("hf-timelines-built")); }
  }

  root.MK = { clamp, seg, lerp, bezier, ease, spring, settle, tween, beats, rng, noise2, loopNoise, loopPhase, holdFor, stagger, secondary, ambient, holdPush, pop, build };
})(typeof window !== "undefined" ? window : globalThis);
