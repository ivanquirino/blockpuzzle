import { Metadata } from "next";
// import dynamic from "next/dynamic";
import GameClient from "./components/GameClient";

// const GameClient = dynamic(() => import("./components/GameClient"), { ssr: false })

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
