/* World 20 · Time travel · "She time travelled to meet her 25 year old self" (53.5 s). Emotional twist (start small, now).
   Hook: a clock portal opens in a small kitchen; Old Asha (75) steps out to meet Asha (25): "It's me. You. Fifty years later."
   "Did we open the bakery?!" -> "...No. We kept waiting to be ready." Someday notes on the fridge (course, savings, perfect
   recipe); the oven is cold. "Ready never came. Ready is a damn lie." / "So what do I do?" / "Bake one tray. Today." Notes
   crossed out, oven on: 12 cookies, 11 sold, then 100, then a shop (the one flash, the drop). Start-today card. Twist: Old Asha
   shimmers: the timeline changed, she's in a baker's apron: "Oh! I own a bakery now!" Tag: "Want a cookie?" -> CTA.
   Font: Caveat Brush. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const OLC = "#8A6A3E", ASC = "#7A5AC8", TE = "#24857E";
const OPEN = w(0, 4), FIFTY = w(1, 5), BAKERY = w(2, 7), NO = ls(3), READY = w(3, 6), COURSE = w(4, 3), SAVINGS = w(4, 6), RECIPE = w(4, 10);
const LIE = w(5, 7), WHAT = ls(6), TRAY = w(7, 2), TODAY = w(7, 3), TWELVE = w(8, 3), SOLD = w(8, 6), HUNDRED = w(8, 8), SHOP = w(8, 11);
const TODAY2 = w(9, 13), TWIST = ls(10), COOKIE = ls(11), CTA = ls(12);
const OA = { x: 300, y: 1420 }, YA = { x: 790, y: 1420 };

WK.film({
  font: "Caveat Brush",
  flashAt: SHOP,
  titleSlam: { text: "ASHA'S BAKERY", at: SHOP, until: ls(9) - 0.05, color: "#E5484D", size: 130, y: 330 },
  captions: [
    [0, ls(1), ["ASHA BUILT A TIME MACHINE...", { y: 290, size: 100, at: [w(0, 0), w(0, 1), w(0, 2), w(0, 3), OPEN] }], ["TO VISIT HERSELF AT 25.", { y: 400, size: 100, at: [w(0, 5), w(0, 6), w(0, 7), w(0, 8), w(0, 9)], accent: ["25."], acc: ASC }]],
    [ls(1), ls(2), ["“HI, SWEETHEART. IT'S ME.”", { y: 290, size: 100, at: [w(1, 0), w(1, 1), w(1, 2), w(1, 3)], color: OLC }], ["“YOU. FIFTY YEARS LATER.”", { y: 400, size: 100, at: [w(1, 4), FIFTY, w(1, 6), w(1, 7)], color: OLC }]],
    [ls(2), ls(3), ["“NO WAY!", { y: 290, size: 120, at: [w(2, 0), w(2, 1)], color: ASC }], ["SO... DID WE OPEN THE BAKERY?!”", { y: 410, size: 92, at: [w(2, 2), w(2, 3), w(2, 4), w(2, 5), w(2, 6), BAKERY], color: ASC }]],
    [ls(3), ls(4), ["“...NO.”", { y: 290, size: 130, at: [NO], color: OLC }], ["“WE KEPT WAITING TO BE READY.”", { y: 410, size: 92, at: [w(3, 1), w(3, 2), w(3, 3), w(3, 4), w(3, 5), READY], color: OLC }]],
    [ls(4), ls(5), ["READY AFTER THE COURSE.", { y: 290, size: 100, at: [w(4, 0), w(4, 1), w(4, 2), COURSE] }], ["AFTER THE SAVINGS. AFTER THE PERFECT RECIPE.", { y: 400, size: 76, at: [w(4, 4), w(4, 5), SAVINGS, w(4, 7), w(4, 8), w(4, 9), RECIPE] }]],
    [ls(5), ls(6), ["“READY NEVER CAME.", { y: 290, size: 110, at: [w(5, 0), w(5, 1), w(5, 2)], color: OLC }], ["READY IS A DAMN LIE.”", { y: 410, size: 110, at: [w(5, 3), w(5, 4), w(5, 5), w(5, 6), LIE], color: OLC, accent: ["LIE.”"], acc: "#E5484D" }]],
    [ls(6), ls(7), ["“SO... WHAT DO I DO?”", { y: 320, size: 120, at: [WHAT, w(6, 1), w(6, 2), w(6, 3), w(6, 4)], color: ASC }]],
    [ls(7), ls(8), ["“BAKE ONE TRAY. TODAY.", { y: 290, size: 110, at: [w(7, 0), w(7, 1), TRAY, TODAY], color: OLC, accent: ["TODAY."], acc: TE }], ["SELL IT TO YOUR NEIGHBORS.”", { y: 410, size: 96, at: [w(7, 4), w(7, 5), w(7, 6), w(7, 7), w(7, 8)], color: OLC }]],
    [ls(8), SHOP - 0.12, ["SO SHE DID.", { y: 290, size: 110, at: [w(8, 0), w(8, 1), w(8, 2)] }], ["12 COOKIES. 11 SOLD. THEN 100.", { y: 410, size: 92, at: [TWELVE, w(8, 4), w(8, 5), SOLD, w(8, 7), HUNDRED], accent: ["SOLD."], acc: TE }], "hard"],
    [ls(9), w(10, 1), ["THE BEST TIME TO START WAS YEARS AGO.", { y: 290, size: 84, at: [w(9, 0), w(9, 1), w(9, 2), w(9, 3), w(9, 4), w(9, 5), w(9, 6), w(9, 7)] }], ["THE SECOND BEST TIME IS TODAY.", { y: 400, size: 92, at: [w(9, 8), w(9, 9), w(9, 10), w(9, 11), w(9, 12), TODAY2], accent: ["TODAY."], acc: TE }], "hard"],
    [w(10, 1), ls(11), ["“OH!", { y: 290, size: 130, at: [w(10, 1) + 0.03], color: OLC }], ["I OWN A BAKERY NOW!”", { y: 410, size: 110, at: [w(10, 1) + 0.1, w(10, 2), w(10, 3), w(10, 4), w(10, 5)], color: OLC, accent: ["BAKERY"], acc: "#E5484D" }]],
    [ls(11), w(12, 1), ["“WANT A COOKIE?”", { y: 320, size: 130, at: [COOKIE, w(11, 1)], color: ASC }]],
    [w(12, 1), D + 1, ["COMMENT", { y: 300, size: 124, at: [w(12, 1) + 0.1] }], ["“START”", { y: 455, size: 170, at: [w(12, 1) + 0.3], color: TE }], ["for the free first-week launch plan", { y: 555, size: 56, at: [w(12, 2), w(12, 3), w(12, 4), w(12, 5), w(12, 6), w(12, 7), w(12, 8)] }]],
  ],
  cam: [[0, 1.4, 330, 1080], [w(0, 5) - 0.2, 1.42, 330, 1080], [w(0, 5) + 0.4, 1.12, 540, 1030], [ls(1) - 0.1, 1.12, 540, 1030], [ls(1) + 0.25, 1.5, 360, 1050],
    [ls(2) - 0.1, 1.5, 360, 1050], [ls(2) + 0.25, 1.5, 760, 1050], [ls(3) - 0.1, 1.5, 760, 1050], [ls(3) + 0.2, 1.6, 340, 1050], [ls(4) - 0.1, 1.6, 340, 1050],
    [ls(4) + 0.3, 1.25, 300, 990], [ls(5) - 0.1, 1.25, 300, 990], [ls(5) + 0.25, 1.6, 340, 1050], [ls(6) - 0.1, 1.6, 340, 1050], [ls(6) + 0.25, 1.6, 760, 1050],
    [ls(7) - 0.1, 1.6, 760, 1050], [ls(7) + 0.25, 1.5, 360, 1050], [TODAY - 0.1, 1.5, 360, 1050], [TODAY + 0.25, 1.12, 580, 1010], [ls(8) - 0.1, 1.12, 580, 1010],
    [ls(8) + 0.3, 1.4, 600, 1180], [SHOP - 0.2, 1.42, 600, 1180], [SHOP + 0.2, 1.12, 540, 1030], [TWIST - 0.1, 1.12, 540, 1030], [TWIST + 0.25, 1.45, 340, 1030],
    [ls(11) - 0.1, 1.45, 340, 1030], [ls(11) + 0.3, 1.25, 540, 1080], [CTA + 0.3, 1.25, 540, 1080], [CTA + 0.8, 1.12, 540, 1030], [D, 1.15, 540, 1030]],
  render(t, { world: Wg, over }) {
    const started = t < TODAY ? 0 : seg(t, TODAY, TODAY + 0.6), oven = t < TODAY ? 0 : seg(t, TODAY, TODAY + 0.5);
    const notes = t < COURSE - 0.1 ? 0 : (t < SAVINGS - 0.1 ? 1 / 3 + 0.0 * 0 : t < RECIPE - 0.1 ? 2 / 3 : 1) * 1.0 + (t < COURSE - 0.1 ? 0 : 0);
    Wd.kitchen(Wg, { t, oven, notes: Math.max(notes, t >= COURSE - 0.1 ? seg(t, COURSE - 0.1, COURSE + 0.2) / 3 : 0), started, warm: t >= TODAY ? seg(t, TODAY, TODAY + 1) : 0 });
    // the portal (opens in the hook, flickers on "No", fades)
    const pk = t < 0.1 ? 0 : t < ls(2) ? E.outBack(seg(t, 0.1, 0.6)) * (1 - seg(t, ls(1) + 1.5, ls(2))) : 0;
    Wd.portal(Wg, { x: OA.x, y: 1060, s: 1.0, k: pk, t });
    if (t >= NO && t < NO + 0.6) Wd.shimmer(Wg, { x: OA.x, y: 1150, k: 1 - seg(t, NO, NO + 0.6), t });
    // ---------------- Old Asha
    const step = t < 0.6 ? 0 : E.outQuad(seg(t, 0.6, 2.0));
    let oa = Object.assign({ x: OA.x, y: OA.y + (1 - step) * 140 + Math.sin(t * 1.2) * 3, s: 1.0 * lerp(0.8, 1, step) }, Wd.OLD, F.calm, { look: [1, 0] });
    if (t >= ls(1) && t < ls(3)) oa = Object.assign(oa, F.happy, { look: [1, 0], armR: { x: 200, y: -160 }, handR: "open" });
    if (t >= ls(3) && t < ls(7)) oa = Object.assign(oa, F.sad, { look: [1, 0.4] });
    if (t >= ls(5) && t < ls(6)) oa = Object.assign(oa, { tear: 1 });
    if (t >= ls(7) && t < ls(8)) oa = Object.assign(oa, F.calm, { look: [1, 0], armR: { x: 220, y: -220 }, handR: "point" });
    if (t >= ls(8) && t < TWIST) oa = Object.assign(oa, F.happy, { look: [1, 0.3] });
    if (t >= TWIST) oa = Object.assign(oa, t < w(10, 1) ? F.shock : F.happy, { look: [0, 0.9], armL: { x: -150, y: -250 }, handL: "open" });
    if (t >= COOKIE) oa = Object.assign(oa, F.happy, { look: [1, 0], armR: { x: 230, y: -150 }, handR: "open" });
    if ([1, 3, 5, 7, 10].some((i) => speaking(t, i))) { oa.mouth = speaking(t, 10) ? "o" : "flat"; oa.open = talkOpen(t, 1) * 0.55; }
    if (blink(t, 0.4) && oa.eyes === "open") oa.eyes = "closed";
    P.draw(Wg, oa); if (t >= TWIST + 0.3) Wd.apron(Wg, { c: oa, k: seg(t, TWIST + 0.3, TWIST + 0.6) });
    if (t >= TWIST - 0.1 && t < TWIST + 1.2) Wd.shimmer(Wg, { x: OA.x, y: 1150, k: Math.min(1, seg(t, TWIST - 0.1, TWIST + 0.2)) * (1 - seg(t, TWIST + 0.8, TWIST + 1.2)), t });
    // ---------------- Asha (25)
    let ya = Object.assign({ x: YA.x, y: YA.y + Math.sin(t * 1.3 + 2) * 4, s: 1.0 }, Wd.ASHA, F.shock, { look: [-1, 0] });
    if (t >= ls(2) && t < ls(3)) ya = Object.assign(ya, F.happy, { look: [-1, 0], armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" });
    if (t >= ls(3) && t < ls(7)) ya = Object.assign(ya, F.sad, { look: [-1, 0.3] });
    if (t >= ls(7) && t < ls(8)) ya = Object.assign(ya, F.worried, { look: [-1, 0] });
    if (t >= ls(8) && t < TWIST) ya = Object.assign(ya, F.happy, { look: [-0.6, 0.8], armL: { x: -180, y: -40 }, handL: "open" });
    if (t >= TWIST && t < COOKIE) ya = Object.assign(ya, F.shock, { look: [-1, 0] });
    if (t >= COOKIE) ya = Object.assign(ya, F.happy, { look: [-1, 0], armL: { x: -230, y: -170 }, handL: "open" });
    if (speaking(t, 2) || speaking(t, 6) || speaking(t, 11)) { ya.mouth = "o"; ya.open = talkOpen(t, 2) * 0.6; }
    if (blink(t, 1.1) && ya.eyes === "open") ya.eyes = "closed";
    P.draw(Wg, ya);
    if (t >= COOKIE) { const h = P.hand(ya, "L"); Wd.cookie(Wg, { x: lerp(h[0], OA.x + 200, seg(t, w(11, 1), w(11, 1) + 0.6)), y: h[1] - 10, s: 1.1 }); }
    // ---------------- counter + tray of cookies
    Wd.counter(Wg, {});
    if (t >= TWELVE - 0.1 && t < ls(9)) { const left = t < SOLD ? 12 : 1; Wd.tray(Wg, { x: 560, y: 1405, s: 1.1, k: Math.min(E.outBack(seg(t, TWELVE - 0.1, TWELVE + 0.2)), 1 - seg(t, ls(9) - 0.3, ls(9))), left, t });
      if (t >= SOLD - 0.05 && t < SOLD + 0.8) FX.sparkle(Wg, { x: 560, y: 1330, k: seg(t, SOLD, SOLD + 0.8), r: 200, n: 10, s: 0.8 });
      if (t >= SOLD) K.label(Wg, { x: 720, y: 1260, text: "11 SOLD", size: 44, k: E.outBack(seg(t, SOLD, SOLD + 0.25)), tone: "#FFE27A", rot: 6 }); }
    if (t >= TWIST + 0.4 && t < CTA + 2) { const k = E.outBack(seg(t, TWIST + 0.4, TWIST + 0.8)); K.label(Wg, { x: 560, y: 820, text: "ASHA'S BAKERY · SINCE 2026", size: 40, k, tone: "#FFF3D6", rot: -2 }); }
    // ---------------- over: counter, bakery, today card
    if (t >= HUNDRED - 0.1 && t < SHOP) { const k = Math.min(E.outBack(seg(t, HUNDRED - 0.1, HUNDRED + 0.2)), 1 - seg(t, SHOP - 0.2, SHOP)); K.counter(over, { x: 540, y: 600, s: 1.2 * k, n: lerp(12, 100, seg(t, HUNDRED, HUNDRED + 0.6)), label: "COOKIES SOLD" }); }
    if (t >= SHOP - 0.05 && t < ls(9)) { const k = Math.min(E.outBack(seg(t, SHOP - 0.05, SHOP + 0.25)), 1 - seg(t, ls(9) - 0.25, ls(9))); Wd.shop(over, { x: 540, y: 960, s: 1.0, k, t }); }
    if (t >= ls(9) - 0.05 && t < TWIST) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.05, ls(9) + 0.25)), 1 - seg(t, TWIST - 0.3, TWIST)); Wd.todayCard(over, { x: 540, y: 930, s: 1.0, k, circle: E.outBack(seg(t, TODAY2 - 0.1, TODAY2 + 0.3)) }); }
    const sh = [shake(t, SHOP, SHOP + 0.5, 16, 3), shake(t, TWIST, TWIST + 0.4, 10, 5), shake(t, BAKERY, BAKERY + 0.25, 6, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#E8E1F2" };
  },
});
