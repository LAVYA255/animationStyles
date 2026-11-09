/* doodle-kit.js: hand-drawn motion for HyperFrames, seek-safe (every frame a pure function of t).
   Needs: svg2roughjs (UMD, global `svg2roughjs`) for sketch(), rough.js (global `rough`) for annotate(). handwriting() and drawOn()
   need nothing else.

     const font = await Doodle.loadFont("assets/lib/hershey-fonts/HersheyScript1.svg");      // single-stroke fonts
     const hw = Doodle.handwriting(svg, "Write it by hand", {font, size: 120, x: 160, y: 420, color: "#222", speed: 900, at: 0.3});
     const icon = await Doodle.sketch(svg, "assets/lib/lucide/brain.svg", {x: 1300, y: 300, size: 360, color: "#E8590C", seed: 3, boil: 3});
     const ul = Doodle.annotate(svg, {x: 160, y: 440, w: 900, h: 20}, "underline", {color: "#E8590C", seed: 5});
     function render(t) { hw.render(t); icon.render(t, 2.0, 1.4); ul.render(t, 3.4, 0.5); }

   - handwriting: real stroke order from Hershey/EMS single-line fonts, pen speed in px/s, natural pen lifts between strokes,
     letters, words and lines. hw.penAt(t) gives the pen tip (to attach a pencil/hand sprite).
   - sketch: any SVG (Lucide icon, logo, diagram) redrawn by svg2roughjs; boil = N pre-rendered seeds cycled 12x/s (hand-animation
     "line boil"); render(t, start, dur) draws it on stroke by stroke.
   - annotate: underline / box / circle / highlight / strike / cross / bracket / arrow, rough.js lines drawn on like a marker.
   - drawOn(group): draw any existing SVG strokes on in document order, at constant pen speed. */
(function (root) {
  const NS = "http://www.w3.org/2000/svg";
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const inOut = (k) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k));
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  // ------------------------------------------------------------------------------------------- single-stroke fonts
  async function loadFont(url) {
    const doc = new DOMParser().parseFromString(await (await fetch(url)).text(), "image/svg+xml");
    const face = doc.querySelector("font-face"), font = doc.querySelector("font");
    const glyphs = {}, def = +font.getAttribute("horiz-adv-x") || 500;
    doc.querySelectorAll("glyph").forEach((g) => { const u = g.getAttribute("unicode"); if (u != null) glyphs[u] = { d: g.getAttribute("d") || "", adv: +(g.getAttribute("horiz-adv-x") || def) }; });
    return { upm: +face.getAttribute("units-per-em") || 1000, ascent: +face.getAttribute("ascent") || 800, cap: +face.getAttribute("cap-height") || 500, glyphs, def, url };
  }
  const advance = (font, ch) => (font.glyphs[ch] || font.glyphs["?"] || { adv: font.def }).adv;
  function wrap(font, text, scale, maxW) {
    const out = [];
    for (const para of text.split("\n")) {
      let line = "";
      for (const w of para.split(" ")) {
        const test = line ? line + " " + w : w;
        if (maxW && [...test].reduce((s, c) => s + advance(font, c) * scale, 0) > maxW && line) { out.push(line); line = w; } else line = test;
      }
      out.push(line);
    }
    return out;
  }

  function handwriting(svg, text, o) {
    const f = o.font, s = o.size / f.upm, lh = (o.lineHeight || 1.25) * o.size, speed = o.speed || 800, at = o.at || 0;
    const lift = { stroke: 0.035, letter: 0.07, word: 0.16, line: 0.32, ...(o.pauses || {}) };
    const g = el("g", { fill: "none", stroke: o.color || "#1b1b1b", "stroke-width": o.width || Math.max(2, o.size / 22), "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    const strokes = []; let t = 0;
    const lines = wrap(f, text, s, o.maxWidth);
    lines.forEach((line, li) => {
      let x = o.x || 0; const y = (o.y || 0) + li * lh;
      const lw = [...line].reduce((a, c) => a + advance(f, c) * s, 0);
      if (o.align === "center") x -= lw / 2; else if (o.align === "right") x -= lw;
      [...line].forEach((ch, ci) => {
        const gl = f.glyphs[ch];
        if (ch === " ") { t += lift.word; x += advance(f, ch) * s; return; }
        if (gl && gl.d) {
          const parts = gl.d.match(/M[^M]*/gi) || [];                         // each moveto = one pen stroke, in the font's own order
          parts.forEach((d) => {
            const p = el("path", { d, transform: `translate(${x} ${y}) scale(${s} ${-s})`, "vector-effect": "non-scaling-stroke" }, g);
            const L = p.getTotalLength(); if (L < 1e-3) { p.remove(); return; }
            const dur = (L * s) / speed;
            p.setAttribute("stroke-dasharray", `${L} ${L}`); p.style.strokeDashoffset = L; p.style.opacity = 0;
            strokes.push({ p, L, t0: t, dur }); t += dur + lift.stroke;
          });
        }
        t += lift.letter; x += advance(f, ch) * s;
      });
      t += lift.line;
    });
    let total = t;
    if (o.duration) { const k = o.duration / total; strokes.forEach((x) => { x.t0 *= k; x.dur *= k; }); total = o.duration; }   // fit to a set time, same rhythm
    const render = (time) => {
      const u = time - at;
      for (const k of strokes) {
        const q = clamp((u - k.t0) / k.dur);
        k.p.style.opacity = q > 0 ? 1 : 0; k.p.style.strokeDashoffset = k.L * (1 - inOut(q));
      }
    };
    const penAt = (time) => {
      const u = time - at; let cur = null;
      for (const k of strokes) if (u >= k.t0) cur = k;
      if (!cur) return null;
      const q = inOut(clamp((u - cur.t0) / cur.dur)), pt = cur.p.getPointAtLength(cur.L * q);
      const m = svg.getCTM().inverse().multiply(cur.p.getCTM());               // path's local units -> the container's own coordinates
      const r = new DOMPoint(pt.x, pt.y).matrixTransform(m);                   // works for an <svg> or any <g> container
      return { x: r.x, y: r.y, writing: u < cur.t0 + cur.dur };
    };
    render(0);
    return { group: g, render, penAt, duration: total, end: at + total, lines };
  }

  // ------------------------------------------------------------------------------------------- draw-on
  const GEOM = "path,line,polyline,polygon,circle,ellipse,rect";
  function prepare(group) {
    const items = [];
    group.querySelectorAll(GEOM).forEach((e) => {
      let L = 0; try { L = e.getTotalLength(); } catch (_) {}
      if (L > 0.5) { e.setAttribute("stroke-dasharray", `${L} ${L}`); items.push({ e, L, fill: e.getAttribute("fill") }); }
    });
    const sum = items.reduce((a, b) => a + b.L, 0); let acc = 0;
    for (const it of items) { it.a = acc / sum; acc += it.L; it.b = acc / sum; }
    return items;
  }
  // draw strokes on in document order at constant "pen" speed across dur seconds
  function drawOn(group, opts = {}) {
    const items = prepare(group), fillsIn = opts.fills !== false;
    const render = (t, start, dur) => {
      const k = clamp((t - start) / dur);
      for (const it of items) {
        const q = clamp((k - it.a) / Math.max(it.b - it.a, 1e-6));
        it.e.style.strokeDashoffset = it.L * (1 - q); it.e.style.opacity = q > 0 ? 1 : 0;
        if (fillsIn && it.fill && it.fill !== "none") it.e.style.fillOpacity = clamp((k - 0.85) / 0.15);
      }
    };
    return { render, items };
  }

  // ------------------------------------------------------------------------------------------- sketch any SVG
  async function loadSVG(src) {
    if (src instanceof SVGElement) return src.cloneNode(true);
    const txt = src.trim().startsWith("<") ? src : await (await fetch(src)).text();
    return new DOMParser().parseFromString(txt, "image/svg+xml").documentElement;
  }
  async function sketch(svg, src, o = {}) {
    const S = root.svg2roughjs; if (!S) throw new Error("doodle-kit: load svg2roughjs first (libs.py use <project> doodle-kit)");
    const srcSvg = await loadSVG(src);
    if (o.color) srcSvg.querySelectorAll("*").forEach((n) => { if (n.getAttribute("stroke") === "currentColor") n.setAttribute("stroke", o.color); if (n.getAttribute("fill") === "currentColor") n.setAttribute("fill", o.color); });
    if (o.color && srcSvg.getAttribute("stroke") === "currentColor") srcSvg.setAttribute("stroke", o.color);
    const vb = (srcSvg.getAttribute("viewBox") || "0 0 24 24").split(/[ ,]+/).map(Number);
    const scale = (o.size || 200) / Math.max(vb[2], vb[3]), lw = (o.lineWidth ?? 6) / scale;   // line width in real pixels after scaling
    srcSvg.setAttribute("stroke-width", lw); srcSvg.querySelectorAll("[stroke-width]").forEach((n) => n.setAttribute("stroke-width", lw));
    const holder = document.createElement("div"); holder.style.cssText = "position:absolute;left:-99999px;top:0"; document.body.appendChild(holder);
    srcSvg.setAttribute("width", vb[2]); srcSvg.setAttribute("height", vb[3]); holder.appendChild(srcSvg);
    const n = Math.max(1, o.boil || 1), layers = [];
    const outer = el("g", { transform: `translate(${o.x || 0} ${o.y || 0}) scale(${scale})` }, svg);
    for (let i = 0; i < n; i++) {
      const tgt = document.createElementNS(NS, "svg"); holder.appendChild(tgt);
      const conv = new S.Svg2Roughjs(tgt, S.OutputType.SVG, { roughness: o.roughness ?? 1.2, bowing: o.bowing ?? 1, strokeWidth: o.strokeWidth, fillStyle: o.fillStyle || "hachure", hachureGap: o.hachureGap });
      conv.seed = (o.seed || 1) + i * 101; conv.randomize = false; conv.svg = srcSvg; conv.backgroundColor = null; conv.pencilFilter = !!o.pencil;
      const out = await conv.sketch();
      const g = el("g", { opacity: i ? 0 : 1 }, outer);
      [...out.childNodes].forEach((c) => g.appendChild(c));
      layers.push({ g, draw: drawOn(g) });
    }
    holder.remove();
    const fps = o.boilFps || 12;
    const render = (t, start = 0, dur = 0) => {
      const idx = n > 1 ? Math.floor(t * fps) % n : 0;                       // line boil: a different seed 12x per second
      layers.forEach((L, i) => { L.g.setAttribute("opacity", i === idx ? 1 : 0); if (dur > 0) L.draw.render(t, start, dur); });
    };
    render(0, 0, 1e-6);
    return { group: outer, render };
  }

  // ------------------------------------------------------------------------------------------- annotations (rough-notation, seek-safe)
  function annotate(svg, r, type, o = {}) {
    const rc = root.rough && root.rough.svg(svg); if (!rc) throw new Error("doodle-kit: load rough.js for annotate()");
    const c = o.color || "#E8590C", sw = o.width || 4, pad = o.padding ?? 8, seed = o.seed || 1;
    const opts = { stroke: c, strokeWidth: sw, roughness: o.roughness ?? 1.4, bowing: 1.2, seed };
    const { x, y, w, h } = r, g = el("g", {}, svg); let shapes = [];
    const L = (x1, y1, x2, y2, extra = {}) => rc.line(x1, y1, x2, y2, { ...opts, ...extra });
    if (type === "underline") shapes = [L(x - 4, y + h + pad * 0.6, x + w + 4, y + h + pad * 0.4)];
    else if (type === "double-underline") shapes = [L(x, y + h + pad * 0.4, x + w, y + h + pad * 0.3), L(x + 6, y + h + pad * 1.4, x + w - 4, y + h + pad * 1.3, { seed: seed + 1 })];
    else if (type === "strike") shapes = [L(x - 4, y + h / 2, x + w + 4, y + h / 2 + 2)];
    else if (type === "cross") shapes = [L(x, y, x + w, y + h), L(x + w, y, x, y + h, { seed: seed + 1 })];
    else if (type === "box") shapes = [rc.rectangle(x - pad, y - pad, w + 2 * pad, h + 2 * pad, opts)];
    else if (type === "circle") shapes = [rc.ellipse(x + w / 2, y + h / 2, w + 2.4 * pad + 24, h + 2.4 * pad + 18, { ...opts, curveStepCount: 14 })];
    else if (type === "highlight") shapes = [L(x - 6, y + h * 0.55, x + w + 6, y + h * 0.5, { stroke: o.color || "rgba(255,212,59,.55)", strokeWidth: h * 0.85, roughness: 0.6 })];
    else if (type === "bracket") shapes = [rc.linearPath([[x - pad, y - pad], [x - pad - 12, y - pad], [x - pad - 12, y + h + pad], [x - pad, y + h + pad]], opts)];
    else if (type === "arrow") { const ex = o.toX ?? x + w, ey = o.toY ?? y + h; const a = Math.atan2(ey - y, ex - x), k = o.head || 26;
      shapes = [rc.curve([[x, y], [(x + ex) / 2 + (o.bend || 0), (y + ey) / 2 - (o.bend || 40)], [ex, ey]], opts),
                L(ex, ey, ex - k * Math.cos(a - 0.45), ey - k * Math.sin(a - 0.45), { seed: seed + 2 }), L(ex, ey, ex - k * Math.cos(a + 0.45), ey - k * Math.sin(a + 0.45), { seed: seed + 3 })]; }
    else throw new Error("annotate: unknown type " + type);
    shapes.forEach((s) => g.appendChild(s));
    const d = drawOn(g, { fills: false }); d.render(0, 0, 1e-6);
    return { group: g, render: (t, start, dur) => d.render(t, start, dur) };
  }

  root.Doodle = { loadFont, handwriting, drawOn, sketch, annotate, loadSVG };
})(typeof window !== "undefined" ? window : globalThis);
