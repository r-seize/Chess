'use client';

import { Square } from './Square';
import { convertIndicesToAlgebraic } from '../utils/helpers';

interface ChessBoardProps {
    board: (string | null)[][];
    possibleMoves: string[];
    selectedPiece: string | null;
    handleSquareClick: (position: string) => void;
}

export const ChessBoard = ({
    board,
    possibleMoves,
    selectedPiece,
    handleSquareClick
}: ChessBoardProps) => {
    return (
        <div className="border-4 border-amber-900 rounded-lg overflow-hidden shadow-xl relative">
            <div className="absolute top-0 left-0 w-full flex justify-between px-2 text-amber-900 font-bold">
                {[...Array(8)].map((_, i) => (
                    <span key={i}>{8 - i}</span>
                ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-amber-900 font-bold">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((c) => (
                    <span key={c}>{c}</span>
                ))}
            </div>

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