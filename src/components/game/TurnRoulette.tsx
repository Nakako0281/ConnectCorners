import React, { useEffect, useState, useRef } from 'react';
import { Player } from '@/lib/game/types';
import { CHARACTERS } from '@/lib/game/characters';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundContext } from '@/contexts/SoundContext';
import Image from 'next/image';

interface TurnRouletteProps {
    players: Player[];
    targetPlayerIndex: number;
    onComplete: () => void;
}

export const TurnRoulette: React.FC<TurnRouletteProps> = ({ players, targetPlayerIndex, onComplete }) => {
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const { playRouletteTick, playDecidedFirst } = useSoundContext();

    // Refs to manage animation loop
    const speedRef = useRef(50); // Initial speed (ms)
    const roundsRef = useRef(0);
    const minRounds = 3; // Minimum full rotations

    // Re-implementing with a recursive timeout pattern that has access to latest state/refs
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let currentIdx = 0;

        const runLoop = () => {
            // Calculate next index
            const nextIdx = (currentIdx + 1) % players.length;
            currentIdx = nextIdx;
            setHighlightedIndex(nextIdx);
            playRouletteTick();

            if (nextIdx === 0) {
                roundsRef.current += 1;
            }

            // Decelerate
            if (roundsRef.current >= minRounds) {
                speedRef.current = Math.floor(speedRef.current * 1.1); // Increase delay by 10%
            }

            // Stop condition
            if (roundsRef.current >= minRounds && speedRef.current > 300 && nextIdx === targetPlayerIndex) {
                // Stop spinning but wait before flashing
                setTimeout(() => {
                    setIsFinished(true);
                    playDecidedFirst();
                    setTimeout(onComplete, 2000); // Wait 2s of flashing before closing
                }, 500); // 0.5s pause after stopping before flash starts
                return;
            }
            timeoutId = setTimeout(runLoop, speedRef.current);
        };

        timeoutId = setTimeout(runLoop, speedRef.current);

        return () => clearTimeout(timeoutId);
    }, [players.length, targetPlayerIndex, onComplete, playRouletteTick, playDecidedFirst]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border-4 border-indigo-500/50"
            >
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 tracking-tight">
                    {isFinished ? "最初はこの人！" : "最初のプレイヤー抽選中…"}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {players.map((player, index) => {
                        const isSelected = index === highlightedIndex;
                        const isTarget = isFinished && index === targetPlayerIndex;

                        return (
                            <motion.div
                                key={player.id}
                                animate={
                                    isTarget ? {
                                        scale: [1.1, 1.15, 1.1],
                                        borderColor: ['#22c55e', '#86efac', '#22c55e'],
                                        backgroundColor: ['rgba(34, 197, 94, 0.1)', 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.1)'],
                                        boxShadow: ['0 0 0px rgba(34, 197, 94, 0)', '0 0 20px rgba(34, 197, 94, 0.5)', '0 0 0px rgba(34, 197, 94, 0)']
                                    } : {
                                        scale: isSelected ? 1.1 : 1,
                                        borderColor: isSelected ? '#6366f1' : 'transparent',
                                        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        boxShadow: 'none'
                                    }
                                }
                                transition={
                                    isTarget ? {
                                        duration: 0.5,
                                        repeat: 4, // Flash 4 times (approx 2s)
                                        ease: "easeInOut"
                                    } : {
                                        duration: 0.2
                                    }
                                }
                                className={`
                                    p-4 rounded-xl border-4 transition-colors duration-200
                                    flex flex-col items-center gap-2
                                    ${isSelected ? 'shadow-lg' : 'opacity-70'}
                                    ${isTarget ? 'z-10' : ''}
                                `}
                            >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-inner bg-white/10">
                                    <Image
                                        src={CHARACTERS[player.color].imagePath}
                                        alt={CHARACTERS[player.color].name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                                <span className="font-bold text-lg truncate w-full"
                                    style={{ color: getColorHex(player.color) }}>
                                    {player.name}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {isFinished && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 tracking-tight"
                    >
                        {players[targetPlayerIndex].name} に決定！
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

// Helper to get hex color (duplicated from constants/Game.tsx for now, ideally imported)
const getColorHex = (color: string) => {
    const colors: Record<string, string> = {
        BLUE: '#3b82f6',
        YELLOW: '#eab308',
        RED: '#ef4444',
        GREEN: '#22c55e',
        LIGHTBLUE: '#0ea5e9',
        PINK: '#ec4899',
        ORANGE: '#f97316',
        PURPLE: '#a855f7',
        BROWN: '#b45309',
        SILVER: '#94a3b8',
        GOLD: '#facc15',
        BLACK: '#0f172a',
    };
    return colors[color] || '#94a3b8';
};