---
name: weird-worlds-reel
description: Make a DOODLE "Weird Worlds" reel. That is a 30–55 s narrated + voiced 9:16 marker-cartoon story in one strange world that teaches one idea, built with HyperFrames in doodle-worlds/. Use for "Weird Worlds", "doodle reel", a new slate row, or a batch of story reels.
---

# Weird Worlds reel

Follow `SOP.md` §1 (rules), §3 (steps) and §4 (bulk). Rules specific to this format are in `doodle-worlds/WORLDS-SLATE.md`:
- frame 0 moves and shows the world + the problem;
- open a loop at once, and close it in the last 5 s;
- a re-hook every 5–8 s;
- ≤ 6 things per scene;
- one flash (the showcase);
- short captions that hold ≥ 1 s;
- a button + tag that loops to the opening;
- a comment-keyword CTA naming a free asset.

1. `python doodle-worlds/kit/tools/new_reel.py NN-slug`. After cloning the repo, run `python doodle-worlds/kit/tools/sync_all.py` once.
2. `story.json`: narrator `mira_narrator`; characters use their own `w_*` voices from `tools/voice/cast.json`, and each voice must match the drawn age and gender. `gap` is the silence before a line.
3. Voice:
   ```bash
   python tools/voice/vo.py <reel>
   python doodle-worlds/kit/tools/timing.py <reel>
   ```
4. `assets/world.js` holds the cast, set and props, built on `Person`, `kit.js` and `rig.js`. Check them in `asset_sheet.html`.
5. `scene.js`: `WK.film({captions, cam, render(t, …)})`, beats keyed to `w(line, word)` / `ls(line)` / `le(line)`.
6. Check before rendering:
   ```bash
   python doodle-worlds/kit/tools/qa.py <reel> check
   python doodle-worlds/kit/tools/qa.py <reel> beats "t1,t2,..."
   ```
   Look at `out/beats.png`.
7. Mix: `python <reel>/build_audio.py`, with the music drop on the showcase word.
8. Render and deliver: `python doodle-worlds/kit/tools/qa.py <reel> final`. It renders, muxes, checks loudness and caption holds, and copies the reel to `_delivery/`.
