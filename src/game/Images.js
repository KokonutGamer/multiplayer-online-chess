// Black pieces
import blackBishopImage from '../assets/black-bishop.svg'
import blackKingImage from '../assets/black-king.svg'
import blackKnightImage from '../assets/black-knight.svg'
import blackPawnImage from '../assets/black-pawn.svg'
import blackQueenImage from '../assets/black-queen.svg'
import blackRookImage from '../assets/black-rook.svg'

// White pieces
import whiteBishopImage from '../assets/white-bishop.svg'
import whiteKingImage from '../assets/white-king.svg'
import whiteKnightImage from '../assets/white-knight.svg'
import whitePawnImage from '../assets/white-pawn.svg'
import whiteQueenImage from '../assets/white-queen.svg'
import whiteRookImage from '../assets/white-rook.svg'
import { Constants } from './Constants'

const images = new Map()

images.set(Constants.BLACK_BISHOP, blackBishopImage)
images.set(Constants.BLACK_KING, blackKingImage)
images.set(Constants.BLACK_KNIGHT, blackKnightImage)
images.set(Constants.BLACK_PAWN, blackPawnImage)
images.set(Constants.BLACK_QUEEN, blackQueenImage)
images.set(Constants.BLACK_ROOK, blackRookImage)

images.set(Constants.WHITE_BISHOP, whiteBishopImage)
images.set(Constants.WHITE_KING, whiteKingImage)
images.set(Constants.WHITE_KNIGHT, whiteKnightImage)
images.set(Constants.WHITE_PAWN, whitePawnImage)
images.set(Constants.WHITE_QUEEN, whiteQueenImage)
images.set(Constants.WHITE_ROOK, whiteRookImage)

export default images