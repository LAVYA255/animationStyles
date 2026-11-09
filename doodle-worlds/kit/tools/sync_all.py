"""Install the shared kit (person/kit/engine/rig js, gsap, motion-kit, fonts) into every reel. Run once after cloning,
and again after you change anything in kit/assets/:  python doodle-worlds/kit/tools/sync_all.py"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); REELS = os.path.join(HERE, "..", "..", "reels")
for n in sorted(os.listdir(REELS)):
    if os.path.isdir(os.path.join(REELS, n)):
        subprocess.run([sys.executable, os.path.join(HERE, "new_reel.py"), n, "--sync"], check=True)
