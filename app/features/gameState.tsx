'use client';

import { useReducer, useState, useEffect } from 'react';
import { COLORS, INITIAL_BOARD, CASTLING_RIGHTS, PIECE_TYPES } from '../utils/constants';
import { chessEngine } from './chessEngine';
import {
    getPieceColor,
    convertAlgebraicToIndices,
    convertIndicesToAlgebraic,
    isValidSquare
} from '../utils/helpers';

type Action =
    | { type: 'MOVE_PIECE'; from: string; to: string }
    | { type: 'SWITCH_TURN' }
    | { type: 'SELECT_PIECE'; position: string | null }
    | { type: 'UPDATE_CASTLING'; rights: string[] }
    | { type: 'SET_EN_PASSANT'; square: string | null };

type GameState = {
    board: (string | null)[][];
    capturedPieces: string[];
    currentPlayer: typeof COLORS.WHITE | typeof COLORS.BLACK;
    selectedPiece: string | null;
    castlingRights: Set<string>;
    enPassantSquare: string | null;
    promotionSquare: string | null;
};

const initialState: GameState = {
    board: INITIAL_BOARD,
    capturedPieces: [],
    currentPlayer: COLORS.WHITE,
    selectedPiece: null,
    castlingRights: new Set(Object.values(CASTLING_RIGHTS)),
    enPassantSquare: null,
    promotionSquare: null,
};

function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'MOVE_PIECE': {
            const newBoard = state.board.map(row => [...row]);
            const [fromRow, fromCol] = convertAlgebraicToIndices(action.from);
            const [toRow, toCol] = convertAlgebraicToIndices(action.to);

            if (!isValidSquare(fromRow, fromCol) || !isValidSquare(toRow, toCol)) {
                return state;
            }

            const piece = newBoard[fromRow][fromCol]!;

            if (piece[1] === PIECE_TYPES.KING && Math.abs(fromCol - toCol) === 2) {
                const rookCol = toCol > fromCol ? 7 : 0;
                const newRookCol = toCol > fromCol ? 5 : 3;
                newBoard[toRow][newRookCol] = newBoard[fromRow][rookCol];
                newBoard[fromRow][rookCol] = null;
            }

            newBoard[toRow][toCol] = piece;
            newBoard[fromRow][fromCol] = null;

            const newCastlingRights = new Set(state.castlingRights);
            if (piece[1] === PIECE_TYPES.KING) {
                newCastlingRights.delete(CASTLING_RIGHTS.WHITE_KINGSIDE);
                newCastlingRights.delete(CASTLING_RIGHTS.WHITE_QUEENSIDE);
            }
            if (piece[1] === PIECE_TYPES.ROOK) {
                if (fromRow === 7 && fromCol === 0) newCastlingRights.delete(CASTLING_RIGHTS.WHITE_QUEENSIDE);
                if (fromRow === 7 && fromCol === 7) newCastlingRights.delete(CASTLING_RIGHTS.WHITE_KINGSIDE);
            }

            const isPromotion = piece[1] === PIECE_TYPES.PAWN && 
                (toRow === 0 || toRow === 7);

            return {
                ...state,
                board: newBoard,
                castlingRights: newCastlingRights,
                enPassantSquare: piece[1] === PIECE_TYPES.PAWN && Math.abs(fromRow - toRow) === 2
                    ? convertIndicesToAlgebraic((fromRow + toRow) / 2, fromCol)
                    : null,
                promotionSquare: isPromotion ? action.to : null
            };
        }

        case 'HANDLE_PROMOTION':
            const [row, col] = convertAlgebraicToIndices(state.promotionSquare!);
            const newBoard = state.board.map(row => [...row]);
            newBoard[row][col] = `${state.currentPlayer[0]}${action.piece}`;
            
            return {
                ...state,
                board: newBoard,
                promotionSquare: null
            };j

        case 'SWITCH_TURN':
            return {
                ...state,
                currentPlayer: state.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE
            };

        case 'SELECT_PIECE':
            return { ...state, selectedPiece: action.position };

        default:
            return state;
    }
}

export const useGameState = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [gameMode, setGameMode] = useState<'PVP' | 'PVB'>('PVP');

    const handleSquareClick = (position: string) => {
        if (!state.selectedPiece) {
            const piece = getPieceAtPosition(position);
            if (piece && getPieceColor(piece) === state.currentPlayer) {
                const moves = chessEngine.getPossibleMoves(position, state.board, state);
                setPossibleMoves(moves);
                dispatch({ type: 'SELECT_PIECE', position });
            }
        } else {
            if (possibleMoves.includes(position)) {
                dispatch({ type: 'MOVE_PIECE', from: state.selectedPiece, to: position });
                dispatch({ type: 'SWITCH_TURN' });
            }
            setPossibleMoves([]);
            dispatch({ type: 'SELECT_PIECE', position: null });
        }
    };

    const getPieceAtPosition = (position: string) => {
        const [row, col] = convertAlgebraicToIndices(position);
        return isValidSquare(row, col) ? state.board[row][col] : null;
    };

    return {
        ...state,
        gameMode,
        setGameMode,
        possibleMoves,
        handleSquareClick
    };
};