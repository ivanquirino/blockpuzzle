import { GameInput } from "./types";

export const ROWS = 22;
export const COLS = 10;

export const baseSize = 4;
export const baseWidth = baseSize * COLS;
export const baseHeight = baseSize * (ROWS - 2);

export const idleInput: GameInput = {
  left: false,
  right: false,
  down: false,
  start: false,
  up: false
};

export const acceptedKeys = ["ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "ArrowUp"];

export const scorePerRow = 100;

export const initialTimeStep = 1000;
