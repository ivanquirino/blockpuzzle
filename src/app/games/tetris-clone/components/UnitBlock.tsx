import classNames from "classnames";
import { Block } from "../types";

function UnitBlock(props: Block) {
  const { x, y, size } = props;

  const classes = classNames(
    "bg-white rounded aspect-square border-solid border-red-700 border-[2px] absolute",    
  );

  return (
    <div
      style={{ left: x, top: y, width: size, height: size }}
      className={classes}
    />
  );
}

export default UnitBlock;
