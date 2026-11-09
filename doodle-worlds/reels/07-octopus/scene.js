/* World 7 · Coral reef · "An octopus had 8 arms and still couldn't run his shop" (56.0 s). Animal-economics / parable.
   Hook: Otto juggling eight jobs at the counter. Each arm's job gets a label as it's named (cooking, cleaning, cash, deliveries,
   emails, taxes... and one arm just holding his coffee). The pufferfish puffs up: "waiting... FOREVER!" Otto is drowning
   (which is hard, for an octopus). Re-hook: which jobs actually need me? Only two glow: the secret recipe, talking to customers.
   The rest go (drop, the one flash): a crab takes the mop, a schedule takes deliveries, an auto-reply flies off with the mail.
   "I can finally drink my coffee... with TWO hands!" -> ONLY YOU / DELEGATE card -> the crab: "Great. Now I want a raise." */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, Wd = World, FX = Rig.props;
const PUFC = "#C48E1C", OTTOC = "#8E4AA3", CRABC = "#D9532F";
const ARMS = w(0, 4), SHOP = w(1, 6), JOBS = [w(1, 7), w(1, 8), w(1, 9), w(1, 10), w(1, 11), w(1, 12)], COFFEE = w(1, 14), FOREVER = w(2, 5);
const DROWN = w(3, 2), OCTO = w(3, 8), ASK = ls(4), NEEDME = w(4, 5), RECIPE = w(5, 4), CUST = w(5, 6), CRAB = w(6, 5), SCHED = w(6, 8), AUTO = w(6, 11);
const TWO = w(7, 7), RAISE = w(9, 5), CTA = ls(10);
const OT = { x: 540, y: 1330, s: 1.0 }, KINDS = ["pan", "sponge", "cash", "parcel", "mail", "tax", "ads", "coffee"], LABS = ["COOKING", "CLEANING", "CASH", "DELIVERIES", "EMAILS", "TAXES"];
const LABAT = [0, 1, 2, 3, 4, 5];   // arm index for each named job; arm 6 = ads (unnamed), arm 7 = coffee

WK.film({
  flashAt: CRAB,
  captions: [
    [0, ls(1), ["8 ARMS.", { y: 290, size: 120, at: [w(0, 3), ARMS] }], ["STILL COULDN'T KEEP UP.", { y: 400, size: 76, at: [w(0, 6), w(0, 7), w(0, 8), w(0, 9)], accent: ["KEEP", "UP."], acc: "#E5484D" }]],
    [ls(1), COFFEE - 0.3, ["THE REEF'S ONLY SNACK SHOP.", { y: 300, size: 66, at: [w(1, 2), w(1, 3), w(1, 4), w(1, 5), SHOP] }]],
    [COFFEE - 0.3, ls(2), ["+ ONE ARM", { y: 290, size: 96, at: [w(1, 12), w(1, 13)] }], ["JUST FOR COFFEE.", { y: 400, size: 88, at: [w(1, 15), w(1, 16), w(1, 17)], accent: ["COFFEE."], acc: "#8A5A3A" }]],
    [ls(2), ls(3), ["“I'VE BEEN WAITING...", { y: 290, size: 84, at: [w(2, 2), w(2, 3), w(2, 4)], color: PUFC }], ["FOREVER!”", { y: 410, size: 120, at: [FOREVER], color: PUFC }]],
    [ls(3), ASK - 0.05, ["OTTO WAS DROWNING.", { y: 290, size: 84, at: [w(3, 0), w(3, 1), DROWN], accent: ["DROWNING."], acc: "#1F6FA8" }], ["(HARD, FOR AN OCTOPUS.)", { y: 400, size: 70, at: [w(3, 5), w(3, 6), w(3, 7), OCTO] }]],
    [ASK, ls(5), ["WHICH JOBS", { y: 290, size: 100, at: [w(4, 3), w(4, 4)] }], ["ACTUALLY NEED ME?", { y: 400, size: 86, at: [w(4, 5), w(4, 6), NEEDME], accent: ["ME?"], acc: OTTOC }]],
    [ls(5), ls(6), ["ONLY TWO:", { y: 290, size: 100, at: [ls(5), w(5, 1)] }], ["THE RECIPE + CUSTOMERS.", { y: 400, size: 74, at: [w(5, 2), RECIPE, w(5, 5), CUST] }]],
    [ls(6), ls(7), ["CLEANING: A CRAB.", { y: 290, size: 84, at: [w(6, 2), CRAB] }], ["MAIL: AN AUTO-REPLY.", { y: 400, size: 80, at: [w(6, 9), w(6, 10), AUTO], accent: ["AUTO-REPLY."], acc: "#24857E" }]],
    [ls(7), ls(8), ["“COFFEE...", { y: 290, size: 100, at: [w(7, 5)], color: OTTOC }], ["WITH TWO HANDS!”", { y: 400, size: 96, at: [w(7, 6), TWO, w(7, 8)], color: OTTOC }]],
    [ls(8), ls(9), ["DO WHAT ONLY YOU CAN.", { y: 290, size: 80, at: [w(8, 0), w(8, 3), w(8, 4), w(8, 6)] }], ["DELEGATE THE REST.", { y: 400, size: 86, at: [w(8, 7), w(8, 9), w(8, 11)], accent: ["DELEGATE"], acc: "#24857E" }]],
    [ls(9), CTA, ["“GREAT. NOW I WANT", { y: 290, size: 88, at: [ls(9), w(9, 1), w(9, 2), w(9, 3)], color: CRABC }], ["A RAISE.”", { y: 400, size: 110, at: [w(9, 4), RAISE], color: CRABC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(10, 0)] }], ["“ARMS”", { y: 450, size: 160, at: [w(10, 1)], color: OTTOC }], ["for the free delegation checklist", { y: 550, size: 48, at: [w(10, 2), w(10, 3), w(10, 4), w(10, 5), w(10, 6)], color: "#0E2A40" }]],
  ],
  cam: [[0, 1.02, 540, 1130], [ls(2) - 0.2, 1.02, 540, 1130], [ls(2) + 0.3, 1.1, 640, 1080], [ls(3) - 0.1, 1.1, 640, 1080], [ls(3) + 0.4, 1.05, 540, 1120],
    [ASK - 0.1, 1.05, 540, 1120], [ASK + 0.4, 1.7, 540, 1190], [ls(5) - 0.2, 1.7, 540, 1190], [ls(5) + 0.4, 1.05, 540, 1120], [ls(7) - 0.1, 1.05, 540, 1120],
    [ls(7) + 0.4, 1.45, 540, 1170], [ls(8) - 0.2, 1.45, 540, 1170], [ls(9) - 0.1, 1.15, 420, 1170], [ls(9) + 0.3, 1.5, 300, 1260], [CTA - 0.1, 1.5, 300, 1260], [CTA + 0.4, 1.1, 540, 1140], [D, 1.14, 540, 1140]],
  render(t, { world: Wg, over }) {
    Wd.reef(Wg, { t });
    // the pufferfish customer
    if (t >= ls(2) - 0.5) { const k = E.outBack(seg(t, ls(2) - 0.5, ls(2) - 0.1)), happy = t >= ls(7);
      Wd.puffer(Wg, { x: lerp(1300, 900, k), y: 880, s: 0.75, puff: happy ? 0 : t >= FOREVER - 0.1 ? E.outBack(seg(t, FOREVER - 0.1, FOREVER + 0.15)) * (1 - 0.6 * seg(t, ls(3) + 1.5, ls(3) + 2.5)) : 0, t, mood: happy ? "happy" : "grumpy" }); }
    // the schedule pinned on the wall
    if (t >= SCHED - 0.2) Wd.schedule(Wg, { x: 900, y: 1130, s: 0.6, k: E.outBack(seg(t, SCHED - 0.2, SCHED + 0.1)) });
    // ---------------- Otto: arms fan out with the eight jobs; freeze; two glow; the rest go; two hands on the coffee
    const relax = seg(t, CRAB - 0.2, AUTO + 0.4), coffeeK = E.inOutSine(seg(t, ls(7) - 0.4, ls(7)));
    let arms = Wd.ARMS.fan.map(([x, y], i) => { const busy = t < ASK ? 1 : 0, wig = busy * (t < ls(3) ? 18 : 34);
      return [x + Math.sin(t * (t < ls(3) ? 7 : 12) + i * 1.7) * wig, y + Math.cos(t * (t < ls(3) ? 6 : 11) + i) * wig]; });
    if (relax > 0) arms = arms.map(([x, y], i) => i === 3 || i === 4 || i === 7 ? [x, y] : [lerp(x, Wd.ARMS.rest[i][0], relax), lerp(y, Wd.ARMS.rest[i][1], relax)]);
    if (coffeeK > 0) arms = arms.map(([x, y], i) => [lerp(x, Wd.ARMS.coffee[i][0], coffeeK), lerp(y, Wd.ARMS.coffee[i][1], coffeeK)]);
    let face = { eyes: "open", mouth: "smile", look: [0, 0], sweat: 0, brow: 0 };
    if (t >= ls(1) && t < ls(3)) face = { eyes: "open", mouth: "wavy", look: [Math.sin(t * 3), -0.6], sweat: 0.6, brow: 1 };
    if (t >= ls(2) && t < ls(3)) face.look = [1, -0.6];
    if (t >= ls(3) && t < ASK) face = { eyes: t < OCTO - 0.2 ? "spiral" : "half", mouth: t < OCTO - 0.2 ? "wavy" : "flat", look: [0, 0], sweat: 1, brow: 0 };
    if (t >= ASK && t < ls(6)) face = { eyes: "open", mouth: "o", open: 0.2, look: [0.5, -0.9], sweat: 0, brow: 2 };
    if (t >= ls(6) && t < ls(9)) face = { eyes: "happy", mouth: "grin", look: [0, 0] };
    if (t >= ls(9)) face = { eyes: "wide", mouth: "flat", look: [-1, 0.3] };
    if (speaking(t, 7)) { face.mouth = "o"; face.open = talkOpen(t, 1); }
    if (blink(t, 0.5) && face.eyes === "open") face.eyes = "closed";
    const ot = Object.assign({}, OT, face, { arms, t, sy: 1 + 0.015 * Math.sin(t * 2.3) });
    Wd.octo(Wg, ot);
    // the items at the arm tips
    KINDS.forEach((kind, i) => { const tip = Wd.armTip(ot, arms, i); let k = kind, grey = 0, glow = 0, gone = 0;
      if (i === 3 && t >= RECIPE - 0.2) k = "recipe"; if (i === 4 && t >= CUST - 0.2) k = "heart";
      if (t >= ls(5) && t < ls(7) && i !== 3 && i !== 4 && i !== 7) grey = 1;
      if ((i === 3 && t >= RECIPE) || (i === 4 && t >= CUST)) glow = t < ls(6) ? 1 : 1 - seg(t, ls(6), ls(6) + 0.5);
      const leave = { 1: CRAB, 3: SCHED, 4: AUTO }[i] ?? (i < 7 ? lerp(CRAB, AUTO, (i % 3) / 3) + 0.3 : null);
      if ((i === 3 || i === 4) && t >= ls(6)) { /* the two kept jobs stay */ }
      else if (leave !== null && leave !== undefined && t >= leave) gone = seg(t, leave, leave + 0.35);
      if (i === 7 && coffeeK > 0) { const c = Wd.armTip(ot, arms, 3); Wd.item(Wg, { x: (c[0] + Wd.armTip(ot, arms, 4)[0]) / 2, y: c[1] + 10, kind, s: 0.62, t }); return; }
      if (gone >= 1) return;
      if (i === 4 && gone > 0 && t >= AUTO) return;
      Wd.item(Wg, { x: tip[0], y: tip[1] - 30 - gone * 200, kind: k, s: 0.88 * (1 - gone), rot: Math.sin(t * 5 + i) * 8, grey, glow, t });
      const li = LABAT.indexOf(i); if (li >= 0 && t >= JOBS[li] - 0.05 && t < ls(3)) Kit.label(Wg, { x: tip[0], y: tip[1] - 120, text: LABS[li], size: 38, tone: "#FFE07A", k: E.outBack(seg(t, JOBS[li] - 0.05, JOBS[li] + 0.15)) * (1 - seg(t, ls(2), ls(2) + 0.3)), rot: (i % 2 ? 4 : -4) }); });
    if (t >= COFFEE - 0.1 && t < ls(2)) { const tip = Wd.armTip(ot, arms, 7); Kit.label(Wg, { x: tip[0] - 20, y: tip[1] - 110, text: "COFFEE", size: 32, tone: "#E8C9A0", k: E.outBack(seg(t, COFFEE - 0.1, COFFEE + 0.1)) }); }
    // the auto-reply flies off; the thought bubble; poofs
    if (t >= AUTO - 0.1 && t < AUTO + 1.2) { const k = seg(t, AUTO - 0.1, AUTO + 1.2); Wd.autoreply(Wg, { x: lerp(650, 1200, k), y: lerp(840, 300, k), s: 0.7, t }); }
    if (t >= ASK && t < ls(5)) Kit.bubble(Wg, { x: 730, y: 1010, k: E.outBack(seg(t, ASK, ASK + 0.25)) * (1 - seg(t, ls(5) - 0.3, ls(5))), text: "ME?", size: 64, w: 240, think: 1, tail: [-20, 130] });
    [CRAB, SCHED, AUTO].forEach((a) => { if (t > a && t < a + 0.5) FX.sparkle(Wg, { x: 540, y: 1000, k: seg(t, a, a + 0.5), r: 380, n: 10, s: 1.0 }); });
    // ---------------- the counter, the crab
    Wd.counter(Wg, {});
    if (t >= CRAB - 0.4) { const k = E.outBack(seg(t, CRAB - 0.4, CRAB)); Wd.crab(Wg, { x: lerp(-200, 170, k), y: 1450, s: 0.8, t, claw: t >= ls(9) ? E.outBack(seg(t, ls(9), ls(9) + 0.25)) : 0, mood: t >= ls(9) ? "flat" : "smile" });
      if (t < ls(9)) Wd.mop(Wg, { x: lerp(-200, 170, k) + 90, y: 1430, s: 0.8, rot: -14, t }); }
    // ---------------- over: the ONLY YOU / DELEGATE card
    if (t >= ls(8) - 0.15 && t < ls(9) - 0.1) { const k = Math.min(E.outBack(seg(t, ls(8) - 0.15, ls(8) + 0.15)), 1 - seg(t, ls(9) - 0.4, ls(9) - 0.1));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#0E2A40", opacity: 0.4 * k }, over); Wd.split(over, { x: 540, y: 1060, s: 1.0, k }); }
    const sh = [shake(t, CRAB, CRAB + 0.45, 20, 3), shake(t, FOREVER, FOREVER + 0.35, 10, 5)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#7FD3F0" };
  },
});
