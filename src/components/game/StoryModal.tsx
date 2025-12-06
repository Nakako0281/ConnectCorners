import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Lock, ArrowLeft, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { Yomogi } from 'next/font/google';
import { useSoundContext } from '@/contexts/SoundContext';
import { STORY_CHAPTERS, StoryChapter } from '@/lib/story';
import { ACHIEVEMENTS, getStats } from '@/lib/achievements';
import { motion, AnimatePresence } from 'framer-motion';

const yomogi = Yomogi({
    weight: '400',
    subsets: ['latin'],
    preload: false,
});

interface StoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- Story Reader Component ---
interface StoryReaderProps {
    chapter: StoryChapter;
    onBack: () => void;
    onClose: () => void;
}

const StoryReader: React.FC<StoryReaderProps> = ({ chapter, onBack, onClose }) => {
    const [page, setPage] = useState(0);
    const { playClick } = useSoundContext();
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [page]);

    const handleNext = () => {
        if (page < chapter.pages.length - 1) {
            playClick();
            setPage(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            playClick();
            setPage(page - 1);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Back Button (Reader specific) */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-10 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full"
                onClick={onBack}
            >
                <ArrowLeft className="w-6 h-6 text-slate-700" />
            </Button>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Side - Image */}
                <div className="w-1/2 bg-slate-100 relative flex items-center justify-center overflow-hidden border-r border-[#e6e2d3]">
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={page}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={chapter.pages[page].image}
                                    alt={chapter.pages[page].title}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side - Text */}
                <div className="w-1/2 flex flex-col h-full bg-[#fdfbf7]">
                    {/* Fixed Title Section */}
                    <div className="px-8 pt-12 sm:px-12 sm:pt-16 pb-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-amber-600 tracking-widest uppercase">
                                    {chapter.title} - Page {page + 1} / {chapter.pages.length}
                                </span>
                            </div>
                            <DialogTitle className={`text-2xl sm:text-3xl font-bold text-slate-900 leading-tight ${yomogi.className}`}>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={page}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="block"
                                    >
                                        {chapter.pages[page].title}
                                    </motion.span>
                                </AnimatePresence>
                            </DialogTitle>
                        </div>
                        <div className="w-12 h-1 bg-amber-400 rounded-full mt-6" />
                    </div>

                    {/* Scrollable Description */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto px-8 pb-8 sm:px-12 sm:pb-12 pt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-amber-300"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={page}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`text-slate-700 leading-loose text-lg font-medium whitespace-pre-wrap ${yomogi.className}`}
                            >
                                {chapter.pages[page].content.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.type === 'text' ? (
                                            <p className={`text-slate-700 leading-loose text-lg font-medium whitespace-pre-wrap mb-4 ${yomogi.className}`}>
                                                {item.text}
                                            </p>
                                        ) : (
                                            <div className="flex items-start gap-4 mb-6 mt-6 bg-white/50 p-4 rounded-xl border border-amber-100 shadow-sm">
                                                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-200 shadow-md bg-white">
                                                        {item.icon === 'globe.svg' ? (
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-xs">
                                                                ALL
                                                            </div>
                                                        ) : (
                                                            <Image
                                                                src={`/Character/${item.icon}`}
                                                                alt={item.speaker}
                                                                width={56}
                                                                height={56}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-bold text-amber-700 ${yomogi.className}`}>
                                                        {item.speaker}
                                                    </span>
                                                </div>
                                                <div className="flex-1 pt-2">
                                                    <p className={`text-slate-800 leading-relaxed text-lg font-medium ${yomogi.className}`}>
                                                        {item.text}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-[#e6e2d3] bg-[#fdfbf7]/50 backdrop-blur-sm z-20 relative">
                <div className="flex justify-between items-center">
                    <Button
                        onClick={handlePrev}
                        disabled={page === 0}
                        variant="ghost"
                        className="text-slate-600 hover:text-slate-900 hover:bg-amber-50 disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        前のページ
                    </Button>

                    <div className="flex gap-2">
                        {chapter.pages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === page ? 'bg-amber-500 w-4' : 'bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {page === chapter.pages.length - 1 ? (
                        <Button
                            onClick={onClose}
                            className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                        >
                            閉じる
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                        >
                            次へ
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Modal Component ---
// --- Main Modal Component ---
export const StoryModal: React.FC<StoryModalProps & { initialChapterId?: string }> = ({ isOpen, onClose, initialChapterId }) => {
    const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
    const [isChapter2Unlocked, setIsChapter2Unlocked] = useState(false);
    const { playStoryBgm, stopStoryBgm, playClick } = useSoundContext();

    useEffect(() => {
        if (isOpen) {
            playStoryBgm();
            // Check for achievements
            const stats = getStats();
            const baseAchievementIds = ACHIEVEMENTS.filter(a => !a.isHidden).map(a => a.id);
            const allBaseUnlocked = baseAchievementIds.every(id => stats.unlockedAchievements.includes(id));
            setIsChapter2Unlocked(allBaseUnlocked);

            // Handle initial chapter
            if (initialChapterId) {
                const chapter = STORY_CHAPTERS.find(c => c.id === initialChapterId);
                if (chapter) {
                    setSelectedChapter(chapter);
                }
            } else {
                setSelectedChapter(null);
            }
        } else {
            stopStoryBgm();
            // Reset state on close
            setTimeout(() => {
                setSelectedChapter(null);
            }, 300); // Wait for exit animation
        }
    }, [isOpen, playStoryBgm, stopStoryBgm, initialChapterId]);

    const handleSelectChapter = (chapter: StoryChapter, isLocked: boolean) => {
        if (isLocked) return;
        playClick();
        setSelectedChapter(chapter);
    };

    const handleBackToMenu = () => {
        playClick();
        setSelectedChapter(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl w-full h-[600px] bg-[#fdfbf7] border-[#e6e2d3] text-slate-800 flex flex-col p-0 overflow-hidden shadow-2xl">
                {selectedChapter ? (
                    <StoryReader
                        chapter={selectedChapter}
                        onBack={handleBackToMenu}
                        onClose={onClose}
                    />
                ) : (
                    // Chapter Selection Screen
                    <div className="flex flex-col h-full bg-[#fdfbf7] p-8 sm:p-12 overflow-hidden">
                        <DialogTitle className={`text-3xl sm:text-4xl font-bold text-slate-800 text-center mb-2 ${yomogi.className}`}>
                            Story Library
                        </DialogTitle>
                        <p className={`text-center text-slate-500 mb-12 ${yomogi.className} text-lg`}>
                            物語を選択してください
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                            {STORY_CHAPTERS.map((chapter) => {
                                const isLocked = chapter.unlockCondition === 'base_achievements' && !isChapter2Unlocked;

                                return (
                                    <button
                                        key={chapter.id}
                                        onClick={() => handleSelectChapter(chapter, isLocked)}
                                        disabled={isLocked}
                                        className={`
                                            group relative flex flex-col items-start text-left bg-white rounded-xl shadow-sm border-2 transition-all duration-300
                                            ${isLocked
                                                ? 'border-slate-200 cursor-not-allowed opacity-80'
                                                : 'border-[#e6e2d3] hover:border-amber-400 hover:shadow-xl hover:-translate-y-1'
                                            }
                                        `}
                                    >
                                        <div className="w-full h-48 relative overflow-hidden rounded-t-lg bg-slate-100">
                                            {isLocked ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 text-slate-400">
                                                    <Lock className="w-12 h-12 mb-2" />
                                                    <span className="font-bold tracking-widest text-sm">LOCKED</span>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={chapter.pages[0].image}
                                                    alt={chapter.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}
                                        </div>

                                        <div className="p-6 w-full">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-xs font-bold tracking-widest uppercase ${isLocked ? 'text-slate-400' : 'text-amber-600'}`}>
                                                    {isLocked ? '???' : chapter.id === 'chapter1' ? 'Chapter 1' : 'Chapter 2'}
                                                </span>
                                            </div>

                                            <h3 className={`text-xl font-bold mb-3 ${isLocked ? 'text-slate-400' : 'text-slate-800 group-hover:text-amber-700'} ${yomogi.className}`}>
                                                {isLocked ? '???' : chapter.title}
                                            </h3>

                                            <p className={`text-sm leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-600'} ${yomogi.className} line-clamp-3`}>
                                                {isLocked ? '実績を解除すると解放されます' : chapter.description}
                                            </p>

                                            {!isLocked && (
                                                <div className="mt-4 flex items-center text-amber-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                                    <BookOpen className="w-4 h-4 mr-2" />
                                                    読む
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
