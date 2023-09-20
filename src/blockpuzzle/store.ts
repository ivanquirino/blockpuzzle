import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import { KeyboardInput, CurrentPiece, Grid, PieceId } from "./types";
import {
  placeCurrentBlock,
  spawn,
  createGrid,
  clearCompleteRows,
  fallCurrentPiece,
  moveCurrentPiece,
  rotateClockwise,
  generateRandomPieceSet,
  isGameOver,
  updateLevel,
} from "./game";

export interface State {
  status: "loading" | "idle" | "started" | "paused" | "gameover";
  score: number;
  level: number;
  grid: Grid;
  current: CurrentPiece | null;
  currentPieceId: PieceId | null;
  spawnBag: PieceId[];
}

export interface Actions {
  input: (input: KeyboardInput) => void;
  start: () => void;
  pause: () => void;
  move: (input: KeyboardInput) => void;
  reset: () => void;
  rotateClockwise: () => void;
  ready: () => void;
}

const getInitialState = (): State => ({
  status: "loading",
  score: 0,
  level: 1,
  grid: createGrid(),
  current: null,
  currentPieceId: null,
  spawnBag: [],
});

const timeout = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const store: StateCreator<State & Actions> = (set, get) => {
  let interval: any;

  // this function has the random generator sideEffect
  // and can't be written as a function of state and input
  const generatePieceSet = () => {
    const { spawnBag } = get();

    if (spawnBag.length === 0) {
      const pieceSet = generateRandomPieceSet();
      const bag = Array.from(pieceSet);

      set({ spawnBag: bag });

      return bag;
    }

    return spawnBag;
  };

  return {
    ...getInitialState(),

    input: (input) => {
      const status = get().status;

      if (status === "loading") return;

      if (input.enter && status === "idle") {
        get().start();
      }
      if (input.enter && status === "started") {
        get().pause();
      }
      if (input.enter && status === "paused") {
        get().start();
      }
      if (input.enter && status === "gameover") {
        get().reset();
      }
      if (input.enter) return;

      if (input.up) get().rotateClockwise();

      get().move(input);
    },

    start: async () => {
      set({ status: "started" });

      generatePieceSet();
      set(spawn);
      // game loop

      while (get().status === "started") {
        set(placeCurrentBlock);

        set(clearCompleteRows);

        set(updateLevel)

        if (isGameOver(get())) {
          set({ status: "gameover" });
          clearInterval(interval);
          return;
        }

        set(fallCurrentPiece);

        set(spawn);

        generatePieceSet();

        const level = get().level;
        let timeStep = 1000 - ((level -1) * 100);
        if (timeStep < 100) timeStep = 100;

        await timeout(timeStep);
      }
    },
    move: (input) => {
      if (get().status !== "started") return;

      set(moveCurrentPiece(input));
    },
    rotateClockwise: () => {
      if (get().status !== "started") return;

      set(rotateClockwise);
    },
    pause: () => {
      if (get().status !== "started") return;

      set({ status: "paused" });
      clearInterval(interval);
    },
    reset: () => {
      set({ ...getInitialState(), status: "idle" });
    },
    ready: () => {
      set({ status: "idle" });
    },
  };
};

export const enhancedStore = createStore(
  devtools(store, {
    enabled: process.env.NODE_ENV !== "production",
  })
);

export const useGameStore = <U>(selector: (state: State & Actions) => U) =>
  useStore(enhancedStore, selector);
