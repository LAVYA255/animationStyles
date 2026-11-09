"""Tower short mix (TOON3D style 4, flat-colour interior): narration + Mixkit m595 "Secret Garden" (sneaky, playful) as
the caper bed, its first drop landing as Lustig grabs the cash and runs; tape-stopped as the prison door slams; hotel
room tone, street and cell ambience; ElevenLabs SFX on every beat. Uses tools/audio/audiokit.py."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m595.mp3", drop_in_song=45.65, drop_at=fr(1300), base=-60,
        env=[(0, fr(148), -15), (fr(148), fr(1300), -25), (fr(1300), fr(1368), -16), (fr(1368), fr(1692), -27),
             (fr(1692), fr(1855), -22), (fr(1855), fr(1922), -17)], stop_at=fr(1922), stop_len=0.5)
for a, b, p in [(0, 148, "quiet elegant hotel room, distant city"), (290, 1692, "quiet elegant hotel room, distant city"), (1743, 1924, "quiet elegant hotel room, distant city"),
                (148, 290, "paris street daytime ambience, distant horse carriage, chatter"), (1692, 1743, "paris street daytime ambience, distant horse carriage, chatter"),
                (1924, 2107, "prison cell ambience, echo, distant footsteps and keys")]:
    m.room(p, -24, fr(a), fr(b))
CUES = [(0.05, "small group of men applauding briefly", 1.5, -13), (fr(20), "heavy bag of coins dropped on a table", 0.6, -9),
        (fr(150), "newspaper rustle", 0.8, -9), (fr(211), "old metal creaking and groaning, rust", 1.0, -12),
        (fr(300), "rubber stamp thud on paper", 0.3, -8), (fr(318), "rubber stamp thud on paper", 0.3, -8), (fr(336), "rubber stamp thud on paper", 0.3, -8),
        (fr(377), "magic sparkle transformation", 0.6, -8), (fr(441), "several men walking on a wooden floor", 2.0, -13), (fr(526), "door closing softly", 0.6, -12),
        (fr(586), "whispered shh", 0.8, -10), (fr(633), "group of men gasp", 0.8, -10), (fr(665), "quiet shh", 0.6, -11),
        (fr(794), "nervous gulp, cartoon", 0.5, -10), (fr(851), "cartoon inflate puff", 0.6, -9), (fr(931), "short suspense sting", 0.8, -10),
        (fr(1011), "single coin drops on a table and spins", 0.6, -8), (fr(1097), "relieved sigh, man", 0.8, -11), (fr(1187), "hearty laugh, man", 1.0, -12),
        (fr(1225), "bag of coins dropped on a table", 0.6, -8), (fr(1298), "cartoon zip whoosh, running away fast", 0.7, -7), (fr(1330), "door slam", 0.5, -10),
        (fr(1370), "magic shimmer", 1.0, -12), (fr(1400), "cups sliding on a table cloth", 2.0, -14), (fr(1538), "lightbulb idea ding", 0.5, -8),
        (fr(1623), "awkward cricket chirp", 0.8, -14), (fr(1656), "old telephone receiver lifted then put back down", 0.8, -11),
        (fr(1706), "footsteps on cobblestones, man whistling", 1.4, -13), (fr(1853), "police whistle blow", 0.8, -8),
        (fr(1872), "cartoon zip whoosh, running away fast", 0.7, -7), (fr(1880), "running footsteps on a wooden floor", 1.0, -12),
        (fr(1924), "heavy prison cell door slams, echo", 1.2, -6), (fr(1989), "dramatic orchestral hit", 1.0, -7),
        (fr(2031), "comedic slide whistle up", 0.8, -10), (fr(2083), "unimpressed hmph, man", 0.6, -10)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
