import classNames from "classnames";
import { Block } from "../types";

type GridBlockProps = Omit<Block, "color">;

function GridBlock(props: GridBlockProps) {
  const { x, y, size } = props;

  const classes = classNames(
    "bg-transparent aspect-square border-[1px] border-white absolute z-0 opacity-10",
  );

  return (
    <div
      style={{
        left: x * size,
        top: y * size,
        width: size,
        height: size,
      }}
      className={classes}
    />
  );
}

export default GridBlock;
