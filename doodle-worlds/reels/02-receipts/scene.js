/* World 2 · Sumer · "Humans invented writing for receipts" (52.9 s). Hook: a love poem gets crossed out; a clay receipt slams in.
   Nisa lends Duru ten sacks -> harvest: "Ten? I borrowed three." -> her memory vs his -> next time: ten marks in wet clay + his
   seal -> next harvest: "I borrowed thr-" / "The clay says ten." (drop, the one flash) -> paid in full; the whole city writes
   -> trust: memory lies, clay doesn't -> tag: "...Can I pay in beer?" -> she presses a new mark. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const NISAC = "#2F6FB0", DURUC = "#B9774A";
const POEMS = w(0, 5), THEY = w(0, 6), RECEIPTS = w(0, 10), SUMER = w(1, 5), NISA = w(1, 6);
const DURUIN = ls(2) - 0.35, TEN = w(2, 2), HARV1 = ls(3), THREE = w(4, 3), MEM = w(5, 6), HIS = w(5, 8);
const NEXT = ls(6), PRESSED = w(6, 4), CLAY = w(6, 9), SEAL = w(6, 15), HARV2 = ls(7), THR = ls(8), DROP = w(9, 3);
const FULL = w(10, 2), SOON = w(10, 3), TRUST = w(11, 7), LIES = w(11, 9), DOESNT = w(11, 11), BEER = ls(12), CTA = ls(13);
const NI = { x: 352, y: 1420, s: 1.05 }, DU = { x: 742, y: 1420, s: 1.05 }, COUNTER = 1405, TAB = { x: 548, y: 1300 };

WK.film({
  flashAt: DROP,
  titleSlam: { text: "PROOF.", at: DROP, until: FULL - 0.25, color: "#B9774A", size: 170 },
  captions: [
    [0, THEY, ["NOT FOR POEMS...", { y: 290, size: 92, at: [w(0, 1), w(0, 4), POEMS] }]],
    [THEY, ls(1), ["IT WAS FOR RECEIPTS.", { y: 290, size: 84, at: [THEY, w(0, 7), w(0, 9), RECEIPTS], accent: ["RECEIPTS."] }]],
    [ls(1), ls(2), ["5,000 YEARS AGO...", { y: 290, size: 82, at: [w(1, 0), w(1, 2), w(1, 3)] }], ["SUMER.", { y: 392, size: 96, at: [SUMER], accent: ["SUMER."], acc: "#D9A441" }]],
    [ls(2), HARV1, ["“LEND ME 10 SACKS!”", { y: 290, size: 80, at: [w(2, 0), w(2, 1), TEN, w(2, 3)], color: DURUC }], ["“I PAY AFTER HARVEST!”", { y: 392, size: 72, at: [w(2, 4), w(2, 5), w(2, 8), w(2, 9)], color: DURUC }]],
    [HARV1, ls(4), ["HARVEST.", { y: 300, size: 110, at: [HARV1], color: "#C8902E" }]],
    [ls(4), ls(5), ["“TEN? I BORROWED THREE.”", { y: 290, size: 72, at: [w(4, 0), w(4, 1), w(4, 2), THREE], color: DURUC, accent: ["THREE.”"], acc: "#E5484D" }]],
    [ls(5), NEXT, ["NO PROOF.", { y: 290, size: 100, at: [w(5, 2), w(5, 3)] }], ["HER MEMORY VS HIS.", { y: 392, size: 80, at: [w(5, 5), MEM, MEM + 0.2, HIS], accent: ["VS"] }]],
    [NEXT, HARV2, ["10 MARKS IN WET CLAY", { y: 290, size: 76, at: [w(6, 5), w(6, 6), w(6, 8), CLAY], accent: ["CLAY"], acc: "#B9774A" }], ["+ HIS SEAL.", { y: 392, size: 92, at: [w(6, 13), SEAL], accent: ["SEAL."], acc: "#2F6FB0" }]],
    [HARV2, THR, ["NEXT HARVEST.", { y: 300, size: 100, at: [w(7, 0), w(7, 1)], color: "#C8902E" }]],
    [THR, DROP - 0.1, ["“I BORROWED THR—”", { y: 300, size: 84, at: [w(8, 0), w(8, 1), w(8, 2)], color: DURUC }], "hard"],
    [FULL - 0.1, TRUST - 0.8, ["PAID IN FULL.", { y: 290, size: 96, at: [w(10, 0), w(10, 1), FULL], accent: ["FULL."] }], ["THEN THE WHOLE CITY WROTE.", { y: 392, size: 66, at: [SOON, w(10, 5), w(10, 6), w(10, 7), w(10, 9)] }]],
    [TRUST - 0.8, LIES - 0.2, ["IT STARTED WITH TRUST.", { y: 300, size: 84, at: [w(11, 5), w(11, 6), w(11, 7) - 0.1, TRUST], accent: ["TRUST."], acc: "#2F6FB0" }]],
    [LIES - 0.2, BEER, ["MEMORY LIES.", { y: 290, size: 96, at: [w(11, 8), LIES], accent: ["LIES."], acc: "#E5484D" }], ["CLAY DOESN'T.", { y: 392, size: 96, at: [w(11, 10), DOESNT], accent: ["CLAY"], acc: "#B9774A" }]],
    [BEER, CTA, ["“...CAN I PAY IN BEER?”", { y: 300, size: 76, at: [w(12, 0), w(12, 1), w(12, 2), w(12, 4)], color: DURUC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(13, 0)] }], ["“RECORD”", { y: 450, size: 140, at: [w(13, 1)], color: "#B9774A" }], ["for the free invoice template", { y: 550, size: 52, at: [w(13, 2), w(13, 3), w(13, 4), w(13, 5), w(13, 6)], color: "#666" }]],
  ],
  cam: [[0, 1.6, 540, 1010], [ls(1) - 0.1, 1.6, 540, 1010], [ls(1) + 0.7, 1.45, 440, 1215], [DURUIN, 1.45, 440, 1215], [DURUIN + 0.5, 1.4, 548, 1225],
    [HARV1 - 0.1, 1.4, 548, 1225], [ls(4) - 0.1, 1.42, 548, 1215], [ls(4) + 0.3, 1.7, 715, 1190], [ls(5) - 0.1, 1.7, 715, 1190], [ls(5) + 0.4, 1.3, 548, 1150],
    [NEXT - 0.1, 1.3, 548, 1150], [PRESSED - 0.3, 2.55, 548, 1320], [HARV2 - 0.15, 2.55, 548, 1320], [HARV2 + 0.4, 1.4, 548, 1225], [THR - 0.05, 1.42, 560, 1225],
    [THR + 0.3, 1.7, 715, 1190], [ls(9) - 0.05, 1.7, 715, 1190], [ls(9) + 0.25, 1.7, 400, 1190], [DROP - 0.05, 1.7, 400, 1190], [DROP + 0.25, 1.4, 548, 1215],
    [SOON - 0.1, 1.4, 548, 1215], [SOON + 0.7, 0.86, 540, 1060], [TRUST - 1.0, 0.86, 540, 1060], [TRUST - 0.4, 1.4, 548, 1215], [D, 1.48, 548, 1215]],
  render(t, { world: Wg, over }) {
    // harvest light: first harvest, cleared for the next loan, second harvest, then stays
    let hv = 0; if (t >= HARV1 - 0.4 && t < NEXT) hv = Math.min(seg(t, HARV1 - 0.4, HARV1 + 0.1), 1 - seg(t, NEXT - 0.3, NEXT + 0.1)); if (t >= HARV2 - 0.4) hv = Math.min(seg(t, HARV2 - 0.4, HARV2 + 0.1), 1 - seg(t, SOON, SOON + 0.5));
    Wd.set(Wg, { harvest: hv, t });
    // the whole city writing: heads over the wall, tablets popping up
    if (t >= SOON - 0.1 && t < TRUST - 0.4) { const k = seg(t, SOON - 0.1, SOON + 0.4);
      Kit.crowd(Wg, { x: 540, y: 920, s: 0.8, n: 9, spread: 150, tone: "#B98A5E", t, seed: 5 });
      for (let i = 0; i < 12; i++) { const r = MK.rng(i + 21), at = SOON + i * 0.18, kk = E.outBack(seg(t, at, at + 0.25)); if (kk > 0) Wd.tablet(Wg, { x: -60 + r() * 1200, y: 760 - r() * 360 - 30 * Math.sin(t * 2 + i), s: 0.22 * kk, rot: (r() - 0.5) * 30, marks: 3 + Math.floor(r() * 7), seal: 1, wet: 0 }); } }

    // ---------------- Nisa
    let ni = null;
    if (t >= ls(1) - 0.2) {
      ni = Object.assign({}, NI, Wd.NISA, F.calm, { look: [1, 0], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
      if (t >= ls(2) && t < HARV1) ni = Object.assign(ni, F.calm, { look: [1, 0] });
      if (t >= TEN + 0.9 && t < HARV1) ni.armR = { x: 250, y: -60 };                                 // hands the sacks over
      if (t >= ls(4) && t < NEXT) ni = Object.assign(ni, F.worried, { look: [1, 0] });
      if (t >= ls(5) && t < NEXT) ni = Object.assign(ni, F.sad);
      if (t >= NEXT && t < HARV2) ni = Object.assign(ni, F.think, { look: [0.6, 0.9], armL: { x: -80, y: -60 }, armR: { x: 160, y: -60 } });
      if (t >= HARV2 && t < ls(9)) ni = Object.assign(ni, F.smug, { look: [1, 0] });
      if (t >= ls(9) && t < FULL) ni = Object.assign(ni, F.smug, { look: [0, 0], armR: { x: 160, y: -260 } });
      if (t >= FULL && t < BEER) ni = Object.assign(ni, F.happy);
      if (t >= TRUST - 0.4 && t < LIES) ni.armR = { x: 230, y: -140 };                                  // handshake
      if (t >= BEER) ni = Object.assign(ni, F.deadpan, { armR: t > BEER + 1.7 ? { x: 160, y: -60 + 20 * Math.abs(Math.sin((t - BEER) * 9)) } : { x: 150, y: 10 } });
      if (speaking(t, 9)) { ni.mouth = "o"; ni.open = talkOpen(t, 1) * 0.7; }
      if (blink(t, 0.3) && ni.eyes === "open") ni.eyes = "closed";
      ni.sy = 1 + 0.01 * Math.sin(t * 2.3);
      P.draw(Wg, ni);
    }
    // ---------------- Duru
    if (t >= DURUIN) {
      let du = Object.assign({}, DU, Wd.DURU, F.happy, { look: [-1, 0], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
      if (t < DURUIN + 0.45) du.x = lerp(1350, DU.x, E.outBack(seg(t, DURUIN, DURUIN + 0.45)));
      if (t >= ls(4) && t < NEXT) du = Object.assign(du, { eyes: "half", lid: 0.3, mouth: "smile", look: [-1, -0.5], armL: { x: -230, y: -120 }, handL: "open" });
      if (t >= ls(5) && t < NEXT) du = Object.assign(du, F.smug, { look: [-1, 0], armL: { x: -150, y: 10 } });
      if (t >= NEXT && t < HARV2) du = Object.assign(du, F.calm, { look: [-0.6, 0.9] });
      if (t >= HARV2 && t < ls(9)) du = Object.assign(du, F.smug, { look: [-1, -0.3] });
      if (t >= ls(9) && t < FULL) du = Object.assign(du, t < DROP ? F.worried : F.shock, { look: [-1, 0] });
      if (t >= FULL && t < BEER) du = Object.assign(du, F.sad, { look: [-1, 0.3] });
      if (t >= TRUST - 0.4 && t < LIES) du = Object.assign(du, F.calm, { armL: { x: -230, y: -140 } });
      if (t >= BEER) du = Object.assign(du, F.worried, { look: [-1, 0], armL: { x: -200, y: -40 } });
      if ([2, 4, 8, 12].some((i) => speaking(t, i))) { du.mouth = "o"; du.open = talkOpen(t, 2); }
      if (blink(t, 1.9) && du.eyes === "open") du.eyes = "closed";
      du.sy = 1 + 0.01 * Math.sin(t * 2.1 + 1);
      P.draw(Wg, du);
    }
    if (t >= TRUST - 0.2 && t < TRUST + 0.6) FX.sparkle(Wg, { x: 548, y: 1240, k: seg(t, TRUST - 0.2, TRUST + 0.6), r: 120, n: 7 });
    // ---------------- the counter + what sits on it
    Wd.counter(Wg, {});
    // the loan: ten sacks pop on "ten", slide to Duru; three come back on "three"; ten come back on "full"
    if (t >= TEN && t < HARV1) { const n = Math.min(10, Math.floor(lerp(0, 10.99, seg(t, TEN, TEN + 0.7)))), slide = E.inQuad(seg(t, TEN + 1.4, TEN + 2.2)); Wd.sacks(Wg, { x: 600 + 500 * slide, y: COUNTER, n, s: 0.34 }); }
    if (t >= THREE - 0.3 && t < NEXT) Wd.sacks(Wg, { x: lerp(820, 560, E.outBack(seg(t, THREE - 0.3, THREE + 0.1))), y: COUNTER, n: 3, s: 0.34 });
    if (t >= FULL - 0.2 && t < SOON + 0.6) Wd.sacks(Wg, { x: lerp(900, 560, E.outBack(seg(t, FULL - 0.2, FULL + 0.2))), y: COUNTER, n: 10, s: 0.34 });
    // the tablet: pressed and sealed on the counter; held up on "ten"; on the counter after
    if (t >= NEXT + 0.1 && t < ls(9)) { const k = E.outBack(seg(t, NEXT + 0.1, NEXT + 0.4)), marks = lerp(0, 10.99, seg(t, PRESSED, CLAY + 0.2)), seal = seg(t, w(6, 13), SEAL + 0.5);
      Wd.tablet(Wg, { x: TAB.x, y: TAB.y, s: 0.38 * k, marks, seal, wet: t < HARV2 ? 1 : 0 });
      if (t >= PRESSED - 0.1 && t < CLAY + 0.3) { const i = Math.min(9, Math.floor(marks)), cx = TAB.x + (-160 + (i % 5) * 80) * 0.38, cy = TAB.y + (-90 + Math.floor(i / 5) * 90) * 0.38, bob = Math.abs(Math.sin((t - PRESSED) * 18)) * 12;
        Wd.stylus(Wg, { x: cx + 6, y: cy - 4 - bob, s: 0.42, rot: 20 }); }
      if (t >= w(6, 13) - 0.2 && t < SEAL + 0.7) { const k2 = seg(t, w(6, 13), SEAL + 0.5); Wd.seal(Wg, { x: TAB.x - 76 + 152 * k2, y: TAB.y + 47, s: 0.32, rot: 90, roll: k2 * 5 }); } }
    if (t >= ls(9) && t < FULL + 0.2) { const k = E.outBack(seg(t, ls(9), ls(9) + 0.3)), h = P.hand(Object.assign({}, NI, { armR: { x: 160, y: -260 } }), "R");
      Wd.tablet(Wg, { x: lerp(TAB.x, h[0] + 20, k), y: lerp(TAB.y, h[1] - 60, k), s: lerp(0.38, 0.5, k), rot: lerp(0, -8, k), marks: 10, seal: 1, wet: 0, glow: t >= DROP ? 1 - seg(t, DROP + 0.6, FULL) : 0 }); }
    if (t >= FULL + 0.2) Wd.tablet(Wg, { x: TAB.x - 150, y: TAB.y + 30, s: 0.3, marks: 10, seal: 1, wet: 0, glow: t >= DOESNT - 0.1 && t < DOESNT + 0.8 ? 1 - seg(t, DOESNT + 0.2, DOESNT + 0.8) : 0 });
    if (t >= BEER - 0.2) Wd.beer(Wg, { x: lerp(980, 660, E.outBack(seg(t, BEER - 0.2, BEER + 0.2))), y: COUNTER, s: 0.42 });
    if (t >= BEER + 1.6) { const k = E.outBack(seg(t, BEER + 1.6, BEER + 1.85)); Wd.tablet(Wg, { x: 420, y: TAB.y + 30, s: 0.3 * k, marks: lerp(0, 1.99, seg(t, BEER + 1.9, BEER + 2.3)), wet: 1, label: "BEER" }); }
    // the two memories
    if (t >= MEM - 0.2 && t < NEXT) { const kN = E.outBack(seg(t, MEM - 0.2, MEM + 0.1)), kD = E.outBack(seg(t, HIS - 0.2, HIS + 0.1)), bump = Math.sin(seg(t, HIS, HIS + 0.4) * Math.PI) * 30, pop = seg(t, NEXT - 0.4, NEXT);
      Kit.bubble(Wg, { x: NI.x + 10 + bump * 0.3, y: 820, k: kN * (1 - pop), text: "", w: 300, think: 1, tail: [-30, 130] }); if (kN * (1 - pop) > 0.2) Wd.sacks(Wg, { x: NI.x + 10, y: 860, n: 10, s: 0.2 * kN * (1 - pop) });
      Kit.bubble(Wg, { x: DU.x - 10 - bump * 0.3, y: 820, k: kD * (1 - pop), text: "", w: 300, think: 1, tail: [30, 130] }); if (kD * (1 - pop) > 0.2) Wd.sacks(Wg, { x: DU.x - 10, y: 850, n: 3, s: 0.2 * kD * (1 - pop) }); }
    // Duru's memory bubble bursts on "lies"
    if (t >= LIES - 0.6 && t < LIES + 0.3) { const k = E.outBack(seg(t, LIES - 0.6, LIES - 0.4)), burst = seg(t, LIES, LIES + 0.3); if (burst < 0.05) { Kit.bubble(Wg, { x: DU.x - 10, y: 830, k, text: "3?", size: 70, w: 220, think: 1, tail: [30, 130] }); } }
    if (t >= LIES && t < LIES + 0.5) FX.impact(Wg, { x: DU.x - 10, y: 830, s: 0.6, k: seg(t, LIES, LIES + 0.5), fill: "#FFE0A8" });
    // ---------------- the hook (poem crossed out, a clay receipt slams in)
    if (t < ls(1) + 0.5) { const out = E.inQuad(seg(t, ls(1) - 0.2, ls(1) + 0.4));
      if (t < RECEIPTS) Wd.scroll(Wg, { x: 540, y: 1000 + 900 * out, s: 0.95, rot: -4 + Math.sin(t * 1.5) * 2, cross: seg(t, THEY, THEY + 0.5) });
      else Wd.tablet(Wg, { x: 540, y: 1010 + 900 * out, s: 0.9 * E.outBack(seg(t, RECEIPTS - 0.05, RECEIPTS + 0.2)), rot: -3, marks: 10, seal: 1, wet: 0, label: "10 SACKS" }); }
    const sh = [shake(t, RECEIPTS, RECEIPTS + 0.3, 14), shake(t, DROP, DROP + 0.5, 22, 3)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#FBEBC8" };
  },
});
