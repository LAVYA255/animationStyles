"""World 8 mix: voices + Mixkit "Banjo-ish" bed (m9 "Kidding Around", its drop at 75.88 s lands on "EVERYONE") + desert wind + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
WON, V, FREE, BROKE, ROSA, TEN, LAUGH = w(0, 9), [w(1, 1), ls(2), ls(3), ls(4)], w(5, 4), w(5, 9), w(6, 1), w(6, 8), ls(7)
EVERY, SHADE, PIANO, ICE, RACE, DIFF, PLEASE, CTA = ls(8), w(8, 3), w(8, 5), w(8, 7), w(9, 5), w(9, 13), ls(10), ls(11)
m.voices()
m.music("m9.mp3", drop_in_song=75.883, drop_at=EVERY, base=-15,
        env=[(0, ls(0), -9), (ls(1), ls(5), -13), (ls(5), ROSA, -22), (ROSA, EVERY - 0.05, -17), (EVERY - 0.05, ls(9), -2), (ls(9), PLEASE, -18), (PLEASE, CTA, -22), (CTA, D, -16)])
m.room("dusty desert town ambience, wind, distant horse", -21)
ding = m.fx("cash register cha-ching", 0.6)
for v in V: m.put(ding, v + 0.05, -9, dur=0.5)
CUES = [(WON, "cartoon question mark pop", 0.5, -8), (FREE, "sad game over bloop", 0.6, -6), (BROKE - 0.6, "tumbleweed rolling in the wind, whoosh", 1.5, -6),
        (BROKE, "moth fluttering out of an empty box", 0.6, -9), (ROSA - 0.1, "wooden boards falling off and clattering", 0.8, -6), (OPENED := w(6, 2), "saloon swinging doors creaking open", 0.8, -6),
        (TEN, "bright checkmark ding, game reward", 0.5, -8), (LAUGH, "cowboy belly laugh, short", 0.8, -14), (EVERY - 0.5, "magical power up riser, short", 0.5, -5),
        (EVERY, "big cartoon title slam impact boom", 0.8, -5), (EVERY + 0.2, "crowd footsteps and chatter moving across a street", 1.5, -9),
        (PIANO - 0.1, "honky tonk piano riff, short", 1.5, -10), (ICE - 0.1, "ice cubes clinking in a glass", 0.6, -5), (ls(9) - 0.15, "quick swoosh transition", 0.5, -9),
        (RACE, "falling cartoon whistle down", 0.8, -9), (DIFF, "cheerful magical chime", 0.8, -8), (PLEASE + 1.4, "comedic dramatic sting, dun dun dun", 1.0, -8), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
