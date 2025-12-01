import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Lightbulb, Hammer, Palette, Music } from 'lucide-react';

interface CreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CREDITS = [
    { role: '企画', name: 'nakako, Gemini(3Pro)', icon: Lightbulb, color: 'text-yellow-400' },
    { role: '制作', name: 'nakako, Gemini(3Pro), Claude(sonnet4.5)', icon: Hammer, color: 'text-blue-400' },
    { role: '絵', name: 'NanoBanana(Pro)', icon: Palette, color: 'text-pink-400' },
    { role: 'BGM素材/使用楽曲', name: '効果音ラボ様, 甘茶の音楽工房様', icon: Music, color: 'text-green-400' },
];

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border-slate-700 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-400" /> クレジット
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Project Contributors
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {CREDITS.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700 ${item.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                        {item.role}
                                    </div>
                                    <div className="font-medium text-slate-200">
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 text-center">
                    <p className="text-sm text-slate-400">
                        Thank you for playing!
                    </p>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600">
                        閉じる
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
