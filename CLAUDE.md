# Notes for Claude Code in this repo

Two video formats live here. Build only the one the user names; never blend them.

- **TOON3D** (`toon3d/`, Remotion + three.js): a narrated 9:16 cartoon with 2D characters on cards in a 3D town and no captions. Skill: `toon3d-short`.
- **DOODLE / Weird Worlds** (`doodle-worlds/`, HyperFrames): narrated + voiced marker-cartoon story reels with short captions. Skill: `weird-worlds-reel`.
- **Launch promo** (`toon3d/src/videos/obapromo`): beat-cut motion graphics with no voice, for showcasing a product.

**Always follow [SOP.md](SOP.md).**
- Its §1 rules are not optional: hook on frame 0, payoff + comedic button, native-speed voice (never slowed), everything inside the 9:16 frame, text holds ≥ 1 s, the music drop on the showcase, −14 LUFS.
- Render a stills sheet before every full render and fix what it shows.
- Run the QA script after the render. Report its numbers honestly.

**In a batch,** deliver each video and start the next; don't stop to ask between samples.

**Secrets:** the ElevenLabs key lives in `.env` (git-ignored). Never print it, never commit it.
