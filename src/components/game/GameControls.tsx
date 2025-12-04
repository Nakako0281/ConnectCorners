import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, HelpCircle, FileText, BookOpen, Users } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { AchievementModal } from './AchievementModal';
import { HowToPlayModal } from './HowToPlayModal';
import { StoryModal } from './StoryModal';
import { CharacterIntroModal } from './CharacterIntroModal';
import { CreditModal } from './CreditModal';
import { useSoundContext } from '@/contexts/SoundContext';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameControlsProps {
    children?: React.ReactNode;
}

export const GameControls: React.FC<GameControlsProps> = ({ children }) => {
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
    const { playClick } = useSoundContext();

    const handleOpenStory = () => {
        playClick();
        setIsStoryModalOpen(true);
    };

    const handleOpenAchievements = () => {
        playClick();
        setIsAchievementModalOpen(true);
    };

    const handleOpenHowToPlay = () => {
        playClick();
        setIsHowToPlayModalOpen(true);
    };

    const handleOpenCredit = () => {
        playClick();
        setIsCreditModalOpen(true);
    };

    const handleOpenCharacter = () => {
        playClick();
        setIsCharacterModalOpen(true);
    };

    return (
        <>
            <TooltipProvider>
                <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                    <VolumeControl />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenStory}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <BookOpen className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>ストーリー</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenCharacter}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <Users className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>キャラクター紹介</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenAchievements}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <Trophy className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>実績</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenHowToPlay}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>遊び方</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenCredit}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <FileText className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>クレジット</p>
                        </TooltipContent>
                    </Tooltip>

                    {children}
                </div>
            </TooltipProvider>

            <StoryModal
                isOpen={isStoryModalOpen}
                onClose={() => setIsStoryModalOpen(false)}
            />

            <CharacterIntroModal
                isOpen={isCharacterModalOpen}
                onClose={() => setIsCharacterModalOpen(false)}
            />

            <AchievementModal
                isOpen={isAchievementModalOpen}
                onClose={() => setIsAchievementModalOpen(false)}
            />

            <HowToPlayModal
                isOpen={isHowToPlayModalOpen}
                onClose={() => setIsHowToPlayModalOpen(false)}
            />

            <CreditModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
            />
        </>
    );
};
