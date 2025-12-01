import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, HelpCircle, FileText } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { AchievementModal } from './AchievementModal';
import { HowToPlayModal } from './HowToPlayModal';
import { CreditModal } from './CreditModal';
import { useSoundContext } from '@/contexts/SoundContext';

interface GameControlsProps {
    children?: React.ReactNode;
}

export const GameControls: React.FC<GameControlsProps> = ({ children }) => {
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
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

    return (
        <>
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                <VolumeControl />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleOpenAchievements}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <Trophy className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleOpenHowToPlay}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <HelpCircle className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleOpenCredit}
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <FileText className="w-5 h-5" />
                </Button>
                {children}
            </div>

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
