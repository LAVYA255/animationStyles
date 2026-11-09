"""Start a new Weird Worlds reel: python new_reel.py NN-slug  ->  doodle-worlds/reels/NN-slug/ (kit assets + template).
Re-run with --sync to (re)install the shared kit files (person.js, kit.js, engine.js, rig.js, lib/, fonts/) in an existing reel
(run it once per reel after cloning: the repo keeps one copy of the kit, not twenty)."""
import os, shutil, sys
KIT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); ROOT = os.path.join(KIT, "..", "reels")
name = sys.argv[1]; dst = os.path.join(ROOT, name); sync = "--sync" in sys.argv
if not sync:
    if os.path.exists(dst): sys.exit(f"{dst} exists")
    shutil.copytree(os.path.join(KIT, "template"), dst)
    for d in ("out", "vo", os.path.join("assets", "audio")): os.makedirs(os.path.join(dst, d), exist_ok=True)
    for d in ("lib", "fonts"): shutil.copytree(os.path.join(KIT, "assets", d), os.path.join(dst, "assets", d))
    shutil.move(os.path.join(dst, "world.js"), os.path.join(dst, "assets", "world.js"))
for f in ("rig.js", "person.js", "kit.js", "engine.js"): shutil.copy(os.path.join(KIT, "assets", f), os.path.join(dst, "assets", f))
if sync:
    for d in ("lib", "fonts"): shutil.copytree(os.path.join(KIT, "assets", d), os.path.join(dst, "assets", d), dirs_exist_ok=True)
    for d in ("out", "vo", os.path.join("assets", "audio")): os.makedirs(os.path.join(dst, d), exist_ok=True)
print(os.path.abspath(dst))
