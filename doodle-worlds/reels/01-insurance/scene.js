/* World 1 · Stone Age · "How insurance was invented" (53.3 s). Hook: something you pay for every month and pray you never use.
   Thog's hut burns (again) -> the stone-age lightbulb -> one fish in the pot every moon -> Bonk: "what Bonk get?" -> the pot grows
   for moons -> Bonk's hut burns -> THE POT PAID (drop, the one flash): new hut in one day -> cave-wall lesson -> a week later
   Bonk's hut burns again, torch behind his back: "...Weird." -> "that's how insurance fraud was invented" -> Thog dunks the torch. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const THOGC = "#B8502A", BONKC = "#5B4A9E";
// beats
const DOWN = w(1, 3), AGAIN1 = w(1, 4), IDEA = le(2) + 0.12, POT = ls(3), FISH = w(3, 3), BONKIN = le(2) + 0.5;
const YOUR = w(5, 1), NEWHUT = w(5, 6), MOONS = ls(6), THEN = ls(7), FIRE1 = w(7, 4), MYHUT = ls(8), DROP = w(9, 2), BUILT = w(9, 7);
const LESSON = ls(10), WEEK = ls(11), FIRE2 = w(11, 6), WEIRD = ls(12), FRAUD = w(13, 4), CTA = ls(14), DUNK = w(14, 2);
const WIN0 = LESSON - 0.3, WIN = LESSON - 0.08, WIN1 = LESSON + 0.15, WOUT0 = WEEK - 0.4, WOUT = WEEK - 0.18, WOUT1 = WEEK + 0.05;
const TH = { x: 352, y: 1420, s: 1.05 }, BK = { x: 742, y: 1420, s: 1.05 }, HUT_T = { x: 245, y: 1255, s: 0.88 }, HUT_B = { x: 850, y: 1255, s: 0.88 }, POTSPOT = { x: 548, y: 1412 };

WK.film({
  flashAt: DROP,
  titleSlam: { text: "THE POT PAID!", at: DROP, until: BUILT - 1.2, color: "#E9A23B" },
  captions: [
    [0, w(0, 9), ["A CAVEMAN INVENTED", { y: 290, size: 80, at: [w(0, 0), w(0, 1), w(0, 2)] }], ["YOU PAY EVERY MONTH", { y: 392, size: 76, at: [w(0, 4), w(0, 5), w(0, 7), w(0, 8)], accent: ["MONTH"] }]],
    [w(0, 9), ls(1), ["& PRAY YOU NEVER USE.", { y: 290, size: 80, at: [w(0, 9), w(0, 10), w(0, 11), w(0, 12), w(0, 13)], accent: ["PRAY"] }]],
    [ls(1), ls(2), ["HUT: GONE. AGAIN.", { y: 290, size: 88, at: [w(1, 1), DOWN, AGAIN1], accent: ["AGAIN."] }]],
    [ls(2), ls(3), ["“EVERY FIRE... ZERO.”", { y: 290, size: 80, at: [w(2, 0), w(2, 1), w(2, 5)], color: THOGC }]],
    [ls(3), ls(4), ["“ONE FISH IN POT.”", { y: 290, size: 80, at: [w(3, 2), FISH, w(3, 5)], color: THOGC }], ["“EVERY MOON.”", { y: 392, size: 80, at: [w(3, 6), w(3, 7)], color: THOGC }]],
    [ls(4), ls(5), ["“WHAT BONK GET?”", { y: 290, size: 84, at: [w(4, 1), w(4, 2), w(4, 3)], color: BONKC }]],
    [ls(5), ls(6), ["“YOUR HUT BURN...”", { y: 290, size: 80, at: [YOUR, w(5, 2), w(5, 3)], color: THOGC }], ["“POT BUILD NEW HUT!”", { y: 392, size: 76, at: [w(5, 4), w(5, 5), NEWHUT, w(5, 7)], color: THOGC }]],
    [ls(6), ls(7), ["FIRES WERE RARE...", { y: 290, size: 80, at: [w(6, 0), w(6, 1), w(6, 2)] }], ["THE POT KEPT GROWING.", { y: 392, size: 74, at: [w(6, 4), w(6, 5), w(6, 6), w(6, 7)], accent: ["GROWING."] }]],
    [ls(7), ls(8), ["THEN...", { y: 290, size: 90, at: [w(7, 0)] }], ["BONK'S HUT. FIRE.", { y: 392, size: 84, at: [w(7, 1), w(7, 2), FIRE1], accent: ["FIRE."], acc: "#E5484D" }]],
    [ls(8), DROP - 0.1, ["“MY HUT!”", { y: 300, size: 120, at: [w(8, 0), w(8, 1)], color: BONKC }], "hard"],
    [BUILT - 1.25, WIN, ["NEW HUT IN ONE DAY!", { y: 300, size: 84, at: [w(9, 3), w(9, 4), w(9, 6), BUILT], accent: ["DAY!"] }], "hard"],
    [LESSON, w(10, 2), ["THAT'S INSURANCE.", { y: 290, size: 96, at: [w(10, 0), w(10, 1)], accent: ["INSURANCE."], acc: "#E9A23B" }]],
    [LESSON, WOUT, ["MANY PAY A LITTLE", { y: 290, size: 82, at: [w(10, 2), w(10, 4), w(10, 5), w(10, 6)] }], ["NOBODY LOSES EVERYTHING", { y: 392, size: 70, at: [w(10, 8), w(10, 9), w(10, 10)], accent: ["EVERYTHING"] }], "hard"],
    [WEEK, ls(12), ["ONE WEEK LATER...", { y: 290, size: 82, at: [w(11, 0), w(11, 1), w(11, 2)] }], ["BONK'S HUT. AGAIN.", { y: 392, size: 82, at: [w(11, 3), w(11, 4), w(11, 7)], accent: ["AGAIN."], acc: "#E5484D" }]],
    [ls(12), ls(13), ["“...WEIRD.”", { y: 300, size: 110, at: [w(12, 0)], color: BONKC }]],
    [ls(13), CTA, ["INSURANCE FRAUD", { y: 290, size: 90, at: [w(13, 3), FRAUD], accent: ["FRAUD"], acc: "#E5484D" }], ["WAS INVENTED.", { y: 392, size: 84, at: [w(13, 5), w(13, 6)] }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(14, 0)] }], ["“RISK”", { y: 450, size: 150, at: [w(14, 1)], color: "#E9A23B" }], ["for the free cheat sheet", { y: 550, size: 56, at: [w(14, 2), w(14, 3), w(14, 4), w(14, 5), w(14, 6)], color: "#666" }]],
  ],
  cam: [[0, 1.3, 430, 1215], [ls(1) - 0.4, 1.38, 400, 1215], [AGAIN1, 1.38, 400, 1215], [AGAIN1 + 0.5, 1.75, 350, 1180], [ls(2) + 0.2, 1.9, 350, 1170],
    [IDEA - 0.1, 1.9, 350, 1170], [POT - 0.1, 1.4, 548, 1225], [ls(4) - 0.15, 1.4, 548, 1225], [ls(4) + 0.3, 1.8, 742, 1180], [ls(5) - 0.15, 1.8, 742, 1180],
    [ls(5) + 0.35, 1.42, 540, 1225], [MOONS - 0.25, 1.42, 540, 1225], [MOONS + 0.55, 0.92, 540, 1120], [THEN - 0.1, 0.92, 540, 1120], [THEN + 0.6, 1.3, 680, 1210],
    [MYHUT - 0.1, 1.38, 720, 1210], [MYHUT + 0.1, 1.85, 742, 1170], [DROP - 0.35, 1.85, 742, 1170], [DROP + 0.1, 1.22, 640, 1180], [WOUT, 1.22, 640, 1180],
    [WOUT + 0.01, 1.3, 600, 1215], [FIRE2 - 0.1, 1.3, 600, 1215], [FIRE2 + 0.45, 1.75, 742, 1190], [ls(13) - 0.1, 1.8, 735, 1190], [ls(13) + 0.6, 1.4, 548, 1225], [D, 1.46, 548, 1225]],
  render(t, { world: Wg, over }) {
    const night = t >= MOONS - 0.2 && t < THEN ? clamp(seg(t, MOONS - 0.2, MOONS + 0.4)) * (1 - seg(t, THEN - 0.5, THEN)) : 0;
    const dayArc = t >= DROP && t < BUILT + 0.3 ? seg(t, DROP + 0.4, BUILT) : null;
    const phase = t < ls(1) + 1 ? 1 : 2 * night;                                             // dusk at the hook, day after, night while moons pass
    Wd.sky(Wg, { phase: t < ls(1) + 1 ? 1 : phase, sun: dayArc !== null ? dayArc : t < ls(1) + 1 ? 0.9 : 0.8, moon: night > 0.3 ? seg(t, MOONS, THEN - 0.3) : -1, moonPhase: (seg(t, MOONS, THEN - 0.3) * 3) % 1 });
    Wd.ground(Wg, { tone: t < ls(1) + 1 ? 0.35 : night });
    // far huts (seen in the wide shots), the pot fills from each one
    const FAR = [[-260, 1215, 0.5], [70, 1190, 0.42], [1010, 1190, 0.42], [1330, 1215, 0.5], [-520, 1230, 0.55], [1600, 1230, 0.55]];
    FAR.forEach(([x, y, s]) => Wd.hut(Wg, { x, y, s, t }));
    // Thog's hut: burning at the hook, collapses on "down", rebuilt by the time moons pass
    const thogAsh = t >= DOWN && t < MOONS - 0.3 ? 1 : 0;
    Wd.hut(Wg, Object.assign({}, HUT_T, { t, burn: t < DOWN ? 1 : 0, ash: thogAsh ? E.outQuad(seg(t, DOWN, DOWN + 0.35)) : 0 }));
    if (t > DOWN && t < DOWN + 0.6) FX.dust(Wg, { x: HUT_T.x, y: HUT_T.y, k: seg(t, DOWN, DOWN + 0.6), n: 4, size: 1.6 });
    // Bonk's hut: catches fire, burns to ash on the drop, rebuilt in one day, burns again a week later
    let bBurn = 0, bAsh = 0, bBuild = 1;
    if (t >= FIRE1 - 0.2 && t < DROP + 0.35) bBurn = E.outQuad(seg(t, FIRE1 - 0.2, FIRE1 + 0.4));
    if (t >= DROP + 0.35 && t < DROP + 0.9) bAsh = 1;
    if (t >= DROP + 0.9 && t < WEEK) bBuild = seg(t, DROP + 0.9, BUILT + 0.05);
    if (t >= FIRE2 - 0.2) bBurn = E.outQuad(seg(t, FIRE2 - 0.2, FIRE2 + 0.4));
    Wd.hut(Wg, Object.assign({}, HUT_B, { t, burn: bBurn, ash: bAsh, build: bBuild }));
    if (t >= DROP + 0.9 && t < BUILT + 0.1) { for (let i = 0; i < 5; i++) { const k = (t * 2.5 + i / 5) % 1; el("line", { x1: 1200 - k * 330, y1: 1000 + i * 40 - arc(k, 120), x2: 1260 - k * 330, y2: 960 + i * 40 - arc(k, 120), stroke: "#7A5230", "stroke-width": 14, "stroke-linecap": "round" }, Wg); }
      Kit.crowd(Wg, { x: 1080, y: 1210, s: 0.6, n: 3, spread: 90, tone: "#8C7B6B", t, seed: 4 }); }
    if (t > BUILT && t < BUILT + 0.6) FX.sparkle(Wg, { x: HUT_B.x, y: HUT_B.y - 150, k: seg(t, BUILT, BUILT + 0.6), r: 240, n: 10, s: 1.1 });
    // fish flying into the pot while moons pass
    if (t > MOONS + 0.2 && t < THEN - 0.3) FAR.concat([[HUT_T.x, HUT_T.y, 0.8], [HUT_B.x, HUT_B.y, 0.8]]).forEach(([x, y], i) => { const k = ((t - MOONS) * 0.9 + i * 0.13) % 1;
      Wd.fish(Wg, { x: lerp(x, POTSPOT.x, k), y: lerp(y - 60, POTSPOT.y - 260, k) + arc(k, 260), s: 0.55, rot: k * 300, tone: ["#7FB3D5", "#F2A65A", "#9AD1A0"][i % 3] }); });

    // ---------------- Thog
    let th = Object.assign({}, TH, Wd.THOG, F.deadpan, { armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 }, tired: 0.6 });
    if (t >= DOWN && t < AGAIN1) th = Object.assign(th, F.shock, { look: [-0.8, -0.4] });
    if (t >= ls(2) && t < IDEA) th = Object.assign(th, F.sad, { tired: 0.6 });
    if (t >= IDEA && t < POT) { th = P.mix(th, Object.assign({}, th, F.happy, { armR: { x: 120, y: -300 }, handR: "point", tired: 0 }), E.outBack(seg(t, IDEA, IDEA + 0.2))); th.y = TH.y + arc(seg(t, IDEA, IDEA + 0.4), 30); }
    const holdPot = t >= POT && t < YOUR - 0.25;
    if (holdPot) th = Object.assign(th, F.happy, { eyes: "open", mouth: "smile", tired: 0, armL: { x: -60, y: -150 }, armR: { x: 160, y: -150 }, look: [0.7, 0] });
    if (t >= ls(4) && t < ls(5)) th.look = [1, 0];
    if (t >= YOUR - 0.25 && t < MOONS) th = Object.assign(th, F.calm, { tired: 0, mouth: "grin", armR: { x: 250, y: -140 }, handR: "point", look: [1, 0] });
    if (t >= MOONS && t < FIRE1) th = Object.assign(th, F.calm, { tired: 0, armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
    if (t >= FIRE1 && t < DROP) th = Object.assign(th, F.shock, { tired: 0, look: [1, -0.3] });
    if (t >= DROP && t < LESSON) { th = Object.assign(th, F.happy, { tired: 0, armL: { x: -140, y: -300 }, armR: { x: 140, y: -300 } }); th.y = TH.y + arc(seg(t, DROP, DROP + 0.45), 50); }
    if (t >= WEEK && t < ls(13)) th = Object.assign(th, F.calm, { tired: 0, look: [1, -0.2] });
    if (t >= ls(13)) { th = Object.assign(th, F.smug, { tired: 0, lid: 0.55, mouth: "flat", look: t < FRAUD + 0.3 ? [1, 0] : [0, 0], brow: { l: 14, r: 14 } }); th.headTilt = t < FRAUD + 0.3 ? 6 : 0; }
    if (t >= DUNK - 0.3) { const k = E.inOutSine(seg(t, DUNK - 0.3, DUNK + 0.2)); th.armR = { x: lerp(150, 330, k), y: lerp(10, -120, k) }; th.look = [1, 0.2]; }
    if ([2, 3, 5].some((i) => speaking(t, i))) { th.mouth = "o"; th.open = talkOpen(t, 1); }
    if (blink(t, 0.4) && th.eyes === "open") th.eyes = "closed";
    th.sy = (th.sy || 1) * (1 + 0.01 * Math.sin(t * 2.4));
    // ---------------- Bonk (enters after Thog's idea)
    let bk = null;
    if (t >= BONKIN - 0.5) {
      bk = Object.assign({}, BK, Wd.BONK, F.smug, { look: [-1, 0], armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } });
      if (t < BONKIN) bk.x = lerp(1350, BK.x, E.outBack(seg(t, BONKIN - 0.5, BONKIN)));
      if (t >= ls(5) && t < le(5) + 0.3) bk = Object.assign(bk, F.shock, { look: [-1, 0] });
      if (t >= le(5) + 0.3 && t < MOONS) bk = Object.assign(bk, F.happy, { look: [-0.6, 0] });
      if (t >= MOONS && t < FIRE1) bk = Object.assign(bk, F.calm, { look: [0, 0] });
      if (t >= FIRE1 - 0.1 && t < DROP) { bk = Object.assign(bk, F.shout, { look: [0.7, -0.6], armL: { x: -160, y: -300 }, armR: { x: 160, y: -300 }, handL: "open", handR: "open" }); if (t < MYHUT) bk = Object.assign(bk, F.shock); }
      if (t >= DROP && t < LESSON) { bk = Object.assign(bk, F.happy, { tear: 1, armL: { x: -150, y: -280 }, armR: { x: 150, y: -280 } }); bk.y = BK.y + arc(seg(t, DROP + 0.1, DROP + 0.55), 50); }
      if (t >= WEEK) bk = Object.assign(bk, { eyes: "half", lid: 0.35, mouth: "o", open: 0.15, look: [-0.7, -0.9], brow: { l: -8, r: -8 }, browUp: 8, armL: { x: -150, y: 10 }, armR: { x: 100, y: -20 }, tear: 0 });
      if (t >= ls(13)) bk = Object.assign(bk, F.worried, { look: [-1, 0.2], sweat: 1 });
      if ([4, 8, 12].some((i) => speaking(t, i))) { bk.mouth = t >= MYHUT && t < DROP ? "shout" : "o"; bk.open = talkOpen(t, 2) + (t >= MYHUT && t < DROP ? 0.3 : 0); }
      if (blink(t, 1.7) && bk.eyes === "open") bk.eyes = "closed";
      bk.sy = (bk.sy || 1) * (1 + 0.01 * Math.sin(t * 2.1 + 1));
    }
    // the torch behind Bonk's back (drawn before him so his body hides the handle)
    const torchOn = t >= WEEK - 0.1 && t < DUNK + 0.05;
    if (bk && torchOn) Wd.torch(Wg, { x: BK.x + 150, y: BK.y - 120, s: 0.9, rot: 14 - 10 * seg(t, ls(13), ls(13) + 0.4), t });
    P.draw(Wg, th);
    if (bk) P.draw(Wg, bk);
    // the pot: in Thog's hands, then on the rock between them
    if (t >= POT - 0.05) {
      const pk = E.outBack(seg(t, POT - 0.05, POT + 0.2)), held = P.hand(th, "L"), potFill = t < MOONS ? 0.12 : t < THEN ? lerp(0.12, 1, seg(t, MOONS + 0.3, THEN - 0.3)) : t < DROP ? 1 : lerp(1, 0.55, seg(t, DROP, DROP + 0.6));
      let px = POTSPOT.x, py = POTSPOT.y, ps = 0.62;
      if (holdPot) { px = (held[0] + P.hand(th, "R")[0]) / 2; py = held[1] + 110; ps = 0.62 * pk; }
      else if (t < YOUR + 0.2) { const k = E.inOutSine(seg(t, YOUR - 0.25, YOUR + 0.2)); px = lerp(TH.x + 50, POTSPOT.x, k); py = lerp(TH.y - 40, POTSPOT.y, k) + arc(k, 80); }
      Wd.pot(Wg, { x: px, y: py, s: ps, fill: potFill, glow: t >= DROP && t < DROP + 1.2 ? 1 - seg(t, DROP + 0.4, DROP + 1.2) : 0 });
      if (t > FISH - 0.35 && t < FISH + 0.1) { const k = seg(t, FISH - 0.35, FISH + 0.1); Wd.fish(Wg, { x: lerp(TH.x - 150, px, k), y: lerp(TH.y - 300, py - 150, k) + arc(k, 150), s: 0.6, rot: k * 400 }); }
      if (t >= DROP && t < DROP + 0.9) for (let i = 0; i < 4; i++) { const k = clamp((t - DROP - i * 0.12) / 0.6); if (k > 0 && k < 1) Wd.fish(Wg, { x: lerp(POTSPOT.x, HUT_B.x, k), y: lerp(POTSPOT.y - 160, HUT_B.y - 100, k) + arc(k, 200), s: 0.55, rot: k * 360, tone: ["#7FB3D5", "#F2A65A"][i % 2] }); }
      if (t > DUNK && t < DUNK + 0.9) { for (let i = 0; i < 4; i++) { const ph = clamp((t - DUNK) / 0.9 + i * 0.1); el("circle", { cx: POTSPOT.x + Math.sin(i * 2 + t * 4) * 30, cy: POTSPOT.y - 160 - ph * 220, r: 24 + ph * 30, fill: "#dfe3e6", opacity: 0.8 * (1 - ph) }, Wg); } }
      if (t >= DUNK - 0.1 && t < DUNK + 0.25) { const k = seg(t, DUNK - 0.1, DUNK + 0.25); Wd.torch(Wg, { x: lerp(BK.x + 150, POTSPOT.x + 10, k), y: lerp(BK.y - 120, POTSPOT.y - 200, k), s: 0.9, rot: lerp(14, 180, k), t, lit: 1 }); }
    }
    // foreground rock (cuts everyone at the waist)
    Wd.rock(Wg, {});
    // the stone-age lightbulb
    if (t >= IDEA && t < POT + 0.3) Wd.idea(Wg, { x: TH.x + 40, y: TH.y - 560, k: E.outBack(seg(t, IDEA, IDEA + 0.2)) * (1 - seg(t, POT, POT + 0.3)), t });
    if (t >= IDEA && t < IDEA + 0.6) FX.sparkle(Wg, { x: TH.x + 40, y: TH.y - 560, k: seg(t, IDEA, IDEA + 0.6), r: 160, n: 8 });
    if (t >= WEIRD - 0.1 && t < ls(13)) Wd.notes(Wg, { x: BK.x + 110, y: BK.y - 470, t });
    if (t >= NEWHUT - 0.1 && t < MOONS) { const k = E.outBack(seg(t, NEWHUT - 0.1, NEWHUT + 0.15)) * (1 - seg(t, MOONS - 0.3, MOONS)); Kit.bubble(Wg, { x: TH.x + 40, y: TH.y - 620, k, text: "", w: 200, think: 1, tail: [-40, 120] }); if (k > 0) Wd.hut(Wg, { x: TH.x + 40, y: TH.y - 590, s: 0.28 * k }); }
    // ---------------- the cave-wall lesson (full-screen insert between two whips)
    if (t >= WIN && t < WOUT) { const ov = el("g", {}, over); el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#6E5A43" }, ov);
      for (let i = 0; i < 9; i++) { const r = MK.rng(i + 3); el("ellipse", { cx: r() * 1080, cy: r() * 1920, rx: 120 + r() * 160, ry: 60 + r() * 90, fill: "#5E4C38", opacity: 0.5 }, ov); }
      const st = lerp(0, 1, seg(t, LESSON + 0.2, w(10, 4))) + seg(t, w(10, 4), w(10, 6) + 0.2) + seg(t, w(10, 7), w(10, 8) + 0.2) + seg(t, w(10, 9), w(10, 10) + 0.3);
      Wd.caveWall(ov, { x: 540, y: 1080, s: 1.18, stage: st }); }
    TR.whip(over, t, WIN0, WIN1, "#C9A66B"); TR.whip(over, t, WOUT0, WOUT1, "#C9A66B");
    let dx = 0; if (t > WIN0 && t < WIN) dx = 600 * E.inQuad(seg(t, WIN0, WIN)); if (t >= WOUT && t < WOUT1) dx = -600 * (1 - E.outQuad(seg(t, WOUT, WOUT1)));
    const sh = [shake(t, DOWN, DOWN + 0.35, 12), shake(t, DROP, DROP + 0.5, 22, 3), shake(t, MYHUT, MYHUT + 0.3, 10, 5)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, dx, bg: "#E6F6FB" };
  },
});
