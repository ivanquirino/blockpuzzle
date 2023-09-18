import { State, useGameStore } from "../store";

const statusText: Partial<Record<State["status"], string>> = {
  idle: "Press enter to start",
  loading: "Loading...",
  gameover: "Game Over. Press enter to reset",
};

const Status = () => {
  const status = useGameStore((state) => {

    return statusText[state.status] ?? state.status;
  });

  return <h3 className="uppercase">{status}</h3>;
};

export default Status;
