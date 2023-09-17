import { useGameStore } from "../store";

const Status = () => {
  const status = useGameStore((state) => {
    let statusText: string = state.status;

    if (state.status === "idle") {
      statusText = "Press enter to start";
    }
    if (state.status === "loading") {
      statusText = "Loading...";
    }

    return statusText;
  });

  return <h3 className="uppercase">{status}</h3>;
};

export default Status;
