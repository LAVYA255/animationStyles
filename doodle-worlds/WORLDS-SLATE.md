# "Weird Worlds": 20 story reels (DOODLE look, narrated + dialogue) — research-backed slate

Research: `content-knowledge/references/animated-story-shorts-research.md` (YouTube data scraped 2026-11-02). Five formats
win: **Origin** ("How X was invented" in an old world), **IQ levels** (low / mid / high solve one problem), **Animal
economics**, **Parable**, **Twist** (horror / dystopia). The world is the hook; the lesson is the reason to save. Titles
are questions, never "business lesson". Original characters and topics only (none of the competitors' titles).

**Rules (all of Lav's feedback):** frame 0 moves and shows the world + the problem · open a loop in the first seconds,
close it in the last 5 s · a re-hook every 5–8 s · ≤ 6 things per scene · camera moves/wipes, max one flash (the
showcase) · real acting · short captions that hold ≥ 1 s · natural-speed voices · music drop on the showcase · button +
tag that hands back to the opening (loopable) · comment-keyword CTA naming a free asset · 30–50 s.
Narrator: Anika (channel voice) on every reel; characters get their own voices where they speak.

| # | Format | World | Title (the hook) | What it teaches | Original cast | Twist / tag (loops back) | CTA |
|---|---|---|---|---|---|---|---|
| 1 | Origin | Stone Age | How insurance was invented | Pooling risk: many pay a little so one isn't ruined | Thog, the tribe, the fire | Ugg burns his own hut on purpose → "and that's how insurance fraud was invented" | RISK |
| 2 | Origin (true) | Sumer, 3100 BC | The first thing humans ever wrote was a bill | Writing began as bookkeeping (clay tokens → tablets); records build trust | Kushi the grain-keeper, a forgetful farmer | the farmer: "I'll pay you tomorrow" — the first IOU | RECORD |
| 3 | IQ levels | Space station | How different IQ astronauts fix a broken spaceship | Rubber-duck debugging | three astronauts, one rubber duck | the duck floats off: "Houston, new problem" | DEBUG |
| 4 | Twist | Dystopia 2087 | In 2087, you pay with your attention | The attention economy; notifications are the tax | Nova, the City screen | ends: "you've paid 40 seconds for this video" | FOCUS |
| 5 | Animal economics | Forest | Why does everything cost 99? (explained with squirrels) | Charm pricing / left-digit effect | Hazel the squirrel shopkeeper, a chipmunk buyer | the chipmunk pays with 99 acorns and a 1-acorn IOU | PRICE |
| 6 | Parable | Medieval | The king wanted a perfect castle. The peasant built a hut first. | Ship a small version first (MVP) | King Aldo, Wren the peasant | rain: the king moves into the hut | MVP |
| 7 | Animal economics | Coral reef | An octopus had 8 arms and still couldn't run his shop | Delegate / automate everything except the jobs only you can do | Otto the octopus, a crab, a pufferfish customer | the crab asks for arm #9 | ARMS |
| 8 | Parable | Wild West | Two saloons started a price war. A third one won. | Differentiate instead of cutting price | Dusty, Belle, Rosa (the third saloon) | the other two end up drinking at Rosa's | WAR |
| 9 | Twist | Haunted mansion | This ghost was fired from haunting | Re-position the same thing for a new customer | Boris the ghost, two teenagers | the teens leave a 5-star review: "terrifying" | GHOST |
| 10 | Twist | Zombie apocalypse | She survived the zombies. Her files didn't. | 3-2-1 backups | Kai, a polite zombie | the zombie hands back a USB stick | BACKUP |
| 11 | IQ levels | Pirate ship | How different IQ pirates split the treasure | "I cut, you choose" (fair division) | Captain Marrow, two pirates, the parrot | the parrot takes the last coin | SPLIT |
| 12 | Parable | Samurai dojo | He wanted to master the sword in one day | 1% better daily (1.01^365 ≈ 38x) | Kenji, Sensei Hoshi | Day 366: "1% more" | HABIT |
| 13 | Parable | Dinosaur age | The dinosaurs ignored a tiny competitor | Disruption starts small and cheap | T-Rex CEO, a tiny mammal | the meteor; the mammal shrugs | SMALL |
| 14 | Twist | Noir city | Customers were vanishing from this shop | Funnel drop-off: remove friction | Detective Vera, the shopkeeper | the killer: "Confirm your password" | FUNNEL |
| 15 | Parable (fable twist) | Fairy-tale farm | He had a goose that laid golden eggs. He worked it to death. | Protect what makes you money (burnout) | Farmer Tod, Goldie the goose | Goldie books a holiday | REST |
| 16 | Animal economics | Arctic | Selling ice to penguins sounds easy | Customer discovery: ask before you build | Pemmy the penguin, the colony | she sells shade umbrellas | ASK |
| 17 | Twist | Cyberpunk city | Grandma got a call from her grandson. It wasn't him. | Voice-clone scams: the family safe word | Nani, the scam voice, the real grandson | Nani asks the voice for the safe word | SAFE |
| 18 | Origin (true-ish) | Ancient Egypt | The pyramid builders were paid in beer | Pay people in what they value (incentives) | Overseer Nakht, the crew | the crew asks for a raise: more bread | PAY |
| 19 | Parable | Volcano island | A tour guide had 3 customers. A year later, 3,000. | Referral loops | Lani the guide, tourists | the volcano wants a referral too | INVITE |
| 20 | Twist (emotional) | Time travel | An 80-year-old founder travelled back to meet herself at 22 | Start small, start now | Old Asha, young Asha | young Asha starts; old Asha fades, smiling | START |

## Pipeline per reel (asset-first)
`python doodle-reels/worlds-kit/new_reel.py NN-slug` → `story.json` → `vo.py` + `timing.py` → `assets/world.js` (this
world's cast + set + props, built on the shared kit) → `asset_sheet.html` → render the sheet → `scene.js` (beats on word
times) → lint + scan + beat sheet → `build_audio.py` → render → mux → QA (2 fps sheet, caption-hold, loudness) →
`doodle-reels/_delivery/NN-<Title>.mp4`.
