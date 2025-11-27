import { Piece, PlayerColor, Coordinate } from './types';

export const BOARD_SIZE = 20;

export const ALL_COLORS: PlayerColor[] = [
    'BLUE', 'YELLOW', 'RED', 'GREEN',
    'LIGHTBLUE', 'PINK', 'ORANGE', 'PURPLE'
];

// Standard Blokus Pieces (21 pieces per player)
// Represented as binary grids
export const PIECES: Omit<Piece, 'id'>[] = [
    // 1 block
    { value: 1, shape: [[1]] },
    // 2 blocks
    { value: 2, shape: [[1, 1]] },
    // 3 blocks
    { value: 3, shape: [[1, 1, 1]] },
    { value: 3, shape: [[1, 0], [1, 1]] }, // L3
    // 4 blocks
    { value: 4, shape: [[1, 1, 1, 1]] }, // I4
    { value: 4, shape: [[1, 1, 1], [0, 1, 0]] }, // T4
    { value: 4, shape: [[1, 1, 1], [1, 0, 0]] }, // L4
    { value: 4, shape: [[1, 1], [1, 1]] }, // O4
    { value: 4, shape: [[1, 1, 0], [0, 1, 1]] }, // Z4
    // 5 blocks
    { value: 5, shape: [[1, 1, 1, 1, 1]] }, // I5
    { value: 5, shape: [[1, 1, 1, 1], [1, 0, 0, 0]] }, // L5
    { value: 5, shape: [[1, 1, 1, 1], [0, 1, 0, 0]] }, // Y5
    { value: 5, shape: [[1, 1, 1], [1, 1, 0]] }, // P5
    { value: 5, shape: [[1, 1, 1], [1, 0, 1]] }, // U5
    { value: 5, shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]] }, // T5
    { value: 5, shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] }, // V5
    { value: 5, shape: [[1, 1, 0], [0, 1, 1], [0, 0, 1]] }, // N5
    { value: 5, shape: [[1, 1, 0], [0, 1, 1], [0, 1, 0]] }, // F5
    { value: 5, shape: [[1, 1, 0], [0, 1, 0], [0, 1, 1]] }, // X5 (Wait, X5 is cross) -> [[0,1,0],[1,1,1],[0,1,0]]
    { value: 5, shape: [[1, 0, 0], [1, 1, 1], [0, 0, 1]] }, // Z5
    { value: 5, shape: [[1, 1, 0], [0, 1, 1], [0, 0, 1]] }, // W5
];

// Correcting shapes to be more precise based on standard Blokus
// I'll redefine them carefully to ensure all 21 are correct.
// 1 monomino, 1 domino, 2 trominoes, 5 tetrominoes, 12 pentominoes = 21 total.

const RAW_SHAPES = [
    // 1 (1)
    [[1]],
    // 2 (1)
    [[1, 1]],
    // 3 (2)
    [[1, 1, 1]],
    [[1, 1], [1, 0]],
    // 4 (5)
    [[1, 1, 1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    // 5 (12)
    [[1, 1, 1, 1, 1]], // I5
    [[1, 1, 1, 1], [1, 0, 0, 0]], // L5
    [[1, 1, 1, 1], [0, 1, 0, 0]], // Y
    [[1, 1, 0], [0, 1, 1], [0, 1, 0]], // F
    [[1, 1, 0], [0, 1, 1], [0, 0, 1]], // W (This was duplicated/wrong in previous list)
    [[1, 1, 1], [1, 1, 0]], // P
    [[1, 1, 1], [1, 0, 1]], // U
    [[1, 1, 1], [0, 1, 0], [0, 1, 0]], // T5
    [[1, 1, 1], [0, 0, 1], [0, 0, 1]], // V5
    [[1, 1, 0, 0], [0, 1, 1, 1]], // N (Z5 long)
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // X
    [[1, 0, 0], [1, 1, 1], [0, 0, 1]], // Z5
];

export const INITIAL_PIECES: Piece[] = RAW_SHAPES.map((shape, index) => ({
    id: `p${index}`,
    shape,
    value: shape.flat().reduce((acc, val) => acc + val, 0)
}));

export const CORNER_POSITIONS: Coordinate[] = [
    { x: 0, y: 0 },
    { x: BOARD_SIZE - 1, y: 0 },
    { x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 },
    { x: 0, y: BOARD_SIZE - 1 },
];
