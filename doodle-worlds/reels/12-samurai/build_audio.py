"""World 12 mix: voices + Mixkit m680 (epic drums; its drop at 50.04 s lands on "38" times better) + dojo room tone + SFX."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); w, ls, le, D = m.w, m.ls, m.le, m.D
TEN, SUNSET, LIFT, CHOP = w(2, 3), w(3, 1), w(3, 4), w(3, 6)
PCT, DAY1, NOBODY, DAY30, KIND, BAD = ls(6), ls(7), w(7, 5), w(8, 1), w(8, 3), w(8, 5)
STACK, D365, DROP, HERO, BORING = w(9, 1), w(10, 1), w(10, 2), ls(11), w(11, 8)
TAG, D366, MORE, LESS, CTA = ls(12), w(12, 2), w(12, 5), ls(13), ls(14)
CUTUP = MORE + 0.9
m.voices()
m.music("m680.mp3", drop_in_song=50.039, drop_at=DROP, base=-17,
        env=[(0, ls(0), -12), (ls(2), ls(3), -15), (ls(3), DAY1, -24), (DAY1, STACK, -19), (STACK, DROP - 0.05, -15), (DROP - 0.05, HERO + 0.3, -3),
             (HERO + 0.3, TAG, -17), (TAG, MORE, -18), (MORE + 0.05, CTA, -60), (CTA, D, -18)],
        stop_at=MORE + 0.05, stop_len=0.4)
m.room("quiet wooden dojo, birds outside, soft wind through paper screens", -21)
whoosh = m.fx("fast wooden sword swing whoosh", 0.35)
# the 10,000 swings: whooshes speeding up
t, per = ls(2), 0.42
while t < ls(3) - 0.2:
    m.put(whoosh, t + per * 0.55, -12, dur=0.3); per = max(0.2, per * 0.93); t += per
for s in (w(7, 2), NOBODY + 0.3, KIND, D365 - 0.2, w(11, 2), w(11, 6), BORING + 0.3): m.put(whoosh, s - 0.12, -12, dur=0.3)
CUES = [(0.2, "soft taiko drum hit", 0.6, -10), (ls(1), "eager shout energy whoosh, cartoon", 0.4, -14), (TEN, "fast tally counter ticking", 1.4, -12),
        (SUNSET - 0.2, "evening crickets, short", 1.5, -16), (LIFT, "trembling arm shaking, comedic strain", 0.8, -12), (CHOP + 0.15, "small wooden chopsticks clatter on table", 0.5, -8),
        (w(4, 3), "single soft wooden block knock", 0.3, -12), (PCT, "gentle bright chime", 0.6, -10), (DAY1, "paper calendar page flip", 0.4, -9),
        (NOBODY, "old man snoring softly", 1.2, -16), (DAY30, "paper calendar page flip", 0.4, -9), (KIND + 0.05, "wooden stick spinning whoosh upward", 0.6, -10),
        (BAD, "cartoon bonk on the head, wooden", 0.5, -5), (BAD + 0.1, "cartoon birds tweeting dizzy", 0.8, -14), (STACK, "fast paper pages flipping", 2.5, -14),
        (DROP - 0.5, "katana unsheathe, sharp metallic", 0.45, -7), (DROP, "sword slicing through bamboo, clean slash", 0.6, -4), (DROP + 0.15, "big cinematic taiko boom impact", 1.0, -6),
        (DROP + 0.5, "bamboo pieces clattering on wooden floor", 0.9, -10), (w(11, 2), "soft pop", 0.3, -14), (TAG, "paper calendar page flip", 0.4, -9),
        (MORE - 0.08, "sword slicing air, clean slash", 0.5, -4), (CUTUP, "ceramic teacup cracking in half", 0.5, -5), (CUTUP + 0.2, "liquid tea pouring, short", 0.8, -12),
        (CTA, "cartoon pop", 0.5, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
