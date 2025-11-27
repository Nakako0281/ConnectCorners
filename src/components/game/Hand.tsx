import React from 'react';
import { Piece, PlayerColor } from '@/lib/game/types';
import { PieceView } from './Piece';
import { cn } from '@/lib/utils';

interface HandProps {
    pieces: Piece[];
    playerColor: PlayerColor;
    selectedPieceId: string | null;
    onSelectPiece: (piece: Piece) => void;
}

import { useSoundContext } from '@/contexts/SoundContext';

export const Hand = React.memo(({ pieces, playerColor, selectedPieceId, onSelectPiece }: HandProps) => {
    const { playPickup } = useSoundContext();

    const handleSelect = (piece: Piece) => {
        playPickup();
        onSelectPiece(piece);
    };

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg min-h-[100px] items-start content-start">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className={cn(
                        "cursor-pointer p-2 rounded hover:bg-slate-200 transition-all",
                        selectedPieceId === piece.id ? "ring-2 ring-offset-1 ring-slate-400 bg-slate-200" : ""
                    )}
                    onClick={() => handleSelect(piece)}
                >
                    <PieceView shape={piece.shape} color={playerColor} cellSize={12} />
                </div>
            ))}
            {pieces.length === 0 && (
                <div className="text-slate-400 text-sm italic w-full text-center py-4">No pieces left</div>
            )}
        </div>
    );
});
