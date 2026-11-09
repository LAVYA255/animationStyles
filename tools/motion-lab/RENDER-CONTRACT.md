# Render contract (paste under any motion prompt)

```
RENDER CONTRACT
- One self-contained HTML file. Libraries pinned to an exact version (no @latest). Fonts loaded with font-display:block;
  wait for document.fonts.ready before the first frame.
- Time comes only from the timeline: expose window.__render(t) (or renderAt(t) / a paused GSAP timeline in window.__timelines.root,
  or ?t=SECONDS in the URL) and draw the exact frame for t. No Date.now, performance.now, setTimeout, setInterval, CSS transitions,
  and no requestAnimationFrame driving motion.
- Randomness only from a seeded generator (MK.rng(seed)). Same t -> same pixels, every time.
- Animate transform and opacity (and filter sparingly). Resting text snapped to whole pixels.
- Loops: render frames 0..N-1 only, motion driven by phase = frame/N with whole-number cycles; frame 0 is a finished composition.
- Text holds at least 0.3 s per word + 0.5 s once fully on screen; nothing is ever frozen (2% push during holds).
- Opacity and colour never overshoot; only position/scale may spring.
- QA before the full render: stills at the named frames, a contact sheet, then fix by frame number.
```

Check a file against it: `python tools/motion-lab/motionlab.py lint index.html`.
