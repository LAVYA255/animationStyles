"""World 6 mix: voices + Mixkit "Secret Garden" (its drop at 45.65 s lands on "Roof leaked? FIXED") + countryside + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
TOWERS, GATES, MOAT, SWANS, Y1, Y2 = w(1, 1), w(1, 3), w(1, 5), w(1, 7), w(2, 1), w(2, 4)
BUILT, ROOM, WOBBLY, TINY, LEAK, FIXED, FIRE, MONTH, BETTER = w(3, 6), w(3, 9), w(3, 10), w(4, 3), w(5, 1), w(5, 2), w(5, 5), w(5, 6), w(5, 9)
WINTER, KNOCK, MVP, LEARN, IMPROVE, COINS, CTA = w(6, 1), ls(7), w(8, 2), w(8, 5), w(8, 9), w(9, 2), ls(10)
m.voices()
m.music("m595.mp3", drop_in_song=45.65, drop_at=FIXED, base=-15,
        env=[(0, ls(0), -9), (ls(4), LEAK, -20), (LEAK, FIXED - 0.05, -17), (FIXED - 0.05, ls(6), -3), (WINTER - 0.2, ls(8), -24), (ls(8), CTA, -17), (CTA, D, -16)])
m.room("medieval countryside ambience, birds, distant sheep, gentle wind", -22, 0, WINTER)
m.room("cold winter wind howling softly, snow", -19, WINTER - 0.3, D, secs=5.0)
ham = m.fx("hammer hitting a wooden nail, single knock", 0.5)
for i in range(6): m.put(ham, 0.3 + i * 0.5, -14, dur=0.3)
for i in range(4): m.put(ham, BUILT + i * 0.25, -9, dur=0.3)
CUES = [(ls(1) - 0.05, "paper scroll unrolling rustle", 0.6, -8), (TOWERS, "royal trumpet fanfare short", 0.8, -10), (Y1, "paper pages piling up thud", 0.5, -8), (Y2, "paper pages piling up thud", 0.5, -7),
        (WOBBLY, "wooden structure creaking and wobbling", 1.0, -6), (TINY, "snooty sniff, comedic", 0.5, -10), (LEAK - 0.2, "water dripping into a bucket", 0.8, -8),
        (FIXED - 0.1, "hammer hitting a wooden nail, single knock", 0.5, -4), (FIXED, "anime sparkle shine ting", 0.6, -6), (FIRE, "fireplace whoosh igniting and crackling", 1.0, -6),
        (MONTH, "window shutters opening, soft creak", 0.6, -8), (BETTER, "cheerful magical chime", 0.8, -7), (WINTER - 0.2, "icy wind gust whoosh", 1.0, -6),
        (KNOCK - 0.6, "footsteps crunching in snow", 1.0, -9), (KNOCK - 0.1, "knocking on a wooden door", 0.6, -4), (ls(8) - 0.15, "quick swoosh transition", 0.5, -9),
        (COINS, "coins clinking onto wood", 0.6, -5), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
crack = m.fx("fireplace crackling, cozy", 3.0)
t = FIRE + 0.5
while t < D - 0.2: m.put(crack, t, -19, dur=min(3.0, D - t), fade=0.2); t += 2.9
m.finish()
