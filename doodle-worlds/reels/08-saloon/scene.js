/* World 8 · Wild West · "Two saloons started a price war" (43.6 s). Parable: differentiate, don't cut price.
   Hook: two saloons, one price war; a third won without cutting a price ("?" over the boarded-up middle building).
   The volley: 5c! 4c! 3c! TWO! (whip pans) -> by Friday lemonade is FREE and both are broke (cobwebs, tumbleweed, moths).
   Rosa opens across the street at 10c. Dusty laughs: "Who'd pay ten?" -> EVERYONE (drop, the one flash): the crowd crosses;
   shade, a piano, ice-cold lemonade. The chart: cut price -> 0, different -> win. Tag: Dusty, in Rosa's line: "...Two lemonades, please." */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const DUSC = "#8A5A3A", BELC = "#C0397A";
const WON = w(0, 9), V = [w(1, 1), ls(2), ls(3), ls(4)], FRIDAY = w(5, 1), FREE = w(5, 4), BROKE = w(5, 9), ROSA = w(6, 1), OPENED = w(6, 2), TEN = w(6, 8);
const LAUGH = ls(7), EVERY = ls(8), SHADE = w(8, 3), PIANO = w(8, 5), ICE = w(8, 7), RACE = w(9, 5), DIFF = w(9, 13), PLEASE = ls(10), CTA = ls(11);
const DU = { x: 250, y: 1420, s: 1.0 }, BE = { x: 830, y: 1420, s: 1.0 }, ROS = { x: 540, y: 990, s: 0.36 };
const BOARD = ["5¢", "4¢", "3¢", "2¢"];

WK.film({
  flashAt: EVERY,
  captions: [
    [0, w(0, 6), ["2 SALOONS.", { y: 290, size: 100, at: [w(0, 0), w(0, 1)] }], ["1 PRICE WAR.", { y: 400, size: 100, at: [w(0, 4), w(0, 5)], accent: ["WAR."], acc: "#E5484D" }]],
    [w(0, 6), ls(1), ["A THIRD ONE WON...", { y: 290, size: 88, at: [w(0, 7), w(0, 8), WON] }], ["WITHOUT CUTTING PRICES.", { y: 400, size: 72, at: [w(0, 10), w(0, 11), w(0, 14)] }]],
    [ls(1), ls(5), ["5¢... 4¢... 3¢...", { y: 300, size: 96, at: [V[0], V[1], V[2]] }], ["TWO!", { y: 420, size: 130, at: [V[3]], color: BELC }]],
    [ls(5), ls(6), ["BY FRIDAY: FREE.", { y: 290, size: 92, at: [w(5, 0), FRIDAY, FREE], accent: ["FREE."], acc: "#3FB8AF" }], ["BOTH BROKE.", { y: 400, size: 100, at: [w(5, 6), BROKE], accent: ["BROKE."], acc: "#E5484D" }]],
    [ls(6), ls(7), ["THEN ROSA OPENED.", { y: 290, size: 92, at: [w(6, 0), ROSA, OPENED] }], ["HER PRICE: 10¢.", { y: 400, size: 96, at: [w(6, 6), w(6, 7), TEN], accent: ["10¢."], acc: "#E5484D" }]],
    [ls(7), ls(8), ["“TEN?! WHO'D PAY TEN?”", { y: 300, size: 84, at: [w(7, 1), w(7, 2), w(7, 3), w(7, 4)], color: DUSC }]],
    [ls(8), ls(9), ["EVERYONE.", { y: 290, size: 120, at: [EVERY], accent: ["EVERYONE."], acc: "#3FB8AF" }], ["SHADE. PIANO. ICE.", { y: 410, size: 92, at: [SHADE, PIANO, ICE] }]],
    [ls(9), ls(10), ["CUT PRICE → RACE TO 0.", { y: 290, size: 78, at: [w(9, 1), w(9, 2), RACE, w(9, 7)], accent: ["0."], acc: "#E5484D" }], ["BE DIFFERENT.", { y: 400, size: 104, at: [w(9, 8), DIFF], accent: ["DIFFERENT."], acc: "#24857E" }]],
    [ls(10), CTA, ["“...TWO LEMONADES,", { y: 290, size: 88, at: [PLEASE, w(10, 1)], color: DUSC }], ["PLEASE.”", { y: 400, size: 100, at: [w(10, 2)], color: DUSC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(11, 0)] }], ["“WAR”", { y: 450, size: 160, at: [w(11, 1)], color: "#E5484D" }], ["for the free pricing playbook", { y: 550, size: 52, at: [w(11, 2), w(11, 3), w(11, 4), w(11, 5), w(11, 6)], color: "#555" }]],
  ],
  cam: [[0, 1.2, 540, 1110], [ls(1) - 0.15, 1.2, 540, 1110], [V[0] - 0.2, 1.6, 300, 1100, "cut"], [V[1] - 0.05, 1.6, 780, 1100, "cut"], [V[2] - 0.05, 1.6, 300, 1100, "cut"], [V[3] - 0.05, 1.6, 780, 1100, "cut"],
    [ls(5) - 0.1, 1.6, 780, 1100], [ls(5) + 0.3, 1.2, 540, 1110], [ls(6) - 0.1, 1.2, 540, 1110], [ls(6) + 0.6, 1.75, 540, 930], [ls(7) - 0.15, 1.75, 540, 930],
    [ls(7) + 0.2, 1.6, 300, 1100], [ls(8) - 0.1, 1.6, 300, 1100], [ls(8) + 0.25, 1.05, 540, 1060], [ICE - 0.6, 1.05, 540, 1060], [ICE, 1.7, 540, 930], [ls(9) - 0.1, 1.7, 540, 930],
    [ls(10) - 0.6, 1.2, 540, 1110], [PLEASE - 0.1, 1.8, 540, 940], [CTA, 1.8, 540, 940], [CTA + 0.5, 1.4, 540, 1000], [D, 1.44, 540, 1000]],
  render(t, { world: Wg, over }) {
    Wd.desert(Wg, { t });
    Wd.cactus(Wg, { x: -70, y: 1000, s: 0.9 }); Wd.cactus(Wg, { x: 1150, y: 1000, s: 0.8 });
    const broke = seg(t, BROKE - 0.3, BROKE + 0.3), open = t < ROSA - 0.1 ? 0 : E.outBack(seg(t, ROSA - 0.1, OPENED + 0.4));
    Wd.saloon(Wg, { x: 150, y: 1000, s: 0.8, name: "DUSTY'S", broke, t });
    Wd.saloon(Wg, { x: 930, y: 1000, s: 0.8, name: "BELLE'S", tone: "#C98A8A", broke, t });
    Wd.rosas(Wg, { x: 540, y: 1000, s: 0.55, open, t, piano: t >= PIANO - 0.1 ? 1 : 0 });
    if (t >= WON - 0.1 && t < ls(1)) FX.mark(Wg, { x: 540, y: 660, ch: "?", s: 1.0, k: E.outBack(seg(t, WON - 0.1, WON + 0.15)) });
    // the crowd crossing to Rosa's
    if (t >= EVERY - 0.1) { const k = E.outQuad(seg(t, EVERY - 0.1, EVERY + 1.2));
      Kit.crowd(Wg, { x: lerp(-200, 380, k), y: 900, s: 0.5, n: 3, spread: 70, tone: "#8C7B6B", t, seed: 3 }); Kit.crowd(Wg, { x: lerp(1300, 700, k), y: 900, s: 0.5, n: 3, spread: 70, tone: "#A0907B", t, seed: 9 }); }
    // Rosa at her stall (and, for the tag, Dusty + Belle in her line)
    if (open > 0.2) { let rs = Object.assign({}, ROS, Wd.ROSA, F.happy, { armL: { x: -150, y: -60 }, armR: { x: 150, y: -60 } });
      if (t >= PLEASE) rs = Object.assign(rs, F.smug, { look: [-0.5, 0] }); if (blink(t, 1.1) && rs.eyes === "open") rs.eyes = "closed"; P.draw(Wg, rs); }
    const inLine = t >= PLEASE - 0.6;
    if (inLine) { const k = E.outBack(seg(t, PLEASE - 0.6, PLEASE - 0.2));
      let dm = Object.assign({ x: 405, y: 1000, s: 0.34 * k }, Wd.DUSTY, F.worried, { look: [1, 0], armR: { x: 160, y: -120 }, handR: "open" }); if (speaking(t, 10)) { dm.mouth = "o"; dm.open = talkOpen(t, 2) * 0.6; } P.draw(Wg, dm);
      P.draw(Wg, Object.assign({ x: 678, y: 1000, s: 0.34 * k }, Wd.BELLE, F.deadpan, { look: [-1, 0] })); }
    if (open > 0.2) Wd.stall(Wg, { x: 540, y: 1000, s: 0.5 });
    if (open > 0.2) Wd.priceBoard(Wg, { x: 540, y: 820, s: 0.42 * E.outBack(seg(t, TEN - 0.1, TEN + 0.15)), text: "10¢", hot: t >= TEN && t < TEN + 0.4 ? Math.sin(seg(t, TEN, TEN + 0.4) * Math.PI) : 0 });
    if (t >= ICE - 0.2) Wd.jug(Wg, { x: 620, y: 995, s: 0.28 * E.outBack(seg(t, ICE - 0.2, ICE + 0.1)), ice: 1, t });
    if (t >= BROKE - 0.6 && t < ROSA + 0.5) Wd.tumbleweed(Wg, { x: lerp(-200, 1300, seg(t, BROKE - 0.6, ROSA + 0.5)), y: 1080, s: 0.9, t });
    // ---------------- Dusty and Belle at their bars (they leave the shot for the tag)
    if (!inLine) {
      let du = Object.assign({}, DU, Wd.DUSTY, F.smug, { look: [1, 0], armL: { x: -150, y: -40 }, armR: { x: 150, y: -40 } });
      if (t >= ls(1) && t < ls(5)) du = Object.assign(du, F.shout, { look: [1, 0], armR: { x: 150, y: -280 }, handR: "point" });
      if (t >= ls(5)) du = Object.assign(du, F.sad, { look: [0, 0.4] });
      if (t >= ROSA) du = Object.assign(du, F.calm, { look: [0.6, -0.4] });
      if (t >= LAUGH && t < EVERY) du = Object.assign(du, F.happy, { armL: { x: -120, y: -200 }, armR: { x: 120, y: -200 } });
      if (t >= EVERY) du = Object.assign(du, F.shock, { look: [0.7, -0.4] });
      if ([1, 3, 7].some((i) => speaking(t, i))) { du.mouth = t >= LAUGH && t < EVERY ? "grin" : "shout"; du.open = talkOpen(t, 1); }
      if (blink(t, 0.4) && du.eyes === "open") du.eyes = "closed"; P.draw(Wg, du);
      let be = Object.assign({}, BE, Wd.BELLE, F.smug, { look: [-1, 0], armL: { x: -150, y: -40 }, armR: { x: 150, y: -40 } });
      if (t >= ls(1) && t < ls(5)) be = Object.assign(be, F.shout, { look: [-1, 0], armL: { x: -150, y: -280 }, handL: "point" });
      if (t >= ls(5)) be = Object.assign(be, F.sad, { look: [0, 0.4] });
      if (t >= ROSA) be = Object.assign(be, F.worried, { look: [-0.6, -0.4] });
      if (t >= EVERY) be = Object.assign(be, F.shock, { look: [-0.7, -0.4] });
      if ([2, 4].some((i) => speaking(t, i))) { be.mouth = "shout"; be.open = talkOpen(t, 2); }
      if (blink(t, 1.6) && be.eyes === "open") be.eyes = "closed"; P.draw(Wg, be);
    }
    Wd.bar(Wg, {});
    // their price boards: the volley, FREE by Friday
    const bd = (who) => { const hits = V.filter((v, i) => i % 2 === who && t >= v); if (t >= FREE) return "FREE"; if (!hits.length) return BOARD[who]; return BOARD[V.indexOf(hits[hits.length - 1])]; };
    if (!inLine) { [0, 1].forEach((who) => { const x = who ? 690 : 390, last = V.filter((v, i) => i % 2 === who && t >= v).pop(), hot = last !== undefined && t < last + 0.4 ? Math.sin(seg(t, last, last + 0.4) * Math.PI) : 0;
      Wd.priceBoard(Wg, { x, y: 1300, s: 0.7, text: bd(who), hot: Math.max(hot, t >= FREE && t < FREE + 0.4 ? Math.sin(seg(t, FREE, FREE + 0.4) * Math.PI) : 0), rot: who ? 4 : -4 }); }); }
    if (t >= BROKE - 0.2 && !inLine) { Wd.cashbox(Wg, { x: 120, y: 1405, s: 0.6, t }); Wd.cashbox(Wg, { x: 960, y: 1405, s: 0.6, t: t + 1 }); }
    if (t >= EVERY && t < EVERY + 0.8) FX.sparkle(Wg, { x: 540, y: 880, k: seg(t, EVERY, EVERY + 0.8), r: 300, n: 12, s: 1.1 });
    // ---------------- over: the chart
    if (t >= ls(9) - 0.15 && t < ls(10) - 0.3) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.15, ls(9) + 0.15)), 1 - seg(t, ls(10) - 0.6, ls(10) - 0.3));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#3A2A1E", opacity: 0.35 * k }, over);
      Wd.chart(over, { x: 540, y: 1060, s: 1.0, k, a: seg(t, w(9, 2), RACE + 0.4), b: seg(t, w(9, 9), DIFF + 0.3) }); }
    const sh = [...V.map((v, i) => shake(t, v, v + 0.3, 14, i)), shake(t, EVERY, EVERY + 0.5, 20, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#FFE2B0" };
  },
});
