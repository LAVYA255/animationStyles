"""World 11 mix: voices + Mixkit "Smile" (m1076, ukulele; its drop at 44.56 s lands on "I CUT.") + sea/deck room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
MINE, ALL, NOBODY, TEETH = w(2, 0), w(2, 1), w(3, 1), w(3, 5)
COUNT, DAYS, STILL = [w(5, 0), w(5, 3), w(5, 6)], ls(6), w(6, 3)
PILES, PICK, FAIR, BIGGER = w(8, 5), w(8, 6), w(9, 7), w(9, 12)
CUT, CHOOSE, FAIREST, TREAS, CHORES, BIZ = w(10, 2), w(10, 3), w(10, 6), w(10, 11), w(10, 12), w(10, 15)
TAG, PARROT, CTA = ls(11), w(11, 4), ls(12)
m.voices()
m.music("m1076.mp3", drop_in_song=44.559, drop_at=CUT, base=-16,
        env=[(0, ls(0), -10), (ls(1), ls(10) - 0.05, -18), (NOBODY, ls(4) - 0.05, -60), (DAYS, ls(7), -15), (ls(10) - 0.05, CUT, -14), (CUT, TREAS, -3), (TREAS, D, -16)],
        stop_at=NOBODY - 0.45, stop_len=0.45)
m.room("wooden ship creaking gently, calm sea waves, seagulls far away", -20)
pop = m.fx("cartoon pop", 0.5)
for a in (ls(1), ls(4), ls(7)): m.put(pop, a, -10, dur=0.3)
CUES = [(0.1, "coins jingling, pile of gold", 0.8, -10), (MINE - 0.1, "cartoon dive whoosh", 0.4, -8), (ALL + 0.05, "cartoon brawl fight cloud, punches, bonks and yelps", 2.0, -6),
        (NOBODY - 0.4, "coins splashing into the sea", 0.8, -9), (TEETH, "comedic slide whistle down", 0.6, -9),
        (COUNT[0] + 0.1, "single coin clink", 0.3, -8), (COUNT[1] + 0.1, "single coin clink", 0.3, -8), (COUNT[2] + 0.1, "single coin clink", 0.3, -8),
        (DAYS - 0.1, "fast clock ticking time lapse whoosh", 1.6, -9), (STILL, "rooster crow, short", 0.8, -14),
        (PILES - 0.2, "coins sliding into two piles", 0.6, -9), (PICK + 0.2, "suspicious cartoon hmm", 0.5, -14), (FAIR, "bright checkmark ding, game reward", 0.5, -10),
        (BIGGER, "greedy cartoon gulp", 0.4, -11), (CUT - 0.45, "magical power up riser, short", 0.45, -6), (CUT, "big cartoon title slam impact boom", 0.8, -5),
        (CHOOSE, "bright checkmark ding, game reward", 0.5, -8), (FAIREST, "anime sparkle shine ting", 0.6, -7),
        (TREAS, "cartoon pop", 0.5, -11), (CHORES, "cartoon pop", 0.5, -11), (BIZ, "cartoon pop", 0.5, -11),
        (TAG - 0.2, "parrot wings flapping, flutter", 0.8, -8), (PARROT, "parrot squawk, short", 0.5, -7), (PARROT + 0.1, "single coin clink", 0.3, -6),
        (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
