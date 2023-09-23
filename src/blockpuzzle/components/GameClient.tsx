"use client";

import Game from "./Game";
import { storeFactory } from "../store";
import TopUI from "./TopUI";
import callbacks from "../webCallbacks";

export const { useGameStore } = storeFactory(callbacks());

function GameClient() {
  return (
    <div>
      <TopUI />
      <Game />
    </div>
  );
}

export default GameClient;
