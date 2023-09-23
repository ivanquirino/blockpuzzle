import { GameInput } from "./types";

export const SPAWN_ROWS = 3;
export const ROWS = 20 + SPAWN_ROWS;
export const COLS = 10;

export const baseSize = 4;
export const baseWidth = baseSize * COLS;
export const baseHeight = baseSize * (ROWS - SPAWN_ROWS);

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
