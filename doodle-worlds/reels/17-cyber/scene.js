/* World 17 · Cyberpunk · "Grandma got a call from her grandson. It wasn't him." (52.7 s). Twist (AI voice-clone scam).
   Hook: neon apartment, holo call rings: ARJUN (it glitches on "wasn't him"). The fake: crashed hover-car, needs money now,
   5,000 credits, don't tell Mom. Same voice, same panic (the voice-clone card: a few seconds of audio). SEND hovers... but
   Nani had one rule: "What's our family safe word?" -> "...The what?" (glitch) -> "Nice try, you damn toaster." (the holo
   reveals a toaster bot: the one flash, the drop) -> safe-word card -> tag: the real Arjun, "Safe word." / "Nani, I'm
   standing right behind you." -> CTA. Font: Audiowide. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const CY = "#3FE0F0", PK = "#FF3FA4", NAC = "#C77DFF", GRN = "#5FE3B0";
const WASNT = w(0, 8), CRASH = w(1, 5), MONEY = w(1, 11), NICK = w(2, 7), BETA = w(3, 1), CRED = ls(4), MOM = w(4, 7);
const RULE = w(6, 4), SAFEW = w(7, 3), WHAT = w(8, 1), TOASTER = w(9, 4), SECRET = w(10, 13), REAL = ls(11), SW = ls(12), BEHIND = w(13, 4), CTA = ls(14);
const NA = { x: 330, y: 1420 }, HOLO = { x: 720, y: 1380 }, AR = { x: 590, y: 1400 };

WK.film({
  font: "Audiowide", capStroke: "#120F22",
  flashAt: TOASTER,
  captions: [
    [0, w(1, 1), ["GRANDMA GOT A CALL FROM HER GRANDSON.", { y: 290, size: 70, at: [w(0, 0), w(0, 1), w(0, 2), w(0, 3), w(0, 4), w(0, 5), w(0, 6)], color: "#fff" }], ["IT WASN'T HIM.", { y: 400, size: 104, at: [w(0, 7), WASNT, w(0, 9)], color: PK }]],
    [w(1, 1), ls(2), ["“NANI! IT'S ME, ARJUN!”", { y: 290, size: 84, at: [w(1, 1) + 0.05, w(1, 1) + 0.1, w(1, 2), w(1, 3)], color: CY }], ["“I CRASHED THE HOVER-CAR. I NEED MONEY!”", { y: 392, size: 66, at: [w(1, 4), CRASH, w(1, 6), w(1, 7), w(1, 9), w(1, 10), MONEY], color: CY }]],
    [ls(2), w(3, 1), ["SAME VOICE. SAME PANIC.", { y: 290, size: 86, at: [w(2, 0), w(2, 1), w(2, 2), w(2, 3)], color: "#fff" }], ["EVEN THE SAME NICKNAME.", { y: 400, size: 86, at: [w(2, 4), w(2, 5), w(2, 6), NICK], color: "#fff" }], "hard"],
    [w(3, 1), ls(4), ["“OH, BETA! HOW MUCH?”", { y: 320, size: 96, at: [BETA + 0.05, BETA + 0.1, w(3, 2), w(3, 3)], color: NAC }], "hard"],
    [ls(4), w(5, 2), ["“5,000 CREDITS.”", { y: 290, size: 100, at: [CRED, w(4, 2)], color: CY }], ["“PLEASE, DON'T TELL MOM!”", { y: 400, size: 86, at: [w(4, 4), w(4, 5), w(4, 6), MOM], color: CY }], "hard"],
    [w(5, 2), w(6, 2), ["A FEW SECONDS OF AUDIO", { y: 290, size: 84, at: [w(5, 2) + 0.05, w(5, 2) + 0.1, w(5, 3), w(5, 4), w(5, 5)], color: "#fff" }], ["IS ENOUGH TO CLONE A VOICE.", { y: 392, size: 80, at: [w(5, 6), w(5, 7), w(5, 8), w(5, 9), w(5, 10), w(5, 11)], accent: ["CLONE"], acc: PK, color: "#fff" }], "hard"],
    [w(6, 2), ls(7), ["BUT NANI HAD ONE RULE.", { y: 320, size: 92, at: [w(6, 2) + 0.05, w(6, 2) + 0.1, w(6, 2) + 0.15, w(6, 3), RULE], color: "#fff" }]],
    [ls(7), WHAT, ["“WHAT'S OUR FAMILY", { y: 290, size: 96, at: [w(7, 0), w(7, 1), w(7, 2)], color: NAC }], ["SAFE WORD?”", { y: 410, size: 120, at: [SAFEW, w(7, 4)], color: GRN }], "hard"],
    [WHAT, ls(9), ["“...THE WHAT?”", { y: 320, size: 120, at: [WHAT + 0.05, WHAT + 0.1], color: PK }], "hard"],
    [ls(9), ls(10), ["“NICE TRY,", { y: 290, size: 104, at: [w(9, 0), w(9, 1)], color: NAC }], ["YOU DAMN TOASTER.”", { y: 410, size: 96, at: [w(9, 2), w(9, 3), TOASTER], color: NAC, accent: ["TOASTER.”"], acc: PK }]],
    [ls(10), w(10, 9), ["A FAMILY SAFE WORD.", { y: 290, size: 92, at: [w(10, 0), w(10, 1), w(10, 2), w(10, 3)], color: GRN }], ["AI CAN COPY A VOICE.", { y: 400, size: 92, at: [w(10, 4), w(10, 5), w(10, 6), w(10, 7), w(10, 8)], color: "#fff" }], "hard"],
    [w(10, 9), ls(11), ["IT CAN'T COPY A SECRET.", { y: 320, size: 92, at: [w(10, 9) + 0.05, w(10, 10), w(10, 11), w(10, 12), SECRET], accent: ["SECRET."], acc: GRN, color: "#fff" }], "hard"],
    [ls(11), ls(12), ["“HI NANI! IT'S ME!”", { y: 320, size: 100, at: [w(11, 0), w(11, 1), w(11, 2), w(11, 3)], color: CY }], "hard"],
    [ls(12), ls(13), ["“SAFE WORD.”", { y: 320, size: 124, at: [SW, w(12, 1)], color: GRN }]],
    [ls(13), w(14, 2), ["“NANI, I'M STANDING", { y: 290, size: 92, at: [w(13, 0), w(13, 1), w(13, 2)], color: CY }], ["RIGHT BEHIND YOU.”", { y: 400, size: 96, at: [w(13, 3), BEHIND, w(13, 5)], color: CY }], "hard"],
    [w(14, 2), D + 1, ["COMMENT", { y: 300, size: 116, at: [w(14, 2) + 0.1], color: "#fff" }], ["“SAFE”", { y: 455, size: 150, at: [w(14, 2) + 0.3], color: GRN }], ["for the free scam-proof checklist for your parents", { y: 550, size: 44, at: [w(14, 3), w(14, 4), w(14, 5), w(14, 6), w(14, 7), w(14, 8), w(14, 9), w(14, 10)], color: "#ddd" }]],
  ],
  cam: [[0, 1.35, 520, 1080], [w(0, 7) - 0.2, 1.37, 520, 1080], [w(0, 7) + 0.3, 1.12, 540, 1020], [ls(1) - 0.1, 1.12, 540, 1020], [ls(1) + 0.3, 1.5, 680, 1100],
    [ls(2) - 0.1, 1.5, 680, 1100], [ls(2) + 0.3, 1.6, 360, 1080], [ls(4) - 0.1, 1.6, 360, 1080], [ls(4) + 0.3, 1.35, 600, 1020], [ls(5) - 0.1, 1.35, 600, 1020],
    [ls(5) + 0.3, 1.1, 540, 1020], [ls(6) - 0.1, 1.1, 540, 1020], [ls(6) + 0.3, 1.5, 470, 1080], [ls(8) - 0.15, 1.52, 470, 1080], [ls(8) + 0.2, 1.5, 690, 1100],
    [TOASTER - 0.3, 1.5, 690, 1100], [TOASTER + 0.1, 1.25, 540, 1070], [ls(10) - 0.1, 1.25, 540, 1070], [ls(10) + 0.3, 1.1, 540, 1020], [REAL - 0.1, 1.1, 540, 1020],
    [REAL + 0.4, 1.4, 450, 1070], [CTA - 0.1, 1.4, 450, 1070], [CTA + 0.5, 1.12, 540, 1020], [D, 1.15, 540, 1020]],
  render(t, { world: Wg, over }) {
    Wd.room(Wg, { t, alarm: t >= ls(4) && t < RULE ? 0.6 * seg(t, ls(4), ls(4) + 0.5) * (1 - seg(t, RULE - 0.3, RULE)) : 0 });
    // the real Arjun walks in behind Nani (tag)
    if (t >= REAL - 0.6) { let ar = Object.assign({ x: lerp(1250, AR.x, E.outQuad(seg(t, REAL - 0.6, REAL + 0.2))), y: AR.y + Math.sin(t * 1.4) * 4, s: 0.95 }, Wd.ARJUN, F.happy, { look: [-1, 0.2], armR: { x: 160, y: -280 }, handR: "open" });
      if (t >= SW) ar = Object.assign(ar, F.worried, { look: [-1, 0.3], armR: { x: 170, y: -10 } }); if (t >= ls(13)) ar = Object.assign(ar, F.deadpan, { look: [-1, 0.3], armL: { x: -150, y: -200 }, handL: "point" });
      if (speaking(t, 11) || speaking(t, 13)) { ar.mouth = "o"; ar.open = talkOpen(t, 1) * 0.6; } if (blink(t, 0.7) && ar.eyes === "open") ar.eyes = "closed"; P.draw(Wg, ar); }
    // ---------------- Nani
    let na = Object.assign({ x: NA.x, y: NA.y + Math.sin(t * 1.3) * 4, s: 1.05 }, Wd.NANI, F.calm, { look: [1, 0], armR: { x: 170, y: -10 } });
    if (t < ls(1)) na = Object.assign(na, F.calm, { look: [1, 0.3], armR: { x: 230, y: -120 }, handR: "point" });
    if (t >= ls(1) && t < ls(6)) na = Object.assign(na, F.worried, { look: [1, 0] });
    if (t >= ls(3) && t < ls(4)) na = Object.assign(na, { armL: { x: -60, y: -220 }, handL: "open" });
    if (t >= ls(4) && t < RULE) na = Object.assign(na, F.worried, { look: [1, -0.3], armR: { x: 250, y: -230 }, handR: "point", sweat: 1 });
    if (t >= RULE - 0.3 && t < ls(9)) na = Object.assign(na, F.smug, { look: [1, 0], armR: { x: 170, y: -10 } });
    if (t >= ls(7) && t < ls(9)) na = Object.assign(na, F.deadpan, { look: [1, 0] });
    if (t >= ls(9) && t < REAL) na = Object.assign(na, F.smug, { look: [1, 0], armL: { x: -110, y: -160 } });
    if (t >= REAL) na = Object.assign(na, F.deadpan, { look: [1, 0], eyes: "half", lid: 0.5 });
    if (t >= CTA + 0.5) na = Object.assign(na, F.smug);
    if ([3, 7, 9, 12].some((i) => speaking(t, i))) { na.mouth = speaking(t, 3) ? "o" : "flat"; na.open = talkOpen(t, 2) * 0.6; }
    if (blink(t, 0.3) && na.eyes === "open") na.eyes = "closed";
    P.draw(Wg, na); { const h = P.head(na); el("circle", { cx: h[0], cy: h[1] - 42, r: 6, fill: "#C0392B" }, Wg); }
    // ---------------- counter, chai, holo call
    Wd.counter(Wg, { t });
    Wd.chai(Wg, { x: 140, y: 1405, s: 1, t, lift: t >= ls(9) && t < ls(10) ? Math.sin(seg(t, w(9, 4) + 0.3, ls(10)) * Math.PI) : 0 });
    let mode = t < ls(1) ? "ring" : t < WHAT - 0.25 ? "arjun" : t < TOASTER - 0.15 ? "glitch" : t < ls(10) ? "toaster" : "ended";
    if (t >= WASNT - 0.05 && t < WASNT + 0.45) mode = "glitch";
    const holoK = t < 0.2 ? 0 : t < ls(10) + 0.4 ? E.outBack(seg(t, 0.2, 0.5)) : 1 - seg(t, ls(10) + 0.4, ls(10) + 0.8);
    Wd.holo(Wg, { x: HOLO.x, y: HOLO.y, s: 1.1, k: holoK, mode, t, talk: [1, 4, 8].some((i) => speaking(t, i)) ? talkOpen(t, 3) : 0, panic: speaking(t, 1) || speaking(t, 4) ? 1 : 0 });
    if (t >= CRASH - 0.1 && t < ls(2)) Wd.crash(Wg, { x: HOLO.x + 230, y: 960, s: 1, k: Math.min(E.outBack(seg(t, CRASH - 0.1, CRASH + 0.2)), 1 - seg(t, ls(2) - 0.3, ls(2))), t });
    if (t >= CRED - 0.1 && t < ls(7)) Wd.send(Wg, { x: HOLO.x - 40, y: 900, s: 0.85, k: Math.min(E.outBack(seg(t, CRED - 0.1, CRED + 0.2)), 1 - seg(t, ls(7) - 0.3, ls(7))), glow: 1, t, cancel: t >= RULE ? 1 : 0 });
    if (t >= TOASTER && t < TOASTER + 0.9) FX.sparkle(Wg, { x: HOLO.x, y: 1200, k: seg(t, TOASTER, TOASTER + 0.9), r: 320, n: 12, s: 1.2 });
    // ---------------- over: voice-clone card, safe-word card
    if (t >= ls(5) - 0.1 && t < ls(6)) { const k = Math.min(E.outBack(seg(t, ls(5) - 0.1, ls(5) + 0.25)), 1 - seg(t, ls(6) - 0.3, ls(6))); Wd.cloneCard(over, { x: 540, y: 900, s: 1.0, k, t }); }
    if (t >= ls(10) - 0.1 && t < REAL - 0.2) { const k = Math.min(E.outBack(seg(t, ls(10) - 0.1, ls(10) + 0.25)), 1 - seg(t, REAL - 0.5, REAL - 0.2)); Wd.safeCard(over, { x: 540, y: 900, s: 1.0, k, line2: seg(t, w(10, 4), w(10, 4) + 0.4) }); }
    const sh = [shake(t, TOASTER, TOASTER + 0.5, 20, 3), shake(t, WHAT, WHAT + 0.4, 10, 5), shake(t, WASNT, WASNT + 0.3, 8, 7), shake(t, CRASH, CRASH + 0.3, 8, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#221C3A" };
  },
});
