import {
    convertAlgebraicToIndices,
    convertIndicesToAlgebraic,
    getPieceColor
} from '../utils/helpers';
import { COLORS, PIECE_TYPES } from '../utils/constants';

export const chessEngine = {
    getPossibleMoves(position: string, board: (string | null)[][]) {
        const [row, col] = convertAlgebraicToIndices(position);
        const piece = board[row][col];
        if (!piece) return [];

        const moves = [];
        const color = getPieceColor(piece);
        const type = piece[1];

        switch (type) {
            case PIECE_TYPES.PAWN:
                const direction = color === COLORS.WHITE ? -1 : 1;
                if (row + direction >= 0 && row + direction < 8) {
                    // Déplacement avant
                    if (!board[row + direction][col]) {
                        moves.push(convertIndicesToAlgebraic(row + direction, col));
                    }
                    // Capture diagonale
                    if (col > 0 && board[row + direction][col - 1]?.[0] !== color) {
                        moves.push(convertIndicesToAlgebraic(row + direction, col - 1));
                    }
                    if (col < 7 && board[row + direction][col + 1]?.[0] !== color) {
                        moves.push(convertIndicesToAlgebraic(row + direction, col + 1));
                    }
                }
                break;
            // Ajouter les autres cas ici...
        }

        return moves.filter(move => this.isMoveValid(position, move, board));
    },

    isMoveValid(from: string, to: string, board: (string | null)[][]) {
        // Implémentez la logique de validation ici
        return true;
    },
};