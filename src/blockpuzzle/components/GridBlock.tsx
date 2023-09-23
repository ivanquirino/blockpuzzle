import { Block } from "../types";
import React from "react";
import { css } from "@stitches/react";

type GridBlockProps = Omit<Block, "color">;

function GridBlock(props: GridBlockProps) {
  const { x, y, size } = props;

  const blockPosition = css({
    left: x * size,
    top: y * size,
    width: size,
    height: size,
  });

  const classes = `bg-transparent 
    aspect-square 
    border-[1px]
    border-white
    absolute z-0
    opacity-10
    ${blockPosition}`;

  return <div className={classes} />;
}

export default React.memo(GridBlock);
