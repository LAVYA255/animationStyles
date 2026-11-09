/* World 12 · Samurai dojo · "He wanted to master the sword in one day" (55.3 s). Parable.
   Hook: Kenji, sword up, "master the sword in one day". He swings 10,000 times -> sunset, can't lift a chopstick. Sensei Hoshi:
   "just once more than today. One percent." Day 1 (sensei asleep), day 30 (bokken flies up, bonks him), chart: 1% a day
   compounds (calendar races, sky cycles) -> DAY 365: one clean cut through the bamboo (the one flash, the drop, "38x") ->
   365 boring squares fill. Tag: day 366, "one percent more!" -> his slash cuts the sensei's teacup in half (delayed take)
   -> "Maybe one percent less." -> CTA. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const KEC = "#E5484D", HOC = "#5E6470";
const TEN = w(2, 3), SUNSET = w(3, 1), LIFT = w(3, 4), CHOP = w(3, 6);
const ONCE = w(4, 3), PCT = ls(6), DAY1 = ls(7), NOBODY = w(7, 5), DAY30 = w(8, 1), KIND = w(8, 3), BAD = w(8, 5);
const STACK = w(9, 1), UP = w(9, 7), D365 = w(10, 1), DROP = w(10, 2), HERO = ls(11), BORING = w(11, 8);
const TAG = ls(12), D366 = w(12, 2), MORE = w(12, 5), LESS = ls(13), CTA = ls(14);
const KE = { x: 320, y: 1420, s: 1.05 }, HO = { x: 800, y: 1420, s: 1.05 }, BAM = { x: 575, y: 1405 }, CAL = { x: 150, y: 770 };
const CUTUP = MORE + 0.9; // the teacup falls apart a beat after the slash
// sword poses (arms in rig units, bokken angle in degrees)
const REST = { aL: [50, -160], aR: [95, -160], ang: -66 }, HIGH = { aL: [-20, -400], aR: [15, -400], ang: -112 }, LOW = { aL: [130, -170], aR: [170, -170], ang: 6 };
const mixP = (a, b, k) => ({ aL: [lerp(a.aL[0], b.aL[0], k), lerp(a.aL[1], b.aL[1], k)], aR: [lerp(a.aR[0], b.aR[0], k), lerp(a.aR[1], b.aR[1], k)], ang: lerp(a.ang, b.ang, k) });
// one strike landing at `at`: rest -> high -> low (fast) -> rest
const strike = (t, at) => { if (t < at - 0.4 || t > at + 0.45) return null;
  if (t < at - 0.1) return { p: mixP(REST, HIGH, E.inOutSine(seg(t, at - 0.4, at - 0.1))), blur: 0 };
  if (t < at) { const k = E.inQuad(seg(t, at - 0.1, at)); return { p: mixP(HIGH, LOW, k), blur: 1, prev: lerp(HIGH.ang, LOW.ang, Math.max(0, k - 0.6)) }; }
  return { p: mixP(LOW, REST, E.inOutSine(seg(t, at + 0.1, at + 0.45))), blur: 0 }; };

WK.film({
  flashAt: DROP,
  titleSlam: { text: "38x BETTER", at: DROP, until: HERO + 0.2, color: "#3FB8AF", size: 150, y: 330 },
  captions: [
    [0, w(1, 1), ["MASTER THE SWORD", { y: 290, size: 92, at: [w(0, 3), w(0, 4), w(0, 5)] }], ["IN ONE DAY.", { y: 400, size: 108, at: [w(0, 6), w(0, 7), w(0, 8)], accent: ["DAY."], acc: KEC }]],
    [w(1, 1), ls(2), ["“TEACH ME EVERYTHING.”", { y: 290, size: 80, at: [w(1, 1), w(1, 2), w(1, 3)], color: KEC }], ["“TODAY!”", { y: 400, size: 108, at: [w(1, 4)], color: KEC }]],
    [ls(2), ls(3), ["SO HE SWUNG...", { y: 290, size: 100, at: [w(2, 0), w(2, 1), w(2, 2)] }]],
    [ls(3), ls(4), ["BY SUNSET...", { y: 290, size: 92, at: [w(3, 0), SUNSET] }], ["HE COULDN'T LIFT A CHOPSTICK.", { y: 392, size: 66, at: [w(3, 2), w(3, 3), LIFT, w(3, 5), CHOP], accent: ["CHOPSTICK."], acc: KEC }]],
    [ls(4), w(5, 1), ["“SWING JUST ONCE MORE", { y: 290, size: 80, at: [w(4, 1), w(4, 2), ONCE, w(4, 4)], color: HOC }], ["THAN TODAY.”", { y: 392, size: 80, at: [w(4, 5), w(4, 6)], color: HOC }]],
    [w(5, 1), w(6, 2), ["“...ONE MORE?”", { y: 300, size: 104, at: [w(5, 1) + 0.14, w(5, 2)], color: KEC }]],
    [w(6, 2), ls(7), ["“1%.”", { y: 300, size: 150, at: [w(6, 2) + 0.12], color: "#3FB8AF" }], ["“EVERY DAY.”", { y: 430, size: 92, at: [w(6, 2) + 0.24, w(6, 3)], color: HOC }]],
    [ls(7), ls(8), ["DAY 1.", { y: 290, size: 96, at: [w(7, 0), w(7, 1)] }], ["1% BETTER. NOBODY NOTICES.", { y: 400, size: 66, at: [w(7, 2), w(7, 4), NOBODY, w(7, 6)] }]],
    [ls(8), w(9, 3), ["DAY 30.", { y: 290, size: 96, at: [w(8, 0), DAY30] }], ["STILL... KIND OF BAD.", { y: 400, size: 84, at: [w(8, 2), KIND, w(8, 4), BAD], accent: ["BAD."], acc: KEC }]],
    [w(9, 3), D365 + 0.12, ["EVERY SINGLE DAY", { y: 290, size: 86, at: [w(9, 3), w(9, 4), w(9, 5)] }], ["STACKS UP.", { y: 400, size: 96, at: [w(9, 6), UP], accent: ["UP."], acc: "#3FB8AF" }]],
    [D365 + 0.12, DROP - 0.1, ["DAY 365.", { y: 300, size: 120, at: [D365 + 0.24] }], "hard"],
    [HERO + 0.3, TAG, ["NOT ONE HEROIC DAY.", { y: 290, size: 84, at: [HERO + 0.32, HERO + 0.42, w(11, 2), w(11, 3)] }], ["JUST A LOT OF BORING ONES.", { y: 400, size: 70, at: [w(11, 4), w(11, 5), w(11, 6), w(11, 7), BORING, w(11, 9)], accent: ["BORING"], acc: "#3FB8AF" }]],
    [TAG, LESS, ["“DAY 366!”", { y: 290, size: 104, at: [w(12, 1), D366], color: KEC }], ["“ONE PERCENT MORE!”", { y: 400, size: 88, at: [w(12, 3), w(12, 4), MORE], color: KEC }]],
    [LESS, w(14, 1), ["“MAYBE ONE PERCENT", { y: 290, size: 86, at: [w(13, 0), w(13, 1), w(13, 2)], color: HOC }], ["LESS.”", { y: 400, size: 116, at: [w(13, 3)], color: HOC }], "hard"],
    [w(14, 1), D + 1, ["COMMENT", { y: 300, size: 116, at: [w(14, 1) + 0.12] }], ["“HABIT”", { y: 450, size: 150, at: [w(14, 1) + 0.3], color: "#3FB8AF" }], ["for the free 1% tracker", { y: 550, size: 50, at: [w(14, 2), w(14, 3), w(14, 4), w(14, 5), w(14, 7)], color: "#ddd" }]],
  ],
  cam: [[0, 1.6, 360, 1080], [ls(1) - 0.15, 1.62, 360, 1080], [ls(1) + 0.3, 1.15, 560, 1000], [ls(2) - 0.1, 1.15, 560, 1000], [ls(2) + 0.3, 1.45, 420, 1070],
    [ls(3) - 0.1, 1.45, 420, 1070], [ls(3) + 0.4, 1.7, 370, 1150], [ls(4) - 0.15, 1.7, 370, 1150], [ls(4) + 0.3, 1.62, 770, 1090], [ls(5) - 0.12, 1.62, 770, 1090],
    [ls(5) + 0.25, 1.62, 360, 1090], [ls(6) - 0.12, 1.62, 360, 1090], [ls(6) + 0.25, 1.62, 770, 1090], [ls(7) - 0.05, 1.62, 770, 1090],
    [ls(7), 1.15, 480, 910, "cut"], [ls(9) - 0.1, 1.17, 480, 910], [ls(9) + 0.3, 1.1, 540, 950], [D365 + 0.9, 1.1, 540, 950], [DROP - 0.35, 1.42, 450, 1060],
    [HERO - 0.1, 1.42, 450, 1060], [HERO + 0.4, 1.1, 540, 950], [TAG - 0.1, 1.1, 540, 950], [TAG + 0.3, 1.15, 560, 980], [CUTUP - 0.3, 1.15, 560, 980],
    [CUTUP + 0.1, 1.72, 780, 1130], [CTA - 0.2, 1.72, 780, 1130], [CTA + 0.5, 1.12, 560, 980], [D, 1.16, 560, 980]],
  render(t, { world: Wg, over }) {
    const lapse = t >= STACK && t < D365 ? seg(t, STACK, D365) : 0;
    let sky = 0; if (t >= ls(3) - 0.1 && t < DAY1) sky = E.inOutSine(seg(t, ls(3) - 0.1, SUNSET + 0.4)); if (lapse > 0) sky = 1 - Math.cos(lapse * Math.PI * 12);
    Wd.dojo(Wg, { t, sky });
    // calendar on the wall
    if (t >= DAY1 - 0.2) { const day = t < DAY30 ? 1 : t < STACK ? 30 : t < D365 ? Math.round(lerp(30, 365, E.inQuad(lapse))) : t < D366 ? 365 : 366;
      const flip = t >= DAY30 && t < DAY30 + 0.4 ? seg(t, DAY30, DAY30 + 0.4) : t >= D366 && t < D366 + 0.4 ? seg(t, D366, D366 + 0.4) : lapse > 0 ? (lapse * 40) % 1 : 0;
      Wd.cal(Wg, { x: CAL.x, y: CAL.y, s: 0.75 * E.outBack(seg(t, DAY1 - 0.2, DAY1 + 0.1)), day, flip }); }
    // bamboo target (behind the rail), sliced on the drop
    if (t >= ls(10) && t < HERO + 0.6) Wd.bamboo(Wg, { x: BAM.x, y: BAM.y, s: 0.9 * E.outBack(seg(t, ls(10), ls(10) + 0.3)), cut: t < DROP ? 0 : seg(t, DROP, DROP + 1.3), t });
    const fl = (i) => Math.sin(t * 1.4 + i * 2) * 4;
    // ---------------- Kenji
    let ke = Object.assign({}, KE, Wd.KENJI, F.happy, { y: KE.y + fl(0), look: [0.6, -0.1] }), pose = REST, blur = 0, prev = null, sword = true;
    if (t < ls(1)) { ke = Object.assign(ke, F.happy, { look: [0.3, -0.4] }); pose = mixP(REST, HIGH, 0.12 + 0.08 * Math.sin(t * 3)); }
    if (t >= ls(1) && t < ls(2)) ke = Object.assign(ke, F.shout, { look: [1, 0] });
    if (t >= ls(2) - 0.1 && t < ls(3)) { const per = lerp(0.42, 0.2, seg(t, ls(2), TEN)), u = ((t - ls(2) + 0.1) / per) % 1; ke = Object.assign(ke, F.shout, { sweat: seg(t, TEN, ls(3)), look: [1, 0.2] });
      pose = u < 0.55 ? mixP(LOW, HIGH, E.inOutSine(u / 0.55)) : mixP(HIGH, LOW, E.inQuad((u - 0.55) / 0.45)); blur = u >= 0.55 ? 1 : 0; prev = HIGH.ang; }
    if (t >= ls(3) && t < ls(5)) { ke = Object.assign(ke, { eyes: "half", lid: 0.6, tired: 1, mouth: "wavy", sweat: 1, look: [0.2, 0.8] }); sword = false;
      ke.armL = { x: -130, y: 40 }; ke.armR = { x: 110, y: 10 }; if (t >= w(3, 3) - 0.2 && t < ls(4)) { ke.armR = { x: 70 + Math.sin(t * 40) * 6, y: -30 + Math.sin(t * 33) * 8 }; ke.handR = "open"; } if (t >= ls(4)) ke.look = [1, 0]; }
    if (t >= ls(5) && t < ls(7)) { ke = Object.assign(ke, t < PCT ? F.think : F.worried, { look: [1, 0], sweat: 0.5 }); sword = false; ke.armL = { x: -130, y: 40 }; ke.armR = { x: 130, y: 40 }; }
    const strikes = [w(7, 2), NOBODY + 0.3, KIND, D365 - 0.2, DROP, w(11, 2), w(11, 6), BORING + 0.3, MORE];
    if (t >= DAY1) { ke = Object.assign(ke, F.calm, { look: [0.8, 0] }); for (const s of strikes) { const r = strike(t, s); if (r) { pose = r.p; blur = r.blur; prev = r.prev ?? null; } } }
    // day 30: the bokken flies up and lands on his head
    const fly = t >= KIND + 0.05 && t < BAD + 0.6;
    if (fly) { sword = false; ke = Object.assign(ke, t < BAD ? F.shock : F.sad, { look: [0, -1] }); if (t >= BAD) Object.assign(ke, { eyes: "x", look: [0, 0] }); ke.armL = { x: -60, y: -300 }; ke.armR = { x: 60, y: -300 }; ke.handL = "open"; ke.handR = "open"; }
    if (t >= DROP - 0.6 && t < DROP) ke = Object.assign(ke, F.deadpan, { look: [1, -0.2] });
    if (t >= DROP && t < HERO) ke = Object.assign(ke, F.smug, { look: [1, 0] });
    if (t >= TAG) ke = Object.assign(ke, F.shout, { look: [1, 0] });
    if (t >= MORE + 0.4) ke = Object.assign(ke, t < CUTUP ? F.happy : F.worried, { look: [1, 0], sweat: t >= CUTUP ? 1 : 0 });
    if (sword) { ke.armL = { x: pose.aL[0], y: pose.aL[1] }; ke.armR = { x: pose.aR[0], y: pose.aR[1] }; }
    if (speaking(t, 1) || speaking(t, 12)) { ke.mouth = "shout"; ke.open = 0.4 + talkOpen(t, 1) * 0.6; }
    if (speaking(t, 5)) { ke.mouth = "o"; ke.open = talkOpen(t, 2) * 0.6; }
    // ---------------- Hoshi (tea in his left hand)
    const sip = (a) => t >= a && t < a + 1.3 ? Math.sin(seg(t, a, a + 1.3) * Math.PI) : 0, sipK = Math.max(sip(1.2), sip(ls(2) + 0.6), sip(TAG + 1.4));
    let ho = Object.assign({}, HO, Wd.HOSHI, F.calm, { y: HO.y + fl(1), look: [-0.8, 0.1], armL: { x: lerp(-150, 15, sipK), y: lerp(-140, -265, sipK) }, handL: "open" });
    if (sipK > 0.5) ho.eyes = "closed";
    if (t >= ls(3) && t < ls(4)) ho = Object.assign(ho, F.smug, { look: [-1, 0.3] });
    if (t >= ls(4) && t < ls(7)) ho = Object.assign(ho, F.calm, { look: [-1, 0], armR: { x: 140, y: -330 }, handR: "point" });
    if (t >= ls(5) && t < ls(6)) ho.armR = { x: 140, y: -40 };
    if (t >= DAY1 && t < ls(8)) ho = Object.assign(ho, { eyes: "closed", mouth: "o", open: 0.25, look: [0, 0.4] });
    if (t >= ls(8) && t < ls(9)) ho = Object.assign(ho, F.deadpan, { eyes: "half", look: [-1, 0] });
    if (t >= DROP && t < TAG) ho = Object.assign(ho, F.happy, { look: [-1, 0] });
    if (t >= TAG) ho = Object.assign(ho, F.calm, { look: [-1, 0] });
    if (t >= MORE) ho = Object.assign(ho, F.deadpan, { look: [-1, 0], eyes: t >= CUTUP ? "half" : "open" });
    if (t >= CUTUP) { ho.armL = { x: -150, y: -140 }; ho.eyes = "half"; ho.lid = 0.55; }
    if ([4, 6, 13].some((i) => speaking(t, i))) { ho.mouth = "flat"; ho.open = talkOpen(t, 3) * 0.5; }
    [ke, ho].forEach((c, i) => { if (blink(t, i * 1.1) && c.eyes === "open") c.eyes = "closed"; P.draw(Wg, c); });
    if (sword) { const h = P.hand(ke, "R"); Wd.bokken(Wg, { x: h[0], y: h[1], ang: pose.ang, s: 0.9, blur, prev }); }
    if (fly) { const hd = P.head(ke), k1 = seg(t, KIND + 0.05, KIND + 0.6), k2 = seg(t, BAD - 0.45, BAD), k3 = seg(t, BAD, BAD + 0.6);
      const x = t < BAD - 0.45 ? lerp(KE.x + 60, KE.x + 40, k1) : t < BAD ? KE.x - 20 : lerp(KE.x - 20, KE.x + 200, k3), y = t < BAD - 0.45 ? lerp(1000, 250, E.outQuad(k1)) : t < BAD ? lerp(250, hd[1] - 150, E.inQuad(k2)) : lerp(hd[1] - 150, 1380, E.inQuad(k3)) - arc(k3, 120);
      Wd.bokken(Wg, { x, y, ang: t * 900, s: 0.9 }); if (t >= BAD && t < BAD + 0.6) for (let j = 0; j < 4; j++) { const a = t * 5 + j * 1.6; K.txt(Wg, hd[0] + Math.cos(a) * 100, hd[1] - 170 + Math.sin(a) * 24, "★", 44, "#E9B400"); } }
    // tea cup + zzz
    { const h = P.hand(ho, "L"); Wd.tea(Wg, { x: h[0] + 6, y: h[1] + 34, s: 0.95, cut: t < CUTUP ? 0 : E.outQuad(seg(t, CUTUP, CUTUP + 0.5)), t }); }
    if (t >= DAY1 && t < ls(8)) for (let i = 0; i < 2; i++) { const ph = (t * 0.7 + i * 0.5) % 1; K.txt(Wg, HO.x + 90 + ph * 40, HO.y - 440 - ph * 80, "z", 40 + ph * 30, "#555"); }
    // ---------------- foreground rail + rice bowl
    Wd.rail(Wg, {});
    if (t >= ls(3) && t < ls(4) + 0.3) { const k = Math.min(E.outBack(seg(t, ls(3), ls(3) + 0.3)), 1 - seg(t, ls(4), ls(4) + 0.3)); Wd.bowl(Wg, { x: KE.x + 60, y: 1405, s: 0.95 * k, lift: t < LIFT - 0.1 ? 0 : t < CHOP + 0.15 ? 0.3 * seg(t, LIFT - 0.1, CHOP) : 0, shake: 1, drop: t < CHOP + 0.15 ? 0 : seg(t, CHOP + 0.15, CHOP + 0.4) }); }
    // slashes
    if (t >= DROP - 0.05 && t < DROP + 0.4) Wd.slash(Wg, { k: seg(t, DROP - 0.05, DROP + 0.35), x1: 300, y1: 1260, x2: 900, y2: 1000 });
    if (t >= MORE - 0.05 && t < MORE + 0.45) Wd.slash(Wg, { k: seg(t, MORE - 0.05, MORE + 0.4), x1: 200, y1: 1300, x2: 1250, y2: 1120 });
    if (t >= DROP && t < DROP + 0.8) FX.sparkle(Wg, { x: BAM.x, y: 1100, k: seg(t, DROP, DROP + 0.8), r: 380, n: 12, s: 1.3 });
    // ---------------- over: swing counter, chart, day grid
    if (t >= ls(2) && t < ls(3) + 0.1) { const k = Math.min(E.outBack(seg(t, ls(2), ls(2) + 0.25)), 1 - seg(t, ls(3) - 0.2, ls(3) + 0.1));
      K.counter(over, { x: 540, y: 560, s: 1.5 * k, n: 10000 * E.inQuad(seg(t, ls(2) + 0.2, w(2, 5) + 0.2)), label: "SWINGS", fmt: (v) => Math.round(v).toLocaleString("en-US") }); }
    if (t >= ls(9) - 0.1 && t < DROP - 0.3) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.1, ls(9) + 0.2)), 1 - seg(t, DROP - 0.7, DROP - 0.3)); Wd.chart(over, { x: 540, y: 930, s: 0.95 * k, k: E.inOutSine(seg(t, STACK, D365 + 0.2)) }); }
    if (t >= HERO + 0.2 && t < TAG) { const k = Math.min(E.outBack(seg(t, HERO + 0.2, HERO + 0.5)), 1 - seg(t, TAG - 0.3, TAG)); Wd.days(over, { x: 540, y: 820, s: 1.15 * k, n: Math.round(365 * seg(t, w(11, 2), BORING + 0.4)) }); }
    const sh = [shake(t, BAD, BAD + 0.35, 14, 3), shake(t, DROP, DROP + 0.5, 22, 7), shake(t, MORE, MORE + 0.35, 16, 9), shake(t, CUTUP, CUTUP + 0.3, 8, 11)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#E9D9B8" };
  },
});
