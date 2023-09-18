import { useGameStore } from "../store";
import { pieces } from "../game";
import { CurrentPiece, PieceId } from "../types";
import UnitBlock from "./UnitBlock";

interface GameInfoProps {
  blockSize: number;
}

const GameInfo = ({ blockSize }: GameInfoProps) => {
  const score = useGameStore((state) => state.score);
  const current = useGameStore((state) => state.currentPieceId);
  const next = useGameStore((state) => state.spawnBag[0]);

  const currentPiece = (current && pieces[current]) ?? [];
  const nextPiece = pieces[next] ?? [];

  return (
    <div className="w-[200px]">
      <div className="mb-8">SCORE: {score}</div>
      <div className="mb-8">
        <div className="mb-4">CURRENT</div>
        <div
          className="relative"
          style={{ height: 2 * blockSize, width: 4 * blockSize }}
        >
          {current && (
            <PieceDisplay
              piece={currentPiece}
              pieceId={current}
              blockSize={blockSize}
            />
          )}
        </div>
      </div>
      <div>
        <div className="mb-4">NEXT</div>
        <div
          className="relative"
          style={{ height: 2 * blockSize, width: 4 * blockSize }}
        >
          {next && (
            <PieceDisplay
              piece={nextPiece}
              pieceId={next}
              blockSize={blockSize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;

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

const PieceDisplay = ({
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
    <UnitBlock key={`${y}${x}`} x={x} y={y} size={blockSize} color={pieceId} />
  ));
};
