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
    left: x * size,
    top: y * size,
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

  return <div className={classes} />;
}

export default UnitBlock;
