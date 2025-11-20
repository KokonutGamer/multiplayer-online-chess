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

    const [moveCount, setMoveCount] = useState(0)
    const gameRef = useRef(game)

    // naive approach to checking king in check
    function computeChecks(kingRank, kingFile, colorToMove) {
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = gameRef.current[r][f]
                if (!piece || colorOf(piece) === colorToMove) continue
                if (compute[piece.toUpperCase()].canMove({ type: piece, rank: r, file: f, toRank: kingRank, toFile: kingFile })) {
                    return true
                }
            }
        }
        return false
    }

    function computeMoves(rank, file, kingRank, kingFile, inCheck) {
        const moves = []
        const piece = gameRef.current[rank][file]
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                if (!compute[piece.toUpperCase()].canMove({ type: piece, rank, file, toRank: r, toFile: f })) continue

                if (inCheck) {
                    copy = structuredClone(gameRef.current)
                    copy[rank][file] = 0
                    copy[r][f] = piece
                    if (computeChecks(kingRank, kingFile, colorOf(piece))) continue
                    moves.push({
                        from: { rank, file },
                        to: { rank: r, file: f }
                    })
                } else {
                    moves.push({
                        from: { rank, file },
                        to: { rank: r, file: f }
                    })
                }
            }
        }
        return moves
    }

    useEffect(() => {
        gameRef.current = game

        console.log("Game", gameRef.current)

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

        // check if king is in check
        let inCheck = computeChecks(kingPosition.rank, kingPosition.file, colorToMove)

        console.log(`King in check? ${inCheck}`)

        const moves = []
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = gameRef.current[r][f];
                if (!piece || colorOf(piece) !== colorToMove) continue
                console.log(piece, r, f)
                moves.push(...computeMoves(r, f, kingPosition.rank, kingPosition.file, inCheck))
            }
        }

        console.log(moves)

    }, [game, moveCount])



    function gameReducer(prevGame, action) {
        switch (action.type) {
            case 'move':
                const { type, rank, file, toRank, toFile } = action.payload
                if (!prevGame[rank][file]) {
                    console.error("ERROR: No piece exists on this square", rank, file)
                    return prevGame
                }

                if (prevGame[rank][file] !== type) {
                    console.error("ERROR: The piece on the board does not match the specified piece", type)
                    return prevGame
                }

                const gameClone = structuredClone(prevGame)
                gameClone[rank][file] = 0
                gameClone[toRank][toFile] = type
                return gameClone
            default:
                console.error("ERROR: Unknown action type dispatched")
                return prevGame
        }
    }

    function handleMove(payload) {
        dispatch({
            type: 'move',
            payload
        })

        // WARNING this state may update even if dispatch move doesn't work
        setMoveCount(prevMoveCount => prevMoveCount + 1)
    }

    function sameColorPieces(rank, file, toRank, toFile) {
        const piece = gameRef.current[rank][file]
        const other = gameRef.current[toRank][toFile]
        if (!other) return false
        return colorOf(piece) === colorOf(other)
    }

    function diffColorPieces(rank, file, toRank, toFile) {
        const piece = gameRef.current[rank][file]
        const other = gameRef.current[toRank][toFile]
        if (!other) return false
        return colorOf(piece) !== colorOf(other)
    }

    // TODO implement pins and checks
    // TODO refactor compute to use some kind of cache as canMove renders each frame a piece is dragging
    const compute = {
        'K': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = Math.abs(toFile - file)
                const dR = Math.abs(toRank - rank)
                return (dF <= 1 && dR <= 1 && (dF !== 0 || dR !== 0))
            }
        },
        'Q': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if ((dF !== 0 || dR === 0) && (dF === 0 || dR !== 0) && Math.abs(dF) !== Math.abs(dR)) return false

                const nF = (dF) ? dF / Math.abs(dF) : 0
                const nR = (dR) ? dR / Math.abs(dR) : 0
                let currFile = file + nF
                let currRank = rank + nR
                while (currRank !== toRank || currFile !== toFile) {
                    if (sameColorPieces(rank, file, currRank, currFile) ||
                        diffColorPieces(rank, file, currRank, currFile)) return false
                    currFile += nF
                    currRank += nR
                }

                return true
            }
        },
        'R': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if ((dF !== 0 || dR === 0) && (dF === 0 || dR !== 0)) return false

                // check path
                if (dF !== 0) {
                    const nF = dF / Math.abs(dF)
                    let currFile = file + nF
                    while (currFile !== toFile) {
                        if (sameColorPieces(rank, file, rank, currFile) ||
                            diffColorPieces(rank, file, rank, currFile)) return false
                        currFile += nF
                    }
                } else {
                    const nR = dR / Math.abs(dR)
                    let currRank = rank + nR
                    while (currRank !== toRank) {
                        if (sameColorPieces(rank, file, currRank, file) ||
                            diffColorPieces(rank, file, currRank, file)) return false
                        currRank += nR
                    }
                }

                return true
            }
        },
        'B': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = toFile - file
                const dR = toRank - rank
                if (Math.abs(dF) !== Math.abs(dR)) return false

                // check path
                const nF = dF / Math.abs(dF)
                const nR = dR / Math.abs(dR)
                let currFile = file + nF
                let currRank = rank + nR
                while (currRank !== toRank || currFile !== toFile) {
                    if (sameColorPieces(rank, file, currRank, currFile) ||
                        diffColorPieces(rank, file, currRank, currFile)) return false
                    currFile += nF
                    currRank += nR
                }

                return true
            }
        },
        'N': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = Math.abs(toFile - file)
                const dR = Math.abs(toRank - rank)
                return (dF === 2 && dR === 1) || (dF === 1 && dR === 2)
            }
        },
        'P': {
            canMove: ({ type, rank, file, toRank, toFile }) => {
                if (sameColorPieces(rank, file, toRank, toFile)) return false
                const dF = Math.abs(toFile - file)
                const dR = toRank - rank

                const isWhite = colorOf(type) === PieceColor.WHITE

                // diagonal captures
                if (diffColorPieces(rank, file, toRank, toFile)) {
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
        <GameContext.Provider value={{ game, moveCount, compute, handleMove }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    return useContext(GameContext)
}