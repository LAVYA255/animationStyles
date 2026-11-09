/* World 18 · Ancient Egypt · "The pyramid builders were paid in beer" (50.9 s). Origin / incentives (you get what you pay for).
   Hook: the Worker sipping beer through a straw, four jars a day. Overseer Nakht: work is slow (a snail hauls a block).
   "Faster! For the glory of the Pharaoh!" / "Glory doesn't fill my cup, boss." Nakht: one extra beer per block -> blocks
   fly, up up up -> every one crooked -> the pyramid leans: "Why is my damn pyramid leaning?!" / "You paid for blocks, boss."
   Card: pay for what you want. New rule: straight blocks only (papyrus + plumb line) -> it straightens -> still standing
   4,500 years later (capstone, the one flash, the drop, sun time-lapse, a tourist selfie). Tag: build another? For the beer.
   Font: Bungee. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const NAC = "#2F6FB0", WOC = "#B0602E", GOLDC = "#E9B400";
const BEER0 = w(0, 6), FOUR = w(0, 8), SLOW = w(1, 8), FASTER = ls(2), CUP = w(3, 4), EXTRA = w(4, 6), UPS = [w(5, 3), w(5, 4), w(5, 5)];
const SINGLE = w(6, 2), CROOKED = w(6, 5), LEAN = w(7, 5), NOT = w(8, 5), RULE = w(10, 1), STRAIGHT = w(10, 4), STAND = w(11, 4), YEARS = w(11, 7), CTA = ls(13);
const NA = { x: 300, y: 1420 }, WO = { x: 800, y: 1420 };

WK.film({
  font: "Bungee",
  flashAt: STAND,
  captions: [
    [0, w(1, 1), ["PYRAMID BUILDERS WERE PAID IN BEER.", { y: 290, size: 70, at: [w(0, 1), w(0, 2), w(0, 3), w(0, 4), w(0, 5), BEER0], accent: ["BEER."], acc: WOC }], ["ABOUT 4 LITERS A DAY.", { y: 392, size: 80, at: [w(0, 7), FOUR, w(0, 9), w(0, 10), w(0, 11)] }], "hard"],
    [w(1, 1), ls(2), ["OVERSEER NAKHT HAD A PROBLEM.", { y: 290, size: 74, at: [w(1, 1) + 0.05, w(1, 1) + 0.1, w(1, 2), w(1, 3), w(1, 4)] }], ["THE WORK WAS SLOW.", { y: 392, size: 84, at: [w(1, 5), w(1, 6), w(1, 7), SLOW] }], "hard"],
    [ls(2), ls(3), ["“FASTER!”", { y: 290, size: 120, at: [FASTER], color: NAC }], ["“FOR THE GLORY OF THE PHARAOH!”", { y: 410, size: 74, at: [w(2, 1), w(2, 2), w(2, 3), w(2, 4), w(2, 5), w(2, 6)], color: NAC }]],
    [ls(3), ls(4), ["“GLORY DOESN'T FILL", { y: 290, size: 90, at: [w(3, 0), w(3, 1), w(3, 2)], color: WOC }], ["MY CUP, BOSS.”", { y: 400, size: 96, at: [w(3, 3), CUP, w(3, 5)], color: WOC }], "hard"],
    [ls(4), w(5, 1), ["“FINE. EVERY BLOCK YOU PLACE...”", { y: 290, size: 72, at: [w(4, 0), w(4, 1), w(4, 2), w(4, 3), w(4, 4)], color: NAC }], ["“ONE EXTRA BEER.”", { y: 400, size: 100, at: [w(4, 5), EXTRA, w(4, 7)], color: NAC, accent: ["BEER.”"], acc: WOC }], "hard"],
    [w(5, 1), SINGLE, ["BLOCKS STARTED FLYING.", { y: 290, size: 90, at: [w(5, 1) + 0.05, w(5, 1) + 0.1, w(5, 2)] }], ["UP! UP! UP!", { y: 410, size: 120, at: UPS, color: GOLDC }], "hard"],
    [SINGLE, ls(7), ["AND EVERY SINGLE ONE", { y: 290, size: 92, at: [SINGLE + 0.05, SINGLE + 0.1, SINGLE + 0.15, w(6, 3)] }], ["WAS CROOKED.", { y: 410, size: 112, at: [w(6, 4), CROOKED], accent: ["CROOKED."], acc: "#E5484D" }], "hard"],
    [ls(7), ls(8), ["“WHY IS MY DAMN PYRAMID", { y: 290, size: 84, at: [w(7, 0), w(7, 1), w(7, 2), w(7, 3), w(7, 4)], color: NAC }], ["LEANING?!”", { y: 410, size: 130, at: [LEAN], color: "#E5484D" }]],
    [ls(8), w(9, 2), ["“YOU PAID FOR BLOCKS, BOSS.”", { y: 290, size: 84, at: [w(8, 0), w(8, 1), w(8, 2), w(8, 3), w(8, 4)], color: WOC }], ["“NOT STRAIGHT ONES.”", { y: 400, size: 96, at: [NOT, w(8, 6), w(8, 7)], color: WOC }], "hard"],
    [w(9, 2), ls(10), ["YOU GET EXACTLY WHAT YOU PAY FOR.", { y: 290, size: 70, at: [w(9, 2) + 0.05, w(9, 2) + 0.1, w(9, 2) + 0.15, w(9, 3), w(9, 4), w(9, 5), w(9, 6)] }], ["PAY FOR WHAT YOU ACTUALLY WANT.", { y: 392, size: 72, at: [w(9, 8), w(9, 9), w(9, 10), w(9, 11), w(9, 12), w(9, 13)], accent: ["WANT."], acc: "#24857E" }], "hard"],
    [ls(10), ls(11), ["“NEW RULE:", { y: 290, size: 100, at: [w(10, 0), RULE], color: NAC }], ["BEER FOR STRAIGHT BLOCKS ONLY.”", { y: 400, size: 74, at: [w(10, 2), w(10, 3), STRAIGHT, w(10, 5), w(10, 6)], color: NAC }]],
    [ls(11), ls(12), ["THAT PYRAMID IS STILL STANDING.", { y: 290, size: 76, at: [w(11, 0), w(11, 1), w(11, 2), w(11, 3), STAND] }], ["4,500 YEARS LATER.", { y: 400, size: 104, at: [w(11, 5), YEARS, w(11, 8)], color: GOLDC }]],
    [ls(12), w(13, 1), ["“BOSS... CAN WE BUILD ANOTHER ONE?”", { y: 290, size: 70, at: [w(12, 0), w(12, 1), w(12, 2), w(12, 3), w(12, 4), w(12, 5)], color: WOC }], ["“FOR THE BEER?”", { y: 400, size: 108, at: [w(12, 6), w(12, 7), w(12, 8)], color: WOC }], "hard"],
    [w(13, 1), D + 1, ["COMMENT", { y: 300, size: 116, at: [w(13, 1) + 0.1] }], ["“PAY”", { y: 455, size: 160, at: [w(13, 1) + 0.3], color: GOLDC }], ["for the free incentive plan template", { y: 550, size: 46, at: [w(13, 2), w(13, 3), w(13, 4), w(13, 5), w(13, 6), w(13, 7)] }]],
  ],
  cam: [[0, 1.6, 820, 1060], [w(0, 7) - 0.2, 1.62, 820, 1060], [w(0, 7) + 0.4, 1.12, 540, 1010], [ls(2) - 0.1, 1.12, 540, 1010], [ls(2) + 0.25, 1.55, 320, 1030],
    [ls(3) - 0.1, 1.55, 320, 1030], [ls(3) + 0.25, 1.55, 790, 1030], [ls(4) - 0.1, 1.55, 790, 1030], [ls(4) + 0.25, 1.5, 360, 1010], [ls(5) - 0.1, 1.5, 360, 1010],
    [ls(5) + 0.35, 1.0, 560, 930], [ls(7) - 0.1, 1.0, 560, 930], [ls(7) + 0.25, 1.5, 330, 1030], [ls(8) - 0.1, 1.5, 330, 1030], [ls(8) + 0.25, 1.5, 790, 1030],
    [ls(9) - 0.1, 1.5, 790, 1030], [ls(9) + 0.3, 1.1, 540, 990], [ls(10) - 0.1, 1.1, 540, 990], [ls(10) + 0.25, 1.35, 420, 990], [STAND - 0.3, 1.35, 420, 990],
    [STAND + 0.1, 1.0, 560, 930], [ls(12) - 0.1, 1.0, 560, 930], [ls(12) + 0.3, 1.45, 700, 1030], [CTA + 0.2, 1.45, 700, 1030], [CTA + 0.7, 1.12, 540, 1010], [D, 1.15, 540, 1010]],
  render(t, { world: Wg, over }) {
    Wd.desert(Wg, { t, cycle: t >= w(11, 5) && t < w(11, 8) + 0.3 ? seg(t, w(11, 5), w(11, 8) + 0.3) * 2 : 0 });
    // the pyramid
    let layers = 3; UPS.forEach((u, i) => { if (t >= u - 0.4) layers = Math.max(layers, 3 + (i + 1) * 5 / 3 * seg(t, u - 0.4, u)); }); if (t >= ls(6)) layers = 8;
    let crooked = t < SINGLE ? 0 : E.inOutSine(seg(t, SINGLE, CROOKED)), lean = t < ls(7) ? 0 : 0.6 * E.inOutSine(seg(t, ls(7), LEAN + 0.2));
    if (t >= STRAIGHT) { const k = 1 - E.inOutSine(seg(t, STRAIGHT, ls(11) - 0.2)); crooked *= k; lean *= k; }
    Wd.pyramid(Wg, { x: 560, y: 1150, s: 1, layers, crooked, lean: lean + (t >= ls(7) && t < ls(10) ? Math.sin(t * 3) * 0.04 : 0), cap: t >= STAND - 0.1 ? E.outBack(seg(t, STAND - 0.1, STAND + 0.25)) : 0, glow: t >= STAND ? 1 - 0.5 * seg(t, STAND + 1, ls(12)) : 0 });
    if (t >= YEARS - 0.3) Wd.tourist(Wg, { x: 1010, y: 1170, s: 0.7, k: E.outBack(seg(t, YEARS - 0.3, YEARS)), t });
    if (t >= STRAIGHT - 0.2 && t < STAND) Wd.plumb(Wg, { x: 560, y: 640, len: 420, sw: Math.sin(t * 3) * 0.3 * (1 - seg(t, STRAIGHT, ls(11))) });
    // flying blocks (each one earns a beer)
    if (t >= ls(5) && t < ls(6) + 0.6) for (let i = 0; i < 7; i++) { const a = ls(5) + i * 0.4, k = seg(t, a, a + 0.8); if (k <= 0 || k >= 1) continue;
      Wd.block(Wg, { x: lerp(980, 400 + i * 50, k), y: lerp(1300, 820 + (i % 3) * 60, E.outQuad(k)) - arc(k, 260), s: 0.7, rot: k * 360 * (i % 2 ? 1 : -1) });
      if (k > 0.85) K.label(Wg, { x: 400 + i * 50, y: 760 + (i % 3) * 60, text: "+1 BEER", size: 30, k: 1, tone: "#F2C14E", rot: -6 }); }
    // ---------------- Nakht
    let na = Object.assign({ x: NA.x, y: NA.y + Math.sin(t * 1.3) * 4, s: 1.0 }, Wd.NAKHT, F.deadpan, { look: [1, 0] });
    if (t >= ls(2) && t < ls(3)) na = Object.assign(na, F.shout, { armR: { x: 160, y: -320 }, handR: "point" });
    if (t >= ls(3) && t < ls(4)) na = Object.assign(na, F.angry);
    if (t >= ls(4) && t < ls(5)) na = Object.assign(na, F.smug, { armR: { x: 200, y: -260 }, handR: "open" });
    if (t >= ls(5) && t < ls(6)) na = Object.assign(na, F.happy, { look: [0.6, -0.8] });
    if (t >= ls(6) && t < ls(8)) na = Object.assign(na, F.shock, { look: [0.6, -0.8], sweat: 1, armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" });
    if (t >= ls(8) && t < ls(10)) na = Object.assign(na, F.angry, { look: [1, 0] });
    if (t >= ls(10) && t < ls(11)) na = Object.assign(na, F.deadpan, { look: [1, 0], armR: { x: 190, y: -200 }, handR: "open" });
    if (t >= ls(11) && t < ls(12)) na = Object.assign(na, F.happy, { look: [0.6, -0.8] });
    if (t >= ls(12)) na = Object.assign(na, F.think, { look: [1, 0] }); if (t >= CTA + 0.3) na = Object.assign(na, F.smug);
    if ([2, 4, 7, 10].some((i) => speaking(t, i))) { na.mouth = speaking(t, 4) || speaking(t, 10) ? "flat" : "shout"; na.open = 0.3 + talkOpen(t, 1) * 0.5; }
    if (blink(t, 0.4) && na.eyes === "open") na.eyes = "closed";
    // ---------------- the Worker
    let wo = Object.assign({ x: WO.x, y: WO.y + Math.sin(t * 1.3 + 2) * 4, s: 1.0 }, Wd.WORKER, F.happy, { look: [-1, 0], armR: { x: 60, y: -230 }, handR: "fist" });
    if (t >= ls(1) && t < ls(2)) wo = Object.assign(wo, { eyes: "closed", mouth: "o", open: 0.2, armR: { x: 170, y: -10 } });
    if (t >= ls(2) && t < ls(4)) wo = Object.assign(wo, F.deadpan, { look: [-1, 0], armR: { x: 170, y: -10 } });
    if (t >= ls(3) && t < ls(4)) wo.armR = { x: 140, y: -260 }; // holds the empty cup up
    if (t >= EXTRA - 0.3 && t < ls(5)) wo = Object.assign(wo, F.shock, { look: [-1, 0], armR: { x: 170, y: -10 } });
    if (t >= ls(5) && t < ls(6)) wo = Object.assign(wo, F.shout, { look: [-0.6, -0.8], armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" });
    if (t >= ls(6) && t < ls(8)) wo = Object.assign(wo, F.calm, { look: [-1, 0], armR: { x: 60, y: -230 } });
    if (t >= ls(8) && t < ls(10)) wo = Object.assign(wo, F.smug, { look: [-1, 0], armR: { x: 60, y: -230 } });
    if (t >= ls(10) && t < ls(11)) wo = Object.assign(wo, F.worried, { look: [-1, 0], armR: { x: 170, y: -10 } });
    if (t >= ls(11)) wo = Object.assign(wo, F.happy, { look: [-0.6, -0.6], armR: { x: 60, y: -230 } });
    if (t >= ls(12)) wo = Object.assign(wo, F.happy, { look: [-1, 0] });
    if ([3, 8, 12].some((i) => speaking(t, i))) { wo.mouth = "flat"; wo.open = 0.2 + talkOpen(t, 2) * 0.5; }
    if (blink(t, 1.1) && wo.eyes === "open") wo.eyes = "closed";
    [na, wo].forEach((c) => P.draw(Wg, c));
    // beer in hands
    { const sip = wo.armR.y === -230; const h = P.hand(wo, "R"); if (sip || (t >= ls(3) && t < ls(4))) Wd.beer(Wg, { x: h[0] + 10, y: h[1] + (sip ? 40 : 30), s: 0.6, rot: t >= ls(3) && t < ls(4) ? 160 : -10, straw: t < ls(3) || t >= ls(4) ? 1 : 0 }); }
    if (t >= ls(4) && t < ls(5)) { const h = P.hand(na, "R"); Wd.beer(Wg, { x: h[0] + 10, y: h[1] + 40, s: 0.6 * E.outBack(seg(t, ls(4), ls(4) + 0.25)), straw: 0 }); if (t >= EXTRA) K.label(Wg, { x: h[0] + 40, y: h[1] - 110, text: "+1 BEER", size: 40, k: E.outBack(seg(t, EXTRA, EXTRA + 0.25)), tone: "#F2C14E", rot: 6 }); }
    // ---------------- ledge, beer jars, snail, papyrus
    Wd.ledge(Wg, {});
    if (t >= FOUR - 0.2 && t < ls(2)) [140, 230, 320, 410].forEach((jx, i) => Wd.beer(Wg, { x: jx + 160, y: 1405, s: 0.55, k: Math.min(E.outBack(seg(t, FOUR - 0.2 + i * 0.12, FOUR + 0.1 + i * 0.12)), 1 - seg(t, ls(2) - 0.3, ls(2))), straw: 0 }));
    if (t >= SLOW - 0.6 && t < ls(4)) Wd.snail(Wg, { x: lerp(1150, 650, seg(t, SLOW - 0.6, ls(4))), y: 1405, s: 0.75, t });
    if (t >= RULE - 0.1 && t < ls(11)) Wd.papyrus(Wg, { x: 560, y: 1300, s: 0.8, k: Math.min(E.outBack(seg(t, RULE - 0.1, RULE + 0.2)), 1 - seg(t, ls(11) - 0.3, ls(11))) });
    if (t >= STAND && t < STAND + 1.0) FX.sparkle(Wg, { x: 560, y: 800, k: seg(t, STAND, STAND + 1.0), r: 460, n: 16, s: 1.4 });
    // ---------------- over: pay-for card
    if (t >= ls(9) - 0.1 && t < ls(10)) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.1, ls(9) + 0.25)), 1 - seg(t, ls(10) - 0.3, ls(10))); Wd.payCard(over, { x: 540, y: 920, s: 1.0, k, good: seg(t, w(9, 8), w(9, 8) + 0.4) }); }
    const sh = [shake(t, STAND, STAND + 0.5, 18, 3), shake(t, LEAN, LEAN + 0.4, 14, 5), shake(t, FASTER, FASTER + 0.3, 8, 7)].concat(UPS.map((u, i) => shake(t, u, u + 0.2, 8, 9 + i))).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#FFD9A0" };
  },
});
