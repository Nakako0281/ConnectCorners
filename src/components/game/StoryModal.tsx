import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface StoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORY_DATA = [
    {
        title: "1. 平和な日常と、嵐の予感",
        text: `銀河の辺境に浮かぶ学び舎、「ユニバース・ハイスクール」。
放課後の部室棟の一角、「ピースバトル戦略ゲーム部」では、いつものように4人の少女たちが盤面を囲んでいた。

「そこ、角を取れば理論上は勝率85%アップよ」と眼鏡を光らせるリズ。
「細かい確率はいいの！ ドーンと攻めれば道は開ける！」と強引にピースをねじ込むロッカ。
「あ、お花にお水あげなきゃ……でも、ここは通さないよ？」とニコニコしながら鉄壁の守りを築くマロ。
そして、「へへっ、ここを繋げたら盤面がピカピカ光る改造しちゃった！」とルール無用で場を乱すピコ。

凸凹な4人だが、チームワークは抜群……のはずだった。`
    },
    {
        title: "2. .ライバル校、来襲",
        text: `ある日、部室のドアが勢いよく開かれた。現れたのは、銀河のエリート校**「セレスティア女学院」**の制服に身を包んだ4人の生徒たち。
「ごきげんよう。ここが噂の戦略ゲーム部ですか？」冷静な眼差しで部室を見渡すミズキ。 
「あら、部室のレイアウトに美学を感じないわね……愛が足りないわ」と嘆くアムール。
「堅いこと言わないでさ！ 一緒に遊ぼうよ～！」と元気いっぱいに飛び跳ねるソレイユ。
そして、無言で静かに盤面の前に座り、不敵なプレッシャーを放つノワール。
彼女たちは、年に一度の「銀河ハイスクール交流戦」のためにやってきた、最強のライバルたちだったのだ。`
    },
    {
        title: "3. 戦いの本当の理由（ワケ）",
        text: `本来なら友好的な親善試合で終わるはずだった。 しかし、顧問の先生が持ち込んだ「勝利チームへの賞品」が、事態を一変させる。
『学食限定・幻の“流星レインボープリン” 4人分引換券』
それは、1日に数個しか作られない、銀河一美味と噂される幻のスイーツ。 部活終わりの激辛ラーメンを楽しみにしていたロッカも、これには目の色を変えた。 「激辛の後のプリン……最高じゃない！」
「甘味による脳の活性化は、次の研究に必要不可欠ね」とリズが計算を始める。 「えへへ、食べてみたいな」とマロも珍しく乗り気。 「プリンの揺れ方を解析したい！」とピコも興奮。
しかし、それはセレスティア女学院のメンバーも同じだった。 「データによれば、そのプリンの糖度は至高。譲るわけにはいかないわ」（ミズキ） 「美しきプリンこそ、愛の城の住人にふさわしい！」（アムール） 「食べたーい！ 勝った方がもらえるんだよね？ 燃えてきた！」（ソレイユ） 「……（コクリ）」（ノワールも静かに闘志を燃やす）
`
    },
    {
        title: "4. バトルスタート！",
        text: `かくして、学校の威信と、幻のスイーツを懸けた、負けられない戦いの火蓋が切って落とされた。
理論派のリズ vs 分析家のミズキ。 情熱のロッカ vs 美学のアムール。 鉄壁のマロ vs 陽気なソレイユ。 混沌のピコ vs 静寂のノワール。
互いの性格、戦略、そして「食欲」がぶつかり合う、銀河一賑やかなピースバトルの幕開けだ！
「「「さあ、盤上のピースで語り合いましょう！ 勝つのは私たちよ！」」」`
    }
];

const TOTAL_PAGES = STORY_DATA.length;

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < TOTAL_PAGES - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleClose = () => {
        onClose();
    };

    // Reset page when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
        }
    }, [isOpen]);

    const currentStory = STORY_DATA[currentPage];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-6xl w-[95vw] h-[80vh] md:h-[600px] bg-[#fdfbf7] border-amber-200/50 p-0 overflow-hidden flex flex-col font-[family-name:var(--font-yomogi)]">
                <VisuallyHidden>
                    <DialogTitle>Story Modal</DialogTitle>
                </VisuallyHidden>

                {/* Header / Close Button - Removed manual button as DialogContent has a default one */}

                {/* Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                    {/* Left: Image */}
                    <div className="relative w-full h-full bg-[#fdfbf7] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-amber-100">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={`/Story/story${currentPage + 1}.png`}
                                alt={`Story Page ${currentPage + 1}`}
                                className="max-w-full max-h-full object-contain rounded-sm shadow-md"
                            />
                        </div>

                        {/* Navigation Buttons (Overlay on Image for Mobile / Integrated) */}
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                                className={`pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white text-amber-900 border border-amber-200 shadow-sm transition-all ${currentPage === 0 ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            {currentPage === TOTAL_PAGES - 1 ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white text-amber-900 border border-amber-200 shadow-sm transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNext}
                                    className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white text-amber-900 border border-amber-200 shadow-sm transition-all"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="flex flex-col bg-[##ebe5da] overflow-hidden">
                        {/* Fixed Title Area */}
                        <div className="p-6 lg:p-12 pb-2 lg:pb-4 border-b border-amber-100/50 shrink-0">
                            <div className="max-w-xl mx-auto w-full">
                                <h2 className="text-2xl lg:text-3xl font-black text-amber-900 tracking-wide">
                                    {currentStory.title}
                                </h2>
                            </div>
                        </div>

                        {/* Scrollable Text Area */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-12 pt-4 lg:pt-6 pr-2 bg-[#fdfbf7] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-amber-300">
                            <div className="max-w-xl mx-auto w-full">
                                <div className="prose prose-lg prose-p:text-slate-700 prose-headings:text-amber-900">
                                    <p className="leading-loose whitespace-pre-wrap text-lg text-amber-900 font-bold text-xl">
                                        {currentStory.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Navigation (Desktop) */}
                <div className="h-16 flex items-center justify-between px-8 bg-[#f8f6f2] border-t border-amber-100">

                    {/* Desktop Prev Button */}
                    <div className="hidden lg:block w-32">
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className={`text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 font-bold ${currentPage === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            まえへ
                        </Button>
                    </div>

                    {/* Page Indicator */}
                    <div className="flex gap-3">
                        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-amber-500 scale-110' : 'bg-amber-200 hover:bg-amber-300'}`}
                            />
                        ))}
                    </div>

                    {/* Desktop Next Button */}
                    <div className="hidden lg:block w-32 text-right">
                        {currentPage === TOTAL_PAGES - 1 ? (
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                className="text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 font-bold"
                            >
                                とじる
                                <X className="w-5 h-5 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={handleNext}
                                className="text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 font-bold"
                            >
                                つぎへ
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
