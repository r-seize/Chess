import { COLORS } from './constants';

export const convertAlgebraicToIndices = (algebraic: string): [number, number] => {
    const file = algebraic.charCodeAt(0) - 97; // a -> 0, h ->7
    const rank = 8 - parseInt(algebraic[1]); // 1 ->7, 8->0
    return [rank, file];
};

export const convertIndicesToAlgebraic = (row: number, col: number): string => {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
};

export const getPieceColor = (piece: string | null) => {
    return piece?.startsWith('w') ? COLORS.WHITE : piece?.startsWith('b') ? COLORS.BLACK : null;
};

export const isValidSquare = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
};