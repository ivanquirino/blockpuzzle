import classNames from "classnames";
import { Block } from "../types";
import styles from "./UnitBlock.module.css";

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

  const classes = classNames(
    "bg-white rounded aspect-square border-[4px] absolute unit-block",
    styles.unitBlock,
    colors[color]
  );

  return (
    <div
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      className={classes}
    />
  );
}

export default UnitBlock;
