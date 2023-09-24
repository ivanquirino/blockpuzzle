import React from "react";
import { Block } from "../types";
import styles from "./UnitBlock.module.css";
import { css } from "@stitches/react";

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

  const animation = css({
    transition: "transform 60ms linear",
    transform: `translate(${x * size}px, ${y * size}px)`,
  });

  const classes = `bg-white 
  rounded 
  aspect-square 
  absolute 
  unit-block 
  z-30
  top-0
  left-0
  ${styles.unitBlock} 
  ${colors[color]}
  ${blockStyle}
  ${animation}`;

  return <div className={classes} />;
}

export default UnitBlock;

export const GridUnitBlock = React.memo(UnitBlock);
