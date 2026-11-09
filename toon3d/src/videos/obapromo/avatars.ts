// The cast for the Open Bot Avatar showcase: the library's 7 built-in examples + its 15 gallery avatars (22, each in
// the gallery's own colour), plus two of ours that pass `avatar-validate --strict`: a clapperboard (the "describe it"
// beat) and a plain dot (the faceless agent from the hook that gets a face at the end).
import { examples, renderAvatarSvg } from "../../vendor/open-bot-avatar/index";
import type { AvatarDefinition } from "../../vendor/open-bot-avatar/types";
import book from "../../vendor/open-bot-avatar/gallery/book.json";
import brain from "../../vendor/open-bot-avatar/gallery/brain.json";
import bull from "../../vendor/open-bot-avatar/gallery/bull.json";
import bunny from "../../vendor/open-bot-avatar/gallery/bunny.json";
import camera from "../../vendor/open-bot-avatar/gallery/camera.json";
import cat from "../../vendor/open-bot-avatar/gallery/cat.json";
import cloud from "../../vendor/open-bot-avatar/gallery/cloud.json";
import ghost from "../../vendor/open-bot-avatar/gallery/ghost.json";
import magnifier from "../../vendor/open-bot-avatar/gallery/magnifier.json";
import paintBrush from "../../vendor/open-bot-avatar/gallery/paint-brush.json";
import palette from "../../vendor/open-bot-avatar/gallery/palette.json";
import rocket from "../../vendor/open-bot-avatar/gallery/rocket.json";
import shield from "../../vendor/open-bot-avatar/gallery/shield.json";
import star from "../../vendor/open-bot-avatar/gallery/star.json";
import witchHat from "../../vendor/open-bot-avatar/gallery/witch-hat.json";
import colors from "../../vendor/open-bot-avatar/gallery/colors.json";

export { renderAvatarSvg };
export type { AvatarDefinition };

const gallery = [book, brain, bull, bunny, camera, cat, cloud, ghost, magnifier, paintBrush, palette, rocket, shield, star, witchHat] as AvatarDefinition[];
export const ALL: AvatarDefinition[] = [...examples, ...gallery];
export const BY: Record<string, AvatarDefinition> = Object.fromEntries(ALL.map((d) => [d.id, d]));
export const COLOR: Record<string, string> = colors as Record<string, string>;

export const CLAPPER: AvatarDefinition = {
  version: 1,
  id: "clapper",
  name: "Clapper",
  body: { path: "M23 44 H77 Q85 44 85 52 V80 Q85 88 77 88 H23 Q15 88 15 80 V52 Q15 44 23 44 Z M15 36 L79 18 Q84 17 85 21 L86 25 Q87 29 82 30 L18 40 Q15 40.5 15 38 Z" },
  eyes: { x: 50, y: 66, spacing: 19, scale: 1.15 },
};

export const DOT: AvatarDefinition = {
  version: 1,
  id: "dot",
  name: "Dot",
  body: { path: "M50 14 A36 36 0 1 1 49.99 14 Z" },
  eyes: { x: 50, y: 50, spacing: 17, scale: 1.2 },
};
