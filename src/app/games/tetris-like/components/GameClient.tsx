"use client";

import Game from "./Game";
import Controls from "./Controls";
import GameInfo from "./GameInfo";
import { useGameStore } from "../store";
import { useLayoutEffect, useRef, useState } from "react";
import { baseWidth, baseHeight, baseSize } from "../constants";

function GameClient() {
  const isReady = useGameStore((state) => state.status !== "loading");

  const gridRef = useRef<HTMLDivElement>(null);

  const [width, setGridWidth] = useState(baseWidth);
  const [height, setGridHeight] = useState(baseHeight);
  const [blockSize, setBlockSize] = useState(baseSize);

  const ready = useGameStore((state) => state.ready);

  useLayoutEffect(() => {
    const width = gridRef.current?.clientWidth || 0;
    const multiplier = Math.floor(width / baseWidth);

    setGridWidth(baseWidth * multiplier);
    setGridHeight(baseHeight * multiplier);
    setBlockSize(baseSize * multiplier);
    ready();
  }, [ready]);

  return (
    <>
      {isReady && <GameInfo blockSize={blockSize} />}
      <Game ref={gridRef} width={width} height={height} blockSize={blockSize} />
      {isReady && <Controls />}{" "}
    </>
  );
}

export default GameClient;
