/**
 * Input and Rendering
 */
import { Fragment, forwardRef } from "react";
import { useGameStore } from "./GameClient";
import UnitBlock from "./UnitBlock";
import { idleInput } from "../constants";
import Status from "./Status";
import GridBlock from "./GridBlock";
import Gamepad from "./Gamepad";
7;

interface GameProps {
  width: number;
  height: number;
  blockSize: number;
}

const Game = forwardRef<HTMLDivElement, GameProps>(function Game(props, ref) {
  const { width, height, blockSize } = props;

  const grid = useGameStore((state) => state.grid);

  const input = useGameStore((state) => state.input);
  const current = useGameStore((state) => state.current);
  const currentPieceId = useGameStore((state) => state.currentPieceId);

  const isReady = useGameStore((state) => state.status !== "loading");

  const handleBoardClick = () => {
    input({ ...idleInput, start: true });
  };

  return (
    <>
      <div ref={ref} className="w-[40vh] h-[80vh] flex flex-col items-center">
        {isReady && (
          <div
            style={{
              width,
              height,
            }}
            className="border-[1px] border-white relative box-content flex justify-center items-center"
            onClick={handleBoardClick}
          >
            <Status />
            {current &&
              currentPieceId &&
              current.map(
                ({ x, y }) =>
                  y > 1 && (
                    <UnitBlock
                      key={`${x}-${y}`}
                      x={x}
                      y={y - 2}
                      size={blockSize}
                      color={currentPieceId}
                    />
                  )
              )}
            {grid.map(
              (row, y) =>
                y > 1 &&
                row.map((col, x) => (
                  <Fragment key={`${y}${x}`}>
                    <GridBlock x={x} y={y - 2} size={blockSize} />
                    {col && (
                      <UnitBlock x={x} y={y - 2} size={blockSize} color={col} />
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
});

export default Game;
