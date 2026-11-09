/* World 16 · Arctic · "She tried to sell ice to penguins" (53.7 s). Animal economics (customer discovery).
   Hook: Pemmy's ice stall, a crowd of penguins standing on ice. Pitch: fresh ice, artisanal ice, ice with a tiny umbrella.
   Grump: "Lady. I'm standing on your damn product." Zero sales -> fancier (ice swan, PREMIUM, SUBSCRIBE) -> still zero
   (a snowball rolls by). Radical move: she asks (clipboard, question bubble). "My feet are freezing. Every. Single. Day."
   Everyone agrees -> tiny wool socks -> SOLD OUT IN 1 DAY (the one flash, the drop, everyone hops in socks). Card: don't
   pitch, ask. Tag: "Next product... ice!" / "Oh, for God's sake." (facepalm) -> CTA. Font: Fredoka One. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, Wd = World, FX = Rig.props, K = Kit;
const PEC = "#E0457B", GRC = "#5A4A3A", BLUE = "#3F93C9";
const PENG = w(0, 6), FRESH = ls(1), ART = w(1, 2), UMB = w(1, 8), DAMN = w(2, 5), ZERO = ls(3), SCULPT = w(3, 8), PREM = w(3, 9), SUBS = w(3, 12);
const STILL = ls(4), RADICAL = w(5, 4), ASKED = w(5, 6), FEET = w(6, 1), EVERY = w(6, 4), SINGLE = w(6, 5), DAY = w(6, 6);
const SAME = w(7, 4), SOCKS = w(7, 11), SOLD = ls(8), PITCH = w(9, 4), ASK = w(9, 7), ICE2 = w(10, 3), UGH = ls(11), CTA = ls(12);
const PE = { x: 760, y: 1500, s: 1.25 }, GR = { x: 300, y: 1700, s: 1.2 };
const CROWD = [{ x: 90, y: 1620, s: 1.0, tone: 1 }, { x: 480, y: 1615, s: 0.95, tone: 2 }, { x: -60, y: 1700, s: 1.05, tone: 0 }, { x: 560, y: 1760, s: 1.0, tone: 1 }];

WK.film({
  font: "Fredoka One",
  flashAt: SOLD,
  titleSlam: { text: "SOLD OUT IN 1 DAY!", at: SOLD, until: ls(9) - 0.05, color: "#E5484D", size: 120, y: 330 },
  captions: [
    [0, ls(1), ["SHE TRIED TO SELL ICE...", { y: 290, size: 92, at: [w(0, 0), w(0, 1), w(0, 2), w(0, 3), w(0, 4)], accent: ["ICE..."], acc: BLUE }], ["TO PENGUINS.", { y: 410, size: 120, at: [w(0, 5), PENG] }]],
    [ls(1), ls(2), ["“FRESH ICE! ARTISANAL ICE!”", { y: 290, size: 86, at: [FRESH, w(1, 1), ART, w(1, 3)], color: PEC }], ["“ICE WITH A TINY UMBRELLA!”", { y: 400, size: 86, at: [w(1, 4), w(1, 5), w(1, 6), w(1, 7), UMB], color: PEC }]],
    [ls(2), ls(3), ["“LADY.”", { y: 290, size: 110, at: [ls(2)], color: GRC }], ["“I'M STANDING ON YOUR DAMN PRODUCT.”", { y: 410, size: 76, at: [w(2, 1), w(2, 2), w(2, 3), w(2, 4), DAMN, w(2, 6)], color: GRC }]],
    [ls(3), ls(4), ["ZERO SALES. SO SHE MADE IT FANCIER.", { y: 290, size: 76, at: [ZERO, w(3, 1), w(3, 2), w(3, 3), w(3, 4), w(3, 5), w(3, 6)], accent: ["ZERO"], acc: "#E5484D" }], ["SCULPTURES. PREMIUM. SUBSCRIPTIONS.", { y: 392, size: 70, at: [SCULPT, PREM, SUBS] }]],
    [ls(4), ls(5), ["STILL ZERO.", { y: 320, size: 130, at: [STILL, w(4, 1)], color: "#E5484D" }]],
    [ls(5), ls(6), ["THEN PEMMY TRIED SOMETHING RADICAL.", { y: 290, size: 74, at: [w(5, 0), w(5, 1), w(5, 2), w(5, 3), RADICAL] }], ["SHE ASKED: WHAT'S YOUR BIGGEST PROBLEM?", { y: 392, size: 66, at: [w(5, 5), ASKED, w(5, 7), w(5, 9), w(5, 10)], accent: ["PROBLEM?"], acc: BLUE }], "hard"],
    [ls(6), ls(7), ["“MY FEET ARE FREEZING.”", { y: 290, size: 100, at: [w(6, 0), FEET, w(6, 2), w(6, 3)], color: GRC }], ["“EVERY. SINGLE. DAY.”", { y: 410, size: 108, at: [EVERY, SINGLE, DAY], color: GRC }]],
    [ls(7), ls(8), ["EVERY PENGUIN SAID THE SAME.", { y: 290, size: 84, at: [w(7, 0), w(7, 1), w(7, 2), w(7, 3), SAME] }], ["SO SHE SOLD TINY WOOL SOCKS.", { y: 400, size: 84, at: [w(7, 6), w(7, 7), w(7, 8), w(7, 9), w(7, 10), SOCKS], accent: ["SOCKS."], acc: "#E5484D" }], "hard"],
    [ls(9), w(9, 8), ["THAT'S CUSTOMER DISCOVERY.", { y: 290, size: 86, at: [w(9, 0), w(9, 1), w(9, 2)], accent: ["DISCOVERY."], acc: BLUE }], ["DON'T PITCH YOUR IDEA.", { y: 400, size: 96, at: [w(9, 3), PITCH, w(9, 5), w(9, 6)] }], "hard"],
    [w(9, 8), w(10, 1), ["ASK ABOUT THEIR PROBLEM.", { y: 320, size: 100, at: [w(9, 8) + 0.05, w(9, 8) + 0.1, w(9, 9), w(9, 10)], color: "#24857E" }], "hard"],
    [w(10, 1), ls(11), ["“OKAY! NEXT PRODUCT...”", { y: 290, size: 96, at: [w(10, 1) + 0.1, w(10, 1) + 0.15, w(10, 2)], color: PEC }], ["“ICE!”", { y: 420, size: 140, at: [ICE2], color: BLUE }]],
    [ls(11), w(12, 2), ["“OH, FOR GOD'S SAKE.”", { y: 320, size: 112, at: [w(11, 1), w(11, 2), w(11, 3), w(11, 4)], color: GRC }], "hard"],
    [w(12, 2), D + 1, ["COMMENT", { y: 300, size: 120, at: [w(12, 2) + 0.1] }], ["“ASK”", { y: 455, size: 160, at: [w(12, 2) + 0.3], color: BLUE }], ["for the free customer interview script", { y: 550, size: 50, at: [w(12, 3), w(12, 4), w(12, 5), w(12, 6), w(12, 7)] }]],
  ],
  cam: [[0, 1.8, 700, 1300], [w(0, 5) - 0.2, 1.82, 700, 1300], [w(0, 5) + 0.3, 1.12, 540, 1280], [ls(2) - 0.1, 1.12, 540, 1280], [ls(2) + 0.25, 1.6, 340, 1400],
    [ls(3) - 0.1, 1.6, 340, 1400], [ls(3) + 0.3, 1.3, 680, 1300], [ls(4) - 0.1, 1.3, 680, 1300], [ls(4) + 0.25, 1.12, 540, 1280], [ls(5) - 0.1, 1.12, 540, 1280],
    [ls(5) + 0.3, 1.5, 700, 1280], [ls(6) - 0.1, 1.5, 700, 1280], [ls(6) + 0.25, 1.55, 320, 1450], [ls(7) - 0.1, 1.55, 320, 1450], [ls(7) + 0.3, 1.12, 540, 1280],
    [SOLD - 0.2, 1.12, 540, 1280], [SOLD + 0.2, 1.22, 500, 1360], [ls(9) - 0.1, 1.22, 500, 1360], [ls(9) + 0.3, 1.12, 540, 1280], [ls(10) - 0.1, 1.12, 540, 1280],
    [ls(10) + 0.25, 1.5, 700, 1280], [UGH - 0.1, 1.5, 700, 1280], [UGH + 0.25, 1.5, 340, 1400], [CTA + 0.1, 1.5, 340, 1400], [CTA + 0.6, 1.12, 540, 1280], [D, 1.15, 540, 1280]],
  render(t, { world: Wg, over }) {
    Wd.arctic(Wg, { t, night: 0 });
    const sockOn = (i) => t < SOLD - 0.1 ? 0 : E.outBack(seg(t, SOLD - 0.1 + i * 0.1, SOLD + 0.2 + i * 0.1)), party = t >= SOLD && t < ls(9) + 0.5;
    const sign = t >= SOCKS - 0.35 && t < ICE2 - 0.2 ? "SOCKS" : "ICE";
    // ---------------- Pemmy (behind her stall)
    let pe = { x: PE.x, y: PE.y, s: PE.s, t, kind: "pemmy", face: "happy", talk: 0, flap: 0, hold: null, look: -1 };
    if (speaking(t, 1) || speaking(t, 10)) pe = Object.assign(pe, { face: "open", talk: talkOpen(t, 1), hold: 1, flap: speaking(t, 10) ? 1 : 0 });
    if (t >= ls(2) && t < ls(3)) pe = Object.assign(pe, { face: "shock" });
    if (t >= ls(3) && t < STILL) pe = Object.assign(pe, { face: "open", hold: 1 });
    if (t >= STILL && t < ls(5)) pe = Object.assign(pe, { face: "sad" });
    if (t >= ls(5) && t < ls(7)) pe = Object.assign(pe, { face: "open", hold: t >= RADICAL ? 1 : null });
    if (t >= SAME && t < ls(9) + 0.5) pe = Object.assign(pe, { face: "happy", flap: t >= SOLD ? 1 : 0, hop: t >= SOLD ? 1 : 0 });
    if (t >= UGH) pe = Object.assign(pe, { face: "happy", hold: 1 });
    Wd.penguin(Wg, pe);
    Wd.stall(Wg, { x: 760, y: 1380, sign, t, soldout: t >= SOLD ? E.outBack(seg(t, SOLD, SOLD + 0.3)) * (1 - seg(t, ICE2 - 0.4, ICE2 - 0.1)) : 0 });
    // products on the counter
    const fade = t < RADICAL ? 1 : 1 - seg(t, RADICAL, RADICAL + 0.4);
    Wd.cube(Wg, { x: 620, y: 1380, s: 0.9, k: fade * (t < FRESH ? 1 : 1), t });
    if (t >= SCULPT - 0.1) Wd.swan(Wg, { x: 860, y: 1380, s: 0.95, k: fade * E.outBack(seg(t, SCULPT - 0.1, SCULPT + 0.2)) });
    if (t >= PREM - 0.1 && fade > 0) K.label(Wg, { x: 870, y: 1210, text: "PREMIUM", size: 40, k: fade * E.outBack(seg(t, PREM - 0.1, PREM + 0.2)), tone: "#F2C14E", rot: 8 });
    if (t >= SUBS - 0.1 && fade > 0) K.label(Wg, { x: 600, y: 1170, text: "SUBSCRIBE", size: 40, k: fade * E.outBack(seg(t, SUBS - 0.1, SUBS + 0.2)), tone: "#E5484D", ink: "#fff", rot: -6 });
    if (t >= SOCKS - 0.1 && t < ICE2 - 0.2) [620, 760, 900].forEach((sx, i) => Wd.sock(Wg, { x: sx, y: 1380, s: 0.9, k: E.outBack(seg(t, SOCKS - 0.1 + i * 0.08, SOCKS + 0.2 + i * 0.08)), rot: (i - 1) * 8 }));
    if (t >= ICE2 - 0.2) { Wd.cube(Wg, { x: 760, y: 1380, s: 1.1, k: E.outBack(seg(t, ICE2 - 0.2, ICE2 + 0.1)), t }); if (t < ICE2 + 0.8) FX.sparkle(Wg, { x: 760, y: 1250, k: seg(t, ICE2, ICE2 + 0.8), r: 160, n: 8, s: 0.8 }); }
    if (t >= RADICAL && t < ls(7)) { Wd.clipboard(Wg, { x: PE.x + 150, y: 1170, s: 1, k: E.outBack(seg(t, RADICAL, RADICAL + 0.25)) });
      if (t >= ASKED - 0.1 && t < ls(6) + 0.3) K.bubble(Wg, { x: 640, y: 1030, k: E.outBack(seg(t, ASKED - 0.1, ASKED + 0.2)) * (1 - seg(t, ls(6), ls(6) + 0.3)), text: "Biggest problem?", size: 44, tail: [60, 90] }); }
    // ---------------- the crowd + Grump
    CROWD.forEach((c, i) => { let o = { x: c.x, y: c.y, s: c.s, t, tone: c.tone, face: "flat", look: 1, socks: sockOn(i + 1) };
      if (t < ls(1)) o.face = "open"; if (t >= ls(3) && t < ls(5)) o.face = "squint"; if (t >= SAME - 1 && t < SOCKS) o = Object.assign(o, { face: "sad", shiver: 1 });
      if (party) o = Object.assign(o, { face: "happy", hop: 1, flap: 1 }); if (t >= UGH) o.face = "flat";
      Wd.penguin(Wg, o); });
    let gr = { x: GR.x, y: GR.y, s: GR.s, t, kind: "grump", face: "flat", look: 1, socks: sockOn(0) };
    if (speaking(t, 2)) gr = Object.assign(gr, { face: "flat", talk: talkOpen(t, 2) });
    if (t >= ls(3) && t < ls(6)) gr.face = "squint";
    if (t >= ls(6) && t < SOCKS) gr = Object.assign(gr, { face: "angry", shiver: 1, hop: [EVERY, SINGLE, DAY].some((a) => t > a && t < a + 0.25) ? 1 : 0 });
    if (speaking(t, 6)) gr.talk = talkOpen(t, 3);
    if (party) gr = Object.assign(gr, { face: "happy", hop: 1 });
    if (t >= UGH) gr = Object.assign(gr, { face: "flat", palm: E.outBack(seg(t, UGH, UGH + 0.3)), talk: speaking(t, 11) ? talkOpen(t, 4) : 0 });
    Wd.penguin(Wg, gr);
    if (t >= STILL - 0.2 && t < ls(5)) Wd.snowball(Wg, { x: lerp(-150, 1250, seg(t, STILL - 0.2, ls(5))), y: 1800, s: 0.9, t });
    if (t >= SOLD && t < SOLD + 1.0) FX.sparkle(Wg, { x: 540, y: 1450, k: seg(t, SOLD, SOLD + 1.0), r: 500, n: 16, s: 1.4 });
    // ---------------- over: sales counter, discovery card
    if (t >= ZERO - 0.1 && t < ls(5)) { const k = Math.min(E.outBack(seg(t, ZERO - 0.1, ZERO + 0.2)), 1 - seg(t, ls(5) - 0.3, ls(5))); K.counter(over, { x: 540, y: 540, s: 1.1 * k, n: 0, label: "SALES" }); }
    if (t >= ls(9) - 0.1 && t < ls(10)) { const k = Math.min(E.outBack(seg(t, ls(9) - 0.1, ls(9) + 0.25)), 1 - seg(t, ls(10) - 0.3, ls(10))); Wd.askCard(over, { x: 540, y: 900, s: 1.0, k, ask: seg(t, ASK - 0.1, ASK + 0.3) }); }
    const sh = [shake(t, SOLD, SOLD + 0.5, 18, 3), shake(t, DAMN, DAMN + 0.25, 8, 5), shake(t, UGH, UGH + 0.3, 8, 7)].concat([EVERY, SINGLE, DAY].map((a, i) => shake(t, a, a + 0.2, 8, 9 + i))).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#BFE6F5" };
  },
});
