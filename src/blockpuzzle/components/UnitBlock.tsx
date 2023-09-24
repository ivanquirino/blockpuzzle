import React, { useLayoutEffect, useRef } from "react";
import { Block } from "../types";
import styles from "./UnitBlock.module.css";
import { css } from "@stitches/react";
import { tween } from "shifty";
import { COLS } from "../constants";

const colors = [
  "null",
  styles.O,
  styles.I,
  styles.T,
  styles.Z,
  styles.S,
  styles.L,
  styles.J,
];

function UnitBlock(props: Block) {
  const { x, y, size, color } = props;

  const blockStyle = css({
    width: size,
    height: size,
    borderWidth: size / 4,
  });

  const classes = `bg-white 
  rounded 
  aspect-square 
  absolute 
  unit-block 
  z-40
  ${styles.unitBlock} 
  ${colors[color]}
  ${blockStyle}`;

  const ref = useRef<HTMLDivElement>(null);
  const prevY = useRef<number>(y);
  const prevX = useRef<number>(x);

  useLayoutEffect(() => {
    tween({
      from: { y: prevY.current * size, x: prevX.current * size },
      to: { y: y * size, x: x * size },
      duration: 50,
      easing: "linear",
      render: ({ y: y1, x: x1 }) => {
        ref.current?.style.setProperty("top", `${y1 as number}px`);
        ref.current?.style.setProperty("left", `${x1 as number}px`);
      },
    }).then((p) => {
      prevY.current = y;
      prevX.current = x;
      return p;
    });
  }, [x, y, size]);

  return <div ref={ref} className={classes} data-key={`c-${y * COLS + x}`} />;
}

export default UnitBlock;

export const GridUnitBlock = React.memo(UnitBlock);
