/* World 15 · Fairy-tale farm · "He tried to scale the golden goose" (57.0 s). Fable twist (burnout).
   Hook: Goldie lays a golden egg, Farmer Tod still unhappy: "One egg? We're scaling, baby!" Night shifts, weekend shifts,
   motivational posters, "Rise and grind!" / "They literally do." Week 1: two eggs, week 2: one, week 3: a tiny sad bronze
   egg. "I'm a goose. Not a damn factory." He lets her sleep (lights off, posters down, blanket) -> morning: one big
   golden egg (the one flash, the drop) and a stack that grows for years -> eggs-per-day card -> tag: "what if we started
   a podcast?" / "I will bite you." (bite) -> CTA. Font: Chewy. */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props, K = Kit;
const TOC = "#C0443A", GOC = "#B8733A", GOLDC = "#E9B400";
const EGG0 = w(0, 4), HAPPY = w(0, 12), SCALE = w(1, 3), NIGHT = w(2, 3), WEEKEND = w(2, 5), POSTERS = w(2, 7);
const GRIND = w(3, 2), W1 = w(5, 2), W2 = w(5, 6), W3 = ls(6), BRONZE = w(6, 5), DAMN = w(7, 5), SLEEP = w(8, 8);
const GOLDEN = w(9, 3), YEARS = w(9, 7), REST = w(10, 5), POD = w(11, 6), YOU = w(12, 3), CTA = ls(13);
const TO = { x: 300, y: 1420 }, GO = { x: 790, y: 1372 };

WK.film({
  font: "Chewy",
  flashAt: GOLDEN,
  captions: [
    [0, ls(1), ["ONE GOLDEN EGG A DAY.", { y: 290, size: 96, at: [w(0, 3), w(0, 4), w(0, 5), w(0, 6), w(0, 7)], accent: ["GOLDEN"], acc: GOLDC }], ["THE FARMER WASN'T HAPPY.", { y: 400, size: 88, at: [w(0, 8), w(0, 9), w(0, 11), HAPPY] }]],
    [ls(1), NIGHT, ["“ONE EGG?!”", { y: 290, size: 110, at: [w(1, 0), w(1, 1)], color: TOC }], ["“WE'RE SCALING, BABY!”", { y: 410, size: 100, at: [w(1, 2), SCALE, w(1, 4)], color: TOC }], "hard"],
    [NIGHT, ls(3), ["NIGHT SHIFTS. WEEKEND SHIFTS.", { y: 290, size: 84, at: [NIGHT + 0.12, w(2, 4) + 0.05, WEEKEND, w(2, 6)] }], ["MOTIVATIONAL POSTERS.", { y: 400, size: 96, at: [POSTERS, w(2, 8)] }]],
    [ls(3), ls(4), ["“RISE AND GRIND, GOLDIE!”", { y: 290, size: 92, at: [w(3, 0), w(3, 1), GRIND, w(3, 3)], color: TOC }], ["“EGGS DON'T LAY THEMSELVES!”", { y: 400, size: 86, at: [w(3, 4), w(3, 5), w(3, 6), w(3, 7)], color: TOC }]],
    [ls(4), ls(5), ["“THEY LITERALLY DO.”", { y: 290, size: 100, at: [w(4, 0), w(4, 1), w(4, 2)] }], ["“THAT'S THE WHOLE POINT.”", { y: 400, size: 92, at: [w(4, 3), w(4, 4), w(4, 5), w(4, 6)] }]],
    [ls(5), w(6, 1), ["WEEK 1: TWO EGGS.", { y: 290, size: 100, at: [w(5, 0), w(5, 1), W1, w(5, 3)] }], ["WEEK 2: ONE.", { y: 400, size: 100, at: [w(5, 4), w(5, 5), W2] }], "hard"],
    [w(6, 1), ls(7), ["WEEK 3...", { y: 290, size: 104, at: [w(6, 1) + 0.1, w(6, 1) + 0.2] }], ["A TINY, SAD, BRONZE EGG.", { y: 400, size: 92, at: [w(6, 2), w(6, 3), w(6, 4), BRONZE, w(6, 6)], accent: ["BRONZE"], acc: GOC }]],
    [ls(7), ls(8), ["“I'M A GOOSE.”", { y: 290, size: 108, at: [w(7, 0), w(7, 1), w(7, 2)] }], ["“NOT A DAMN FACTORY.”", { y: 410, size: 100, at: [w(7, 3), w(7, 4), DAMN, w(7, 6)] }]],
    [ls(8), ls(9), ["SO TOD TRIED SOMETHING INSANE.", { y: 290, size: 84, at: [w(8, 0), w(8, 1), w(8, 2), w(8, 3), w(8, 4)] }], ["HE LET HER SLEEP.", { y: 400, size: 104, at: [w(8, 5), w(8, 6), w(8, 7), SLEEP], accent: ["SLEEP."], acc: "#6FA8DC" }], "hard"],
    [ls(9), ls(10), ["BACK TO 1 GOLDEN EGG A DAY.", { y: 290, size: 88, at: [w(9, 0), w(9, 1), w(9, 2), GOLDEN, w(9, 4), w(9, 5), w(9, 6)], accent: ["GOLDEN"], acc: GOLDC }], ["FOR YEARS.", { y: 410, size: 120, at: [YEARS - 0.2, YEARS] }]],
    [ls(10), ls(11), ["BURNOUT DOESN'T MAKE MORE EGGS.", { y: 290, size: 84, at: [w(10, 0), w(10, 1), w(10, 2), w(10, 3), w(10, 4)] }], ["REST DOES.", { y: 410, size: 124, at: [REST, w(10, 6)], color: "#24857E" }]],
    [ls(11), ls(12), ["“GOLDIE... WHAT IF WE", { y: 290, size: 96, at: [w(11, 0), w(11, 1), w(11, 2), w(11, 3)], color: TOC }], ["STARTED A PODCAST?”", { y: 400, size: 100, at: [w(11, 4), w(11, 5), POD], color: TOC }]],
    [ls(12), w(13, 2), ["“I WILL BITE YOU.”", { y: 320, size: 124, at: [w(12, 0), w(12, 1), w(12, 2), YOU] }], "hard"],
    [w(13, 2), D + 1, ["COMMENT", { y: 300, size: 120, at: [w(13, 2) + 0.1] }], ["“REST”", { y: 455, size: 160, at: [w(13, 2) + 0.3], color: "#24857E" }], ["for the free weekly rest planner", { y: 550, size: 52, at: [w(13, 3), w(13, 4), w(13, 5), w(13, 6), w(13, 7)] }]],
  ],
  cam: [[0, 1.7, 720, 1150], [w(0, 8) - 0.2, 1.72, 720, 1150], [w(0, 8) + 0.35, 1.12, 540, 1060], [ls(1) - 0.15, 1.12, 540, 1060], [ls(1) + 0.25, 1.55, 340, 1080],
    [ls(2) - 0.15, 1.55, 340, 1080], [ls(2) + 0.3, 1.08, 540, 960], [ls(3) - 0.15, 1.08, 540, 960], [ls(3) + 0.25, 1.5, 380, 1080], [ls(4) - 0.15, 1.5, 380, 1080],
    [ls(4) + 0.25, 1.6, 700, 1150], [ls(5) - 0.15, 1.6, 700, 1150], [ls(5) + 0.3, 1.25, 600, 1100], [BRONZE - 0.35, 1.25, 600, 1100], [BRONZE + 0.05, 1.8, 560, 1320],
    [ls(7) - 0.15, 1.8, 560, 1320], [ls(7) + 0.25, 1.65, 690, 1150], [ls(8) - 0.15, 1.65, 690, 1150], [ls(8) + 0.35, 1.12, 540, 1060], [GOLDEN - 0.3, 1.12, 540, 1060],
    [GOLDEN + 0.1, 1.4, 560, 1200], [ls(10) - 0.15, 1.42, 560, 1200], [ls(10) + 0.3, 1.1, 540, 1060], [ls(11) - 0.15, 1.1, 540, 1060], [ls(11) + 0.3, 1.4, 560, 1120],
    [YOU - 0.1, 1.42, 560, 1120], [YOU + 0.15, 1.3, 560, 1100], [CTA + 0.3, 1.12, 540, 1060], [D, 1.15, 540, 1060]],
  render(t, { world: Wg, over }) {
    // light: day -> night shifts -> (weeks flicker) -> dark sleep -> morning
    let night = t < NIGHT ? 0 : t < ls(8) ? E.inOutSine(seg(t, NIGHT, NIGHT + 0.4)) : 0, dark = 0;
    if (t >= ls(5) && t < ls(7)) night = 0.5 + 0.5 * Math.cos(seg(t, ls(5), ls(7)) * Math.PI * 6);
    if (t >= ls(7) && t < SLEEP) night = 1;
    if (t >= SLEEP - 0.2 && t < ls(9)) { night = 1; dark = E.inOutSine(seg(t, SLEEP - 0.2, SLEEP + 0.2)); }
    if (t >= ls(9)) { night = 1 - E.inOutSine(seg(t, ls(9), ls(9) + 0.6)); dark = 1 - seg(t, ls(9), ls(9) + 0.6); }
    const posters = t < POSTERS - 0.2 ? 0 : t < SLEEP ? seg(t, POSTERS - 0.2, POSTERS + 0.6) : 0, clock = t >= NIGHT && t < SLEEP ? E.outBack(seg(t, NIGHT, NIGHT + 0.3)) : 0;
    const week = t >= ls(5) && t < SLEEP ? (t < w(5, 4) ? 1 : t < W3 ? 2 : 3) : 0;
    Wd.barn(Wg, { t, night, posters, clock, week, dark });
    if (t >= WEEKEND && t < ls(3)) K.label(Wg, { x: 560, y: 1200, text: "WEEKENDS TOO", size: 44, k: E.outBack(seg(t, WEEKEND, WEEKEND + 0.3)), tone: "#FFE27A", rot: 6 });
    if (t >= SLEEP - 0.1 && t < ls(10)) Wd.lamp(Wg, { x: 1000, y: 1180, on: 1 });
    // ---------------- Tod
    let to = Object.assign({ x: TO.x, y: TO.y + Math.sin(t * 1.4) * 4, s: 1.0 }, Wd.TOD, F.happy, { look: [1, 0.2] });
    if (t >= w(0, 8) && t < ls(1)) to = Object.assign(to, F.deadpan, { look: [1, 0.4] });
    if (t >= ls(1) && t < ls(2)) to = Object.assign(to, F.shout, { look: [1, 0], armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open" });
    if (t >= ls(2) && t < ls(3)) to = Object.assign(to, F.happy, { look: [0.6, -0.8], armR: { x: 190, y: -320 }, handR: "point" });
    if (t >= ls(3) && t < ls(4)) to = Object.assign(to, F.shout, { look: [1, 0], armR: { x: 230, y: -160 }, handR: "point" });
    if (t >= ls(4) && t < ls(5)) to = Object.assign(to, F.deadpan, { look: [1, 0] });
    if (t >= ls(5) && t < ls(7)) to = Object.assign(to, F.worried, { look: [1, 0.6], sweat: t >= BRONZE ? 1 : 0 });
    if (t >= ls(7) && t < ls(8)) to = Object.assign(to, F.shock, { look: [1, 0] });
    if (t >= ls(8) && t < ls(9)) to = Object.assign(to, F.calm, { look: [1, 0.3], armR: { x: 40, y: -280 }, handR: "point", eyes: t >= SLEEP ? "happy" : "open" });
    if (t >= ls(9) && t < ls(11)) to = Object.assign(to, F.happy, { look: [1, 0.4] });
    if (t >= ls(11) && t < YOU) to = Object.assign(to, F.happy, { look: [1, 0], armR: { x: 200, y: -220 }, handR: "fist", x: TO.x + 60 * seg(t, ls(11), ls(11) + 0.5) });
    if (t >= YOU) to = Object.assign(to, F.shock, { look: [1, 0], x: TO.x + lerp(60, -40, seg(t, YOU, YOU + 0.25)), armL: { x: -150, y: -300 }, armR: { x: 150, y: -300 }, handL: "open", handR: "open", sweat: 1 });
    if (t >= CTA + 0.6) to = Object.assign(to, F.sad, { look: [1, 0] });
    if ([1, 3, 11].some((i) => speaking(t, i))) { to.mouth = speaking(t, 11) ? "o" : "shout"; to.open = (speaking(t, 11) ? 0.2 : 0.4) + talkOpen(t, 1) * 0.5; }
    if (blink(t, 0.4) && to.eyes === "open") to.eyes = "closed";
    P.draw(Wg, to);
    if (t >= ls(11) && t < YOU + 0.6) { const h = P.hand(to, "R"), fly = seg(t, YOU, YOU + 0.6); Wd.mic(Wg, { x: h[0] + 10 + fly * 300, y: h[1] - 30 - arc(fly, 300), s: 0.8, rot: 10 + fly * 400 }); }
    // ---------------- the rail, Goldie's crate, Goldie
    Wd.rail(Wg, {}); Wd.crate(Wg, { x: GO.x, y: 1380, s: 0.85 });
    let go = { x: GO.x, y: GO.y, s: 0.82, t, flip: -1, mood: "perky", tired: 0, talk: 0, bite: 0, look: 0, blanket: 0 };
    if (t >= ls(2)) go.tired = 0.3 * seg(t, ls(2), ls(3)); if (t >= ls(3)) go = Object.assign(go, { mood: "tired", tired: 0.5 });
    if (t >= ls(5)) go = Object.assign(go, { mood: "tired", tired: lerp(0.6, 1, seg(t, ls(5), W3)) }); if (t >= W3) go = Object.assign(go, { mood: "wrecked", tired: 1 });
    if (t >= ls(7)) go = Object.assign(go, { mood: "angry", tired: 0.6 });
    if (t >= SLEEP - 0.1 && t < ls(9)) go = Object.assign(go, { mood: "asleep", tired: 0, blanket: E.outBack(seg(t, SLEEP - 0.1, SLEEP + 0.3)) });
    if (t >= ls(9)) go = Object.assign(go, { mood: "perky", tired: 0, blanket: 1 - seg(t, ls(9), ls(9) + 0.5) });
    if (t >= ls(11) && t < ls(12)) go = Object.assign(go, { mood: "asleep", blanket: E.outBack(seg(t, ls(11) - 0.3, ls(11))) });
    if (t >= ls(12)) go = Object.assign(go, { mood: "angry", blanket: 0, bite: t < YOU - 0.1 ? 0 : t < YOU + 0.5 ? E.outBack(seg(t, YOU - 0.1, YOU + 0.1)) : 1 - seg(t, YOU + 0.5, YOU + 0.9) });
    if (t >= CTA + 0.6) go = Object.assign(go, { mood: "perky", bite: 0 });
    if ([4, 7, 12].some((i) => speaking(t, i))) go.talk = talkOpen(t, 2);
    Wd.goose(Wg, go);
    if ((go.mood === "asleep") && t < ls(11) + 1) for (let i = 0; i < 2; i++) { const ph = (t * 0.6 + i * 0.5) % 1; K.txt(Wg, GO.x - 150 - ph * 40, 1040 - ph * 90, "z", 46 + ph * 30, "#F3E9D2"); }
    // ---------------- eggs on the rail
    const eggAt = (a, x, kind, s) => { if (t >= a - 0.1 && t < SLEEP) Wd.egg(Wg, { x, y: 1405, s, kind, k: E.outBack(seg(t, a - 0.1, a + 0.2)), t }); };
    if (t < ls(5)) eggAt(EGG0, 560, "gold", 0.9);
    eggAt(W1, 500, "gold", 0.7); eggAt(W1 + 0.15, 560, "gold", 0.7); eggAt(W2, 620, "gold", 0.7); eggAt(BRONZE, 470, "bronze", 0.4);
    if (t >= BRONZE && t < BRONZE + 0.8) for (let i = 0; i < 3; i++) { const ph = seg(t, BRONZE + i * 0.15, BRONZE + i * 0.15 + 0.6); if (ph > 0 && ph < 1) K.txt(Wg, 470 + (i - 1) * 40, 1320 - ph * 60, "...", 40, "#555"); }
    if (t >= GOLDEN - 0.1) { Wd.egg(Wg, { x: 600, y: 1405, s: 1.0, kind: "gold", k: E.outBack(seg(t, GOLDEN - 0.1, GOLDEN + 0.25)), t });
      const n = t < YEARS ? 0 : Math.min(9, Math.floor(seg(t, YEARS, YEARS + 1.2) * 9.99)); for (let i = 0; i < n; i++) { const row = i < 4 ? 0 : i < 7 ? 1 : 2, col = i < 4 ? i : i < 7 ? i - 4 : i - 7;
        Wd.egg(Wg, { x: 440 + col * 46 + row * 23, y: 1405 - row * 54, s: 0.48, kind: "gold", t }); } }
    if (t >= GOLDEN && t < GOLDEN + 0.9) FX.sparkle(Wg, { x: 600, y: 1340, k: seg(t, GOLDEN, GOLDEN + 0.9), r: 300, n: 12, s: 1.2 });
    // ---------------- over: eggs-per-day card
    if (t >= ls(10) - 0.1 && t < ls(11)) { const k = Math.min(E.outBack(seg(t, ls(10) - 0.1, ls(10) + 0.25)), 1 - seg(t, ls(11) - 0.3, ls(11))); Wd.chart(over, { x: 540, y: 930, s: 1.0, k, rest: seg(t, REST - 0.1, REST + 0.5) }); }
    const sh = [shake(t, YOU, YOU + 0.4, 20, 3), shake(t, GOLDEN, GOLDEN + 0.4, 14, 5), shake(t, DAMN, DAMN + 0.25, 8, 7), shake(t, SCALE, SCALE + 0.25, 8, 9)].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
    return { shake: sh, bg: "#C0443A" };
  },
});
