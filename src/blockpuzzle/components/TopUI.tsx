import { idleInput } from "../constants";
import { pieces } from "../game";
import { useGameStore } from "./GameClient";
import { CurrentPiece, PieceId } from "../types";
import UnitBlock from "./UnitBlock";
import { useEffect } from "react";
import MenuDialog from "./MenuDialog";

function translatePieceToOrigin(piece: CurrentPiece) {
  const [minX, minY] = piece.reduce(
    (acc, pos) => {
      if (pos.x < acc[0]) {
        acc[0] = pos.x;
      }
      if (pos.y < acc[1]) {
        acc[1] = pos.y;
      }

      return acc;
    },
    [piece[0].x, piece[0].y]
  );

  return piece.map(({ x, y }) => {
    return { x: x - minX, y: y - minY };
  });
}

export const PieceDisplay = ({
  piece,
  pieceId,
  blockSize,
}: {
  piece: CurrentPiece;
  pieceId: PieceId;
  blockSize: number;
}) => {
  const translated = translatePieceToOrigin(piece);

  return translated.map(({ x, y }) => (
    <UnitBlock key={`${y}${x}`} x={x} y={y} size={16} color={pieceId} />
  ));
};

const TopUI = () => {
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const next = useGameStore((state) => state.spawnBag[0]);
  const openMenu = useGameStore((state) => state.openMenu);
  const pause = useGameStore((state) => state.pause);

  const nextPiece = pieces[next] ?? [];

  useEffect(() => {
    const handleBlur = () => {
      pause();
    };
    window.addEventListener("blur", handleBlur);
  }, [pause]);

  return (
    <div className="my-2 flex justify-between items-center">
      <div>SCORE {score}</div>
      <div>LV {level}</div>
      
      <div className="flex items-center">
      <div className="mr-2">NEXT</div>
        <div className="relative w-[64px] h-[32px]">
          {nextPiece.length > 0 && (
            <PieceDisplay piece={nextPiece} pieceId={next} blockSize={16} />
          )}
        </div>
      </div>
      <button
        className="rounded border-white border-[1px] px-1 active:bg-white active:text-black transition select-none hover:underline"
        onClick={() => openMenu(true)}
      >
        MENU
      </button>
      
      <MenuDialog />
    </div>
  );
};

export default TopUI;
