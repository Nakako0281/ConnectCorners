import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEndOverlayProps {
    onComplete: () => void;
}

export const GameEndOverlay: React.FC<GameEndOverlayProps> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Timeline:
        // 0s: FINISH! appears
        // 2s: Fade out and complete

        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 1250);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                    animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
                >
                    <motion.div
                        initial={{ scale: 3, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="text-7xl md:text-9xl font-black text-white tracking-widest uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                        style={{
                            textShadow: '0 0 30px rgba(255,0,0,0.8), 4px 4px 0 #000',
                            background: 'linear-gradient(to bottom, #fff 0%, #ffcccc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke: '2px white'
                        }}
                    >
                        FINISH!
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
