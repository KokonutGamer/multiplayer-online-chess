import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react"
import { Constants, colorOf, PieceColor, PieceType } from "./Constants"

const GameContext = createContext()

export const GameContextProvider = ({ children }) => {
    // TODO refactor to laod in different board states
    const [game, dispatch] = useReducer(
        gameReducer,
        8,
        (size) => {
            const board = Array.from({ length: size }, () => Array(size).fill(0))

            board[7][0] = Constants.WHITE_ROOK
            board[7][1] = Constants.WHITE_KNIGHT
            board[7][2] = Constants.WHITE_BISHOP
            board[7][3] = Constants.WHITE_QUEEN
            board[7][4] = Constants.WHITE_KING
            board[7][5] = Constants.WHITE_BISHOP
            board[7][6] = Constants.WHITE_KNIGHT
            board[7][7] = Constants.WHITE_ROOK
            for (let f = 0; f <= 7; f++) {
                board[6][f] = Constants.WHITE_PAWN
            }

            board[0][0] = Constants.BLACK_ROOK
            board[0][1] = Constants.BLACK_KNIGHT
            board[0][2] = Constants.BLACK_BISHOP
            board[0][3] = Constants.BLACK_QUEEN
            board[0][4] = Constants.BLACK_KING
            board[0][5] = Constants.BLACK_BISHOP
            board[0][6] = Constants.BLACK_KNIGHT
            board[0][7] = Constants.BLACK_ROOK
            for (let f = 0; f <= 7; f++) {
                board[1][f] = Constants.BLACK_PAWN
            }

            return board
        }
    )

    const [castle, dispatchCastle] = useReducer(castleReducer, {
        'K': { canCastle: true, rank: 7, file: 4 },
        'KR': { canCastle: true, rank: 7, file: 7 },
        'QR': { canCastle: true, rank: 7, file: 0 },
        'k': { canCastle: true, rank: 0, file: 4 },
        'kr': { canCastle: true, rank: 0, file: 7 },
        'qr': { canCastle: true, rank: 0, file: 0 }
    })
    const [moveCount, setMoveCount] = useState(0)
    const [moves, setMoves] = useState([])
    const gameRef = useRef(game)
    const [gameEnd, setGameEnd] = useState("")

    // naive approach to checking king in check
    function computeChecks(kingRank, kingFile, colorToMove, game) {
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = game[r][f]
                if (!piece || colorOf(piece) === colorToMove) continue
                if (compute[piece.toUpperCase()].canMove({ type: piece, rank: r, file: f, toRank: kingRank, toFile: kingFile, game })) {
                    return true
                }
            }
        }
        return false
    }

    function computeMoves(rank, file, kingRank, kingFile, game) {
        const pieceMoves = []
        const piece = game[rank][file]
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                if (!compute[piece.toUpperCase()].canMove({ type: piece, rank, file, toRank: r, toFile: f, game })) continue
                const copy = structuredClone(gameRef.current)
                copy[rank][file] = 0
                copy[r][f] = piece
                if ((kingRank === rank && kingFile === file) ?
                    computeChecks(r, f, colorOf(piece), copy) :
                    computeChecks(kingRank, kingFile, colorOf(piece), copy)) continue
                pieceMoves.push({
                    from: { rank, file },
                    to: { rank: r, file: f }
                })
            }
        }
        return pieceMoves
    }

    useEffect(() => {
        gameRef.current = game
        console.log(gameRef.current)

        // find position of king
        const kingPosition = { rank: -1, file: -1 }
        const colorToMove = moveCount % 2 === 0 ? PieceColor.WHITE : PieceColor.BLACK
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = gameRef.current[r][f]
                if (!piece || colorOf(piece) !== colorToMove || piece.toUpperCase() !== PieceType.KING) continue
                kingPosition.rank = r
                kingPosition.file = f
            }
        }

        console.log(kingPosition)

        // check if the king is in check
        let inCheck = computeChecks(kingPosition.rank, kingPosition.file, colorToMove, gameRef.current)
        console.log(`King in check? ${inCheck}`)

        const currMoves = []
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = gameRef.current[r][f];
                if (!piece || colorOf(piece) !== colorToMove) continue
                currMoves.push(...computeMoves(r, f, kingPosition.rank, kingPosition.file, gameRef.current))
            }
        }
        setMoves(currMoves)

        if (currMoves.length === 0) {
            setGameEnd((inCheck) ? 'stalemate' : 'checkmate')
        }

    }, [game, moveCount])

    function gameReducer(prevGame, action) {
        const { type, rank, file, toRank, toFile } = action.payload
        const gameClone = structuredClone(prevGame)
        
        switch (action.type) {
            case 'move':
                if (!prevGame[rank][file]) {
                    console.error("ERROR: No piece exists on this square", rank, file)
                    return prevGame
                }

                if (prevGame[rank][file] !== type) {
                    console.error("ERROR: The piece on the board does not match the specified piece", type)
                    return prevGame
                }

                gameClone[rank][file] = 0
                gameClone[toRank][toFile] = type
                return gameClone
            case 'castle':
                if (!prevGame[rank][file]) {
                    console.error("ERROR: No piece exists on this square", rank, file)
                    return prevGame
                }

                if (prevGame[rank][file] !== type) {
                    console.error("ERROR: The piece on the board does not match the specified piece", type)
                    return prevGame
                }

                const dR = toRank - rank
                if(dR !== 0) {
                    console.error("ERROR: Castle results in a different rank", dR)
                    return prevGame
                }

                // move king
                gameClone[rank][file] = 0
                gameClone[toRank][toFile] = type

                const dF = toFile - file
                if(dF === 2) {
                    gameClone[toRank][toFile - 1] = gameClone[toRank][toFile + 1]
                    gameClone[toRank][toFile + 1] = 0
                } else if(dF === -2) {
                    gameClone[toRank][toFile + 1] = gameClone[toRank][toFile - 2]
                    gameClone[toRank][toFile - 2] = 0
                }
                return gameClone
            default:
                console.error("ERROR: Unknown action type dispatched")
                return prevGame
        }
    }

    function castleReducer(prevCastle, action) {
        if (action.type in prevCastle) {
            const newCastle = { ...prevCastle }
            newCastle[action.type].canCastle = false
            return newCastle
        }
        return prevCastle
    }

    function handleMove(payload) {
        if(payload.type.toUpperCase() === PieceType.KING && payload.toRank - payload.rank === 0 && Math.abs(payload.toFile - payload.file) === 2) {
            console.log("Dispatching castle")
            dispatch({
                type: 'castle',
                payload
            })

            const colorToMove = colorOf(payload.type)
            const kingsRook = (colorToMove === PieceColor.WHITE) ? 'KR' : 'kr'
            const queensRook = (colorToMove === PieceColor.WHITE) ? 'QR' : 'qr'
            dispatchCastle({ type: payload.type })
            switch(Math.abs(payload.toFile - payload.file)) {
                case 2:
                    dispatchCastle({ type: kingsRook })
                    break;
                    case -2:
                    dispatchCastle({ type: queensRook })
                    break;
            }
        } else {
            dispatch({
                type: 'move',
                payload
            })
        }

        switch (payload.type) {
            case 'K':
                dispatchCastle({ type: payload.type })
                break;
            case 'k':
                dispatchCastle({ type: payload.type })
                break;
            case 'R':
                if (castle['KR'].canCastle && castle['KR'].rank === payload.rank && castle['KR'].file === payload.file) {
                    dispatchCastle({ type: 'KR' })
                } else if (castle['QR'].canCastle && castle['QR'].rank === payload.rank && castle['QR'].file === payload.file) {
                    dispatchCastle({ type: 'QR' })
                }
                break;
            case 'r':
                if (castle['kr'].canCastle && castle['kr'].rank === payload.rank && castle['kr'].file === payload.file) {
                    dispatchCastle({ type: 'kr' })
                } else if (castle['qr'].canCastle && castle['qr'].rank === payload.rank && castle['qr'].file === payload.file) {
                    dispatchCastle({ type: 'qr' })
                }
                break;
            default:
                break;
        }
        console.log("castle", castle)

        // WARNING this state may update even if dispatch move doesn't work
        setMoveCount(prevMoveCount => prevMoveCount + 1)
    }

    function sameColorPieces(rank, file, toRank, toFile, game) {
        const piece = game[rank][file]
        const other = game[toRank][toFile]
        if (!other) return false
        return colorOf(piece) === colorOf(other)
    }

    function diffColorPieces(rank, file, toRank, toFile, game) {
        const piece = game[rank][file]
        const other = game[toRank][toFile]
        if (!other) return false
        return colorOf(piece) !== colorOf(other)
    }

    const compute = {
        'K': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = toFile - file
                const dR = Math.abs(toRank - rank)

                const colorToMove = colorOf(type)
                if (castle[type].canCastle && dR === 0 && Math.abs(dF) === 2 && !computeChecks(rank, file, colorToMove, game)) {
                    const kingsRook = (colorToMove === PieceColor.WHITE) ? 'KR' : 'kr'
                    const queensRook = (colorToMove === PieceColor.WHITE) ? 'QR' : 'qr'

                    if (!game[rank][file + 1] && !game[rank][file + 2] && castle[kingsRook].canCastle && dR === 0 && dF === 2) {
                        return !computeChecks(rank, file + 1, colorToMove, game) && !computeChecks(rank, file + 2, colorToMove, game)
                    } else if (!game[rank][file - 1] && !game[rank][file - 2] && castle[queensRook].canCastle && dR === 0 && dF === -2) {
                        return !computeChecks(rank, file - 1, colorToMove, game) && !computeChecks(rank, file - 2, colorToMove, game)
                    }
                }

                return (Math.abs(dF) <= 1 && dR <= 1 && (dF !== 0 || dR !== 0))
            }
        },
        'Q': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if ((dF !== 0 || dR === 0) && (dF === 0 || dR !== 0) && Math.abs(dF) !== Math.abs(dR)) return false

                const nF = (dF) ? dF / Math.abs(dF) : 0
                const nR = (dR) ? dR / Math.abs(dR) : 0
                let currFile = file + nF
                let currRank = rank + nR
                while (currRank !== toRank || currFile !== toFile) {
                    if (sameColorPieces(rank, file, currRank, currFile, game) ||
                        diffColorPieces(rank, file, currRank, currFile, game)) return false
                    currFile += nF
                    currRank += nR
                }

                return true
            }
        },
        'R': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if ((dF !== 0 || dR === 0) && (dF === 0 || dR !== 0)) return false

                // check path
                if (dF !== 0) {
                    const nF = dF / Math.abs(dF)
                    let currFile = file + nF
                    while (currFile !== toFile) {
                        if (sameColorPieces(rank, file, rank, currFile, game) ||
                            diffColorPieces(rank, file, rank, currFile, game)) return false
                        currFile += nF
                    }
                } else {
                    const nR = dR / Math.abs(dR)
                    let currRank = rank + nR
                    while (currRank !== toRank) {
                        if (sameColorPieces(rank, file, currRank, file, game) ||
                            diffColorPieces(rank, file, currRank, file, game)) return false
                        currRank += nR
                    }
                }

                return true
            }
        },
        'B': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if (Math.abs(dF) !== Math.abs(dR)) return false

                // check path
                const nF = dF / Math.abs(dF)
                const nR = dR / Math.abs(dR)
                let currFile = file + nF
                let currRank = rank + nR
                while (currRank !== toRank || currFile !== toFile) {
                    if (sameColorPieces(rank, file, currRank, currFile, game) ||
                        diffColorPieces(rank, file, currRank, currFile, game)) return false
                    currFile += nF
                    currRank += nR
                }

                return true
            }
        },
        'N': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = Math.abs(toFile - file)
                const dR = Math.abs(toRank - rank)
                return (dF === 2 && dR === 1) || (dF === 1 && dR === 2)
            }
        },
        'P': {
            canMove: ({ type, rank, file, toRank, toFile, game }) => {
                if (sameColorPieces(rank, file, toRank, toFile, game)) return false
                const dF = Math.abs(toFile - file)
                const dR = toRank - rank

                const isWhite = colorOf(type) === PieceColor.WHITE

                // diagonal captures
                if (diffColorPieces(rank, file, toRank, toFile, game)) {
                    return (dF === 1 && dR === (isWhite ? -1 : 1))
                }

                // home rank
                if (isWhite && rank === 6) {
                    return dF === 0 && dR < 0 && dR >= -2
                } else if (!isWhite && rank === 1) {
                    return dF === 0 && dR > 0 && dR <= 2
                }

                return dF === 0 && dR === (isWhite ? -1 : 1)
            }
        }
    }

    return (
        <GameContext.Provider value={{ game, moveCount, handleMove, moves }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    return useContext(GameContext)
}