# SOP: how these videos are made (and how to make them in bulk)

This is the exact process behind every video in [STYLES.md](STYLES.md). Two formats live in this repo:

| Format | Folder | What it is | Engine |
|---|---|---|---|
| **TOON3D** | `toon3d/` | Narrated 9:16 cartoon. Flat 2D bean-head characters stand as cards inside a painted three.js town, with gliding cameras, ink outlines, depth of field and no captions. 35–70 s. | Remotion 4 + three.js |
| **DOODLE / Weird Worlds** | `doodle-worlds/` | Narrated + voiced 9:16 marker-cartoon story reels. One strange "world" per reel teaches one idea, with short captions. 30–55 s. | HyperFrames (HTML + GSAP, seek-safe) |

There is also one **launch promo** recipe (`toon3d/src/videos/obapromo`): a beat-cut motion-graphics product promo with no
voice, built in the same Remotion project.

Everything is driven by small JSON/TS files. You (or Claude Code) write the story, the voice gets generated and checked
by Whisper, the picture is timed to the exact frame of each spoken word, the sound is mixed by script, and an automatic
QA pass checks every frame before delivery.

---

## 0. One-time setup (≈30 min)

Install:
- **Node 20+** and npm.
- **Python 3.11** (3.10–3.12 work).
- **ffmpeg + ffprobe** on PATH.
- **Google Chrome** (optional: Remotion downloads its own headless Chrome if `CHROME_PATH` isn't set).

```bash
git clone https://github.com/LAVYA255/animationStyles && cd animationStyles
pip install -r requirements.txt
playwright install chromium
cd toon3d && npm ci && cd ..
python doodle-worlds/kit/tools/sync_all.py
python tools/music/fetch.py
cp .env.example .env
```

- `sync_all.py` installs the shared kit into all 20 reels.
- `tools/music/fetch.py` downloads the 23 Mixkit beds the samples use. They're free, but the licence doesn't allow re-sharing them, so they aren't in git.
- After copying `.env.example` to `.env`, put your ElevenLabs key in it. It's only needed for NEW voices and SFX.

**ElevenLabs:**
- You need a plan with API access.
- Voices are referenced by library voice ID in `tools/voice/cast.json`. The narrator for every TOON3D video is `w_jett`.
- If the API answers "voice not found", open that voice in the ElevenLabs Voice Library once (search its ID) and add it to your voices.
- Never put the key in a file that gets committed. `.env` is git-ignored.

**Check the install works** (no key needed). Render one still of an existing video:
```bash
cd toon3d
COMP=Ai1Short node scripts/bridge-stills.mjs out/test_ 300 0.5
```
That writes `out/test_300.jpg`. Open it and you should see the robot in the sunny town. For DOODLE:
```bash
python doodle-worlds/kit/tools/qa.py doodle-worlds/reels/01-insurance beats "2,10,20"
```
That makes a contact sheet at `out/beats.png`.

> Windows: set the temp folder to a drive with space before Remotion runs, since each bundle copies `public/`.
> `set REMOTION_TMP=D:\remotion-tmp` (the stills script uses it); for `npx remotion render` set `TEMP`/`TMP` the same way.

---

## 1. The rules that make them good (read once, apply always)

These came from real feedback on the first versions. Breaking any of them is what made early drafts get rejected.

**Story**
- Our own stories only: a strange true fact (with sources), or an original world. Never remake someone else's video. The upstream repo's "bridge" short is reference only.
- **Hook in the first second**, a paradox or a question, with something already moving on frame 0.
- **Payoff:** the hook must pay off. Close the loop in the last 5 s.
- **Ending:** end on a comedic **button** (a one-line tag after the payoff), never an abrupt cut.
- **Lead-ins:** no repeated lead-in words ("You. Do this. You. Do that."). Every beat lands as a hit, not a list.
- **Language:** swearing is fine for a laugh; slurs never.

**Voice**
- One narrator per format: Jett for TOON3D, Anika for DOODLE. Characters get their own voices where they speak.
- The voice must match the drawn character's gender and age.
- **Never slow the voice down or time-stretch it**, and no slow-motion in the picture. Native speed 1.1 for Jett.
- Pauses inside a line are capped at ~0.3 s. Big pauses are placed on purpose: after the hook, before "You see", before the twist.

**Picture**
- 9:16 (1080×1920 design, rendered at 1440×2560 for TOON3D). No title card, no frame or caption box around the video.
- **Showcase moments get "dopamine":** snap-zoom, speed lines, a sparkle burst and a ding, and a flash frame only on the biggest hit.
- **Everything in frame:** in 9:16 the visible half-width at distance *d* is only `0.5625 × tan(fov/2) × d`. Check stills for props, bubbles and signs cut at the edge **before** rendering.
- **Text (DOODLE captions, promo type):** every text finishes writing and then **holds ≥ 1 s**. Never let a caption leave half-typed.
- **Physics:** hanging things stay plumb, breaks hinge at a joint, falling things fall with gravity and bounce.

**Sound**
- The music bed's **drop lands on the showcase word**. Music sits low under the voice, louder in gaps.
- Tape-stop the music before a punchline so the button lands dry.
- One ElevenLabs SFX per action, landed on the action's exact frame. Room tone per location.
- Master to **−14 LUFS** (−15…−13 accepted). Never let it fall to digital silence.

---

## 2. TOON3D, step by step (one video ≈ 2–4 h with Claude Code)

Folder per video: `toon3d/src/videos/<name>/` (engine copy) + `toon3d/shorts/<name>/` (script, voice, mix).

### Step 1: script (`shorts/<name>/SCRIPT.md` + `story.json`)
- **Formula:** paradox hook, the setting, escalation, a "You see," analogy, an ironic payoff, then the button.
- **Length:**
  - history stories: ~200–220 words ≈ 60 s;
  - AI explainers: 8–9 sentences ≈ 38–45 s.
- **Facts and sources:** put the facts with sources at the top of `SCRIPT.md`.
- **`story.json`:** one line per sentence. Copy any existing one (e.g. `shorts/ai1/story.json`). Each line is:
  ```json
  {"voice": "w_jett", "who": "N", "tts": "text as spoken", "text": "text to verify against", "gap": 0.12,
   "model": "eleven_multilingual_v2", "settings": {"speed": 1.1, "similarity_boost": 0.8}}
  ```
- **Hard words:** spell them for the voice in `tts` and keep the real words in `text`. For example `"M.I.T."` / `"MIT"`, or `"strr... aww... berry"`.

### Step 2: voice
```bash
python tools/voice/vo.py toon3d/shorts/<name>
cd toon3d
python scripts/assemble_voice.py shorts/<name> 0.1 0.14 "2:0.5,3:0.55,8:0.6"
```
- **`vo.py`:** generates every line and has Whisper transcribe it. Any take under 85 % word match is regenerated (up to 3 tries). It prints what it heard, so read it. Takes are cached by hash, so re-runs never re-bill.
- **`assemble_voice.py` arguments:** lead-in seconds, normal gap, then `"line:pause"` overrides. Use the overrides for the hook beat, the reveal and the button.
- **Output:** `voice/voice.wav`, `voice/words.json` (every word with its time) and `voice/lines.json`.
- **Frame of any word** = `round(seconds × 30)`. Every animation beat is keyed to these word frames.
- **For the mixer**, also run `python scripts/write_timing.py shorts/<name>`. It writes `vo/timing.json` and prints the `TOTAL` frame count to use in `story.ts`.

### Step 3: copy the engine and register it
```bash
cp -r src/videos/ai1 src/videos/<name>
```
- Rename `Ai1.tsx` to `<Name>.tsx` and rename its exports (`<NAME>_FRAMES`, `<Name>Short`, the `delayRender` label).
- Add a `<Composition id="<Name>Short" …/>` line in `src/Root.tsx` (1080×1920, 30 fps).
- Pick the source copy by set:

| You want | Copy | Light presets |
|---|---|---|
| sunny town / golden hour | `dance`, `ai1`, `obatoon` | `day`, `golden` |
| night street with lamps | `slasher`, `ai3` | `night` |
| casino interior | `casino`, `ai2` | `casino` |
| flat-colour hotel suite + prison cell | `tower`, `ai4` | `suite` |

### Step 4: `story.ts` (timeline and cameras)
- **`TOTAL`:** last voice frame + ~45 frames of tail.
- **`SHOTS`:** one shot per sentence or beat, `{id, a, b, light, crowd}`. `crowd` is the key the cast switch uses.
- **`BT`:** a table of the word frames you animate on (`{faces: 215, json: 359, …}`).
- **Cameras** (`CAMS`): each shot gets a `dolly(pos, look, pushK(f, shotStart, rate))`.
  - Every shot pushes in slowly: rate 0.0012–0.0025 per frame.
  - On punch words, add a punch: `pushK(f, a, 0.002, 0.006, 26)`.
  - Big reframes are **cuts**, not moves.
  - **Never reuse a camera function from another shot:** its push starts from the other shot's start frame and over-zooms.
- **`KICKS`:** 7-frame camera shakes on impacts, `[frame, strength 0.3–0.7]`.
- **`DOF`:** blur strength per shot. 0 = sharp; 5–13 typical.
- **`XFADE`:** an 8-frame crossfade only where the light changes (e.g. day → golden).

### Step 5: `cast.ts` (who and what is on screen)
- Add a `case "<crowd>":` per shot in `stage()`. Helpers that already exist:
  - `asker(...)`, `robot(...)` and `put(cam, t, out, id, OUTFIT, key, x, z, {expr, look, wave, prop, tilt})`: a standing character. `expr` is one of neutral, grin, laugh, shock, nervous, dazed, stern, smile, whistle, angry, shout…
  - `walker(...)`: a character walking.
  - `card(out, key, canvasW, canvasH, drawFn, x, y, z, worldWidth)`: a flat drawing in the world (a sign, bubble, prop or label).
  - `label(text, bg, fg, w, h)`, `bubble(text)`, `say(text)`, `thinkDots(n)`, `burst(...)`, `puff(...)`: ready-made drawings and effects.
  - `pop(f, at)` and `popB(f, at)`: 0→1 pop-in curves keyed to a word frame.
- New props and expressions are drawn in `toon.ts` with the same ink pen (`Pen.poly`, `Pen.ell`; outline `#241726`).
- New set pieces go in `world.ts`. A new style (snow, ship, fields…) means new geometry + a new light preset. Add that preset everywhere the `Light` union is listed: `lights.ts`, `grade.ts`, `cast.ts` CONTACT, `world.ts`.

### Step 6: stills before any render (the step that saves hours)
```bash
COMP=<Name>Short node scripts/bridge-stills.mjs out/<name>/s_ 50,165,230,330,420,540,690,800,960,1120 0.4
```
- Render **one still per shot** (plus one on each key word) and tile them into one sheet. Then check:
  - Is anything cut by the frame edge? Is a head blocking the subject?
  - Is a sign upside down? Is a set too dark?
  - Is a crowd too low in frame, or a bubble pointing at the wrong person?
- Fix the cause, re-render only those stills, and repeat until the sheet is clean.

### Step 7: render (background, ~10–20 min for 40 s)
```bash
npx remotion render src/index.ts <Name>Short out/<name>/video.mp4 --codec h264 --crf 16 --scale 1.3333 --gl=angle --concurrency 4 --timeout 180000
```
Add `--browser-executable "<path to chrome>"` if you want your own Chrome.

### Step 8: mix (while it renders)
Write `shorts/<name>/build_audio.py` by copying `shorts/obatoon/build_audio.py`:
```python
m.voices()
m.music("m729.mp3", drop_in_song=5.039, drop_at=fr(213), base=-60,
        env=[(0, fr(186), -25), (fr(186), fr(250), -15), ...], stop_at=fr(1046), stop_len=0.45)
m.room("quiet small town street, birds, distant chatter", -26, 0, fr(896))
m.cue(fr(215), "magic poof", 0.6, -8)      # (time, ElevenLabs SFX prompt, seconds, gain dB)
m.finish()                                  # -> out/audio.wav at -14 LUFS
```
- **`music`:** `drop_in_song` is the track's drop time from `tools/music/tracks.json`, and `drop_at` is your showcase frame.
- **`env`:** sets the music level in dB over time ranges: about −25 under the voice and −15 in gaps.
- **SFX:** effects are generated once and cached by prompt.

### Step 9: mux + QA + deliver
```bash
ffmpeg -i out/<name>/video.mp4 -i shorts/<name>/out/audio.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -shortest out/<name>/final.mp4
python scripts/short_qa.py out/<name>/final.mp4 out/<name>/qa out/<name>/shots.json
```
- QA prints: specs, loudness, silences, black or white or frozen frames, unplanned "pops", and per-shot colour, plus 2-second contact sheets.
- **Pass:** no black or frozen frames, loudness −15…−13 LUFS, and the only "pops" are your planned hits.
- Look at the contact sheets for the gag moments, then deliver.

---

## 3. DOODLE / Weird Worlds, step by step (one reel ≈ 1.5–3 h)

Folder per reel: `doodle-worlds/reels/NN-slug/`. The full idea slate, rules and pipeline are in
[`doodle-worlds/WORLDS-SLATE.md`](doodle-worlds/WORLDS-SLATE.md).

1. **New reel:** `python doodle-worlds/kit/tools/new_reel.py 21-my-world` copies the template and the kit.
2. **`story.json`:**
   - title (the hook as a question), world, CTA keyword, then lines.
   - The narrator is `mira_narrator` (Anika). Characters use their own `w_*` voice.
   - `tts` may carry ElevenLabs v3 audio tags like `[deadpan]` or `[gruff]`.
   - `gap` is the silence before the line; negative means an interruption.
3. **Voice:**
   ```bash
   python tools/voice/vo.py doodle-worlds/reels/21-my-world
   python doodle-worlds/kit/tools/timing.py doodle-worlds/reels/21-my-world
   ```
   `timing.py` lays the takes end to end at natural speed, re-transcribes them for exact word times, and writes `vo/timing.json`, `assets/timing.js` and the duration.
4. **The world: `assets/world.js`.** This reel's cast, set and props, drawn with the shared kit:
   - `Person` (characters, faces, poses);
   - `kit.js` (bubbles, sheets, signs…);
   - `rig.js` (props, fx).
   - Anything you draw twice moves into `kit/assets/kit.js`.
   - Check it with `asset_sheet.html` before animating.
5. **The film: `scene.js`.** `WK.film({ captions, cam, render(t, {world, fx, over}) })`.
   - Animate on the word times: `w(line, word)` is that word's start, `ls(line)` / `le(line)` a line's start and end.
   - Captions are short groups that hold ≥ 1 s.
   - Keep it to ≤ 6 things per scene, a re-hook every 5–8 s, and a single flash on the showcase.
6. **Check without rendering:**
   ```bash
   python doodle-worlds/kit/tools/qa.py <reel> check
   python doodle-worlds/kit/tools/qa.py <reel> beats "1.2,4,9.5,..."
   ```
   - `check` runs lint plus a seek-scan of every frame for exceptions, and checks every caption hold.
   - `beats` makes a contact sheet of chosen moments, so you can read them as stills.
7. **Mix:** `build_audio.py` (same `Mix` API as TOON3D), then `python build_audio.py`.
8. **Render + deliver:** `python doodle-worlds/kit/tools/qa.py <reel> final`.
   - It renders with `npx hyperframes@0.7.87`, muxes, makes a 2 fps sheet and checks loudness.
   - If everything passes, it copies the reel to `doodle-worlds/_delivery/`.

---

## 4. Making them in bulk (how 20 reels + 10 shorts were made in a few days)

1. **Write the slate first, all of it, before building anything.** One table row per video:
   - format and world;
   - title (= the hook);
   - what it teaches;
   - original cast;
   - twist or tag (it must loop back to the opening);
   - CTA keyword.

   See `doodle-worlds/WORLDS-SLATE.md`. Research what wins in the niche first; for animated story shorts that's Origin, IQ levels, Animal economics, Parable and Twist.
2. **Lock the shared kit before the batch.** Same narrator, same music pool, same mixer, same QA gates. Per video you only write `story.json`, `world.js`/`cast.ts`, `scene.js`/`story.ts` and `build_audio.py`.
3. **Pipeline the stages:** while video N renders in the background (Remotion/HyperFrames), voice video N+1 and write its scenes. Never wait on a render.
4. **Each video copies the previous one** of the same set (the engine folder, its `build_audio.py`), then changes only what the story needs. New capabilities (a light preset, a prop, an expression) are added once and every later video inherits them.
5. **QA gates are automatic and non-negotiable:**
   - the stills sheet before rendering;
   - `short_qa.py` / `qa.py final` after.

   Fix every instance of a problem across the whole video, not just the timestamp you noticed.
6. **Delivery:** one folder per batch, files numbered and named by title (`01_Why-AI-Cant-Count-the-Rs-in-Strawberry.mp4`).
7. **Don't stop between samples to ask.** Deliver each one, then start the next; only stop for real blockers.

**Claude Code does the heavy lifting.** Open this repo in Claude Code: `CLAUDE.md` and the skills in `.claude/skills/` teach it the pipeline. Then prompt like this:
> TOON3D AI explainer: "Why AI is bad at maths". 40 s, Jett, sunny town, robot character. Copy ai1. Follow SOP.md: script → voice → stills sheet → render → mix → QA.

> DOODLE Weird Worlds reel 21 from the slate row "…". Follow SOP.md §3.

---

## 5. Launch promo (motion graphics, no voice), the `obapromo` recipe

This is for showcasing a product or repo (the example shows the open-source Open Bot Avatar library).
- **Use the real product** in the render. Here the library itself is vendored in `src/vendor/` and drawn frame by frame. No screenshots, no mock-ups.
- **Music first:**
  - Pick an upbeat bed and measure it (`tools/music/fetch.py <id>` → bpm and drops).
  - Put the drop on frame 45 (the hook payoff).
  - Beat k = `45 + 16.72·k` frames at 107.7 BPM.
  - Cut scenes on bar downbeats (every 4 beats); swaps, pops and chips land on beats.
- **Structure (~33 s):**
  - hook: problem + payoff on the drop;
  - rapid swaps under the title;
  - a grid / "it reacts";
  - "describe it → it's made";
  - install line + licence chips;
  - end card with the link and credit;
  - a callback button.
- **Every scene:**
  - snap-zoom in (1.14 → 1 over 9 frames, expo-out);
  - a 3-frame white flash on scene changes;
  - speed lines on swaps;
  - a sparkle burst and confetti on payoffs.
  - Text rises out of a mask word by word and holds ≥ 1 s.
  - **Never leave half the screen empty** while something loads: put a "thinking" element there.

---

## 6. Mistakes we already made (so you don't)

| Symptom | Cause → fix |
|---|---|
| Props, bubbles or signs cut at the edge | 9:16 is narrow: compute half-width = `0.5625·tan(fov/2)·d` and keep props inside it. Check stills. |
| Camera over-zooms in one shot | A camera function reused from another shot keeps its push start frame. Give every shot its own camera. |
| A spinning wheel or sign lands upside down | Wrong rotation sign. Check the landing frame's still. |
| Kids or props hidden behind a table | Put them in front of it at scale 1, and pull the camera back. |
| A scene too dark to read | Switch that shot to a brighter light preset rather than brightening the whole grade. |
| Chip piles look like bar charts | Use striped textured stacks, beside the character, lower. |
| The TTS mangles a word | Respell it in `tts`, keep the real word in `text`, and let Whisper verify it. |
| Text vanishes half-typed | Each caption needs ≥ 1 s hold after it is fully written (`qa.py check` enforces this). |
| "Random pauses" in the audio | A noise gate dropping to digital zero. Never gate; keep room tone under everything. |
| Too quiet on a phone | Master to −14 LUFS. |

---

## 7. What's where

```
toon3d/                  Remotion project (TOON3D shorts + the launch promo)
  src/videos/<name>/     one engine copy per video (story.ts, cast.ts, world.ts, toon.ts, lights.ts, grade.ts, ...)
  src/vendor/            open-bot-avatar (MIT), used by the Open Bot Avatar videos
  shorts/<name>/         SCRIPT.md, story.json, voice timing, build_audio.py
  scripts/               stills, voice assembly, frame-by-frame QA
  references/            upstream style bible + measured reports (motion, depth, grade, lighting...)
doodle-worlds/
  kit/                   the shared Weird Worlds kit: assets (person/kit/rig/engine js), template, tools (new_reel, timing, qa, beats)
  reels/NN-slug/         the 20 reels' sources (story.json, scene.js, assets/world.js, build_audio.py)
  WORLDS-SLATE.md        the 20-idea slate + rules
tools/
  voice/                 ElevenLabs TTS with Whisper verification (vo.py), SFX cache (sfxgen.py), cast.json
  audio/                 audiokit.py (the mixer), audiofeatures.py (beats/drops of any track)
  music/                 tracks.json + fetch.py (downloads the Mixkit beds)
  motion-lab/            lint/scan for seek-safe HTML animation, render contract, playbook
  doodle/                tiny static server + doodle helpers used by the DOODLE QA
previews/                one strip per finished video (see STYLES.md)
```
