/* World 19 · Volcano island · "This smoothie stand hooked a whole island without a single ad" (50.8 s). Parable (referral loops).
   Hook (flash-forward): the beach packed with islanders and canoes, all holding smoothies. Back to the start: Lani pays Koa to
   shout ads through a conch, all day ("SMOOTHIES!"; a crab runs away). One customer: Koa's mom. Then Mele tries one and drags
   her friends back: "You have to try this!" Lani: "Bring a friend, you both get one free!" (bulb + offer sign). One became
   two, four... the whole damn island (the one flash, the drop: the crowd floods in, canoes arrive). Referral-tree card ->
   Dropbox card (100K -> 4M in 15 months). Reward both sides. Tag: "Can I bring myself as a friend?" / "No, Koa." -> CTA.
   Font: Luckiest Guy. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const LAC = "#E0604F", KOC = "#2E8F88", MEC = "#C99A1E", TEAL = "#3FB8AF";
const PAST = ls(1), KOA1 = ls(2), GET = w(2, 1), CUST = w(3, 1), MOM = w(3, 3), TRIED = w(4, 3), RAN = w(4, 5), GUYS = ls(5);
const WAIT = ls(6), BRING = w(6, 1), FREE = w(6, 9), TWO = w(7, 2), FOUR = w(7, 5), ISLAND = w(7, 11), DROPBOX = w(8, 4), MILLION = w(8, 11), BOTH = w(9, 5);
const ASK = ls(10), NO = ls(11), CTA = ls(12);
const LA = { x: 640, y: 1420 }, KO = { x: 170, y: 1420 }, ME = { x: 960, y: 1420 };
// the crowd: 26 islanders, depth-sorted; who shows up when
const CROWD = []; for (let i = 0; i < 26; i++) { const r = MK.rng(i * 11 + 4); CROWD.push({ i, x: lerp(-70, 1150, r()), y: lerp(1590, 1920, r()), flip: r() > 0.5 ? 1 : -1 }); }
CROWD[0].x = 820; CROWD[0].y = 1640; CROWD[1].x = 980; CROWD[1].y = 1700; CROWD[2].x = 700; CROWD[2].y = 1760; CROWD[3].x = 1080; CROWD[3].y = 1800;
const CS = CROWD.slice().sort((a, b) => a.y - b.y);
const shown = (t, i) => { if (t < PAST) return 1; if (t < ls(7)) return 0; const n = t < TWO - 0.1 ? 1 : t < FOUR - 0.1 ? 2 : t < ISLAND - 0.1 ? 4 : 26; if (i >= n) return 0;
  const at = i < 1 ? ls(7) : i < 2 ? TWO - 0.1 : i < 4 ? FOUR - 0.1 + (i - 2) * 0.08 : ISLAND - 0.1 + (i - 4) * 0.03; return E.outBack(seg(t, at, at + 0.3)); };

WK.film({
  font: "Luckiest Guy",
  flashAt: ISLAND,
  captions: [
    [0, w(1, 2), ["THIS SMOOTHIE STAND HOOKED A WHOLE ISLAND.", { y: 290, size: 70, at: [w(0, 0), w(0, 1), w(0, 2), w(0, 3), w(0, 4), w(0, 5), w(0, 6)] }], ["WITHOUT A SINGLE AD.", { y: 400, size: 100, at: [w(0, 7), w(0, 8), w(0, 9), w(0, 10)], accent: ["AD."], acc: "#E5484D" }], "hard"],
    [w(1, 2), ls(2), ["AT FIRST, LANI PAID KOA", { y: 290, size: 88, at: [w(1, 2) + 0.05, w(1, 2) + 0.1, w(1, 2) + 0.15, w(1, 3), w(1, 4)] }], ["TO SHOUT ADS. ALL DAY.", { y: 400, size: 88, at: [w(1, 5), w(1, 6), w(1, 7), w(1, 8), w(1, 9)] }]],
    [ls(2), ls(3), ["“SMOOTHIES!", { y: 290, size: 120, at: [KOA1], color: KOC }], ["GET YOUR SMOOTHIES!”", { y: 410, size: 96, at: [GET, w(2, 2), w(2, 3)], color: KOC }]],
    [ls(3), w(4, 2), ["ONE CUSTOMER.", { y: 290, size: 108, at: [w(3, 0), CUST] }], ["KOA'S MOM.", { y: 410, size: 120, at: [w(3, 2), MOM], color: "#9A6AD8" }], "hard"],
    [w(4, 2), w(5, 1), ["THEN MELE TRIED ONE...", { y: 290, size: 96, at: [w(4, 2) + 0.03, w(4, 2) + 0.06, w(4, 2) + 0.09, TRIED] }], ["AND RAN TO GET HER FRIENDS.", { y: 400, size: 84, at: [w(4, 4), RAN, w(4, 6), w(4, 7), w(4, 8), w(4, 9)] }], "hard"],
    [w(5, 1), BRING, ["“GUYS! YOU HAVE TO TRY THIS!”", { y: 320, size: 88, at: [w(5, 1) + 0.05, w(5, 1) + 0.1, w(5, 2), w(5, 3), w(5, 4), w(5, 5)], color: MEC }], "hard"],
    [BRING, ls(7), ["“WAIT!”", { y: 290, size: 120, at: [BRING + 0.03], color: LAC }], ["“BRING A FRIEND, YOU BOTH GET ONE FREE!”", { y: 410, size: 70, at: [BRING + 0.1, w(6, 2), w(6, 3), w(6, 5), w(6, 6), w(6, 7), w(6, 8), FREE], color: LAC, accent: ["BOTH"], acc: TEAL }]],
    [ls(7), w(8, 2), ["1 BECAME 2. 2 BECAME 4.", { y: 290, size: 100, at: [w(7, 0), w(7, 1), TWO, w(7, 3), w(7, 4), FOUR] }], ["4 BECAME THE WHOLE DAMN ISLAND.", { y: 410, size: 80, at: [w(7, 6), w(7, 7), w(7, 8), w(7, 9), w(7, 10), ISLAND], accent: ["ISLAND."], acc: TEAL }], "hard"],
    [w(8, 2), w(8, 5), ["THAT'S A REFERRAL LOOP.", { y: 320, size: 100, at: [w(8, 2) + 0.03, w(8, 2) + 0.06, w(8, 2) + 0.09, w(8, 3)], accent: ["REFERRAL"], acc: TEAL }], "hard"],
    [w(8, 5), ls(9), ["DROPBOX: 100K → 4M USERS", { y: 290, size: 84, at: [w(8, 5) + 0.05, w(8, 7), w(8, 10), MILLION, w(8, 12)], color: "#2F6FB0" }], ["IN 15 MONTHS.", { y: 400, size: 100, at: [w(8, 13), w(8, 14), w(8, 15)] }]],
    [ls(9), ls(10), ["MAKE CUSTOMERS YOUR MARKETERS.", { y: 290, size: 80, at: [w(9, 0), w(9, 1), w(9, 2), w(9, 3)] }], ["REWARD BOTH SIDES.", { y: 400, size: 104, at: [w(9, 4), BOTH, w(9, 6)], color: TEAL }], "hard"],
    [ls(10), ls(11), ["“CAN I BRING MYSELF", { y: 290, size: 100, at: [ASK, w(10, 1), w(10, 2), w(10, 3)], color: KOC }], ["AS A FRIEND?”", { y: 410, size: 108, at: [w(10, 4), w(10, 5), w(10, 6)], color: KOC }]],
    [ls(11), w(12, 1), ["“NO, KOA.”", { y: 320, size: 140, at: [NO, w(11, 1)], color: LAC }]],
    [w(12, 1), D + 1, ["COMMENT", { y: 300, size: 116, at: [w(12, 1) + 0.1] }], ["“INVITE”", { y: 455, size: 150, at: [w(12, 1) + 0.3], color: TEAL }], ["for the free referral program template", { y: 550, size: 48, at: [w(12, 2), w(12, 3), w(12, 4), w(12, 5), w(12, 6), w(12, 7)] }]],
  ],
  cam: [[0, 1.05, 540, 1300], [PAST - 0.05, 1.08, 540, 1300], [PAST, 1.4, 330, 1200, "cut"], [ls(2) - 0.1, 1.42, 330, 1200], [ls(2) + 0.2, 1.55, 250, 1180],
    [ls(3) - 0.1, 1.55, 250, 1180], [ls(3) + 0.3, 1.25, 680, 1250], [ls(4) - 0.1, 1.25, 680, 1250], [ls(4) + 0.3, 1.35, 800, 1250], [ls(6) - 0.1, 1.35, 800, 1250],
    [ls(6) + 0.2, 1.5, 680, 1150], [ls(7) - 0.1, 1.5, 680, 1150], [ls(7) + 0.3, 1.2, 620, 1300], [ISLAND - 0.25, 1.22, 620, 1300], [ISLAND + 0.2, 1.0, 540, 1300],
    [ls(9) - 0.1, 1.0, 540, 1300], [ls(9) + 0.3, 1.3, 760, 1320], [ls(10) - 0.1, 1.3, 760, 1320], [ls(10) + 0.3, 1.35, 420, 1200], [CTA + 0.1, 1.35, 420, 1200],
    [CTA + 0.6, 1.05, 540, 1300], [D, 1.08, 540, 1300]],
  render(t, { world: Wg, over }) {
    const busy = t < PAST || t >= ISLAND;
    Wd.island(Wg, { t, canoes: t < PAST ? 1 : t >= ISLAND ? seg(t, ISLAND, ISLAND + 1.6) : 0 });
    Wd.hut(Wg, {});
    // ---------------- Lani
    let la = Object.assign({ x: LA.x, y: LA.y + Math.sin(t * 1.4) * 4, s: 1.0 }, Wd.LANI, F.happy, { look: [-1, 0.3] });
    if (t >= PAST && t < ls(3)) la = Object.assign(la, F.worried, { look: [-1, 0] });
    if (t >= ls(3) && t < ls(4)) la = Object.assign(la, F.deadpan, { look: [1, 0.3] });
    if (t >= ls(4) && t < ls(6)) la = Object.assign(la, F.happy, { look: [1, 0.3], armR: { x: 200, y: -200 }, handR: "open" });
    if (t >= ls(6) && t < ls(7)) la = Object.assign(la, F.shock, { look: [0, -0.6], armR: { x: 150, y: -320 }, handR: "point" });
    if (t >= ls(7) && t < ASK) la = Object.assign(la, F.happy, { look: [0.6, 0.4], armL: { x: -150, y: -260 }, armR: { x: 150, y: -260 }, handL: "open", handR: "open" });
    if (t >= ASK) la = Object.assign(la, F.deadpan, { look: [-1, 0] }); if (t >= CTA + 0.4) la = Object.assign(la, F.happy);
    if (speaking(t, 6) || speaking(t, 11)) { la.mouth = speaking(t, 11) ? "flat" : "o"; la.open = talkOpen(t, 1) * 0.6; }
    if (blink(t, 0.4) && la.eyes === "open") la.eyes = "closed";
    P.draw(Wg, la);
    if (t >= WAIT - 0.1 && t < ls(7)) { const h = P.head(la); Wd.bulb(Wg, { x: h[0] + 10, y: h[1] - 230, k: E.outBack(seg(t, WAIT - 0.1, WAIT + 0.2)) * (1 - seg(t, ls(7) - 0.3, ls(7))), t }); }
    // ---------------- Koa
    let ko = Object.assign({ x: KO.x, y: KO.y + Math.sin(t * 1.3 + 1) * 4, s: 1.12 }, Wd.KOA, F.happy, { look: [1, 0] });
    if (t >= PAST && t < ls(3)) ko = Object.assign(ko, F.shout, { look: [1, -0.2], armR: { x: 150, y: -250 }, handR: "fist" });
    if (t >= ls(3) && t < ls(4)) ko = Object.assign(ko, F.happy, { look: [1, 0] });
    if (t >= ls(4) && t < ls(7)) ko = Object.assign(ko, F.sad, { look: [1, 0.4] });
    if (t >= ls(7) && t < ASK) ko = Object.assign(ko, F.shock, { look: [1, 0.4] });
    if (t >= ASK) ko = Object.assign(ko, F.worried, { look: [1, 0], x: lerp(KO.x, 330, E.inOutSine(seg(t, ASK - 0.3, ASK + 0.3))), armR: { x: 70, y: -140 }, handR: "point" });
    if (t >= NO + 0.3) ko = Object.assign(ko, F.sad);
    if (speaking(t, 2) || speaking(t, 10)) { ko.mouth = speaking(t, 2) ? "shout" : "o"; ko.open = 0.3 + talkOpen(t, 2) * 0.6; }
    if (blink(t, 1.2) && ko.eyes === "open") ko.eyes = "closed";
    P.draw(Wg, ko);
    if (t >= PAST && t < ls(3)) { const h = P.hand(ko, "R"); Wd.conch(Wg, { x: h[0] - 20, y: h[1] - 20, s: 0.8, rot: -20, blast: speaking(t, 2) ? 1 : 0, t }); }
    // ---------------- Koa's mom, then Mele (right side)
    if (t >= CUST - 0.6 && t < ls(4) + 0.3) { const k = seg(t, CUST - 0.6, CUST), out = seg(t, ls(4), ls(4) + 0.3);
      let mo = Object.assign({ x: lerp(1250, ME.x, E.outQuad(k)) + out * 400, y: ME.y + Math.abs(Math.sin(t * 7)) * -6 * (k < 1 ? 1 : 0), s: 0.95 }, Wd.MOM, F.smug, { look: [-1, 0], armL: { x: -160, y: -200 }, handL: "open" }); P.draw(Wg, mo);
      if (t >= MOM - 0.4) { const h = P.hand(mo, "L"); Wd.smoothie(Wg, { x: h[0], y: h[1] + 30, s: 0.55 }); } }
    if (t >= ls(4) && t < ASK) { const away = t >= RAN && t < GUYS ? seg(t, RAN, RAN + 0.4) * (1 - seg(t, GUYS - 0.3, GUYS)) : 0;
      let me = Object.assign({ x: lerp(1250, ME.x, E.outQuad(seg(t, ls(4), w(4, 1) + 0.3))) + away * 500, y: ME.y + (away > 0 && away < 1 ? Math.abs(Math.sin(t * 9)) * -10 : 0), s: 0.92 }, Wd.MELE, F.calm, { look: [-1, 0] });
      if (t >= TRIED) me = Object.assign(me, F.shock, { look: [-1, -0.2], armL: { x: -160, y: -200 }, handL: "open" }); if (t >= GUYS) me = Object.assign(me, F.happy, { look: [1, 0], armR: { x: 160, y: -280 }, handR: "open", armL: { x: -160, y: -200 } });
      if (t >= ls(7)) me = Object.assign(me, F.happy, { look: [-1, 0], armL: { x: -160, y: -200 } });
      if (speaking(t, 5)) { me.mouth = "o"; me.open = talkOpen(t, 3) * 0.6; } if (blink(t, 0.8) && me.eyes === "open") me.eyes = "closed"; P.draw(Wg, me);
      if (t >= TRIED - 0.3) { const h = P.hand(me, "L"); Wd.smoothie(Wg, { x: h[0], y: h[1] + 30, s: 0.55 }); }
      if (t >= TRIED && t < TRIED + 0.8) FX.sparkle(Wg, { x: me.x, y: 1080, k: seg(t, TRIED, TRIED + 0.8), r: 150, n: 8, s: 0.7 }); }
    Wd.rail(Wg, {});
    Wd.hutFront(Wg, {});
    if (t >= BRING - 0.1 && t < ls(9)) Wd.offer(Wg, { x: 640, y: 880, s: 0.95, k: Math.min(E.outBack(seg(t, BRING - 0.1, BRING + 0.2)), 1 - seg(t, ls(8) - 0.3, ls(8))) });
    // ---------------- the crowd (flash-forward in the hook, then the referral flood)
    CS.forEach((c) => { const k = shown(t, c.i); if (k <= 0) return; Wd.folk(Wg, { x: c.x, y: c.y, s: 0.95, i: c.i, t, hop: busy || t >= ls(7) ? 1 : 0, k, cup: 1, flip: c.flip }); });
    if (t >= ls(5) && t < ls(7)) [[1060, 1700, 5], [1150, 1780, 6]].forEach(([fx, fy, i]) => Wd.folk(Wg, { x: fx - (1 - seg(t, ls(5), ls(5) + 0.5)) * -300, y: fy, s: 0.95, i, t, hop: 1, k: 1, flip: -1 }));
    if (t >= GET - 0.2 && t < CUST) Wd.crab(Wg, { x: lerp(420, -200, seg(t, GET - 0.2, CUST)), y: 1640, s: 1.2, t });
    if (t >= ls(9) && t < ASK) [[CROWD[0], 0], [CROWD[1], 1]].forEach(([c, i]) => K.label(Wg, { x: c.x, y: c.y - 330, text: "+1 FREE", size: 34, k: E.outBack(seg(t, ls(9) + i * 0.2, ls(9) + i * 0.2 + 0.3)), tone: "#FFE27A", rot: i ? 6 : -6 }));
    if (t >= ISLAND && t < ISLAND + 1.0) FX.sparkle(Wg, { x: 540, y: 1500, k: seg(t, ISLAND, ISLAND + 1.0), r: 520, n: 16, s: 1.5 });
    // ---------------- over: referral tree, Dropbox card
    if (t >= ls(8) - 0.1 && t < DROPBOX) { const k = Math.min(E.outBack(seg(t, ls(8) - 0.1, ls(8) + 0.25)), 1 - seg(t, DROPBOX - 0.25, DROPBOX)); Wd.treeCard(over, { x: 540, y: 930, s: 1.0, k, gen: 1 + Math.floor(seg(t, ls(8), w(8, 3)) * 3.99), t }); }
    if (t >= DROPBOX - 0.05 && t < ls(9)) { const k = Math.min(E.outBack(seg(t, DROPBOX - 0.05, DROPBOX + 0.25)), 1 - seg(t, ls(9) - 0.3, ls(9))); Wd.dropCard(over, { x: 540, y: 930, s: 1.0, k, grow: E.outQuad(seg(t, w(8, 9), MILLION + 0.2)) }); }
    const sh = [shake(t, ISLAND, ISLAND + 0.5, 18, 3), shake(t, KOA1, KOA1 + 0.3, 10, 5), shake(t, NO, NO + 0.25, 6, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#7FD4F0" };
  },
});
