export interface GameInput {
  left: boolean;
  right: boolean;
  down: boolean;
  start: boolean;
  up: boolean;
}

export interface Block {
  x: number;
  y: number;
  size: number;
  color: number;
}

export type PieceId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CurrentPiece = { x: number; y: number }[];

export type Grid = (PieceId | null)[][];

export type Status =
  | "loading"
  | "idle"
  | "started"
  | "paused"
  | "gameover"
  | "wait";

export type SoundFx =
  | "rotate"
  | "move"
  | "clear"
  | "lvup"
  | "gameover"
  | "landing"
  | "drop"
  | "noop";

export interface GameDimensionsProps {
  width: number;
  height: number;
  blockSize: number;
}
