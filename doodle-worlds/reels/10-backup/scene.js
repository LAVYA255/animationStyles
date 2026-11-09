/* World 10 · Zombie apocalypse · "She survived the zombies. Her files didn't." (50.4 s). Twist / 3-2-1 backups.
   Hook: Kai behind the barricade, laptop on the sandbags. Everything on one laptop (maps, supplies, plans) -> Gerald, a polite
   zombie: "Braaains... and laptops." (he eats it) -> "MY SPREADSHEETS!" -> FILES: 0, back to zero. An old survivor: one rule:
   3, 2, 1 -> the card (drop, the one flash): 3 copies, 2 kinds of storage, 1 somewhere else. Next time Gerald eats her laptop:
   "Bon appetit. I have backups." (USB + cloud glow). Tag: Gerald: "Excuse me... could I get a copy too?" */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const KAIC = "#56653C", GERC = "#C48E1C";
const FILES = w(0, 6), NOT = w(0, 8), LAPTOP = w(1, 5), MAPS = w(1, 6), SUPPLY = w(1, 7), PLANS = w(1, 10), BRAINS = ls(2), LAPTOPS = w(2, 2);
const SHEETS = w(3, 2), ZERO = w(4, 10), SURVIVOR = w(5, 3), RULE = w(5, 7), N3 = w(5, 8), N2 = w(5, 9), N1 = w(5, 10);
const COPIES = w(6, 1), KINDS = w(6, 7), ELSE = w(6, 14), NEXT = ls(7), ATE2 = w(7, 8), APPETIT = w(8, 1), BACKUPS = w(8, 4), RULE2 = w(9, 6), COPY = w(10, 6), CTA = ls(11);
const KA = { x: 330, y: 1420, s: 1.05 }, GE = { x: 790, y: 1420, s: 1.0 }, LAP = { x: 560, y: 1400, s: 0.6 };

WK.film({
  flashAt: ls(6),
  captions: [
    [0, w(0, 5), ["SHE SURVIVED", { y: 290, size: 100, at: [w(0, 0), w(0, 1)] }], ["THE ZOMBIE APOCALYPSE.", { y: 400, size: 76, at: [w(0, 2), w(0, 3), w(0, 4)] }]],
    [w(0, 5), ls(1), ["HER FILES", { y: 290, size: 104, at: [w(0, 5), FILES] }], ["DID NOT.", { y: 400, size: 110, at: [w(0, 7), NOT], accent: ["NOT."], acc: "#E5484D" }]],
    [ls(1), ls(2), ["ALL ON ONE LAPTOP.", { y: 290, size: 88, at: [w(1, 3), w(1, 4), LAPTOP - 0.05, LAPTOP] }], ["MAPS. SUPPLIES. PLANS.", { y: 400, size: 76, at: [MAPS, SUPPLY, PLANS] }]],
    [ls(2), ls(3), ["“BRAAAINS...", { y: 290, size: 104, at: [BRAINS], color: GERC }], ["...AND LAPTOPS.”", { y: 400, size: 96, at: [w(2, 1), LAPTOPS], color: GERC }]],
    [ls(3), ls(4), ["“MY SPREADSHEETS!”", { y: 320, size: 92, at: [w(3, 1), SHEETS], color: KAIC }]],
    [ls(4), ls(5), ["DAY ONE.", { y: 290, size: 110, at: [ls(4), w(4, 1)] }], ["BACK TO ZERO.", { y: 400, size: 100, at: [w(4, 8), w(4, 9), ZERO], accent: ["ZERO."], acc: "#E5484D" }]],
    [ls(5), ls(6), ["ONE RULE:", { y: 290, size: 110, at: [w(5, 6), RULE] }], ["3. 2. 1.", { y: 420, size: 150, at: [N3, N2, N1], color: "#E5484D" }]],
    [ls(6), ls(7), ["3 COPIES.", { y: 290, size: 110, at: [ls(6), COPIES], accent: ["3"], acc: "#E5484D" }], ["2 KINDS. 1 ELSEWHERE.", { y: 400, size: 78, at: [w(6, 5), KINDS, w(6, 12), ELSE], accent: ["2", "1"], acc: "#3FB8AF" }]],
    [ls(7), ls(8), ["NEXT TIME A ZOMBIE", { y: 290, size: 86, at: [w(7, 2), w(7, 3), w(7, 4), w(7, 5)] }], ["ATE HER LAPTOP...", { y: 400, size: 90, at: [w(7, 6), w(7, 7), ATE2] }]],
    [ls(8), ls(9), ["“BON APPÉTIT.", { y: 290, size: 100, at: [ls(8), APPETIT], color: KAIC }], ["I HAVE BACKUPS.”", { y: 400, size: 96, at: [w(8, 2), w(8, 3), BACKUPS], color: KAIC, accent: ["BACKUPS.”"], acc: "#3FB8AF" }]],
    [ls(9), ls(10), ["THE 3-2-1 BACKUP RULE.", { y: 290, size: 76, at: [w(9, 2), w(9, 5), RULE2] }], ["SET IT UP BEFORE YOUR APOCALYPSE.", { y: 400, size: 54, at: [w(9, 7), w(9, 9), w(9, 10), w(9, 11), w(9, 12)] }]],
    [ls(10), CTA, ["“EXCUSE ME...", { y: 290, size: 100, at: [ls(10), w(10, 1)], color: GERC }], ["COULD I GET A COPY TOO?”", { y: 400, size: 72, at: [w(10, 2), w(10, 3), w(10, 4), w(10, 5), COPY, w(10, 7)], color: GERC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(11, 0)] }], ["“BACKUP”", { y: 450, size: 140, at: [w(11, 1)], color: "#3FB8AF" }], ["for the free backup checklist", { y: 550, size: 52, at: [w(11, 3), w(11, 4), w(11, 5), w(11, 6), w(11, 7)], color: "#333" }]],
  ],
  cam: [[0, 1.15, 540, 1120], [ls(1) - 0.2, 1.15, 540, 1120], [ls(1) + 0.3, 1.55, 450, 1180], [ls(2) - 0.2, 1.55, 450, 1180], [ls(2) + 0.25, 1.35, 650, 1150],
    [ls(3) - 0.15, 1.35, 650, 1150], [ls(3) + 0.15, 1.65, 360, 1150], [ls(4) - 0.1, 1.65, 360, 1150], [ls(4) + 0.3, 1.45, 470, 1190], [ls(5) - 0.15, 1.45, 470, 1190],
    [ls(5) + 0.3, 1.3, 620, 1150], [ls(6) - 0.1, 1.3, 620, 1150], [ls(7) - 0.2, 1.3, 600, 1150], [ATE2 - 0.3, 1.3, 600, 1150], [ls(8) - 0.05, 1.3, 600, 1150], [ls(8) + 0.25, 1.6, 380, 1160],
    [ls(9) - 0.15, 1.6, 380, 1160], [ls(9) + 0.3, 1.18, 540, 1120], [ls(10) - 0.15, 1.18, 540, 1120], [ls(10) + 0.3, 1.55, 720, 1150], [CTA - 0.1, 1.55, 720, 1150], [CTA + 0.4, 1.18, 540, 1120], [D, 1.22, 540, 1120]],
  render(t, { world: Wg, over }) {
    Wd.city(Wg, { t });
    // ---------------- Gerald (first visit), the old survivor, Gerald again
    const gVisible = (t >= BRAINS - 0.5 && t < ls(4) + 0.4) || (t >= NEXT - 0.4);
    if (gVisible) { const first = t < ls(5), a0 = first ? BRAINS - 0.5 : NEXT - 0.4, out = first ? seg(t, ls(4), ls(4) + 0.4) : 0;
      let ge = Object.assign({}, GE, Wd.GERALD, { eyes: "half", lid: 0.4, mouth: "smile", look: [-1, 0], y: GE.y + 420 * (1 - E.outBack(seg(t, a0, a0 + 0.4))) + 500 * out, armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
      ge.rot = Math.sin(t * 2) * 3;
      if ((t >= LAPTOPS - 0.4 && t < ls(4)) || (t >= ATE2 - 0.4 && t < ls(9))) ge = Object.assign(ge, { mouth: "o", open: 0.9, armL: { x: -110, y: -220 }, armR: { x: 30, y: -220 } });
      if (t >= ls(10)) ge = Object.assign(ge, { mouth: "smile", eyes: "open", lid: 0.3, look: [-1, 0.2], armL: { x: -230, y: -120 }, handL: "open" });
      if ([2, 10].some((i) => speaking(t, i))) { ge.mouth = "o"; ge.open = talkOpen(t, 2); }
      P.draw(Wg, ge); Wd.zombieBits(Wg, ge); }
    if (t >= ls(5) - 0.4 && t < ls(6) + 0.3) { const k = E.outBack(seg(t, ls(5) - 0.4, ls(5))), out = seg(t, ls(6), ls(6) + 0.3);
      let ol = Object.assign({ x: 790, y: 1420 + 420 * (1 - k) + 500 * out, s: 1.0 }, Wd.OLDIE, F.smug, { look: [-1, 0] });
      if (t >= N3 - 0.1) { const which = t < N2 ? 0 : t < N1 ? 1 : 2; ol = Object.assign(ol, { armL: { x: -160, y: -300 + which * 20 }, handL: "point", mouth: "o", open: 0.4 }); }
      P.draw(Wg, ol); }
    // ---------------- Kai
    let ka = Object.assign({}, KA, Wd.KAI, F.calm, { look: [1, 0.4], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
    if (t >= ls(1) && t < ls(2)) { const b = Math.sin(t * 30), c = Math.sin(t * 30 + 1.7); ka = Object.assign(ka, F.calm, { look: [1, 0.6], armL: { x: 120, y: -40 + 8 * b }, armR: { x: 200, y: -40 + 8 * c } }); }
    if (t >= ls(2) && t < ls(3)) ka = Object.assign(ka, F.shock, { look: [1, 0] });
    if (t >= ls(3) && t < ls(4)) ka = Object.assign(ka, F.shout, { armL: { x: -170, y: -280 }, armR: { x: 170, y: -280 }, handL: "open", handR: "open" });
    if (t >= ls(4) && t < ls(5)) ka = Object.assign(ka, F.sad, { look: [1, 0.6] });
    if (t >= ls(5) && t < ls(7)) ka = Object.assign(ka, F.think, { look: [1, -0.2] });
    if (t >= ls(7) && t < ls(8)) ka = Object.assign(ka, F.calm, { look: [1, 0] });
    if (t >= ls(8) && t < ls(10)) ka = Object.assign(ka, F.smug, { look: [1, 0], armR: { x: 110, y: -280 } });
    if (t >= ls(10)) ka = Object.assign(ka, F.deadpan, { look: [1, 0], armR: { x: 110, y: -280 } });
    if ([3, 8].some((i) => speaking(t, i))) { ka.mouth = t < ls(4) ? "shout" : "o"; ka.open = talkOpen(t, 1); }
    if (blink(t, 0.3) && ka.eyes === "open") ka.eyes = "closed";
    P.draw(Wg, ka);
    // the USB + cloud with her (backups)
    if (t >= ls(8) - 0.1) { const h = P.hand(ka, "R"), k = E.outBack(seg(t, ls(8) - 0.1, ls(8) + 0.2)); Wd.usb(Wg, { x: h[0], y: h[1] - 40, s: 0.55 * k, rot: -10, glow: t >= BACKUPS ? 1 - seg(t, BACKUPS + 0.4, BACKUPS + 1) : 0 });
      Wd.cloud(Wg, { x: KA.x - 150, y: 830, s: 0.6 * E.outBack(seg(t, BACKUPS - 0.1, BACKUPS + 0.2)), glow: t >= BACKUPS ? 1 - seg(t, BACKUPS + 0.4, BACKUPS + 1) : 0 }); }
    if (t >= ls(10) + 0.4 && t < CTA + 0.6) Wd.usb(Wg, { x: lerp(KA.x + 140, GE.x - 210, E.inOutSine(seg(t, COPY, COPY + 0.5))), y: 1120, s: 0.5 * E.outBack(seg(t, ls(10) + 0.4, ls(10) + 0.7)), rot: 20 });
    // ---------------- the barricade + the laptop
    Wd.barricade(Wg, {});
    let lap = null;
    if (t < LAPTOPS - 0.4) lap = { x: LAP.x, y: LAP.y, icons: t < MAPS ? 3 : (t >= MAPS ? 1 : 0) + (t >= SUPPLY ? 1 : 0) + (t >= PLANS ? 1 : 0) };
    else if (t < ls(4)) { const k = E.inOutSine(seg(t, LAPTOPS - 0.4, LAPTOPS)), h = P.hand(Object.assign({}, GE, { armL: { x: -110, y: -220 } }), "L"); lap = { x: lerp(LAP.x, h[0] + 60, k), y: lerp(LAP.y, h[1] + 60, k), rot: -20 * k, icons: 3, bitten: seg(t, LAPTOPS, LAPTOPS + 0.4) }; }
    else if (t < ls(5)) lap = { x: LAP.x, y: LAP.y, icons: 0, bitten: 1, zero: 1 };
    else if (t >= ls(7) - 0.3 && t < ATE2 - 0.4) lap = { x: LAP.x, y: LAP.y, icons: 3, s: 0.6 * E.outBack(seg(t, ls(7) - 0.3, ls(7))) };
    else if (t >= ATE2 - 0.4 && t < ls(9)) { const k = E.inOutSine(seg(t, ATE2 - 0.4, ATE2)); lap = { x: lerp(LAP.x, GE.x - 50, k), y: lerp(LAP.y, 1180, k), rot: -20 * k, icons: 3, bitten: seg(t, ATE2, ATE2 + 0.4) }; }
    if (lap) Wd.laptop(Wg, Object.assign({ s: LAP.s }, lap));
    if (t >= SHEETS - 0.1 && t < ls(4) + 0.5) for (let i = 0; i < 6; i++) { const k = clamp((t - SHEETS + 0.1 - i * 0.07) / 1.2); if (k > 0 && k < 1) Wd.paper(Wg, { x: lerp(700, 120 + i * 170, k), y: lerp(1150, 500 + (i % 3) * 120, E.outQuad(k)) + 400 * k * k, s: 0.6, rot: k * 300 * (i % 2 ? 1 : -1) }); }
    if (t >= LAPTOPS && t < LAPTOPS + 0.5) FX.impact(Wg, { x: GE.x - 30, y: 1080, s: 0.5, k: seg(t, LAPTOPS, LAPTOPS + 0.5), fill: "#FFE07A" });
    if (t >= ATE2 && t < ATE2 + 0.5) FX.impact(Wg, { x: GE.x - 30, y: 1080, s: 0.5, k: seg(t, ATE2, ATE2 + 0.5), fill: "#FFE07A" });
    // ---------------- over: the 3-2-1 card
    if (t >= ls(6) - 0.15 && t < ls(7) - 0.1) { const k = Math.min(E.outBack(seg(t, ls(6) - 0.15, ls(6) + 0.15)), 1 - seg(t, ls(7) - 0.4, ls(7) - 0.1));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#2B2B3A", opacity: 0.4 * k }, over);
      Wd.rule(over, { x: 540, y: 1060, s: 1.0, k, stage: lerp(0, 1, seg(t, ls(6), COPIES + 0.4)) + seg(t, w(6, 5), KINDS + 0.4) + seg(t, w(6, 12), ELSE + 0.3), t }); }
    const sh = [shake(t, LAPTOPS, LAPTOPS + 0.4, 14), shake(t, ls(6), ls(6) + 0.4, 18, 3), shake(t, ATE2, ATE2 + 0.4, 12, 5), shake(t, SHEETS, SHEETS + 0.3, 10, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#C9C08A" };
  },
});
