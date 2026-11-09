"""World 17 mix: voices + Mixkit m543 "Cyberpunk City" (its drop at 40.15 s
lands on "TOASTER") + rainy neon city room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
WASNT, CRASH, MONEY, CRED, MOM = w(0, 8), w(1, 5), w(1, 11), ls(4), w(4, 7)
RULE, SAFEW, WHAT, TOASTER, SECRET, REAL, SW, BEHIND, CTA = w(6, 4), w(7, 3), w(8, 1), w(9, 4), w(10, 13), ls(11), ls(12), w(13, 4), ls(14)
m.voices()
m.music("m543.mp3", drop_in_song=40.147, drop_at=TOASTER, base=-17,
        env=[(0, ls(0), -14), (ls(1), ls(6), -19), (ls(6), TOASTER - 0.05, -22), (WHAT - 0.2, TOASTER - 0.05, -60), (TOASTER - 0.05, ls(10), -4), (ls(10), D, -18)])
m.room("rain on a window at night, distant city traffic, neon hum", -20)
CUES = [(0.25, "futuristic phone ringtone, short", 1.2, -10), (WASNT, "digital glitch stutter, short", 0.4, -8), (ls(1), "hologram call connect chirp", 0.4, -10),
        (CRASH, "distant car crash, muffled", 0.6, -14), (CRED, "futuristic payment interface beep", 0.4, -10), (MOM, "tense heartbeat, short", 0.8, -14),
        (ls(5), "digital scan whoosh", 0.5, -12), (RULE, "interface cancel click", 0.3, -8), (SAFEW, "suspense riser, short", 0.5, -10),
        (WHAT, "digital glitch stutter, long", 0.8, -6), (TOASTER - 0.05, "robotic error buzz, comedic", 0.5, -6), (TOASTER, "big synth impact boom", 0.8, -6),
        (TOASTER + 0.6, "hologram power down", 0.5, -10), (ls(10), "secure lock click", 0.4, -10), (REAL - 0.5, "footsteps on hard floor, approaching", 0.6, -14),
        (BEHIND + 0.3, "awkward cartoon cough", 0.4, -14), (CTA, "futuristic notification ping", 0.4, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
