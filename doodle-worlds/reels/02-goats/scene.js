/* World 02 · Stone age pasture · "Interest was invented by goats" (55.2 s). Origin story (compound interest).
   Hook: close on a smug goat, "interest was invented... by goats". Brok needs goats, Kira has ten. Brok borrows them over
   winter (snow), spring: back come ten goats... and fourteen babies. "Whose damn babies are those?" "Your goats did it!"
   Kira keeps the babies: interest is born (INTEREST tags). The Sumerian word for interest meant baby goat (clay tablet).
   Babies have babies: 10 -> 24 -> 58 -> 140 (the one flash, the drop, the pasture floods). Compound tree card. Tag: Brok
   asks for ten more; "two babies per goat, sign the damn rock" -> handprint -> CTA. Font: Lilita One. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const KIC = "#B5532E", BRC = "#8B5A2B", TEAL = "#24857E";
const GOATS0 = w(0, 4), NEED = w(1, 6), TEN = w(1, 9), WINTER = w(2, 9), SPRING = ls(3), BACK = w(3, 3), FOURTEEN = w(4, 1);
const DAMN = w(5, 1), DIDIT = w(6, 2), KEPT = w(7, 2), INTEREST = w(7, 7), BORN = w(7, 9), BABYGOAT = w(8, 9);
const BABIES2 = w(9, 2), N10 = w(10, 0), N24 = w(10, 3), N58 = w(10, 5), N140 = w(10, 7);
const MONEY = w(11, 6), BAB3 = w(11, 11), TAG = ls(12), SURE = ls(13), SIGN = w(13, 5), ROCK = w(13, 8), CTA = ls(14);
const KI = { x: 280, y: 1420 }, BR = { x: 800, y: 1420 };
// the herd: 10 adults + 14 babies on Kira's side, then the flood (to 140) over the whole pasture
const HERD = []; for (let i = 0; i < 140; i++) { const r = MK.rng(i * 17 + 3), side = i < 24;
  HERD.push({ i, x: side ? lerp(-40, 560, r()) : lerp(-80, 1160, r()), y: side ? lerp(1560, 1860, r()) : lerp(1490, 1960, r()), flip: r() > 0.5 ? 1 : -1, col: Math.floor(r() * 4), baby: i >= 10, born: i < 10 ? TEN - 0.6 + i * 0.06 : i < 24 ? FOURTEEN + (i - 10) * 0.05 : i < 34 ? BABIES2 + (i - 24) * 0.05 : i < 58 ? N58 - 0.05 + (i - 34) * 0.02 : N140 - 0.05 + (i - 58) * 0.008 }); }
HERD[0].x = 430; HERD[0].y = 1760; // the hook goat
const HERD_SORTED = HERD.slice().sort((a, b) => a.y - b.y);

WK.film({
  font: "Lilita One",
  flashAt: N140,
  titleSlam: { text: "140 GOATS!", at: N140, until: ls(11) - 0.05, color: "#FFE27A", size: 170, y: 340 },
  captions: [
    [0, ls(1), ["INTEREST WAS INVENTED...", { y: 290, size: 92, at: [w(0, 0), w(0, 1), w(0, 2)] }], ["BY GOATS.", { y: 410, size: 124, at: [w(0, 3), GOATS0], accent: ["GOATS."], acc: TEAL }], "hard"],
    [ls(1), w(2, 1), ["10,000 YEARS AGO...", { y: 290, size: 90, at: [w(1, 0), w(1, 1), w(1, 2), w(1, 3)] }], ["BROK NEEDED GOATS. KIRA HAD 10.", { y: 392, size: 74, at: [w(1, 4), w(1, 5), NEED, w(1, 7), w(1, 8), TEN] }], "hard"],
    [w(2, 1), ls(3), ["“LEND ME YOUR GOATS?”", { y: 290, size: 92, at: [w(2, 1) + 0.1, w(2, 1) + 0.18, w(2, 2), w(2, 3)], color: BRC }], ["“I'LL GIVE 'EM BACK AFTER WINTER!”", { y: 392, size: 74, at: [w(2, 4), w(2, 5), w(2, 6), w(2, 7), w(2, 8), WINTER], color: BRC }], "hard"],
    [ls(3), ls(4), ["SPRING CAME.", { y: 290, size: 100, at: [SPRING, w(3, 1)] }], ["BROK BROUGHT BACK 10 GOATS...", { y: 400, size: 80, at: [w(3, 2), w(3, 3), w(3, 4), w(3, 5), w(3, 6)] }], "hard"],
    [ls(4), ls(5), ["...AND 14 BABIES.", { y: 320, size: 120, at: [w(4, 0), FOURTEEN, w(4, 2)], accent: ["14"], acc: TEAL }], "hard"],
    [ls(5), ls(6), ["“WHOSE DAMN BABIES", { y: 290, size: 100, at: [w(5, 0), DAMN, w(5, 2)], color: KIC }], ["ARE THOSE?”", { y: 410, size: 108, at: [w(5, 3), w(5, 4)], color: KIC }], "hard"],
    [ls(6), ls(7), ["“YOUR GOATS DID IT!”", { y: 290, size: 100, at: [w(6, 0), w(6, 1), DIDIT, w(6, 3)], color: BRC }], ["“NOT ME!”", { y: 410, size: 120, at: [w(6, 4), w(6, 5)], color: BRC }], "hard"],
    [ls(7), w(8, 2), ["SO KIRA KEPT THE BABIES.", { y: 290, size: 88, at: [w(7, 0), w(7, 1), KEPT, w(7, 3), w(7, 4)] }], ["THAT'S HOW INTEREST WAS BORN.", { y: 392, size: 80, at: [w(7, 5), w(7, 6), INTEREST, w(7, 8), BORN], accent: ["INTEREST"], acc: TEAL }], "hard"],
    [w(8, 2), ls(9), ["IN SUMER, THE WORD FOR INTEREST", { y: 290, size: 76, at: [w(8, 2) + 0.1, w(8, 2) + 0.2, w(8, 3), w(8, 4), w(8, 5), w(8, 6)] }], ["MEANT... BABY GOAT.", { y: 392, size: 100, at: [w(8, 8), w(8, 9), BABYGOAT], accent: ["BABY", "GOAT."], acc: TEAL }], "hard"],
    [ls(9), ls(10), ["THEN THE BABIES", { y: 290, size: 100, at: [w(9, 0), w(9, 1), BABIES2] }], ["HAD BABIES.", { y: 410, size: 112, at: [w(9, 3), w(9, 4)] }], "hard"],
    [ls(10), N140 - 0.1, ["10... 24... 58...", { y: 320, size: 130, at: [N10, N24, N58], color: TEAL }], "hard"],
    [ls(11), w(11, 8), ["COMPOUND INTEREST:", { y: 290, size: 96, at: [w(11, 0), w(11, 1), w(11, 2)], accent: ["INTEREST:"], acc: TEAL }], ["YOUR MONEY HAS BABIES...", { y: 400, size: 92, at: [w(11, 3), w(11, 4), w(11, 5), MONEY] }], "hard"],
    [w(11, 8), w(12, 1), ["...AND THE BABIES", { y: 290, size: 100, at: [w(11, 8) + 0.1, w(11, 8) + 0.16, w(11, 9)] }], ["HAVE BABIES.", { y: 410, size: 112, at: [w(11, 10), BAB3], color: TEAL }], "hard"],
    [w(12, 1), ls(13), ["“KIRA... CAN I BORROW", { y: 290, size: 92, at: [w(12, 1) + 0.1, w(12, 1) + 0.18, w(12, 2), w(12, 3)], color: BRC }], ["10 MORE?”", { y: 410, size: 120, at: [w(12, 4), w(12, 5)], color: BRC }]],
    [ls(13), w(14, 1), ["“SURE. 2 BABIES PER GOAT.”", { y: 290, size: 88, at: [SURE, w(13, 1), w(13, 2), w(13, 3), w(13, 4)], color: KIC }], ["“SIGN THE DAMN ROCK.”", { y: 400, size: 100, at: [SIGN, w(13, 6), w(13, 7), ROCK], color: KIC }], "hard"],
    [w(14, 1), D + 1, ["COMMENT", { y: 300, size: 120, at: [w(14, 1) + 0.1] }], ["“GROW”", { y: 455, size: 160, at: [w(14, 1) + 0.3], color: TEAL }], ["for the free compound interest calculator", { y: 550, size: 48, at: [w(14, 2), w(14, 3), w(14, 4), w(14, 5), w(14, 6), w(14, 7)], color: "#2A2A2A" }]],
  ],
  cam: [[0, 2.3, 430, 1590], [GOATS0 - 0.25, 2.32, 430, 1590], [GOATS0 + 0.35, 1.12, 540, 1150], [ls(2) - 0.1, 1.12, 540, 1150], [ls(2) + 0.3, 1.6, 760, 1180],
    [WINTER - 0.3, 1.6, 760, 1180], [WINTER + 0.3, 1.12, 540, 1150], [ls(4) - 0.1, 1.12, 540, 1150], [ls(4) + 0.3, 1.45, 330, 1460], [ls(5) - 0.1, 1.45, 330, 1460],
    [ls(5) + 0.25, 1.6, 300, 1170], [ls(6) - 0.1, 1.6, 300, 1170], [ls(6) + 0.25, 1.6, 770, 1170], [ls(7) - 0.1, 1.6, 770, 1170], [ls(7) + 0.35, 1.12, 540, 1150],
    [ls(10) - 0.1, 1.12, 540, 1150], [N140 - 0.2, 1.02, 540, 1120], [N140 + 0.6, 1.05, 540, 1140], [TAG - 0.1, 1.05, 540, 1140], [TAG + 0.3, 1.3, 540, 1220],
    [SIGN - 0.2, 1.3, 540, 1220], [SIGN + 0.2, 1.38, 560, 1320], [CTA - 0.1, 1.4, 560, 1320], [CTA + 0.5, 1.12, 540, 1150], [D, 1.15, 540, 1150]],
  render(t, { world: Wg, over }) {
    const season = t < WINTER - 0.2 ? 0 : t < SPRING ? E.inOutSine(seg(t, WINTER - 0.2, WINTER + 0.4)) : 1 + E.inOutSine(seg(t, SPRING, SPRING + 0.5));
    const snow = season <= 1 ? season : 0;
    Wd.valley(Wg, { t, season });
    const bob = (i) => Math.sin(t * 1.4 + i * 2) * 4;
    // ---------------- Kira
    let ki = Object.assign({ x: KI.x, y: KI.y + bob(0), s: 1 }, Wd.KIRA, F.calm, { look: [0.4, 0.6] });
    if (t >= TEN - 0.4 && t < ls(2)) ki = Object.assign(ki, F.smug, { look: [0, 0.8] });
    if (t >= ls(2) && t < SPRING) ki = Object.assign(ki, F.deadpan, { look: [1, 0] });
    if (t >= BACK && t < FOURTEEN) ki = Object.assign(ki, F.happy, { look: [0.3, 0.9] });
    if (t >= FOURTEEN && t < ls(5)) ki = Object.assign(ki, F.shock, { look: [0.3, 0.9] });
    if (t >= ls(5) && t < ls(7)) ki = Object.assign(ki, F.angry, { look: [1, 0], armL: { x: -60, y: -150 }, armR: { x: 60, y: -150 } });
    if (t >= KEPT && t < ls(10)) ki = Object.assign(ki, F.smug, { look: [0.2, 0.9] });
    if (t >= N24 && t < TAG) ki = Object.assign(ki, t < N140 ? F.worried : F.shock, { look: [0, 0.9], sweat: t >= N140 ? 1 : 0 });
    if (t >= TAG) ki = Object.assign(ki, F.deadpan, { look: [1, 0] });
    if (t >= ROCK + 0.3) ki = Object.assign(ki, F.smug, { look: [1, 0.3] });
    if (speaking(t, 5) || speaking(t, 13)) { ki.mouth = speaking(t, 5) ? "o" : "flat"; ki.open = talkOpen(t, 1) * 0.6; }
    // ---------------- Brok
    let br = Object.assign({ x: BR.x, y: BR.y + bob(1), s: 1 }, Wd.BROK, F.calm, { look: [-1, 0.3] });
    if (t >= NEED - 0.3 && t < ls(2)) br = Object.assign(br, F.sad, { look: [-1, 0.5] });
    if (t >= ls(2) && t < WINTER) br = Object.assign(br, F.worried, { look: [-1, 0], armL: { x: -40, y: -160 }, armR: { x: 40, y: -160 }, handL: "open", handR: "open" });
    if (t >= WINTER && t < ls(4)) br = Object.assign(br, F.happy, { look: [0, 0.8] });
    if (t >= ls(5) && t < ls(6)) br = Object.assign(br, F.worried, { look: [-1, 0], sweat: 1 });
    if (t >= ls(6) && t < ls(7)) br = Object.assign(br, F.shout, { look: [-1, 0], sweat: 1, armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" });
    if (t >= ls(7) && t < N24) br = Object.assign(br, F.deadpan, { look: [-0.5, 0.8] });
    if (t >= N140 && t < TAG) br = Object.assign(br, F.shock, { look: [0, -0.8] });
    if (t >= TAG) br = Object.assign(br, F.worried, { look: [-1, 0], sweat: 1, armL: { x: -40, y: -200 }, armR: { x: 40, y: -200 }, handL: "open", handR: "open" });
    if (t >= SIGN) br = Object.assign(br, F.shock, { look: [-0.4, 0.9], sweat: 1, armR: { x: -150, y: -60 }, handR: "open" });
    if (t >= ROCK + 0.4) br = Object.assign(br, F.sad, { look: [-0.4, 0.9] });
    if (speaking(t, 2) || speaking(t, 6) || speaking(t, 12)) { br.mouth = speaking(t, 6) ? "shout" : "o"; br.open = 0.3 + talkOpen(t, 2) * 0.6; }
    [ki, br].forEach((c, i) => { if (blink(t, i * 1.3) && c.eyes === "open") c.eyes = "closed"; P.draw(Wg, c); });
    if (t >= N140) { const hd = P.head(br); Wd.goat(Wg, { x: hd[0] - 10, y: hd[1] - 120, s: 0.5, t, k: E.outBack(seg(t, N140 + 0.2, N140 + 0.5)), face: "smug", chew: 1 }); }
    Wd.fence(Wg, { snow });
    if (t >= N140) [[60, 1395], [470, 1395], [990, 1395]].forEach(([fx, fy], i) => Wd.goat(Wg, { x: fx, y: fy, s: 0.5, t, baby: i % 2, k: E.outBack(seg(t, N140 + 0.1 * i, N140 + 0.1 * i + 0.3)), hop: 1, col: i }));
    // ---------------- the herd
    const lend = t < WINTER - 0.5 ? 0 : t < w(3, 3) ? E.inOutSine(seg(t, WINTER - 0.5, WINTER + 0.6)) : 1 - E.inOutSine(seg(t, w(3, 3), w(3, 6) + 0.2));
    const moving = (t > WINTER - 0.5 && t < WINTER + 0.6) || (t > w(3, 3) && t < w(3, 6) + 0.2);
    const show = t < GOATS0 + 0.4 ? 1 : 0; // the hook goat
    HERD_SORTED.forEach((g) => { let k = g.i === 0 && show ? 1 : E.outBack(seg(t, g.born, g.born + 0.3)); if (k <= 0) return;
      const dx = g.i < 10 ? lend * 560 : 0, face = g.i === 0 && t < GOATS0 + 0.4 ? "smug" : t >= ls(5) && t < ls(6) && !g.baby ? "shock" : t >= ls(6) && t < ls(7) && (g.i === 1 || g.i === 2) ? "love" : t >= N140 ? (g.i % 3 ? "happy" : "shock") : "happy";
      Wd.goat(Wg, { x: g.x + dx, y: g.y, s: (g.i === 0 ? lerp(1.5, 1, seg(t, GOATS0, GOATS0 + 0.5)) : 1) * 0.8 * lerp(0.82, 1.12, (g.y - 1490) / 470), t, baby: g.baby ? 1 : 0, flip: g.i === 0 && t < GOATS0 + 0.4 ? -1 : (moving && g.i < 10 ? (t < SPRING ? 1 : -1) : g.flip), col: g.col, k,
        hop: moving && g.i < 10 || (t >= N24 && t < TAG && g.i >= 24), chew: !moving, face, label: g.baby && g.i < 14 ? Math.min(E.outBack(seg(t, INTEREST - 0.1, INTEREST + 0.2)), 1 - seg(t, ls(8) - 0.3, ls(8))) : 0 }); });
    if (t >= DIDIT - 0.3 && t < ls(7) + 0.3) { const a = HERD[1], b = HERD[2]; Wd.hearts(Wg, { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 150, t, k: Math.min(1, seg(t, DIDIT - 0.3, DIDIT)) * (1 - seg(t, ls(7), ls(7) + 0.3)) }); }
    // the contract rock
    if (t >= SIGN - 0.2) Wd.rock(Wg, { x: 560, y: 1700, s: 1.05, k: E.outBack(seg(t, SIGN - 0.2, SIGN + 0.15)), hand: E.outBack(seg(t, ROCK, ROCK + 0.3)) });
    if (t >= N140 && t < N140 + 0.9) FX.sparkle(Wg, { x: 540, y: 1500, k: seg(t, N140, N140 + 0.9), r: 520, n: 16, s: 1.5 });
    // ---------------- over: goat counter, clay tablet, compound tree
    if (t >= TEN - 0.6 && t < ls(2)) { const k = Math.min(E.outBack(seg(t, TEN - 0.6, TEN - 0.3)), 1 - seg(t, ls(2) - 0.3, ls(2))); K.counter(over, { x: 540, y: 560, s: 1.2 * k, n: 10 * seg(t, TEN - 0.6, TEN), label: "KIRA'S GOATS" }); }
    if (t >= ls(10) && t < N140 + 1.0) { const k = Math.min(E.outBack(seg(t, ls(10), ls(10) + 0.25)), 1 - seg(t, N140 + 0.6, N140 + 1.0)), n = t < N24 ? 10 : t < N58 ? lerp(10, 24, seg(t, N24, N24 + 0.4)) : t < N140 ? lerp(24, 58, seg(t, N58, N58 + 0.4)) : lerp(58, 140, seg(t, N140, N140 + 0.5));
      K.counter(over, { x: 540, y: 600, s: 1.3 * k, n, label: "GOATS" }); }
    if (t >= ls(8) - 0.1 && t < ls(9)) { const k = Math.min(E.outBack(seg(t, ls(8) - 0.1, ls(8) + 0.25)), 1 - seg(t, ls(9) - 0.3, ls(9))); Wd.tablet(over, { x: 540, y: 900, s: 1.0, k }); }
    if (t >= ls(11) && t < TAG) { const k = Math.min(E.outBack(seg(t, ls(11), ls(11) + 0.3)), 1 - seg(t, TAG - 0.3, TAG)); Wd.tree(over, { x: 540, y: 930, s: 1.0, k, gen: t < MONEY ? 1 : t < BAB3 ? 2 : 3, t }); }
    const sh = [shake(t, N140, N140 + 0.6, 22, 3), shake(t, FOURTEEN, FOURTEEN + 0.3, 10, 5), shake(t, DAMN, DAMN + 0.25, 8, 7), shake(t, ROCK, ROCK + 0.3, 12, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#9AD4EE" };
  },
});
