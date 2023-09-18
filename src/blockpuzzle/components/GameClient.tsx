"use client";

import Game from "./Game";
import { useGameStore } from "../store";
import { useLayoutEffect, useRef, useState } from "react";
import { baseWidth, baseHeight, baseSize } from "../constants";
import Music from "./Music";
import TopUI from "./TopUI";

function GameClient() {  
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
    <div>
      <TopUI />
      <Game ref={gridRef} width={width} height={height} blockSize={blockSize} />
      <Music />
    </div>
  );
}

export default GameClient;
