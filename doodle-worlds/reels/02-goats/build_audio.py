"""World 02 mix: voices + Mixkit m1063 "Fun at the Farm" (its drop at 53.66 s lands on "140") + pasture room tone + goat SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
GOATS0, NEED, TEN, WINTER, SPRING, BACK, FOURTEEN = w(0, 4), w(1, 6), w(1, 9), w(2, 9), ls(3), w(3, 3), w(4, 1)
DAMN, DIDIT, KEPT, INTEREST, BORN, BABYGOAT = w(5, 1), w(6, 2), w(7, 2), w(7, 7), w(7, 9), w(8, 9)
BABIES2, N10, N24, N58, N140 = w(9, 2), w(10, 0), w(10, 3), w(10, 5), w(10, 7)
MONEY, BAB3, TAG, SURE, SIGN, ROCK, CTA = w(11, 6), w(11, 11), ls(12), ls(13), w(13, 5), w(13, 8), ls(14)
m.voices()
m.music("m1063.mp3", drop_in_song=53.661, drop_at=N140, base=-17,
        env=[(0, ls(0), -13), (ls(5), ls(7), -20), (ls(8), ls(9), -19), (ls(10), N140 - 0.05, -15), (N140 - 0.05, ls(11), -3), (ls(11), D, -17)])
m.room("open meadow ambience, light wind, distant birds", -21)
bleat = m.fx("single cartoon goat bleat, funny", 0.6)
baby = m.fx("tiny baby goat bleat, cute high pitched", 0.5)
pop = m.fx("cartoon pop", 0.4)
m.put(bleat, GOATS0 + 0.05, -6)
for i in range(10): m.put(pop, TEN - 0.6 + i * 0.06, -16, dur=0.25)
for i, d in enumerate([0, 0.12, 0.3, 0.45, 0.6]): m.put(baby, FOURTEEN + d, -10 - (i % 2) * 3)
for i, d in enumerate([0, 0.2, 0.35]): m.put(baby, BABIES2 + d, -11)
for at in (N24, N58): m.put(pop, at, -10, dur=0.3)
CUES = [(WINTER - 0.3, "cold winter wind gust", 1.2, -12), (SPRING, "birds chirping spring morning", 1.5, -14), (BACK, "many hooves trotting on grass", 1.4, -12),
        (DAMN - 0.1, "comedic record scratch", 0.4, -10), (DIDIT, "romantic cartoon harp gliss, short", 0.8, -12), (INTEREST, "cash register cha-ching", 0.6, -9),
        (ls(8), "stone tablet thud", 0.5, -10), (BABYGOAT, "tiny baby goat bleat, cute high pitched", 0.5, -10),
        (N140 - 0.4, "magical power up riser, short", 0.4, -6), (N140, "big cartoon title slam impact boom", 0.8, -6), (N140 + 0.2, "huge crowd of goats bleating chaotically", 2.0, -10),
        (MONEY, "soft pop", 0.3, -12), (BAB3, "soft pop", 0.3, -12), (TAG, "nervous cartoon gulp", 0.4, -12),
        (SIGN - 0.2, "heavy stone sliding on ground", 0.6, -9), (ROCK, "hand slap on stone, thud", 0.4, -6), (ROCK + 0.4, "single cartoon goat bleat, funny", 0.6, -10), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
