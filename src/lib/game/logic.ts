import { BOARD_SIZE } from './constants';
import { BoardState, Coordinate, Piece, PlayerColor } from './types';

export function createInitialBoard(): BoardState {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
}

export function rotatePiece(shape: number[][]): number[][] {
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = Array(cols).fill(0).map(() => Array(rows).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newShape[c][rows - 1 - r] = shape[r][c];
        }
    }
    return newShape;
}

export function flipPiece(shape: number[][]): number[][] {
    return shape.map(row => [...row].reverse());
}

export function getTransformedPiece(piece: Piece, rotation: number, isFlipped: boolean): number[][] {
    let shape = piece.shape;
    if (isFlipped) {
        shape = flipPiece(shape);
    }
    for (let i = 0; i < rotation / 90; i++) {
        shape = rotatePiece(shape);
    }
    return shape;
}

export function isValidMove(
    board: BoardState,
    shape: number[][],
    position: Coordinate,
    playerColor: PlayerColor,
    isFirstMove: boolean,
    startPosition?: Coordinate
): boolean {
    const rows = shape.length;
    const cols = shape[0].length;
    let touchesCorner = false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (shape[r][c] === 1) {
                const boardX = position.x + c;
                const boardY = position.y + r;

                // 1. Check Bounds
                if (boardX < 0 || boardX >= BOARD_SIZE || boardY < 0 || boardY >= BOARD_SIZE) {
                    return false;
                }

                // 2. Check Overlap
                if (board[boardY][boardX] !== null) {
                    return false;
                }

                // 3. Check Edge Touch (Cannot touch own color on edges)
                const neighbors = [
                    { x: boardX + 1, y: boardY },
                    { x: boardX - 1, y: boardY },
                    { x: boardX, y: boardY + 1 },
                    { x: boardX, y: boardY - 1 },
                ];

                for (const n of neighbors) {
                    if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE) {
                        if (board[n.y][n.x] === playerColor) {
                            return false;
                        }
                    }
                }

                // 4. Check Corner Touch (Must touch own color on corners)
                // Only relevant if NOT first move
                if (!isFirstMove) {
                    const corners = [
                        { x: boardX + 1, y: boardY + 1 },
                        { x: boardX - 1, y: boardY - 1 },
                        { x: boardX + 1, y: boardY - 1 },
                        { x: boardX - 1, y: boardY + 1 },
                    ];

                    for (const cn of corners) {
                        if (cn.x >= 0 && cn.x < BOARD_SIZE && cn.y >= 0 && cn.y < BOARD_SIZE) {
                            if (board[cn.y][cn.x] === playerColor) {
                                touchesCorner = true;
                            }
                        }
                    }
                } else {
                    // 5. Check Start Position (First move must cover the start corner)
                    if (startPosition && boardX === startPosition.x && boardY === startPosition.y) {
                        touchesCorner = true;
                    }
                }
            }
        }
    }

    return touchesCorner;
}

export function placePiece(
    board: BoardState,
    shape: number[][],
    position: Coordinate,
    playerColor: PlayerColor
): BoardState {
    const newBoard = board.map(row => [...row]);
    const rows = shape.length;
    const cols = shape[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (shape[r][c] === 1) {
                newBoard[position.y + r][position.x + c] = playerColor;
            }
        }
    }
    return newBoard;
}

export function getAllValidMoves(
    board: BoardState,
    pieces: Piece[],
    playerColor: PlayerColor,
    isFirstMove: boolean,
    startPosition?: Coordinate
): { piece: Piece, shape: number[][], position: Coordinate, rotation: number, isFlipped: boolean }[] {
    const validMoves: { piece: Piece, shape: number[][], position: Coordinate, rotation: number, isFlipped: boolean }[] = [];

    // Optimization: Only check positions near existing pieces of same color or start corner
    // For MVP, brute force is acceptable given 20x20 board and limited pieces, but let's be slightly smart.
    // Actually, brute force over all cells x all pieces x all orientations is heavy.
    // 20x20 = 400 cells. 21 pieces. 8 orientations. ~67k checks. JS can handle it but might lag.
    // Let's stick to brute force for now, optimize if needed.

    for (const piece of pieces) {
        const orientations = new Set<string>(); // avoid duplicate shapes

        for (const isFlipped of [false, true]) {
            for (const rotation of [0, 90, 180, 270]) {
                const shape = getTransformedPiece(piece, rotation, isFlipped);
                const shapeKey = JSON.stringify(shape);
                if (orientations.has(shapeKey)) continue;
                orientations.add(shapeKey);

                const rows = shape.length;
                const cols = shape[0].length;

                for (let y = 0; y <= BOARD_SIZE - rows; y++) {
                    for (let x = 0; x <= BOARD_SIZE - cols; x++) {
                        if (isValidMove(board, shape, { x, y }, playerColor, isFirstMove, startPosition)) {
                            validMoves.push({
                                piece,
                                shape,
                                position: { x, y },
                                rotation,
                                isFlipped
                            });
                        }
                    }
                }
            }
        }
    }
    return validMoves;
}
