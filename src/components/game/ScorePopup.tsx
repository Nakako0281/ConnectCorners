import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScorePopupProps {
    score: number;
    x: number;
    y: number;
    hasBonus?: boolean;
    onComplete: () => void;
}

export const ScorePopup: React.FC<ScorePopupProps> = ({ score, x, y, hasBonus, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 1200); // Slightly shorter for snappier feel
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 20, rotate: -10 }}
            animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.3, 1.5, 1],
                y: [20, -60],
                rotate: [-10, 0, 0, 5]
            }}
            transition={{
                duration: 1.2,
                times: [0, 0.2, 0.7, 1],
                ease: "easeOut"
            }}
            style={{
                position: 'fixed',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 1000,
                transform: 'translate(-50%, -50%)', // Center on the coordinate
            }}
            className="flex items-center justify-center pointer-events-none"
        >
            <div className="relative">
                {/* Glow/Shadow Layer behind */}
                <span
                    className="absolute inset-0 blur-md select-none"
                    style={{
                        color: hasBonus ? '#fbbf24' : '#0ea5e9', // Amber vs Sky Blue
                        transform: 'scale(1.1)',
                        textShadow: hasBonus
                            ? '0 0 20px #f59e0b'
                            : '0 0 20px #0ea5e9',
                    }}
                >
                    <span className="font-black text-6xl italic">+{score}</span>
                </span>

                {/* Main Text Layer */}
                <span
                    className={`
                        relative font-black text-6xl italic select-none
                        ${hasBonus
                            ? 'text-yellow-100'
                            : 'text-white'
                        }
                    `}
                    style={{
                        // Thick text stroke effect using CSS text-shadow
                        textShadow: hasBonus
                            ? '3px 3px 0px #b45309, -1px -1px 0 #b45309, 1px -1px 0 #b45309, -1px 1px 0 #b45309, 1px 1px 0 #b45309'
                            : '3px 3px 0px #0369a1, -1px -1px 0 #0369a1, 1px -1px 0 #0369a1, -1px 1px 0 #0369a1, 1px 1px 0 #0369a1',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    +{score}
                </span>

                {/* Optional "Particle" or accent decorations */}
                {hasBonus && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1.5, rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -top-4 -right-4 text-yellow-300 text-3xl"
                    >
                        ✨
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
