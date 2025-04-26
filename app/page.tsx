'use client';

import { ChessBoard } from './components/ChessBoard';
import { CapturedPieces } from './components/CapturedPieces';
import { useGameState } from './features/gameState';

export default function Home() {
    const {
        capturedPieces,
        setGameMode,
        board,
        possibleMoves,
        selectedPiece,
        handleSquareClick
    } = useGameState();

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 space-y-8">
            <h1 className="text-4xl font-bold text-amber-900">Chess Master</h1>

            <div className="flex gap-4">
                <button
                    onClick={() => setGameMode('PVP')}
                    className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                    Joueur vs Joueur
                </button>
                <button
                    onClick={() => setGameMode('PVB')}
                    className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                    Joueur vs Bot
                </button>
            </div>

            <div className="flex gap-8 items-start">
                <CapturedPieces pieces={capturedPieces.filter(p => p.startsWith('w'))} />

                <div className="bg-white p-8 rounded-2xl shadow-2xl">
                    <ChessBoard
                        board={board}
                        possibleMoves={possibleMoves}
                        selectedPiece={selectedPiece}
                        handleSquareClick={handleSquareClick}
                    />
                </div>

                <CapturedPieces pieces={capturedPieces.filter(p => p.startsWith('b'))} />
            </div>
        </main>
    );
}