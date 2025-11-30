import React from 'react';
import { Piece, PlayerColor } from '@/lib/game/types';
import { PieceView } from './Piece';
import { cn } from '@/lib/utils';

interface HandProps {
    pieces: Piece[];
    playerColor: PlayerColor;
    selectedPieceId: string | null;
    onSelectPiece: (piece: Piece) => void;
    canUseSpecial?: boolean;
}

import { useSoundContext } from '@/contexts/SoundContext';
import { Lock } from 'lucide-react';

export const Hand = React.memo(({ pieces, playerColor, selectedPieceId, onSelectPiece, canUseSpecial = true }: HandProps) => {
    const { playPickup } = useSoundContext();

    const handleSelect = (piece: Piece) => {
        if (piece.id === 'special' && !canUseSpecial) return;
        playPickup();
        onSelectPiece(piece);
    };

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg min-h-[100px] items-start content-start">
            {pieces.map((piece) => {
                const isSpecial = piece.id === 'special';
                const isLocked = isSpecial && !canUseSpecial;

                return (
                    <div
                        key={piece.id}
                        className={cn(
                            "cursor-pointer p-2 rounded hover:bg-slate-200 transition-all relative",
                            selectedPieceId === piece.id ? "ring-2 ring-offset-1 ring-slate-400 bg-slate-200" : "",
                            isLocked ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""
                        )}
                        onClick={() => handleSelect(piece)}
                    >
                        <PieceView shape={piece.shape} color={playerColor} cellSize={12} />
                        {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 rounded group">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    20ポイント以上で解放
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            {pieces.length === 0 && (
                <div className="text-slate-400 text-sm italic w-full text-center py-4">No pieces left</div>
            )}
        </div>
    );
});
