/* World 3 · Space · "How different IQ astronauts fix a broken spaceship" (50.8 s). IQ-levels format.
   Hook: red alarm, three astronauts. LOW IQ: Bo bangs the console (FIX! FIX! FIX!) -> more broken. MEDIUM IQ: Gwen opens a
   900-page manual. Oxygen: 4 minutes. HIGH IQ: Juno explains the code line by line to a rubber duck -> "wait. That's a minus."
   -> the bug literally jumps out (drop, the one flash, engines on) -> rubber duck debugging is real -> Bo: "My turn! FIX!" -> blackout. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const BOC = "#C8902E", GWC = "#C0392B", JUC = "#24857E";
const HITS = [w(2, 0), w(2, 1), w(2, 2)], BROKEN = w(3, 5), NINE = w(5, 4), WHAT = w(5, 7), OXY = ls(6);
const L1 = w(8, 2), L2 = w(8, 7), L3 = w(8, 12), WAIT = w(8, 14), MINUS = w(8, 17), BUG = w(9, 9), DROP = w(9, 12);
const TURN = ls(11), FIX2 = w(11, 2), CTA = ls(12);
const IQT = [ls(1), ls(4), ls(7)];
const BO = { x: 272, y: 1420, s: 0.9 }, GW = { x: 545, y: 1420, s: 0.9 }, JU = { x: 815, y: 1420, s: 0.9 }, CODE = { x: 600, y: 960 };

WK.film({
  flashAt: DROP,
  titleSlam: { text: "FIXED!", at: DROP, until: ls(10) + 0.2, color: "#3FB8AF", size: 170, y: 620 },
  captions: [
    [0, w(0, 5), ["1 BROKEN SPACESHIP.", { y: 290, size: 82, at: [w(0, 0), w(0, 1), w(0, 2)], accent: ["BROKEN"], acc: "#E5484D" }], ["3 ASTRONAUTS.", { y: 392, size: 82, at: [w(0, 3), w(0, 4)] }]],
    [w(0, 5), ls(1), ["HOW DIFFERENT IQs FIX IT", { y: 290, size: 74, at: [w(0, 6), w(0, 7), w(0, 8), w(0, 9), w(0, 10)], accent: ["IQs"] }]],
    [ls(2), ls(3), ["“FIX! FIX! FIX!”", { y: 290, size: 100, at: HITS, color: BOC }]],
    [ls(3), ls(4), ["THE SHIP IS NOW", { y: 290, size: 82, at: [w(3, 0), w(3, 1), w(3, 2), w(3, 3)] }], ["MORE BROKEN.", { y: 392, size: 92, at: [w(3, 4), BROKEN], accent: ["BROKEN."], acc: "#E5484D" }]],
    [ls(5), ls(6), ["“PAGE 1 OF 900...”", { y: 290, size: 84, at: [w(5, 1), w(5, 2), w(5, 3), NINE], color: GWC }], ["“WHAT IS A SPACESHIP?”", { y: 392, size: 72, at: [WHAT, w(5, 8), w(5, 9), w(5, 10)], color: GWC }]],
    [ls(6), ls(7), ["OXYGEN: 4 MINUTES.", { y: 300, size: 88, at: [OXY, w(6, 2), w(6, 3)], accent: ["MINUTES."], acc: "#E5484D" }]],
    [ls(8), WAIT - 0.1, ["“OKAY, DUCK.”", { y: 290, size: 92, at: [w(8, 0), w(8, 1)], color: JUC }], ["“LINE ONE... LINE TWO...”", { y: 392, size: 70, at: [L1, w(8, 3), L2, w(8, 8)], color: JUC }]],
    [WAIT, ls(9), ["“WAIT.”", { y: 290, size: 100, at: [WAIT], color: JUC }], ["“THAT'S A MINUS.”", { y: 392, size: 88, at: [w(8, 15), w(8, 16), MINUS], color: JUC, accent: ["MINUS.”"], acc: "#E5484D" }]],
    [ls(9), ls(10), ["SAY IT OUT LOUD...", { y: 290, size: 84, at: [w(9, 0), w(9, 1), w(9, 3), w(9, 3) + 0.1] }], ["THE BUG JUMPS OUT.", { y: 392, size: 84, at: [w(9, 8), BUG, w(9, 10), DROP], accent: ["BUG"], acc: "#4E8A3A" }]],
    [ls(10), ls(11), ["RUBBER DUCK DEBUGGING.", { y: 290, size: 74, at: [w(10, 1), w(10, 2), w(10, 3)], accent: ["DUCK"], acc: "#E9B400" }], ["REAL ENGINEERS DO THIS.", { y: 392, size: 72, at: [w(10, 4), w(10, 5), w(10, 7), w(10, 8)] }]],
    [ls(11), CTA, ["“MY TURN! FIX!”", { y: 300, size: 100, at: [w(11, 0), w(11, 1), FIX2], color: BOC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(12, 0)] }], ["“DEBUG”", { y: 450, size: 150, at: [w(12, 1)], color: "#3FB8AF" }], ["for the free debugging checklist", { y: 550, size: 50, at: [w(12, 2), w(12, 3), w(12, 4), w(12, 5), w(12, 6)], color: "#ddd" }]],
  ],
  cam: [[0, 1.12, 545, 1150], [ls(1) - 0.15, 1.12, 545, 1150], [ls(1) + 0.3, 1.65, 300, 1175], [ls(4) - 0.15, 1.65, 300, 1175], [ls(4) + 0.3, 1.65, 545, 1175],
    [OXY - 0.15, 1.65, 545, 1175], [OXY + 0.35, 1.25, 545, 1110], [ls(7) - 0.15, 1.25, 545, 1110], [ls(7) + 0.35, 1.58, 745, 1150], [ls(9) - 0.1, 1.58, 745, 1150],
    [ls(9) + 0.5, 1.2, 560, 1120], [ls(10) - 0.1, 1.2, 560, 1120], [ls(10) + 0.4, 1.12, 545, 1150], [TURN - 0.15, 1.12, 545, 1150], [TURN + 0.25, 1.55, 300, 1175],
    [CTA - 0.2, 1.55, 300, 1175], [CTA + 0.5, 1.12, 545, 1150], [D, 1.16, 545, 1150]],
  render(t, { world: Wg, over }) {
    const light = t < DROP ? 0 : t < FIX2 ? 1 : -1, warp = t >= DROP && t < FIX2 ? Math.min(seg(t, DROP, DROP + 0.4), 1 - seg(t, ls(10) + 1.5, ls(10) + 3)) : 0;
    Wd.set(Wg, { light, t, warp });
    Wd.junk(Wg, { t });
    const hitK = (h) => { if (t < h - 0.25 || t > h + 0.25) return -1; return t < h ? E.inQuad(seg(t, h - 0.22, h)) : 1 - seg(t, h, h + 0.25) * 0.4; };
    const fl = (i) => Math.sin(t * 1.2 + i * 2) * 7;
    // ---------------- Bo
    let bo = Object.assign({}, BO, Wd.BO, F.happy, { y: BO.y + fl(0), armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 }, look: [0.3, 0.2] });
    if (t < ls(1)) bo = Object.assign(bo, F.calm, { look: [0.5, 0.3] });
    if (t >= ls(1) - 0.1 && t < ls(3)) { bo = Object.assign(bo, F.shout); const ks = HITS.map(hitK).filter((k) => k >= 0); if (ks.length) { const k = ks[0]; bo.armL = { x: -110, y: lerp(-320, 30, k) }; bo.armR = { x: 110, y: lerp(-320, 30, k) }; } else if (t < HITS[0]) { const k = seg(t, ls(1), HITS[0] - 0.22); bo.armL = { x: -110, y: lerp(10, -320, k) }; bo.armR = { x: 110, y: lerp(10, -320, k) }; } }
    if (t >= ls(3) && t < ls(4)) bo = Object.assign(bo, F.happy, { armR: { x: 120, y: -260 }, handR: "point" });
    if (t >= OXY && t < ls(7)) bo = Object.assign(bo, F.shock, { look: [1, -0.2] });
    if (t >= ls(7) && t < DROP) bo = Object.assign(bo, F.calm, { look: [1, 0] });
    if (t >= DROP && t < TURN) bo = Object.assign(bo, F.happy, { armL: { x: -140, y: -300 }, armR: { x: 140, y: -300 } });
    if (t >= TURN) { bo = Object.assign(bo, F.shout); const k = hitK(FIX2); if (k >= 0) { bo.armL = { x: -110, y: lerp(-320, 30, k) }; bo.armR = { x: 110, y: lerp(-320, 30, k) }; } else if (t < FIX2) { const k2 = seg(t, TURN, FIX2 - 0.22); bo.armL = { x: -110, y: lerp(10, -320, k2) }; bo.armR = { x: 110, y: lerp(10, -320, k2) }; } if (t > FIX2 + 0.5) bo = Object.assign(bo, F.happy); }
    if ([2, 11].some((i) => speaking(t, i))) { bo.mouth = "shout"; bo.open = 0.4 + talkOpen(t, 1) * 0.6; }
    // ---------------- Gwen
    let gw = Object.assign({}, GW, Wd.GWEN, F.worried, { y: GW.y + fl(1), look: [-0.6, 0.2], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
    if (t >= ls(3) && t < ls(4)) gw = Object.assign(gw, F.deadpan, { look: [-1, 0] });
    const reading = t >= ls(5) - 0.2 && t < OXY + 0.3;
    if (reading) gw = Object.assign(gw, F.think, { look: [0, 0.9], armL: { x: -90, y: -150 }, armR: { x: 90, y: -150 } });
    if (reading && t >= NINE) gw = Object.assign(gw, F.worried, { sweat: 1, look: [0, 0.9] });
    if (t >= OXY && t < ls(7)) gw = Object.assign(gw, F.shock, { look: [0, 0] });
    if (t >= ls(7) && t < DROP) gw = Object.assign(gw, F.calm, { look: [1, 0] });
    if (t >= DROP && t < TURN) gw = Object.assign(gw, F.happy, { armL: { x: -140, y: -300 }, armR: { x: 140, y: -300 } });
    if (t >= TURN) gw = Object.assign(gw, t < FIX2 + 0.2 ? F.shock : F.deadpan, { look: [-1, 0] });
    if (speaking(t, 5)) { gw.mouth = "o"; gw.open = talkOpen(t, 2); }
    // ---------------- Juno
    let ju = Object.assign({}, JU, Wd.JUNO, F.calm, { y: JU.y + fl(2), look: [-0.7, 0.2], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
    if (t >= ls(3) && t < ls(4)) ju = Object.assign(ju, F.deadpan, { look: [-1, 0] });
    if (t >= OXY && t < ls(7)) ju = Object.assign(ju, F.shock, { look: [0, 0] });
    const duckHeld = t >= ls(7) && t < TURN;
    if (duckHeld) ju = Object.assign(ju, F.calm, { look: [-0.9, -0.4], armL: { x: -150, y: -210 } });
    if (t >= WAIT && t < MINUS) ju = Object.assign(ju, F.shock, { look: [-1, -0.3], armL: { x: -150, y: -210 } });
    if (t >= MINUS && t < DROP) ju = Object.assign(ju, F.smug, { look: [-1, -0.3], armL: { x: -150, y: -210 }, armR: { x: -60, y: -300 }, handR: "point" });
    if (t >= DROP && t < TURN) ju = Object.assign(ju, F.happy, { armL: { x: -150, y: -300 }, armR: { x: 140, y: -300 } });
    if (t >= TURN) ju = Object.assign(ju, t < FIX2 + 0.2 ? F.shock : F.deadpan, { look: [-1, 0] });
    if (speaking(t, 8)) { ju.mouth = "o"; ju.open = talkOpen(t, 3) * 0.8; }
    [bo, gw, ju].forEach((c, i) => { if (blink(t, i * 0.9) && c.eyes === "open") c.eyes = "closed"; P.draw(Wg, c); });
    // props in hands
    if (reading) { const h = P.hand(gw, "L"), k = E.outBack(seg(t, ls(5) - 0.2, ls(5) + 0.1)); Wd.manual(Wg, { x: GW.x, y: h[1] - 20, s: 0.6 * k, thick: t < NINE ? 0.25 : lerp(0.25, 1.4, E.outBack(seg(t, NINE, NINE + 0.35))) }); }
    if (duckHeld || t >= TURN) { const h = P.hand(ju, "L"), nod = [L1, L2, L3].some((x) => t > x && t < x + 0.25) ? Math.sin((t % 1) * 30) : 0;
      if (t < TURN) Wd.duck(Wg, { x: h[0] + 10, y: h[1] - 40, s: 0.62 * E.outBack(seg(t, ls(7), ls(7) + 0.25)), nod, rot: -6 });
      else Wd.duck(Wg, { x: lerp(h[0], 1200, seg(t, TURN, D)), y: 900 - 120 * seg(t, TURN, D), s: 0.55, rot: t * 40 }); }
    // ---------------- the console (foreground)
    Wd.console(Wg, { light, t, dents: HITS.filter((h) => t >= h).length + (t >= FIX2 ? 1 : 0), panelOff: t >= ls(3) && t < DROP ? 1 : 0 });
    HITS.concat([FIX2]).forEach((h) => { if (t > h && t < h + 0.5) Wd.sparks(Wg, { x: BO.x, y: 1400, k: seg(t, h, h + 0.5) }); });
    if (t >= ls(3) && t < DROP) for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; el("circle", { cx: 400 + Math.sin(ph * 6 + i) * 30, cy: 1460 - ph * 380, r: 30 + ph * 50, fill: "#6B6F78", opacity: 0.5 * (1 - ph) }, Wg); }
    // holo code next to Juno
    if (t >= ls(8) - 0.2 && t < ls(10)) { const k = E.outBack(seg(t, ls(8) - 0.2, ls(8) + 0.1)) * (1 - seg(t, DROP - 0.1, DROP + 0.2)); const hl = t < L1 ? -1 : t < L2 ? 0 : t < L3 ? 1 : 2;
      Wd.code(Wg, { x: CODE.x, y: CODE.y, s: 0.62, k, hl, bad: t >= WAIT ? 1 : 0, fixed: t >= MINUS + 0.3 ? 1 : 0 });
      if (t > MINUS + 0.3 && t < MINUS + 0.9) FX.sparkle(Wg, { x: CODE.x - 30, y: CODE.y + 60, k: seg(t, MINUS + 0.3, MINUS + 0.9), r: 110, n: 7, s: 0.7 }); }
    // the bug jumps out of the console and away
    if (t >= BUG - 0.2 && t < DROP + 0.9) { const k = seg(t, BUG - 0.2, DROP + 0.8); Wd.bug(Wg, { x: lerp(560, 1250, k), y: lerp(1390, 700, E.outQuad(k)) + arc(k, 260), s: 0.75, rot: k * 220, t }); }
    if (t >= DROP && t < DROP + 0.8) FX.sparkle(Wg, { x: 545, y: 1100, k: seg(t, DROP, DROP + 0.8), r: 420, n: 14, s: 1.4 });
    // ---------------- over: IQ cards, oxygen gauge
    IQT.forEach((a, i) => { const end = Math.min([ls(4), OXY, ls(9)][i], a + 1.7), k = Math.min(E.outBack(seg(t, a, a + 0.25)), 1 - seg(t, end - 0.4, end - 0.1)); if (t >= a && t < end) Wd.iq(over, { x: 540, y: 560, level: i + 1, k: k * 0.85 }); });
    if (t >= OXY - 0.1 && t < ls(7) + 0.1) { const k = Math.min(E.outBack(seg(t, OXY - 0.1, OXY + 0.2)), 1 - seg(t, ls(7) - 0.2, ls(7) + 0.1)); Wd.gauge(over, { x: 540, y: 640, s: 1.0 * k, v: lerp(0.4, 0.18, seg(t, OXY, ls(7))), t }); }
    const sh = [...HITS.map((h, i) => shake(t, h, h + 0.25, 16, i)), shake(t, DROP, DROP + 0.5, 22, 7), shake(t, FIX2, FIX2 + 0.4, 18, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: light < 0 ? "#1A1D24" : "#C9D3DE" };
  },
});
