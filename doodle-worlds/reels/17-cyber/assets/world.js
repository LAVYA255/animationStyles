/* world.js — Cyberpunk city ("Grandma got a call from her grandson. It wasn't him."). Cast (original): Nani (grey bun,
   neon AR glasses, purple saree-style robe, bindi), Arjun (grandson: black hair, cyan hoodie), the scammer AI (a holo
   avatar that glitches into a toaster robot). Set: night apartment, big window on a neon city (towers, signs, flying
   hover-cars, rain), a kitchen counter (foreground) with chai + holo projector. Props: holo call panel (arjun / glitch /
   toaster / ended), crashed hover-car holo, SEND credits panel, voice-clone card, safe-word card. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const W = {}, CY = "#3FE0F0", PK = "#FF3FA4", PU = "#8A5CFF", DK = "#141226";
  W.NANI = { hairStyle: "bob", topBun: 1, hair: "#D9D9DE", skin: "#C98E62", outfit: "robe", cloth: "#7A2E8A", cloth2: "#F2C14E", glasses: 1, earring: 1, blush: 0.4 };
  W.ARJUN = { hairStyle: "short", hair: "#1E1A1A", skin: "#B97A4E", outfit: "hoodie", cloth: "#2FB5C9", cloth2: "#1F8A9A", blush: 0.3 };
  W.room = (p, { t = 0, alarm = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#221C3A", "#3A1426", alarm) }, g);
    // window on the city
    const wx = -60, wy = 140, ww = 1200, wh = 900, cp = el("clipPath", { id: "cyw" }, g); el("rect", { x: wx, y: wy, width: ww, height: wh }, cp);
    const c = el("g", { "clip-path": "url(#cyw)" }, g); el("rect", { x: wx, y: wy, width: ww, height: wh, fill: DK }, c);
    for (let i = 0; i < 9; i++) { const r = MK.rng(i + 3), bx = wx + i * 140 - 20, bh = 360 + r() * 420; el("rect", { x: bx, y: wy + wh - bh, width: 120, height: bh, fill: ["#2A2450", "#1F1B3A", "#33295E"][i % 3], stroke: "#0A0816", "stroke-width": 4 }, c);
      for (let j = 0; j < 10; j++) { const rr = MK.rng(i * 20 + j); if (rr() > 0.45) el("rect", { x: bx + 14 + (j % 3) * 34, y: wy + wh - bh + 30 + Math.floor(j / 3) * 60, width: 20, height: 26, fill: rr() > 0.5 ? CY : "#FFE27A", opacity: 0.5 + 0.4 * Math.sin(t * 2 + i + j) }, c); } }
    [["NOODLE", 160, 930, PK], ["24H", 700, 900, CY], ["BAR", 1020, 940, "#FFE27A"]].forEach(([s, x, y, col], i) => { const ng = el("g", { transform: `translate(${x} ${y}) scale(0.75)` }, c);
      el("rect", { x: -80, y: -40, width: 160, height: 80, rx: 10, fill: "#0A0816", stroke: col, "stroke-width": 5, opacity: 0.9 }, ng); K.txt(ng, 0, 16, s, 40, col); });
    for (let i = 0; i < 3; i++) { const ph = (t * (0.12 + i * 0.05) + i * 0.33) % 1, hx = lerp(wx - 200, wx + ww + 200, i % 2 ? 1 - ph : ph), hy = wy + 520 + i * 110;
      const hc = el("g", { transform: `translate(${hx} ${hy}) scale(${i % 2 ? -0.8 : 0.8} 0.8)` }, c); el("path", { d: "M-70,0 Q-60,-34 0,-36 Q60,-34 74,0 Q0,16 -70,0 Z", fill: "#5A6378", stroke: "#0A0816", "stroke-width": 4 }, hc);
      el("ellipse", { cx: 10, cy: -20, rx: 30, ry: 12, fill: CY, opacity: 0.8 }, hc); el("ellipse", { cx: -60, cy: 6, rx: 20, ry: 6, fill: PK, opacity: 0.8 }, hc); }
    for (let i = 0; i < 50; i++) { const r = MK.rng(i + 9), x = wx + r() * ww, y = wy + ((r() * wh + t * (600 + r() * 300)) % wh); el("line", { x1: x, y1: y, x2: x - 8, y2: y + 34, stroke: "#9FB8FF", "stroke-width": 2.5, opacity: 0.4 }, c); }
    el("rect", { x: wx, y: wy, width: ww, height: wh, fill: "none", stroke: "#0A0816", "stroke-width": 14 }, g);
    el("line", { x1: wx + ww / 2, y1: wy, x2: wx + ww / 2, y2: wy + wh, stroke: "#0A0816", "stroke-width": 10 }, g);
    el("rect", { x: -700, y: wy + wh, width: 2600, height: 60, fill: PU, opacity: 0.25 }, g); // neon strip
    return g; };
  W.counter = (p, { y = 1405, t = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: "#2A2440", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: -400, y: y + 60, width: 1880, height: 10, fill: PK, opacity: 0.8 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 8, fill: "#3A3458", stroke: INK, "stroke-width": 8 }, g);
    // holo projector puck
    el("ellipse", { cx: 640, cy: y + 4, rx: 70, ry: 16, fill: "#5A6378", stroke: INK, "stroke-width": 5 }, g); el("ellipse", { cx: 640, cy: y, rx: 40, ry: 8, fill: CY, opacity: 0.8 + 0.2 * Math.sin(t * 6) }, g);
    return g; };
  W.chai = (p, { x, y, s = 1, t = 0, lift = 0 }) => { const g = el("g", { transform: `translate(${x} ${y - lift * 80}) scale(${s})` }, p);
    el("path", { d: "M-40,-80 L40,-80 L32,0 L-32,0 Z", fill: "#D9C6A8", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M40,-62 q30,4 22,30 q-6,10 -26,6", fill: "none", stroke: INK, "stroke-width": 6 }, g);
    el("rect", { x: -36, y: -78, width: 72, height: 14, fill: "#B07A4A" }, g);
    for (let i = 0; i < 2; i++) { const ph = (t * 0.6 + i / 2) % 1; el("path", { d: `M${-12 + i * 24},${-90 - ph * 70} q12,-14 0,-28 q-12,-14 0,-28`, fill: "none", stroke: "#C9C9D6", "stroke-width": 5, "stroke-linecap": "round", opacity: Math.sin(ph * Math.PI) }, g); }
    return g; };
  // the holo call. mode: ring | arjun | glitch | toaster | ended
  W.holo = (p, { x, y, s = 1, k = 1, mode = "arjun", t = 0, talk = 0, panic = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("path", { d: "M-60,300 L-240,-20 L240,-20 L60,300 Z", fill: CY, opacity: 0.12 }, g);
    const gx = mode === "glitch" ? Math.sin(t * 90) * 10 : 0, pan = el("g", { transform: `translate(${gx} 0)` }, g);
    const col = mode === "toaster" || mode === "glitch" ? PK : CY;
    el("rect", { x: -230, y: -330, width: 460, height: 310, rx: 24, fill: "#0E2A3A", stroke: col, "stroke-width": 6, opacity: 0.88 }, pan);
    for (let i = 0; i < 8; i++) el("line", { x1: -220, y1: -310 + i * 38, x2: 220, y2: -310 + i * 38, stroke: col, "stroke-width": 2, opacity: 0.18 }, pan);
    const top = mode === "ring" ? "INCOMING: ARJUN ♥" : mode === "toaster" ? "SCAM BOT DETECTED" : mode === "ended" ? "CALL ENDED" : "ARJUN ♥";
    K.txt(pan, 0, -286, top, 30, col);
    const face = el("g", { transform: "translate(0 -170)" }, pan);
    if (mode === "toaster") { el("rect", { x: -90, y: -70, width: 180, height: 130, rx: 30, fill: "#9AA0A6", stroke: PK, "stroke-width": 5 }, face); el("rect", { x: -60, y: -90, width: 30, height: 30, rx: 6, fill: "#3A3F45" }, face); el("rect", { x: 30, y: -90, width: 30, height: 30, rx: 6, fill: "#3A3F45" }, face);
      for (const sx of [-36, 36]) el("circle", { cx: sx, cy: -10, r: 16, fill: PK, opacity: 0.6 + 0.4 * Math.sin(t * 10) }, face); el("path", { d: "M-40,30 h80", stroke: PK, "stroke-width": 7 }, face); }
    else if (mode !== "ended") { const c2 = mode === "glitch" ? PK : CY; el("circle", { cx: 0, cy: 0, r: 70, fill: "none", stroke: c2, "stroke-width": 6 }, face);
      el("path", { d: "M-60,-20 Q-50,-80 0,-80 Q50,-80 60,-20 Q30,-50 -60,-20 Z", fill: c2, opacity: 0.6 }, face);
      for (const sx of [-24, 24]) el("circle", { cx: sx, cy: 0, r: panic ? 9 : 6, fill: c2 }, face); el("ellipse", { cx: 0, cy: 34, rx: 16, ry: 4 + talk * 12, fill: c2 }, face);
      if (mode === "glitch") { el("rect", { x: -80, y: -20 + Math.sin(t * 40) * 30, width: 160, height: 14, fill: CY, opacity: 0.7 }, face); K.txt(face, 0, 110, "?? ? ?", 34, PK); } }
    // waveform
    for (let i = 0; i < 24; i++) { const h = 6 + Math.abs(Math.sin(t * 9 + i * 0.7)) * 40 * (mode === "ended" ? 0 : Math.max(0.2, talk)); el("rect", { x: -190 + i * 16, y: -70 - h / 2, width: 8, height: h, rx: 4, fill: col, opacity: 0.9 }, pan); }
    if (mode === "glitch") for (let i = 0; i < 3; i++) el("rect", { x: -230 + ((t * 700 + i * 160) % 460), y: -330 + i * 100, width: 80, height: 18, fill: i % 2 ? CY : PK, opacity: 0.6 }, pan);
    return g; };
  W.crash = (p, { x, y, s = 1, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) rotate(-12) scale(${s * k})` }, p);
    el("path", { d: "M-80,0 Q-70,-40 0,-44 Q70,-40 86,0 Q0,18 -80,0 Z", fill: "none", stroke: CY, "stroke-width": 6 }, g);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; el("circle", { cx: -20 + i * 20, cy: -50 - ph * 60, r: 10 + ph * 16, fill: "none", stroke: CY, "stroke-width": 4, opacity: 1 - ph }, g); }
    K.txt(g, 0, 50, "CRASH?", 30, CY); return g; };
  W.send = (p, { x, y, s = 1, k = 1, glow = 0, t = 0, cancel = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -200, y: -110, width: 400, height: 220, rx: 22, fill: "#0E2A3A", stroke: CY, "stroke-width": 5, opacity: 0.92 }, g);
    K.txt(g, 0, -50, "SEND 5,000 CR", 40, CY);
    el("rect", { x: -150, y: 0, width: 300, height: 80, rx: 40, fill: cancel ? "#5A6378" : PK, stroke: WH, "stroke-width": 4, opacity: 0.8 + 0.2 * Math.sin(t * 10) * glow }, g);
    K.txt(g, 0, 54, cancel ? "CANCELLED" : "SEND", 40, WH); return g; };
  W.cloneCard = (p, { x, y, s = 1, k = 1, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -430, y: -280, width: 860, height: 560, rx: 36, fill: "#0E2A3A", stroke: CY, "stroke-width": 8 }, g);
    K.txt(g, 0, -200, "VOICE CLONING", 54, CY);
    for (let i = 0; i < 14; i++) { const h = 10 + Math.abs(Math.sin(i * 1.3 + t * 6)) * 90; el("rect", { x: -380 + i * 22, y: -40 - h / 2, width: 12, height: h, rx: 6, fill: CY }, g); }
    K.txt(g, -230, 90, "3 SECONDS", 40, WH); K.arrow(g, { x1: -40, y1: -40, x2: 90, y2: -40, k: 1, color: PK });
    for (let i = 0; i < 14; i++) { const h = 10 + Math.abs(Math.sin(i * 1.3 + t * 6)) * 90; el("rect", { x: 120 + i * 22, y: -40 - h / 2, width: 12, height: h, rx: 6, fill: PK }, g); }
    K.txt(g, 270, 90, "FAKE YOU", 40, PK); K.txt(g, 0, 210, "a few seconds of audio is enough", 30, "#9FB8FF"); return g; };
  W.safeCard = (p, { x, y, s = 1, k = 1, line2 = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -430, y: -280, width: 860, height: 560, rx: 36, fill: "#0E2A3A", stroke: "#5FE3B0", "stroke-width": 8 }, g);
    const lg = el("g", { transform: "translate(0 -110)" }, g); el("path", { d: "M-50,-10 L-50,-60 Q-50,-110 0,-110 Q50,-110 50,-60 L50,-10", fill: "none", stroke: "#5FE3B0", "stroke-width": 14 }, lg);
    el("rect", { x: -80, y: -14, width: 160, height: 120, rx: 18, fill: "#5FE3B0", stroke: INK, "stroke-width": 5 }, lg); el("circle", { cx: 0, cy: 40, r: 14, fill: INK }, lg);
    K.txt(g, 0, 90, "FAMILY SAFE WORD", 56, "#5FE3B0");
    if (line2 > 0) { const l = el("g", { opacity: line2 }, g); K.txt(l, 0, 170, "AI copies voices.", 40, WH); K.txt(l, 0, 222, "Not secrets.", 40, PK); }
    return g; };

  W.sheet = (s) => {
    window.FONT = "Audiowide"; const lab = (x, y, t, z = 28) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 17 · CYBERPUNK · \"Grandma got a call... It wasn't him.\" — cast & props", 40);
    [["Nani", W.NANI, F.calm], ["Nani: oh beta", W.NANI, F.worried], ["Nani: nice try", W.NANI, F.smug], ["Arjun (real)", W.ARJUN, F.happy], ["Arjun: behind you", W.ARJUN, F.deadpan]].forEach(([n, look, face], i) => {
      const x = 220 + i * 400, y = 640, c = Object.assign({ x, y, s: 0.66 }, look, face); Person.draw(s, c); if (i < 3) { const h = Person.head(c); el("circle", { cx: h[0], cy: h[1] - 40, r: 5, fill: "#C0392B" }, s); } lab(x, y + 50, n); });
    const cp = el("clipPath", { id: "cy" }, s); el("rect", { x: 60, y: 760, width: 1100, height: 900, rx: 16 }, cp);
    const dg = el("g", { "clip-path": "url(#cy)" }, s), sg = el("g", { transform: "translate(60 760) scale(0.62) translate(0 -150)" }, dg);
    W.room(sg, { t: 0.4 }); Person.draw(sg, Object.assign({ x: 330, y: 1420, s: 1 }, W.NANI, F.calm)); W.counter(sg, { t: 0.4 }); W.chai(sg, { x: 180, y: 1405, t: 0.4 }); W.holo(sg, { x: 640, y: 1370, s: 1, mode: "arjun", t: 0.4, talk: 0.6 }); lab(610, 1700, "apartment + holo call");
    ["ring", "glitch", "toaster", "ended"].forEach((m, i) => { W.holo(s, { x: 1400 + (i % 2) * 520, y: 1150 + Math.floor(i / 2) * 420, s: 0.75, mode: m, t: 0.4, talk: 0.6 }); lab(1400 + (i % 2) * 520, 1180 + Math.floor(i / 2) * 420, m); });
    W.send(s, { x: 1400, y: 2050, s: 0.8, t: 0.4 }); W.crash(s, { x: 1900, y: 2050, t: 0.4 });
    W.cloneCard(s, { x: 500, y: 2050, s: 0.5, t: 0.4 }); W.safeCard(s, { x: 1000, y: 2050, s: 0.5, line2: 1 }); lab(750, 2230, "voice-clone card / safe-word card");
  };
  root.World = W;
})(window);
