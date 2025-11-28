import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSoundContext } from '@/contexts/SoundContext';

export const VolumeControl: React.FC = () => {
    const { bgmVolume, seVolume, setBgmVolume, setSeVolume, playClick } = useSoundContext();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) playClick();
    };

    // Determine icon based on max volume
    const maxVol = Math.max(bgmVolume, seVolume);
    const Icon = maxVol === 0 ? VolumeX : maxVol < 0.5 ? Volume1 : Volume2;

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <Icon className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-slate-900 border-slate-700 p-4 shadow-xl">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none text-slate-200">Volume Settings</h4>
                        <p className="text-sm text-slate-500">Adjust the volume for BGM and Sound Effects.</p>
                    </div>
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
                                onValueChange={(vals) => setBgmVolume(vals[0])}
                                className="[&_.bg-primary]:bg-blue-500 [&_.border-primary]:border-blue-500"
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
                                onValueChange={(vals) => setSeVolume(vals[0])}
                                className="[&_.bg-primary]:bg-green-500 [&_.border-primary]:border-green-500"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
