import { KeyboardInput } from "./types";

export const ROWS = 22;
export const COLS = 10;

export const baseSize = 4;
export const baseWidth = baseSize * COLS;
export const baseHeight = baseSize * (ROWS - 2);

export const idleInput: KeyboardInput = {
  left: false,
  right: false,
  down: false,
  enter: false,
  up: false
};

export const acceptedKeys = ["ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "ArrowUp"];

export const scorePerRow = 100;
