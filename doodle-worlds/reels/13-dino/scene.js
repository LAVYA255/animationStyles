/* World 13 · Dinosaur age · "The dinosaurs ignored a tiny competitor" (55.4 s). Parable (disruption).
   Hook: Rex's smug face -> snap-zoom to tiny Mo waving -> "biggest mistake ever". Rex: big food for big customers (a
   long-neck chomps), "too big to fail". Night: Mo opens a tiny stall (bugs). Rex laughs "tiny market!", then sleeps. Mo
   learns every night: the queue grows, the stall upgrades. Meteor (the one flash) -> ash sky, big food gone, Rex starving,
   the long-neck sad -> "the only one who knew how to live on tiny... was Mo" (the drop, "TINY WINS.") -> niche diagram ->
   tag: Rex whispers for beetles, Mo flips his sign to PREMIUM PRICE -> CTA. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const REC = "#3F8A45", MOC = "#9A6B4A";
const TINY = w(0, 4), BIGGEST = w(0, 6), CUST = w(1, 12), MAMMAL = w(3, 3), NIGHT = w(3, 6), BUGS = w(3, 9);
const LAUGH = ls(5), TINYM = w(5, 4), CARE = w(6, 6), SO = w(6, 7), EVERY = ls(7), MORE7 = w(7, 7);
const CHANGED = w(8, 3), GONE = w(9, 2), STARVE = w(9, 5), MO = w(10, 12), DISRUPT = w(11, 1), START = w(11, 2);
const TAG = ls(12), PREM = w(13, 2), CTA = ls(14);
const RX = { x: 280, y: 1450 }, MS = { x: 880, y: 1490 };

WK.film({
  flashAt: CHANGED,
  titleSlam: { text: "TINY WINS.", at: MO, until: DISRUPT - 0.05, color: "#E9B400", size: 160, y: 330 },
  captions: [
    [0, BIGGEST, ["THE DINOSAURS IGNORED", { y: 290, size: 80, at: [w(0, 0), w(0, 1), w(0, 2)] }], ["A TINY COMPETITOR.", { y: 400, size: 92, at: [w(0, 3), TINY, w(0, 5)], accent: ["TINY"], acc: "#E5484D" }]],
    [BIGGEST, w(1, 4), ["BIGGEST MISTAKE EVER.", { y: 300, size: 92, at: [BIGGEST, w(0, 7), w(0, 8)] }]],
    [w(1, 4), ls(2), ["THE BIGGEST BUSINESS.", { y: 290, size: 84, at: [w(1, 4) + 0.1, w(1, 4) + 0.2, w(1, 5)] }], ["BIG FOOD. BIG CUSTOMERS.", { y: 392, size: 78, at: [w(1, 9), w(1, 10), CUST, w(1, 13)] }]],
    [ls(2), ls(3), ["“I AM TOO BIG", { y: 290, size: 100, at: [w(2, 0), w(2, 1), w(2, 2), w(2, 3)], color: REC }], ["TO FAIL.”", { y: 400, size: 100, at: [w(2, 4), w(2, 5)], color: REC }], "hard"],
    [ls(3), w(4, 1), ["A TINY MAMMAL OPENED", { y: 290, size: 82, at: [w(3, 1), w(3, 2), MAMMAL, w(3, 4)], accent: ["TINY"], acc: "#E5484D" }], ["A NIGHT STALL. SELLING BUGS.", { y: 392, size: 70, at: [w(3, 5), NIGHT, w(3, 7), w(3, 8), BUGS] }], "hard"],
    [w(4, 1), ls(5), ["“NIGHT SNACKS!”", { y: 290, size: 100, at: [w(4, 1) + 0.12, w(4, 1) + 0.24], color: MOC }], ["“CRUNCHY BEETLES!”", { y: 400, size: 92, at: [w(4, 2), w(4, 3)], color: MOC }]],
    [ls(5), ls(6), ["“BUGS? AT NIGHT?”", { y: 290, size: 96, at: [w(5, 1), w(5, 2), w(5, 3)], color: REC }], ["“TINY MARKET!”", { y: 400, size: 104, at: [TINYM, w(5, 5)], color: REC }]],
    [ls(6), ls(7), ["TOO SMALL FOR A GIANT TO CARE.", { y: 290, size: 70, at: [w(6, 0), w(6, 1), w(6, 2), w(6, 4), CARE] }], ["MO HAD IT ALL TO HIMSELF.", { y: 392, size: 74, at: [w(6, 8), w(6, 9), w(6, 11), w(6, 12), w(6, 13)], accent: ["HIMSELF."], acc: MOC }], "hard"],
    [ls(7), ls(8), ["EVERY NIGHT HE LEARNED.", { y: 290, size: 80, at: [w(7, 0), w(7, 1), w(7, 2), w(7, 3)] }], ["FASTER. MORE CUSTOMERS.", { y: 392, size: 80, at: [w(7, 5), MORE7, w(7, 8)] }]],
    [ls(8), ls(9), ["THEN THE WORLD", { y: 290, size: 96, at: [w(8, 0), w(8, 1), w(8, 2)] }], ["CHANGED.", { y: 410, size: 120, at: [CHANGED], color: "#E5484D" }]],
    [ls(9), ls(10), ["BIG FOOD? GONE.", { y: 290, size: 92, at: [w(9, 0), w(9, 1), GONE] }], ["BIG CUSTOMERS? STARVING.", { y: 400, size: 78, at: [w(9, 3), w(9, 4), STARVE], accent: ["STARVING."], acc: "#E5484D" }]],
    [ls(10), MO, ["THE ONLY ONE WHO KNEW", { y: 290, size: 82, at: [w(10, 1), w(10, 2), w(10, 3), w(10, 4), w(10, 5)] }], ["HOW TO LIVE ON TINY...", { y: 392, size: 82, at: [w(10, 6), w(10, 7), w(10, 8), w(10, 9), w(10, 10)], accent: ["TINY..."], acc: "#E9B400" }]],
    [DISRUPT, w(12, 1), ["THAT'S DISRUPTION.", { y: 290, size: 92, at: [DISRUPT + 0.1] }], ["START WHERE GIANTS WON'T LOOK.", { y: 392, size: 68, at: [START, w(11, 3), w(11, 5), w(11, 6), w(11, 7)] }], "hard"],
    [w(12, 1), ls(13), ["“PSST... ANY", { y: 290, size: 100, at: [w(12, 1) + 0.12, w(12, 1) + 0.22], color: REC }], ["BEETLES LEFT?”", { y: 400, size: 92, at: [w(12, 2) + 0.1, w(12, 3)], color: REC }]],
    [ls(13), CTA, ["“FOR YOU?”", { y: 290, size: 100, at: [w(13, 0), w(13, 1)], color: MOC }], ["“PREMIUM PRICE.”", { y: 400, size: 104, at: [PREM, w(13, 3)], color: "#E9B400" }], "hard"],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(14, 0)] }], ["“SMALL”", { y: 450, size: 150, at: [w(14, 1)], color: "#E9B400" }], ["for the free niche finder", { y: 550, size: 50, at: [w(14, 2), w(14, 3), w(14, 4), w(14, 5), w(14, 6)], color: "#ddd" }]],
  ],
  cam: [[0, 1.75, 450, 880], [TINY - 0.25, 1.78, 450, 880], [TINY + 0.08, 2.4, 870, 1330], [BIGGEST - 0.2, 2.42, 870, 1330], [BIGGEST + 0.3, 1.05, 540, 1060],
    [ls(2) - 0.15, 1.05, 540, 1060], [ls(2) + 0.25, 1.7, 450, 880], [ls(3) - 0.1, 1.72, 450, 880], [ls(3) + 0.4, 1.05, 540, 1060], [NIGHT - 0.1, 1.05, 540, 1060],
    [NIGHT + 0.3, 2.2, 860, 1300], [ls(5) - 0.1, 2.2, 860, 1300], [ls(5) + 0.3, 1.05, 560, 1060], [SO - 0.15, 1.05, 560, 1060], [SO + 0.25, 2.2, 860, 1300],
    [EVERY - 0.1, 2.2, 860, 1300], [EVERY + 0.35, 1.5, 760, 1350], [ls(8) - 0.1, 1.5, 760, 1350], [ls(8) + 0.4, 1.0, 540, 1000], [ls(9) + 0.3, 1.05, 540, 1060],
    [ls(10) + 0.2, 1.05, 540, 1060], [MO - 0.1, 1.6, 780, 1320], [DISRUPT - 0.2, 1.62, 780, 1320], [DISRUPT + 0.3, 1.05, 540, 1060], [TAG - 0.1, 1.05, 540, 1060],
    [TAG + 0.3, 1.5, 700, 1180], [CTA - 0.2, 1.52, 700, 1180], [CTA + 0.5, 1.05, 540, 1060], [D, 1.08, 540, 1060]],
  render(t, { world: Wg, over }) {
    // sky: day -> night (line 3) -> nights cycle (line 7) -> night -> meteor -> ash
    let night = t < w(3, 4) ? 0 : E.inOutSine(seg(t, w(3, 4), w(3, 7))), ash = 0;
    if (t >= EVERY && t < ls(8)) night = 0.6 + 0.4 * Math.cos(seg(t, EVERY, ls(8) - 0.2) * Math.PI * 6);
    if (t >= CHANGED) { ash = E.outQuad(seg(t, CHANGED, CHANGED + 0.9)); night = lerp(1, 0.35, ash); }
    Wd.valley(Wg, { t, night, ash });
    if (t >= ls(8) && t < CHANGED + 0.05) Wd.meteor(Wg, { k: seg(t, ls(8), CHANGED) });
    if (t >= CHANGED && t < CHANGED + 1.2) { const k = seg(t, CHANGED, CHANGED + 1.2); el("circle", { cx: 660, cy: 760, r: 100 + k * 900, fill: "#FFB15A", opacity: 0.7 * (1 - k) }, Wg); }
    // long-neck customer: day visit, then the starving return
    const lnIn = t >= CUST - 0.9 && t < ls(3) + 0.6 ? Math.min(E.outQuad(seg(t, CUST - 0.9, CUST)), 1 - seg(t, ls(3), ls(3) + 0.6)) : t >= STARVE - 1.0 && t < ls(10) + 0.6 ? Math.min(E.outQuad(seg(t, STARVE - 1.0, STARVE)), 1 - seg(t, ls(10), ls(10) + 0.6)) : 0;
    if (lnIn > 0) Wd.longneck(Wg, { x: lerp(1600, 1150, lnIn), y: lerp(200, 560, lnIn), t, chew: t < ls(3) && t > CUST ? 0.5 + 0.5 * Math.sin(t * 9) : 0, sad: t > ls(9) ? 1 : 0 });
    // ---------------- Rex
    let rx = { x: RX.x, y: RX.y + Math.sin(t * 1.3) * 5, s: 1, t, jaw: 0, eye: "open", look: [0.6, 0], brow: 1, lean: 0, skinny: 0, arms: 0 };
    if (t < TINY) rx = Object.assign(rx, { eye: "half", look: [0.4, 0] });
    if (t >= ls(1) && t < ls(2)) rx = Object.assign(rx, { eye: "half", brow: 1 });
    if (speaking(t, 2)) rx = Object.assign(rx, { eye: "half", jaw: 0.15 + talkOpen(t, 1) * 0.5, lean: -6, arms: 2 });
    if (t >= ls(3) && t < LAUGH) rx = Object.assign(rx, { eye: t < w(3, 9) ? "half" : "open", look: [1, 0.6] });
    if (t >= LAUGH && t < ls(6)) rx = Object.assign(rx, { eye: "happy", jaw: 0.3 + talkOpen(t, 2) * 0.6, lean: -8 + Math.sin(t * 14) * 3, arms: 1 });
    if (t >= ls(6) && t < ls(8)) rx = Object.assign(rx, { eye: t < CARE ? "half" : "closed", look: [-1, 0], lean: t < CARE ? 0 : 6, brow: 0 });
    if (t >= ls(8) && t < CHANGED) rx = Object.assign(rx, { eye: "wide", look: [-0.6, -1], jaw: 0.4, brow: -0.5 });
    if (t >= CHANGED) rx = Object.assign(rx, { eye: "wide", look: [0, 0], jaw: 0.2, brow: -0.5, skinny: E.inOutSine(seg(t, GONE, STARVE)) });
    if (t >= GONE) rx = Object.assign(rx, { eye: "half", jaw: 0.05, sweat: 1 });
    if (t >= ls(10)) rx = Object.assign(rx, { eye: "open", look: [1, 0.6], tear: t > MO ? 1 : 0, sweat: 0 });
    if (t >= TAG) { const k = E.inOutSine(seg(t, TAG - 0.2, TAG + 0.4)); rx = Object.assign(rx, { lean: 26 * k, eye: "open", look: [1, 0.8], blushK: 0.6, tear: 0, jaw: speaking(t, 12) ? 0.1 + talkOpen(t, 3) * 0.2 : 0.05 }); }
    if (t >= PREM) rx = Object.assign(rx, { eye: "wide", look: [1, 0.8], sweat: 1, jaw: 0.35, blushK: 0 });
    if (t >= CTA) rx = Object.assign(rx, { eye: "half", jaw: 0.1 });
    if (rx.eye === "open" && blink(t, 0.3)) rx.eye = "closed";
    Wd.rex(Wg, rx);
    if (t >= CARE && t < ls(8)) for (let i = 0; i < 2; i++) { const ph = (t * 0.6 + i * 0.5) % 1; K.txt(Wg, RX.x + 140 + ph * 60, 580 - ph * 120, "Z", 54 + ph * 30, "#555"); }
    // ---------------- Rex's stall (food gone after the meteor)
    Wd.rexStall(Wg, { food: t < CHANGED ? 1 : 1 - seg(t, GONE - 0.3, GONE + 0.2), closed: t < GONE ? 0 : E.outBack(seg(t, GONE, GONE + 0.35)), t });
    // ---------------- queue of tiny customers
    const q = t < EVERY ? (t >= SO ? 1 : 0) : t < ls(8) ? 1 + Math.floor(seg(t, EVERY, ls(8) - 0.3) * 4.99) : t < CHANGED + 0.4 ? 5 : t < ls(10) ? 0 : 5;
    for (let i = 0; i < q; i++) { const pop = t >= ls(10) ? E.outBack(seg(t, ls(10) + i * 0.15, ls(10) + i * 0.15 + 0.3)) : 1; const Q = [[790, 1610], [700, 1725], [585, 1770], [470, 1790], [355, 1800]][i]; if (pop > 0) Wd.critter(Wg, { x: Q[0], y: Q[1], s: 0.75 * pop, kind: i, t }); }
    // ---------------- Mo + his stall
    const stallK = t < NIGHT - 0.1 ? 0 : E.outBack(seg(t, NIGHT - 0.1, NIGHT + 0.25)), lvl = t < MORE7 ? 0 : E.outBack(seg(t, MORE7, MORE7 + 0.4));
    let mo = { x: MS.x, y: MS.y, s: 0.9, t, talk: 0, eye: "open", arm: 0, look: 0, bounce: 0 };
    if (t >= TINY && t < BIGGEST + 0.4) mo = Object.assign(mo, { arm: 2, eye: "happy", bounce: 1 });
    if (t >= BIGGEST + 0.4 && t < ls(3)) mo = Object.assign(mo, { look: -1 });
    if (t >= NIGHT && t < LAUGH) mo = Object.assign(mo, { arm: 1, eye: "happy" });
    if (speaking(t, 4)) mo = Object.assign(mo, { talk: talkOpen(t, 4), eye: "open", arm: 1, bounce: 1 });
    if (t >= LAUGH && t < ls(6)) mo = Object.assign(mo, { eye: "wide", look: -1 });
    if (t >= SO && t < EVERY) mo = Object.assign(mo, { eye: "happy", arm: 2 });
    if (t >= EVERY && t < ls(8)) mo = Object.assign(mo, { eye: "happy", arm: Math.floor(t * 6) % 2 ? 1 : 2, bounce: 1 });
    if (t >= ls(8) && t < GONE) mo = Object.assign(mo, { eye: "wide", look: -1 });
    if (t >= ls(10) && t < TAG) mo = Object.assign(mo, { eye: "happy", arm: Math.floor(t * 4) % 2 ? 1 : 2, bounce: t >= MO ? 1 : 0 });
    if (t >= TAG) mo = Object.assign(mo, { eye: "wide", look: -1 });
    if (t >= ls(13)) mo = Object.assign(mo, { eye: "happy", look: -1, arm: t >= PREM ? 1 : 0 });
    if (speaking(t, 13)) mo.talk = talkOpen(t, 5);
    if (mo.eye === "open" && blink(t, 1.7)) mo.eye = "closed";
    Wd.mo(Wg, mo);
    Wd.moStall(Wg, { x: MS.x, y: MS.y, lvl, t, k: stallK, glow: night > 0.3 ? 1 : 0.4, price: t >= PREM ? 1 : 0 });
    if (t >= PREM && t < PREM + 0.6) FX.sparkle(Wg, { x: MS.x - 90, y: 1210, k: seg(t, PREM, PREM + 0.6), r: 120, n: 7, s: 0.6 });
    if (t >= MO && t < MO + 0.9) FX.sparkle(Wg, { x: MS.x, y: 1300, k: seg(t, MO, MO + 0.9), r: 260, n: 12, s: 1 });
    // ---------------- over: customer counter, niche diagram
    if (t >= EVERY && t < ls(8)) { const k = Math.min(E.outBack(seg(t, EVERY, EVERY + 0.25)), 1 - seg(t, ls(8) - 0.3, ls(8))); K.counter(over, { x: 540, y: 545, s: 1.25 * k, n: lerp(1, 300, E.inQuad(seg(t, EVERY + 0.2, ls(8) - 0.3))), label: "CUSTOMERS" }); }
    if (t >= DISRUPT && t < TAG) { const k = Math.min(E.outBack(seg(t, DISRUPT, DISRUPT + 0.3)), 1 - seg(t, TAG - 0.3, TAG)); Wd.niche(over, { x: 540, y: 900, s: 1.0, k, glow: seg(t, START, START + 0.4), t }); }
    const sh = [shake(t, CHANGED, CHANGED + 1.0, 26, 3), shake(t, LAUGH, LAUGH + 0.6, 6, 5), shake(t, MO, MO + 0.4, 12, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#8FD3F0" };
  },
});
