import React from 'react';
import { cn } from '@/lib/utils';
import { PlayerColor } from '@/lib/game/types';
import { motion } from 'framer-motion';

interface PieceProps {
    shape: number[][];
    color: PlayerColor;
    cellSize?: number;
    className?: string;
    onClick?: () => void;
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
    BROWN: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
    SILVER: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]',
    GOLD: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]',
    BLACK: 'bg-gradient-to-br from-slate-600 via-slate-800 to-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
};

export const PieceView = React.memo(({ shape, color, cellSize = 20, className, onClick }: PieceProps) => {
    return (
        <div
            className={cn("grid transition-transform duration-100", className)}
            style={{
                gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${shape.length}, ${cellSize}px)`,
            }}
            onClick={onClick}
        >
            {shape.flat().map((cell, i) => (
                <div
                    key={i}
                    style={{ width: cellSize, height: cellSize }}
                    className={cn(
                        "transition-all duration-300",
                        cell === 1
                            ? cn(COLOR_MAP[color], "border-white/10 border-[0.5px]") // minimal border for grid separation
                            : "bg-transparent"
                    )}
                />
            ))}
        </div>
    );
});
