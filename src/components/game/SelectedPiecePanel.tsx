import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, FlipHorizontal } from 'lucide-react';
import { PieceView } from './Piece';
import { PlayerColor } from '@/lib/game/types';

interface SelectedPiecePanelProps {
    selectedPiece: any; // Using any to avoid complex type imports if not strictly needed, but better to use Piece type
    previewShape?: number[][];
    color: PlayerColor;
    isMyTurn: boolean;
    onRotate: () => void;
    onFlip: () => void;
}

import { useSoundContext } from '@/contexts/SoundContext';

export const SelectedPiecePanel = React.memo(({ selectedPiece, previewShape, color, isMyTurn, onRotate, onFlip }: SelectedPiecePanelProps) => {
    const { playRotate } = useSoundContext();

    const handleRotate = () => {
        playRotate();
        onRotate();
    };

    const handleFlip = () => {
        playRotate(); // Use same sound for now, or add playFlip if available
        onFlip();
    };

    return (
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center gap-4 flex-shrink-0">
            <h3 className="font-semibold text-slate-300 uppercase tracking-wider text-sm">Selected Piece</h3>
            <div className="p-4 bg-black/20 rounded-lg border border-white/5 h-[140px] w-full flex items-center justify-center shadow-inner">
                {isMyTurn && selectedPiece && previewShape ? (
                    <div className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        <PieceView
                            shape={previewShape}
                            color={color}
                            cellSize={20}
                        />
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm italic">Select a piece from your hand</div>
                )}
            </div>
            <div className="flex gap-2 w-full">
                <Button
                    className="flex-1 glass-button text-slate-200"
                    variant="ghost"
                    onClick={handleRotate}
                    disabled={!selectedPiece || !isMyTurn}
                >
                    <RotateCw className="w-4 h-4 mr-2" /> Rotate
                </Button>
                <Button
                    className="flex-1 glass-button text-slate-200"
                    variant="ghost"
                    onClick={handleFlip}
                    disabled={!selectedPiece || !isMyTurn}
                >
                    <FlipHorizontal className="w-4 h-4 mr-2" /> Flip
                </Button>
            </div>
        </div>
    );
});
