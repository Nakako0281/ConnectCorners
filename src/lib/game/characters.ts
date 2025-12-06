import { PlayerColor } from './types';

export interface Character {
    id: string;
    name: string;
    japaneseName: string;
    color: PlayerColor;
    description: string;
    imagePath: string;
    personality: string;
    specialPieceShape: number[][];
}

export const CHARACTERS: Record<PlayerColor, Character> = {
    BLUE: {
        id: 'riz',
        name: 'Riz',
        japaneseName: 'リズ',
        color: 'BLUE',
        description: '冷静沈着なリーダー格。幾何学を愛する理論派。',
        imagePath: '/Character/Riz.png',
        personality: '成績優秀で真面目。「角を制する者は宇宙を制す」が口癖。',
        specialPieceShape: [[1, 1, 1, 1, 1, 1]]
    },
    RED: {
        id: 'rocca',
        name: 'Rocca',
        japaneseName: 'ロッカ',
        color: 'RED',
        description: '猪突猛進のエースアタッカー。攻撃的な配置が得意。',
        imagePath: '/Character/Rocca.png',
        personality: '情熱的で負けず嫌い。「細かいことはいいからドーンと行こう！」がモットー。',
        specialPieceShape: [[1, 0, 0, 1], [1, 1, 1, 1]]
    },
    GREEN: {
        id: 'mallo',
        name: 'Mallo',
        japaneseName: 'マロ',
        color: 'GREEN',
        description: 'おっとり癒やし系の守護神。鉄壁の守りを誇る。',
        imagePath: '/Character/Mallo.png',
        personality: 'マイペースで争いごとは苦手。植物の妖精を連れている。',
        specialPieceShape: [[1, 0], [1, 0], [1, 1], [1, 1]]
    },
    YELLOW: {
        id: 'pico',
        name: 'Pico',
        japaneseName: 'ピコ',
        color: 'YELLOW',
        description: '神出鬼没のトリックスター。セオリー無視の変な手を打つ。',
        imagePath: '/Character/Pico.png',
        personality: 'イタズラ好きのガジェットオタク。場を混乱させるのが大好き。',
        specialPieceShape: [[1, 0, 0], [1, 1, 0], [0, 1, 1], [0, 0, 1]]
    },
    LIGHTBLUE: {
        id: 'mizuki',
        name: 'Mizuki',
        japaneseName: 'ミズキ',
        color: 'LIGHTBLUE',
        description: '理知的なクールビューティー。データ分析が得意。',
        imagePath: '/Character/Mizuki.png',
        personality: '頭脳明晰で論理的。「敗因は必ずデータに現れる」と信じている。',
        specialPieceShape: [[0, 1, 0], [1, 0, 1], [1, 1, 1]]
    },
    PINK: {
        id: 'amour',
        name: 'Amour',
        japaneseName: 'アムール',
        color: 'PINK',
        description: '愛と芸術のロマンチスト。美しい配置を追求する。',
        imagePath: '/Character/Amour.png',
        personality: '感情豊かで、自分の陣地を「愛の城」と呼ぶ。',
        specialPieceShape: [[0, 0, 1], [0, 1, 1], [1, 1, 1]]
    },
    ORANGE: {
        id: 'soleil',
        name: 'Soleil',
        japaneseName: 'ソレイユ',
        color: 'ORANGE',
        description: '天真爛漫なムードメーカー。直感と運で勝負する。',
        imagePath: '/Character/Soleil.png',
        personality: '明るくポジティブ。「楽しくなきゃゲームじゃない！」が口癖。',
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [1, 0, 1]]
    },
    PURPLE: {
        id: 'noir',
        name: 'Noir',
        japaneseName: 'ノワール',
        color: 'PURPLE',
        description: '孤高のミステリアスな魔女。最小手数での勝利を目指す。',
        imagePath: '/Character/Noir.png',
        personality: '無口で物静か。ミニマリスト戦略家。',
        specialPieceShape: [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0]]
    },
    BROWN: {
        id: 'terra',
        name: 'Terra',
        japaneseName: 'テラ',
        color: 'BROWN',
        description: '大地を司る巨人。圧倒的なパワーで盤面を制圧する。',
        imagePath: '/Character/Terra.png',
        personality: '豪快で力強い。「大地と共にあれ」が口癖。',
        specialPieceShape: [[1, 1, 1], [1, 1, 1]]
    },
    SILVER: {
        id: 'luna',
        name: 'Luna',
        japaneseName: 'ルナ',
        color: 'SILVER',
        description: '静寂を愛する月の使者。粘り強い戦いを得意とする。',
        imagePath: '/Character/Luna.png',
        personality: '神秘的で物静か。夜空を見上げるのが好き。',
        specialPieceShape: [[1, 1, 0], [1, 0, 0], [1, 1, 1]]
    },
    GOLD: {
        id: 'aura',
        name: 'Aura',
        japaneseName: 'オーラ',
        color: 'GOLD',
        description: '光り輝く高貴な存在。完璧な配置を求める。',
        imagePath: '/Character/Aura.png',
        personality: '気高く、少し高飛車。「美しく勝ちましょう」がモットー。',
        specialPieceShape: [[0, 1, 1, 0], [1, 1, 1, 1]]
    },
    BLACK: {
        id: 'unknown',
        name: '???',
        japaneseName: '？？？',
        color: 'BLACK',
        description: '全てを極めし謎の存在。',
        imagePath: '/Character/？？？.png',
        personality: '詳細不明。',
        specialPieceShape: [[1, 0, 0, 0], [1, 1, 1, 1], [0, 1, 0, 0]]
    }
};

export const UNLOCK_CONDITIONS: Record<PlayerColor, string | null> = {
    BLUE: null,
    RED: null,
    GREEN: null,
    YELLOW: null,
    LIGHTBLUE: 'first_win',
    PINK: 'perfect_game',
    ORANGE: 'veteran',
    PURPLE: 'win_streak_5',
    BROWN: 'hidden_high_scorer',
    SILVER: 'hidden_connect_master',
    GOLD: 'hidden_perfect_master',
    BLACK: 'complete_all',
};
