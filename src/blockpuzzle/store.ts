import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { useStore, StateCreator } from "zustand";
import {
  GameInput,
  CurrentPiece,
  Grid,
  PieceId,
  Status,
  SoundFx,
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
  getMaxY,
  isPieceBlocked,
  moveDown,
  getFallInterval,
} from "./game";
import { timeout } from "./tools";
import throttle from "lodash.throttle";
import { ROWS, timeStep } from "./constants";

export interface State {
  status: Status;
  score: number;
  level: number;
  grid: Grid;
  current: CurrentPiece | null;
  currentPieceId: PieceId | null;
  spawnBag: PieceId[];
  sound: { fx: SoundFx };
  menu: boolean;
  settings: { music: boolean; fx: boolean };
}

export interface Actions {
  input: (input: GameInput) => void;
  start: () => void;
  pause: () => void;
  move: (input: GameInput) => void;
  reset: () => void;
  rotateClockwise: () => void;
  ready: () => void;
  drop: () => void;
  update: (drop: boolean) => void;
  noopSound: () => void;
  openMenu: (open: boolean) => void;
  toggleMusic: () => void;
  toggleFx: () => void;
}

const getInitialState = (): State => ({
  status: "loading",
  score: 0,
  level: 1,
  grid: createGrid(),
  current: null,
  currentPieceId: null,
  spawnBag: [],
  sound: { fx: "noop" },
  menu: false,
  settings: { music: true, fx: true },
});

const store: () => StateCreator<State & Actions> = () => (set, get) => {
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

  const tMove = throttle((input: GameInput) => get().move(input), 30, { leading: true });

  const tDrop = throttle(() => get().drop(), 30, { leading: true });
  const tRotate = throttle(() => get().rotateClockwise(), 120, { leading: true });

  let timeElapsed = 0;
  let canPause = true;

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

      if (input.up) {
        tRotate();
      }
      if (input.down) tDrop();

      tMove(input);
    },
    update: (drop = false) => {
      // place
      let prevGrid = get().grid;
      set(placeCurrentBlock);
      if (prevGrid !== get().grid) {
        if (drop) {
          set({ sound: { fx: "drop" } });
        } else {
          set({ sound: { fx: "landing" } });
        }
      }

      //clear
      prevGrid = get().grid;
      set(clearCompleteRows);
      if (prevGrid !== get().grid) {
        set({ sound: { fx: "clear" } });
      }

      //update level
      let prevLvl = get().level;
      set(updateLevel);
      if (prevLvl !== get().level) {
        set({ sound: { fx: "lvup" } });
      }

      //check game over
      if (isGameOver(get())) {
        set({ status: "gameover" });
        return;
      }
    },
    start: async () => {
      set({ status: "started" });

      setTimeout(() => {
        // need to wait some time to pause again
        canPause = true;
      }, 3000);

      generatePieceSet();
      set(spawn);

      while (get().status === "started") {
        const fallInterval = getFallInterval(get().level);

        if (timeElapsed >= fallInterval) {
          get().update(false);
          set(fallCurrentPiece);
          set(spawn);
          generatePieceSet();

          timeElapsed = 0;
        }

        await timeout(timeStep).promise;
        timeElapsed += timeStep;
      }
    },
    move: (input) => {
      if (get().status !== "started") return;

      const prev = get().current;
      set(moveCurrentPiece(input));

      if ((input.left || input.right) && prev !== get().current) {
        set({ sound: { fx: "move" } });
      }
    },
    drop: () => {
      if (get().status !== "started") return;

      const current = get().current;

      if (current) {
        const next = moveDown(current);

        // if there's space to fall
        if (!isPieceBlocked(next, get().grid) && getMaxY(next) <= ROWS - 1) {
          set({ current: next });
          return;
        }

        get().update(true);
      }
    },
    rotateClockwise: () => {
      if (get().status !== "started") return;

      const prev = get().current;
      set(rotateClockwise);

      if (prev !== get().current) {
        set({ sound: { fx: "rotate" } });
      }
    },
    pause: () => {
      if (get().status !== "started") return;
      if (!canPause) return;

      set({ status: "paused" });
      canPause = false;
    },
    reset: () => {
      set({ ...getInitialState(), status: "idle" });
    },
    ready: () => {
      set({ status: "idle" });
    },
    noopSound: () => {
      set({ sound: { fx: "noop" } });
    },
    openMenu: (open) => {
      if (open) get().pause();

      set({ menu: open });
    },
    toggleMusic: () => {
      set((state) => ({
        settings: { ...state.settings, music: !state.settings.music },
      }));
    },
    toggleFx: () => {
      set((state) => ({
        settings: { ...state.settings, fx: !state.settings.fx },
      }));
    },
  };
};

export const storeFactory = () => {
  const enhancedStore = createStore(
    devtools(store(), {
      enabled: process.env.NODE_ENV !== "production",
    })
  );

  const useGameStore = <U>(selector: (state: State & Actions) => U) =>
    useStore(enhancedStore, selector);

  return { store: enhancedStore, useGameStore };
};
