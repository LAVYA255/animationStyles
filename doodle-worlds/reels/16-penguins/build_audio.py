"""World 16 mix: voices + Mixkit m9 "Kidding Around" (its drop at 75.88 s lands on "SOLD out") + arctic room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
PENG, FRESH, ART, UMB, DAMN, ZERO, SCULPT, PREM, SUBS = w(0, 6), ls(1), w(1, 2), w(1, 8), w(2, 5), ls(3), w(3, 8), w(3, 9), w(3, 12)
STILL, RADICAL, ASKED, EVERY, SINGLE, DAY = ls(4), w(5, 4), w(5, 6), w(6, 4), w(6, 5), w(6, 6)
SOCKS, SOLD, ASK, ICE2, UGH, CTA = w(7, 11), ls(8), w(9, 7), w(10, 3), ls(11), ls(12)
m.voices()
m.music("m9.mp3", drop_in_song=75.883, drop_at=SOLD, base=-17,
        env=[(0, ls(0), -13), (STILL - 0.05, ls(5), -60), (ls(5), ls(6), -20), (ls(6), ls(7), -22), (SOLD - 0.05, ls(9), -4), (ls(9), D, -18)],
        stop_at=STILL - 0.5, stop_len=0.45)
m.room("arctic wind, gentle, distant seagulls and waves", -20)
pop = m.fx("cartoon pop", 0.4)
for at in (FRESH, ART, UMB, SCULPT, PREM, SUBS): m.put(pop, at, -11, dur=0.3)
stomp = m.fx("small foot stomp on snow, crunchy", 0.3)
for at in (EVERY, SINGLE, DAY): m.put(stomp, at, -6)
CUES = [(PENG, "penguin squawk, cute", 0.5, -12), (DAMN, "comedic record scratch", 0.4, -11), (ZERO, "sad game over bloop", 0.6, -10),
        (STILL, "crickets chirping, awkward silence", 1.6, -12), (STILL + 0.3, "wind whistle, lonely", 1.2, -14), (RADICAL, "pencil scribble on paper", 0.5, -12),
        (ASKED, "soft question chime", 0.4, -12), (w(6, 1), "teeth chattering, cold shiver, comedic", 1.0, -10), (SOCKS - 0.1, "magic sparkle, short", 0.4, -9),
        (SOLD - 0.4, "magical power up riser, short", 0.4, -6), (SOLD, "cash register cha-ching", 0.6, -5), (SOLD + 0.1, "crowd of penguins cheering and squawking", 1.5, -10),
        (ASK, "bright checkmark ding, game reward", 0.5, -10), (ICE2, "ice cubes clinking", 0.5, -9), (UGH, "exasperated groan, old man", 0.6, -12),
        (UGH + 0.3, "cartoon slap, facepalm", 0.3, -8), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
