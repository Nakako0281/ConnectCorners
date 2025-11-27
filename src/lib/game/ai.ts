import { getAllValidMoves } from './logic';
import { BoardState, Piece, PlayerColor } from './types';

export function getAIMove(
    board: BoardState,
    pieces: Piece[],
    playerColor: PlayerColor,
    isFirstMove: boolean,
    startPosition?: import('./types').Coordinate
) {
    const validMoves = getAllValidMoves(board, pieces, playerColor, isFirstMove, startPosition);

    if (validMoves.length === 0) {
        return null;
    }

    // Simple AI: Prioritize pieces with higher value (more blocks) to clear hand
    // Then pick random
    validMoves.sort((a, b) => b.piece.value - a.piece.value);

    const bestValue = validMoves[0].piece.value;
    const bestMoves = validMoves.filter(m => m.piece.value === bestValue);

    const randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return randomMove;
}
