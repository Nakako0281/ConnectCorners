import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MousePointer2, RotateCw, FlipHorizontal, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-slate-900/95 backdrop-blur-xl border-slate-700 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        遊び方
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-lg">
                        ブロック配置の戦略を極めよう
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Objective */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" /> 目的
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            できるだけ多くのピースを盤面に配置しましょう。全員がピースを置けなくなったらゲーム終了です。
                        </p>
                    </div>

                    {/* Rules */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-200">ルール</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300 ml-2">
                            <li>
                                <span className="font-semibold text-blue-400">最初のピース:</span> 自分の色のマークがある角（コーナー）を埋めるように配置します。
                            </li>
                            <li>
                                <span className="font-semibold text-green-400">2手目以降:</span> 自分のピースの<span className="font-bold text-white">「角（コーナー）」</span>同士が接するように配置します。
                            </li>
                            <li>
                                <span className="font-semibold text-red-400">制限:</span> 自分のピースの<span className="font-bold text-white">「辺（エッジ）」</span>同士が接してはいけません。
                            </li>
                        </ul>
                    </div>

                    {/* Controls */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-200">操作方法</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center text-center gap-2">
                                <MousePointer2 className="w-6 h-6 text-blue-400" />
                                <span className="font-semibold text-sm">選択 & 配置</span>
                                <span className="text-xs text-slate-400">左クリック</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center text-center gap-2">
                                <RotateCw className="w-6 h-6 text-green-400" />
                                <span className="font-semibold text-sm">回転</span>
                                <span className="text-xs text-slate-400">右クリック / ボタン</span>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col items-center text-center gap-2">
                                <FlipHorizontal className="w-6 h-6 text-purple-400" />
                                <span className="font-semibold text-sm">反転</span>
                                <span className="text-xs text-slate-400">ボタン</span>
                            </div>
                        </div>
                    </div>

                    {/* Scoring */}
                    <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                        <h3 className="font-bold text-slate-200 mb-2">スコア</h3>
                        <div className="flex justify-between text-sm text-slate-300">
                            <span>1マス配置ごとに</span>
                            <span className="font-mono font-bold text-green-400">+1 ポイント</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-300 mt-1">
                            <span>全21ピース配置ボーナス</span>
                            <span className="font-mono font-bold text-yellow-400">+15 ポイント</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-300 mt-1">
                            <span className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span> ボーナスマス配置
                            </span>
                            <span className="font-mono font-bold text-yellow-400">+1 ポイント</span>
                        </div>
                    </div>

                    {/* Unique Pieces */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-slate-700/30">
                        <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <span className="text-xl">🧩</span> キャラクター固有ピース
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            各キャラクターは、通常の21個のピースに加えて、<span className="font-bold text-white">1個の「固有ピース」</span>を持っています。
                            この強力な6マス分のピースをいつ使うかが勝負の鍵を握ります！
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600">
                        わかった！
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
