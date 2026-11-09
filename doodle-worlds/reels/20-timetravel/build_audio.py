"""World 20 mix: voices + Mixkit m41 (emotional; its drop at 100.94 s lands on "then a SHOP"). The bed tape-stops on Old
Asha's "No." and stays silent until "Today." + kitchen room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
OPEN, FIFTY, BAKERY, NO, COURSE, SAVINGS, RECIPE, LIE = w(0, 4), w(1, 5), w(2, 7), ls(3), w(4, 3), w(4, 6), w(4, 10), w(5, 7)
TODAY, TWELVE, SOLD, HUNDRED, SHOP, TODAY2, TWIST, COOKIE, CTA = w(7, 3), w(8, 3), w(8, 6), w(8, 8), w(8, 11), w(9, 13), ls(10), ls(11), ls(12)
m.voices()
m.music("m41.mp3", drop_in_song=100.937, drop_at=SHOP, base=-60,
        env=[(0, NO - 0.05, -17), (TODAY, SHOP - 0.05, -18), (SHOP - 0.05, ls(9), -5), (ls(9), TWIST, -16), (TWIST, D, -15)],
        stop_at=NO - 0.45, stop_len=0.45)
m.room("quiet apartment kitchen, fridge hum, distant city", -22)
pop = m.fx("soft paper sticky note slap", 0.3)
for at in (COURSE, SAVINGS, RECIPE): m.put(pop, at - 0.05, -10, dur=0.3)
CUES = [(0.1, "magical time portal opening, swirling whoosh and clock ticking", 2.0, -8), (BAKERY, "hopeful gasp, young woman", 0.4, -16),
        (NO, "clock stopping, single tick then silence", 0.8, -10), (LIE, "soft sad piano note", 1.0, -14), (TODAY, "oven knob click and ignition whoosh", 0.8, -8),
        (TWELVE - 0.2, "oven timer ding", 0.5, -8), (SOLD, "cash register cha-ching", 0.5, -9), (HUNDRED, "rising chimes", 0.6, -11),
        (SHOP - 0.4, "magical power up riser, short", 0.4, -7), (SHOP, "warm orchestral impact, hopeful", 0.8, -7), (SHOP + 0.1, "shop door bell jingle", 0.6, -10),
        (TODAY2, "soft bright chime", 0.5, -12), (TWIST - 0.1, "magical time shimmer, sparkle sweep", 1.0, -8), (COOKIE, "cookie crunch bite", 0.4, -10),
        (COOKIE + 0.6, "two women laughing warmly", 1.2, -16), (CTA, "soft pop", 0.4, -12)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
