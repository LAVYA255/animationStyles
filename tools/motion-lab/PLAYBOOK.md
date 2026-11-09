# Motion Lab playbook

How to get studio-grade motion out of Claude (Opus 5.5) in this workspace. Distilled from Florence's (@flxrnc) X article
"Opus 5.5 Motion Lab: Make Claude Animate Like a Studio" (30 Sep 2026) and merged with this repo's own measured rules
(text hold, dopamine pacing, comic timing). Tools: `motion-kit.js`, `motionlab.py`. The paste-in blocks are `RENDER-CONTRACT.md` and
`PROMPT-TEMPLATE.md`.

## Why this works
Claude writes motion as **code** (one HTML file: HyperFrames here, or Three.js / Remotion / plain HTML), and a headless browser renders
every frame. That gives three advantages over "AI video":
1. **Every frame is a pure function of time**, so any frame can be rendered, checked and fixed on its own.
2. **Edits are cheap:** change one number and re-render only what changed.
3. **Claude can check its own work:** it reads stills, contact sheets, onion skins and speed graphs, and names the frame that's wrong.

The quality comes from **directing**: numbers instead of adjectives, and a ban list for the defaults. A 27-word vague prompt gives the
generic look (dark space, glow, particles, spinning things). A ~450-word directed prompt plus 2–4 review rounds gives a studio piece.

## 1. Direct the prompt (PROMPT-TEMPLATE.md)
Fill every field:
- **GOAL:** one sentence on what the viewer should feel or do.
- **OUTPUT:** engine and size.
- **TIME:** seconds × fps = frames, and whether it loops.
- **LOOK:** hex palette with **one** accent, typeface, weight, size and tracking.
- **MOTION:** easing as `cubic-bezier`, springs as a damping ratio, durations in frames.
- **SHOTS:** frame ranges, **one hero move per shot**, and the handoff (a cut on the beat by default, a match cut, or a mask wipe).
- **BANNED:** the defaults you never want.
- **QA:** named stills, a contact sheet, then the full render.

For 3D, add:
- **Materials:** roughness, clearcoat and F0, with exact values.
- **Lights:** key, fill and rim, with colour temperature and strength.
- **Camera:** FOV of 30–50°, one push or orbit, and its easing.

## 2. Ban list (start here, then add whatever the first render used anyway)
- purple or blue gradients, glow, lens flares, neon, bloom used as a style
- floating decorative particles, spinning turntables
- everything fading in at once, or fade-and-slide-up on every element
- centred-everything layouts
- text that moves while it's being read
- dark-space backgrounds, unless the brief asks for one

`motionlab.py lint` catches the code-level ones (glow shadows, purple gradients, particles), and the render-contract breakers.

## 3. Motion numbers (`motion-kit.js` implements all of these)

### Easing
| name | cubic-bezier | use |
|---|---|---|
| `MK.ease.outExpo` | 0.16, 1, 0.3, 1 | text and logo reveals |
| `MK.ease.outQuint` | 0.22, 1, 0.36, 1 | premium entrances |
| `MK.ease.inOutQuart` | 0.76, 0, 0.24, 1 | moves and camera pushes (the softest curves go on the camera) |
| `MK.ease.inExpo` | 0.7, 0, 0.84, 0 | fast exits |
| `MK.ease.outBack` | 0.34, 1.56, 0.64, 1 | playful pop |

- Enter with ease-out. Exit with ease-in, 40–50% shorter. Move with ease-in-out.
- Use linear only for rotation, progress bars and loop phase.

### Springs
Use `MK.spring(t, zeta, f)`, which works on any frame. By damping ratio (zeta):

| damping | feel |
|---|---|
| 1.0 | no bounce |
| 0.7–0.85 | premium |
| 0.4–0.6 | playful |
| under 0.3 | cartoon |

- Position and scale may bounce. Opacity and colour **never** do; `motionlab.py graph` flags opacity that bounces.
- `MK.settle(z, f)` gives a spring's settle time, so you can start the next element when this one is 30–50% done.

### Durations
| what | duration |
|---|---|
| UI feedback | 100–200 ms |
| UI moves | 200–500 ms |
| hero reveals | 600–900 ms |
| letters | 1 frame apart |
| words | 60–120 ms apart |
| list items | 40–80 ms apart |

At 24 fps one frame is about 42 ms, so a 400 ms move is 10 frames.

### Hierarchy
- **One hero per shot.** The others wait, dim to 40%, or hold.
- **Secondary moves:** 50–70% of the hero's travel, starting 100–200 ms later (`MK.secondary`).
- **Ambient motion:** under 5% of the hero's travel, on a slow sine, and it never stops (`MK.ambient`).

### Beat grid
- `MK.beats(bpm, fps)` gives frames per beat (fps × 60 ÷ BPM). Compute every beat from its index and never add rounded values, or the timing drifts.
- Cut on the beat. Change the layout every 4 beats.

### Holds
- Text stays readable for **0.3 s per word + 0.5 s** (`MK.holdFor`). This matches our own text-hold rule: finish writing, then hold at least 1 s.
- During a hold, push the frame about 2% (`MK.holdPush`), so no frame is ever frozen.

### Parallax
Foreground 1.0, middle 0.5, background 0.2.

### Accessibility
Text contrast at least 4.5:1 on every frame, and no more than 3 flashes a second. `hyperframes validate` checks the contrast.

## 4. The lab loop: render, look, fix (2–4 rounds is normal)
1. **Stills at named frames.** Use `hyperframes snapshot --at`, or `?t=` / `__render(t)` in a plain page. Describe each still as a viewer would, then fix whatever doesn't match the shot list.
2. **Contact sheet:** `motionlab.py sheet out.mp4 --every 12`. Mark the moments where two things move at once.
3. **Onion skin:** `motionlab.py onion out.mp4 --frames 24-47`. Even spacing means robotic motion. Spacing that tightens near the keys means good easing.
4. **Speed graph:** `motionlab.py graph index.html --sel "#hero,.title"`. It flags:
   - linear moves;
   - dead starts and stops;
   - opacity that bounces;
   - frames where 2+ elements move at once.
5. **Senior review:** "10 notes by impact, each with a frame number and the code change; apply the top 5."
6. **Fix and re-render only what changed.** When a fix holds, add it to the render contract.

### Translating feedback into numbers
| note | change |
|---|---|
| "make it pop" | `MK.pop`: scale 1.0 → 1.08 → 1.0 over 6 frames, peaking on the beat |
| "more premium" | outQuint entrances, springs at 0.8, no overshoot on text |
| "it drags" | shorten each hold by one beat (12 frames at 120 BPM, 24 fps) |
| "too busy" | one hero move at a time, others 150 ms later at 60% travel; or remove 30% of the motion |
| "abrupt ending" | a 36-frame hold with a 2% push, then settle on a damping-0.8 spring |
| "looks like AI" | list the defaults it used, ban each one by name, re-render |

## 5. Engines
| job | engine |
|---|---|
| default here | **HyperFrames** (HTML + GSAP; our templates expose `__render(t)`) |
| one 2D idea under 10 s | plain HTML |
| data-driven series | Remotion (licence needed above 3 employees) |
| 3D | Three.js, pinned (e.g. 0.160.0) via importmap; time from the frame number, never the clock |
| motion inside a product | GSAP or Motion |

GSAP is free, SplitText, MorphSVG and DrawSVG included.

## 6. Last mile
- **Sound:**
  - The picture must work muted first.
  - Mix to -14 LUFS with peaks at -1 dBTP.
  - Sync hits by decoding the render and checking against frames, never by assuming.
- **Loops:**
  - Render frames 0…N-1 (never N).
  - Drive motion by `phase = frame/N` with whole cycles (`MK.loopPhase`).
  - For organic drift, sample noise on a circle (`MK.loopNoise`).
  - Frame 0 must already be a finished composition.
  - Check the seam with `motionlab.py loop`.
- **Export:**
  - Posts: MP4, H.264 High, yuv420p, CRF 18, faststart (`motionlab.py mp4`).
  - X GIF (`motionlab.py gif`):
    - one palette;
    - lanczos scaling, 1200 px wide;
    - bayer dither;
    - delays rewritten so the loop keeps its exact length (24 fps → 40/40/50 ms pattern);
    - X limits: 15 MB and 350 frames.
- **Canvases:** 1920×1080, 1080×1080, 1080×1350, 1080×1920.

## 7. When something breaks
| symptom | fix |
|---|---|
| flicker or jitter | every value a pure function of t, seeded random, no timers or CSS transitions |
| wrong font in the first frames | `font-display:block`, and await `document.fonts.ready` |
| loop hiccup | render 0…N-1, `phase = frame/N`, whole cycles |
| audio drifts | beat n at n × 60 / BPM, rounded per beat |
| dropped frames | animate only transform and opacity |
| GIF banding | avoid gradients, or dither |
| blurry text | snap resting text to whole pixels, render 2× and downscale |
| text moves before it's readable | hold 0.3 s/word + 0.5 s |
| everything moves at once | one hero; the others 150 ms later at 60% travel |

If a fix doesn't hold, render the two frames on either side of the problem and describe the difference.
