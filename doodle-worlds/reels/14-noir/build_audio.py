"""World 14 mix: voices + Mixkit m24 "Smooth Like Jazz" (its drop at 97.55 s lands on "the KILLER") + rainy-city room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
VAN, WALK, FILL, GONE = w(0, 2), w(1, 1), w(1, 4), w(1, 11)
SHOP, CART, ACCT, EMAIL, PASS, OUT = w(2, 5), w(2, 8), w(3, 1), w(3, 4), w(4, 2), w(5, 3)
KILLER, FIVE, LEAK, CUT, CLOSED, CREATE, CTA = w(6, 4), w(7, 9), w(8, 5), w(8, 8), w(10, 1), w(12, 1), ls(13)
POOF = OUT + 0.25
m.voices()
m.music("m24.mp3", drop_in_song=97.547, drop_at=KILLER, base=-17,
        env=[(0, ls(0), -14), (ls(2), PASS, -19), (PASS, KILLER - 0.05, -24), (KILLER - 0.05, ls(7), -4), (ls(7), CLOSED, -18), (CLOSED, ls(11), -12), (ls(11), D, -18)])
m.room("rain on a city street at night, distant traffic", -19, 0, ls(1))
m.room("rain on a shop window, indoor, quiet hum", -21, ls(1), ls(2))
m.room("quiet empty corridor, fluorescent hum", -22, ls(2), ls(9))
m.room("rain on a shop window, indoor, quiet hum", -22, ls(9), D)
poof = m.fx("magic poof disappear, soft", 0.6)
step = m.fx("single footstep on hard floor, heels", 0.3)
for at in (VAN + 0.2, w(0, 6) + 0.5, GONE, POOF): m.put(poof, at, -9)
t = ls(2)
while t < PASS:
    m.put(step, t, -18, dur=0.25); t += 0.45
CUES = [(0.1, "distant police siren, noir, soft", 2.0, -18), (FILL, "shopping cart rattle", 0.6, -12), (SHOP - 0.1, "soft bright ding", 0.4, -14), (CART - 0.1, "soft bright ding", 0.4, -14),
        (ACCT, "error buzz, short and soft", 0.4, -14), (EMAIL, "email notification ping", 0.4, -14), (PASS, "ominous low drone sting", 1.2, -10),
        (w(5, 0), "long tired sigh, woman", 0.9, -14), (KILLER - 0.4, "suspense string riser, short", 0.4, -8), (KILLER, "dramatic noir piano stab", 1.0, -5),
        (FIVE, "soft whoosh", 0.4, -12), (CUT, "scissors snip", 0.4, -6), (CLOSED, "cash register cha-ching", 0.6, -8), (CLOSED + 0.2, "small crowd chatter and shop bell", 1.5, -16),
        (CREATE - 0.2, "phone slide on table", 0.4, -10), (CREATE + 0.5, "nervous cartoon gulp", 0.4, -12), (CTA, "typewriter ding", 0.5, -10)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
