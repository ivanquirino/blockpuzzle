export interface KeyboardInput {
  left: boolean;
  right: boolean;
  down: boolean;
  enter: boolean;
  up: boolean;
}

export interface Block {
  x: number;
  y: number;
  size: number;
  color: number;
}

export type CurrentPiece = { x: number; y: number }[];

export type Grid = (number | null)[][];
