import { PlayerColor } from './types';

export interface Character {
    id: string;
    name: string;
    japaneseName: string;
    color: PlayerColor;
    description: string;
    imagePath: string;
    personality: string;
    appearance: string;
    specialPieceShape: number[][];
}

export const CHARACTERS: Record<PlayerColor, Character> = {
    BLUE: {
        id: 'riz',
        name: 'Riz',
        japaneseName: 'リズ',
        color: 'BLUE',
        description: '冷静沈着なリーダー格（青）\nポリゴ星人の「リズ（Riz）」',
        imagePath: '/Character/Riz.png',
        personality: '成績優秀で、幾何学を愛する真面目な性格。\n常に数手先を読む理論派だが、想定外の動き（特にビットの行動）には弱い。\n「角を制する者は宇宙を制す」が口癖。',
        appearance: '透き通るようなサファイアブルーのロングヘア。\n目には六角形の模様が浮かぶコンタクトレンズをしている。\n制服を着崩さずピシッと着ており、幾何学的なカクカクしたデザインのヘアアクセサリーを付けている。',
        specialPieceShape: [[1, 1, 1, 1, 1, 1]] // Long Bar
    },
    RED: {
        id: 'rocca',
        name: 'Rocca',
        japaneseName: 'ロッカ',
        color: 'RED',
        description: '猪突猛進のエースアタッカー（赤）\nスパイク星人の「ロッカ（Rocca）」',
        imagePath: '/Character/Rocca.png',
        personality: '情熱的で負けず嫌い。「細かいことはいいからドーンと行こう！」がモットー。\n攻撃的な配置が得意で、相手の陣地に切り込むのが大好き。\n部活の後は、よくみんなを激辛宇宙ラーメン屋に誘う。',
        appearance: '燃えるようなルビーレッドのショートカットで、毛先がツンツン跳ねている。\nスポーティーなパーカーを制服の上から羽織っている。\n頬に絆創膏を貼っており、八重歯がチャームポイント。',
        specialPieceShape: [[1, 1, 0], [1, 1, 1], [0, 1, 0]] // Heart-ish
    },
    GREEN: {
        id: 'mallo',
        name: 'Mallo',
        japaneseName: 'マロ',
        color: 'GREEN',
        description: 'おっとり癒やし系の守護神（緑）\nプラント星人の「マロ（Mallo）」',
        imagePath: '/Character/Mallo.png',
        personality: '争いごとは苦手だが、守りに入ると鉄壁の強さを誇る。\n「みんなの居場所（陣地）を守りたいの」と言いながら、着実に自分のエリアを広げる。\nマイペースで、対局中に宇宙植物にお水をあげ始めることがある。',
        appearance: 'ふわふわとしたエメラルドグリーンのウェーブヘア。\n大きな丸眼鏡をかけており、制服はロングスカートスタイル。\n常に謎の小さな植物の妖精（ペット）が肩に乗っている。',
        specialPieceShape: [[1, 0], [1, 0], [1, 0], [1, 0], [1, 1]] // Big L
    },
    YELLOW: {
        id: 'pico',
        name: 'Pico',
        japaneseName: 'ピコ',
        color: 'YELLOW',
        description: '神出鬼没のトリックスター（黄）\nビット星人の「ピコ（Pico）」',
        imagePath: '/Character/Pico.png',
        personality: 'イタズラ好きで、セオリー無視の変な手を打つのが大好き。\n「ここ繋げたら面白くない？」と、誰も予想しない場所にピースを置いて場を混乱させる天才肌。\n最新のガジェットオタクで、ゲーム盤のホログラム改造を担当している。',
        appearance: '鮮やかなネオンイエローのツインテール。\nヘッドフォンを首にかけ、制服に缶バッジや電脳アクセサリーをジャラジャラつけている「デコラ系」。\n手には常に携帯ゲーム機かタブレットを持っている。',
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [0, 1, 0], [0, 1, 0]] // Cross
    },
    LIGHTBLUE: {
        id: 'mizuki',
        name: 'Mizuki',
        japaneseName: 'ミズキ',
        color: 'LIGHTBLUE',
        description: '理知的なクールビューティー（水色）\nクリスタル星人の「ミズキ（Mizuki）」',
        imagePath: '/Character/Mizuki.png',
        personality: '頭脳明晰で論理的。データ分析が得意で、リズとは最高の研究パートナー。\n感情を表に出すことは少ないが、勝利への執念は人一倍強い。\n「敗因は必ずデータに現れる」と信じている。',
        appearance: '透明感のある水色のボブヘア。\nフリルやレースの少ない、シンプルでスタイリッシュな制服を着こなしている。\n片目にモノクル（片眼鏡）型の小型ディスプレイを装着しており、常にゲームの勝率データを表示させている。',
        specialPieceShape: [[1, 0, 0], [1, 1, 0], [0, 1, 1], [0, 0, 1]] // Stairs
    },
    PINK: {
        id: 'amour',
        name: 'Amour',
        japaneseName: 'アムール',
        color: 'PINK',
        description: '愛と芸術のロマンチスト（ピンク）\nハート星人の「アムール（Amour）」',
        imagePath: '/Character/Amour.png',
        personality: 'ロマンチックで感情豊か。ゲームを「芸術」として捉えており、美しい配置を追求する。\n自分の陣地を「愛の城」と呼び、他人に侵略されると大げさに落ち込む。\nロッカの攻撃性を「熱い情熱！」と評価しつつ、配置の雑さは指摘する。',
        appearance: '砂糖菓子のように甘いパステルピンクのツインテール。\n制服には自分でデコレーションしたハートや星のアクセサリーをたくさん付けている。\n常に笑顔で、フワフワした素材のバッグを持っている。',
        specialPieceShape: [[0, 0, 1], [0, 1, 1], [1, 1, 1]] // Pyramid
    },
    ORANGE: {
        id: 'soleil',
        name: 'Soleil',
        japaneseName: 'ソレイユ',
        color: 'ORANGE',
        description: '天真爛漫なムードメーカー（オレンジ）\nサンド星人の「ソレイユ（Soleil）」',
        imagePath: '/Character/Soleil.png',
        personality: '太陽のように明るくポジティブなムードメーカー。場が暗くなると、すぐに冗談を言って笑わせようとする。\n直感と運でピースを置くタイプで、その予測不能さが時に驚異的な戦略を生む。\n「楽しくなきゃゲームじゃない！」が口癖で、勝ち負けよりもプロセスを重視。',
        appearance: '小麦色の肌に、ビタミンカラーのオレンジ色のお団子ヘア。\n動きやすいように、制服の袖を肘までまくっている。\n大きなゴーグルを頭に乗せており、元気いっぱいのポーズが多い。',
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [1, 0, 1]] // Star-ish
    },
    PURPLE: {
        id: 'noir',
        name: 'Noir',
        japaneseName: 'ノワール',
        color: 'PURPLE',
        description: '孤高のミステリアスな魔女（紫）\nシャドウ星人の「ノワール（Noir）」',
        imagePath: '/Character/Noir.png',
        personality: '無口で常に物静か。普段何を考えているか読み取りにくいため、部員からは「魔女」と呼ばれている。\n最も少ないピース数で勝利することを美徳としており、不要なピースは極力置かないミニマリスト戦略家。\nピコのトリッキーな行動にも動じない冷静さを持つ。',
        appearance: '艶やかなディープパープルのグラデーションヘアで、顔の半分ほどが影になっていることが多い。\n制服の上に、星が散りばめられたようなロングカーディガンを羽織っている。\n指には大きな銀の指輪をいくつかはめており、時々フッと微笑むのが魅力的。',
        specialPieceShape: [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0]] // Hook
    },
    BROWN: {
        id: 'terra',
        name: 'Terra',
        japaneseName: 'テラ',
        color: 'BROWN',
        description: '古代遺跡の守護者（ブロンズ・青銅）\nレリック星人の「テラ（Terra）',
        imagePath: '/Character/Terra.png',
        personality: '古代宇宙文明の遺跡を守る一族の末裔。口数は少なく、任務に忠実な仕事人。\n最新機器よりも、先祖代々伝わる古代の道具（レリック）を信頼している。\n「古いものが弱いとは限らない」と静かに語り、堅実で崩しにくい手を打つ。',
        appearance: "少し赤みがかった、くすんだブロンズ色の髪をきっちりまとめている。\n制服の上に、古代の青銅製アーマーの一部（肩当てや籠手）を装着している。金属部分には古代文字が刻まれている。\n背中には、大きな歯車やゼンマイがついた謎の古代装置を背負っている。",
        specialPieceShape: [[1, 1, 1], [1, 1, 1]] // 2x3 Block (6 squares)
    },
    SILVER: {
        id: 'luna',
        name: 'Luna',
        japaneseName: 'ルナ',
        color: 'SILVER',
        description: '未来を見通す眠り姫（シルバー・銀）\nムーン星人の「ルナ（Luna）',
        imagePath: '/Character/Luna.png',
        personality: '「……次の手、見えちゃった」が口癖。常に眠そうで、部室のソファで宙に浮きながら寝ている。\n予知能力（直感）が鋭すぎて、逆に考えすぎて動けなくなることもある。\nリズ（青）やミズキ（水色）が計算で導き出す答えを、寝言で言い当てて悔しがらせる。',
        appearance: "光を反射するシルバーホワイトのロングヘア。重力に逆らって少しフワフワ浮いている。\n制服の上から、サイズの大きい真っ白なパーカー（ウサギ耳付き）を被っている。\n常に抱き枕（星型）を抱えている。",
        specialPieceShape: [[1, 1, 0], [1, 0, 0], [1, 1, 1]] // Crescent-ish (6 squares)
    },
    GOLD: {
        id: 'aura',
        name: 'Aura',
        japaneseName: 'オーラ',
        color: 'GOLD',
        description: '輝くゴージャスお嬢様（ゴールド・金）\nジュエル星人の「オーラ（Aura）',
        imagePath: '/Character/Aura.png',
        personality: '宇宙一の大富豪の娘で、超セレブな自信家。「勝利も輝きも、全て私のもの！」が口癖。\n高飛車だが、実は努力家で、最高の家庭教師（AI）をつけて戦略を学んでいる。\n使うピースも純金製（という設定）で、置くたびにキラキラしたエフェクトが出るのを好む。',
        appearance: "まばゆく輝くウェーブのかかったブロンド（金色）ヘア。縦ロール気味。\n制服が隠れるほど、金の刺繍や宝石の装飾がジャラジャラついたマントを羽織っている。\n頭には小さなティアラを乗せ、常に扇子（もちろん金色）を優雅に仰いでいる。",
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [0, 1, 0], [0, 1, 0]] // Cross-plus (6 squares)
    },
    BLACK: {
        id: 'unknown',
        name: '???',
        japaneseName: '？？？',
        color: 'BLACK',
        description: '全てを極めし謎の存在（ブラック・黒）',
        imagePath: '/Character/？？？.png',
        personality: '不明。',
        appearance: "不明。",
        specialPieceShape: [[1, 0, 1], [1, 1, 1], [0, 1, 0]] // Mystery Shape (6 squares)
    }
};
