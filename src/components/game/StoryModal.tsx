import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import Image from 'next/image';
import { Yomogi } from 'next/font/google';
import { useSoundContext } from '@/contexts/SoundContext';

const yomogi = Yomogi({
    weight: '400',
    subsets: ['latin'],
    preload: false,
});

interface StoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STORY_PAGES = [
    {
        title: "平和な日常と、嵐の予感",
        description: `銀河の辺境に浮かぶ学び舎、「ユニバース・ハイスクール」。
放課後の部室棟の一角、「ピースバトル戦略ゲーム部」では、いつものように4人の少女たちが盤面を囲んでいた。

「そこ、角を取れば理論上は勝率85%アップよ」と眼鏡を光らせるリズ。
「細かい確率はいいの！ ドーンと攻めれば道は開ける！」と強引にピースをねじ込むロッカ。
「あ、お花にお水あげなきゃ……でも、ここは通さないよ？」とニコニコしながら鉄壁の守りを築くマロ。
そして、「へへっ、ここを繋げたら盤面がピカピカ光る改造しちゃった！」とルール無用で場を乱すピコ。

凸凹な4人だが、チームワークは抜群……のはずだった。`,
        image: "/Story/story1.png"
    },
    {
        title: "ライバル校、来襲",
        description: `ある日、部室のドアが勢いよく開かれた。現れたのは、銀河のエリート校「セレスティア女学院」の制服に身を包んだ4人の生徒たち。

「ごきげんよう。ここが噂の戦略ゲーム部ですか？」

冷静な眼差しで部室を見渡すミズキ。
「あら、部室のレイアウトに美学を感じないわね……愛が足りないわ」と嘆くアムール。
「堅いこと言わないでさ！ 一緒に遊ぼうよ～！」と元気いっぱいに飛び跳ねるソレイユ。
そして、無言で静かに盤面の前に座り、不敵なプレッシャーを放つノワール。

彼女たちは、年に一度の「銀河ハイスクール交流戦」のためにやってきた、最強のライバルたちだったのだ。`,
        image: "/Story/story2.png"
    },
    {
        title: "戦いの本当の理由（ワケ）",
        description: `本来なら友好的な親善試合で終わるはずだった。
しかし、顧問の先生が持ち込んだ「勝利チームへの賞品」が、事態を一変させる。

『学食限定・幻の“流星レインボープリン” 4人分引換券』

それは、1日に数個しか作られない、銀河一美味と噂される幻のスイーツ。
部活終わりの激辛ラーメンを楽しみにしていたロッカも、これには目の色を変えた。
「激辛の後のプリン……最高じゃない！」

「甘味による脳の活性化は、次の研究に必要不可欠ね」とリズが計算を始める。
「えへへ、食べてみたいな」とマロも珍しく乗り気。
「プリンの揺れ方を解析したい！」とピコも興奮。

しかし、それはセレスティア女学院のメンバーも同じだった。
「データによれば、そのプリンの糖度は至高。譲るわけにはいかないわ」（ミズキ）
「美しきプリンこそ、愛の城の住人にふさわしい！」（アムール）
「食べたーい！ 勝った方がもらえるんだよね？ 燃えてきた！」（ソレイユ）
「……（コクリ）」（ノワールも静かに闘志を燃やす）`,
        image: "/Story/story3.png"
    },
    {
        title: "バトルスタート！",
        description: `かくして、学校の威信と、幻のスイーツを懸けた、負けられない戦いの火蓋が切って落とされた。

理論派のリズ vs 分析家のミズキ。
情熱のロッカ vs 美学のアムール。
鉄壁のマロ vs 陽気なソレイユ。
混沌のピコ vs 静寂のノワール。

互いの性格、戦略、そして「食欲」がぶつかり合う、銀河一賑やかなピースバトルの幕開けだ！

「さあ、盤上のピースで語り合いましょう！ 勝つのは私たちよ！」`,
        image: "/Story/story4.png"
    }
];

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
    const [page, setPage] = useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const { playStoryBgm, stopStoryBgm } = useSoundContext();

    useEffect(() => {
        if (isOpen) {
            setPage(0);
            playStoryBgm();
        } else {
            stopStoryBgm();
        }
    }, [isOpen, playStoryBgm, stopStoryBgm]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [page]);

    const handleNext = () => {
        if (page < STORY_PAGES.length - 1) {
            setPage(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl w-full h-[600px] bg-[#fdfbf7] border-[#e6e2d3] text-slate-800 flex flex-col p-0 overflow-hidden shadow-2xl">


                <div className="flex flex-1 h-full">
                    {/* Left Side - Image */}
                    <div className="w-1/2 bg-slate-100 relative flex items-center justify-center overflow-hidden border-r border-[#e6e2d3]">
                        <div className="relative w-full h-full">
                            <Image
                                src={STORY_PAGES[page].image}
                                alt={STORY_PAGES[page].title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side - Text */}
                    <div className="w-1/2 flex flex-col h-full bg-[url('/paper-texture.png')]">
                        {/* Fixed Title Section */}
                        <div className="px-8 pt-8 sm:px-12 sm:pt-12 pb-4">
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-amber-600 tracking-widest uppercase">
                                    Story {page + 1} / {STORY_PAGES.length}
                                </span>
                                <DialogTitle className={`text-2xl sm:text-3xl font-bold text-slate-900 leading-tight ${yomogi.className}`}>
                                    {STORY_PAGES[page].title}
                                </DialogTitle>
                            </div>
                            <div className="w-12 h-1 bg-amber-400 rounded-full mt-6" />
                        </div>

                        {/* Scrollable Description */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto px-8 pb-8 sm:px-12 sm:pb-12 pt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-amber-300"
                        >
                            <p className={`text-slate-700 leading-loose text-lg font-medium whitespace-pre-wrap ${yomogi.className}`}>
                                {STORY_PAGES[page].description}
                            </p>
                        </div>

                        {/* Footer Navigation */}
                        <div className="p-6 border-t border-[#e6e2d3] bg-[#fdfbf7]/50 backdrop-blur-sm">
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
                                    {STORY_PAGES.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === page ? 'bg-amber-500 w-4' : 'bg-slate-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {page === STORY_PAGES.length - 1 ? (
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
                </div>
            </DialogContent>
        </Dialog>
    );
};
