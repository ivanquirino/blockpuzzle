import { State } from "./store";
import { scorePerRow, ROWS, COLS } from "./constants";
import { KeyboardInput, CurrentPiece, Grid, PieceId } from "./types";

export const pieceO = [
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

export const pieceI = [
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
];

export const pieceT = [
  { x: 4, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

export const pieceZ = [
  { x: 3, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

export const pieceS = [
  { x: 4, y: 0 },
  { x: 5, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
];

export const pieceL = [
  { x: 5, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

export const pieceJ = [
  { x: 3, y: 0 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 5, y: 1 },
];

const pieces: Record<string, CurrentPiece> = {
  1: pieceO,
  2: pieceI,
  3: pieceT,
  4: pieceZ,
  5: pieceS,
  6: pieceL,
  7: pieceJ,
};

const getRandomPieceIndex = () => {
  return Math.round(Math.random() * 6) + 1;
};

/**
 * Spawns the current piece
 * @param state
 * @returns updated state
 */
export function spawn(state: State) {
  const index = getRandomPieceIndex() as PieceId;
  // const index = 6;
  const piece = pieces[index];

  return state.current === null
    ? { current: piece, currentPieceId: index }
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

const getCollisions = (piece: CurrentPiece, grid: Grid) => {
  const collisions = piece.reduce(
    (acc, pos) => {
      if (pos.y > ROWS - 1) {
        acc.down.push(pos);
      }
      if (pos.x > COLS - 1) {
        acc.right.push(pos);
      }
      if (pos.x < 0) {
        acc.left.push(pos);
      }
      if (getGridCell(pos.y, pos.x, grid)) {
        acc.blocks.push(pos)
      }

      return acc;
    },
    {
      blocks: [] as CurrentPiece,
      down: [] as CurrentPiece,
      left: [] as CurrentPiece,
      right: [] as CurrentPiece,
    }
  );
  return collisions;
};

const getMaxY = (piece: CurrentPiece) => {
  return piece.reduce((max, pos) => {
    if (pos.y > max) return pos.y;
    return max;
  }, piece[0].y);
};

const moveLeft = (current: CurrentPiece, units = 1) => {
  return current.map((pos) => {
    const x = pos.x - units;
    return { ...pos, x };
  });
};

const moveRight = (current: CurrentPiece, units = 1) => {
  return current.map((pos) => {
    const x = pos.x + units;
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

// piece block pivot index taken from testing
const pivotIndex = {
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 2,
  7: 2,
};

// Source for rotation algorithm
// https://www.alibabacloud.com/blog/the-use-of-vector-rotation-in-a-two-dimensional-space_599766

const rotationMatrix = [
  [0, 1],
  [-1, 0],
];

export const rotatePieceClockwise = (
  piece: CurrentPiece,
  pieceId: NonNullable<State["currentPieceId"]>
) => {
  if (pieceId === 1) return piece;

  const pivot = piece[pivotIndex[pieceId]];

  const translated = piece.map(({ x, y }) => {
    return { x: x - pivot.x, y: y - pivot.y };
  });

  const rotated = translated.map(({ x, y }) => {
    return {
      x: x * rotationMatrix[0][0] + y * rotationMatrix[1][0],
      y: x * rotationMatrix[0][1] + y * rotationMatrix[1][1],
    };
  });

  const translatedBack = rotated.map(({ x, y }) => {
    return { x: x + pivot.x, y: y + pivot.y };
  });

  return translatedBack;
};

const getMinMaxX = (piece: CurrentPiece) => {
  return piece.reduce(
    (acc, pos) => {
      if (pos.x < acc[0]) acc[0] = pos.x;
      if (pos.x > acc[1]) acc[1] = pos.x;
      return acc;
    },
    [piece[0].x, piece[0].x]
  );
}

export const rotateClockwise = (state: State) => {
  if (state.current && state.currentPieceId) {
    const rotated = rotatePieceClockwise(state.current, state.currentPieceId);

    let { blocks, left, right, down } = getCollisions(rotated, state.grid);

    let moved = rotated;

    if (blocks.length > 0) {
      const [minX, maxX] = getMinMaxX(rotated);
      const [minX1, maxX1] = getMinMaxX(blocks);

      const d1 = Math.abs(maxX1 - maxX);
      const d2 = Math.abs(maxX1 - minX);

      if (d1 < d2) {
        moved = moveLeft(rotated, blocks.length);
      }

      const d3 = Math.abs(minX - minX1);
      const d4 = Math.abs(maxX - minX1);

      if (d4 > d3) {
        moved = moveRight(rotated, blocks.length)
      }      
    }

    if (right.length > 0) {
      moved = moveLeft(moved, getMaxX(right) - (COLS -1));
    }

    if (left.length > 0) {
      moved = moveRight(moved, -getMinX(left));
    }

    if (down.length > 0) {
      moved = moveUp(moved, getMaxY(down) - (ROWS -1));
    }

    if (isPieceBlocked(moved, state.grid)) return state;
    return { current: moved };
  }

  return state;
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

  return grid as (PieceId | null)[][];
};

const getFullRows = (grid: Grid) => {
  return grid.reduce((acc: number[], row, index) => {
    if (row.every((cell) => cell)) {
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
  const rowsToMove = removedGrid.reduce((acc: (PieceId | null)[][], row) => {
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

const moveUp = (piece: CurrentPiece, units: number) => {
  return piece.map((pos) => {
    const y = pos.y - units;
    return { ...pos, y };
  });
};
