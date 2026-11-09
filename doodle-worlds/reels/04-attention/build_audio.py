"""World 4 mix: voices + Mixkit "Lo-Fi 02" (its drop at 22.76 s lands on "She turned them OFF") + city hum + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
ATT, COFFEE, RENT, DAY, THANK, ZERO = w(0, 8), w(1, 1), w(2, 1), w(2, 7), ls(3), w(3, 6)
BUZZ, PING, BELIEVE, TAX, NOBODY, OFF = w(4, 1), w(4, 3), w(4, 7), w(4, 11), w(5, 6), w(6, 3)
HOURS, READ, BUILT, OWN, CRIT, RICH, FUNNY, FIFTY, CTA = w(7, 3), w(7, 5), w(7, 7), w(7, 12), w(8, 2), ls(9), ls(10), w(10, 6), ls(11)
m.voices()
m.music("m764.mp3", drop_in_song=22.756, drop_at=OFF, base=-15,
        env=[(0, 0.5, -10), (ls(5) - 0.2, OFF - 0.05, -26), (OFF - 0.05, OFF + 2.5, -3), (ls(8) - 0.2, RICH, -20), (FUNNY - 0.2, CTA, -21), (CTA, D, -16)])
m.room("dystopian city at night, distant traffic hum, buzzing neon", -21, 0, OFF)
m.room("calm city morning, birds, gentle breeze", -22, OFF, D)
CUES = [(0.3, "cheesy futuristic advertisement jingle, short", 1.5, -16), (COFFEE - 0.3, "cash register cha-ching", 0.6, -12), (w(1, 3), "fast ticking countdown timer", 1.5, -12),
        (RENT - 0.2, "phone scrolling swipe sounds, rapid", 1.5, -12), (THANK - 0.3, "robotic happy chime, friendly announcement", 0.8, -8), (ZERO, "sad game over bloop", 0.6, -6),
        (TAX, "rubber stamp thunk on paper", 0.5, -2), (ls(5) - 0.1, "heartbeat thump, slow, tense", 1.5, -10), (OFF - 0.25, "phone power button click", 0.5, -2),
        (OFF, "big cartoon title slam impact boom", 0.8, -4), (OFF + 0.1, "papers falling and fluttering away", 1.0, -8), (OFF + 0.4, "warm magical sunrise shimmer", 1.5, -8),
        (READ - 0.2, "book pages flipping", 0.5, -8), (BUILT - 0.2, "small robot powering up beep boop", 0.6, -8), (OWN - 0.3, "shop bell ding with a cheerful pop", 0.6, -6),
        (ls(8) - 0.2, "digital glitch stutter, alarming", 1.2, -6), (CRIT, "electronic warning alarm, short", 0.6, -9), (FIFTY, "cash register cha-ching", 0.6, -6),
        (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
buzz, ping = m.fx("phone notification buzz vibration", 0.5), m.fx("phone notification ping", 0.5)
NT = [BUZZ, PING] + [BELIEVE - 0.6 + (TAX - 0.3 - BELIEVE + 0.6) * i / 9 for i in range(10)]
for i, a in enumerate(NT): m.put(ping if i % 2 else buzz, a, -9 - (i % 3), dur=0.4)
m.finish()
