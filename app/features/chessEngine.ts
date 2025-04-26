import {
    convertAlgebraicToIndices,
    convertIndicesToAlgebraic,
    getPieceColor,
    isValidSquare
} from '../utils/helpers';
import { COLORS, PIECE_TYPES, PIECE_MOVEMENTS } from '../utils/constants';

const getSlidingMoves = (position: string, board: (string | null)[][], directions: number[][], maxSteps = 8) => {
    const [row, col] = convertAlgebraicToIndices(position);
    const color = getPieceColor(board[row][col]!)!;
    const moves = [];

    for (const [dx, dy] of directions) {
        let steps = 0;
        let newRow = row + dx;
        let newCol = col + dy;

        while (steps < maxSteps && isValidSquare(newRow, newCol)) {
            const piece = board[newRow][newCol];
            if (piece) {
                if (getPieceColor(piece) !== color) moves.push(convertIndicesToAlgebraic(newRow, newCol));
                break;
            }
            moves.push(convertIndicesToAlgebraic(newRow, newCol));
            newRow += dx;
            newCol += dy;
            steps++;
        }
    }

    return moves;
};

export const chessEngine = {
    getPossibleMoves(position: string, board: (string | null)[][]) {
        const [row, col] = convertAlgebraicToIndices(position);
        const piece = board[row][col];
        if (!piece) return [];

        const color = getPieceColor(piece)!;
        const type = piece[1] as keyof typeof PIECE_MOVEMENTS;
        const moves = [];

        switch (type) {
            case PIECE_TYPES.PAWN:
                const direction = color === COLORS.WHITE ? -1 : 1;
                const startRow = color === COLORS.WHITE ? 6 : 1;

                if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
                    moves.push(convertIndicesToAlgebraic(row + direction, col));
                    if (row === startRow && !board[row + 2 * direction][col]) {
                        moves.push(convertIndicesToAlgebraic(row + 2 * direction, col));
                    }
                }

                [[direction, -1], [direction, 1]].forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (isValidSquare(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (target && getPieceColor(target) !== color) {
                            moves.push(convertIndicesToAlgebraic(newRow, newCol));
                        }
                    }
                });
                break;

            case PIECE_TYPES.KNIGHT:
                PIECE_MOVEMENTS[type].forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (isValidSquare(newRow, newCol)) {
                        const target = board[newRow][newCol];
                        if (!target || getPieceColor(target) !== color) {
                            moves.push(convertIndicesToAlgebraic(newRow, newCol));
                        }
                    }
                });
                break;

            case PIECE_TYPES.KING:
            case PIECE_TYPES.QUEEN:
            case PIECE_TYPES.ROOK:
            case PIECE_TYPES.BISHOP:
                const isSliding = [PIECE_TYPES.QUEEN, PIECE_TYPES.ROOK, PIECE_TYPES.BISHOP].includes(type);
                moves.push(...getSlidingMoves(
                    position,
                    board,
                    PIECE_MOVEMENTS[type],
                    isSliding ? 8 : 1
                ));
                break;
        }

        return moves.filter(move => this.isMoveValid(position, move, board));
    },

    isMoveValid(from: string, to: string, board: (string | null)[][]) {

        return true;
    },
};