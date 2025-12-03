import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, HelpCircle, FileText, BookOpen } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { AchievementModal } from './AchievementModal';
import { HowToPlayModal } from './HowToPlayModal';
import { CreditModal } from './CreditModal';
import { CharacterIntroductionModal } from './CharacterIntroductionModal';
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
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
    const { playClick } = useSoundContext();

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
                                onClick={handleOpenCharacter}
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <BookOpen className="w-5 h-5" />
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

            <AchievementModal
                isOpen={isAchievementModalOpen}
                onClose={() => setIsAchievementModalOpen(false)}
            />

            <CharacterIntroductionModal
                isOpen={isCharacterModalOpen}
                onClose={() => setIsCharacterModalOpen(false)}
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
