import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TurnNotificationProps {
    isMyTurn: boolean;
}

export const TurnNotification: React.FC<TurnNotificationProps> = ({ isMyTurn }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isMyTurn) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isMyTurn]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-1/8 left-0 right-0 z-40 pointer-events-none flex justify-center"
                >
                    <div className="bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-blue-600/80 backdrop-blur-md text-white py-3 px-12 rounded-full shadow-lg border border-white/20">
                        <span className="text-2xl font-bold tracking-wider uppercase drop-shadow-md">
                            あなたのターン
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
