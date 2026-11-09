/* engine.js: the shared film engine for "Weird Worlds" reels. A reel's scene.js calls WK.film({ captions, cam, render }).
   - Narration/dialogue timing comes from assets/timing.js (window.TIMING): lines[i].start/end/words[j] = [t0, t1, word].
   - Captions: short key phrases; each word pops on its spoken time and then holds still; a group is fully written and holds >= 1 s
     (the resolver delays the next group if needed); "hard" groups must end on time (a cut). Speaker colour per group.
   - Camera: keys [t, scale, cx, cy] eased between keys (inOutSine); jumps hide under a transition.
   - Transitions: page turn, whip pan, iris, dissolve-to-colour. One flash max per reel (the showcase).
   Everything is a pure function of t (seek-safe). */
(function (root) {
  const T = root.TIMING, L = T.lines, el = Person.el, INK = "#1d1b1a";
  const E = Object.assign({}, MK.ease, { inQuad: (x) => x * x, outQuad: (x) => 1 - (1 - x) * (1 - x) }), seg = MK.seg, clamp = MK.clamp, lerp = MK.lerp;
  const w = (i, j) => (j < 0 ? L[i].words[L[i].words.length + j][0] : L[i].words[j][0]), ls = (i) => L[i].start, le = (i) => L[i].end;
  const arc = (k, h) => -4 * h * k * (1 - k);
  const blink = (t, off = 0) => ((t + off) % 3.3) < 0.11;
  const talkOpen = (t, seed = 0) => 0.15 + 0.65 * Math.abs(Math.sin(t * 11 + seed)) * Math.abs(Math.sin(t * 3.7 + 1 + seed));
  const speaking = (t, i) => t >= L[i].start && t <= L[i].end && L[i].words.some((wd) => t >= wd[0] - 0.02 && t <= wd[1] + 0.04);
  const shake = (t, a, b, amp, seed = 0) => { if (t <= a || t >= b) return [0, 0]; const r = MK.rng(Math.floor(t * 30) + seed), m = amp * (1 - seg(t, a, b)); return [(r() - 0.5) * m, (r() - 0.5) * m]; };
  function camAt(keys, t) { for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t < b[0]) { const k = (a[4] === "cut") ? 0 : E.inOutSine(seg(t, a[0], b[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; } }
    const z = keys[keys.length - 1]; return [z[1], z[2], z[3]]; }

  // ---- transitions (draw into the fx layer, screen space 1080x1920)
  const TR = {
    pageTurn(fx, t, a, mid, b, paper = "#F7F2E6") { if (t <= a || t >= b) return; const k1 = E.inOutSine(seg(t, a, mid)), k2 = E.inOutSine(seg(t, mid, b));
      const xl = t < mid ? lerp(1120, -60, k1) : -60, xr = t < mid ? 1300 : lerp(1300, -200, k2), sk = t < mid ? 160 * (1 - k1) : 160 * k2;
      el("path", { d: `M${xl},-20 L${xr},-20 L${xr - sk},1940 L${xl - sk},1940 Z`, fill: paper, stroke: INK, "stroke-width": 8 }, fx);
      el("path", { d: `M${xl},-20 L${xl - sk},1940`, stroke: "rgba(0,0,0,.12)", "stroke-width": 40 }, fx); },
    whip(fx, t, a, b, tone = "#ffffff") { if (t <= a || t >= b) return; const k = Math.sin(seg(t, a, b) * Math.PI);
      for (let i = 0; i < 22; i++) { const y = (i * 97 + 31) % 1920, len = 300 + (i * 53) % 500; el("rect", { x: ((i * 211 + t * 9000) % 1600) - 400, y, width: len, height: 14 + (i % 3) * 8, rx: 8, fill: i % 2 ? "#fff" : tone, opacity: 0.9 * k }, fx); } },
    iris(fx, t, a, mid, b, x = 540, y = 960, col = "#1d1b1a") { if (t <= a || t >= b) return; const r = t < mid ? lerp(1300, 0, E.inQuad(seg(t, a, mid))) : lerp(0, 1300, E.outQuad(seg(t, mid, b)));
      el("path", { d: `M-50,-50 H1130 V1970 H-50 Z M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`, fill: col, "fill-rule": "evenodd" }, fx); },
    fade(fx, t, a, mid, b, col = "#1d1b1a") { if (t <= a || t >= b) return; const o = t < mid ? seg(t, a, mid) : 1 - seg(t, mid, b); el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: col, opacity: o }, fx); },
  };

  // ---- the film
  function film({ captions = [], cam = [[0, 1, 540, 960]], render, flashAt = null, bg = "#ffffff", titleSlam = null, font = "Permanent Marker", labelFont = null, capStroke = "#fff" }) {
    window.FONT = labelFont || font; // Kit.txt labels follow the reel's font unless labelFont says otherwise
    const DUR = T.dur, $ = (i) => document.getElementById(i);
    MK.build(async () => {
      await document.fonts.load(`96px '${font}'`); await document.fonts.load(`96px '${window.FONT}'`); await document.fonts.ready;
      const world = $("world"), fxg = $("fx"), hud = $("hud"), over = $("over");
      function line(text, { x = 540, y, size = 84, at, color = INK, accent = [], acc = "#D97757" }) {
        const g = el("g", {}, hud), ws = text.split(" "), tmp = el("text", { "font-family": font, "font-size": size }, g);
        let sp = size * 0.26, widths = ws.map((s) => { tmp.textContent = s; return tmp.getComputedTextLength(); }); tmp.remove();
        const fit = Math.min(1, 980 / (widths.reduce((a, b) => a + b, 0) + sp * (ws.length - 1))); // never wider than the frame
        if (fit < 1) { size *= fit; sp *= fit; widths = widths.map((v) => v * fit); }
        let cx = x - (widths.reduce((a, b) => a + b, 0) + sp * (ws.length - 1)) / 2; const items = [];
        ws.forEach((s, i) => { const t = el("text", { "font-family": font, "font-size": size, "text-anchor": "middle", fill: accent.includes(s) ? acc : color, stroke: capStroke, "stroke-width": 12, "paint-order": "stroke" }, g);
          t.textContent = s; items.push({ t, x: cx + widths[i] / 2, at: at[Math.min(i, at.length - 1)] }); cx += widths[i] + sp; });
        return (time, show) => items.forEach((it) => { const k = seg(time, it.at, it.at + 0.22), s = k <= 0 ? 0 : E.outBack(k);
          it.t.setAttribute("transform", `translate(${it.x} ${y}) scale(${s})`); it.t.style.opacity = k > 0 ? show : 0; });
      }
      // resolve caption groups: [from, to, [text, opts], ... , "hard"?]
      const cap = []; let prev = 0;
      captions.forEach((g) => { let [from, to, ...rest] = g; const hard = rest[rest.length - 1] === "hard"; if (hard) rest.pop();
        from = Math.max(from, prev);
        const opts = rest.map(([, o]) => Object.assign({}, o, { at: o.at.map((a) => Math.max(a, from + 0.02)) }));
        const written = Math.max(...opts.flatMap((o) => o.at)) + 0.22;
        to = hard ? to - 0.12 : Math.max(to, written + 1.0);
        cap.push({ from, to, written, hard, lines: rest.map(([txt], i) => line(txt, opts[i])) }); prev = to + 0.12; });
      root.__captions = cap.map((c) => ({ from: +c.from.toFixed(2), to: +c.to.toFixed(2), written: +c.written.toFixed(2), hold: +(c.to - c.written).toFixed(2), hard: c.hard }));
      let slam = null;
      if (titleSlam) { slam = el("g", {}, hud); const tt = el("text", { x: 0, y: 0, "text-anchor": "middle", "font-family": font, "font-size": titleSlam.size || 140, fill: titleSlam.color || "#3FB8AF", stroke: INK, "stroke-width": 9, "paint-order": "stroke" }, slam); tt.textContent = titleSlam.text; }
      const draw = (t) => {
        world.replaceChildren(); fxg.replaceChildren(); over.replaceChildren();
        const out = render(t, { world, fx: fxg, over }) || {};
        cap.forEach((c) => { const on = t >= c.from && t < c.to + 0.12 ? 1 - seg(t, c.to, c.to + 0.12) : 0; c.lines.forEach((f) => f(t, on)); });
        if (slam) { const s = t < titleSlam.at ? 0 : E.outBack(seg(t, titleSlam.at, titleSlam.at + 0.22)), f = 1 - seg(t, titleSlam.until - 0.2, titleSlam.until);
          slam.setAttribute("transform", `translate(540 ${titleSlam.y || 330}) scale(${s * (1 + 0.02 * Math.sin(t * 8))}) rotate(${-4 + (1 - s) * -12})`); slam.style.opacity = s > 0 ? f : 0; }
        $("flash").setAttribute("opacity", flashAt !== null && t >= flashAt && t < flashAt + 0.07 ? 0.8 : 0);
        let [sc, cx, cy] = camAt(cam, t); const [sx, sy] = out.shake || [0, 0];
        if (out.cam) [sc, cx, cy] = [out.cam[0] ?? sc, out.cam[1] ?? cx, out.cam[2] ?? cy];
        if (out.dx) cx += out.dx / sc;
        $("root").style.background = out.bg || bg;
        $("cam").setAttribute("transform", `translate(${540 + sx} ${960 + sy}) scale(${sc}) translate(${-cx} ${-cy})`);
      };
      const tl = gsap.timeline({ paused: true }), clock = { t: 0 };
      tl.to(clock, { t: DUR, duration: DUR, ease: "none", onUpdate: () => draw(clock.t) }, 0);
      draw(0);
      root.__timelines = root.__timelines || {}; root.__timelines.root = tl; root.__render = (t) => { tl.seek(t, false); };
    });
  }
  root.WK = { T, L, E, seg, clamp, lerp, w, ls, le, arc, blink, talkOpen, speaking, shake, camAt, TR, film, el, INK };
})(window);
