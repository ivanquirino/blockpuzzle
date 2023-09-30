import { Fragment } from "react";
import { useGameStore } from "./GameClient";
import UnitBlock, { GridUnitBlock } from "./UnitBlock";
import { COLS, SPAWN_ROWS } from "../constants";
import GridBlock from "./GridBlock";

/**
 * Renders the game using DOM
 *  
 */
function Game({ blockSize }: { blockSize: number }) {
  const grid = useGameStore((state) => state.grid);
  const current = useGameStore((state) => state.current);
  const currentPieceId = useGameStore((state) => state.currentPieceId);

  return (
    <>
      {current &&
        currentPieceId &&
        current.map(
          ({ x, y }, i) =>
            y > 1 && ( // do not render invisible rows
              <UnitBlock
                key={`c-${i}`}
                x={x}
                y={y - SPAWN_ROWS} // account for extra invisible rows
                size={blockSize}
                color={currentPieceId}
              />
            )
        )}
      {grid.map(
        (row, y) =>
          y > 1 &&
          row.map((col, x) => (
            <Fragment key={`grid-${(y - SPAWN_ROWS) * COLS + x}`}>
              <GridBlock x={x} y={y - SPAWN_ROWS} size={blockSize} /> 
              {col && (
                <GridUnitBlock
                  x={x}
                  y={y - SPAWN_ROWS}
                  size={blockSize}
                  color={col}
                />
              )}
            </Fragment>
          ))
      )}
    </>
  );
}

export default Game;
