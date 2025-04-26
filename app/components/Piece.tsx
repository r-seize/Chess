import { UNICODE_PIECES } from '../utils/constants';

export const Piece = ({ piece }: { piece: string | null }) => {
    if (!piece) return null;

    return (
        <div className={`text-4xl cursor-grab ${piece.startsWith('w') ? 'text-white' : 'text-black'}`}>
            {UNICODE_PIECES[piece as keyof typeof UNICODE_PIECES]}
        </div>
    );
};