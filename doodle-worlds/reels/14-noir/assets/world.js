/* world.js — Noir city ("Customers were vanishing from this shop"). Monochrome greys + one accent red.
   Cast (original): Detective Vera (trench coat, fedora, black bob, magnifier), Benny (shop owner: glasses, moustache, grey
   shop coat), a shopper (long brown hair, grey hoodie), grey silhouette passers-by. Sets: rainy street with BENNY'S neon,
   the shop inside (shelves, rainy window, counter + register), the checkout corridor (5 stations: SHOP, CART, CREATE
   ACCOUNT, CONFIRM EMAIL, CONFIRM PASSWORD). Props: magnifier, cart, poof, suspect lineup, 1-in-5 card, leak card, phone. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a", WH = "#ffffff", lerpC = Person.lerpC;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, k) => a + (b - a) * k;
  const RED = "#E5484D", G1 = "#2A2D33", G2 = "#3D424B", G3 = "#5A606B", G4 = "#8A909A", G5 = "#C4C8CE";
  const W = { RED };
  W.VERA = { hairStyle: "bob", hair: "#1E1A1A", skin: "#EBD3C0", outfit: "coat", cloth: "#B9A889", cloth2: "#8A7A5E", hat: "fedora", hatC: "#34363C", earring: 1, blush: 0.25 };
  W.BENNY = { hairStyle: "short", hair: "#4A4A4A", mustache: 1, glasses: 1, skin: "#E6CDB8", outfit: "scrubs", cloth: "#D6D9DE", cloth2: "#9AA0A8", blush: 0.3 };
  W.SHOPPER = { hairStyle: "long", hair: "#7A5A3A", skin: "#E2C2A8", outfit: "hoodie", cloth: "#A9AEB6", cloth2: "#7F858F", earring: 1, blush: 0.4 };
  W.GHOST = { hairStyle: "short", hair: G1, skin: G3, outfit: "coat", cloth: G2, cloth2: G1, hat: "fedora", hatC: G1, blush: 0 };
  const rain = (g, t, x0, x1, k = 1) => { for (let i = 0; i < 70; i++) { const r = MK.rng(i + 5), x = x0 + r() * (x1 - x0), sp = 1400 + r() * 500, y = ((r() * 2600 + t * sp) % 2600) - 500;
      el("line", { x1: x, y1: y, x2: x - 14, y2: y + 60, stroke: "#B9C3D0", "stroke-width": 3, opacity: 0.45 * k }, g); } };
  W.neon = (p, { x, y, s = 1, text = "BENNY'S", on = 1, t = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), fl = on * (Math.sin(t * 37) > -0.92 ? 1 : 0.3);
    el("rect", { x: -230, y: -70, width: 460, height: 140, rx: 20, fill: G1, stroke: INK, "stroke-width": 6 }, g);
    el("text", { x: 0, y: 28, "text-anchor": "middle", "font-family": "Permanent Marker", "font-size": 84, fill: "none", stroke: RED, "stroke-width": 14, opacity: 0.35 * fl }, g).textContent = text;
    el("text", { x: 0, y: 28, "text-anchor": "middle", "font-family": "Permanent Marker", "font-size": 84, fill: lerpC("#6A2A2C", "#FF8A8C", fl) }, g).textContent = text; return g; };
  W.street = (p, { t = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: G1 }, g);
    for (let i = 0; i < 5; i++) el("rect", { x: -400 + i * 420, y: 80 - (i % 2) * 120, width: 380, height: 1300, fill: i % 2 ? G2 : "#33373F", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 18; i++) { const r = MK.rng(i + 3); el("rect", { x: -360 + Math.floor(r() * 5) * 420 + Math.floor(r() * 3) * 110, y: 160 + Math.floor(r() * 6) * 140, width: 70, height: 90, fill: r() > 0.6 ? "#E9D9A0" : G1, opacity: 0.8 }, g); }
    // the shop front
    el("rect", { x: 300, y: 600, width: 700, height: 860, fill: "#4A4F59", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: 340, y: 860, width: 340, height: 420, fill: "#E9D9A0", stroke: INK, "stroke-width": 7, opacity: 0.85 }, g);
    for (let i = 0; i < 4; i++) el("rect", { x: 380 + i * 70, y: 1080 - (i % 2) * 40, width: 50, height: 120 + (i % 2) * 40, fill: G4, stroke: INK, "stroke-width": 4 }, g);
    el("rect", { x: 730, y: 900, width: 220, height: 560, fill: "#1A1C20", stroke: INK, "stroke-width": 7 }, g);
    W.neon(g, { x: 650, y: 740, s: 0.9, t });
    el("rect", { x: -700, y: 1440, width: 2600, height: 1300, fill: "#25282E", stroke: INK, "stroke-width": 6 }, g);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: 100 + i * 330, cy: 1560 + (i % 2) * 90, rx: 120, ry: 22, fill: RED, opacity: 0.12 + 0.05 * Math.sin(t * 3 + i) }, g);
    // street lamp
    el("rect", { x: 120, y: 420, width: 22, height: 1040, fill: G1, stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M131,420 Q131,370 200,370 L230,370", fill: "none", stroke: INK, "stroke-width": 12 }, g);
    el("path", { d: "M200,380 L260,380 L290,440 L170,440 Z", fill: "#E9D9A0", stroke: INK, "stroke-width": 5 }, g); el("path", { d: "M170,440 L80,1440 L380,1440 L290,440 Z", fill: "#E9D9A0", opacity: 0.08 }, g);
    rain(g, t, -300, 1400); return g; };
  W.shop = (p, { t = 0, bright = 0, rainK = 1 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 2600, height: 3400, fill: lerpC("#4A4F59", "#6A707B", bright) }, g);
    // rainy window with the neon backwards
    el("rect", { x: 560, y: 260, width: 520, height: 520, fill: "#1E2128", stroke: INK, "stroke-width": 8 }, g);
    const wg = el("g", {}, g), cp = el("clipPath", { id: "wcp" }, g); el("rect", { x: 560, y: 260, width: 520, height: 520 }, cp); wg.setAttribute("clip-path", "url(#wcp)");
    rain(wg, t, 560, 1080, rainK); el("rect", { x: 640, y: 320, width: 360, height: 110, rx: 20, fill: RED, opacity: 0.25 + 0.1 * Math.sin(t * 6) }, wg); // neon glow outside, no backwards text
    el("line", { x1: 820, y1: 260, x2: 820, y2: 780, stroke: INK, "stroke-width": 8 }, g);
    // shelves
    for (let r = 0; r < 3; r++) { el("rect", { x: -300, y: 420 + r * 260, width: 800, height: 20, fill: G2, stroke: INK, "stroke-width": 4 }, g);
      for (let i = 0; i < 6; i++) { const r2 = MK.rng(r * 7 + i); el("rect", { x: -270 + i * 130, y: 300 + r * 260, width: 90, height: 120, rx: 8, fill: lerpC(G4, "#D9DCE0", r2()), stroke: INK, "stroke-width": 4 }, g); } }
    // blinds shadow
    for (let i = 0; i < 7; i++) el("rect", { x: -700, y: 120 + i * 120, width: 2600, height: 40, fill: "#000", opacity: 0.08 }, g);
    return g; };
  W.counter = (p, { y = 1405, t = 0, ching = 0, regX = 900 }) => { const g = el("g", {}, p);
    el("rect", { x: -400, y: y + 20, width: 1880, height: 900, fill: G2, stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: -420, y, width: 1920, height: 34, rx: 8, fill: G3, stroke: INK, "stroke-width": 8 }, g);
    const rg = el("g", { transform: `translate(${regX} ${y})` }, g);
    el("path", { d: "M-110,0 L-90,-120 L90,-120 L110,0 Z", fill: G3, stroke: INK, "stroke-width": 6 }, rg); el("rect", { x: -70, y: -200, width: 140, height: 80, rx: 8, fill: G1, stroke: INK, "stroke-width": 6 }, rg);
    el("text", { x: 0, y: -146, "text-anchor": "middle", "font-family": "Permanent Marker", "font-size": 40, fill: ching > 0 ? "#7FE0A0" : RED }, rg).textContent = ching > 0 ? "$$$" : "$0";
    if (ching > 0 && ching < 1) el("rect", { x: -80, y: -30 + ching * 40, width: 160, height: 40, fill: G4, stroke: INK, "stroke-width": 5 }, rg);
    return g; };
  // checkout corridor: stations at x = 540 + i*700
  W.STATIONS = ["SHOP", "CART", "CREATE ACCOUNT", "CONFIRM EMAIL", "CONFIRM PASSWORD"];
  W.corridor = (p, { t = 0, lit = -1, killer = 0, dim = 0 }) => { const g = el("g", {}, p);
    el("rect", { x: -700, y: -700, width: 5600, height: 3400, fill: lerpC("#3A3F48", "#202328", dim) }, g);
    for (let i = 0; i < 9; i++) el("rect", { x: -700, y: 160 + i * 130, width: 5600, height: 44, fill: "#000", opacity: 0.07 }, g);
    W.STATIONS.forEach((nm, i) => { const x = 540 + i * 700, on = i === lit, bad = i >= 2, kk = i === 4 ? killer : 0;
      const sg = el("g", { transform: `translate(${x} 0)` }, g);
      if (on || kk > 0) el("path", { d: "M-120,-200 L120,-200 L420,1400 L-420,1400 Z", fill: "#F3E9C8", opacity: 0.16 + 0.1 * kk }, sg);
      if (kk > 0) for (let h = 0; h < 7; h++) { el("line", { x1: -330, y1: 560 + h * 110, x2: 330, y2: 560 + h * 110, stroke: G5, "stroke-width": 4, opacity: kk }, sg); K.txt(sg, -300, 552 + h * 110, String(7 - h) + "ft", 26, G5); }
      el("rect", { x: -250, y: 620, width: 500, height: 640, rx: 22, fill: i === 4 ? lerpC("#F2F2F2", "#FFE3E3", kk) : "#F2F2F2", stroke: kk > 0 ? RED : INK, "stroke-width": 9 }, sg);
      K.txt(sg, 0, 596, nm, nm.length > 12 ? 34 : 50, bad ? (i === 4 ? "#FF7A7D" : "#F2A6A8") : "#E6E9ED");
      const body = el("g", { transform: "translate(0 940)" }, sg);
      if (i === 0) { for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) el("rect", { x: -170 + c * 120, y: -200 + r * 170, width: 100, height: 130, rx: 10, fill: G5, stroke: INK, "stroke-width": 5 }, body); }
      if (i === 1) W.cart(body, { x: 0, y: 120, s: 1.1, items: 3 });
      if (i >= 2) { const fields = i === 2 ? ["NAME", "EMAIL", "PASSWORD", "PHONE"] : i === 3 ? ["CHECK YOUR INBOX...", "CODE: _ _ _ _ _ _"] : ["PASSWORD  ••••••", "CONFIRM  ••••••"];
        fields.forEach((f, j) => { el("rect", { x: -200, y: -230 + j * 110, width: 400, height: 80, rx: 12, fill: WH, stroke: i === 4 ? RED : G3, "stroke-width": 5 }, body); K.txt(body, -180, -178 + j * 110, f, 32, G3, "start"); });
        if (i === 3) { el("path", { d: "M-90,40 L90,40 L90,160 L-90,160 Z M-90,40 L0,110 L90,40", fill: WH, stroke: INK, "stroke-width": 6 }, body); }
        if (i === 4 && kk > 0) { const eg = el("g", { transform: `translate(0 120) scale(${kk})` }, body);
          for (const sx of [-60, 60]) { el("circle", { cx: sx, cy: 0, r: 30, fill: WH, stroke: INK, "stroke-width": 5 }, eg); el("circle", { cx: sx + 6, cy: 6, r: 12, fill: INK }, eg); el("line", { x1: sx - 34, y1: sx < 0 ? -50 : -30, x2: sx + 34, y2: sx < 0 ? -30 : -50, stroke: INK, "stroke-width": 9, "stroke-linecap": "round" }, eg); }
          el("path", { d: "M-50,70 Q0,40 50,70", fill: "none", stroke: INK, "stroke-width": 7, "stroke-linecap": "round" }, eg); }
        el("rect", { x: -120, y: 220, width: 240, height: 70, rx: 35, fill: i === 4 ? RED : G3, stroke: INK, "stroke-width": 5 }, body); K.txt(body, 0, 268, "NEXT", 36, WH); }
      if (i < 4) K.arrow(g, { x1: x + 270, y1: 960, x2: x + 420, y2: 960, k: 1, color: G5 }); });
    el("rect", { x: -700, y: 1405, width: 5600, height: 1300, fill: "#2A2D33", stroke: INK, "stroke-width": 8 }, g);
    el("rect", { x: -720, y: 1405, width: 5640, height: 30, fill: G3, stroke: INK, "stroke-width": 7 }, g);
    return g; };
  W.cart = (p, { x, y, s = 1, items = 0, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    for (let i = 0; i < items; i++) el("rect", { x: -100 + i * 60, y: -150 - (i % 2) * 20, width: 54, height: 80, rx: 8, fill: [RED, G5, "#E9D9A0"][i % 3], stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-150,-150 L-120,-150 L-100,-80 L130,-80 L110,-10 L-80,-10 Z", fill: "none", stroke: INK, "stroke-width": 10, "stroke-linejoin": "round" }, g);
    for (let i = 0; i < 4; i++) el("line", { x1: -60 + i * 50, y1: -80, x2: -55 + i * 45, y2: -10, stroke: INK, "stroke-width": 5 }, g);
    for (const cx of [-60, 80]) el("circle", { cx, cy: 20, r: 18, fill: G2, stroke: INK, "stroke-width": 5 }, g); return g; };
  W.magnifier = (p, { x, y, s = 1, rot = -30 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -12, y: 40, width: 24, height: 120, rx: 10, fill: "#6B4428", stroke: INK, "stroke-width": 5 }, g);
    el("circle", { cx: 0, cy: 0, r: 52, fill: "#CFEFF5", stroke: INK, "stroke-width": 10, opacity: 0.9 }, g); el("path", { d: "M-24,-20 q12,-16 30,-14", fill: "none", stroke: WH, "stroke-width": 7, "stroke-linecap": "round" }, g); return g; };
  W.poof = (p, { x, y, k = 0, s = 1 }) => { if (k <= 0 || k >= 1) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, r = 40 + k * 140; el("circle", { cx: Math.cos(a) * r, cy: Math.sin(a) * r * 0.8, r: 70 * (1 - k) + 20, fill: G5, stroke: INK, "stroke-width": 5, opacity: 1 - k }, g); }
    el("circle", { cx: 0, cy: 0, r: 90 * (1 - k), fill: WH, opacity: 1 - k }, g); return g; };
  W.oneInFive = (p, { x, y, s = 1, k = 1, leave = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -300, width: 880, height: 600, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    for (let i = 0; i < 5; i++) { const bad = i === 4, dx = bad ? leave * 220 : 0, op = bad ? 1 - leave * 0.7 : 1, fg = el("g", { transform: `translate(${-320 + i * 150 + dx} 40)`, opacity: op }, g), c = bad ? RED : G3;
      el("circle", { cx: 0, cy: -110, r: 42, fill: c, stroke: INK, "stroke-width": 5 }, fg); el("path", { d: "M-60,40 Q-60,-50 0,-56 Q60,-50 60,40 Z", fill: c, stroke: INK, "stroke-width": 5 }, fg); }
    K.txt(g, 0, -200, "1 IN 5 SHOPPERS QUIT", 58, RED); K.txt(g, 0, 210, "when forced to create an account", 36, G3); K.txt(g, 0, 260, "source: Baymard Institute checkout research", 24, G4); return g; };
  W.leaks = (p, { x, y, s = 1, k = 1, cut = 0, t = 0 }) => { if (k <= 0) return; const g = el("g", { transform: `translate(${x} ${y}) scale(${s * k})` }, p);
    el("rect", { x: -440, y: -330, width: 880, height: 660, rx: 36, fill: WH, stroke: INK, "stroke-width": 9 }, g);
    W.STATIONS.concat(["PAY"]).forEach((nm, i) => { const yy = -250 + i * 96, w0 = 700 - i * 70, bad = i >= 2 && i <= 4;
      const rg = el("g", { opacity: bad ? 1 - cut * 0.75 : 1 }, g);
      el("rect", { x: -w0 / 2, y: yy, width: w0, height: 74, rx: 14, fill: i === 5 ? "#7FE0A0" : bad ? "#FFE3E3" : "#EEF0F3", stroke: INK, "stroke-width": 5 }, rg); K.txt(rg, 0, yy + 50, nm, 38, bad ? RED : G1);
      if (bad && cut < 0.5) for (let d = 0; d < 2; d++) { const ph = (t * 1.6 + d * 0.5 + i * 0.3) % 1; el("path", { d: `M${w0 / 2 - 20 - d * 60},${yy + 78 + ph * 50} q-8,14 0,20 q8,-6 0,-20 Z`, fill: "#7FD8F0", stroke: INK, "stroke-width": 2, opacity: 1 - ph }, g); }
      if (bad && cut > 0) el("line", { x1: -w0 / 2 - 10, y1: yy + 37, x2: lerp(-w0 / 2 - 10, w0 / 2 + 10, clamp(cut * 1.6 - (i - 2) * 0.2)), y2: yy + 37, stroke: RED, "stroke-width": 10, "stroke-linecap": "round" }, g); });
    return g; };
  W.phoneForm = (p, { x, y, s = 1, rot = 0 }) => { const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` }, p);
    el("rect", { x: -110, y: -200, width: 220, height: 400, rx: 30, fill: G1, stroke: INK, "stroke-width": 7 }, g); el("rect", { x: -92, y: -170, width: 184, height: 330, rx: 12, fill: WH }, g);
    K.txt(g, 0, -130, "CREATE", 30, RED); K.txt(g, 0, -96, "ACCOUNT", 30, RED);
    for (let j = 0; j < 3; j++) el("rect", { x: -76, y: -70 + j * 64, width: 152, height: 44, rx: 8, fill: WH, stroke: G4, "stroke-width": 4 }, g); return g; };

  W.sheet = (s) => {
    const lab = (x, y, t, z = 30) => K.txt(s, x, y, t, z, "#555"), F = Person.FACES;
    lab(1200, 64, "WORLD 14 · NOIR CITY · \"Customers were vanishing from this shop\" — cast & props", 42);
    [["Det. Vera", W.VERA, F.deadpan], ["Vera: smirk", W.VERA, F.smug], ["Benny (owner)", W.BENNY, F.worried], ["Benny: panic", W.BENNY, Object.assign({}, F.shock, { sweat: 1 })], ["Shopper", W.SHOPPER, F.calm], ["Shopper: I'm out", W.SHOPPER, { eyes: "half", lid: 0.6, mouth: "flat", tired: 1 }]].forEach(([n, look, face], i) => {
      const x = 200 + i * 400, y = 620; Person.draw(s, Object.assign({ x, y, s: 0.66 }, look, face)); lab(x, y + 50, n); });
    W.magnifier(s, { x: 2300, y: 450, s: 1 }); lab(2300, 650, "magnifier");
    const tile = (x0, y0, wd, f, lb) => { const id = "nt" + x0 + y0, cp = el("clipPath", { id }, s); el("rect", { x: x0, y: y0, width: wd, height: 760, rx: 14 }, cp);
      const g = el("g", { "clip-path": `url(#${id})` }, s), sg = el("g", { transform: `translate(${x0} ${y0}) scale(0.5) translate(0 -250)` }, g); f(sg); lab(x0 + wd / 2, y0 + 800, lb); };
    tile(60, 760, 540, (g) => { W.street(g, { t: 0.4 }); Person.draw(g, Object.assign({ x: 760, y: 1440, s: 0.75 }, W.GHOST, F.calm)); }, "street + neon");
    tile(640, 760, 540, (g) => { W.shop(g, { t: 0.4 }); Person.draw(g, Object.assign({ x: 640, y: 1420, s: 0.9 }, W.BENNY, F.worried)); W.counter(g, {}); W.cart(g, { x: 200, y: 1380, items: 3 }); }, "shop inside + counter");
    tile(1220, 760, 1120, (g) => { W.corridor(g, { t: 0.4, killer: 1 }); }, "checkout corridor (5 stations, killer lit)");
    W.oneInFive(s, { x: 500, y: 2050, s: 0.5, leave: 0.6 }); lab(500, 2230, "1-in-5 card");
    W.leaks(s, { x: 1100, y: 2050, s: 0.5, cut: 0.3, t: 0.3 }); lab(1100, 2250, "leaky funnel / cut");
    W.poof(s, { x: 1600, y: 2000, k: 0.3 }); lab(1600, 2200, "poof");
    W.phoneForm(s, { x: 1900, y: 2020, s: 0.8 }); lab(1900, 2230, "the bill");
    W.cart(s, { x: 2220, y: 2080, items: 2 }); lab(2220, 2230, "cart");
  };
  root.World = W;
})(window);
