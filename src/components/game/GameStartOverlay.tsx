import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameStartOverlayProps {
    onComplete: () => void;
}

export const GameStartOverlay: React.FC<GameStartOverlayProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'ready' | 'go' | 'hidden'>('ready');

    useEffect(() => {
        // Timeline:
        // 0s: Ready?
        // 1.5s: GO!
        // 2.5s: Complete

        const timer1 = setTimeout(() => {
            setStep('go');
        }, 1000);

        const timer2 = setTimeout(() => {
            setStep('hidden');
            onComplete();
        }, 2000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {step !== 'hidden' && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    initial={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    animate={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
                >
                    {step === 'ready' && (
                        <motion.div
                            key="ready"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="text-6xl md:text-8xl font-black text-white tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
                            style={{
                                textShadow: '0 0 20px rgba(255,255,255,0.5), 3px 3px 0 #000'
                            }}
                        >
                            READY?
                        </motion.div>
                    )}

                    {step === 'go' && (
                        <motion.div
                            key="go"
                            initial={{ scale: 0.2, opacity: 0 }}
                            animate={{ scale: [0.2, 1.2, 1], opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-8xl md:text-9xl font-black text-yellow-400 italic tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                            style={{
                                textShadow: '0 0 30px rgba(255,200,0,0.8), 4px 4px 0 #000'
                            }}
                        >
                            GO!
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
