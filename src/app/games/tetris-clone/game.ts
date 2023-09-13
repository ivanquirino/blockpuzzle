import { State } from "./store";
import { scorePerRow, ROWS, COLS } from "./constants";
import { KeyboardInput } from "./types";

/**
 * Spawns the current piece
 * @param state 
 * @returns updated state
 */
export function spawn(state: State) {
  return state.current === null ? { current: { x: 4, y: 0 } } : state;
}

const getGridCell = (row: number, col: number, grid: State["grid"]) => {
  if (grid[row] && grid[row][col]) {
    return grid[row][col];
  }

  return null;
};

/**
 * Place the current block on the grid, removing the current piece
 * @param state 
 * @returns updated state
 */
export function placeCurrentBlock(state: State) {
  const current = state.current;
  const grid = state.grid;

  if (current) {
    if (getGridCell(current.y + 1, current.x, grid) || current.y === 19) {
      const newGrid = [...grid];

      newGrid[current.y] = [...grid[current.y]];

      newGrid[current.y][current.x] = 1;

      return { grid: newGrid, current: null };
    }
  }

  return state;
}

const NullArray = (length: number) => {
  const row = [];

  for (let j = 0; j < length; j++) {
    row.push(null);
  }

  return row;
};

export const createGrid = () => {
  const grid = [];

  for (let i = 0; i < ROWS; i++) {
    grid.push(NullArray(COLS));
  }

  return grid as (null | number)[][];
};

const getFullRows = (grid: State["grid"]) => {
  return grid.reduce((acc: number[], row, index) => {
    if (row.every((cell) => !!cell)) {
      acc.push(index);
    }

    return acc;
  }, []);
};

const removeRows = (rows: number[], grid: State["grid"]): State["grid"] => {
  const removeGrid = [...grid];

  rows.forEach((row) => {
    removeGrid[row] = NullArray(COLS);
  });

  return removeGrid;
};

const moveRowsToBottom = (removedGrid: State["grid"]) => {
  const rowsToMove = removedGrid.reduce((acc: (number | null)[][], row) => {
    if (row.some((cell) => cell)) {
      acc.push(row);
    }
    return acc;
  }, []);

  const newGrid = createGrid();

  const insertRowIndex = ROWS - rowsToMove.length;

  rowsToMove.forEach((row, index) => {
    newGrid[insertRowIndex + index] = row;
  });

  return newGrid;
};


/**
 * Clear full rows, move pieces to the bottom and update score
 * @param state 
 * @returns updated state 
 */
export function clearCompleteRows(state: State) {
  const fullRows = getFullRows(state.grid);

  if (fullRows.length > 0) {
    const removedGrid = removeRows(fullRows, state.grid);
    const newGrid = moveRowsToBottom(removedGrid);

    return {
      grid: newGrid,
      score: state.score + scorePerRow * fullRows.length,
    };
  }

  return state;
}

/**
 * Move the current piece 1 unit down
 * @param state 
 * @returns updated state
 */
export function fallCurrentPiece(state: State) {
  const current = state.current;

  if (current) {
    const y = current.y + 1; // next position

    // there's a block, can't fall
    if (getGridCell(y, current.x, state.grid)) {
      return state;
    }
    // if there's space to fall
    if (y <= 19) {
      return { current: { ...current, y } };
    }
  }

  return state;
}

/**
 * Move the current piece on player input
 * @param input keyboard input
 * @returns 
 */
export const moveCurrentPiece = (input: KeyboardInput) => (state: State) => {
  const current = state.current;
  const grid = state.grid;

  if (current) {
    if (input.left) {
      const x = current.x - 1;

      // don't move if there's a block on that position
      if (getGridCell(current.y, x, grid)) return state;

      // don't move past the left limit
      if (x >= 0) {
        return { current: { ...current, x } };
      }
    }

    if (input.right) {
      const x = current.x + 1;

      if (getGridCell(current.y, x, grid)) return state;

      // don't move past the right limit
      if (x <= 9) {
        return { current: { ...current, x } };
      }
    }

    if (input.down) {
      const y = current.y + 1;

      if (getGridCell(y, current.x, grid)) return state;

      // don't move below the bottom limit
      if (y <= 19) {
        return { current: { x: current.x, y } };
      }
    }
  }

  return state;
}
