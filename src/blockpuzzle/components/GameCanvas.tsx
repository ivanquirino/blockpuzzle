import React, { useEffect, useRef } from "react";
import { GameDimensionsProps } from "../types";
import { store } from "./GameClient";
import { SPAWN_ROWS } from "../constants";

const colors = [
  "rgba(0,0,0,0)",
  "rgba(204,0,175)",
  "rgba(255,0,0)",
  "rgba(0,174,174)",
  "rgba(254,179,0)",
  "rgba(115,8,165)",
  "rgba(0,0,255)",
  "rgba(0,255,0)",
];

const gridWhite = "rgba(255,255,255, 0.1)"

const createBlockDrawer = (
  ctx: CanvasRenderingContext2D,
  blockSize: number
) => {
  const borderWidth = blockSize / 4;

  return (color: string, x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = color;
    ctx.roundRect(x, y, w, h, 4);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0, 0.0)";
    ctx.fillStyle = "rgba(0,0,0, 0.2)";
    ctx.rect(
      x + borderWidth,
      y + borderWidth,
      w - borderWidth * 2,
      h - borderWidth * 2
    );
    ctx.fill();
    ctx.stroke();
  };
};

function GameCanvas({ width, height, blockSize }: GameDimensionsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current;
    const bgCtx = bgCanvas?.getContext("2d");
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas?.getContext("2d");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (bgCtx) {
      store.getState().grid.forEach((row, y) =>
        row.forEach((_, x) => {
          if (y > 1) {
            bgCtx.strokeStyle = gridWhite
            bgCtx.strokeRect(x * blockSize, (y - SPAWN_ROWS)*blockSize, blockSize, blockSize)
          }
        })
      );
    }

    if (gridCtx && ctx) {
      const gridDrawBlack = createBlockDrawer(gridCtx, blockSize);
      const drawBlock = createBlockDrawer(ctx, blockSize);

      const unsub = store.subscribe((state, prevState) => {
        const grid = state.grid;
        const prevGrid = prevState.grid;
        const current = state.current;
        const prevCurrent = prevState.current;
        const currentPieceId = state.currentPieceId;

        if (grid !== prevGrid) {
          const render = () => {
            gridCtx.clearRect(0, 0, width, height);

            grid.forEach((row, y) =>
              row.forEach((col, x) => {
                if (y > 1 && col) {
                  gridDrawBlack(
                    colors[col],
                    x * blockSize,
                    (y - SPAWN_ROWS) * blockSize,
                    blockSize,
                    blockSize
                  );
                }
              })
            );
          };

          requestAnimationFrame(render);
        }

        if (current !== prevCurrent && ctx) {
          const render = () => {
            ctx.clearRect(0, 0, width, height);

            current?.forEach(({ x, y }, i) => {
              if (y > 1 && currentPieceId) {
                drawBlock(
                  colors[currentPieceId],
                  x * blockSize,
                  (y - SPAWN_ROWS) * blockSize,
                  blockSize,
                  blockSize
                );
              }
            });
          };

          requestAnimationFrame(render);
        }
      });

      return unsub;
    }
  }, [blockSize, width, height]);

  return (
    <>
      <canvas
        ref={bgCanvasRef}
        className="absolute"
        width={width}
        height={height}
      />
      <canvas
        ref={gridCanvasRef}
        className="absolute"
        width={width}
        height={height}
      />
      <canvas
        ref={canvasRef}
        className="absolute"
        width={width}
        height={height}
      />
    </>
  );
}

export default React.memo(GameCanvas);
