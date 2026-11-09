"""Slasher short mix (TOON3D style 2, night street): narration + Mixkit m64 "Dark Shadows" (spooky-comic, A minor) as a
low bed that swells for the hook and the patrols, tape-stops dead on "There was no slasher", and comes back soft for
the ending; foggy night room tone; ElevenLabs SFX on every beat (mallet, buckle tings, shutters, bonks, chants,
jail clang, the last lamp sputtering out). Uses tools/audio/audiokit.py."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
# part 1: hook up, under the story, up for the patrols and the beating, tape stop on "There was no slasher"
m.music("m64.mp3", drop_in_song=49.667, drop_at=fr(806), base=-60,
        env=[(0, 4.0, -15), (4.0, fr(806) - 0.05, -25), (fr(806) - 0.05, fr(1089), -18), (fr(1089), fr(1168), -22),
             (fr(1168), fr(1395), -26), (fr(1395), fr(1546), -23)], stop_at=fr(1546), stop_len=0.45)
# part 2: back in, soft, for the charges and the ending
m.music("m64.mp3", drop_in_song=72.655, drop_at=fr(1739), base=-60, env=[(fr(1622), D, -22)])
m.room("quiet foggy night town street ambience, distant wind, faint dog bark far away", -23, 0, D)
march = m.fx("group of men marching on cobblestones at night, boots, rhythmic", 4.0)
for a, b, g in [(0, 4.2, -12), (fr(806), fr(846), -13)]:
    t = a
    while t < b - 0.1: m.put(march, t, g, dur=min(4.0, b - t), fade=0.2); t += 3.9
CUES = [(0.05, "angry mob shouting at night, men yelling, short", 3.0, -13), (fr(237), "nervous gulp, cartoon", 0.6, -10),
        (fr(322), "heavy wooden mallet whoosh then thud", 0.6, -6), (fr(328), "two women scream, short comedic", 1.2, -11),
        (fr(386), "low ominous string sting, horror", 1.4, -12), (fr(449), "tiny bright sparkle ting", 0.4, -9), (fr(457), "tiny bright sparkle ting", 0.4, -9),
        (fr(537), "quick blade slash whoosh", 0.5, -10), (fr(575), "woman gasp", 0.6, -12), (fr(611), "man yelps in surprise", 0.6, -12),
        (fr(709), "dramatic orchestral hit, short", 1.0, -6), (fr(741), "metal shop shutter rolling down and slamming", 1.0, -10),
        (fr(752), "wooden door slam then lock click", 0.8, -12), (fr(766), "fast nervous footsteps on cobblestones", 2.0, -14),
        (fr(876), "cartoon fight cloud, bonks and punches", 2.4, -10), (fr(888), "wooden stick bonk on a head", 0.4, -6),
        (fr(903), "wooden stick bonk on a head", 0.4, -6), (fr(933), "cartoon bonk with little birds tweeting", 1.2, -8),
        (fr(967), "quick running footsteps on cobblestones", 0.8, -12), (fr(1012), "crowd gasp then angry murmur", 1.0, -12),
        (fr(1056), "angry mob chanting rhythmically, men", 1.6, -10), (fr(1099), "old police whistle blow", 0.8, -11),
        (fr(1105), "two men walking slowly on cobblestones", 2.0, -15), (fr(1168), "foggy night wind gust", 2.0, -14),
        (fr(1333), "deep ominous rising whoosh", 1.6, -8), (fr(1440), "sheepish nervous chuckle, man", 0.9, -10),
        (fr(1480), "embarrassed hmm, woman", 0.6, -14), (fr(1519), "embarrassed small cough, woman", 0.6, -14),
        (fr(1557), "magic poof, cartoon", 0.6, -8), (fr(1601), "tiny sad sparkle fizzle out", 0.6, -13),
        (fr(1702), "heavy jail cell door slams shut, metal clang", 1.0, -5), (fr(1712), "relieved sigh, man", 0.8, -12),
        (fr(1741), "group of men groaning in pain, comedic", 1.6, -12), (fr(1836), "old street lamp flickering, electric buzz and pop", 0.8, -10),
        (fr(1854), "single cricket chirp at night", 0.8, -15)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
