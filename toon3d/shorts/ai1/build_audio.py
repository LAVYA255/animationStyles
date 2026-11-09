"""AI explainer 1 mix: narration + Mixkit m780 "Okay" (playful) low under the explanation, up when the model finally
counts right, tape-stopped as the strawberry hits; street / room tone; ElevenLabs SFX. audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m780.mp3", drop_in_song=30.047, drop_at=fr(1125), base=-60,
        env=[(0, fr(131), -16), (fr(131), fr(1125), -25), (fr(1125), fr(1236), -16)], stop_at=fr(1236), stop_len=0.4)
m.room("sunny town street ambience, birds, distant chatter", -24, 0, fr(653))
m.room("quiet cafe interior, cutlery clinks", -24, fr(653), fr(903))
m.room("sunny town street ambience, birds, distant chatter", -24, fr(903), D)
CUES = [(fr(108), "cartoon pop", 0.3, -9), (fr(112), "game show wrong answer buzzer, short", 0.6, -12), (fr(150), "magic sparkle", 0.6, -12),
        (fr(178), "record scratch", 0.4, -10), (fr(260), "robot beep boop, confused", 0.8, -11), (fr(353), "butcher cleaver chop on wood", 0.4, -6),
        (fr(368), "butcher cleaver chop on wood", 0.4, -6), (fr(476), "cartoon pop", 0.3, -9), (fr(499), "cartoon pop", 0.3, -9), (fr(528), "cartoon pop", 0.3, -9),
        (fr(608), "mechanical counter flipping numbers", 1.0, -10), (fr(653), "restaurant bell ding", 0.5, -12), (fr(809), "plate set down on a table", 0.5, -9),
        (fr(863), "robot hmm processing, short", 0.8, -11), (fr(975), "slot machine reels spinning, short", 1.2, -13), (fr(1088), "typewriter keys typing letters", 1.4, -11),
        (fr(1125), "correct answer ding ding", 0.8, -8), (fr(1230), "cartoon whoosh, object thrown", 0.5, -9), (fr(1236), "squishy fruit splat bonk", 0.6, -5),
        (fr(1242), "robot powering down, comedic", 1.0, -11)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
