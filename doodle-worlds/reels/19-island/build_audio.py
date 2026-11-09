"""World 19 mix: voices + Mixkit m274 "Reggaetton" (its drop at 79.23 s lands on "the whole damn ISLAND") + beach room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
PAST, KOA1, GET, CUST, MOM, TRIED, RAN, GUYS = ls(1), ls(2), w(2, 1), w(3, 1), w(3, 3), w(4, 3), w(4, 5), ls(5)
WAIT, BRING, TWO, FOUR, ISLAND, DROPBOX, MILLION, ASK, NO, CTA = ls(6), w(6, 1), w(7, 2), w(7, 5), w(7, 11), w(8, 4), w(8, 11), ls(10), ls(11), ls(12)
m.voices()
m.music("m274.mp3", drop_in_song=79.226, drop_at=ISLAND, base=-17,
        env=[(0, PAST - 0.05, -12), (PAST - 0.05, ls(4), -60), (ls(4), ls(7), -21), (ls(7), ISLAND - 0.05, -16), (ISLAND - 0.05, ls(8) + 1, -4), (ls(8) + 1, D, -18)],
        stop_at=PAST - 0.5, stop_len=0.45)
m.room("tropical beach ambience, gentle waves, seagulls", -20)
pop = m.fx("cartoon pop", 0.4)
for at in (TWO, FOUR): m.put(pop, at, -9, dur=0.3)
for i in range(6): m.put(pop, ISLAND + i * 0.12, -12, dur=0.25)
CUES = [(0.1, "crowd cheering on a beach", 2.0, -12), (KOA1 - 0.1, "conch shell horn blast", 0.8, -9), (GET, "crab scuttling, comedic", 0.6, -12),
        (MOM - 0.2, "old lady happy hum, short", 0.5, -14), (TRIED, "slurping through a straw", 0.6, -10), (TRIED + 0.5, "magical sparkle, short", 0.4, -11),
        (RAN, "fast cartoon running footsteps", 0.6, -10), (WAIT, "lightbulb ding idea", 0.5, -7), (BRING, "cash register cha-ching", 0.5, -10),
        (ISLAND - 0.4, "magical power up riser, short", 0.4, -6), (ISLAND, "big cartoon title slam impact boom", 0.8, -6), (ISLAND + 0.2, "big crowd cheering and canoe paddles splashing", 2.0, -10),
        (ls(8), "soft whoosh", 0.4, -12), (MILLION, "rising slide whistle", 0.6, -10), (ASK, "hopeful puppy whimper, comedic", 0.5, -16),
        (NO + 0.4, "sad trombone short", 0.7, -13), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
