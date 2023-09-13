import { State } from "./store";
import { scorePerRow, ROWS, COLS } from "./constants";
import { KeyboardInput, CurrentPiece, Grid } from "./types";

const pieceO = [
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieceI = [
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
];

const pieceT = [
  { x: 4, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieceZ = [
  { x: 3, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieceS = [
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
];

const pieceL = [
  { x: 5, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieceJ = [
  { x: 3, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieces = [pieceO, pieceI, pieceT, pieceZ, pieceS, pieceL, pieceJ];

const getRandomPieceIndex = () => {
  return Math.round(Math.random() * (pieces.length - 1));
};

/**
 * Spawns the current piece
 * @param state
 * @returns updated state
 */
export function spawn(state: State) {
  const index = getRandomPieceIndex();

  return state.current === null
    ? { current: pieces[index], currentPieceId: index + 1 }
    : state;
}

const getGridCell = (row: number, col: number, grid: Grid) => {
  if (grid[row] && grid[row][col]) {
    return grid[row][col];
  }

  return null;
};

const moveDown = (piece: CurrentPiece) => {
  return piece.map((pos) => {
    const y = pos.y + 1;
    return { ...pos, y };
  });
};

const isPieceBlocked = (piece: CurrentPiece, grid: Grid) => {
  return piece.some((pos) => getGridCell(pos.y, pos.x, grid));
};

const getMaxY = (piece: CurrentPiece) => {
  return piece.reduce((max, pos) => {
    if (pos.y > max) return pos.y;
    return max;
  }, piece[0].y);
};

const moveLeft = (current: CurrentPiece) => {
  return current.map((pos) => {
    const x = pos.x - 1;
    return { ...pos, x };
  });
};

const moveRight = (current: CurrentPiece) => {
  return current.map((pos) => {
    const x = pos.x + 1;
    return { ...pos, x };
  });
};

const getMinX = (piece: CurrentPiece) => {
  return piece.reduce((min, pos) => {
    if (pos.x < min) return pos.x;
    return min;
  }, piece[0].x);
};

const getMaxX = (piece: CurrentPiece) => {
  return piece.reduce((max, pos) => {
    if (pos.x > max) return pos.x;
    return max;
  }, piece[0].x);
};

const rotateClockwise = (piece: CurrentPiece) => {};

/**
 * Place the current block on the grid, removing the current piece
 * @param state
 * @returns updated state
 */
export function placeCurrentBlock(state: State) {
  const current = state.current;
  const grid = state.grid;

  if (current) {
    const next = moveDown(current);

    if (isPieceBlocked(next, state.grid) || getMaxY(current) === ROWS - 1) {
      const newGrid = [...grid];

      current.forEach((pos) => {
        newGrid[pos.y] = [...newGrid[pos.y]];
        newGrid[pos.y][pos.x] = state.currentPieceId;
      });

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

const getFullRows = (grid: Grid) => {
  return grid.reduce((acc: number[], row, index) => {
    if (row.every((cell) => !!cell)) {
      acc.push(index);
    }

    return acc;
  }, []);
};

const removeRows = (rows: number[], grid: Grid): Grid => {
  const removeGrid = [...grid];

  rows.forEach((row) => {
    removeGrid[row] = NullArray(COLS);
  });

  return removeGrid;
};

const moveRowsToBottom = (removedGrid: Grid) => {
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
    const next = moveDown(current);

    // there's a block, can't fall
    if (isPieceBlocked(next, state.grid)) {
      return state;
    }
    // if there's space to fall
    if (getMaxY(next) <= ROWS - 1) {
      return { current: next };
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
      const next = moveLeft(current);

      // don't move if there's a block on that position
      if (isPieceBlocked(next, grid)) return state;

      // don't move past the left limit
      if (getMinX(next) >= 0) {
        return { current: next };
      }
    }

    if (input.right) {
      const next = moveRight(current);

      if (isPieceBlocked(next, grid)) return state;

      // don't move past the right limit
      if (getMaxX(next) <= COLS - 1) {
        return { current: next };
      }
    }

    if (input.down) {
      const next = moveDown(current);

      if (isPieceBlocked(next, grid)) return state;

      // don't move below the bottom limit
      if (getMaxY(next) <= ROWS - 1) {
        return { current: next };
      }
    }
  }

  return state;
};
