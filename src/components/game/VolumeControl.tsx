import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSoundContext } from '@/contexts/SoundContext';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
    className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ className }) => {
    const { bgmVolume, seVolume, setBgmVolume, setSeVolume, playClick } = useSoundContext();
    const [isOpen, setIsOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) playClick();
    };

    // Determine icon based on max volume
    // Use server defaults (BGM 0.3, SE 0.5) if not mounted to prevent hydration mismatch
    const currentBgm = mounted ? bgmVolume : 0.3;
    const currentSe = mounted ? seVolume : 0.5;
    const maxVol = Math.max(currentBgm, currentSe);
    const Icon = maxVol === 0 ? VolumeX : maxVol < 0.5 ? Volume1 : Volume2;

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("text-slate-400 hover:text-white hover:bg-white/10", className)}
                >
                    <Icon className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-slate-900 border-slate-700 p-4 shadow-xl">
                <div className="grid gap-4">
                    <div className="grid gap-6 py-2">
                        {/* BGM Slider */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">BGM</label>
                                <span className="text-xs text-slate-500">{Math.round(bgmVolume * 100)}%</span>
                            </div>
                            <Slider
                                defaultValue={[bgmVolume]}
                                value={[bgmVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(vals: number[]) => setBgmVolume(vals[0])}
                            />
                        </div>

                        {/* SE Slider */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">Sound Effects</label>
                                <span className="text-xs text-slate-500">{Math.round(seVolume * 100)}%</span>
                            </div>
                            <Slider
                                defaultValue={[seVolume]}
                                value={[seVolume]}
                                max={1}
                                step={0.01}
                                onValueChange={(vals: number[]) => setSeVolume(vals[0])}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
