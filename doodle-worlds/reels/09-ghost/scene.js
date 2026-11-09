/* World 9 · Haunted mansion · "This ghost was fired from haunting" (49.0 s). Twist / repositioning.
   Hook: Boris, a flowery bedsheet ghost, haunting badly -> FIRED stamp. "Boo...?" / Zoe: "Is that... a bedsheet?" -> nobody
   moved out: 5 stars for "cozy vibes" -> the Raven: "You're fired!" (Boris gets his box). Re-hook: who actually WANTS to be
   scared? Teenagers, Friday night, who'd pay -> the mansion becomes a haunted escape room (drop, the one flash). Same ghost, same
   boo, new customer: sold out every weekend. Card: same ghost, new customer. Tag: Kabir: "Scariest thing EVER! ...Five stars." */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const BORC = "#7A5AA6", ZOEC = "#7A5AA6", RAVC = "#2B2B3A", KABC = "#2E8F88";
const HAUNT = w(0, 6), FIRED = w(0, 9), BOO = ls(1), SHEET = w(2, 4), FIVE = w(3, 6), COZY = w(3, 9), YF = ls(4), WANTS = w(5, 7), SCARED = w(5, 10);
const TEENS = ls(6), FRIDAY = w(6, 3), PAY = w(6, 7), ESCAPE = w(7, 8), SAMEG = w(8, 1), SAMEB = w(8, 3), NEWC = w(8, 5), SOLD = w(8, 6);
const REPOS = w(9, 1), NOTSELL = w(9, 5), WRONG = w(9, 12), SCARIEST = w(10, 3), STARS = w(10, 6), CTA = ls(11);
const BOR = { x: 380, y: 1150, s: 0.9 }, ZO = { x: 840, y: 1420, s: 1.0 };

WK.film({
  flashAt: ESCAPE,
  captions: [
    [0, ls(1), ["SO BAD AT HAUNTING...", { y: 290, size: 84, at: [w(0, 3), w(0, 4), w(0, 5), HAUNT] }], ["HE GOT FIRED.", { y: 400, size: 96, at: [w(0, 7), w(0, 8), FIRED], accent: ["FIRED."], acc: "#E5484D" }]],
    [ls(1), ls(2), ["“Boo...?”", { y: 320, size: 110, at: [BOO], color: BORC }]],
    [ls(2), ls(3), ["“IS THAT...", { y: 290, size: 96, at: [ls(2), w(2, 1)], color: ZOEC }], ["A BEDSHEET?”", { y: 400, size: 96, at: [w(2, 2), SHEET], color: ZOEC }]],
    [ls(3), ls(4), ["NOBODY MOVED OUT.", { y: 290, size: 88, at: [ls(3), w(3, 1), w(3, 2)] }], ["5 STARS: “COZY VIBES.”", { y: 400, size: 78, at: [FIVE, w(3, 7), COZY, w(3, 10)], accent: ["“COZY", "VIBES.”"], acc: "#E9A23B" }]],
    [ls(4), ls(5), ["“YOU'RE FIRED!”", { y: 320, size: 110, at: [YF, w(4, 1)], color: RAVC }]],
    [ls(5), ls(6), ["WHO ACTUALLY WANTS", { y: 290, size: 84, at: [w(5, 5), w(5, 6), WANTS] }], ["TO BE SCARED?", { y: 400, size: 100, at: [w(5, 8), w(5, 9), SCARED], accent: ["SCARED?"], acc: "#FF4FD8" }]],
    [ls(6), ls(7), ["TEENAGERS. FRIDAY NIGHT.", { y: 290, size: 76, at: [TEENS, FRIDAY, w(6, 4)] }], ["WHO'D PAY FOR IT.", { y: 400, size: 88, at: [w(6, 5), PAY, w(6, 8)], accent: ["PAY"], acc: "#3FB8AF" }]],
    [ls(7), ls(8), ["A HAUNTED", { y: 290, size: 100, at: [w(7, 7)] }], ["ESCAPE ROOM.", { y: 400, size: 104, at: [ESCAPE, w(7, 9)], accent: ["ESCAPE", "ROOM."], acc: "#FF4FD8" }]],
    [ls(8), ls(9), ["SAME BOO. NEW CUSTOMER.", { y: 290, size: 74, at: [SAMEB - 0.1, SAMEB, w(8, 4), NEWC] }], ["SOLD OUT. EVERY WEEKEND.", { y: 400, size: 72, at: [SOLD, w(8, 7), w(8, 8), w(8, 9)], accent: ["SOLD", "OUT."], acc: "#3FB8AF" }]],
    [ls(9), ls(10), ["THAT'S REPOSITIONING.", { y: 290, size: 84, at: [ls(9), REPOS], accent: ["REPOSITIONING."], acc: "#7A5AA6" }], ["MAYBE: WRONG PEOPLE.", { y: 400, size: 84, at: [w(9, 6), WRONG, w(9, 13)], accent: ["WRONG"], acc: "#E5484D" }]],
    [ls(10), CTA, ["“SCARIEST THING EVER!", { y: 290, size: 80, at: [w(10, 2), SCARIEST, w(10, 4), w(10, 5)], color: KABC }], ["...FIVE STARS.”", { y: 400, size: 100, at: [w(10, 6), STARS], color: KABC }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(11, 0)] }], ["“GHOST”", { y: 450, size: 150, at: [w(11, 1)], color: "#FF4FD8" }], ["for the free positioning worksheet", { y: 550, size: 48, at: [w(11, 2), w(11, 3), w(11, 4), w(11, 5), w(11, 6)], color: "#fff" }]],
  ],
  cam: [[0, 1.2, 520, 1080], [ls(1) - 0.1, 1.25, 460, 1080], [ls(1) + 0.25, 1.6, 400, 1060], [ls(2) - 0.15, 1.6, 400, 1060], [ls(2) + 0.25, 1.55, 760, 1140],
    [ls(3) - 0.1, 1.55, 760, 1140], [ls(3) + 0.3, 1.15, 540, 1080], [ls(4) - 0.15, 1.15, 540, 1080], [ls(4) + 0.25, 1.45, 330, 1000], [ls(5) - 0.1, 1.45, 330, 1000],
    [ls(5) + 0.4, 1.6, 400, 1060], [ls(6) - 0.1, 1.6, 400, 1060], [ls(6) + 0.4, 1.15, 540, 1080], [ESCAPE - 0.15, 1.15, 540, 1080], [ESCAPE + 0.1, 1.05, 540, 1040],
    [ls(8) - 0.1, 1.05, 540, 1040], [ls(8) + 0.3, 1.25, 560, 1100], [ls(9) - 0.1, 1.25, 560, 1100], [ls(10) - 0.2, 1.25, 560, 1100], [ls(10) + 0.3, 1.6, 680, 1140], [CTA - 0.1, 1.6, 680, 1140], [CTA + 0.4, 1.2, 560, 1100], [D, 1.24, 560, 1100]],
  render(t, { world: Wg, over }) {
    const neon = t < ESCAPE - 0.05 ? 0 : E.outBack(seg(t, ESCAPE - 0.05, ESCAPE + 0.3)), dark = t < ESCAPE - 0.2 ? 0 : seg(t, ESCAPE - 0.2, ESCAPE + 0.2);
    Wd.hall(Wg, { t, neon, dark });
    if (t < ESCAPE) Wd.candles(Wg, { x: 600, y: 1250, s: 0.9, t });
    else { Wd.timer(Wg, { x: 540, y: 1180, s: 0.7, v: "60:00" }); }
    // the Raven on his perch (boss)
    if (t >= ls(4) - 0.4 && t < ls(5) + 0.3) { const k = E.outBack(seg(t, ls(4) - 0.4, ls(4) - 0.1)) * (1 - seg(t, ls(5), ls(5) + 0.3)); Wd.raven(Wg, { x: 200, y: 780 + (1 - k) * -500, s: 1.1, t, point: t >= YF ? 1 : 0 }); }
    // the teen crowd for "teenagers / Friday night"
    if (t >= TEENS && t < ls(7) + 0.2) Kit.crowd(Wg, { x: 560, y: 1200 + (1 - E.outBack(seg(t, TEENS, TEENS + 0.4))) * 300, s: 0.75, n: 5, spread: 140, tone: "#6A4C93", t, seed: 7 });
    // ---------------- Boris
    let bm = "meek", arms = 0.15, look = [0.4, 0];
    if (t < ls(1)) { arms = 0.2 + 0.15 * Math.sin(t * 3); if (t >= FIRED) bm = "sad"; }
    if (t >= BOO && t < ls(2)) { arms = 0.45 * E.outBack(seg(t, BOO - 0.1, BOO + 0.2)); bm = "boo"; }
    if (t >= ls(2) && t < ls(5)) { bm = "sad"; look = [1, 0]; }
    if (t >= ls(4)) look = [-1, -0.6];
    if (t >= ls(5) && t < ESCAPE) { bm = "meek"; look = [0.6, -0.8]; }
    if (t >= ESCAPE) { bm = "proud"; look = [1, 0]; }
    if (t >= SAMEB - 0.2 && t < SAMEB + 0.9) { bm = "boo"; arms = E.outBack(seg(t, SAMEB - 0.2, SAMEB + 0.1)); }
    Wd.boris(Wg, Object.assign({}, BOR, { t, arms, mood: bm, look, box: t >= YF && t < ls(5) + 0.2 ? E.outBack(seg(t, YF, YF + 0.3)) : 0 }));
    // ---------------- Zoe (the family's daughter), later with Kabir as escape-room customers
    if (t >= ls(2) - 0.4 && t < ls(4)) { let zo = Object.assign({}, ZO, Wd.ZOE, F.deadpan, { look: [-1, -0.3], armL: { x: -60, y: -100 }, armR: { x: 60, y: -100 } });
      if (t < ls(2)) zo.y = ZO.y + 400 * (1 - E.outBack(seg(t, ls(2) - 0.4, ls(2)))); if (speaking(t, 2)) { zo.mouth = "o"; zo.open = talkOpen(t, 1) * 0.6; }
      if (blink(t, 0.6) && zo.eyes === "open") zo.eyes = "closed"; P.draw(Wg, zo);
      el("rect", { x: ZO.x - 30, y: ZO.y - 160, width: 60, height: 100, rx: 10, fill: "#20242C", stroke: "#1d1b1a", "stroke-width": 5 }, Wg); }
    if (t >= ls(8) - 0.3) { const k = E.outBack(seg(t, ls(8) - 0.3, ls(8)));
      let kb = Object.assign({ x: 690, y: 1420 + 400 * (1 - k), s: 0.95 }, Wd.KABIR, F.shout, { look: [-1, -0.4], armL: { x: -150, y: -280 }, armR: { x: 150, y: -280 }, handL: "open", handR: "open" });
      let zo = Object.assign({ x: 910, y: 1420 + 400 * (1 - k), s: 0.95 }, Wd.ZOE, F.shock, { look: [-1, -0.4], armL: { x: -120, y: -120 }, armR: { x: 120, y: -120 } });
      if (t >= ls(9)) { kb = Object.assign(kb, F.happy, { armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 } }); zo = Object.assign(zo, F.happy); }
      if (t >= ls(10)) { kb = Object.assign(kb, F.shout, { sweat: 1, rot: Math.sin(t * 30) * 1.5, armR: t >= STARS - 0.1 ? { x: 170, y: -300 } : { x: 150, y: 10 }, handR: "point" }); if (t >= STARS) kb = Object.assign(kb, F.happy, { rot: 0 }); }
      if (speaking(t, 10)) { kb.mouth = t < STARS ? "shout" : "grin"; kb.open = talkOpen(t, 2); }
      P.draw(Wg, zo); P.draw(Wg, kb); }
    // props
    if (t >= ESCAPE) Wd.chest(Wg, { x: 160, y: 1395, s: 0.7 });
    Wd.sofa(Wg, {});
    if (t >= PAY - 0.1 && t < ls(7)) for (let i = 0; i < 3; i++) Kit.coin(Wg, { x: 600 + i * 60, y: 1060 - i * 20, s: 0.28 * E.outBack(seg(t, PAY - 0.1 + i * 0.08, PAY + 0.15 + i * 0.08)), sym: "₹", spin: 0 });
    if (t >= FRIDAY - 0.2 && t < ls(7)) Wd.calendar(Wg, { x: 880, y: 820, s: 0.8, k: E.outBack(seg(t, FRIDAY - 0.2, FRIDAY + 0.1)) });
    if (t >= ls(5) && t < ls(6)) FX.mark(Wg, { x: BOR.x + 160, y: BOR.y - 330, ch: "?", s: 1, k: E.outBack(seg(t, ls(5), ls(5) + 0.2)) });
    if (t >= ESCAPE && t < ESCAPE + 0.8) FX.sparkle(Wg, { x: 540, y: 920, k: seg(t, ESCAPE, ESCAPE + 0.8), r: 420, n: 14, s: 1.3 });
    // ---------------- over: FIRED, the review, SOLD OUT, the repositioning card, the 5-star tag
    if (t >= FIRED - 0.05 && t < ls(1) + 0.2) Wd.stamp(over, { x: 540, y: 800, s: 1.1, k: E.outBack(seg(t, FIRED - 0.05, FIRED + 0.2)) * (1 - seg(t, ls(1), ls(1) + 0.2)) });
    if (t >= ls(3) - 0.1 && t < ls(4)) { const k = Math.min(E.outBack(seg(t, ls(3) - 0.1, ls(3) + 0.2)), 1 - seg(t, ls(4) - 0.3, ls(4))); Wd.review(over, { x: 540, y: 760, s: 1.1, k, stars: lerp(0, 5, seg(t, FIVE - 0.2, w(3, 7) + 0.2)), text: t >= COZY ? "“cozy vibes”" : "" }); }
    if (t >= SOLD - 0.05 && t < ls(9)) Wd.stamp(over, { x: 540, y: 1460, s: 0.75, k: E.outBack(seg(t, SOLD - 0.05, SOLD + 0.2)) * (1 - seg(t, ls(9) - 0.3, ls(9))), text: "SOLD OUT", col: "#3FB8AF", rot: 6 });
    if (t >= ls(9) - 0.15 && t < ls(10) - 0.1) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.15, ls(9) + 0.15)), 1 - seg(t, ls(10) - 0.4, ls(10) - 0.1));
      el("rect", { x: -10, y: -10, width: 1100, height: 1940, fill: "#120E18", opacity: 0.45 * k }, over); Wd.repos(over, { x: 540, y: 1060, s: 1.0, k, stage: (t >= NOTSELL ? 1 : 0) + (t >= WRONG ? 1 : 0), t }); }
    if (t >= STARS - 0.1 && t < CTA) Wd.review(over, { x: 540, y: 1480, s: 0.7, k: E.outBack(seg(t, STARS - 0.1, STARS + 0.2)), stars: 5, text: "“terrifying!”" });
    const sh = [shake(t, FIRED, FIRED + 0.3, 14), shake(t, ESCAPE, ESCAPE + 0.5, 22, 3), shake(t, SAMEB, SAMEB + 0.4, 12, 5)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#2B2440" };
  },
});
