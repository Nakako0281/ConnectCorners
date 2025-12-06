import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TitleScreenProps {
    onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden cursor-pointer"
            onClick={onStart}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />

            {/* Animated Background Pieces */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <BackgroundPiece key={i} index={i} />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-12 p-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                    <img
                        src="/title_logo.png"
                        alt="Connect Corners"
                        className="w-full max-w-4xl drop-shadow-2xl relative z-10"
                    />
                </motion.div>

                {/* Click to Start */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <motion.p
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-2xl md:text-3xl font-bold text-white tracking-[0.2em] font-mono text-center"
                    >
                        CLICK TO START
                    </motion.p>
                    <p className="text-slate-500 text-sm">
                        音声が再生されます
                    </p>
                </motion.div>
            </div>

            {/* Footer / Copyright */}
            <div className="absolute bottom-4 text-slate-600 text-xs font-mono">
                © 2025 Connect Corners By Nakako
            </div>
        </div>
    );
};

// Background Piece Animation (Simplified version from Lobby)
const BackgroundPiece = ({ index }: { index: number }) => {
    const [initialState, setInitialState] = useState<{
        x: number;
        y: number;
        scale: number;
        duration: number;
        delay: number;
    } | null>(null);

    React.useEffect(() => {
        setInitialState({
            x: Math.random() * 100 - 50, // vw
            y: Math.random() * 100 - 50, // vh
            scale: Math.random() * 0.5 + 0.5,
            duration: 15 + Math.random() * 15,
            delay: Math.random() * 5
        });
    }, []);

    if (!initialState) return null;

    const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];
    const color = colors[index % colors.length];

    return (
        <motion.div
            className={`absolute w-16 h-16 ${color} rounded-lg blur-sm`}
            style={{
                left: '50%',
                top: '50%',
            }}
            initial={{
                x: `${initialState.x}vw`,
                y: `${initialState.y}vh`,
                opacity: 0,
                rotate: 0,
                scale: 0
            }}
            animate={{
                y: [`${initialState.y}vh`, `${initialState.y - 20}vh`],
                opacity: [0, 0.4, 0],
                rotate: [0, 180],
                scale: [0, initialState.scale, 0]
            }}
            transition={{
                duration: initialState.duration,
                repeat: Infinity,
                delay: initialState.delay,
                ease: "linear"
            }}
        />
    );
};
