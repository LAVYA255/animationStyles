"""AI explainer 4 mix (suite): narration + Mixkit m595 "Secret Garden" (playful) low under the explanation, its drop on
the fresh-chat fix, tape-stopped as the paper pile swallows the robot; room tone; ElevenLabs SFX. audiokit."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE); D = m.D
fr = lambda f: f / 30
m.voices()
m.music("m595.mp3", drop_in_song=45.65, drop_at=fr(941), base=-60,
        env=[(0, fr(152), -17), (fr(152), fr(941), -26), (fr(941), fr(1086), -17), (fr(1086), fr(1160), -22)], stop_at=fr(1160), stop_len=0.4)
m.room("quiet elegant hotel room, distant city", -24, 0, fr(629))
m.room("busy restaurant chatter, cutlery", -22, fr(629), fr(829))
m.room("quiet elegant hotel room, distant city", -24, fr(829), D)
CUES = [(fr(50), "cartoon dizzy boing", 0.7, -10), (fr(170), "paper scroll unrolling long", 1.6, -11), (fr(299), "pages flipping very fast", 1.0, -10),
        (fr(436), "cartoon pop", 0.3, -9), (fr(540), "muffled underwater wobble, short", 0.8, -12), (fr(590), "papers falling on a pile", 1.0, -10),
        (fr(652), "restaurant bell ding", 0.5, -12), (fr(797), "plate set down on a table", 0.5, -8), (fr(800), "man shouting angry, short comedic", 0.8, -11),
        (fr(912), "pencil scribbling short", 0.6, -12), (fr(941), "magic poof", 0.6, -7), (fr(965), "paper slapped on a desk", 0.4, -9),
        (fr(1042), "correct answer ding ding", 0.7, -8), (fr(1108), "avalanche of paper sheets", 1.6, -9), (fr(1135), "muffled cry for help, comedic", 0.8, -12)]
for at, p, s, g in CUES: m.cue(at, p, s, g)
m.finish()
