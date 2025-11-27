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
        specialPieceShape: [[1, 1, 1, 1, 1, 1]] // Long Bar
    },
    RED: {
        id: 'rocca',
        name: 'Rocca',
        japaneseName: 'ロッカ',
        color: 'RED',
        description: '猪突猛進のエースアタッカー。攻撃的な配置が得意。',
        imagePath: '/Character/Rocca.png',
        personality: '情熱的で負けず嫌い。「細かいことはいいからドーンと行こう！」がモットー。',
        specialPieceShape: [[1, 1, 0], [1, 1, 1], [0, 1, 0]] // Heart-ish
    },
    GREEN: {
        id: 'mallo',
        name: 'Mallo',
        japaneseName: 'マロ',
        color: 'GREEN',
        description: 'おっとり癒やし系の守護神。鉄壁の守りを誇る。',
        imagePath: '/Character/Mallo.png',
        personality: 'マイペースで争いごとは苦手。植物の妖精を連れている。',
        specialPieceShape: [[1, 0], [1, 0], [1, 0], [1, 0], [1, 1]] // Big L
    },
    YELLOW: {
        id: 'pico',
        name: 'Pico',
        japaneseName: 'ピコ',
        color: 'YELLOW',
        description: '神出鬼没のトリックスター。セオリー無視の変な手を打つ。',
        imagePath: '/Character/Pico.png',
        personality: 'イタズラ好きのガジェットオタク。場を混乱させるのが大好き。',
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [0, 1, 0], [0, 1, 0]] // Cross
    },
    LIGHTBLUE: {
        id: 'mizuki',
        name: 'Mizuki',
        japaneseName: 'ミズキ',
        color: 'LIGHTBLUE',
        description: '理知的なクールビューティー。データ分析が得意。',
        imagePath: '/Character/Mizuki.png',
        personality: '頭脳明晰で論理的。「敗因は必ずデータに現れる」と信じている。',
        specialPieceShape: [[1, 0, 0], [1, 1, 0], [0, 1, 1], [0, 0, 1]] // Stairs
    },
    PINK: {
        id: 'amour',
        name: 'Amour',
        japaneseName: 'アムール',
        color: 'PINK',
        description: '愛と芸術のロマンチスト。美しい配置を追求する。',
        imagePath: '/Character/Amour.png',
        personality: '感情豊かで、自分の陣地を「愛の城」と呼ぶ。',
        specialPieceShape: [[0, 0, 1], [0, 1, 1], [1, 1, 1]] // Pyramid
    },
    ORANGE: {
        id: 'soleil',
        name: 'Soleil',
        japaneseName: 'ソレイユ',
        color: 'ORANGE',
        description: '天真爛漫なムードメーカー。直感と運で勝負する。',
        imagePath: '/Character/Soleil.png',
        personality: '明るくポジティブ。「楽しくなきゃゲームじゃない！」が口癖。',
        specialPieceShape: [[0, 1, 0], [1, 1, 1], [1, 0, 1]] // Star-ish
    },
    PURPLE: {
        id: 'noir',
        name: 'Noir',
        japaneseName: 'ノワール',
        color: 'PURPLE',
        description: '孤高のミステリアスな魔女。最小手数での勝利を目指す。',
        imagePath: '/Character/Noir.png',
        personality: '無口で物静か。ミニマリスト戦略家。',
        specialPieceShape: [[1, 1, 1], [1, 0, 0], [1, 0, 0], [1, 0, 0]] // Hook
    }
};
