
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock } from 'lucide-react';
import { ACHIEVEMENTS, getStats } from '@/lib/achievements';

interface AchievementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose }) => {
    const stats = getStats();
    const unlockedCount = stats.unlockedAchievements.length;
    const totalCount = ACHIEVEMENTS.length;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    } as const;

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20
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
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    } as const;


    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Trophy className="w-6 h-6" /> Achievements
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">Track your progress</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-black/20 rounded-full h-4 w-full overflow-hidden backdrop-blur-sm relative">
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-medium mt-2 text-white/90">
                                <span>{unlockedCount} / {totalCount} unlocked</span>
                                <span>{progressPercentage}% Complete</span>
                            </div>
                        </div>

                        {/* Achievement List */}
                        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {ACHIEVEMENTS.map((achievement) => {
                                const isUnlocked = stats.unlockedAchievements.includes(achievement.id);
                                return (
                                    <div
                                        key={achievement.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isUnlocked
                                                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm'
                                                : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                                            }`}
                                    >
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm border-2
                                            ${isUnlocked ? 'bg-white border-yellow-200' : 'bg-slate-200 border-slate-300'}
                                        `}>
                                            {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {achievement.title}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {achievement.description}
                                            </p>
                                        </div>
                                        {isUnlocked && (
                                            <div className="text-green-500">
                                                <Trophy className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-500 grid grid-cols-2 gap-2 shrink-0">
                            <div>Total Games: <span className="font-semibold text-slate-700">{stats.gamesPlayed}</span></div>
                            <div>Total Wins: <span className="font-semibold text-slate-700">{stats.wins}</span></div>
                            <div>Current Streak: <span className="font-semibold text-slate-700">{stats.currentWinStreak}</span></div>
                            <div>Best Streak: <span className="font-semibold text-slate-700">{stats.maxWinStreak}</span></div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
