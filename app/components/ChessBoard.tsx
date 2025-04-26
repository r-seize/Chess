'use client';

import { Square } from './Square';
import { useGameState } from '../features/gameState';
import { convertIndicesToAlgebraic } from '../utils/helpers';

export const ChessBoard = () => {
    const { board, possibleMoves, selectedPiece, handleSquareClick } = useGameState();

    return (
        <div className="border-4 border-amber-900 rounded-lg overflow-hidden shadow-xl">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((piece, colIndex) => {
                        const position = convertIndicesToAlgebraic(rowIndex, colIndex);
                        return (
                            <Square
                                key={position}
                                position={position}
                                piece={piece}
                                isSelected={selectedPiece === position}
                                isPossibleMove={possibleMoves.includes(position)}
                                onClick={() => handleSquareClick(position)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};