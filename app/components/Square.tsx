import { Piece } from './Piece';

export const Square = ({
    position,
    piece,
    isSelected,
    isPossibleMove,
    onClick,
}: {
    position: string;
    piece: string | null;
    isSelected: boolean;
    isPossibleMove: boolean;
    onClick: () => void;
}) => {
    const [colChar, row] = position.split('');
    const col = colChar.charCodeAt(0) - 97;
    const isLight = (parseInt(row) + col) % 2 === 0;

    return (
        <div
            onClick={onClick}
            className={`w-16 h-16 flex items-center justify-center relative
        ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
        ${isSelected ? 'bg-blue-400/50' : ''}
        ${isPossibleMove ? 'bg-green-300/30' : ''}
        cursor-pointer
        transition-colors
        hover:opacity-80`}
        >
            <Piece piece={piece} />
            {isPossibleMove && !piece && (
                <div className="absolute w-4 h-4 bg-green-500/50 rounded-full" />
            )}
        </div>
    );
};