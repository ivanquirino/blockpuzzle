"use client";

import Game from "./Game";
import { storeFactory } from "../store";
import TopUI from "./TopUI";
import Music from "./Music";
import SoundEffects from "./SoundEffects";

export const { useGameStore } = storeFactory();

function GameClient() {
  return (
    <div>
      <TopUI />
      <Game />
      <Music />
      <SoundEffects />
    </div>
  );
}

export default GameClient;
