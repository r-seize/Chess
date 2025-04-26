'use client';

import { motion } from 'framer-motion';
import { UNICODE_PIECES } from '../utils/constants';

interface CapturedPiecesProps {
    pieces: string[];
}

export const CapturedPieces = ({ pieces }: CapturedPiecesProps) => (
    <div className="flex flex-wrap gap-2 p-4 bg-amber-50 rounded-lg min-h-[60px] w-96 justify-center items-center">
        {pieces.map((piece, i) => (
            <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl opacity-50"
            >
                {UNICODE_PIECES[piece as keyof typeof UNICODE_PIECES]}
            </motion.span>
        ))}
    </div>
);