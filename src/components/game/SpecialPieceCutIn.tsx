import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character } from '@/lib/game/characters';

interface SpecialPieceCutInProps {
    character: Character;
    onComplete: () => void;
}

export const SpecialPieceCutIn: React.FC<SpecialPieceCutInProps> = ({ character, onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete();
        }, 500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Dynamic Background Flash */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {/* Colored Overlay */}
                    <div
                        className="absolute inset-0 opacity-30 mix-blend-overlay"
                        style={{ backgroundColor: character.color }}
                    />

                    {/* Character Image Slide-in */}
                    <motion.img
                        src={character.imagePath}
                        alt={character.name}
                        className="absolute bottom-0 right-0 h-[80vh] object-contain z-10 drop-shadow-2xl"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: '10%', opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />

                    {/* Text Effect */}
                    <div className="absolute top-1/3 left-0 right-0 flex flex-col items-center z-20">
                        <motion.div
                            initial={{ scale: 2, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                            className="text-6xl md:text-8xl font-black italic tracking-tighter text-white stroke-black"
                            style={{
                                textShadow: `0 0 30px ${character.color}, 5px 5px 0 #000`,
                                WebkitTextStroke: '3px black'
                            }}
                        >
                            SPECIAL
                        </motion.div>
                        <motion.div
                            initial={{ scale: 2, opacity: 0, y: -50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                            className="text-7xl md:text-9xl font-black italic tracking-tighter text-yellow-400"
                            style={{
                                textShadow: '0 0 30px orange, 5px 5px 0 #000',
                                WebkitTextStroke: '3px black'
                            }}
                        >
                            PIECE!!
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
