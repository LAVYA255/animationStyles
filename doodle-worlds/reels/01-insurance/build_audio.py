"""World 1 mix: voices + Mixkit "Comical" (its drop at 42.03 s lands on "The pot PAID") + camp ambience + one SFX per action."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
DOWN, AGAIN1, IDEA, POT, FISH, BONKIN = w(1, 3), w(1, 4), le(2) + 0.12, ls(3), w(3, 3), le(2) + 0.5
MOONS, THEN, FIRE1, MYHUT, DROP, BUILT = ls(6), ls(7), w(7, 4), ls(8), w(9, 2), w(9, 7)
LESSON, WEEK, FIRE2, WEIRD, FRAUD, CTA, DUNK = ls(10), ls(11), w(11, 6), ls(12), w(13, 4), ls(14), w(14, 2)
m.voices()
m.music("m2.mp3", drop_in_song=42.028, drop_at=DROP, base=-15,
        env=[(0, ls(0), -9), (THEN, DROP - 0.6, -21), (DROP - 0.6, DROP - 0.02, -13), (DROP - 0.02, LESSON - 0.3, -2), (LESSON - 0.3, WEEK, -17),
             (WEIRD - 0.25, FRAUD - 0.1, -30), (CTA, D, -16)])
m.room("prehistoric outdoor camp ambience, gentle wind, distant birds", -22, 0, MOONS)
m.room("night outdoors, crickets, gentle wind", -21, MOONS - 0.2, THEN + 0.3, secs=5.0)
m.room("prehistoric outdoor camp ambience, gentle wind, distant birds", -22, THEN, D)
crackle = m.fx("campfire crackling, wood burning", 3.0)
for a, b, g in [(0, DOWN, -11), (FIRE1 - 0.2, DROP + 0.4, -10), (FIRE2 - 0.2, D, -14)]:
    t = a
    while t < b - 0.1: m.put(crackle, t, g, dur=min(3.0, b - t), fade=0.15); t += 2.9
CUES = [
    (DOWN, "wooden hut collapsing, sticks crashing down", 1.0, -4), (AGAIN1, "cartoon eye blink, soft", 0.5, -10),
    (IDEA, "small fire igniting whoosh with a magical twinkle", 0.8, -5), (BONKIN - 0.4, "quick swoosh transition", 0.5, -9),
    (POT - 0.05, "cartoon magic pop, pulling a huge object out of a pocket", 0.5, -5), (FISH, "wet fish plopping into a clay pot", 0.5, -5),
    (MOONS, "magical time passing whoosh", 0.8, -9), (FIRE1 - 0.2, "fire igniting with a big whoosh", 0.8, -4),
    (DROP - 0.5, "magical power up riser, short", 0.5, -5), (DROP, "big cartoon title slam impact boom", 0.8, -3),
    (DROP + 0.2, "small tribe crowd cheering hooray", 1.2, -9), (BUILT, "anime sparkle shine ting", 0.6, -6),
    (LESSON - 0.3, "quick whip pan whoosh", 0.5, -6), (WEEK - 0.4, "quick whip pan whoosh", 0.5, -6),
    (FIRE2 - 0.2, "fire igniting with a big whoosh", 0.8, -5), (WEIRD - 0.1, "innocent cartoon whistling", 1.2, -8),
    (FRAUD, "comedic dramatic sting, dun dun dun", 1.0, -4), (DUNK + 0.15, "torch extinguished in water, loud sizzle hiss", 0.8, -4),
    (CTA, "cartoon pop", 0.5, -11),
]
for at, p, s, g in CUES: m.cue(at, p, s, g)
plop = m.fx("wet fish plopping into a clay pot", 0.5)
for i in range(9): m.put(plop, MOONS + 0.5 + i * 0.32, -15, dur=0.35)
ham = m.fx("fast wooden hammering, building a hut quickly", 1.5)
m.put(ham, DROP + 0.9, -11, dur=BUILT - DROP - 0.9, fade=0.05)
brush = m.fx("paint brush strokes on rough stone", 0.6)
for a in (w(10, 2), w(10, 4), w(10, 7), w(10, 9)): m.put(brush, a, -11)
m.finish()
