"""AI explainer 2 mix (casino set): narration + Mixkit m647 "Fun Jazz", low under the explanation, its drop on the hot
streak, record-scratched when the chip tower collapses; casino murmur; ElevenLabs SFX (wheel spins, ticks, chips). audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m647.mp3", drop_in_song=70.798, drop_at=fr(1306), base=-60,
        env=[(0, fr(122), -18), (fr(122), fr(1306), -25), (fr(1306), fr(1330), -14)], stop_at=fr(1330), stop_len=0.3)
m.room("busy elegant casino interior, murmuring crowd, chips clicking", -25, 0, D)
spin = m.fx("prize wheel spinning fast with ticking clicks, slowing down", 2.0)
for at in [615, 738, 785, 813, 1097]: m.put(spin, fr(at), -9, dur=1.2 if at in (785, 813) else 2.0, fade=0.1)
CUES = [(fr(59), "cartoon pop", 0.3, -10), (fr(122), "roulette wheel spinning, ball rolling", 3.0, -9), (fr(306), "page flip", 0.4, -10),
        (fr(360), "cartoon pop", 0.3, -10), (fr(458), "soft chime", 0.4, -11), (fr(513), "soft chime", 0.4, -11), (fr(563), "tiny high chime", 0.4, -11),
        (fr(646), "correct answer ding", 0.5, -8), (fr(689), "paper card slapped on a board", 0.4, -9), (fr(785), "paper card slapped on a board", 0.3, -10),
        (fr(815), "paper card slapped on a board", 0.3, -10), (fr(853), "shuffling deck of cards", 1.0, -12), (fr(1003), "crowd ooh, impressed", 1.0, -11),
        (fr(1146), "slot machine ding", 0.5, -9), (fr(1306), "casino jackpot bells and coins", 1.0, -8), (fr(1328), "record scratch", 0.4, -6),
        (fr(1330), "pile of poker chips collapsing and scattering", 1.0, -6), (fr(1336), "crowd laughing", 1.0, -13)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
