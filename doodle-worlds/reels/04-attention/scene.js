/* World 4 · Dystopia 2087 · "In 2087 you pay with your attention" (54.1 s). Twist format.
   Hook: a smoggy ad-city at night; money is gone, you pay with attention. Coffee = 30 s of ads; rent = 4 h of scrolling a day;
   the City: "Thank you for your attention! Balance: zero." Every buzz and ping is a tax (notifications pile up, TAX stamps).
   Re-hook: the one thing nobody did -> she turns them OFF (drop, the one flash): the notifications fall, the ads die, colour and
   sunrise come back; she reads, builds, starts her own stall; the City glitches "attention levels critical". The richest people
   owned their attention. Twist to the viewer: "you just paid fifty seconds for this video." */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
const CITYC = "#24857E";
const MONEY = w(0, 2), GONE = w(0, 4), ATT = w(0, 8), COFFEE = w(1, 1), ADS = w(1, 6), RENT = w(2, 1), FOUR = w(2, 2), DAY = w(2, 7);
const THANK = ls(3), ZERO = w(3, 6), BUZZ = w(4, 1), PING = w(4, 3), BELIEVE = w(4, 7), TAX = w(4, 11), NOBODY = w(5, 6);
const OFF = w(6, 3), HOURS = w(7, 3), READ = w(7, 5), BUILT = w(7, 7), OWN = w(7, 12), CRIT = w(8, 2), RICH = ls(9), OWNED = w(9, 5);
const FUNNY = ls(10), FIFTY = w(10, 6), CTA = ls(11);
const NV = { x: 540, y: 1420, s: 1.1 }, SCR = { x: 830, y: 800 };
const NOTE = ["PING!", "BUZZ", "You won't believe this", "3 new likes", "SALE ends NOW", "Watch this!", "Hot take!", "BREAKING", "Someone viewed you", "Don't miss out", "PING!", "Trending now"];
const NPOS = [[300, 1000], [790, 1050], [520, 820], [250, 1230], [820, 1250], [380, 700], [740, 680], [180, 880], [900, 900], [140, 1080], [330, 560], [760, 520]];
const NT = NPOS.map((_, i) => i < 2 ? [BUZZ, PING][i] : lerp(BELIEVE - 0.6, TAX - 0.3, (i - 2) / 9));

WK.film({
  flashAt: OFF,
  titleSlam: { text: "OFF.", at: OFF, until: HOURS - 0.15, color: "#7CE38B", size: 200 },
  captions: [
    [0, ATT - 0.4, ["2087.", { y: 290, size: 110, at: [w(0, 1)] }], ["MONEY IS GONE.", { y: 400, size: 88, at: [MONEY, w(0, 3), GONE], accent: ["GONE."], acc: "#FF3D7F" }]],
    [ATT - 0.4, ls(1), ["YOU PAY WITH", { y: 290, size: 92, at: [w(0, 5), w(0, 6), w(0, 7)] }], ["YOUR ATTENTION.", { y: 392, size: 92, at: [w(0, 7) + 0.1, ATT], accent: ["ATTENTION."], acc: "#9D6BFF" }]],
    [ls(1), RENT, ["COFFEE = 30s OF ADS", { y: 300, size: 80, at: [COFFEE, w(1, 2), w(1, 3), w(1, 5), ADS], accent: ["ADS"], acc: "#FF3D7F" }]],
    [RENT, ls(3), ["RENT = 4 HOURS", { y: 290, size: 88, at: [RENT, FOUR, w(2, 3)] }], ["OF SCROLLING A DAY.", { y: 392, size: 80, at: [w(2, 4), w(2, 5), w(2, 6), DAY], accent: ["SCROLLING"], acc: "#9D6BFF" }]],
    [ls(3), ls(4), ["“THANK YOU FOR YOUR ATTENTION!”", { y: 290, size: 60, at: [THANK, w(3, 1), w(3, 2), w(3, 3), w(3, 4)], color: CITYC }], ["“BALANCE: 0”", { y: 392, size: 92, at: [w(3, 5), ZERO], color: CITYC }]],
    [ls(4), NOBODY - 1.2, ["EVERY BUZZ. EVERY PING.", { y: 290, size: 74, at: [w(4, 0), BUZZ, w(4, 2), PING] }], ["= A TAX.", { y: 400, size: 110, at: [w(4, 10), TAX], accent: ["TAX."], acc: "#FF3D3D" }]],
    [ls(5), ls(6), ["THE ONE THING", { y: 290, size: 90, at: [w(5, 3), w(5, 4), w(5, 5)] }], ["NOBODY DID...", { y: 392, size: 90, at: [NOBODY, w(5, 7)] }]],
    [HOURS - 0.1, CRIT - 0.5, ["SHE HAD HOURS.", { y: 290, size: 90, at: [w(7, 1), w(7, 2), HOURS], accent: ["HOURS."], acc: "#E9A23B" }], ["READ. BUILT. STARTED.", { y: 392, size: 76, at: [READ, BUILT, w(7, 9)] }]],
    [CRIT - 0.5, ls(9), ["“ATTENTION LEVELS...”", { y: 290, size: 78, at: [ls(8), w(8, 1)], color: CITYC }], ["“CRITICAL.”", { y: 400, size: 104, at: [CRIT], color: "#FF3D3D" }]],
    [RICH, FUNNY, ["THE RICHEST PEOPLE", { y: 290, size: 84, at: [w(9, 0), w(9, 1), w(9, 2)] }], ["OWNED THEIR ATTENTION.", { y: 392, size: 74, at: [OWNED, w(9, 6), w(9, 7)], accent: ["ATTENTION."], acc: "#E9A23B" }]],
    [FUNNY, CTA, ["YOU JUST PAID", { y: 290, size: 92, at: [w(10, 3), w(10, 4), w(10, 5)] }], ["50 SECONDS FOR THIS.", { y: 400, size: 80, at: [FIFTY, w(10, 7), w(10, 8), w(10, 9)], accent: ["50", "SECONDS"], acc: "#FF3D7F" }]],
    [CTA, D + 1, ["COMMENT", { y: 300, size: 116, at: [w(11, 0)] }], ["“FOCUS”", { y: 450, size: 150, at: [w(11, 1)], color: "#E9A23B" }], ["for the free notification detox", { y: 550, size: 50, at: [w(11, 2), w(11, 3), w(11, 4), w(11, 5), w(11, 6)], color: "#555" }]],
  ],
  cam: [[0, 0.95, 540, 1000], [GONE, 1.05, 540, 1060], [ATT, 1.3, 540, 1160], [ls(1) - 0.1, 1.3, 540, 1160], [ls(1) + 0.4, 1.45, 470, 1190],
    [THANK - 0.25, 1.45, 470, 1190], [THANK + 0.3, 1.18, 660, 1060], [ls(4) - 0.1, 1.18, 660, 1060], [ls(4) + 0.5, 1.1, 540, 1060], [ls(5) - 0.1, 1.1, 540, 1060],
    [ls(5) + 0.5, 1.85, 540, 1170], [OFF - 0.1, 1.85, 540, 1170], [OFF + 0.3, 1.15, 540, 1080], [CRIT - 0.9, 1.15, 540, 1080], [CRIT - 0.4, 1.35, 740, 980],
    [RICH - 0.1, 1.35, 740, 980], [RICH + 0.4, 1.25, 540, 1130], [FUNNY - 0.1, 1.25, 540, 1130], [FUNNY + 0.8, 1.7, 540, 1170], [D, 1.75, 540, 1170]],
  render(t, { world: Wg, over }) {
    const sat = t < OFF ? 0 : E.inOutSine(seg(t, OFF + 0.1, OFF + 1.6)), ads = t < OFF ? 1 : 1 - seg(t, OFF, OFF + 0.4);
    Wd.city(Wg, { sat, t, ads });
    // ---------------- Nova
    const phoneOn = t < OFF;
    let nv = Object.assign({}, NV, Wd.NOVA, { tired: 1, eyes: "half", lid: 0.5, mouth: "flat", look: [0, 0.8], armL: { x: -130, y: -40 }, armR: { x: 70, y: -80 } });
    if (t >= COFFEE - 0.2 && t < RENT) nv = Object.assign(nv, F.shock, { tired: 1, look: [-1, 0] });
    if (t >= RENT && t < THANK) nv = Object.assign(nv, { eyes: "half", lid: 0.65, mouth: "wavy", look: [0, 0.8], tired: 1 });
    if (t >= THANK && t < ls(4)) nv = Object.assign(nv, F.deadpan, { look: [1, -0.6], tired: 1 });
    if (t >= ls(4) && t < ls(5)) nv = Object.assign(nv, F.worried, { sweat: 1, tired: 1, look: [Math.sin(t * 3), -0.3] });
    if (t >= ls(5) && t < OFF) nv = Object.assign(nv, F.angry, { tired: 0, look: [0, 0.6], armL: t > ls(6) - 0.1 ? { x: 40, y: -90 } : { x: -130, y: -40 } });
    if (t >= OFF) nv = Object.assign(nv, F.happy, { tired: 0, armL: { x: -150, y: 10 }, armR: { x: 150, y: 10 }, sweat: 0 });
    if (t >= READ - 0.2 && t < BUILT) nv = Object.assign(nv, F.calm, { look: [-1, 0.6] });
    if (t >= BUILT && t < OWN) nv = Object.assign(nv, F.happy, { look: [1, 0.6] });
    if (t >= CRIT - 0.6 && t < RICH) nv = Object.assign(nv, F.smug, { look: [1, -0.7] });
    if (t >= FUNNY) nv = Object.assign(nv, F.smug, { look: [0, 0], armR: { x: 150, y: -130 }, handR: "point" });
    if (t >= CTA) nv = Object.assign(nv, F.happy, { armR: { x: 150, y: 10 }, handR: "fist" });
    if (blink(t, 0.5) && nv.eyes === "open") nv.eyes = "closed";
    nv.sy = 1 + 0.01 * Math.sin(t * 2.2);
    P.draw(Wg, nv);
    // phone: glowing in her hand, OFF on the drop, put away after
    if (t < OFF + 0.8) { const h = P.hand(nv, "R"); Wd.phone(Wg, { x: h[0] + 10, y: h[1] + 10, s: 0.8, rot: -8, on: phoneOn ? 1 : 0, t, off: t >= OFF ? 1 - seg(t, OFF + 0.5, OFF + 0.8) : 0 }); }
    // the City screen (comes in on "thank you", glitches on "critical", shows the viewer's bill at the end)
    if (t >= THANK - 0.3) { const k = E.outBack(seg(t, THANK - 0.3, THANK)), txt = t < ZERO ? "" : t < FUNNY ? (t > OFF ? "BALANCE: ↓" : "BALANCE: 0") : "YOU: -50s";
      const sxx = lerp(SCR.x, 740, E.inOutSine(seg(t, FUNNY - 0.4, FUNNY + 0.4))); Wd.screen(Wg, { x: sxx, y: SCR.y, s: 0.55, k, t, glitch: t >= ls(8) - 0.2 && t < RICH ? 1 : 0, mood: t >= ls(8) - 0.2 && t < RICH ? "panic" : "smile", text: txt }); }
    // her own life, after switching off
    if (t >= READ - 0.25) Wd.books(Wg, { x: 250, y: 1400, s: 0.75 * E.outBack(seg(t, READ - 0.25, READ + 0.05)) });
    if (t >= BUILT - 0.25) Wd.gadget(Wg, { x: 830, y: 1400, s: 0.8 * E.outBack(seg(t, BUILT - 0.25, BUILT + 0.05)), t });
    if (t >= OWN - 0.3) Wd.stall(Wg, { x: 250, y: 1200, s: 0.5, k: E.outBack(seg(t, OWN - 0.3, OWN)) });
    Wd.rail(Wg, { sat, planters: t >= HOURS ? E.outBack(seg(t, HOURS, HOURS + 0.4)) : 0 });
    // the coffee and its 30-second ad
    if (t >= COFFEE - 0.3 && t < RENT + 0.3) Wd.coffee(Wg, { x: 250, y: 1395, s: 0.85 * E.outBack(seg(t, COFFEE - 0.3, COFFEE)) * (1 - seg(t, RENT, RENT + 0.3)), timer: seg(t, w(1, 3), RENT) });
    // notifications pile up, get TAX stamps, then fall away on OFF
    NPOS.forEach(([x, y], i) => { const a = NT[i]; if (t < a || t > OFF + 0.9) return;
      const k = E.outBack(seg(t, a, a + 0.2)), fall = t > OFF ? E.inQuad(seg(t, OFF, OFF + 0.8)) : 0;
      const sp = 0.55 * E.inOutSine(seg(t, ls(5), ls(5) + 0.8)), nx = 540 + (x - 540) * (1 + sp), ny = 1100 + (y - 1100) * (1 + sp);
      const g = el("g", { transform: `translate(0 ${fall * 1400}) rotate(${fall * (i % 2 ? 40 : -40)} ${nx} ${ny})` }, Wg);
      Wd.notif(g, { x: nx, y: ny + Math.sin(t * 3 + i) * 5, k: k * 0.9, text: NOTE[i], rot: (i % 3 - 1) * 5 });
      if (t >= TAX - 0.05 + i * 0.03) Kit.label(g, { x: nx + 40, y: ny - 40, text: "TAX", size: 34, tone: "#FF3D3D", ink: "#fff", rot: -12, k: E.outBack(seg(t, TAX + i * 0.03, TAX + 0.2 + i * 0.03)) }); });
    if (t >= OFF && t < OFF + 0.8) FX.sparkle(Wg, { x: 540, y: 1100, k: seg(t, OFF, OFF + 0.8), r: 420, n: 14, s: 1.4 });
    // ---------------- over: rent meter, attention balance
    if (t >= RENT - 0.2 && t < THANK + 0.2) { const k = Math.min(E.outBack(seg(t, RENT - 0.2, RENT + 0.1)), 1 - seg(t, THANK - 0.1, THANK + 0.2)); Wd.meter(over, { x: 540, y: 1470, s: 1, k, v: lerp(1, 0.08, seg(t, FOUR, DAY)), label: "RENT: 4h / DAY" }); }
    if (t >= THANK + 0.4 && t < ls(4) + 0.4) { const k = Math.min(E.outBack(seg(t, THANK + 0.4, THANK + 0.7)), 1 - seg(t, ls(4), ls(4) + 0.4)); Wd.meter(over, { x: 540, y: 1470, s: 1, k, v: lerp(0.3, 0, seg(t, w(3, 5), ZERO)), label: "ATTENTION BALANCE" }); }
    const sh = [shake(t, OFF, OFF + 0.5, 22, 3), shake(t, TAX, TAX + 0.3, 10, 5), shake(t, CRIT, CRIT + 0.4, 8, 7)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: sat > 0.5 ? "#FFD9A0" : "#2B2440" };
  },
});
