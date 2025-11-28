"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, X } from 'lucide-react';
import { Player } from '@/lib/game/types';
import { CHARACTERS } from '@/lib/game/characters';
import { Achievement } from '@/lib/achievements';

interface GameResultModalProps {
    isOpen: boolean;
    players: Player[];
    newAchievements?: Achievement[];
    onPlayAgain: () => void;
    onBackToTitle: () => void;
    onClose: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
    isOpen,
    players,
    newAchievements = [],
    onPlayAgain,
    onBackToTitle,
    onClose
}) => {
    // Calculate scores and determine if anyone achieved perfect game
    const playersWithScores = players.map(p => {
        const remainingSquares = p.pieces.reduce((acc, piece) => acc + piece.value, 0);
        const score = 89 - remainingSquares + (p.pieces.length === 0 ? 15 : 0) + (p.bonusScore || 0);
        const isPerfect = p.pieces.length === 0;
        return { ...p, score, isPerfect };
    }).sort((a, b) => b.score - a.score);

    const winner = playersWithScores[0];
    const anyPerfectGame = playersWithScores.some(p => p.isPerfect);

    const getTrophyIcon = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '';
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: -50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 30
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (index: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.1,
                type: "spring" as const,
                stiffness: 300,
                damping: 25
            }
        })
    };

    const confettiVariants = {
        hidden: { scale: 0, rotate: 0 },
        visible: (index: number) => ({
            scale: [0, 1.2, 1],
            rotate: [0, 360],
            transition: {
                delay: 0.5 + index * 0.05,
                duration: 0.6,
                ease: "easeOut" as const
            }
        })
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header with confetti */}
                        <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 p-8 text-white overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            {/* Animated confetti/sparkles */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        left: `${10 + i * 12}%`,
                                        top: `${20 + (i % 3) * 20}%`,
                                    }}
                                    variants={confettiVariants}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Sparkles className="w-4 h-4 text-white/80" />
                                </motion.div>
                            ))}

                            <motion.div
                                className="relative z-10 text-center"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Trophy className="w-16 h-16 mx-auto mb-3" />
                                <h2 className="text-3xl font-bold mb-2">
                                    {anyPerfectGame ? 'Congratulations!' : 'Game Over!'}
                                </h2>
                                {anyPerfectGame && winner.isPerfect && (
                                    <p className="text-sm opacity-90">
                                        {CHARACTERS[winner.color].japaneseName} placed all pieces! 🎉
                                    </p>
                                )}
                            </motion.div>
                        </div>

                        {/* New Achievements */}
                        {newAchievements.length > 0 && (
                            <div className="bg-yellow-50 p-4 border-b border-yellow-100">
                                <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Unlocked Achievements!
                                </h3>
                                <div className="space-y-2">
                                    {newAchievements.map((achievement) => (
                                        <motion.div
                                            key={achievement.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-3 bg-white p-2 rounded-lg border border-yellow-200 shadow-sm"
                                        >
                                            <div className="text-2xl">{achievement.icon}</div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{achievement.title}</div>
                                                <div className="text-xs text-slate-500">{achievement.description}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rankings */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
                                Final Rankings
                            </h3>
                            <div className="space-y-3">
                                {playersWithScores.map((player, index) => (
                                    <motion.div
                                        key={player.id}
                                        custom={index}
                                        variants={listItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`flex items-center justify-between p-4 rounded-lg ${index === 0
                                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-md'
                                            : 'bg-slate-50 border border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl w-8 text-center">
                                                {getTrophyIcon(index)}
                                            </span>
                                            <div className="flex flex-col">
                                                <span
                                                    className="font-bold text-lg"
                                                    style={{ color: player.color }}
                                                >
                                                    {CHARACTERS[player.color].japaneseName}
                                                </span>
                                                {player.isPerfect && (
                                                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" /> Perfect Game!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-slate-800">
                                                {player.score}
                                            </div>
                                            <div className="text-xs text-slate-500">points</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Play Again Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: playersWithScores.length * 0.1 + 0.3 }}
                                className="mt-6"
                            >
                                <Button
                                    onClick={onPlayAgain}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 text-lg shadow-lg transition-all hover:scale-[1.02]"
                                >
                                    Play Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onBackToTitle}
                                    className="w-full mt-3 border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold py-6"
                                >
                                    Back to Title
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
