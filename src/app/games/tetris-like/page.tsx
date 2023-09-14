import { Metadata } from "next";
import Game from "./components/Game";

function Page() {
  return <Game />;
}

export default Page;

export const metadata: Metadata = {
  title: "Tetris-like game",
};
