'use client';

import { useReducer, useState, useEffect } from 'react';
import { COLORS, INITIAL_BOARD } from '../utils/constants';
import { chessEngine } from './chessEngine';
import {
    getPieceColor,
    convertAlgebraicToIndices,
    convertIndicesToAlgebraic
} from '../utils/helpers';

type Action =
    | { type: 'MOVE_PIECE'; from: string; to: string }
    | { type: 'SWITCH_TURN' }
    | { type: 'SELECT_PIECE'; position: string | null };

type GameState = {
    board: (string | null)[][];
    capturedPieces: string[];
    currentPlayer: typeof COLORS.WHITE | typeof COLORS.BLACK;
    selectedPiece: string | null;
};

const initialState: GameState = {
    board: INITIAL_BOARD,
    capturedPieces: [],
    currentPlayer: COLORS.WHITE,
    selectedPiece: null,
};

function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'MOVE_PIECE': {
            const newBoard = state.board.map(row => [...row]);
            const [fromRow, fromCol] = convertAlgebraicToIndices(action.from);
            const [toRow, toCol] = convertAlgebraicToIndices(action.to);

            const capturedPiece = newBoard[toRow][toCol];
            if (capturedPiece) {
                newBoard[toRow][toCol] = null;
            }

            newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
            newBoard[fromRow][fromCol] = null;

            return {
                ...state,
                board: newBoard,
                capturedPieces: capturedPiece
                    ? [...state.capturedPieces, capturedPiece]
                    : state.capturedPieces
            };
        }
        case 'SWITCH_TURN':
            return {
                ...state,
                currentPlayer: state.currentPlayer === COLORS.WHITE
                    ? COLORS.BLACK
                    : COLORS.WHITE
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

    const getPieceAtPosition = (position: string) => {
        const [row, col] = convertAlgebraicToIndices(position);
        return state.board[row][col];
    };

    const handleSquareClick = (position: string) => {
        if (!state.selectedPiece) {
            const piece = getPieceAtPosition(position);
            if (piece && getPieceColor(piece) === state.currentPlayer) {
                const moves = chessEngine.getPossibleMoves(position, state.board);
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

    const makeBotMove = () => {
        const botPieces = state.board.flatMap((row, i) =>
            row.map((piece, j) =>
                piece?.startsWith('b') ? convertIndicesToAlgebraic(i, j) : null
            ).filter(Boolean) as string[]
        );

        if (botPieces.length > 0) {
            const randomPiece = botPieces[Math.floor(Math.random() * botPieces.length)];
            const moves = chessEngine.getPossibleMoves(randomPiece, state.board);

            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * moves.length)];
                setTimeout(() => {
                    dispatch({ type: 'MOVE_PIECE', from: randomPiece, to: randomMove });
                    dispatch({ type: 'SWITCH_TURN' });
                }, 500);
            }
        }
    };

    useEffect(() => {
        if (gameMode === 'PVB' && state.currentPlayer === COLORS.BLACK) {
            makeBotMove();
        }
    }, [state.currentPlayer, gameMode]);

    return {
        ...state,
        possibleMoves,
        handleSquareClick,
        setGameMode
    };
};