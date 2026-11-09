"""Open Bot Avatar TOON3D short mix: Jett narration + Mixkit m729 "Pop Track 03" (same bed as the promo) low under the
voice, its drop on the poof where the robots get faces, tape-stopped before the reply-all button so the gag lands dry;
town room tone; ElevenLabs SFX on every pop, poof and envelope. audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m729.mp3", drop_in_song=5.039, drop_at=fr(213), base=-60,
        env=[(0, fr(186), -25), (fr(186), fr(250), -15), (fr(250), fr(760), -25), (fr(760), fr(800), -18), (fr(800), fr(1046), -24)],
        stop_at=fr(1046), stop_len=0.45)
m.room("quiet small town street, birds, distant chatter", -26, 0, fr(896))
m.room("calm evening town street, distant birds", -27, fr(896), D)
POOF = ["magic poof", "cartoon pop with sparkle shimmer"]
CUES = [(fr(69), "confused cartoon boing", 0.6, -12), (fr(98), "speech bubble pop", 0.5, -11), (fr(129), "small robot footsteps clanking", 0.9, -15),
        (fr(156), "speech bubble pop", 0.5, -10), (fr(160), "record scratch", 0.6, -11)]
CUES += [(fr(207 + 5 * k), POOF[k % 2], 0.6, -8) for k in range(4)]
CUES += [(fr(278), "whoosh with sparkle", 0.7, -9), (fr(353), "card flip whoosh", 0.5, -10), (fr(400), "marker drawing squeak", 0.6, -12),
         (fr(437), "cartoon pop", 0.5, -9), (fr(442), "cute boing", 0.5, -12), (fr(519), "soft swoosh", 0.6, -13), (fr(547), "tiny cartoon blink click", 0.5, -9),
         (fr(566), "kid running footsteps on cobblestone", 1.2, -13), (fr(623), "speech bubble pop", 0.5, -11), (fr(654), "computer thinking bubbly beeps", 1.2, -15),
         (fr(717), "magical success chime", 0.8, -8), (fr(743), "correct answer ding ding", 0.7, -8), (fr(759), "rapid cascade of tiny cartoon pops", 1.3, -8),
         (fr(813), "speech bubble pop", 0.5, -11), (fr(864), "magic poof", 0.6, -7), (fr(866), "cartoon pop with sparkle shimmer", 0.7, -9),
         (fr(899), "cartoon pop", 0.5, -9), (fr(906), "cartoon pop", 0.5, -9), (fr(932), "cartoon pop", 0.5, -9), (fr(965), "quick whoosh", 0.5, -10),
         (fr(1066), "paper envelope swoosh", 0.5, -11), (fr(1080), "paper envelope swoosh", 0.5, -12), (fr(1092), "paper envelope swoosh", 0.5, -12),
         (fr(1102), "huge flurry of paper envelopes fluttering", 2.0, -7), (fr(1104), "comedic cymbal crash", 0.8, -10)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
