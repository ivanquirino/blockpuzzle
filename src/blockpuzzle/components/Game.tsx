/**
 * Input and Rendering
 */
import { Fragment, forwardRef, useEffect } from "react";
import { useGameStore } from "./GameClient";
import UnitBlock from "./UnitBlock";
import { acceptedKeys, idleInput } from "../constants";
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

      if (event.key === "ArrowUp") {
        inputObj.up = true;
      }

      input(inputObj);
    };
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, [input]);

  const handleBoardClick = () => {
    input({ ...idleInput, enter: true });
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
          </div>
        )}
      </div>
      <Gamepad />
    </>
  );
});

export default Game;
