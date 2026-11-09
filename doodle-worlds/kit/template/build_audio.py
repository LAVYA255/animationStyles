"""This reel's mix: voices + a Mixkit bed (its drop on the showcase word) + room tone + one SFX per action. See tools/audio/audiokit.py."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "tools", "audio"))
from audiokit import Mix
m = Mix(HERE)
w, ls, le = m.w, m.ls, m.le
m.voices()
# m.music("m595.mp3", drop_in_song=45.65, drop_at=w(5, 2), env=[(0, ls(0), -9), (w(5, 2), ls(6), -1)])
# m.room("quiet ... room tone", -21)
# m.cue(t, "prompt", secs, gain_db)
m.finish()
