"""World 9 mix: voices + Mixkit "Comical" bed reused? no: "Keep Smiling" (m15, its drop at 42.49 s lands on "ESCAPE room") + creaky mansion + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
FIRED, BOO, SHEET, FIVE, COZY, YF, SCARED = w(0, 9), ls(1), w(2, 4), w(3, 6), w(3, 9), ls(4), w(5, 10)
TEENS, FRIDAY, PAY, ESCAPE, SAMEB, SOLD, NOTSELL, WRONG, STARS, CTA = ls(6), w(6, 3), w(6, 7), w(7, 8), w(8, 3), w(8, 6), w(9, 5), w(9, 12), w(10, 6), ls(11)
m.voices()
m.music("m15.mp3", drop_in_song=42.493, drop_at=ESCAPE, base=-16,
        env=[(0, ls(0), -10), (ls(4) - 0.2, ls(5), -24), (ls(5), ESCAPE - 0.05, -17), (ESCAPE - 0.05, ls(9), -3), (ls(9), ls(10), -18), (ls(10), D, -16)])
m.room("old creaky mansion ambience, wind outside, a clock ticking", -20, 0, ESCAPE)
m.room("crowd of excited teenagers murmuring in a spooky room", -24, ESCAPE, D, secs=5.0)
CUES = [(0.1, "ghostly whoooo, weak and pathetic", 1.5, -12), (FIRED, "rubber stamp thunk on paper", 0.5, -2), (BOO + 0.05, "tiny squeaky pathetic ghost boo", 0.6, -10),
        (SHEET + 0.2, "awkward single cricket chirp", 0.8, -10), (FIVE - 0.2, "five quick sparkly star dings", 1.0, -8), (ls(4) - 0.4, "raven caw, loud", 0.8, -6),
        (YF + 0.5, "cardboard box dropped, thud", 0.5, -8), (ls(5), "spooky thinking hum, mysterious", 1.0, -12), (FRIDAY - 0.2, "calendar page flip", 0.5, -8),
        (PAY, "coins clinking", 0.6, -8), (ESCAPE - 0.5, "magical power up riser, short", 0.5, -5), (ESCAPE, "neon sign buzzing on with a pop", 0.8, -4),
        (ESCAPE + 0.05, "big cartoon title slam impact boom", 0.8, -6), (SAMEB - 0.2, "deep spooky ghost BOO with echo", 1.0, -3), (SAMEB + 0.2, "teenagers screaming then laughing, delighted", 1.5, -6),
        (SOLD, "rubber stamp thunk on paper", 0.5, -3), (ls(9) - 0.15, "quick swoosh transition", 0.5, -9), (STARS, "five quick sparkly star dings", 1.0, -6), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
