import { forwardRef, useEffect } from "react";
import { useGameStore } from "../store";
import UnitBlock from "./UnitBlock";
import { acceptedKeys, idleInput } from "../constants";
import Status from "./Status";
import GridBlock from "./GridBlock";

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

  return (
    <div className="flex flex-col items-center justify-center ">
      <Status />
      <div
        ref={ref}
        className="w-[40vh] h-[80vh] flex justify-center items-center"
      >
        {isReady && (
          <div
            style={{
              width,
              height,
            }}
            className="border-[1px] border-white relative box-content"
          >
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
                  <>
                    <GridBlock
                      key={`g${x}${y}`}
                      x={x}
                      y={y - 2}
                      size={blockSize}
                    />
                    {col && (
                      <UnitBlock
                        key={`${y}${x}`}
                        x={x}
                        y={y - 2}
                        size={blockSize}
                        color={col}
                      />
                    )}
                  </>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default Game;
