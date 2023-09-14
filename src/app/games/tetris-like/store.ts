import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import { KeyboardInput, CurrentPiece, Grid } from "./types";
import {
  placeCurrentBlock,
  spawn,
  createGrid,
  clearCompleteRows,
  fallCurrentPiece,
  moveCurrentPiece,
  rotateClockwise,
} from "./game";

export interface State {
  status: "idle" | "started" | "paused" | "gameover";
  score: number;
  grid: Grid;
  current: CurrentPiece | null;
  currentPieceId: number | null;
}

export interface Actions {
  input: (input: KeyboardInput) => void;
  start: () => void;
  pause: () => void;
  move: (input: KeyboardInput) => void;
  reset: () => void;
  rotateClockwise: () => void;
}

const getInitialState = (): State => ({
  status: "idle",
  score: 0,
  grid: createGrid(),
  current: null,
  currentPieceId: null
});

const store: StateCreator<State & Actions> = (set, get) => {
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

      if (input.up) get().rotateClockwise();

      get().move(input);
    },

    start: () => {
      set({ status: "started" });

      set(spawn);

      // game loop
      interval = setInterval(() => {
        set(placeCurrentBlock);

        set(clearCompleteRows);

        set(fallCurrentPiece);

        set(spawn);
      }, 1000);
    },
    move: (input) => {
      if (get().status !== "started") return;

      set(moveCurrentPiece(input));
    },
    rotateClockwise: () => {
      set(rotateClockwise)
    },
    pause: () => {
      set({ status: "paused" });
      clearInterval(interval);
    },
    reset: () => {
      set(getInitialState());
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
