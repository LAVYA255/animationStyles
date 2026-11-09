# "Why AI Can't Count the R's in Strawberry" (TOON3D AI explainer 1) — v1 (2026-11-03)
Facts: LLMs read tokens, not characters (byte-pair encoding). GPT-4o's tokenizer splits "strawberry" into roughly
"str" / "aw" / "berry"; models famously answered "2" to "how many r's in strawberry" (2024); reasoning models that
spell the word out letter by letter first get it right.
Narrator: Jett, eleven_multilingual_v2, native speed 1.1. No captions.

Ask ChatGPT how many R's are in strawberry, and for ages it said two.
It can write you a poem, but it can't count letters? Here's why.
AI never sees letters. Before it reads a single word, your sentence gets chopped into chunks called tokens.
Strawberry becomes something like str, aw, berry. Three chunks, and each one gets swapped for a number.
You see, it's like ordering from a menu where every dish is a number. You know number seven is pizza, but you couldn't tell me how many olives are on it.
So when you ask about letters, it isn't counting. It's guessing from memory.
That's why newer models spell the word out first, letter by letter, and then count.
The smartest machine on the planet, beaten by a damn fruit.
