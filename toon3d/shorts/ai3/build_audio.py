"""AI explainer 3 mix (night street + classroom): narration + Mixkit m64 "Dark Shadows" (sneaky) low under the lie and
the tour, its drop on the tour-guide analogy, tape-stopped when the confident robot hits the lamp post; night / room
tone; ElevenLabs SFX. audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m64.mp3", drop_in_song=49.667, drop_at=fr(645), base=-60,
        env=[(0, fr(116), -17), (fr(116), fr(645), -26), (fr(645), fr(868), -19), (fr(868), fr(1032), -26), (fr(1032), fr(1132), -20)], stop_at=fr(1132), stop_len=0.4)
for a, b, p in [(0, 278, "quiet night street ambience, distant wind"), (645, 868, "quiet night street ambience, distant wind"), (1032, 1168, "quiet night street ambience, distant wind"),
                (278, 645, "quiet classroom ambience, pencils, a clock ticking"), (868, 1032, "quiet classroom ambience, pencils, a clock ticking")]:
    m.room(p, -24, fr(a), fr(b))
CUES = [(fr(17), "cartoon pop", 0.3, -10), (fr(92), "innocent whistle, short", 0.8, -12), (fr(130), "book thud on a table", 0.4, -8),
        (fr(186), "cartoon pop", 0.3, -11), (fr(209), "cartoon pop", 0.3, -11), (fr(241), "cartoon pop", 0.3, -11), (fr(250), "man gasps", 0.6, -12),
        (fr(321), "rubber stamp thud", 0.3, -6), (fr(396), "correct answer ding", 0.5, -9), (fr(437), "wrong answer buzzer, short", 0.6, -10),
        (fr(470), "pencils scribbling fast on paper", 2.0, -12), (fr(617), "kids cheering short", 0.8, -11), (fr(660), "group footsteps on cobblestones", 2.4, -14),
        (fr(793), "tour guide bell ring", 0.5, -10), (fr(845), "crowd of tourists ooh", 0.8, -11), (fr(947), "magic sparkle reward chime", 0.8, -8),
        (fr(1133), "metal lamp post clang bonk", 0.5, -5), (fr(1140), "cartoon birds tweeting dizzy", 1.0, -12)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
