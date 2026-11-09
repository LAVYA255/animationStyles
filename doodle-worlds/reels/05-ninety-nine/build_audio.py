"""World 5 mix: voices + Mixkit "Owies Ukulele" (its drop at 42.63 s lands on "Sold OUT by lunch") + forest birds + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
EVERY, SQ, NUTIN, FLIP, DROP, LEFT, STOP, ONE = w(0, 2), w(0, 5), ls(2) - 0.4, ls(4), w(6, 1), w(7, 4), w(7, 12), w(8, 6)
SHOPS, CANI, TOMORROW, CTA = w(9, 3), ls(10), w(10, 8), ls(11)
INS0, INS1 = ls(7) - 0.35, le(8) + 0.3
m.voices()
m.music("m1072.mp3", drop_in_song=42.632, drop_at=DROP, base=-15,
        env=[(0, ls(0), -9), (ls(3) - 0.2, FLIP + 0.3, -22), (FLIP + 0.3, DROP - 0.05, -14), (DROP - 0.05, le(6) + 0.8, -2), (INS0, INS1, -19), (CANI, CTA, -20), (CTA, D, -16)])
m.room("forest ambience, birds chirping, gentle leaves rustling", -22)
pop = m.fx("cartoon pop", 0.5)
for i in range(6): m.put(pop, EVERY + i * 0.18, -12, dur=0.3)
CUES = [(SQ - 0.3, "cartoon boing, character popping up", 0.5, -7), (w(1, 7), "single leaf blowing by in the wind, comedic tumbleweed whoosh", 1.0, -9),
        (NUTIN, "cartoon hop boing, small", 0.5, -8), (ls(3), "paint brush swish", 0.5, -10), (FLIP - 0.05, "wooden sign flipping over, clack", 0.6, -4),
        (FLIP + 0.2, "anime sparkle shine ting", 0.6, -6), (ls(5) + 0.6, "coins clinking onto wood", 0.6, -6),
        (DROP - 0.5, "magical power up riser, short", 0.5, -5), (DROP, "big cartoon title slam impact boom", 0.8, -4),
        (DROP + 0.1, "a crowd of tiny cute animals squeaking and cheering", 1.5, -8), (DROP + 0.2, "acorns pouring and rattling", 1.0, -8),
        (INS0, "quick swoosh transition", 0.5, -8), (LEFT - 0.2, "cartoon eye blink, soft", 0.5, -8), (STOP - 0.1, "comedic stop buzzer, short", 0.6, -6),
        (ONE, "bright checkmark ding, game reward", 0.5, -8), (INS1, "quick swoosh transition", 0.5, -9), (SHOPS, "cash register cha-ching", 0.6, -8),
        (CANI + 0.3, "coins clinking onto wood", 0.6, -6), (w(10, 6), "paper note slapped down", 0.5, -7), (TOMORROW + 0.9, "wooden sign flipping over, clack", 0.6, -4),
        (TOMORROW + 1.2, "comedic dramatic sting, dun dun dun", 1.0, -6), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
tick = m.fx("light paper tags fluttering down", 1.0)
m.put(tick, SHOPS - 0.2, -12, dur=2.0, fade=0.1)
m.finish()
