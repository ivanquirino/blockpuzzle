import React from "react";
import { State } from "../store";
import { useGameStore } from "./GameClient";

const statusText: Partial<Record<State["status"], string>> = {
  idle: "Press enter or click/tap the grid to start",
  loading: "Loading...",
  gameover: "Game Over. Press enter to reset",
  started: ""
};

const StatusOverlay = () => {
  const status = useGameStore((state) => {

    return statusText[state.status] ?? state.status;
  });

  return <h3 className="uppercase text-center z-40 mx-8">{status}</h3>;
};

export default React.memo(StatusOverlay);
