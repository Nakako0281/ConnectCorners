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
        const timer = setTimeout(onComplete, 1500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -50, scale: [0.5, 1.2, 1] }}
            transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
            style={{
                position: 'fixed',
                left: x,
                top: y,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
            className="font-black text-5xl drop-shadow-2xl"
        >
            <span
                className={`${hasBonus
                        ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent'
                    }`}
                style={{
                    textShadow: hasBonus
                        ? '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4)'
                        : '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)',
                }}
            >
                +{score}
            </span>
        </motion.div>
    );
};
