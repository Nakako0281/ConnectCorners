
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '@/lib/game/characters';
import { STORY_CHAPTERS } from '@/lib/story';

// Collect all image paths from data sources
const ASSETS_TO_LOAD = [
    // Helper to get unique paths
    ...Array.from(new Set([
        // Title
        '/title_logo.png', // We kept this as PNG for transparency quality/size balance if small enough, or check if we optimized it?
        // Note: The optimizer script targeted Story and Character dirs. title_logo.png is in public root.
        // Let's assume title_logo.png is still PNG.

        // Characters
        ...Object.values(CHARACTERS).map(c => c.imagePath),
        // Character Whole Body
        ...Object.values(CHARACTERS).map(c => c.imagePath.replace('/Character/', '/CharacterWholeBody/').replace('.webp', '-w.webp')),

        // Story Images & Icons (Icons are same as character images usually)
        ...STORY_CHAPTERS.flatMap(chapter =>
            chapter.pages.flatMap(page => [
                page.image,
                ...page.content
                    .filter(c => c.type === 'dialogue')
                    .map((c: any) => `/Character/${c.icon}`) // Handle dynamic icon paths
            ])
        )
    ]))
].filter(path => !!path);

interface AssetLoaderProps {
    onLoadComplete: () => void;
}

export const AssetLoader: React.FC<AssetLoaderProps> = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const total = ASSETS_TO_LOAD.length;
        if (total === 0) {
            onLoadComplete();
            return;
        }

        let mounted = true;
        let count = 0;

        const loadImage = (src: string) => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = () => {
                    console.warn(`Failed to load asset: ${src}`);
                    resolve(); // Continue even if one fails
                };
            });
        };

        const loadAll = async () => {
            // Load in parallel
            const promises = ASSETS_TO_LOAD.map(async (src) => {
                await loadImage(src);
                if (mounted) {
                    count++;
                    setLoadedCount(prev => prev + 1);
                    setProgress(Math.round((count / total) * 100));
                }
            });

            await Promise.all(promises);

            if (mounted) {
                // Small buffer to ensure 100% is seen
                setTimeout(() => {
                    setIsLoading(false);
                    setTimeout(onLoadComplete, 500); // Wait for fade out
                }, 500);
            }
        };

        loadAll();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center text-white"
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                    <div className="w-64 space-y-4">
                        <div className="text-center font-bold text-xl tracking-wider text-blue-400 animate-pulse">
                            INITIALIZING...
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ bounce: 0 }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-slate-500 font-mono">
                            <span>LOADING ASSETS</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
