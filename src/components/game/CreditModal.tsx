import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Lightbulb, Hammer, Palette, Music } from 'lucide-react';

interface CreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CREDITS = [
    { role: '企画', name: 'TBD', icon: Lightbulb },
    { role: '制作', name: 'TBD', icon: Hammer },
    { role: '絵', name: 'TBD', icon: Palette },
    { role: 'BGM素材/使用楽曲', name: 'TBD', icon: Music },
];

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
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
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <FileText className="w-6 h-6" /> Credits
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">Project Contributors</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {CREDITS.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                                {item.role}
                                            </div>
                                            <div className="font-medium text-slate-800">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                Thank you for playing!
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
