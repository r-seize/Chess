export const COLORS = {
    WHITE: 'white',
    BLACK: 'black',
} as const;

export const PIECE_TYPES = {
    KING: 'k',
    QUEEN: 'q',
    ROOK: 'r',
    BISHOP: 'b',
    KNIGHT: 'n',
    PAWN: 'p',
} as const;

export const INITIAL_BOARD = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

export const UNICODE_PIECES = {
    wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
    bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

export const PIECE_MOVEMENTS = {
    [PIECE_TYPES.KING]: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]],
    [PIECE_TYPES.QUEEN]: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]],
    [PIECE_TYPES.ROOK]: [[1, 0], [-1, 0], [0, 1], [0, -1]],
    [PIECE_TYPES.BISHOP]: [[1, 1], [-1, -1], [1, -1], [-1, 1]],
    [PIECE_TYPES.KNIGHT]: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
};

export const CASTLING_RIGHTS = {
    WHITE_KINGSIDE: 'WHITE_KINGSIDE',
    WHITE_QUEENSIDE: 'WHITE_QUEENSIDE',
    BLACK_KINGSIDE: 'BLACK_KINGSIDE',
    BLACK_QUEENSIDE: 'BLACK_QUEENSIDE',
  } as const;
  
  export const PROMOTION_PIECES = ['q', 'r', 'b', 'n'] as const;