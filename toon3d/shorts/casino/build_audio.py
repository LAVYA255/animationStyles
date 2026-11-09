"""Casino short mix (TOON3D style 3, casino interior): narration + Mixkit m647 "Fun Jazz": its first drop on the hook,
quiet under Yorkshire, then the casino section with its second drop on "two million francs"; mill clatter, casino murmur
and street room tone per place; ElevenLabs SFX on every beat (sad trombone, idea ding, wheel spin, chip wins, cloth,
squeaky cart, hammer, SOLD stamps + cha-ching). Uses tools/audio/audiokit.py."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m647.mp3", drop_in_song=15.929, drop_at=0.6, base=-60, env=[(0, fr(124), -14), (fr(124), fr(639), -27)])
m.music("m647.mp3", drop_in_song=70.798, drop_at=fr(1489), base=-60,
        env=[(fr(639), fr(938), -22), (fr(938), fr(1251), -19), (fr(1251), fr(1449), -28), (fr(1449), fr(1525), -13),
             (fr(1525), fr(1673), -20), (fr(1673), fr(1860), -19), (fr(1860), D, -15)])
for a, b, p in [(0, 124, "busy elegant casino interior, murmuring crowd, chips clicking"), (639, 1251, "busy elegant casino interior, murmuring crowd, chips clicking"),
                (1449, 1673, "busy elegant casino interior, murmuring crowd, chips clicking"), (124, 253, "old textile mill machinery clattering, looms"),
                (361, 511, "old textile mill machinery clattering, looms"), (253, 361, "quiet evening street, distant birds"), (511, 639, "quiet evening street, distant birds"),
                (1251, 1449, "town street daytime ambience, birds, distant chatter"), (1673, 1771, "wooden bridge over a river, water, birds"),
                (1771, 1908, "town street daytime ambience, birds, distant chatter")]:
    m.room(p, -24, fr(a), fr(b))
cart = m.fx("shopping cart rolling on cobblestones with one squeaky wobbly wheel", 4.0)
t = fr(1251)
while t < fr(1449) - 0.1: m.put(cart, t, -11, dur=min(4.0, fr(1449) - t), fade=0.2); t += 3.9
CUES = [(0.05, "crowd cheering in a casino, coins pouring", 2.0, -10), (fr(271), "sad trombone wah wah wah", 1.4, -11),
        (fr(317), "cartoon pop", 0.3, -10), (fr(320), "cartoon pop", 0.3, -10), (fr(323), "cartoon pop", 0.3, -10), (fr(326), "cartoon pop", 0.3, -10),
        (fr(472), "lightbulb idea ding", 0.5, -8), (fr(558), "cartoon pop", 0.3, -11), (fr(576), "cartoon pop", 0.3, -11),
        (fr(606), "fast whoosh transition", 0.8, -10), (fr(752), "pencil scribbling on paper", 1.6, -12),
        (fr(805), "roulette wheel spinning, ball rolling and clicking", 3.0, -8), (fr(826), "slow comedic wobble boing", 0.9, -12),
        (fr(1003), "casino win, chips and coins jingle", 0.8, -8), (fr(1031), "casino win, chips and coins jingle", 0.8, -8),
        (fr(1061), "casino win, chips and coins jingle", 0.8, -7), (fr(1066), "crowd ooh, impressed", 1.0, -12),
        (fr(1158), "empty cash drawer slides open, single coin rattles", 0.9, -9), (fr(1186), "heavy cloth whoosh thrown over a table", 0.6, -8),
        (fr(1205), "hurried footsteps with a jingling bag of coins", 1.2, -12), (fr(1338), "squeaky wheel wobble, rattling", 0.8, -10),
        (fr(1405), "cart crashes into a wall, metal clatter, comedic", 1.0, -11), (fr(1489), "crowd gasp then cheer, coins cascading", 1.6, -7),
        (fr(1536), "old alarm bell ringing", 1.0, -13), (fr(1577), "hammer hitting metal", 0.3, -6), (fr(1586), "hammer hitting metal", 0.3, -6),
        (fr(1599), "hammer hitting metal", 0.3, -5), (fr(1675), "man whistling a happy tune", 2.0, -14),
        (fr(1863), "rubber stamp thud", 0.3, -8), (fr(1866), "rubber stamp thud", 0.3, -8), (fr(1869), "rubber stamp thud", 0.3, -8),
        (fr(1872), "rubber stamp thud", 0.3, -8), (fr(1875), "rubber stamp thud", 0.3, -8), (fr(1878), "rubber stamp thud", 0.3, -8),
        (fr(1871), "old cash register cha-ching", 1.0, -6), (fr(1884), "children laughing", 1.2, -15)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
