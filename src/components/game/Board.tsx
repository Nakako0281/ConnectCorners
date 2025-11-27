import React from 'react';
import { BoardState, PlayerColor, Coordinate } from '@/lib/game/types';
import { cn } from '@/lib/utils';
import {
  BOARD_SIZE,
  BONUS_SQUARES
} from '@/lib/game/constants';
import { Star } from 'lucide-react';

interface BoardProps {
  id?: string;
  board: BoardState;
  onCellClick: (pos: Coordinate) => void;
  onCellHover?: (pos: Coordinate) => void;
  previewShape?: number[][];
  previewPos?: Coordinate | null;
  previewColor?: PlayerColor;
  isValidPreview?: boolean;
  startPositions?: Record<PlayerColor, Coordinate>;
  onContextMenu?: () => void;
}

const COLOR_MAP: Record<PlayerColor, string> = {
  BLUE: 'bg-blue-500/80',
  YELLOW: 'bg-yellow-400/80',
  RED: 'bg-red-500/80',
  GREEN: 'bg-green-500/80',
  LIGHTBLUE: 'bg-sky-400/80',
  PINK: 'bg-pink-400/80',
  ORANGE: 'bg-orange-500/80',
  PURPLE: 'bg-purple-500/80',
};

const BoardCell = React.memo(({
  r,
  c,
  cell,
  isPreview,
  startColor,
  previewColor,
  isValidPreview,
  onClick,
  onHover
}: {
  r: number;
  c: number;
  cell: PlayerColor | null;
  isPreview: boolean;
  startColor: PlayerColor | null;
  previewColor?: PlayerColor;
  isValidPreview?: boolean;
  onClick: (pos: Coordinate) => void;
  onHover?: (pos: Coordinate) => void;
}) => {
  const isBonus = !cell && BONUS_SQUARES.some(bs => bs.x === c && bs.y === r);

  return (
    <div
      className="w-6 h-6 border-[0.5px] border-white/10 relative"
      onClick={() => onClick({ x: c, y: r })}
      onMouseEnter={() => onHover?.({ x: c, y: r })}
    >
      {/* Background/Empty Cell */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Bonus Star */}
      {isBonus && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Start Position Indicator */}
      {startColor && !cell && (
        <div className={cn(
          "absolute inset-0 m-1 rounded-full opacity-100",
          COLOR_MAP[startColor].split(' ')[0]
        )} />
      )}

      {/* Placed Piece */}
      {cell && (
        <div
          className={cn(
            "absolute inset-0 border-white/10 border-[0.5px]",
            COLOR_MAP[cell]
          )}
        />
      )}

      {/* Preview Overlay */}
      {isPreview && previewColor && (
        <div className={cn(
          "absolute inset-0 z-10",
          isValidPreview
            ? `opacity - 50 ${COLOR_MAP[previewColor]} `
            : "bg-red-400 opacity-50"
        )} />
      )}
    </div>
  );
}, (prev, next) => {
  return (
    prev.cell === next.cell &&
    prev.isPreview === next.isPreview &&
    prev.isValidPreview === next.isValidPreview &&
    prev.previewColor === next.previewColor &&
    prev.startColor === next.startColor
  );
});

export const Board: React.FC<BoardProps> = ({
  id,
  board,
  onCellClick,
  onCellHover,
  previewShape,
  previewPos,
  previewColor,
  isValidPreview,
  startPositions,
  onContextMenu
}) => {

  const isPreviewCell = (r: number, c: number) => {
    if (!previewShape || !previewPos) return false;
    const localR = r - previewPos.y;
    const localC = c - previewPos.x;
    if (localR >= 0 && localR < previewShape.length && localC >= 0 && localC < previewShape[0].length) {
      return previewShape[localR][localC] === 1;
    }
    return false;
  };

  const isStartCell = (r: number, c: number) => {
    if (!startPositions) return null;
    for (const [color, pos] of Object.entries(startPositions)) {
      if (pos.y === r && pos.x === c) return color as PlayerColor;
    }
    return null;
  };

  return (
    <div
      id={id}
      className="inline-grid bg-white/5 backdrop-blur-md p-1 rounded-xl shadow-2xl border border-white/20"
      style={{
        gridTemplateColumns: `repeat(${board.length}, 24px)`,
      }}
      onMouseLeave={() => onCellHover?.({ x: -1, y: -1 })}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.();
      }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => {
          const isPreview = isPreviewCell(r, c);
          const startColor = isStartCell(r, c);

          return (
            <BoardCell
              key={`${r} -${c} `}
              r={r}
              c={c}
              cell={cell}
              isPreview={isPreview}
              startColor={startColor}
              previewColor={previewColor}
              isValidPreview={isValidPreview}
              onClick={onCellClick}
              onHover={onCellHover}
            />
          );
        })
      ))}
    </div>
  );
};
