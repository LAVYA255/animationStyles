# Directed motion prompt (fill every line; numbers, not adjectives)

```
GOAL:    <one sentence: what the viewer should feel or do>
OUTPUT:  HyperFrames composition (index.html) | Three.js single HTML | Remotion | plain HTML — <W>x<H>
TIME:    <seconds> s x <fps> fps = <frames> frames. Loops: yes/no (if yes, frame N == frame 0)
LOOK:    bg <hex>, ink <hex>, ONE accent <hex>; type <family> <weight> <size>px, tracking <em>
         (or: apply brand kit brand-kits/<domain>: var(--brand-*), .brand-display)
MOTION:  entrances cubic-bezier(0.22,1,0.36,1) <n> frames; exits cubic-bezier(0.7,0,0.84,0) <n*0.55> frames;
         moves cubic-bezier(0.76,0,0.24,1); springs damping <0.8>, <2> Hz; letters 1 frame apart, words <90> ms
BEAT:    <bpm> BPM -> <fps*60/bpm> frames per beat; cuts on beats; layout changes every 4 beats
SHOTS:   f0-f47    <hero move> ; handoff: cut on beat
         f48-f95   <hero move> ; handoff: match cut / mask wipe
         ...       (one hero per shot; secondaries 60% travel, 150 ms later; ambient <5%)
BANNED:  purple/blue gradients, glow, lens flares, particles, everything fading in at once, fade-slide-up on everything,
         centred everything, text moving while being read, <whatever the last render did anyway>
QA:      stills at f<..>, f<..>, f<..>; contact sheet every 12 frames; speed graph of <selectors>; fix by frame number, then full render.
```

Paste RENDER-CONTRACT.md under it. For a format copied from a reference video, take SHOTS from `refvideo.py plan` (slot timings,
transitions, camera moves, text slots) and the LOOK from `brandkit.py` + the reference's REFERENCE.md.
