"""World 2 mix: voices + Mixkit "Fun and Games" (its drop at 72.93 s lands on "The clay says TEN") + ancient city ambience + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
THEY, RECEIPTS, DURUIN, TEN, HARV1, THREE, MEM, HIS = w(0, 6), w(0, 10), ls(2) - 0.35, w(2, 2), ls(3), w(4, 3), w(5, 6), w(5, 8)
NEXT, PRESSED, CLAY, SEAL, HARV2, THR, DROP = ls(6), w(6, 4), w(6, 9), w(6, 15), ls(7), ls(8), w(9, 3)
FULL, SOON, TRUST, LIES, DOESNT, BEER, CTA = w(10, 2), w(10, 3), w(11, 7), w(11, 9), w(11, 11), ls(12), ls(13)
m.voices()
m.music("m6.mp3", drop_in_song=72.934, drop_at=DROP, base=-15,
        env=[(0, ls(0), -9), (ls(5), NEXT, -19), (THR - 0.2, DROP - 0.05, -24), (DROP - 0.05, FULL + 1.0, -2), (TRUST - 0.8, BEER, -16), (BEER, CTA, -19), (CTA, D, -16)])
m.room("ancient market town ambience, distant voices, gentle wind, very soft", -23)
CUES = [(0.2, "paper scroll unrolling rustle", 0.6, -10), (THEY, "fast marker scribble cross out on paper", 0.6, -6), (RECEIPTS, "heavy clay tablet slammed on a wooden table", 0.6, -3),
        (ls(1) - 0.2, "quick swoosh transition", 0.5, -10), (DURUIN, "quick swoosh transition", 0.5, -9), (TEN + 1.4, "heavy sacks sliding across a table", 0.8, -8),
        (HARV1 - 0.4, "wind through a wheat field, soft whoosh", 1.0, -8), (MEM - 0.2, "cartoon thought bubble pop", 0.5, -8), (HIS - 0.2, "cartoon thought bubble pop", 0.5, -8),
        (HIS + 0.05, "two cartoon bubbles bumping, rubbery boing", 0.5, -9), (NEXT + 0.1, "lump of wet clay slapped onto a table", 0.6, -6),
        (w(6, 13), "stone cylinder rolling over wet clay", 1.0, -6), (HARV2 - 0.4, "wind through a wheat field, soft whoosh", 1.0, -8),
        (DROP - 0.5, "magical power up riser, short", 0.5, -5), (DROP, "big cartoon title slam impact boom", 0.8, -3), (DROP + 0.15, "small crowd gasp", 0.8, -10),
        (TRUST - 0.2, "warm magical chime", 0.8, -8), (LIES, "cartoon thought bubble pop", 0.5, -4), (DOESNT, "anime sparkle shine ting", 0.6, -6),
        (BEER - 0.2, "ceramic jar sliding on a table", 0.6, -6), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
thump = m.fx("sack of grain dropped, soft thump", 0.5)
for i in range(10): m.put(thump, TEN + i * 0.07, -12, dur=0.3)
for i in range(3): m.put(thump, THREE - 0.3 + i * 0.1, -9, dur=0.3)
for i in range(10): m.put(thump, FULL - 0.2 + i * 0.05, -12, dur=0.3)
press = m.fx("stylus pressing into wet clay, soft squish tok", 0.5)
for i in range(10): m.put(press, PRESSED + i * (CLAY + 0.2 - PRESSED) / 10, -10, dur=0.25)
m.put(press, BEER + 1.95, -6, dur=0.3)
tap = m.fx("many people tapping styluses on clay tablets, busy", 1.5)
m.put(tap, SOON, -12, dur=2.6, fade=0.2)
pop = m.fx("cartoon pop", 0.5)
for i in range(12): m.put(pop, SOON + i * 0.18, -16, dur=0.25)
m.finish()
