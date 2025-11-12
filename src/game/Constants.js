export const Constants = {
    WHITE_KING: 'K',
    WHITE_QUEEN: 'Q',
    WHITE_ROOK: 'R',
    WHITE_BISHOP: 'B',
    WHITE_KNIGHT: 'N',
    WHITE_PAWN: 'P',

    BLACK_KING: 'k',
    BLACK_QUEEN: 'q',
    BLACK_ROOK: 'r',
    BLACK_BISHOP: 'b',
    BLACK_KNIGHT: 'n',
    BLACK_PAWN: 'p'
}

export const PieceType = {
    KING: 'K',
    QUEEN: 'Q',
    ROOK: 'R',
    BISHOP: 'B',
    KNIGHT: 'N',
    PAWN: 'P'
}

export const PieceColor = {
    WHITE: 'W',
    BLACK: 'B'
}

export const colorOf = (piece) => (piece === piece.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK);