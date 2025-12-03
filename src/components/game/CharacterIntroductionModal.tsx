import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { CHARACTERS } from '@/lib/game/characters';
import Image from 'next/image';

interface CharacterIntroductionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CharacterIntroductionModal: React.FC<CharacterIntroductionModalProps> = ({ isOpen, onClose }) => {
    const characterList = Object.values(CHARACTERS);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentCharacter = characterList[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % characterList.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + characterList.length) % characterList.length);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl bg-slate-900/95 backdrop-blur-xl border-slate-700 text-slate-100 p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                    {/* Left side: Image */}
                    <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center p-8">
                        <div className="relative w-full h-full">
                            <Image
                                src={currentCharacter.imagePath}
                                alt={currentCharacter.name}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Right side: Info */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                    Character Profile {currentIndex + 1} / {characterList.length}
                                </span>
                            </div>
                            <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                {currentCharacter.japaneseName}
                            </DialogTitle>
                            <div className="text-xl font-bold text-slate-500 font-mono">
                                {currentCharacter.name}
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="prose prose-invert max-w-none">
                                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wide">Description</h4>
                                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                                        {currentCharacter.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                        Personality
                                    </h4>
                                    <p className="text-slate-300 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-700">
                                        {currentCharacter.personality}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-pink-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                        Appearance
                                    </h4>
                                    <p className="text-slate-300 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-slate-700">
                                        {currentCharacter.appearance}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-4 bg-slate-800/30 border-t border-slate-700/50 flex flex-row justify-between items-center sm:justify-between">
                            <Button
                                variant="ghost"
                                onClick={handlePrev}
                                className="gap-2 hover:bg-slate-700 text-slate-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Prev
                            </Button>

                            <Button onClick={onClose} variant="secondary" className="bg-slate-700 hover:bg-slate-600">
                                Close
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleNext}
                                className="gap-2 hover:bg-slate-700 text-slate-300"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
