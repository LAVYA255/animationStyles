// Every toon3d short is one composition: 1080x1920, 30 fps. Final export at 1440x2560 with --scale 1.3333.
import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { DanceShort, DANCE_FRAMES } from "./videos/dance/Dance";
import { SlasherShort, SLASHER_FRAMES } from "./videos/slasher/Slasher";
import { CasinoShort, CASINO_FRAMES } from "./videos/casino/Casino";
import { TowerShort, TOWER_FRAMES } from "./videos/tower/Tower";
import { Ai1Short, AI1_FRAMES } from "./videos/ai1/Ai1";
import { Ai2Short, AI2_FRAMES } from "./videos/ai2/Ai2";
import { Ai3Short, AI3_FRAMES } from "./videos/ai3/Ai3";
import { Ai4Short, AI4_FRAMES } from "./videos/ai4/Ai4";
import { ObaPromo, OBA_PROMO_FRAMES } from "./videos/obapromo/ObaPromo";
import { ObaToonShort, OBATOON_FRAMES } from "./videos/obatoon/ObaToon";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ObaToonShort" component={ObaToonShort} durationInFrames={OBATOON_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ObaPromo" component={ObaPromo} durationInFrames={OBA_PROMO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Ai4Short" component={Ai4Short} durationInFrames={AI4_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Ai3Short" component={Ai3Short} durationInFrames={AI3_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Ai2Short" component={Ai2Short} durationInFrames={AI2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Ai1Short" component={Ai1Short} durationInFrames={AI1_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="TowerShort" component={TowerShort} durationInFrames={TOWER_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="CasinoShort" component={CasinoShort} durationInFrames={CASINO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="SlasherShort" component={SlasherShort} durationInFrames={SLASHER_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="DanceShort" component={DanceShort} durationInFrames={DANCE_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="BridgeShort" component={BridgeShort} durationInFrames={BRIDGE_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
