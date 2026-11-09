"""World 18 mix: voices + Mixkit m460 "Arab Nights" (its drop at 50.29 s lands on "still STANDING") + desert room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
BEER0, FOUR, SLOW, FASTER, CUP, EXTRA, UPS = w(0, 6), w(0, 8), w(1, 8), ls(2), w(3, 4), w(4, 6), [w(5, 3), w(5, 4), w(5, 5)]
SINGLE, CROOKED, LEAN, NOT, RULE, STRAIGHT, STAND, YEARS, CTA = w(6, 2), w(6, 5), w(7, 5), w(8, 5), w(10, 1), w(10, 4), w(11, 4), w(11, 7), ls(13)
m.voices()
m.music("m460.mp3", drop_in_song=50.294, drop_at=STAND, base=-17,
        env=[(0, ls(0), -13), (ls(1), ls(5), -19), (ls(5), ls(6), -14), (ls(6), STAND - 0.05, -20), (STAND - 0.05, ls(12), -4), (ls(12), D, -18)],
        stop_at=LEAN - 0.4, stop_len=0.45)
m.room("hot desert wind, distant workers chatter, stone tapping", -21)
pop = m.fx("cartoon pop", 0.4)
for i in range(4): m.put(pop, FOUR - 0.2 + i * 0.12, -13, dur=0.25)
whoosh = m.fx("heavy stone block whoosh through air", 0.5)
for i in range(7): m.put(whoosh, ls(5) + i * 0.4, -13, dur=0.45)
thud = m.fx("heavy stone block landing thud", 0.4)
for u in UPS: m.put(thud, u, -8)
CUES = [(0.3, "slurping through a straw", 0.7, -10), (SLOW, "slow cartoon slide whistle down", 0.8, -13), (FASTER, "whip crack of a staff on stone, no whip, wooden thud", 0.3, -9),
        (CUP, "empty cup tapping, hollow", 0.3, -10), (EXTRA, "crowd gasp, comedic", 0.6, -12), (CROOKED, "wobbly wooden creak", 0.8, -9),
        (LEAN - 0.2, "large stone structure creaking and groaning", 1.2, -8), (NOT, "slurping through a straw", 0.6, -12),
        (RULE, "papyrus scroll unrolling", 0.5, -10), (STRAIGHT, "stone grinding into place", 1.0, -10), (STAND - 0.4, "magical power up riser, short", 0.4, -6),
        (STAND, "big orchestral impact boom", 0.8, -6), (STAND + 0.1, "magical sparkle chime, golden", 0.6, -9), (YEARS - 0.6, "fast time lapse whoosh", 1.2, -12),
        (YEARS + 0.2, "camera shutter click", 0.3, -9), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
