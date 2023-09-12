import { KeyboardInput } from "./types";

export const ROWS = 20;
export const COLS = 10;

export const baseSize = 4;
export const baseWidth = baseSize * COLS;
export const baseHeight = baseSize * ROWS;

export const idleInput: KeyboardInput = {
  left: false,
  right: false,
  down: false,
  enter: false,
};

export const acceptedKeys = ["ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
