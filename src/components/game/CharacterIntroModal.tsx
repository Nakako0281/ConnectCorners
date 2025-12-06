import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import Image from 'next/image';
import { Yomogi } from 'next/font/google';
import { UNLOCK_CONDITIONS } from '@/lib/game/characters';
import { getStats, ACHIEVEMENTS } from '@/lib/achievements';
import { PlayerColor } from '@/lib/game/types';

const yomogi = Yomogi({
    weight: '400',
    subsets: ['latin'],
    preload: false,
});

interface CharacterIntroModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CHARACTERS_DATA = [
    {
        name: "リズ (Riz)",
        color: "BLUE",
        role: "冷静沈着なリーダー格",
        image: "/CharacterWholeBody/Riz-w.png",
        description: `【性格】
成績優秀で、幾何学を愛する真面目な性格。
常に数手先を読む理論派だが、想定外の動き（特にビットの行動）には弱い。
「角を制する者は宇宙を制す」が口癖。

【容姿】
透き通るようなサファイアブルーのロングヘア。
目には六角形の模様が浮かぶコンタクトレンズをしている。
制服を着崩さずピシッと着ており、幾何学的なカクカクしたデザインのヘアアクセサリーを付けている。`
    },
    {
        name: "ロッカ (Rocca)",
        color: "RED",
        role: "猪突猛進のエースアタッカー",
        image: "/CharacterWholeBody/Rocca-w.png",
        description: `【性格】
情熱的で負けず嫌い。「細かいことはいいからドーンと行こう！」がモットー。
攻撃的な配置が得意で、相手の陣地に切り込むのが大好き。
部活の後は、よくみんなを激辛宇宙ラーメン屋に誘う。

【容姿】
燃えるようなルビーレッドのショートカットで、毛先がツンツン跳ねている。
スポーティーなパーカーを制服の上から羽織っている。
頬に絆創膏を貼っており、八重歯がチャームポイント。`
    },
    {
        name: "マロ (Mallo)",
        color: "GREEN",
        role: "おっとり癒やし系の守護神",
        image: "/CharacterWholeBody/Mallo-w.png",
        description: `【性格】
争いごとは苦手だが、守りに入ると鉄壁の強さを誇る。
「みんなの居場所（陣地）を守りたいの」と言いながら、着実に自分のエリアを広げる。
マイペースで、対局中に宇宙植物にお水をあげ始めることがある。

【容姿】
ふわふわとしたエメラルドグリーンのウェーブヘア。
大きな丸眼鏡をかけており、制服はロングスカートスタイル。
常に謎の小さな植物の妖精（ペット）が肩に乗っている。`
    },
    {
        name: "ピコ (Pico)",
        color: "YELLOW",
        role: "神出鬼没のトリックスター",
        image: "/CharacterWholeBody/Pico-w.png",
        description: `【性格】
イタズラ好きで、セオリー無視の変な手を打つのが大好き。
「ここ繋げたら面白くない？」と、誰も予想しない場所にピースを置いて場を混乱させる天才肌。
最新のガジェットオタクで、ゲーム盤のホログラム改造を担当している。

【容姿】
鮮やかなネオンイエローのツインテール。
ヘッドフォンを首にかけ、制服に缶バッジや電脳アクセサリーをジャラジャラつけている「デコラ系」。
手には常に携帯ゲーム機かタブレットを持っている。`
    },
    {
        name: "ミズキ (Mizuki)",
        color: "LIGHTBLUE",
        role: "理知的なクールビューティー",
        image: "/CharacterWholeBody/Mizuki-w.png",
        description: `【性格】
頭脳明晰で論理的。データ分析が得意で、リズとは最高の研究パートナー。
感情を表に出すことは少ないが、勝利への執念は人一倍強い。
「敗因は必ずデータに現れる」と信じている。

【容姿】
透明感のある水色のボブヘア。
フリルやレースの少ない、シンプルでスタイリッシュな制服を着こなしている。
片目にモノクル（片眼鏡）型の小型ディスプレイを装着しており、常にゲームの勝率データを表示させている。`
    },
    {
        name: "アムール (Amour)",
        color: "PINK",
        role: "愛と芸術のロマンチスト",
        image: "/CharacterWholeBody/Amour-w.png",
        description: `【性格】
ロマンチックで感情豊か。ゲームを「芸術」として捉えており、美しい配置を追求する。
自分の陣地を「愛の城」と呼び、他人に侵略されると大げさに落ち込む。
ロッカの攻撃性を「熱い情熱！」と評価しつつ、配置の雑さは指摘する。

【容姿】
砂糖菓子のように甘いパステルピンクのツインテール。
制服には自分でデコレーションしたハートや星のアクセサリーをたくさん付けている。
常に笑顔で、フワフワした素材のバッグを持っている。`
    },
    {
        name: "ソレイユ (Soleil)",
        color: "ORANGE",
        role: "天真爛漫なムードメーカー",
        image: "/CharacterWholeBody/Soleil-w.png",
        description: `【性格】
太陽のように明るくポジティブなムードメーカー。場が暗くなると、すぐに冗談を言って笑わせようとする。
直感と運でピースを置くタイプで、その予測不能さが時に驚異的な戦略を生む。
「楽しくなきゃゲームじゃない！」が口癖で、勝ち負けよりもプロセスを重視。

【容姿】
小麦色の肌に、ビタミンカラーのオレンジ色のお団子ヘア。
動きやすいように、制服の袖を肘までまくっている。
大きなゴーグルを頭に乗せており、元気いっぱいのポーズが多い。`
    },
    {
        name: "ノワール (Noir)",
        color: "PURPLE",
        role: "孤高のミステリアスな魔女",
        image: "/CharacterWholeBody/Noir-w.png",
        description: `【性格】
無口で常に物静か。普段何を考えているか読み取りにくいため、部員からは「魔女」と呼ばれている。
最も少ないピース数で勝利することを美徳としており、不要なピースは極力置かないミニマリスト戦略家。
ピコのトリッキーな行動にも動じない冷静さを持つ。

【容姿】
艶やかなディープパープルのグラデーションヘアで、顔の半分ほどが影になっていることが多い。
制服の上に、星が散りばめられたようなロングカーディガンを羽織っている。
指には大きな銀の指輪をいくつかはめており、時々フッと微笑むのが魅力的。`
    },
    {
        name: "テラ (Terra)",
        color: "BROWN",
        role: "古代遺跡の守護者",
        image: "/CharacterWholeBody/Terra-w.png",
        description: `【性格】
古代宇宙文明の遺跡を守る一族の末裔。口数は少なく、任務に忠実な仕事人。
最新機器よりも、先祖代々伝わる古代の道具（レリック）を信頼している。
「古いものが弱いとは限らない」と静かに語り、堅実で崩しにくい手を打つ。

【容姿】
少し赤みがかった、くすんだブロンズ色の髪をきっちりまとめている。
制服の上に、古代の青銅製アーマーの一部（肩当てや籠手）を装着している。金属部分には古代文字が刻まれている。
背中には、大きな歯車やゼンマイがついた謎の古代装置を背負っている。`
    },
    {
        name: "ルナ (Luna)",
        color: "SILVER",
        role: "未来を見通す眠り姫",
        image: "/CharacterWholeBody/Luna-w.png",
        description: `【性格】
「……次の手、見えちゃった」が口癖。常に眠そうで、部室のソファで宙に浮きながら寝ている。
予知能力（直感）が鋭すぎて、逆に考えすぎて動けなくなることもある。
リズ（青）やミズキ（水色）が計算で導き出す答えを、寝言で言い当てて悔しがらせる。

【容姿】
光を反射するシルバーホワイトのロングヘア。重力に逆らって少しフワフワ浮いている。
制服の上から、サイズの大きい真っ白なパーカー（ウサギ耳付き）を被っている。
常に抱き枕（星型）を抱えている。`
    },
    {
        name: "オーラ (Aura)",
        color: "GOLD",
        role: "輝くゴージャスお嬢様",
        image: "/CharacterWholeBody/Aura-w.png",
        description: `【性格】
宇宙一の大富豪の娘で、超セレブな自信家。「勝利も輝きも、全て私のもの！」が口癖。
高飛車だが、実は努力家で、最高の家庭教師（AI）をつけて戦略を学んでいる。
使うピースも純金製（という設定）で、置くたびにキラキラしたエフェクトが出るのを好む。

【容姿】
まばゆく輝くウェーブのかかったブロンド（金色）ヘア。縦ロール気味。
制服が隠れるほど、金の刺繍や宝石の装飾がジャラジャラついたマントを羽織っている。
頭には小さなティアラを乗せ、常に扇子（もちろん金色）を優雅に仰いでいる。`
    },
    {
        name: "？？？",
        color: "BLACK",
        role: "正体不明の謎の存在",
        image: "/CharacterWholeBody/？？？-w.png",
        description: `【作者より】
ここまで遊んでくれて本当にありがとう！
これからもConnectCornersをよろしくお願いします！`
    }
];

export const CharacterIntroModal: React.FC<CharacterIntroModalProps> = ({ isOpen, onClose }) => {
    const [page, setPage] = useState(0);
    const [unlockedCharacters, setUnlockedCharacters] = useState<typeof CHARACTERS_DATA>([]);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const stats = getStats();
            const unlocked = stats.unlockedAchievements;

            // Calculate allBaseUnlocked
            const baseAchievementIds = ACHIEVEMENTS.filter(a => !a.isHidden).map(a => a.id);
            const allBaseUnlocked = baseAchievementIds.every(id => unlocked.includes(id));

            const filtered = CHARACTERS_DATA.filter(char => {
                const condition = UNLOCK_CONDITIONS[char.color as PlayerColor];
                if (!condition) return true; // Always unlocked (Blue, Red, Green, Yellow)

                const achievement = ACHIEVEMENTS.find(a => a.id === condition);

                // If it's a hidden achievement, check if it's unlocked OR if all base achievements are unlocked (which reveals hidden ones in Lobby, but here we probably only want to show if actually unlocked? 
                // Wait, Lobby logic for hidden characters:
                // if (achievement?.isHidden && !allBaseUnlocked && isLocked) { return null; }
                // This means if it's hidden and locked, don't show.
                // If it's hidden and unlocked, show.
                // If it's hidden and locked but allBaseUnlocked is true, show (as locked).

                // For the modal, the user said "only unlocked characters". 
                // So we should strictly check if the condition is in unlockedAchievements.
                return unlocked.includes(condition);
            });

            setUnlockedCharacters(filtered);
            setPage(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [page]);

    const handleNext = () => {
        if (page < unlockedCharacters.length - 1) {
            setPage(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    if (unlockedCharacters.length === 0) return null;

    const currentCharacter = unlockedCharacters[page];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl w-full h-[600px] bg-[#fdfbf7] border-[#e6e2d3] text-slate-800 flex flex-col p-0 overflow-hidden shadow-2xl">
                <div className="flex flex-1 h-full">
                    {/* Left Side - Image */}
                    <div className="w-1/2 bg-slate-100 relative flex items-center justify-center overflow-hidden border-r border-[#e6e2d3]">
                        <div className="relative w-full h-full">
                            <Image
                                src={currentCharacter.image}
                                alt={currentCharacter.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Side - Text */}
                    <div className="w-1/2 flex flex-col h-full">
                        {/* Fixed Title Section */}
                        <div className="px-8 pt-8 sm:px-12 sm:pt-12 pb-4">
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-amber-600 tracking-widest uppercase">
                                    Character {page + 1} / {unlockedCharacters.length}
                                </span>
                                <DialogTitle className={`text-2xl sm:text-3xl font-bold text-slate-900 leading-tight ${yomogi.className}`}>
                                    {currentCharacter.name}
                                </DialogTitle>
                                <p className={`text-lg text-amber-700 font-medium ${yomogi.className}`}>
                                    {currentCharacter.role}
                                </p>
                            </div>
                            <div className="w-12 h-1 bg-amber-400 rounded-full mt-6" />
                        </div>

                        {/* Scrollable Description */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto px-8 pb-8 sm:px-12 sm:pb-12 pt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-amber-300"
                        >
                            <p className={`text-slate-700 leading-loose text-lg font-medium whitespace-pre-wrap ${yomogi.className}`}>
                                {currentCharacter.description}
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
                                    前のキャラ
                                </Button>

                                <div className="flex gap-1">
                                    {unlockedCharacters.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === page ? 'bg-amber-500 w-3' : 'bg-slate-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {page === unlockedCharacters.length - 1 ? (
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
