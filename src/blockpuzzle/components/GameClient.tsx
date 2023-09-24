"use client";

import Game from "./Game";
import { storeFactory } from "../store";
import TopUI from "./TopUI";
import callbacks from "../webCallbacks";
import Music from "./Music";

export const { useGameStore } = storeFactory(callbacks());

function GameClient() {
  return (
    <div>
      <TopUI />
      <Game />
      <Music />
    </div>
  );
}

export default GameClient;
