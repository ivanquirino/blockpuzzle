import React from "react";
import { State } from "../store";
import { useGameStore } from "./GameClient";

const statusText: Partial<Record<State["status"], string>> = {
  idle: "Press enter or tap to start",
  loading: "Loading...",
  gameover: "Game Over. Press enter to reset",
  started: ""
};

const Status = () => {
  const status = useGameStore((state) => {

    return statusText[state.status] ?? state.status;
  });

  return <h3 className="uppercase text-center z-50">{status}</h3>;
};

export default React.memo(Status);
