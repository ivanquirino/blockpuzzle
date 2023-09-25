"use client";

import Game from "./Game";
import { storeFactory } from "../store";
import TopUI from "./TopUI";
import Music from "./Music";
import SoundEffects from "./SoundEffects";
import WelcomeDialog from "./WelcomeDialog";
import MenuDialog from "./MenuDialog";

export const { store, useGameStore } = storeFactory();

function GameClient() {
  return (
    <div>
      <TopUI />
      <Game />
      <Music />
      <SoundEffects />
      <WelcomeDialog />
      <MenuDialog />
    </div>
  );
}

export default GameClient;
