/* World 14 · Noir city · "Customers were vanishing from this shop" (56.6 s). Twist / detective (funnel friction).
   Hook: rainy street, BENNY'S neon, shoppers walk in and vanish in a poof; Detective Vera in the foreground. Benny panics:
   they fill the cart and they're gone. Vera tails one shopper down the checkout corridor: shop fine, cart fine, create an
   account, confirm email, confirm password -> "I'm out." (poof). The killer: the CONFIRM PASSWORD step in a police lineup
   (the one flash, the drop). 1 in 5 quit at forced sign-ups (Baymard). Every extra step is a leak: cut it. Guest checkout
   -> case closed, the rain stops, the register rings. Tag: "how do I pay you?" -> "First... create an account." -> CTA. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const VEC = "#C9B48A", BEC = "#9AA0A8", RED = Wd.RED;
const VAN = w(0, 2), NIGHT0 = w(0, 6), WALK = w(1, 1), FILL = w(1, 4), GONE = w(1, 11);
const SHOP = w(2, 5), CART = w(2, 8), ACCT = w(3, 1), EMAIL = w(3, 4), PASS = w(4, 2), OUT = w(5, 3), POOF = OUT + 0.25;
const KILLER = w(6, 4), FIVE = w(7, 9), LEAK = w(8, 5), CUT = w(8, 8), GUEST = w(9, 1), CLOSED = w(10, 1);
const PAY = w(11, 4), FIRST = ls(12), CREATE = w(12, 1), CTA = ls(13);
const SX = 540, SP = 700; // corridor station x = SX + i*SP
// the shopper's walk down the corridor
const WALKK = [[ls(2), 230], [w(2, 4) - 0.3, SX], [w(2, 7) - 0.4, SX], [CART - 0.1, SX + SP], [ls(3) - 0.3, SX + SP], [ACCT, SX + 2 * SP], [w(3, 4) - 0.5, SX + 2 * SP], [EMAIL, SX + 3 * SP], [ls(4), SX + 3 * SP], [PASS, SX + 4 * SP - 60]];
const shopperX = (t) => { if (t <= WALKK[0][0]) return WALKK[0][1]; for (let i = 1; i < WALKK.length; i++) if (t < WALKK[i][0]) return lerp(WALKK[i - 1][1], WALKK[i][1], E.inOutSine(seg(t, WALKK[i - 1][0], WALKK[i][0]))); return WALKK[WALKK.length - 1][1]; };
const walking = (t) => WALKK.some((k, i) => i > 0 && t > WALKK[i - 1][0] && t < k[0] && k[1] !== WALKK[i - 1][1]);
const veraX = (t) => t < POOF ? shopperX(t) - 340 : lerp(shopperX(POOF) - 340, SX + 4 * SP - 380, E.inOutSine(seg(t, POOF + 0.2, KILLER - 0.3)));
// camera: street, shop, follow-cam down the corridor, killer push, cards, shop again
const cam = [[0, 1.15, 600, 1000], [ls(1) - 0.1, 1.25, 640, 1020], [ls(1), 1.2, 520, 1060, "cut"], [ls(2) - 0.1, 1.25, 520, 1060]];
for (let t = ls(2); t < POOF + 0.6; t += 0.35) cam.push([t, 1.3, shopperX(t) - 150, 930].concat(t === ls(2) ? ["cut"] : []));
cam.push([KILLER - 0.35, 1.3, SX + 4 * SP - 150, 930], [KILLER + 0.05, 1.5, SX + 4 * SP - 60, 900], [ls(7) - 0.2, 1.52, SX + 4 * SP - 60, 900], [ls(7) + 0.3, 1.15, SX + 4 * SP - 200, 960],
  [ls(9) - 0.05, 1.18, SX + 4 * SP - 200, 960], [ls(9), 1.2, 520, 1060, "cut"], [ls(12) - 0.1, 1.2, 520, 1060], [ls(12) + 0.3, 1.42, 470, 1090], [CTA - 0.1, 1.44, 470, 1090], [CTA + 0.5, 1.18, 520, 1060], [D, 1.2, 520, 1060]);

WK.film({
  font: "Special Elite", capStroke: "#121316",
  flashAt: KILLER,
  captions: [
    [0, ls(1), ["CUSTOMERS WERE VANISHING.", { y: 290, size: 80, at: [w(0, 0), w(0, 1), VAN], accent: ["VANISHING."], acc: RED, color: "#fff" }], ["WITHOUT A TRACE.", { y: 392, size: 84, at: [w(0, 6), w(0, 7), w(0, 8)], color: "#fff" }], "hard"],
    [ls(1), w(2, 1), ["“THEY FILL THE DAMN CART...”", { y: 290, size: 80, at: [w(1, 3), FILL, w(1, 5), w(1, 6), w(1, 7)], color: BEC }], ["“...AND THEN THEY'RE GONE!”", { y: 392, size: 76, at: [w(1, 8), w(1, 9), w(1, 10), GONE], color: BEC, accent: ["GONE!”"], acc: RED }], "hard"],
    [w(2, 1), w(2, 4), ["SO I FOLLOWED ONE.", { y: 300, size: 96, at: [w(2, 1) + 0.12, w(2, 1) + 0.2, w(2, 2) + 0.1, w(2, 3)], color: VEC }], "hard"],
    [w(2, 4), ls(3), ["THE SHOP: FINE.", { y: 290, size: 90, at: [w(2, 4) + 0.12, SHOP, w(2, 6)], color: VEC }], ["THE CART: FINE.", { y: 392, size: 90, at: [w(2, 7), CART, w(2, 9)], color: VEC }], "hard"],
    [ls(3), w(4, 1), ["CREATE AN ACCOUNT.", { y: 290, size: 90, at: [ACCT, w(3, 2), w(3, 3)], color: VEC }], ["CONFIRM YOUR EMAIL.", { y: 392, size: 90, at: [EMAIL, w(3, 5), w(3, 6)], color: VEC }], "hard"],
    [w(4, 1), ls(5), ["AND THEN...", { y: 290, size: 96, at: [w(4, 1) + 0.12, w(4, 1) + 0.22], color: VEC }], ["CONFIRM YOUR PASSWORD.", { y: 400, size: 86, at: [PASS, w(4, 3), w(4, 4)], accent: ["PASSWORD."], acc: RED, color: VEC }]],
    [ls(5), ls(6), ["“SCREW THIS.”", { y: 290, size: 104, at: [w(5, 0), w(5, 1)], color: "#C9CED6" }], ["“I'M OUT.”", { y: 410, size: 116, at: [w(5, 2), OUT], color: "#C9CED6" }]],
    [ls(6), w(7, 1), ["THERE IT WAS.", { y: 290, size: 96, at: [w(6, 0), w(6, 1), w(6, 2)], color: VEC }], ["THE KILLER.", { y: 410, size: 124, at: [w(6, 3), KILLER], accent: ["KILLER."], acc: "#FF6B6E", color: VEC }], "hard"],
    [w(7, 1), ls(8), ["FORCED SIGN-UPS ALONE", { y: 290, size: 84, at: [w(7, 1) + 0.1, w(7, 1) + 0.2, w(7, 3)], color: VEC }], ["SCARE OFF 1 IN 5 SHOPPERS.", { y: 392, size: 80, at: [w(7, 4), w(7, 5), w(7, 7), w(7, 8), FIVE, w(7, 10)], accent: ["1", "IN", "5"], acc: RED, color: VEC }]],
    [ls(8), GUEST, ["EVERY EXTRA STEP IS A LEAK.", { y: 290, size: 76, at: [w(8, 0), w(8, 1), w(8, 2), w(8, 3), w(8, 4), LEAK], accent: ["LEAK."], acc: "#7FD8F0", color: VEC }], ["FIND IT. CUT IT.", { y: 392, size: 100, at: [w(8, 6), w(8, 7), CUT, w(8, 9)], color: VEC, accent: ["CUT"], acc: RED }]],
    [GUEST, ls(10), ["“...A GUEST CHECKOUT?”", { y: 300, size: 92, at: [GUEST + 0.1, w(9, 2), w(9, 3)], color: BEC }]],
    [ls(10), ls(11), ["“CASE CLOSED.”", { y: 300, size: 120, at: [w(10, 0), CLOSED], color: VEC }]],
    [ls(11), ls(12), ["“DETECTIVE,", { y: 290, size: 96, at: [w(11, 0)], color: BEC }], ["HOW DO I PAY YOU?”", { y: 400, size: 92, at: [w(11, 1), w(11, 2), w(11, 3), PAY, w(11, 5)], color: BEC }]],
    [ls(12), w(13, 1), ["“FIRST...”", { y: 290, size: 100, at: [FIRST], color: VEC }], ["“CREATE AN ACCOUNT.”", { y: 400, size: 96, at: [CREATE, w(12, 2), w(12, 3)], color: VEC, accent: ["ACCOUNT.”"], acc: RED }]],
    [w(13, 1), D + 1, ["COMMENT", { y: 300, size: 116, at: [w(13, 1) + 0.1], color: "#fff" }], ["“FUNNEL”", { y: 450, size: 150, at: [w(13, 1) + 0.3], color: RED }], ["for the free leak checklist", { y: 550, size: 50, at: [w(13, 2), w(13, 3), w(13, 4), w(13, 5), w(13, 6)], color: "#ddd" }]],
  ],
  cam,
  render(t, { world: Wg, over }) {
    const set = t < ls(1) ? "street" : t < ls(2) ? "shop" : t < ls(9) ? "corridor" : "shop2";
    const bob = (i) => Math.sin(t * 1.4 + i * 2) * 4;
    if (set === "street") {
      Wd.street(Wg, { t });
      // passers-by walk into the shop and vanish
      [[0.2, VAN + 0.2], [2.6, NIGHT0 + 0.5]].forEach(([a, b], i) => { if (t < a || t > b + 0.9) return; const k = seg(t, a, b), x = lerp(-60, 840, k);
        if (t < b) P.draw(Wg, Object.assign({ x, y: 1450 + Math.abs(Math.sin(t * 7)) * -8, s: 0.6 }, Wd.GHOST, F.calm, { look: [1, 0] })); Wd.poof(Wg, { x: 840, y: 1270, k: seg(t, b, b + 0.8), s: 0.7 }); });
      el("rect", { x: -700, y: 1440, width: 2600, height: 30, fill: "#25282E" }, Wg);
      let ve = Object.assign({ x: 230, y: 1900, s: 1.3 }, Wd.VERA, F.deadpan, { look: [1, -0.3], armR: { x: 150, y: -330 }, handR: "fist" });
      if (blink(t, 0.4)) ve.eyes = "closed"; if (speaking(t, 0)) { ve.mouth = "flat"; ve.open = talkOpen(t, 1) * 0.4; }
      P.draw(Wg, ve); const h = P.hand(ve, "R"); Wd.magnifier(Wg, { x: h[0] + 10, y: h[1] - 70, s: 1.1, rot: 20 });
    }
    if (set === "shop" || set === "shop2") {
      const after = set === "shop2" && t >= CLOSED - 0.1, br = after ? seg(t, CLOSED - 0.1, CLOSED + 0.8) : 0;
      Wd.shop(Wg, { t, bright: br, rainK: 1 - br });
      let be = Object.assign({ x: set === "shop" ? 700 : 660, y: 1420 + bob(1), s: 1.0 }, Wd.BENNY, F.worried, { look: [-1, 0] });
      if (set === "shop") { if (t >= WALK) be.look = [-1, 0.2]; if (t >= GONE - 0.1) be = Object.assign(be, F.shock, { sweat: 1, armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" }); }
      if (set === "shop2") { be = Object.assign(be, F.think, { look: [-1, 0] }); if (t >= CLOSED) be = Object.assign(be, F.happy, { armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 } });
        if (t >= ls(11)) be = Object.assign(be, F.happy, { look: [-1, 0], armL: { x: -170, y: -10 }, armR: { x: 170, y: -10 } });
        if (t >= CREATE) be = Object.assign(be, t < CREATE + 0.6 ? F.shock : F.deadpan, { look: [-1, 0], sweat: 1 }); }
      if (speaking(t, 1) || speaking(t, 9) || speaking(t, 11)) { be.mouth = "o"; be.open = talkOpen(t, 2) * 0.7; }
      if (blink(t, 1.2) && be.eyes === "open") be.eyes = "closed";
      if (set === "shop") { // the shopper with a cart, then poof
        const sx = lerp(-150, 300, E.outQuad(seg(t, ls(1), WALK + 0.6))); if (t < GONE) { let sh = Object.assign({ x: sx, y: 1420 + Math.abs(Math.sin(t * 7)) * -6 * (t < WALK + 0.6 ? 1 : 0), s: 0.95 }, Wd.SHOPPER, F.happy, { look: [1, 0.3] });
          if (blink(t, 0.6)) sh.eyes = "closed"; P.draw(Wg, sh); }
        Wd.poof(Wg, { x: 300, y: 1200, k: seg(t, GONE, GONE + 0.8), s: 1 }); }
      let ve = null;
      if (set === "shop2") { ve = Object.assign({ x: 250, y: 1420 + bob(0), s: 1.0 }, Wd.VERA, F.deadpan, { look: [1, 0] }); if (t >= CLOSED) ve = Object.assign(ve, F.smug, { look: [1, 0] });
        if (t >= FIRST) ve = Object.assign(ve, F.deadpan, { look: [1, 0], armR: { x: 200, y: -240 }, handR: "open" }); if (t >= CTA) ve = Object.assign(ve, F.smug);
        if ([10, 12, 13].some((i) => speaking(t, i))) { ve.mouth = "flat"; ve.open = talkOpen(t, 3) * 0.4; } if (blink(t, 0.2) && ve.eyes === "open") ve.eyes = "closed"; }
      P.draw(Wg, be); if (ve) P.draw(Wg, ve);
      if (set === "shop") { const sx = lerp(-150, 300, E.outQuad(seg(t, ls(1), WALK + 0.6))); if (t < GONE) Wd.cart(Wg, { x: sx + 230, y: 1395, s: 0.9, items: t < FILL ? 0 : Math.min(3, 1 + Math.floor((t - FILL) * 4)) }); }
      Wd.counter(Wg, { t, ching: set === "shop2" && t >= CLOSED ? Math.min(1, seg(t, CLOSED, CLOSED + 0.5) + (t > CLOSED + 0.5 ? 1 : 0)) : 0 });
      if (ve && t >= FIRST - 0.1) { const h = P.hand(ve, "R"); Wd.phoneForm(Wg, { x: h[0] + 20, y: h[1] - 120, s: 0.95 * E.outBack(seg(t, CREATE - 0.25, CREATE + 0.05)), rot: 8 }); }
      if (set === "shop2" && t >= CLOSED && t < CLOSED + 0.9) FX.sparkle(Wg, { x: 900, y: 1200, k: seg(t, CLOSED, CLOSED + 0.9), r: 220, n: 9, s: 0.9 });
    }
    if (set === "corridor") {
      const sx = shopperX(t), lit = t < SHOP - 0.6 ? -1 : t < CART - 0.4 ? 0 : t < ACCT - 0.3 ? 1 : t < EMAIL - 0.3 ? 2 : t < PASS - 0.2 ? 3 : 4;
      const killer = t < KILLER - 0.15 ? 0 : E.outBack(seg(t, KILLER - 0.15, KILLER + 0.2)), dim = t >= ls(7) ? seg(t, ls(7), ls(7) + 0.4) : 0;
      Wd.corridor(Wg, { t, lit, killer, dim });
      const wk = walking(t) ? Math.abs(Math.sin(t * 8)) * -10 : 0;
      if (t < POOF) { let sh = Object.assign({ x: sx, y: 1420 + wk, s: 0.95 }, Wd.SHOPPER, F.happy, { look: [1, 0.2] });
        if (t >= ACCT) sh = Object.assign(sh, F.worried, { look: [1, 0] }); if (t >= EMAIL) sh = Object.assign(sh, { eyes: "half", lid: 0.4, mouth: "flat", tired: 1 });
        if (t >= PASS) sh = Object.assign(sh, { eyes: "half", lid: 0.7, mouth: "wavy", tired: 1, sweat: 1, look: [1, -0.2] }); if (t >= ls(5)) sh = Object.assign(sh, { eyes: "closed", mouth: "flat", look: [-1, 0] });
        if (speaking(t, 5)) { sh.mouth = "o"; sh.open = talkOpen(t, 4) * 0.4; } if (blink(t, 0.6) && sh.eyes === "open") sh.eyes = "closed"; P.draw(Wg, sh); }
      Wd.poof(Wg, { x: shopperX(POOF), y: 1200, k: seg(t, POOF, POOF + 0.8), s: 1 });
      let ve = Object.assign({ x: veraX(t), y: 1420 + (walking(t) ? Math.abs(Math.sin(t * 8 + 1)) * -10 : 0), s: 0.95 }, Wd.VERA, F.deadpan, { look: [1, -0.1], armR: { x: 170, y: -260 } });
      if (t >= POOF) ve = Object.assign(ve, F.shock, { look: [1, 0] }); if (t >= KILLER - 0.3) ve = Object.assign(ve, F.smug, { look: [1, -0.3], armR: { x: 200, y: -300 } });
      if (t >= ls(7)) ve = Object.assign(ve, F.deadpan, { look: [1, -0.3] });
      if ([2, 3, 4, 6, 7, 8].some((i) => speaking(t, i))) { ve.mouth = "flat"; ve.open = talkOpen(t, 5) * 0.4; } if (blink(t, 0.3) && ve.eyes === "open") ve.eyes = "closed";
      P.draw(Wg, ve); const h = P.hand(ve, "R"); Wd.magnifier(Wg, { x: h[0] + 10, y: h[1] - 70, s: 0.9, rot: 25 });
      if (t >= KILLER && t < KILLER + 0.9) FX.sparkle(Wg, { x: SX + 4 * SP, y: 940, k: seg(t, KILLER, KILLER + 0.9), r: 360, n: 10, s: 1.2 });
      if (killer > 0 && t < ls(7)) K.label(Wg, { x: SX + 4 * SP, y: 1330, text: "THE KILLER", size: 54, k: killer, tone: RED, ink: "#fff", rot: -6 });
      // cards
      if (t >= ls(7) && t < ls(8)) { const k = Math.min(E.outBack(seg(t, ls(7), ls(7) + 0.3)), 1 - seg(t, ls(8) - 0.3, ls(8))); Wd.oneInFive(over, { x: 540, y: 960, s: 1.0, k, leave: E.inOutSine(seg(t, FIVE, FIVE + 0.8)), t }); }
      if (t >= ls(8) && t < ls(9)) { const k = Math.min(E.outBack(seg(t, ls(8), ls(8) + 0.3)), 1 - seg(t, ls(9) - 0.25, ls(9))); Wd.leaks(over, { x: 540, y: 960, s: 1.0, k, cut: seg(t, CUT, CUT + 0.5), t }); }
    }
    const sh = [shake(t, KILLER, KILLER + 0.5, 20, 3), shake(t, GONE, GONE + 0.3, 10, 5), shake(t, CUT, CUT + 0.3, 10, 7), shake(t, CREATE, CREATE + 0.25, 8, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#2A2D33" };
  },
});
