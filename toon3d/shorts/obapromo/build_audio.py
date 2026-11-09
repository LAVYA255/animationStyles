"""Open Bot Avatar promo mix (no VO): Mixkit m729 "Pop Track 03" (107.7 BPM) with its drop (5.039 s) on frame 45 where the
cat pops out of the faceless dot; a dip before the dot gets its face at the end; ElevenLabs SFX on every beat event. audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
B = lambda k: round(45 + 16.72 * k)
m.music("m729.mp3", drop_in_song=5.039, drop_at=fr(45), base=0, level_db=-21,
        env=[(0, fr(45), -6), (fr(B(53)), fr(B(55)), -9)], stop_at=fr(1000), stop_len=0.3)
POP_HI, POP_LO = "cartoon bubble pop, high pitched, bright", "cartoon pop, low and round"
CUES = [(fr(2), "soft digital interface blip", 0.5, -14), (fr(16), "soft quick whoosh", 0.5, -15), (fr(27), "short rising tension swell", 0.6, -11),
        (fr(45), "cartoon pop with sparkle shimmer", 0.7, -5), (fr(B(1)), "quick text whoosh swipe", 0.5, -13)]
CUES += [(fr(B(k)), POP_HI if k % 2 else POP_LO, 0.5, -8) for k in range(2, 8)]
CUES += [(fr(B(8)), "rapid cascade of tiny cartoon pops", 1.0, -8)]
CUES += [(fr(B(k)), "soft air swish", 0.5, -17) for k in (10, 11, 12, 13)]
CUES += [(fr(B(14)), "mouse click", 0.5, -6), (fr(B(14) + 3), "magical chime sparkle", 0.8, -8), (fr(B(14) + 8), "many small cartoon boings", 0.8, -13),
         (fr(B(20)), "quick whoosh", 0.5, -10), (fr(B(21)), "message sent swoosh", 0.5, -8), (fr(B(22)), "soft bubbly typing blips", 1.0, -15),
         (fr(B(26)), "message received ding", 0.5, -7), (fr(B(26) + 1), "confetti party popper", 0.6, -9), (fr(B(28)), "message sent swoosh", 0.5, -10),
         (fr(B(28) + 2), "sparkle twinkle", 0.6, -12),
         (fr(B(32)), "quick whoosh", 0.5, -10), (fr(B(32) + 6), "fast keyboard typing", 0.9, -12), (fr(B(34)), "send swoosh", 0.5, -9),
         (fr(B(34) + 3), "computer data chirps streaming", 1.3, -16), (fr(B(37)), "fast marker drawing squeak", 0.6, -11), (fr(B(38)), "cartoon pop with sparkle shimmer", 0.7, -6)]
CUES += [(fr(B(k)), "paint splat pop" if k % 2 else POP_HI, 0.5, -10) for k in range(39, 44)]
CUES += [(fr(B(44)), "quick whoosh", 0.5, -10), (fr(B(44) + 6), "keyboard typing short", 0.7, -12), (fr(B(44) + 30), "terminal success beep", 0.5, -13)]
CUES += [(fr(B(k)), POP_LO if k % 2 else POP_HI, 0.5, -7) for k in (46, 47, 48)]
CUES += [(fr(B(50)), "whoosh into deep impact", 0.8, -8), (fr(B(50) + 6), "rapid cascade of tiny cartoon pops", 1.0, -12),
         (fr(B(53)), "small ball rolling on floor", 0.6, -12), (fr(B(55)), "magic poof sparkle", 0.6, -6), (fr(B(55) + 4), "tiny cartoon creatures cheering yay", 1.0, -10)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
