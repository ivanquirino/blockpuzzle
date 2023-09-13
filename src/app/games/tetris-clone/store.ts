import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import { KeyboardInput } from "./types";
import { COLS, ROWS, scorePerRow } from "./constants";
import {
  placeCurrentBlock,
  spawn,
  createGrid,
  clearCompleteRows,
  fallCurrentPiece,
  moveCurrentPiece,
} from "./game";
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

const getInitialState = (): State => ({
  status: "idle",
  score: 0,
  grid: createGrid(),
  current: null,
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
    store: "tetris",
    enabled: process.env.NODE_ENV !== "production",
  })
);

export const useGameStore = <U>(selector: (state: State & Actions) => U) =>
  useStore(enhancedStore, selector);
