"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useGameStore } from "./store";
import UnitBlock from "./components/UnitBlock";
import { baseWidth, baseHeight, baseSize, acceptedKeys, idleInput } from "./constants";

function Page() {
  const gridRef = useRef<HTMLDivElement>(null);

  const grid = useGameStore((state) => state.grid);
  const status = useGameStore((state) => state.status);
  const input = useGameStore((state) => state.input);
  const current = useGameStore((state) => state.current);

  const [gridWidth, setGridWidth] = useState(baseWidth);
  const [gridHeight, setGridHeight] = useState(baseHeight);
  const [blockSize, setBlockSize] = useState(baseSize);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (!acceptedKeys.includes(event.key)) {
        return;
      }

      const inputObj = { ...idleInput };

      if (event.key === "ArrowDown") {
        inputObj.down = true;
      }
      if (event.key === "ArrowLeft") {
        inputObj.left = true;
      }
      if (event.key === "ArrowRight") {
        inputObj.right = true;
      }
      if (event.key === "Enter") {
        inputObj.enter = true;
      }

      input(inputObj);
    };
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, [input]);

  useLayoutEffect(() => {
    const width = gridRef.current?.clientWidth || 0;
    const multiplier = Math.floor(width / baseWidth);

    setGridWidth(baseWidth * multiplier);
    setGridHeight(baseHeight * multiplier);
    setBlockSize(baseSize * multiplier);
    setReady(true);
  }, []);

  return (
    <div className="h-[100%] flex justify-center items-center">
      <h3 className="absolute top-2">
        {ready && (status === "idle" ? "Press ENTER to start" : status)}
      </h3>
      <div
        ref={gridRef}
        className="w-[40vh] h-[80vh] flex justify-center items-center"
      >
        {ready && (
          <div
            style={{
              width: gridWidth,
              height: gridHeight,
            }}
            className="border-[1px] border-white relative box-content"
          >
            {current && (
              <UnitBlock
                x={current.x * blockSize}
                y={current.y * blockSize}
                size={blockSize}
              />
            )}
            {grid.map((row, y) =>
              row.map(
                (col, x) =>
                  col && (
                    <UnitBlock
                      key={`${y}${x}`}
                      x={x * blockSize}
                      y={y * blockSize}
                      size={blockSize}
                    />
                  )
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
