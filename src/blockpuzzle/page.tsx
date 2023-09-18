import { Metadata } from "next";
import GameClient from "./components/GameClient";

function Page() {
  return (
    <div className="h-[100%] flex justify-center items-center">
      <GameClient />
    </div>
  );
}

export default Page;

export const metadata: Metadata = {
  title: "Tetris-like game",
};
