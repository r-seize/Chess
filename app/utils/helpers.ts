import { COLORS } from './constants';

export const convertAlgebraicToIndices = (algebraic: string): [number, number] => {
    if (algebraic.length !== 2) return [-1, -1];
    const file = algebraic.charCodeAt(0) - 97;
    const rank = 8 - parseInt(algebraic[1]);
    return [Number.isNaN(rank) ? -1 : rank, Number.isNaN(file) ? -1 : file];
};

export const convertIndicesToAlgebraic = (row: number, col: number): string => {
    if (row < 0 || row > 7 || col < 0 || col > 7) return '';
    return `${String.fromCharCode(97 + col)}${8 - row}`;
};

export const getPieceColor = (piece: string | null) => {
    return piece?.startsWith('w') ? COLORS.WHITE : piece?.startsWith('b') ? COLORS.BLACK : null;
};

export const isValidSquare = (row: number, col: number) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
};