/* World 6 · Medieval · "The king wanted a perfect castle" (53.4 s). Parable: ship a small version first (MVP).
   Hook: the king's perfect-castle blueprint vs a peasant hammering a hut; who had a roof that winter? The king: forty towers,
   golden gates, a moat with swans -> year 1 plans, year 2 more plans (the pile grows). Wren builds one wobbly room. King:
   "A hut? How tiny." -> she listens and improves: leak -> patched (drop, the one flash), cold -> fireplace, window, flowers.
   Winter: the castle is still a drawing; the king at her door: "...Is there room in the hut?" -> MVP card -> "Two gold coins.
   Per night." */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const KINGC = "#B83A3A", WRENC = "#5E8F3F";
const CASTLE = w(0, 5), HUTW = w(0, 10), GUESS = w(0, 12), TOWERS = w(1, 1), GATES = w(1, 3), MOAT = w(1, 5), SWANS = w(1, 7);
const Y1 = w(2, 1), Y2 = w(2, 4), MORE = w(2, 5), BUILT = w(3, 6), ROOM = w(3, 9), WOBBLY = w(3, 10), WORKED = w(3, 13);
const TINY = w(4, 3), LEAK = w(5, 1), FIXED = w(5, 2), COLD = w(5, 4), FIRE = w(5, 5), MONTH = w(5, 6), BETTER = w(5, 9);
const WINTER = w(6, 1), DRAWING = w(6, 8), KNOCK = ls(7), MVP = w(8, 2), SMALL = w(8, 4), LEARN = w(8, 5), IMPROVE = w(8, 9), COINS = w(9, 2), CTA = ls(10);
const KG = { x: 300, y: 1420, s: 1.05 }, WR = { x: 800, y: 1420, s: 1.0 }, HUT = { x: 880, y: 1250, s: 0.9 };

WK.film({
  flashAt: FIXED,
  captions: [
    [0, GUESS - 0.1, ["KING: A PERFECT CASTLE.", { y: 290, size: 72, at: [w(0, 1), w(0, 3), w(0, 4), CASTLE], accent: ["CASTLE."], acc: KINGC }], ["PEASANT: A HUT.", { y: 392, size: 84, at: [w(0, 7), w(0, 9), HUTW], accent: ["HUT."], acc: WRENC }]],
    [GUESS - 0.1, ls(1), ["WHO HAD A ROOF", { y: 290, size: 92, at: [GUESS, w(0, 13), w(0, 15), w(0, 16)] }], ["THAT WINTER?", { y: 400, size: 92, at: [w(0, 17), w(0, 18)], accent: ["WINTER?"], acc: "#3FA3C9" }]],
    [ls(1), ls(2), ["“40 TOWERS! GOLDEN GATES!”", { y: 290, size: 66, at: [w(1, 0), TOWERS, w(1, 2), GATES], color: KINGC }], ["“A MOAT... WITH SWANS!”", { y: 392, size: 76, at: [w(1, 4), MOAT, w(1, 6), SWANS], color: KINGC }]],
    [ls(2), ls(3), ["YEAR 1: PLANS.", { y: 290, size: 92, at: [ls(2), Y1, w(2, 2)] }], ["YEAR 2: MORE PLANS.", { y: 400, size: 84, at: [w(2, 3), Y2, MORE, w(2, 6)], accent: ["MORE"] }]],
    [ls(3), ls(4), ["ONE SMALL ROOM.", { y: 290, size: 92, at: [w(3, 7), w(3, 8), ROOM] }], ["WOBBLY. BUT IT WORKED.", { y: 400, size: 76, at: [WOBBLY, w(3, 11), w(3, 12), WORKED], accent: ["WORKED."], acc: WRENC }]],
    [ls(4), ls(5), ["“A HUT? HOW... TINY.”", { y: 300, size: 88, at: [ls(4), w(4, 1), w(4, 2), TINY], color: KINGC }]],
    [ls(5), MONTH - 0.2, ["LEAKED? FIXED.", { y: 290, size: 92, at: [LEAK, FIXED], accent: ["FIXED."], acc: WRENC }], ["COLD? FIREPLACE.", { y: 400, size: 92, at: [COLD, FIRE], accent: ["FIREPLACE."], acc: "#E9A23B" }]],
    [MONTH - 0.2, ls(6), ["EVERY MONTH,", { y: 290, size: 92, at: [w(5, 6), w(5, 7)] }], ["A LITTLE BETTER.", { y: 400, size: 92, at: [w(5, 8), w(5, 9) - 0.1, BETTER], accent: ["BETTER."], acc: WRENC }]],
    [ls(6), ls(7), ["WINTER CAME.", { y: 290, size: 96, at: [WINTER, w(6, 2)], accent: ["WINTER"], acc: "#3FA3C9" }], ["THE CASTLE? STILL A DRAWING.", { y: 400, size: 62, at: [w(6, 3), w(6, 5), w(6, 6), w(6, 7), DRAWING] }]],
    [ls(7), ls(8), ["“...IS THERE ROOM", { y: 290, size: 92, at: [KNOCK, w(7, 1), w(7, 2)], color: KINGC }], ["IN THE HUT?”", { y: 400, size: 92, at: [w(7, 3), w(7, 4), w(7, 5)], color: KINGC }]],
    [ls(8), ls(9), ["THAT'S AN MVP.", { y: 290, size: 96, at: [ls(8), w(8, 1), MVP], accent: ["MVP."], acc: "#3FB8AF" }], ["BUILD SMALL. LEARN. IMPROVE.", { y: 400, size: 64, at: [w(8, 3), SMALL, LEARN, IMPROVE] }]],
    [ls(9), CTA, ["“TWO GOLD COINS.”", { y: 290, size: 92, at: [ls(9), w(9, 1), COINS], color: WRENC }], ["“PER NIGHT.”", { y: 400, size: 92, at: [w(9, 3), w(9, 4)], color: WRENC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(10, 0)] }], ["“MVP”", { y: 450, size: 160, at: [w(10, 1)], color: "#3FB8AF" }], ["for the free launch checklist", { y: 550, size: 52, at: [w(10, 2), w(10, 3), w(10, 4), w(10, 5), w(10, 6)], color: "#555" }]],
  ],
  cam: [[0, 1.25, 560, 1170], [ls(1) - 0.2, 1.25, 560, 1170], [ls(1) + 0.3, 1.55, 330, 1150], [ls(3) - 0.2, 1.55, 330, 1150], [ls(3) + 0.4, 1.42, 800, 1120],
    [ls(4) - 0.2, 1.42, 800, 1120], [ls(4) + 0.3, 1.55, 340, 1150], [ls(5) - 0.2, 1.55, 340, 1150], [ls(5) + 0.35, 1.4, 830, 1110], [ls(6) - 0.15, 1.4, 830, 1110],
    [ls(6) + 0.45, 1.22, 560, 1160], [KNOCK - 0.3, 1.22, 560, 1160], [KNOCK + 0.2, 1.45, 700, 1130], [ls(8) - 0.2, 1.45, 700, 1130], [ls(8) + 0.3, 1.22, 560, 1160],
    [ls(9) - 0.2, 1.22, 560, 1160], [ls(9) + 0.3, 1.45, 700, 1130], [D, 1.5, 700, 1130]],
  render(t, { world: Wg, over }) {
    const snow = t < WINTER - 0.1 ? 0 : seg(t, WINTER - 0.1, WINTER + 1.2);
    Wd.land(Wg, { snow, t });
    // Wren's hut: a frame being hammered in the hook, built in line 3, then upgraded month by month
    const build = t < ls(3) ? 0.35 : Math.max(0.35, seg(t, BUILT - 0.1, ROOM + 0.1));
    Wd.hut(Wg, Object.assign({}, HUT, { t, build, wobble: t >= WOBBLY - 0.1 && t < WORKED ? 1 : 0, roof: E.outBack(seg(t, FIXED - 0.1, FIXED + 0.15)), fire: seg(t, FIRE - 0.1, FIRE + 0.3),
      window: seg(t, MONTH - 0.1, MONTH + 0.3), flowers: E.outBack(seg(t, BETTER - 0.2, BETTER + 0.15)), snow }));
    if (t >= LEAK - 0.3 && t < FIXED) Wd.drip(Wg, { x: HUT.x - 10, y: HUT.y - 250, t });
    [FIXED, FIRE, MONTH, BETTER].forEach((a) => { if (t > a && t < a + 0.6) FX.sparkle(Wg, { x: HUT.x, y: HUT.y - 180, k: seg(t, a, a + 0.6), r: 200, n: 8, s: 0.9 }); });
    // ---------------- the king (walks to the hut in winter)
    let kx = KG.x; if (t >= KNOCK - 0.6) kx = lerp(KG.x, 610, E.inOutSine(seg(t, KNOCK - 0.6, KNOCK - 0.1)));
    let kg = Object.assign({}, KG, Wd.KING, F.smug, { x: kx, look: [0.4, 0.4], armL: { x: -150, y: -40 }, armR: { x: 150, y: -40 } });
    if (t >= ls(1) && t < ls(2)) kg = Object.assign(kg, F.shout, { x: kx, armL: { x: -180, y: -260 }, armR: { x: 180, y: -260 }, handL: "open", handR: "open" });
    if (t >= ls(2) && t < ls(3)) kg = Object.assign(kg, F.think, { x: kx, look: [0, 0.9], armR: { x: 120, y: -70 } });
    if (t >= ls(3) && t < ls(4)) kg = Object.assign(kg, F.smug, { x: kx, look: [1, 0] });
    if (t >= ls(4) && t < ls(5)) kg = Object.assign(kg, { eyes: "half", lid: 0.4, mouth: "frown", look: [1, 0], armR: { x: 150, y: -230 } });
    if (t >= ls(5) && t < WINTER) kg = Object.assign(kg, F.think, { look: [0, 0.9] });
    if (t >= WINTER) kg = Object.assign(kg, F.worried, { look: [1, 0], armL: { x: -60, y: -120 }, armR: { x: 60, y: -120 }, blush: 0.9 });
    if (t >= KNOCK - 0.1 && t < KNOCK + 0.6) kg.armR = { x: 170, y: -230 + 30 * Math.abs(Math.sin((t - KNOCK) * 14)) };
    if (t >= COINS - 0.3 && t < CTA) kg = Object.assign(kg, F.sad, { armR: { x: lerp(150, 230, seg(t, COINS - 0.3, COINS + 0.1)), y: -120 } });
    if (t >= WINTER) kg.rot = Math.sin(t * 40) * 1.2;
    if ([1, 4, 7].some((i) => speaking(t, i))) { kg.mouth = t >= ls(1) && t < ls(2) ? "shout" : "o"; kg.open = talkOpen(t, 1); }
    if (blink(t, 0.3) && kg.eyes === "open") kg.eyes = "closed";
    // ---------------- Wren
    let wr = Object.assign({}, WR, Wd.WREN, F.happy, { look: [0.4, 0], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
    const hammering = (t < ls(1)) || (t >= BUILT - 0.3 && t < ROOM + 0.3);
    if (hammering) wr = Object.assign(wr, F.calm, { look: [0.8, -0.2], armR: { x: 200, y: -180 + 60 * Math.abs(Math.sin(t * 12)) } });
    if (t >= WOBBLY && t < WORKED + 0.3) wr = Object.assign(wr, F.worried, { look: [0.8, -0.5] });
    if (t >= WORKED && t < ls(4)) wr = Object.assign(wr, F.happy);
    if (t >= ls(4) && t < ls(5)) wr = Object.assign(wr, F.deadpan, { look: [-1, 0] });
    if (t >= ls(5) && t < WINTER) wr = Object.assign(wr, F.happy, { look: [0.8, -0.4], armR: { x: 200, y: -220 } });
    if (t >= COLD && t < FIRE) wr = Object.assign(wr, F.worried, { armL: { x: -60, y: -110 }, armR: { x: 60, y: -110 } });
    if (t >= WINTER && t < KNOCK) wr = Object.assign(wr, F.calm, { look: [0.6, 0] });
    if (t >= KNOCK) wr = Object.assign(wr, F.smug, { look: [-1, 0] });
    if (t >= ls(9)) wr = Object.assign(wr, F.smug, { look: [-1, 0], armL: { x: -210, y: -110 }, handL: "open" });
    if (speaking(t, 9)) { wr.mouth = "o"; wr.open = talkOpen(t, 2) * 0.8; }
    if (blink(t, 1.4) && wr.eyes === "open") wr.eyes = "closed";
    // draw order: Wren (behind fence), king, the king's things
    P.draw(Wg, wr);
    if (hammering) { const h = P.hand(wr, "R"); Wd.hammer(Wg, { x: h[0], y: h[1] - 30, s: 0.8, rot: -30 + 40 * Math.abs(Math.sin(t * 12)) }); }
    P.draw(Wg, kg);
    if (t >= ls(4) - 0.2 && t < ls(5)) { const h = P.hand(kg, "R"); Wd.spyglass(Wg, { x: h[0] - 30, y: h[1] + 10, s: 0.8, rot: -8 }); }
    // the king's table + blueprint + plan pile (the king leaves it in winter; it flaps in the wind)
    Wd.table(Wg, { snow });
    const open = t < ls(1) ? 1 : E.outBack(seg(t, ls(1) - 0.1, ls(1) + 0.3)), items = t < ls(1) ? 4 : [TOWERS, GATES, MOAT, SWANS].filter((x) => t >= x).length;
    Wd.plans(Wg, { x: 210, y: 1290, s: 0.5, open, items, flap: t >= WINTER ? 1 : 0, t });
    Wd.pile(Wg, { x: 430, y: 1395, n: t < Y1 ? 1 : Math.min(7, Math.floor(lerp(1, 7.99, seg(t, Y1, MORE + 0.3)))), s: 0.4 });
    Wd.fence(Wg, { snow });
    Wd.snowfall(Wg, { t, k: snow });
    // the two coins, from the king to Wren
    if (t >= COINS - 0.3) { const k = seg(t, COINS - 0.2, COINS + 0.3), hk = P.hand(kg, "R"), hw = P.hand(wr, "L");
      for (let i = 0; i < 2; i++) Kit.coin(Wg, { x: lerp(hk[0], hw[0], k) + i * 22, y: lerp(hk[1], hw[1] - 20, k) + arc(k, 90) - i * 16, s: 0.2, sym: "", spin: k < 1 ? k * 2 : 0 }); }
    // ---------------- over: the MVP card
    if (t >= ls(8) - 0.15 && t < ls(9) - 0.1) { const k = Math.min(E.outBack(seg(t, ls(8) - 0.15, ls(8) + 0.15)), 1 - seg(t, ls(9) - 0.4, ls(9) - 0.1));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#1d1b1a", opacity: 0.35 * k }, over);
      Wd.mvp(over, { x: 540, y: 1050, s: 1.0, k, stage: (t >= MVP ? 1 : 0) + (t >= LEARN ? 1 : 0) + (t >= IMPROVE - 0.1 ? 1 : 0), t }); }
    const sh = [shake(t, FIXED, FIXED + 0.4, 16, 3), shake(t, KNOCK, KNOCK + 0.5, 6, 5)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: snow > 0.5 ? "#C9D3DE" : "#BFE3F5" };
  },
});
