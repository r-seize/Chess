import { COLORS, PIECE_TYPES } from '../utils/constants';

export const convertAlgebraicToIndices = (algebraic: string) => {
    const file = algebraic.charCodeAt(0) - 97;
    const rank = 8 - parseInt(algebraic[1]);
    return [rank, file];
};

export const convertIndicesToAlgebraic = (row: number, col: number) => {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
};

export const getPieceColor = (piece: string | null) => {
    if (!piece) return null;
    return piece[0] === 'w' ? COLORS.WHITE : COLORS.BLACK;
};