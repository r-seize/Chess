import {
    convertAlgebraicToIndices,
    convertIndicesToAlgebraic,
    getPieceColor,
    isValidSquare
} from '../utils/helpers';
import { COLORS, PIECE_TYPES, PIECE_MOVEMENTS, CASTLING_RIGHTS } from '../utils/constants';

type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';

const getSlidingMoves = (position: string, board: (string | null)[][], directions: number[][], maxSteps = 8) => {
    const [row, col] = convertAlgebraicToIndices(position);
    if (!isValidSquare(row, col)) return [];

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
    getPossibleMoves(position: string, board: (string | null)[][], gameState: any) {
        const [row, col] = convertAlgebraicToIndices(position);
        if (!isValidSquare(row, col)) return [];

        const piece = board[row][col];
        if (!piece) return [];

        const color = getPieceColor(piece)!;
        const type = piece[1] as PieceType;
        const moves = [];

        switch (type) {
            case PIECE_TYPES.PAWN: {
                const direction = color === COLORS.WHITE ? -1 : 1;
                const startRow = color === COLORS.WHITE ? 6 : 1;

                if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
                    moves.push(convertIndicesToAlgebraic(row + direction, col));
                    if (row === startRow && isValidSquare(row + 2 * direction, col) && !board[row + 2 * direction][col]) {
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
                        if (!target && gameState.enPassantSquare === convertIndicesToAlgebraic(newRow, newCol)) {
                            moves.push(convertIndicesToAlgebraic(newRow, newCol));
                        }
                    }
                });
                break;
            }

            case PIECE_TYPES.KING: {
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

                if (row === 7 && col === 4 && color === COLORS.WHITE) {
                    if (gameState.castlingRights.has(CASTLING_RIGHTS.WHITE_KINGSIDE)) {
                        if (board[7][5] === null && board[7][6] === null &&
                            !this.isSquareAttacked('e1', COLORS.BLACK, board) &&
                            !this.isSquareAttacked('f1', COLORS.BLACK, board) &&
                            !this.isSquareAttacked('g1', COLORS.BLACK, board)) {
                            moves.push('g1');
                        }
                    }

                    if (gameState.castlingRights.has(CASTLING_RIGHTS.WHITE_QUEENSIDE)) {
                        if (board[7][1] === null && board[7][2] === null && board[7][3] === null &&
                            !this.isSquareAttacked('e1', COLORS.BLACK, board) &&
                            !this.isSquareAttacked('d1', COLORS.BLACK, board) &&
                            !this.isSquareAttacked('c1', COLORS.BLACK, board)) {
                            moves.push('c1');
                        }
                    }
                }

                if (row === 0 && col === 4 && color === COLORS.BLACK) {
                    if (gameState.castlingRights.has(CASTLING_RIGHTS.BLACK_KINGSIDE)) {
                        if (board[0][5] === null && board[0][6] === null &&
                            !this.isSquareAttacked('e8', COLORS.WHITE, board) &&
                            !this.isSquareAttacked('f8', COLORS.WHITE, board) &&
                            !this.isSquareAttacked('g8', COLORS.WHITE, board)) {
                            moves.push('g8');
                        }
                    }

                    if (gameState.castlingRights.has(CASTLING_RIGHTS.BLACK_QUEENSIDE)) {
                        if (board[0][1] === null && board[0][2] === null && board[0][3] === null &&
                            !this.isSquareAttacked('e8', COLORS.WHITE, board) &&
                            !this.isSquareAttacked('d8', COLORS.WHITE, board) &&
                            !this.isSquareAttacked('c8', COLORS.WHITE, board)) {
                            moves.push('c8');
                        }
                    }
                }
                break;
            }

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

            case PIECE_TYPES.BISHOP:
            case PIECE_TYPES.ROOK:
            case PIECE_TYPES.QUEEN:
                moves.push(...getSlidingMoves(
                    position,
                    board,
                    PIECE_MOVEMENTS[type]
                ));
                break;
        }

        return moves.filter(move => this.isMoveValid(position, move, board, gameState));
    },

    isMoveValid(from: string, to: string, board: (string | null)[][], gameState: any) {
        const [fromRow, fromCol] = convertAlgebraicToIndices(from);
        const [toRow, toCol] = convertAlgebraicToIndices(to);
        if (!isValidSquare(fromRow, fromCol) || !isValidSquare(toRow, toCol)) return false;

        const piece = board[fromRow][fromCol]!;
        const color = getPieceColor(piece)!;

        const tempBoard = board.map(row => [...row]);
        this.applyMove(tempBoard, from, to);

        const kingPos = this.findKingPosition(color, tempBoard);
        if (!kingPos || this.isSquareAttacked(kingPos, color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE, tempBoard)) {
            return false;
        }

        return true;
    },

    applyMove(board: any[][], from: string, to: string) {
        const [fromRow, fromCol] = convertAlgebraicToIndices(from);
        const [toRow, toCol] = convertAlgebraicToIndices(to);
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
    },

    findKingPosition(color: string, board: (string | null)[][]) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[1] === PIECE_TYPES.KING && getPieceColor(piece) === color) {
                    return convertIndicesToAlgebraic(row, col);
                }
            }
        }
        return null;
    },

    isSquareAttacked(square: string, attackerColor: string, board: (string | null)[][]) {
        const [row, col] = convertAlgebraicToIndices(square);
        if (!isValidSquare(row, col)) return false;

        const attackerPrefix = attackerColor === COLORS.WHITE ? 'w' : 'b';

        const pawnDirection = attackerColor === COLORS.WHITE ? 1 : -1;
        for (const dc of [-1, 1]) {
            const newRow = row + pawnDirection;
            const newCol = col + dc;
            if (isValidSquare(newRow, newCol)) {
                const piece = board[newRow][newCol];
                if (piece === `${attackerPrefix}p`) return true;
            }
        }

        const checkDirections = [
            ...PIECE_MOVEMENTS[PIECE_TYPES.KNIGHT],
            ...PIECE_MOVEMENTS[PIECE_TYPES.KING],
            ...PIECE_MOVEMENTS[PIECE_TYPES.BISHOP],
            ...PIECE_MOVEMENTS[PIECE_TYPES.ROOK],
            ...PIECE_MOVEMENTS[PIECE_TYPES.QUEEN]
        ];

        for (const [dx, dy] of checkDirections) {
            let steps = 0;
            let newRow = row + dx;
            let newCol = col + dy;

            while (isValidSquare(newRow, newCol)) {
                const piece = board[newRow][newCol];
                if (piece) {
                    if (piece.startsWith(attackerPrefix)) {
                        const type = piece[1];
                        if (
                            (type === PIECE_TYPES.QUEEN && (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy))) ||
                            (type === PIECE_TYPES.ROOK && (dx === 0 || dy === 0)) ||
                            (type === PIECE_TYPES.BISHOP && Math.abs(dx) === Math.abs(dy)) ||
                            (type === PIECE_TYPES.KNIGHT && Math.abs(dx) + Math.abs(dy) === 3)
                        ) {
                            return true;
                        }
                    }
                    break;
                }
                newRow += dx;
                newCol += dy;
                steps++;
            }
        }

        return false;
    }
};