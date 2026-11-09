"""World 3 mix: voices + Mixkit "Party Robot" (its drop at 91.63 s lands on "the bug jumps right OUT") + station hum + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
HITS = [w(2, 0), w(2, 1), w(2, 2)]; NINE, OXY = w(5, 4), ls(6); L1, L2, L3, WAIT, MINUS = w(8, 2), w(8, 7), w(8, 12), w(8, 14), w(8, 17)
BUG, DROP, TURN, FIX2, CTA = w(9, 9), w(9, 12), ls(11), w(11, 2), ls(12)
m.voices()
m.music("m1254.mp3", drop_in_song=91.626, drop_at=DROP, base=-16,
        env=[(0, ls(0), -10), (OXY - 0.2, ls(7), -22), (WAIT - 0.1, MINUS + 0.4, -26), (BUG - 0.6, DROP - 0.02, -13), (DROP - 0.02, ls(10) + 3.0, -2), (FIX2, D, -70)],
        stop_at=FIX2 + 0.02, stop_len=0.5)
m.room("spaceship interior hum, air recycler, soft beeps", -21, 0, FIX2)
m.room("dead spaceship silence, faint emergency hum", -24, FIX2, D, secs=5.0)
alarm = m.fx("spaceship red alert alarm, soft repeating", 1.5)
for i in range(int(OXY // 1.5) + 1): m.put(alarm, i * 1.5, -24 if i else -16, dur=1.5, fade=0.05)
CUES = [(ls(1), "cartoon card slam whoosh", 0.5, -8), (ls(4), "cartoon card slam whoosh", 0.5, -8), (ls(7), "cartoon card slam whoosh", 0.5, -8),
        (ls(3) - 0.1, "metal panel falling off with a clang, electric fizz", 1.0, -5), (ls(5) - 0.2, "heavy book dropped open, pages flutter", 0.8, -7),
        (NINE, "cartoon stretching boing, comedic", 0.6, -8), (OXY - 0.1, "warning beep beep, tense", 0.8, -7), (ls(8) - 0.2, "hologram screen powering on", 0.6, -8),
        (WAIT, "record scratch", 0.6, -6), (MINUS + 0.3, "digital keyboard tap and success chime", 0.6, -5), (BUG - 0.2, "cartoon bug boing jump, springy", 0.6, -4),
        (DROP - 0.5, "magical power up riser, short", 0.5, -5), (DROP, "spaceship engines powering up whoosh roar", 1.5, -3), (DROP + 0.1, "big cartoon title slam impact boom", 0.8, -6),
        (DROP + 0.2, "small crowd cheering hooray", 1.2, -10), (FIX2, "electric power down whine, lights out", 1.2, -2), (FIX2 + 0.9, "awkward single cricket chirp", 0.8, -9),
        (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
bang = m.fx("fist banging on a metal console, clang", 0.5); spark = m.fx("electric sparks crackle", 0.5)
for h in HITS + [FIX2]: m.put(bang, h, -3, dur=0.4); m.put(spark, h + 0.05, -8, dur=0.45)
squeak = m.fx("rubber duck squeak", 0.5)
for a in (w(8, 1), L1, L2, L3): m.put(squeak, a, -10, dur=0.4)
m.put(squeak, TURN + 0.3, -12, dur=0.4)
m.finish()
