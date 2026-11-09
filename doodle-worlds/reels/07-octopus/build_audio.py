"""World 7 mix: voices + Mixkit "Fun Jazz" (its drop at 70.80 s lands on "Cleaning: a CRAB") + underwater ambience + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
JOBS = [w(1, 7), w(1, 8), w(1, 9), w(1, 10), w(1, 11), w(1, 12)]; COFFEE, FOREVER, DROWN, OCTO, ASK = w(1, 14), w(2, 5), w(3, 2), w(3, 8), ls(4)
RECIPE, CUST, CRAB, SCHED, AUTO, TWO, RAISE, CTA = w(5, 4), w(5, 6), w(6, 5), w(6, 8), w(6, 11), w(7, 7), w(9, 5), ls(10)
m.voices()
m.music("m647.mp3", drop_in_song=70.798, drop_at=CRAB, base=-15,
        env=[(0, ls(0), -9), (ASK - 0.1, ls(6), -23), (ls(6), CRAB - 0.05, -16), (CRAB - 0.05, ls(8), -3), (ls(8), CTA, -18), (CTA, D, -16)])
m.room("underwater ambience, gentle bubbles, muffled ocean", -20)
pop = m.fx("cartoon pop", 0.5)
for a in JOBS + [COFFEE]: m.put(pop, a, -10, dur=0.3)
CUES = [(0.2, "frantic cartoon juggling, clattering pots and pans", 2.0, -12), (ls(2) - 0.5, "bubbly underwater swoosh", 0.6, -9), (FOREVER - 0.1, "cartoon balloon inflating quickly, puff", 0.6, -4),
        (DROWN, "big bubbles blub blub", 0.8, -8), (OCTO - 0.1, "awkward single cricket chirp", 0.8, -12), (ASK - 0.1, "record scratch", 0.6, -6),
        (RECIPE, "magical chime glow", 0.6, -7), (CUST, "magical chime glow", 0.6, -7), (CRAB - 0.4, "crab scuttling, tiny clicking legs", 0.8, -8),
        (CRAB, "big cartoon title slam impact boom", 0.8, -5), (SCHED - 0.2, "paper pinned to a board, thumbtack", 0.5, -6), (AUTO - 0.1, "fluttering wings whoosh, magical", 0.8, -6),
        (TWO, "slurping coffee, satisfied ahh", 1.0, -6), (ls(8) - 0.15, "quick swoosh transition", 0.5, -9), (RAISE, "comedic dramatic sting, dun dun dun", 1.0, -6), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
