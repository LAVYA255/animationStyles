"""Dance short mix (TOON3D style 1): narration (as placed in voice/voice.wav) + the band's music, which only plays when the
band does: Mixkit m1063 "Fun at the Farm" (jaunty), quiet under the story, up when the band starts, a record scratch to
silence on "ban music", back for the last shot and tape-stopped on "turning off the music". + town room tone + SFX.
Uses tools/audio/audiokit.py (vo/timing.json written from voice/lines.json + words.json)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
STEP, NOMUSIC, CANT, WEEK, HUNDREDS, PLAN, DANCEOUT = fr(214), fr(294), fr(391), fr(491), fr(584), fr(682), fr(745)
STAGE, BAND, STRONG, MORE, SAD, FEAR, YAWN = fr(789), fr(818), fr(850), fr(946), fr(1013), fr(1123), [fr(x) for x in (1229, 1261, 1268, 1280, 1355)]
G30, G100, BAN, HITS, LEAVE, SHRINE, STOPS, END, OFF = fr(1415), fr(1460), fr(1554), [fr(1554), fr(1561), fr(1570)], fr(1598), fr(1634), fr(1703), fr(1736), fr(1864)
m.voices()
# the band's tune, part 1: hook loud, story quiet, silent on "No music.", up when the band plays, scratched out on "ban music"
m.music("m1063.mp3", drop_in_song=53.661, drop_at=BAND, base=-60,
        env=[(0, 4.35, -13), (4.35, NOMUSIC - 0.05, -24), (fr(345), BAND - 0.05, -23), (BAND - 0.05, fr(916), -14), (fr(916), SAD, -16),
             (SAD, fr(1199), -26), (fr(1199), fr(1381), -24), (fr(1381), BAN, -20)])
# part 2: the last shot, the band plays again until the music is turned off (tape stop)
m.music("m1063.mp3", drop_in_song=12.399, drop_at=END, base=-60, env=[(END, OFF + 0.05, -14)], stop_at=OFF - 0.05, stop_len=0.5)
m.room("medieval town square ambience, distant chatter, birds, cobblestones", -22, 0, SAD)
m.room("quiet evening town ambience, crickets, distant bells", -22, SAD, fr(1199))
m.room("park ambience, birds, light wind", -22, fr(1199), fr(1381))
m.room("medieval town square ambience, distant chatter, birds, cobblestones", -22, fr(1381), D)
stomp = m.fx("crowd of people stomping and dancing on cobblestones, rhythmic", 4.0)
for a, b, g in [(0, 4.35, -12), (WEEK, fr(546), -16), (HUNDREDS - 1, fr(611), -11), (BAND, fr(1013), -14), (G30, fr(1484), -13), (END, OFF, -14)]:
    t = a
    while t < b - 0.1: m.put(stomp, t, g, dur=min(4.0, b - t), fade=0.2); t += 3.9
CUES = [(0.05, "medieval fiddle flourish, lively, short", 1.5, -12), (STEP - 0.2, "old wooden door creaks open", 0.8, -10), (fr(257), "single shoe tap dance step on stone", 0.4, -10),
        (NOMUSIC - 0.1, "awkward silence cricket chirp", 0.8, -16), (CANT, "man sighs in despair, comedic", 0.7, -14), (HUNDREDS, "large crowd gasp then murmur", 1.2, -12),
        (fr(611), "group of old men murmuring, discussion", 1.5, -18), (PLAN, "lightbulb ding idea", 0.4, -10), (STAGE, "wooden planks hammered together quickly, construction montage", 1.0, -12),
        (BAND - 0.1, "drum roll short then cymbal", 0.8, -12), (STRONG, "two men clapping rhythmically", 1.5, -14), (MORE, "crowd cheer, medieval", 1.2, -15),
        (FEAR, "ominous low drone, short", 1.6, -16), (YAWN[0], "big long yawn, man", 1.1, -8), (YAWN[1], "yawn, woman", 0.9, -10), (YAWN[2], "yawn, old man", 0.9, -11),
        (YAWN[3], "yawn, woman, short", 0.8, -11), (YAWN[4], "tiny cute yawn, child", 0.9, -9), (G100, "huge crowd cheering", 1.2, -12),
        (BAN - 0.1, "record scratch", 0.4, -6), (HITS[0], "hammer hits a nail into wood", 0.3, -6), (HITS[1], "hammer hits a nail into wood", 0.3, -6), (HITS[2], "hammer hits a nail into wood", 0.3, -5),
        (LEAVE, "many footsteps walking on a wooden bridge, slow", 2.0, -14), (SHRINE, "distant church bells ringing, calm", 2.0, -12), (STOPS, "long relieved exhale, woman", 1.0, -12),
        (OFF - 0.05, "tape stop, music slows down and stops", 0.6, -8), (OFF + 0.6, "crowd relieved sigh, then silence", 1.2, -14)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
