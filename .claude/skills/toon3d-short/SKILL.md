---
name: toon3d-short
description: Make a TOON3D short. That is a narrated, caption-free 9:16 cartoon: flat 2D bean-head characters on cards inside a painted three.js town, push-in cameras, ink outline + DOF + bloom, rendered with Remotion in toon3d/. Use for "TOON3D", "3D town cartoon short", "AI explainer like ai1", a history story short, or a product showcase in that style; also for the no-VO launch promo (obapromo).
---

# TOON3D short

Follow `SOP.md` §1 (rules) and §2 (steps) exactly. Summary:

1. **Script** (`toon3d/shorts/<name>/SCRIPT.md` with facts + sources, and `story.json`):
   - one line per sentence, voice `w_jett`, `eleven_multilingual_v2`, settings `{"speed": 1.1, "similarity_boost": 0.8}`.
   - Formula: paradox hook, setting, escalation, a "You see," analogy, ironic payoff, then a comedic button.
2. **Voice:**
   ```bash
   python tools/voice/vo.py toon3d/shorts/<name>
   cd toon3d
   python scripts/assemble_voice.py shorts/<name> 0.1 0.14 "i:sec,..."
   python scripts/write_timing.py shorts/<name>
   ```
   - Read word frames from `voice/words.json` (frame = round(s × 30)).
   - Never slow or time-stretch the voice.
3. **Engine:**
   - Copy the closest `toon3d/src/videos/<prev>/` (sets are listed in SOP §2 step 3) and register it in `src/Root.tsx`.
   - Edit `story.ts` (TOTAL, SHOTS, BT word frames, one camera per shot with pushK, KICKS, DOF).
   - Edit `cast.ts` (`stage()` case per shot).
   - New props go in `toon.ts`, new sets and lights in `world.ts`.
4. **Stills sheet before rendering:**
   - Run `COMP=<Comp> node scripts/bridge-stills.mjs out/<name>/s_ <one frame per shot> 0.4`, tile the stills and look.
   - Nothing may be cut by the 9:16 edge: half-width = 0.5625·tan(fov/2)·d.
5. **Render** (in the background):
   ```bash
   npx remotion render src/index.ts <Comp> out/<name>/video.mp4 --codec h264 --crf 16 --scale 1.3333 --gl=angle --concurrency 4
   ```
6. **Mix:** `shorts/<name>/build_audio.py` using `tools/audio/audiokit.py` `Mix`:
   - the music drop on the showcase frame;
   - SFX on beat frames;
   - room tone;
   - master at −14 LUFS.
7. **Deliver:** mux with `-map 0:v:0 -map 1:a:0`, then `python scripts/short_qa.py final.mp4 qa_dir shots.json`. Deliver only if:
   - there are no black or frozen frames;
   - loudness is −15…−13 LUFS;
   - the only pops are planned ones.

**Never:** captions or a title card in TOON3D; remaking the upstream bridge short; slowed narration or slow-mo; another format's look.
