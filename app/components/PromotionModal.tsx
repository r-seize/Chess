'use client';

import { useGameState } from '../features/gameState';
import { PROMOTION_PIECES, COLORS, UNICODE_PIECES } from '../utils/constants';

export const PromotionModal = () => {
    const { promotionSquare, currentPlayer, handlePromotionChoice } = useGameState();
    const colorPrefix = currentPlayer === COLORS.WHITE ? 'w' : 'b';

    if (!promotionSquare) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg flex gap-4">
                {PROMOTION_PIECES.map(piece => (
                    <button
                        key={piece}
                        onClick={() => handlePromotionChoice(piece)}
                        className="text-4xl p-4 hover:bg-gray-100 rounded"
                    >
                        {UNICODE_PIECES[`${colorPrefix}${piece}` as keyof typeof UNICODE_PIECES]}
                    </button>
                ))}
            </div>
        </div>
    );
};