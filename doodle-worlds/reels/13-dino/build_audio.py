"""World 13 mix: voices + two beds: Mixkit m5 "Feeling Happy" (ukulele) for the old world, tape-stopped by the meteor, then
Mixkit m686 (epic drums; its drop at 79.9 s lands on "...was MO") + valley/ash room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
TINY, BIGGEST, CUST, MAMMAL, NIGHT, BUGS = w(0, 4), w(0, 6), w(1, 12), w(3, 3), w(3, 6), w(3, 9)
LAUGH, CARE, SO, EVERY, MORE7 = ls(5), w(6, 6), w(6, 7), ls(7), w(7, 7)
CHANGED, GONE, STARVE, MO, DISRUPT, START = w(8, 3), w(9, 2), w(9, 5), w(10, 12), w(11, 1), w(11, 2)
TAG, PREM, CTA = ls(12), w(13, 2), ls(14)
m.voices()
m.music("m5.mp3", drop_in_song=20.0, drop_at=0.0, base=-60,
        env=[(0, ls(0), -12), (ls(0), ls(8), -17), (ls(3), ls(7), -20)], stop_at=CHANGED - 0.5, stop_len=0.5)
m.music("m686.mp3", drop_in_song=79.9, drop_at=MO, base=-60,
        env=[(ls(10), MO - 0.05, -20), (MO - 0.05, DISRUPT, -3), (DISRUPT, D, -17)])
m.room("prehistoric jungle ambience, distant birds and insects", -21, 0, CHANGED)
m.room("low wind over ash, distant rumble", -20, CHANGED, D)
pop = m.fx("cartoon pop", 0.5)
CUES = [(0.2, "deep dinosaur growl, short and smug", 0.8, -12), (TINY, "tiny cute squeak", 0.3, -8), (BIGGEST, "ominous low brass sting, short", 0.8, -12),
        (CUST - 0.6, "big heavy footsteps, giant dinosaur", 1.0, -10), (CUST + 0.2, "loud crunchy leaf chewing", 1.2, -12),
        (w(3, 4), "evening crickets chirping", 1.5, -14), (NIGHT, "small wooden crate set down, pop", 0.4, -8), (BUGS, "beetle buzzing, tiny", 0.6, -14),
        (LAUGH + 0.4, "deep booming laugh echo", 1.2, -14), (CARE + 0.3, "giant snore, comedic", 1.5, -14), (SO, "soft pop", 0.3, -12),
        (EVERY, "fast cash register dings, cartoon", 2.0, -14), (MORE7, "cartoon pop", 0.4, -10),
        (ls(8), "falling meteor whistle, rising", 0.9, -6), (CHANGED, "huge explosion impact boom, rumbling", 2.5, -3), (GONE, "sad trombone wah", 1.0, -12),
        (STARVE, "stomach growl, loud", 0.8, -9), (MO - 0.4, "magical power up riser, short", 0.4, -6), (MO, "big cartoon title slam impact boom", 0.8, -6),
        (MO + 0.1, "small crowd of tiny creatures cheering", 1.2, -12), (START, "bright checkmark ding, game reward", 0.5, -10),
        (TAG, "deep whisper psst", 0.4, -16), (PREM, "cash register cha-ching", 0.6, -6), (PREM + 0.7, "cartoon gulp", 0.4, -10), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
