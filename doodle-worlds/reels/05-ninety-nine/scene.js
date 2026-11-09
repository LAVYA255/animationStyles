/* World 5 · Forest · "Why does everything cost 99?" (48.6 s). Animal-economics format.
   Hook: price tags ending in 99 pop everywhere; squirrels figured it out first. Hazel sells acorns at 100: nobody buys.
   Nutmeg: "A HUNDRED? That's like... a HUNDRED!" -> she changes one tiny thing: the board flips to 99 -> "That's basically
   ninety!" -> SOLD OUT by lunch (drop, the one flash: the woodland rush). The left-to-right card: the eye reads the first digit
   and stops; 99 feels like 90 but it's 100 - 1. Charm pricing, used on you daily. Tag: "Can I pay 98 now... and one acorn
   tomorrow?" -> Hazel flips the board back to 100. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, Wd = World, FX = Rig.props;
const NUTC = "#9A6A3A";
const EVERY = w(0, 2), COST = w(0, 3), SQ = w(0, 5), HUNDRED = w(1, 5), NOBODY = w(1, 7), NUTIN = ls(2) - 0.4, CHANGED = w(3, 2), TINY = w(3, 4);
const FLIP = ls(4), NINETY = w(5, 3), DROP = w(6, 1), LEFT = w(7, 4), FIRST = w(7, 9), STOP = w(7, 12), FEELS = w(8, 1), ONE = w(8, 6), HUN2 = w(8, 10);
const CHARM = w(9, 1), SHOPS = w(9, 3), DAILY = w(9, 10), CANI = ls(10), TOMORROW = w(10, 8), CTA = ls(11);
const INS0 = ls(7) - 0.35, INS1 = le(8) + 0.3;
const HZ = { x: 380, y: 1420, s: 1.05 }, NM = { x: 760, y: 1420, s: 1.0 }, BOARD = { x: 560, y: 820 };
const TAGS = [["₹99", 200, 700, -10], ["$9.99", 860, 640, 8], ["499", 300, 1040, 6], ["₹999", 830, 1000, -6], ["1,999", 560, 560, 4], ["$4.99", 150, 880, -4]];

WK.film({
  flashAt: DROP,
  titleSlam: { text: "SOLD OUT!", at: DROP, until: le(6) + 0.2, color: "#E5484D", size: 160, y: 620 },
  captions: [
    [0, SQ - 0.3, ["WHY DOES EVERYTHING", { y: 290, size: 80, at: [w(0, 0), w(0, 1), EVERY] }], ["COST 99?", { y: 400, size: 120, at: [COST, w(0, 4)], accent: ["99?"], acc: "#E5484D" }]],
    [SQ - 0.3, ls(1), ["SQUIRRELS GOT IT FIRST.", { y: 300, size: 80, at: [SQ, w(0, 6), w(0, 9)] }]],
    [ls(1), ls(2), ["PRICE: 100.", { y: 290, size: 100, at: [w(1, 3), HUNDRED] }], ["NOBODY BOUGHT.", { y: 400, size: 84, at: [NOBODY, w(1, 8)] }]],
    [ls(2), ls(3), ["“A HUNDRED?!”", { y: 300, size: 120, at: [w(2, 0), w(2, 1)], color: NUTC }]],
    [ls(3), FLIP, ["ONE TINY CHANGE...", { y: 300, size: 92, at: [CHANGED, w(3, 3), TINY] }]],
    [FLIP, ls(5), ["99.", { y: 320, size: 170, at: [FLIP], color: "#E5484D" }]],
    [ls(5), ls(6), ["“THAT'S BASICALLY 90!”", { y: 300, size: 80, at: [w(5, 1), w(5, 2), NINETY], color: NUTC }]],
    [ls(7), STOP - 0.6, ["WE READ PRICES", { y: 290, size: 88, at: [w(7, 2), w(7, 3)] }], ["LEFT TO RIGHT.", { y: 400, size: 88, at: [LEFT, w(7, 5), w(7, 6)], accent: ["LEFT"], acc: "#3FB8AF" }]],
    [STOP - 0.6, ls(8), ["FIRST DIGIT...", { y: 290, size: 92, at: [FIRST, w(7, 10)] }], ["STOP.", { y: 400, size: 110, at: [STOP], color: "#E5484D" }]],
    [ls(8), ls(9), ["99 FEELS LIKE 90.", { y: 290, size: 86, at: [w(8, 0), FEELS, w(8, 2), w(8, 3)] }], ["IT'S 100 − 1.", { y: 400, size: 96, at: [ONE, w(8, 7), HUN2], accent: ["100"], acc: "#E5484D" }]],
    [ls(9), ls(10), ["CHARM PRICING.", { y: 290, size: 100, at: [CHARM, w(9, 2)], accent: ["CHARM"], acc: "#E9A23B" }], ["SHOPS USE IT ON YOU.", { y: 400, size: 80, at: [SHOPS, w(9, 4), w(9, 6), w(9, 7)] }]],
    [ls(10), CTA, ["“PAY 98 NOW...”", { y: 290, size: 92, at: [w(10, 2), w(10, 3), w(10, 4)], color: NUTC }], ["“...1 ACORN TOMORROW?”", { y: 400, size: 76, at: [w(10, 6), w(10, 7), TOMORROW], color: NUTC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(11, 0)] }], ["“PRICE”", { y: 450, size: 150, at: [w(11, 1)], color: "#E5484D" }], ["for the free pricing cheat sheet", { y: 550, size: 50, at: [w(11, 2), w(11, 3), w(11, 4), w(11, 5), w(11, 6)], color: "#555" }]],
  ],
  cam: [[0, 1.12, 560, 1060], [ls(1) - 0.2, 1.12, 560, 1060], [ls(1) + 0.4, 1.35, 470, 1140], [NUTIN, 1.35, 470, 1140], [NUTIN + 0.5, 1.32, 570, 1150],
    [ls(3) - 0.1, 1.32, 570, 1150], [CHANGED, 1.7, 560, 930], [ls(5) - 0.2, 1.7, 560, 930], [ls(5) + 0.3, 1.45, 700, 1150], [ls(6) - 0.1, 1.45, 700, 1150],
    [DROP, 1.0, 620, 1060], [ls(9) - 0.1, 1.0, 620, 1060], [ls(9) + 0.4, 1.2, 570, 1100], [CANI - 0.1, 1.2, 570, 1100], [CANI + 0.5, 1.42, 590, 1160], [D, 1.46, 590, 1160]],
  render(t, { world: Wg, over }) {
    Wd.forest(Wg, { t });
    const flip = t < FLIP - 0.05 ? 0 : t < TOMORROW + 0.9 ? E.inOutSine(seg(t, FLIP - 0.05, FLIP + 0.3)) : 1 - E.inOutSine(seg(t, TOMORROW + 0.9, TOMORROW + 1.25));
    Wd.board(Wg, { x: BOARD.x, y: BOARD.y, s: 0.75, flip, t, glow: t >= FLIP && t < FLIP + 1 ? 1 - seg(t, FLIP + 0.3, FLIP + 1) : 0 });
    if (t >= FLIP && t < FLIP + 0.7) FX.sparkle(Wg, { x: BOARD.x, y: BOARD.y, k: seg(t, FLIP, FLIP + 0.7), r: 240, n: 10 });
    // the woodland rush on the drop
    if (t >= DROP - 0.1 && t < ls(9)) { const k = seg(t, DROP - 0.1, DROP + 0.6), out = seg(t, le(6), ls(9));
      [[0, "#E8E2DA"], [1, "#C9B8A6"], [2, "#DCCFC2"]].forEach(([i, tone]) => Wd.bunny(Wg, { x: lerp(1300 + i * 120, 860 + i * 110, E.outQuad(k)) + out * 600, y: 1260, s: 0.55, hop: t * 9 + i, tone }));
      Wd.hedgehog(Wg, { x: lerp(1500, 1020, E.outQuad(k)) + out * 600, y: 1290, s: 0.5 }); }
    // ---------------- Hazel (pops up on "squirrels")
    if (t >= SQ - 0.3) {
      let hz = Object.assign({}, HZ, Wd.HAZEL, { t, look: [0.4, 0], mouth: "smile", armL: { x: -120, y: -40 }, armR: { x: 120, y: -40 } });
      if (t < SQ + 0.1) hz.y = HZ.y + 420 * (1 - E.outBack(seg(t, SQ - 0.3, SQ + 0.1)));
      if (t >= ls(1) && t < ls(3)) hz = Object.assign(hz, { eyes: "half", lid: 0.55, mouth: "flat", look: [0, 0], headTilt: -6 });
      if (t >= ls(2) && t < ls(3)) hz.look = [1, 0];
      if (t >= ls(3) && t < ls(5)) hz = Object.assign(hz, { eyes: "open", mouth: "smile", look: [0.4, -1], armR: { x: 140, y: -300 } });
      if (t >= ls(5) && t < DROP) hz = Object.assign(hz, { eyes: "happy", mouth: "grin", look: [1, 0] });
      if (t >= DROP && t < ls(10)) hz = Object.assign(hz, { eyes: "happy", mouth: "grin", armL: { x: -120, y: -260 }, armR: { x: 120, y: -260 } });
      if (t >= CHARM && t < ls(10)) hz = Object.assign(hz, { eyes: ["happy", "open"], mouth: "smile", armL: { x: -120, y: -40 }, armR: { x: 120, y: -40 } });
      if (t >= ls(10)) hz = Object.assign(hz, { eyes: "half", lid: 0.55, mouth: "flat", look: [1, 0], armR: t > TOMORROW + 0.8 ? { x: 150, y: -300 } : { x: 120, y: -40 } });
      if (blink(t, 0.4) && hz.eyes === "open") hz.eyes = "closed";
      hz.sy = 1 + 0.012 * Math.sin(t * 2.4);
      Wd.critter(Wg, hz);
    }
    // ---------------- Nutmeg (hops in for "a hundred?")
    if (t >= NUTIN) {
      let nm = Object.assign({}, NM, Wd.NUTMEG, { t, look: [-0.3, -0.6], mouth: "smile", armL: { x: -120, y: -40 }, armR: { x: 120, y: -40 } });
      if (t < NUTIN + 0.45) { nm.x = lerp(1350, NM.x, E.outBack(seg(t, NUTIN, NUTIN + 0.45))); nm.y = NM.y + arc(seg(t, NUTIN, NUTIN + 0.45), 60); }
      if (t >= ls(2) && t < ls(3)) nm = Object.assign(nm, { eyes: "wide", mouth: "shout", open: 0.8, cheeks: 1, look: [-0.3, -0.8], armL: { x: -150, y: -260 }, armR: { x: 150, y: -260 } });
      if (t >= ls(3) && t < FLIP) nm = Object.assign(nm, { eyes: "open", mouth: "flat", look: [-0.4, -1] });
      if (t >= FLIP && t < DROP) nm = Object.assign(nm, { eyes: "sparkle", mouth: "grin", look: [-0.4, -0.8] });
      if (t >= ls(5) && t < DROP) nm.armL = { x: -200, y: -60 };
      if (t >= DROP && t < ls(10)) nm = Object.assign(nm, { eyes: "happy", mouth: "grin", cheeks: 0.8 });
      if (t >= ls(10)) nm = Object.assign(nm, { eyes: "open", mouth: "wavy", look: [-1, 0], sweat: 1, armL: { x: -210, y: -60 } });
      if ([2, 5, 10].some((i) => speaking(t, i))) { nm.mouth = t < ls(3) ? "shout" : "o"; nm.open = talkOpen(t, 2); }
      if (blink(t, 1.6) && nm.eyes === "open") nm.eyes = "closed";
      nm.sy = 1 + 0.012 * Math.sin(t * 2.1 + 1);
      Wd.critter(Wg, nm);
    }
    // ---------------- the stump + what's on it
    Wd.stump(Wg, {});
    const stock = t < DROP ? 1 : 1 - seg(t, DROP, DROP + 0.8);
    Wd.basket(Wg, { x: 560, y: 1405, s: 0.75, fill: stock }); Wd.basket(Wg, { x: 220, y: 1405, s: 0.62, fill: stock });
    if (t >= DROP && t < DROP + 0.9) for (let i = 0; i < 8; i++) { const k = clamp((t - DROP - i * 0.06) / 0.6); if (k > 0 && k < 1) Wd.acorn(Wg, { x: lerp(560, 1000 + i * 30, k), y: lerp(1300, 1150, k) + arc(k, 220), s: 0.8, rot: k * 400 }); }
    if (t >= ls(5) + 0.6 && t < DROP + 0.4) for (let i = 0; i < 3; i++) Kit.coin(Wg, { x: 640 + i * 40, y: 1390 - i * 14, s: 0.22 * E.outBack(seg(t, ls(5) + 0.6 + i * 0.1, ls(5) + 0.8 + i * 0.1)), sym: "", spin: 0 });
    if (t >= CANI + 0.3) { const k = E.outBack(seg(t, CANI + 0.3, CANI + 0.6)); for (let i = 0; i < 4; i++) Kit.coin(Wg, { x: 600 + i * 34, y: 1392 - (i % 2) * 10, s: 0.2 * k, sym: "" });
      Wd.iou(Wg, { x: lerp(820, 700, E.outBack(seg(t, w(10, 6), w(10, 7) + 0.2))), y: 1370, s: 0.45 * E.outBack(seg(t, w(10, 6), w(10, 7) + 0.2)), rot: -8 }); }
    // ---------------- price tags: the hook, and "shops use it on you"
    TAGS.forEach(([txt, x, y, r], i) => { const a = EVERY + i * 0.18, k = Math.min(E.outBack(seg(t, a, a + 0.22)), 1 - seg(t, SQ - 0.2, SQ + 0.2)); if (k > 0) Wd.tag(Wg, { x, y: y + Math.sin(t * 2 + i) * 6, s: 0.8 * k, rot: r, text: txt }); });
    if (t >= SHOPS - 0.2 && t < CANI) for (let i = 0; i < 9; i++) { const k = (t - SHOPS + 0.2) * 0.55 + i * 0.11, yy = -200 + ((k * 1700) % 1900); Wd.tag(Wg, { x: 80 + (i * 137) % 940, y: yy, s: 0.6, rot: Math.sin(t * 2 + i) * 20, text: TAGS[i % TAGS.length][0] }); }
    // ---------------- over: the left-to-right card
    if (t >= INS0 && t < INS1 + 0.3) { const k = Math.min(E.outBack(seg(t, INS0, INS0 + 0.3)), 1 - E.inQuad(seg(t, INS1, INS1 + 0.3)));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#1d1b1a", opacity: 0.45 * k }, over);
      const sub = t < ls(8) ? "" : t < ONE ? "feels like 90..." : "...but it's 100 − 1";
      Wd.digits(over, { x: 540, y: 1000, s: 1.15, k, text: "99", scan: seg(t, LEFT - 0.2, w(7, 6) + 0.2), stop: E.outBack(seg(t, STOP - 0.1, STOP + 0.15)), sub }); }
    const sh = [shake(t, DROP, DROP + 0.5, 22, 3), shake(t, ls(2), ls(2) + 0.35, 10, 5)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#CFE8C2" };
  },
});
