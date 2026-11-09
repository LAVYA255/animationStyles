"""World 10 mix: voices + Mixkit "Fun and Games"? no: "Playful" (m10 has no drop) -> m12 "Playground Fun" (its drop at 103.86 s lands on "THREE copies") + ruined-city wind + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
NOT, MAPS, SUPPLY, PLANS, BRAINS, LAPTOPS, SHEETS, ZERO = w(0, 8), w(1, 6), w(1, 7), w(1, 10), ls(2), w(2, 2), w(3, 2), w(4, 10)
N3, N2, N1, COPIES, KINDS, ELSE, ATE2, BACKUPS, COPY, CTA = w(5, 8), w(5, 9), w(5, 10), w(6, 1), w(6, 7), w(6, 14), w(7, 8), w(8, 4), w(10, 6), ls(11)
m.voices()
m.music("m12.mp3", drop_in_song=103.863, drop_at=ls(6), base=-16,
        env=[(0, ls(0), -10), (BRAINS - 0.3, ls(5), -22), (ls(5), ls(6) - 0.05, -17), (ls(6) - 0.05, ls(7), -3), (ls(7), ls(9), -16), (ls(9), D, -17)])
m.room("ruined city ambience, wind howling softly, distant groans", -20)
pop = m.fx("cartoon pop", 0.5)
for a in (MAPS, SUPPLY, PLANS): m.put(pop, a, -11, dur=0.3)
CUES = [(NOT, "laptop error beep, sad", 0.5, -8), (BRAINS - 0.5, "zombie rising groan, comedic", 1.0, -9), (LAPTOPS, "crunchy bite into plastic and metal, loud crunch", 0.6, -2),
        (SHEETS, "papers scattering in the wind", 1.0, -6), (ZERO, "sad game over bloop", 0.6, -6), (ls(5) - 0.4, "wise old man hmm, short", 0.6, -14),
        (N3, "deep drum hit", 0.5, -6), (N2, "deep drum hit", 0.5, -6), (N1, "deep drum hit", 0.5, -4), (ls(6) - 0.5, "magical power up riser, short", 0.5, -5),
        (ls(6), "big cartoon title slam impact boom", 0.8, -5), (COPIES, "three quick sparkly dings", 0.8, -8), (KINDS, "bright checkmark ding, game reward", 0.5, -8),
        (ELSE, "heavy vault door closing, clunk", 0.8, -7), (ls(7) - 0.4, "zombie rising groan, comedic", 1.0, -10), (ATE2, "crunchy bite into plastic and metal, loud crunch", 0.6, -3),
        (BACKUPS, "anime sparkle shine ting", 0.6, -5), (COPY + 0.2, "polite little cough", 0.5, -12), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
