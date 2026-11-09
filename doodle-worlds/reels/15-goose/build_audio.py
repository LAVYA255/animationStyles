"""World 15 mix: voices + Mixkit m2 "Comical" (its drop at 42.03 s lands on the rested GOLDEN egg) + barn room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
EGG0, HAPPY, SCALE, NIGHT, WEEKEND, POSTERS = w(0, 4), w(0, 12), w(1, 3), w(2, 3), w(2, 5), w(2, 7)
GRIND, W1, W2, W3, BRONZE, DAMN, SLEEP = w(3, 2), w(5, 2), w(5, 6), ls(6), w(6, 5), w(7, 5), w(8, 8)
GOLDEN, YEARS, REST, POD, YOU, CTA = w(9, 3), w(9, 7), w(10, 5), w(11, 6), w(12, 3), ls(13)
m.voices()
m.music("m2.mp3", drop_in_song=42.028, drop_at=GOLDEN, base=-17,
        env=[(0, ls(0), -13), (ls(4), ls(5), -20), (W3, ls(8), -22), (ls(8), GOLDEN - 0.05, -24), (GOLDEN - 0.05, ls(10), -4), (ls(10), D, -18)],
        stop_at=SLEEP - 0.5, stop_len=0.5)
m.room("barn ambience, hens clucking softly, distant rooster", -21, 0, NIGHT)
m.room("night barn ambience, crickets", -22, NIGHT, ls(9))
m.room("barn ambience, hens clucking softly, distant rooster", -21, ls(9), D)
pop = m.fx("cartoon pop", 0.4)
for i in range(3): m.put(pop, POSTERS - 0.2 + i * 0.27, -11, dur=0.3)
CUES = [(EGG0 - 0.05, "magical sparkle chime, golden", 0.6, -9), (HAPPY, "disappointed hmm, man", 0.5, -14), (SCALE, "air horn, short and funny", 0.5, -12),
        (NIGHT, "clock ticking fast", 1.2, -14), (WEEKEND, "rubber stamp thud", 0.3, -9), (GRIND, "whistle blow, coach", 0.4, -12),
        (W1, "soft egg plop", 0.3, -10), (W1 + 0.15, "soft egg plop", 0.3, -10), (W2, "soft egg plop", 0.3, -12),
        (BRONZE, "sad trombone wah wah", 1.2, -9), (DAMN, "angry goose honk, short", 0.5, -10), (SLEEP - 0.3, "light switch click", 0.3, -8),
        (SLEEP, "soft lullaby music box, short", 1.5, -16), (ls(9), "rooster crow, morning", 1.0, -14), (GOLDEN - 0.4, "magical power up riser, short", 0.4, -6),
        (GOLDEN, "big cartoon title slam impact boom", 0.8, -7), (GOLDEN + 0.1, "magical sparkle chime, golden", 0.6, -8), (YEARS, "fast calendar pages flipping", 1.2, -14),
        (REST, "bright checkmark ding, game reward", 0.5, -10), (POD, "podcast intro sting, cheesy", 0.8, -14), (YOU, "angry goose hiss and honk", 0.6, -4),
        (YOU + 0.1, "cartoon bite chomp", 0.3, -6), (YOU + 0.2, "man yelp, comedic", 0.4, -10), (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
