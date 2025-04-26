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
    const [row, col] = position.split('');
    const isLight = (parseInt(row) + col.charCodeAt(0)) % 2 === 0;

    return (
        <div
            onClick={onClick}
            className={`w-16 h-16 flex items-center justify-center
        ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
        ${isSelected ? 'bg-blue-300' : ''}
        ${isPossibleMove ? 'bg-green-200' : ''}
        cursor-pointer
        transition-colors
        hover:opacity-75`}
        >
            <Piece piece={piece} />
        </div>
    );
};