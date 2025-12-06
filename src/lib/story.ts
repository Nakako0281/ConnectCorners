export type StoryContentItem =
    | { type: 'text'; text: string }
    | { type: 'dialogue'; speaker: string; icon: string; text: string };

export interface StoryPage {
    title: string;
    content: StoryContentItem[];
    image: string;
}

export interface StoryChapter {
    id: string;
    title: string;
    description: string; // Used for chapter selection card
    pages: StoryPage[];
    unlockCondition?: 'base_achievements'; // Future-proofing
}

export const STORY_CHAPTERS: StoryChapter[] = [
    {
        id: 'chapter1',
        title: '第一章：戦略ゲーム部、始動！',
        description: 'すべての始まり。ユニバース・ハイスクールの4人が出会い、ライバル校との激闘に挑むまでの物語。',
        pages: [
            {
                title: "平和な日常と、嵐の予感",
                content: [
                    { type: 'text', text: '銀河の辺境に浮かぶ学び舎、「ユニバース・ハイスクール」。\n放課後の部室棟の一角、「ピースバトル戦略ゲーム部」では、いつものように4人の少女たちが盤面を囲んでいた。' },
                    { type: 'dialogue', speaker: 'リズ', icon: 'Riz.webp', text: '「そこ、角を取れば理論上は勝率85%アップよ」' },
                    { type: 'text', text: 'と眼鏡を光らせるリズ。' },
                    { type: 'dialogue', speaker: 'ロッカ', icon: 'Rocca.webp', text: '「細かい確率はいいの！ ドーンと攻めれば道は開ける！」' },
                    { type: 'text', text: 'と強引にピースをねじ込むロッカ。' },
                    { type: 'dialogue', speaker: 'マロ', icon: 'Mallo.webp', text: '「あ、お花にお水あげなきゃ……でも、ここは通さないよ？」' },
                    { type: 'text', text: 'とニコニコしながら鉄壁の守りを築くマロ。' },
                    { type: 'text', text: 'そして、' },
                    { type: 'dialogue', speaker: 'ピコ', icon: 'Pico.webp', text: '「へへっ、ここを繋げたら盤面がピカピカ光る改造しちゃった！」' },
                    { type: 'text', text: 'とルール無用で場を乱すピコ。\n\n凸凹な4人だが、チームワークは抜群な仲良し4人組である。' }
                ],
                image: "/Story/story1.webp"
            },
            {
                title: "ライバル校、来襲",
                content: [
                    { type: 'text', text: 'ある日、部室のドアが勢いよく開かれた。現れたのは、銀河のエリート校「セレスティア女学院」の制服に身を包んだ4人の生徒たち。' },
                    { type: 'dialogue', speaker: 'ミズキ', icon: 'Mizuki.webp', text: '「ごきげんよう。ここが噂の戦略ゲーム部ですか？」' },
                    { type: 'text', text: '冷静な眼差しで部室を見渡すミズキ。' },
                    { type: 'dialogue', speaker: 'アムール', icon: 'Amour.webp', text: '「あら、部室のレイアウトに美学を感じないわね……愛が足りないわ」' },
                    { type: 'text', text: 'と嘆くアムール。' },
                    { type: 'dialogue', speaker: 'ソレイユ', icon: 'Soleil.webp', text: '「堅いこと言わないでさ！ 一緒に遊ぼうよ～！」' },
                    { type: 'text', text: 'と元気いっぱいに飛び跳ねるソレイユ。\nそして、無言で静かに盤面の前に座り、不敵なプレッシャーを放つノワール。\n\n彼女たちは、年に一度の「銀河ハイスクール交流戦」のためにやってきた、最強のライバルたちだったのだ。' }
                ],
                image: "/Story/story2.webp"
            },
            {
                title: "戦いの本当の理由（ワケ）",
                content: [
                    { type: 'text', text: '本来なら友好的な親善試合で終わるはずだった。\nしかし、顧問の先生が持ち込んだ「勝利チームへの賞品」が、事態を一変させる。\n\n『学食限定・幻の“流星レインボープリン” 4人分引換券』\n\nそれは、1日に数個しか作られない、銀河一美味と噂される幻のスイーツ。\n部活終わりの激辛ラーメンを楽しみにしていたロッカも、これには目の色を変えた。' },
                    { type: 'dialogue', speaker: 'ロッカ', icon: 'Rocca.webp', text: '「激辛の後のプリン……最高じゃない！」' },
                    { type: 'dialogue', speaker: 'リズ', icon: 'Riz.webp', text: '「甘味による脳の活性化は、次の研究に必要不可欠ね」' },
                    { type: 'text', text: 'とリズが計算を始める。' },
                    { type: 'dialogue', speaker: 'マロ', icon: 'Mallo.webp', text: '「えへへ、食べてみたいな」' },
                    { type: 'text', text: 'とマロも珍しく乗り気。' },
                    { type: 'dialogue', speaker: 'ピコ', icon: 'Pico.webp', text: '「プリンの揺れ方を解析したい！」' },
                    { type: 'text', text: 'とピコも興奮。\n\nしかし、それはセレスティア女学院のメンバーも同じだった。' },
                    { type: 'dialogue', speaker: 'ミズキ', icon: 'Mizuki.webp', text: '「データによれば、そのプリンの糖度は至高。譲るわけにはいかないわ」' },
                    { type: 'dialogue', speaker: 'アムール', icon: 'Amour.webp', text: '「美しきプリンこそ、愛の城の住人にふさわしい！」' },
                    { type: 'dialogue', speaker: 'ソレイユ', icon: 'Soleil.webp', text: '「食べたーい！ 勝った方がもらえるんだよね？ 燃えてきた！」' },
                    { type: 'dialogue', speaker: 'ノワール', icon: 'Noir.webp', text: '「……（コクリ）」' },
                    { type: 'text', text: 'ノワールも静かに闘志を燃やした。' }
                ],
                image: "/Story/story3.webp"
            },
            {
                title: "バトルスタート！",
                content: [
                    { type: 'text', text: 'かくして、学校の威信と、幻のスイーツを懸けた、負けられない戦いの火蓋が切って落とされた。\n\n理論派のリズ vs 分析家のミズキ。\n情熱のロッカ vs 美学のアムール。\n鉄壁のマロ vs 陽気なソレイユ。\n混沌のピコ vs 静寂のノワール。\n\n互いの性格、戦略、そして「食欲」がぶつかり合う、銀河一賑やかなピースバトルの幕開けだ！' }
                ],
                image: "/Story/story4.webp"
            }
        ]
    },
    {
        id: 'chapter2',
        title: '第二章：新たなる脅威',
        description: '交流戦の結末、そして突如現れた謎の巨大財閥令嬢。黄金の輝きが部室を包み込むとき、かつてない戦いが幕を開ける。',
        unlockCondition: 'base_achievements',
        pages: [
            {
                title: "ノーサイド、そしてプリン同盟",
                content: [
                    { type: 'text', text: '激闘の末、盤上はすべてのピースで埋め尽くされ、結果はまさかの「完全引き分け（ドロー）」。\n互いの健闘を称え合った両校のメンバーは、先生が「引き分けなら半分こね」と差し出した8等分の「流星レインボープリン」を囲んでいた。' },
                    { type: 'dialogue', speaker: 'ミズキ', icon: 'Mizuki.webp', text: '「悔しいけど、あの最後の一手、計算外だったわ」' },
                    { type: 'text', text: 'とミズキが眼鏡の位置を直せば、' },
                    { type: 'dialogue', speaker: 'リズ', icon: 'Riz.webp', text: '「そっちこそ、私の直感を封じ込めるなんてやるじゃない」' },
                    { type: 'text', text: 'とリズが不敵に笑う。\nロッカとアムールは' },
                    { type: 'dialogue', speaker: 'ロッカ', icon: 'Rocca.webp', text: '「熱い魂を感じた！」' },
                    { type: 'dialogue', speaker: 'アムール', icon: 'Amour.webp', text: '「美しい情熱的な愛だったわ！」' },
                    { type: 'text', text: 'と意気投合し、マロとソレイユ、ノワールはニコニコとプリンを頬張っている。\nピコはなぜかプリンの揺れを動画に収めていた。\n\n昨日の敵は今日の友。美味しいプリンを前に、部室には学校の垣根を超えた「戦略ゲーム同盟」が結成されたのだった。' },
                    { type: 'dialogue', speaker: 'ソレイユ', icon: 'Soleil.webp', text: '「これからも合同練習しようよ！」' },
                    { type: 'dialogue', speaker: 'リズ', icon: 'Riz.webp', text: '「ええ、望むところよ」' },
                    { type: 'text', text: 'そんな和やかな空気が、突如として破られることになる。' }
                ],
                image: "/Story/story5.webp"
            },
            {
                title: "黄金の輝き、部室を制圧！？",
                content: [
                    { type: 'dialogue', speaker: '？？？', icon: 'Aura.webp', text: '「おーっほっほっほ！ おーっほっほっほ！！」' },
                    { type: 'text', text: '部室の空気を切り裂くような高笑いとともに、窓ガラスがガタガタと震えた。まばゆい黄金の光が差し込み、\nそこに立っていたのは、目がくらむほど豪華絢爛なドレスとマントを身にまとった、優雅に扇子を仰ぐ少女だった。' },
                    { type: 'dialogue', speaker: 'オーラ', icon: 'Aura.webp', text: '「むさ苦しい部室ですわね。ここを私の『別荘兼・戦略ゲーム保管庫』に改装しますわ」' },
                    { type: 'text', text: '彼女の名はオーラ。宇宙全土にチェーン展開する超巨大財閥の令嬢だ。' },
                    { type: 'dialogue', speaker: 'ロッカ', icon: 'Rocca.webp', text: '「な、なによあんた！ いきなり入ってきて！」' },
                    { type: 'text', text: 'とロッカが吠えるが、オーラは全く動じない。' },
                    { type: 'dialogue', speaker: 'オーラ', icon: 'Aura.webp', text: '「あら、自己紹介が遅れましたわね。わたくしたちは、この銀河の戦略ゲーム界を統べる（予定の）BIG3。あなたたちのようなアマチュアとは、格が違いましてよ？」' },
                    { type: 'text', text: 'オーラが指を鳴らすと、彼女の後ろから、異様な雰囲気を纏った2人の影が現れた。' }
                ],
                image: "/Story/story6.webp"
            },
            {
                title: "過去と未来",
                content: [
                    { type: 'dialogue', speaker: 'テラ', icon: 'Terra.webp', text: '「……やれやれ。これだから最近の若者は。礼儀も作法もなっていない」' },
                    { type: 'text', text: '重厚な金属音を響かせて進み出てきたのは、くすんだ赤銅色の古代アーマーを身につけたテラだった。' },
                    { type: 'dialogue', speaker: 'テラ', icon: 'Terra.webp', text: '「我が一族に伝わる古のレリック（遺物）に比べれば、貴様らの使う最新式ボードなど、ただのおもちゃに過ぎん」' },
                    { type: 'text', text: '彼女が持つピースは、見たこともない古代金属でできており、鈍く、しかし重厚な威圧感を放っている。\n\nその頭上、天井付近をふわふわと浮遊している少女がいた。' },
                    { type: 'dialogue', speaker: 'ルナ', icon: 'Luna.webp', text: '「……んぅ……あ、終わった？」' },
                    { type: 'text', text: 'ルナは大きな星型の抱き枕にしがみつき、ウサギ耳のパーカーを深く被ったまま眠たげに呟く。' },
                    { type: 'dialogue', speaker: 'ルナ', icon: 'Luna.webp', text: '「……戦う前から、結果見えちゃった。……私達の勝ち。おやすみ……」' },
                    { type: 'text', text: '彼女の周りには重力を無視したシルバーヘアが漂い、やる気はゼロだが、その瞳の奥には底知れない「予知」の光が宿っていた。' }
                ],
                image: "/Story/story7.webp"
            },
            {
                title: "立ち上がれ、8人の絆！",
                content: [
                    { type: 'dialogue', speaker: 'ルナ', icon: 'Luna.webp', text: '「この部室は、私の昼寝に最適なの……だから、もらうね」' },
                    { type: 'text', text: 'とルナが寝言のように言う。' },
                    { type: 'dialogue', speaker: 'テラ', icon: 'Terra.webp', text: '「古代遺跡の静寂を守るため、この騒がしい場所は封印させてもらう」' },
                    { type: 'text', text: 'とテラが淡々と告げる。' },
                    { type: 'dialogue', speaker: 'オーラ', icon: 'Aura.webp', text: '「そして何より！ この私が勝利の輝きで満たすためにね！ さあ、かかってらっしゃい！」' },
                    { type: 'text', text: 'オーラが金色のピースを高々と掲げた。\n\n彼女たちの目的は、この部室の乗っ取り。そして、「銀河一の戦略チーム」の称号を力づくで奪うこと。\nあまりに理不尽な要求だが、目の前の3人は間違いなく強敵だ。放たれるプレッシャー（と金持ちオーラ）が桁違いなのだ。\n\nしかし、今のユニバース・ハイスクールとセレスティア女学院のメンバーに、恐れはなかった。' },
                    { type: 'dialogue', speaker: 'リズ', icon: 'Riz.webp', text: '「……確率は未知数。でも、今の私達なら計算式を超えられるわ」' },
                    { type: 'text', text: 'リズが眼鏡を押し上げる。' },
                    { type: 'dialogue', speaker: 'ミズキ', icon: 'Mizuki.webp', text: '「ええ。過去のデータも、未来の予知も、今の私たちの『結束』には勝てないわよ」' },
                    { type: 'text', text: 'ミズキも頷く。' },
                    { type: 'text', text: '8人は円陣を組み、それぞれのピースを握りしめる。' },
                    { type: 'text', text: '新旧入り乱れる、ハチャメチャなチーム戦。\n部室の存続をかけた「グランド・バトル」がいま、始まろうとしていた！' }
                ],
                image: "/Story/story8.webp"
            }
        ]
    }
];
