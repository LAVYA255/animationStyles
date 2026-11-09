/* World 11 · Pirate ship · "How different IQ pirates split the treasure" (47.3 s). IQ-levels format.
   Hook: three pirates, one heap of gold, Pip the parrot watching from the mast. LOW IQ: Gus "MINE! ALL MINE!" -> brawl cloud
   -> gold overboard, everyone dazed, a tooth flies ("or teeth"). MEDIUM IQ: Fen counts coin by coin -> sun/moon time-lapse,
   tally marks, everyone asleep, "still counting". HIGH IQ: Ada splits two piles, "you pick first" -> she evens them because Gus
   will grab the bigger one -> I CUT / YOU CHOOSE (the one flash, the drop) -> treasure, chores, business -> tag: the parrot
   copies Fen ("and one for the parrot") and steals a coin -> CTA. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const GUC = "#E5484D", FEC = "#2F6FB0", ADC = "#B03A63", PIC = "#3FA35A";
const MINE = w(2, 0), ALL = w(2, 1), NOBODY = w(3, 1), TEETH = w(3, 5);
const COUNT = [w(5, 0), w(5, 3), w(5, 6)], DAYS = ls(6), STILL = w(6, 3);
const PILES = w(8, 5), PICK = w(8, 6), FAIR = w(9, 7), BECAUSE = w(9, 8), BIGGER = w(9, 12);
const ICUT = w(10, 1), CUT = w(10, 2), CHOOSE = w(10, 3), FAIREST = w(10, 6), TREAS = w(10, 11), CHORES = w(10, 12), BIZ = w(10, 15);
const TAG = ls(11), PARROT = w(11, 4), CTA = ls(12);
const IQT = [ls(1), ls(4), ls(7)];
const GU = { x: 250, y: 1420, s: 0.88 }, AD = { x: 540, y: 1420, s: 0.88 }, FE = { x: 830, y: 1420, s: 0.88 }, GOLD = { x: 540, y: 1405 };
const PERCH = { x: 440, y: 880 };

WK.film({
  flashAt: CUT,
  captions: [
    [0, w(0, 6), ["3 PIRATES.", { y: 290, size: 92, at: [w(0, 0), w(0, 1)] }], ["1 PILE OF GOLD.", { y: 400, size: 92, at: [w(0, 2), w(0, 3), w(0, 4), w(0, 5)], accent: ["GOLD."], acc: "#E9B400" }]],
    [w(0, 6), ls(1), ["HOW DIFFERENT IQs", { y: 290, size: 82, at: [w(0, 6), w(0, 7), w(0, 8), w(0, 9)], accent: ["IQs"] }], ["SPLIT IT", { y: 392, size: 82, at: [w(0, 10), w(0, 11)] }]],
    [ls(2), ls(3), ["“MINE! ALL MINE!”", { y: 290, size: 104, at: [MINE, ALL, w(2, 2)], color: GUC }]],
    [ls(3), ls(4), ["NOBODY HAS GOLD.", { y: 290, size: 86, at: [NOBODY, w(3, 2), w(3, 3)] }], ["OR TEETH.", { y: 400, size: 100, at: [w(3, 4), TEETH], accent: ["TEETH."], acc: GUC }]],
    [ls(5), ls(6), ["“ONE FOR YOU...”", { y: 290, size: 86, at: [w(5, 0), w(5, 1), w(5, 2)], color: FEC }], ["“ONE FOR ME...”", { y: 392, size: 86, at: [w(5, 3), w(5, 4), w(5, 5)], color: FEC }]],
    [ls(6), ls(7), ["3 DAYS LATER.", { y: 290, size: 92, at: [w(6, 0), w(6, 1), w(6, 2)] }], ["STILL COUNTING.", { y: 400, size: 92, at: [STILL, w(6, 4)], accent: ["COUNTING."], acc: FEC }]],
    [ls(8), ls(9), ["“TWO PILES.”", { y: 290, size: 92, at: [w(8, 4), PILES], color: ADC }], ["“YOU PICK FIRST.”", { y: 400, size: 92, at: [PICK, w(8, 7), w(8, 8)], color: ADC }]],
    [ls(9), w(9, 9), ["HER SPLIT HAS TO BE", { y: 290, size: 80, at: [w(9, 1), w(9, 2), w(9, 3), w(9, 4), w(9, 5)] }], ["PERFECTLY FAIR.", { y: 392, size: 92, at: [w(9, 6), FAIR], accent: ["FAIR."], acc: "#3FB8AF" }], "hard"],
    [w(9, 9), ls(10), ["HE'LL GRAB", { y: 290, size: 92, at: [w(9, 9) + 0.14, w(9, 10)] }], ["THE BIGGER PILE.", { y: 392, size: 92, at: [w(9, 11), BIGGER, w(9, 13)], accent: ["BIGGER"], acc: GUC }], "hard"],
    [ls(10), FAIREST, ["I CUT.", { y: 290, size: 112, at: [ICUT, CUT], color: ADC }], ["YOU CHOOSE.", { y: 410, size: 112, at: [CHOOSE, w(10, 4)], color: FEC }], "hard"],
    [FAIREST, TREAS + 0.4, ["FAIREST WAY", { y: 290, size: 96, at: [FAIREST + 0.14, w(10, 7)], accent: ["FAIREST"], acc: "#3FB8AF" }], ["TO SPLIT ANYTHING.", { y: 392, size: 86, at: [w(10, 8), w(10, 9), w(10, 10)] }], "hard"],
    [TREAS + 0.4, TAG, ["TREASURE. CHORES.", { y: 290, size: 86, at: [TREAS + 0.52, CHORES] }], ["EVEN A BUSINESS.", { y: 392, size: 86, at: [w(10, 13), w(10, 14), BIZ], accent: ["BUSINESS."], acc: "#3FB8AF" }]],
    [TAG, CTA, ["“AND ONE FOR", { y: 290, size: 92, at: [w(11, 0), w(11, 1), w(11, 2)], color: PIC }], ["THE PARROT.”", { y: 400, size: 100, at: [w(11, 3), PARROT], color: PIC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(12, 0)] }], ["“SPLIT”", { y: 450, size: 150, at: [w(12, 1)], color: "#E9B400" }], ["for the free fair-split guide", { y: 550, size: 50, at: [w(12, 2), w(12, 3), w(12, 4), w(12, 5), w(12, 6), w(12, 7)], color: "#ddd" }]],
  ],
  cam: [[0, 1.04, 540, 1110], [ls(1) - 0.2, 1.14, 540, 1130],
    [ls(1) + 0.25, 1.62, 290, 1160], [ALL - 0.12, 1.62, 290, 1160], [ALL + 0.3, 1.12, 540, 1130], [ls(4) - 0.1, 1.12, 540, 1130],
    [ls(4), 1.55, 720, 1160, "cut"], [DAYS - 0.15, 1.6, 720, 1160], [DAYS + 0.4, 1.06, 540, 1100], [ls(7) - 0.1, 1.08, 540, 1100],
    [ls(7), 1.62, 540, 1130, "cut"], [ls(9) - 0.15, 1.66, 540, 1140], [ls(9) + 0.35, 1.32, 420, 1150], [BECAUSE - 0.1, 1.32, 420, 1150], [BECAUSE + 0.3, 1.6, 300, 1160],
    [ls(10) - 0.12, 1.6, 300, 1160], [ls(10) + 0.3, 1.1, 540, 1130], [TAG - 0.15, 1.12, 540, 1130], [TAG + 0.4, 1.42, 540, 1220], [CTA - 0.2, 1.42, 540, 1220],
    [CTA + 0.5, 1.1, 540, 1130], [D, 1.14, 540, 1130]],
  render(t, { world: Wg, over }) {
    // the three alternate takes each start from a fresh heap: low (0..ls4), medium (ls4..ls7), high (ls7..)
    const take = t < ls(4) ? 0 : t < ls(7) ? 1 : 2;
    const lapse = t >= DAYS && t < ls(7) ? seg(t, DAYS, STILL) : 0, sky = lapse > 0 && lapse < 1 ? 0.5 - 0.5 * Math.cos(lapse * Math.PI * 6) : 0;
    Wd.deck(Wg, { t, sky });
    const fl = (i) => Math.sin(t * 1.3 + i * 2) * 6; // the ship rocks
    const brawlK = take === 0 && t >= ALL - 0.1 && t < NOBODY + 0.2 ? Math.min(E.outBack(seg(t, ALL - 0.1, ALL + 0.2)), 1 - seg(t, NOBODY - 0.15, NOBODY + 0.2)) : 0;
    const dazed = take === 0 && t >= NOBODY;
    const asleep = take === 1 && t >= DAYS + 0.6;
    // ---------------- Gus
    let gu = Object.assign({}, GU, Wd.GUS, F.happy, { y: GU.y + fl(0), look: [0.6, 0.3] });
    if (t < ls(1)) gu = Object.assign(gu, F.happy, { look: [0.8, 0.5] });
    if (take === 0 && t >= ls(1)) { gu = Object.assign(gu, F.smug, { look: [1, 0.4] }); if (t >= MINE - 0.2) gu = Object.assign(gu, F.shout, { armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" }); }
    if (dazed) gu = Object.assign(gu, F.happy, { eyes: "x", mouth: "grin", look: [0, 0] });
    if (take === 1) { gu = Object.assign(gu, F.calm, { look: [1, 0.5] }); if (asleep) gu = Object.assign(gu, { eyes: "closed", mouth: "o", open: 0.3 }); }
    if (take === 2) { gu = Object.assign(gu, F.happy, { look: [1, 0.3] }); if (t >= PICK && t < ls(10)) { const sw = Math.sin(t * 7) > 0 ? 1 : -1; gu = Object.assign(gu, F.think, { look: [0.9, 0.7 * sw > 0 ? 0.7 : 0.4] }); }
      if (t >= BECAUSE && t < ls(10)) gu = Object.assign(gu, F.smug, { armR: { x: 230, y: -60 }, handR: "open", look: [1, 0.8] });
      if (t >= ls(10) && t < TAG) gu = Object.assign(gu, F.happy, { armL: { x: -60, y: -160 }, armR: { x: 120, y: -160 }, look: [0.8, 0.6] });
      if (t >= TAG) gu = Object.assign(gu, t < PARROT + 0.3 ? F.shock : F.angry, { look: [0.6, -0.6] }); }
    if (speaking(t, 2)) { gu.mouth = "shout"; gu.open = 0.4 + talkOpen(t, 1) * 0.6; }
    // ---------------- Fen
    let fe = Object.assign({}, FE, Wd.FEN, F.calm, { y: FE.y + fl(1), look: [-0.7, 0.4] });
    if (take === 0 && t >= MINE && !dazed) fe = Object.assign(fe, F.shock, { look: [-1, 0] });
    if (dazed) fe = Object.assign(fe, F.sad, { eyes: "x", look: [0, 0] });
    if (take === 1) { fe = Object.assign(fe, F.think, { look: [-1, 0.8], armL: { x: -220, y: -40 }, handL: "open" });
      if (t >= DAYS) fe = Object.assign(fe, { eyes: "half", tired: 1, mouth: "flat", sweat: 0 }); }
    if (take === 2) { fe = Object.assign(fe, F.calm, { look: [-1, 0.2] }); if (t >= ls(10) && t < TAG) fe = Object.assign(fe, F.happy, { look: [-1, 0.5] }); if (t >= TAG) fe = Object.assign(fe, F.shock, { look: [-0.6, -0.6] }); }
    if (speaking(t, 5)) { fe.mouth = "o"; fe.open = talkOpen(t, 2) * 0.7; }
    // ---------------- Ada
    let ad = Object.assign({}, AD, Wd.ADA, F.calm, { y: AD.y + fl(2), look: [0, 0.3] });
    if (take === 0 && t >= MINE && !dazed) ad = Object.assign(ad, F.shock, { look: [-1, 0] });
    if (dazed) ad = Object.assign(ad, F.deadpan, { eyes: "x", look: [0, 0] });
    if (take === 1) { ad = Object.assign(ad, F.deadpan, { look: [1, 0.6] }); if (asleep) ad = Object.assign(ad, { eyes: "closed", mouth: "flat" }); }
    if (take === 2) { ad = Object.assign(ad, F.smug, { look: [0, 0.8] });
      if (t >= ls(8) && t < PICK) ad = Object.assign(ad, F.calm, { look: [0, 0.9], armL: { x: -150, y: -30 }, armR: { x: 150, y: -30 }, handL: "open", handR: "open" });
      if (t >= PICK && t < ls(9)) ad = Object.assign(ad, F.smug, { look: [-1, 0], armL: { x: -230, y: -120 }, handL: "point" });
      if (t >= ls(9) && t < ls(10)) ad = Object.assign(ad, F.think, { look: [0, 0.9], armR: { x: 110, y: -40 }, handR: "open" });
      if (t >= ls(10) && t < TAG) ad = Object.assign(ad, F.smug, { look: [0, 0] });
      if (t >= TAG) ad = Object.assign(ad, F.deadpan, { look: [-0.3, -0.6] }); }
    if (speaking(t, 8)) { ad.mouth = "smile"; ad.open = talkOpen(t, 3) * 0.6; }
    [gu, ad, fe].forEach((c, i) => { if (blink(t, i * 0.9) && c.eyes === "open") c.eyes = "closed"; P.draw(Wg, c); });
    // dazed stars + flying tooth
    if (dazed) [GU, AD, FE].forEach((c, i) => { for (let j = 0; j < 3; j++) { const a = t * 4 + j * 2.1 + i; K.txt(Wg, c.x + Math.cos(a) * 90, c.y - 470 + Math.sin(a) * 22, "★", 40, "#E9B400"); } });
    if (take === 0 && t >= TEETH - 0.3 && t < TEETH + 0.9) { const k = seg(t, TEETH - 0.3, TEETH + 0.9); el("rect", { x: lerp(GU.x + 30, 1150, k), y: lerp(1150, 700, E.outQuad(k)) + arc(k, 160), width: 26, height: 32, rx: 9, fill: "#fff", stroke: "#1d1b1a", "stroke-width": 4, transform: `rotate(${k * 700} ${lerp(GU.x + 30, 1150, k) + 13} ${lerp(1150, 700, E.outQuad(k)) + 16})` }, Wg); }
    // ---------------- the parrot (watches from the mast, steals a coin at the tag)
    let px = PERCH.x, py = PERCH.y + Math.sin(t * 2) * 4, flap = 0, ps = 0.62, beak = 0;
    if (take === 0 && brawlK > 0) { px = PERCH.x + Math.sin(t * 9) * 10; flap = 1; }
    if (t >= TAG - 0.2) { const k = seg(t, TAG - 0.2, w(11, 1)); px = lerp(PERCH.x, GOLD.x + 130, E.inOutSine(k)); py = lerp(PERCH.y, 1230, E.inOutSine(k)) - arc(k, 120); flap = k < 1 ? 1 : 0; ps = lerp(0.62, 0.8, k);
      if (t >= PARROT) { const k2 = seg(t, PARROT, PARROT + 1.0); px = lerp(GOLD.x + 130, 1200, E.inQuad(k2)); py = lerp(1230, 650, E.inQuad(k2)); flap = 1; } }
    if (speaking(t, 11)) beak = talkOpen(t, 4);
    // ---------------- gold on the rail
    let gold = { x: GOLD.x, y: GOLD.y, s: 1.45, amount: 1, split: 0, t };
    if (take === 0 && t >= ALL) gold.amount = 1 - seg(t, ALL, NOBODY);
    if (take === 1) gold.amount = 1 - 0.55 * seg(t, ls(5), STILL);
    if (take === 2) { gold.split = E.outBack(seg(t, w(8, 3), PILES + 0.1)); gold.bias = t < ls(9) ? 0.6 : lerp(0.6, 0, E.inOutSine(seg(t, w(9, 2), FAIR))); if (t >= ls(10) - 0.2) gold.bias = 0; }
    if (!(take === 2 && t >= ls(10) && t < TAG)) Wd.rail(Wg, {});
    else Wd.rail(Wg, {});
    if (gold.amount > 0.02) Wd.gold(Wg, gold);
    if (take === 1) { // counted stacks + flying coins
      const n = Math.floor(seg(t, ls(5), STILL) * 14) + COUNT.filter((c) => t >= c + 0.5).length;
      for (const [sx, cnt] of [[340, Math.ceil(n / 2)], [740, Math.floor(n / 2)]]) for (let i = 0; i < Math.min(cnt, 9); i++) el("ellipse", { cx: sx, cy: 1395 - i * 12, rx: 26, ry: 11, fill: "#F2C14E", stroke: "#1d1b1a", "stroke-width": 3 }, Wg);
      COUNT.forEach((c, i) => { if (t >= c && t < c + 0.5) { const k = seg(t, c, c + 0.5), tx = i === 1 ? 740 : 340; K.coin(Wg, { x: lerp(GOLD.x, tx, k), y: lerp(1380, 1300, k) - arc(k, 160), s: 0.45, spin: t * 3 }); } });
      Wd.tally(Wg, { x: 640, y: 560, s: 1, n: lapse > 0 ? Math.round(lapse * 15) : 0 });
      if (asleep) [GU, AD].forEach((c, i) => { const ph = (t * 0.7 + i * 0.5) % 1; K.txt(Wg, c.x + 70 + ph * 40, c.y - 420 - ph * 80, "z", 40 + ph * 30, "#555"); }); }
    Wd.brawl(Wg, { x: 540, y: 1180, s: 1.6, t, k: brawlK });
    if (take === 0 && t >= ALL && t < NOBODY + 0.4) for (let i = 0; i < 6; i++) { const ph = clamp((t - ALL - i * 0.18) / 0.9); if (ph > 0 && ph < 1) K.coin(Wg, { x: lerp(540, i % 2 ? 1250 : -150, ph), y: 1150 - arc(ph, 350) + ph * 300, s: 0.4, spin: t * 4 + i }); }
    if (take === 2 && t >= ls(10) && t < ls(10) + 0.8) FX.sparkle(Wg, { x: GOLD.x, y: 1330, k: seg(t, ls(10), ls(10) + 0.8), r: 300, n: 10, s: 1 });
    el("rect", { x: 330, y: PERCH.y + 70, width: 200, height: 22, rx: 10, fill: "#8A5A3A", stroke: "#1d1b1a", "stroke-width": 6 }, Wg);
    Wd.parrot(Wg, { x: px, y: py, s: ps, t, beak, flap });
    if (t >= PARROT) K.coin(Wg, { x: px + 50 * ps, y: py - 55 * ps, s: 0.32, spin: t * 3 });
    // ---------------- over: IQ cards, I-cut-you-choose card, the three uses
    IQT.forEach((a, i) => { const end = Math.min([ls(2) + 0.6, ls(5) + 0.5, ls(8) + 0.4][i], a + 1.7), k = Math.min(E.outBack(seg(t, a, a + 0.25)), 1 - seg(t, end - 0.35, end)); if (t >= a && t < end) Wd.iq(over, { x: 540, y: 560, level: i + 1, k: k * 0.85 }); });
    if (t >= CUT - 0.25 && t < TREAS) { const k = Math.min(E.outBack(seg(t, CUT - 0.25, CUT + 0.05)), 1 - seg(t, TREAS - 0.3, TREAS)); const stage = t < CUT ? 0 : t < CHOOSE ? 1 : t < FAIREST ? 2 : 3;
      Wd.cut(over, { x: 540, y: 880, s: 0.98, k, stage, t }); }
    if (t >= TREAS - 0.1 && t < TAG + 0.1) { const out = 1 - seg(t, TAG - 0.25, TAG + 0.1);
      [[TREAS, 220, "TREASURE"], [CHORES, 540, "CHORES"], [BIZ, 860, "BUSINESS"]].forEach(([a, x, lab], i) => { const k = E.outBack(seg(t, a - 0.1, a + 0.2)) * out; if (k <= 0) return;
        const g = el("g", { transform: `translate(${x} 700) scale(${k}) rotate(${(i - 1) * 4})` }, over);
        el("rect", { x: -150, y: -150, width: 300, height: 300, rx: 30, fill: "#fff", stroke: "#1d1b1a", "stroke-width": 8 }, g);
        if (i === 0) { Wd.chest(g, { x: 0, y: 40, s: 0.7 }); Wd.gold(g, { x: 0, y: -40, s: 0.35, t }); }
        if (i === 1) { el("line", { x1: -60, y1: -90, x2: 30, y2: 50, stroke: "#8A5A3A", "stroke-width": 14, "stroke-linecap": "round" }, g); el("path", { d: "M10,30 L70,90 L20,110 L-30,60 Z", fill: "#E9B400", stroke: "#1d1b1a", "stroke-width": 6 }, g);
          el("line", { x1: -110, y1: 70, x2: 0, y2: 70, stroke: "#1d1b1a", "stroke-width": 6, "stroke-dasharray": "14 10" }, g); }
        if (i === 2) { K.coin(g, { x: -55, y: -10, s: 0.55, sym: "50" }); K.coin(g, { x: 55, y: -10, s: 0.55, sym: "50" }); el("line", { x1: 0, y1: -80, x2: 0, y2: 70, stroke: "#E5484D", "stroke-width": 7, "stroke-dasharray": "12 10" }, g); }
        K.txt(g, 0, 125, lab, 40, "#1d1b1a"); }); }
    const sh = [shake(t, MINE, MINE + 0.3, 14, 1), shake(t, ALL, NOBODY, 10, 2), shake(t, CUT, CUT + 0.45, 20, 7), shake(t, PARROT, PARROT + 0.35, 14, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#7EC8E3" };
  },
});
