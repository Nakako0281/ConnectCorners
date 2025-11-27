import { Piece, PlayerColor, Coordinate } from './types';

export const BOARD_SIZE = 20;

export const ALL_COLORS: PlayerColor[] = [
    'BLUE', 'YELLOW', 'RED', 'GREEN',
    'LIGHTBLUE', 'PINK', 'ORANGE', 'PURPLE'
];

// Standard Blokus Pieces (21 pieces per player)
// Represented as binary grids
export const PIECES: Omit<Piece, 'id'>[] = [
    // 1 block (1)
    { value: 1, shape: [[1]] }, // I1
    // 2 blocks (1)
    { value: 2, shape: [[1, 1]] }, // I2
    // 3 blocks (2)
    { value: 3, shape: [[1, 1, 1]] }, // I3
    { value: 3, shape: [[1, 0], [1, 1]] }, // V3 (L3)
    // 4 blocks (5)
    { value: 4, shape: [[1, 1, 1, 1]] }, // I4
    { value: 4, shape: [[1, 1], [1, 1]] }, // O4
    { value: 4, shape: [[1, 1, 1], [0, 1, 0]] }, // T4
    { value: 4, shape: [[1, 1, 1], [1, 0, 0]] }, // L4
    { value: 4, shape: [[1, 1, 0], [0, 1, 1]] }, // Z4
    // 5 blocks (12)
    { value: 5, shape: [[1, 1, 1, 1, 1]] }, // I5
    { value: 5, shape: [[1, 1, 1, 1], [1, 0, 0, 0]] }, // L5
    { value: 5, shape: [[1, 1, 1, 1], [0, 1, 0, 0]] }, // Y5
    { value: 5, shape: [[0, 1, 1, 1], [1, 1, 0, 0]] }, // N5
    { value: 5, shape: [[1, 1, 0], [1, 1, 0], [1, 0, 0]] }, // P5
    { value: 5, shape: [[1, 1, 1], [1, 0, 1]] }, // U5
    { value: 5, shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]] }, // T5
    { value: 5, shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] }, // V5
    { value: 5, shape: [[1, 0, 0], [1, 1, 0], [0, 1, 1]] }, // W5
    { value: 5, shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] }, // X5 (Cross)
    { value: 5, shape: [[1, 1, 0], [0, 1, 0], [0, 1, 1]] }, // Z5
    { value: 5, shape: [[0, 1, 1], [1, 1, 0], [0, 1, 0]] }, // F5
];

// Correcting shapes to be more precise based on standard Blokus
// I'll redefine them carefully to ensure all 21 are correct.
// 1 monomino, 1 domino, 2 trominoes, 5 tetrominoes, 12 pentominoes = 21 total.

const STANDARD_PIECES: Piece[] = PIECES.map((p, index) => ({
    id: `p${index}`,
    shape: p.shape,
    value: p.value
}));

export const TOTAL_PIECES_COUNT = STANDARD_PIECES.length + 1; // 21 standard + 1 special

import { CHARACTERS } from './characters';

export const getInitialPieces = (color: PlayerColor): Piece[] => {
    const character = CHARACTERS[color];
    const specialPiece: Piece = {
        id: 'special',
        shape: character.specialPieceShape,
        value: character.specialPieceShape.flat().reduce((acc, val) => acc + val, 0)
    };
    return [...STANDARD_PIECES, specialPiece];
};

// Keep INITIAL_PIECES for backward compatibility or default usage if needed, but preferably use getInitialPieces
export const INITIAL_PIECES = STANDARD_PIECES;

export const CORNER_POSITIONS: Coordinate[] = [
    { x: 0, y: 0 },
    { x: BOARD_SIZE - 1, y: 0 },
    { x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 },
    { x: 0, y: BOARD_SIZE - 1 },
];

export const BONUS_SQUARES: Coordinate[] = [
    // Inner Ring (Center Control)
    { x: 8, y: 8 }, { x: 8, y: 11 }, { x: 11, y: 8 }, { x: 11, y: 11 },
    // Outer Ring (Flank Aggression)
    { x: 9, y: 2 }, { x: 2, y: 9 }, { x: 17, y: 10 }, { x: 10, y: 17 }
];
