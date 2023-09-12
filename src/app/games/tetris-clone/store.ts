import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import { KeyboardInput } from "./types";
import { COLS, ROWS, scorePerRow } from "./constants";

export interface State {
  status: "idle" | "started" | "paused" | "gameover";
  score: number;
  grid: (number | null)[][];
  current: { x: number; y: number } | null;
}

export interface Actions {
  input: (input: KeyboardInput) => void;
  start: () => void;
  pause: () => void;
  move: (input: KeyboardInput) => void;
  reset: () => void;
}

const NullArray = (length: number) => {
  const row = [];

  for (let j = 0; j < length; j++) {
    row.push(null);
  }

  return row;
};

const createGrid = () => {
  const grid = [];

  for (let i = 0; i < ROWS; i++) {
    grid.push(NullArray(COLS));
  }

  return grid as (null | number)[][];
};

const getInitialState = (): State => ({
  status: "idle",
  score: 0,
  grid: createGrid(),
  current: null,
});

const store: StateCreator<State & Actions> = (set, get) => {
  const getGridCell = (row: number, col: number, grid: State["grid"]) => {
    if (grid[row] && grid[row][col]) {
      return grid[row][col];
    }

    return null;
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

  const spawn = () => {
    set((state) =>
      state.current === null ? { current: { x: 4, y: 0 } } : state
    );
  };

  let interval: any;

  return {
    ...getInitialState(),

    input: (input) => {
      const status = get().status;

      if (input.enter && status === "idle") {
        get().start();
      }
      if (input.enter && status === "started") {
        get().pause();
      }
      if (input.enter && status === "paused") {
        get().start();
      }
      if (input.enter) return;

      get().move(input);
    },

    start: () => {
      set({ status: "started" });      

      spawn();

      // game loop
      interval = setInterval(() => {
        // place the current block on the grid
        set((state) => {
          const current = state.current;
          const grid = state.grid;

          if (current) {
            if (
              getGridCell(current.y + 1, current.x, grid) ||
              current.y === 19
            ) {
              const newGrid = [...grid];

              newGrid[current.y] = [...grid[current.y]];

              newGrid[current.y][current.x] = 1;
              
              return { grid: newGrid, current: null };
            }
          }

          return state;
        });

        // clear complete rows
        const fullRows = getFullRows(get().grid);

        if (fullRows.length > 0) {
          set((state) => {
            const removedGrid = removeRows(fullRows, state.grid);
            const newGrid = moveRowsToBottom(removedGrid);

            return { grid: newGrid, score: state.score + scorePerRow * fullRows.length };
          });
        }

        // fall current piece 1 unit
        set((state) => {
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
        });

        spawn();
      }, 1000);
    },
    move: (input) => {
      if (get().status !== "started") return;

      set((state) => {
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
      });
    },
    pause: () => {
      set({ status: "paused" });
      clearInterval(interval);
    },
    reset: () => {
      set(getInitialState())
    }
  };
};

export const enhancedStore = createStore(
  devtools(store, {
    store: "tetris",
    enabled: process.env.NODE_ENV !== "production",
  })
);

export const useGameStore = <U>(selector: (state: State & Actions) => U) =>
  useStore(enhancedStore, selector);
