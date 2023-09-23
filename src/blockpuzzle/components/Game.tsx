/**
 * Input and Rendering
 */
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { useGameStore } from "./GameClient";
import UnitBlock, { GridUnitBlock } from "./UnitBlock";
import { SPAWN_ROWS, baseHeight, baseSize, baseWidth, idleInput } from "../constants";
import Status from "./Status";
import GridBlock from "./GridBlock";
import Gamepad from "./Gamepad";
import { css } from "@stitches/react";

function Game() {
  const grid = useGameStore((state) => state.grid);
  const input = useGameStore((state) => state.input);
  const current = useGameStore((state) => state.current);
  const currentPieceId = useGameStore((state) => state.currentPieceId);
  const isReady = useGameStore((state) => state.status !== "loading");

  const ref = useRef<HTMLDivElement>(null);

  const [width, setGridWidth] = useState(baseWidth);
  const [height, setGridHeight] = useState(baseHeight);
  const [blockSize, setBlockSize] = useState(baseSize);

  const ready = useGameStore((state) => state.ready);

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
  const classes = `border-[1px] 
    border-white 
    relative box-content 
    flex 
    justify-center 
    items-center 
    ${gridDimensions}`;

  return (
    <>
      <div ref={ref} className="w-[40vh] h-[80vh] flex flex-col items-center">
        {isReady && (
          <div className={classes} onClick={handleBoardClick}>
            <Status />
            {current &&
              currentPieceId &&
              current.map(
                ({ x, y }) =>
                  y > 2 && ( // do not render invisible rows
                    <UnitBlock
                      key={`${x}-${y}`}
                      x={x}
                      y={y - SPAWN_ROWS} // account for extre invisible rows
                      size={blockSize}
                      color={currentPieceId}
                    />
                  )
              )}
            {grid.map(
              (row, y) =>
                y > 2 &&
                row.map((col, x) => (
                  <Fragment key={`${y}${x}`}>
                    <GridBlock x={x} y={y - SPAWN_ROWS} size={blockSize} />
                    {col && (
                      <GridUnitBlock x={x} y={y - SPAWN_ROWS} size={blockSize} color={col} />
                    )}
                  </Fragment>
                ))
            )}
            <Gamepad />
          </div>
        )}
      </div>
    </>
  );
}

export default Game;
