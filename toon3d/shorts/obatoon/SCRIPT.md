# "Your AI Agent Needs a Face" (TOON3D showcase of Open Bot Avatar) — v1 (2026-11-03)
Showcases https://github.com/DominikScholz/open-bot-avatar (Dominik Scholz, MIT; post: x.com/dom_scholz/status/2117307304395636772).
Facts used: a JSON spec + renderer for agent avatars; one SVG path in a 0..100 box plus eye placement (x, y, spacing, scale);
the renderer infers volume, blinks, idle motion, moods idle / thinking / happy, gaze that follows the pointer; 7 built-in
examples + 15 gallery avatars = 22; "describe it" -> any chat model writes the JSON (its system prompt); MIT, zero deps.
Avatars in the video are drawn by the vendored library itself (src/vendor/open-bot-avatar, avatarFrame per frame).
The clapperboard avatar is ours (passes avatar-validate --strict).
Narrator: Jett, eleven_multilingual_v2, native speed 1.1. No captions.

Every AI agent in this town looks exactly the same.
Ask the coding bot for help, and the email bot shows up.
So somebody gave them faces.
It's called Open Bot Avatar. Every face is one tiny JSON file: a single shape, plus where the eyes go.
The renderer does the rest. It adds depth, makes them blink, and their eyes follow you around.
They even have moods. Thinking, while your agent works... and happy, when it's done.
Twenty-two ready-made faces. Or describe one, and any AI will write it for you.
It's free, open source and MIT licensed. Search Open Bot Avatar on GitHub.
Now if only the email bot would stop hitting reply-all.
