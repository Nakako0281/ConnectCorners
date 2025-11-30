import React from 'react';
import { Player, PlayerColor } from '@/lib/game/types';
import { PieceView } from './Piece';
import { CHARACTERS } from '@/lib/game/characters';
import { TOTAL_SQUARES } from '@/lib/game/constants';

interface PlayerListProps {
    players: Player[];
    currentPlayerId?: string;
}

const COLOR_MAP: Record<PlayerColor, string> = {
    BLUE: 'bg-blue-500',
    YELLOW: 'bg-yellow-500',
    RED: 'bg-red-500',
    GREEN: 'bg-green-500',
    LIGHTBLUE: 'bg-sky-500',
    PINK: 'bg-pink-500',
    ORANGE: 'bg-orange-500',
    PURPLE: 'bg-purple-500',
};

const PlayerListComponent = ({ players, currentPlayerId }: PlayerListProps) => {
    return (
        <div className="flex flex-col gap-2 mt-4 border-t border-white/10 pt-4">
            <h3 className="font-semibold text-sm text-slate-400 mb-2 uppercase tracking-wider">Players</h3>
            {players.map(p => {
                const remainingSquares = p.pieces.reduce((acc, piece) => acc + piece.value, 0);
                const score = TOTAL_SQUARES - remainingSquares + (p.pieces.length === 0 ? 15 : 0) + (p.bonusScore || 0);
                const isCurrent = p.id === currentPlayerId;

                return (
                    <div key={p.id} className={`flex flex-col p-3 rounded-lg text-sm transition-all ${isCurrent ? 'bg-white/10 border border-white/20 shadow-lg' : 'bg-black/20 border border-transparent'} ${p.hasPassed ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 ${isCurrent ? 'border-white' : 'border-white/20'}`}>
                                    <img
                                        src={CHARACTERS[p.color].imagePath}
                                        alt={CHARACTERS[p.color].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className={`font-bold text-base ${p.hasPassed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                        {CHARACTERS[p.color].japaneseName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                                        {CHARACTERS[p.color].name}
                                    </span>
                                </div>
                                {p.hasPassed && <span className="text-xs text-red-400 font-bold ml-1">OUT</span>}
                                {isCurrent && <span className="text-xs text-blue-400 font-bold ml-1 animate-pulse">TURN</span>}
                            </div>
                            <span className="font-mono font-bold text-slate-300 text-lg">{score}</span>
                        </div>

                        {/* Remaining Pieces Grid */}
                        <div className="flex flex-wrap gap-1 mt-1">
                            {p.pieces.map(piece => (
                                <div key={piece.id} className="opacity-60 hover:opacity-100 transition-opacity">
                                    <PieceView
                                        shape={piece.shape}
                                        color={p.color}
                                        cellSize={4}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const PlayerList = React.memo(PlayerListComponent);
