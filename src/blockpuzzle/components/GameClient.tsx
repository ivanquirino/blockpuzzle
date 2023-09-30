"use client";
import { useRef, useState, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import Game from "./Game";
import { storeFactory } from "../store";
import TopUI from "./TopUI";
import Music from "./Music";
import SoundEffects from "./SoundEffects";
import WelcomeDialog from "./WelcomeDialog";
import Gamepad from "./Gamepad";
import StatusOverlay from "./StatusOverlay";
import { css } from "@stitches/react";
import { baseWidth, baseHeight, baseSize, idleInput } from "../constants";
import GameCanvas from "./GameCanvas";

export const { store, useGameStore } = storeFactory();

function GameClient() {
  const searchParams = useSearchParams();  

  const input = useGameStore((state) => state.input);
  const isReady = useGameStore((state) => state.status !== "loading");
  const ready = useGameStore((state) => state.ready);

  const ref = useRef<HTMLDivElement>(null);

  const [width, setGridWidth] = useState(baseWidth);
  const [height, setGridHeight] = useState(baseHeight);
  const [blockSize, setBlockSize] = useState(baseSize);

  useLayoutEffect(() => {
    const width = ref.current?.clientWidth || 0;
    const multiplier = Math.floor(width / baseWidth);

    setGridWidth(baseWidth * multiplier);
    setGridHeight(baseHeight * multiplier);
    setBlockSize(baseSize * multiplier);
    ready();
  }, [ready]);

  const handleBoardClick = () => {
    input({ ...idleInput, start: true });
  };

  const gridDimensions = css({ width, height });
  const classes = `
    border-[1px] 
    border-neutral-300 
    relative 
    box-content 
    flex 
    justify-center 
    items-center 
    rounded
    ${gridDimensions}`;

  const gameRender =
    searchParams.get("renderer") === "canvas" ? (
      <GameCanvas width={width} height={height} blockSize={blockSize} />
    ) : (
      <Game blockSize={blockSize} />
    );

  return (
    <div>
      <TopUI />
      <div ref={ref} className="w-[40vh] h-[80vh] flex flex-col items-center">
        {isReady && (
          <div className={classes} onClick={handleBoardClick}>
            <StatusOverlay />
            {gameRender}
            <Gamepad />
          </div>
        )}
      </div>

      <Music />
      <SoundEffects />
      <WelcomeDialog />
    </div>
  );
}

export default GameClient;
