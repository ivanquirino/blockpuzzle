import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import {
  GameInput,
  CurrentPiece,
  Grid,
  PieceId,
  GameCallbacks,
} from "./types";
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
  input: (input: GameInput) => void;
  start: () => void;
  pause: () => void;
  move: (input: GameInput) => void;
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

const store: (callbacks: GameCallbacks) => StateCreator<State & Actions> =
  (callbacks) => (set, get) => {
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

        if (input.start && status === "idle") {
          get().start();
        }
        if (input.start && status === "started") {
          get().pause();
        }
        if (input.start && status === "paused") {
          get().start();
        }
        if (input.start && status === "gameover") {
          get().reset();
        }
        if (input.start) return;

        if (input.up) get().rotateClockwise();

        get().move(input);
      },

      start: async () => {
        set({ status: "started" });
        callbacks.onStart();

        generatePieceSet();
        set(spawn);
        // game loop

        while (get().status === "started") {
          let prevGrid = get().grid;
          set(placeCurrentBlock);
          if (prevGrid !== get().grid) {
            callbacks.onLanding();
          }

          prevGrid = get().grid;
          set(clearCompleteRows);
          if (prevGrid !== get().grid) {
            callbacks.onClear();
          }

          let prevLvl = get().level;
          set(updateLevel);
          if (prevLvl !== get().level) {
            callbacks.onLevelUp();
          }

          if (isGameOver(get())) {
            set({ status: "gameover" });
            clearInterval(interval);
            callbacks.onGameOver();
            return;
          }

          set(fallCurrentPiece);

          set(spawn);

          generatePieceSet();

          const level = get().level;
          let timeStep = 1000 - (level - 1) * 100;
          if (timeStep < 100) timeStep = 100;

          await timeout(timeStep);
        }
      },
      move: (input) => {
        if (get().status !== "started") return;

        const prev = get().current;
        set(moveCurrentPiece(input));

        if ((input.left || input.right) && prev != get().current) {
          callbacks.onMove();
        }
      },
      rotateClockwise: () => {
        if (get().status !== "started") return;

        const prev = get().current;
        set(rotateClockwise);

        if (prev !== get().current) {
          callbacks.onRotate();
        }
      },
      pause: () => {
        if (get().status !== "started") return;

        set({ status: "paused" });
        clearInterval(interval);
        callbacks.onPause();
      },
      reset: () => {
        set({ ...getInitialState(), status: "idle" });
      },
      ready: () => {
        set({ status: "idle" });
      },
    };
  };

export const storeFactory = (callbacks: GameCallbacks) => {
  const enhancedStore = createStore(
    devtools(store(callbacks), {
      enabled: process.env.NODE_ENV !== "production",
    })
  );

  const useGameStore = <U>(selector: (state: State & Actions) => U) =>
    useStore(enhancedStore, selector);

  return { store: enhancedStore, useGameStore };
};
