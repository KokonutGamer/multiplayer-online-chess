import { createContext, useContext, useEffect, useState } from "react"
import { Constants, PieceType } from "./Constants"

const GameContext = createContext()

export const GameContextProvider = ({ children }) => {
    const [game, setGame] = useState(() => {
        // Cool empty board construction
        // Array.from creates an array from an iterable
        // Shorthand array object with length property
        // Map each element in the array object to an array of size 8 filled with 0's
        const board = Array.from({ length: 8}, () => Array(8).fill(0))

        // TODO refactor to laod in different board states
        board[7][0] = Constants.WHITE_ROOK
        board[7][1] = Constants.WHITE_KNIGHT
        board[7][2] = Constants.WHITE_BISHOP
        board[7][3] = Constants.WHITE_QUEEN
        board[7][4] = Constants.WHITE_KING
        board[7][5] = Constants.WHITE_BISHOP
        board[7][6] = Constants.WHITE_KNIGHT
        board[7][7] = Constants.WHITE_ROOK
        for(let f = 0; f <= 7; f++) {
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
        for(let f = 0; f <= 7; f++) {
            board[1][f] = Constants.BLACK_PAWN
        }

        return board
    })

    useEffect(() => {
        console.log(game)
    }, [game])

    const canMoveMap = new Map()
    canMoveMap.set(PieceType.KING, (item, toRank, toFile) => {
        const { rank, file } = item
        const dF = Math.abs(toFile - file)
        const dR = Math.abs(toRank - rank)
        return (dF <= 1 && dR <= 1 && (dF !== 0 || dR !== 0))
    })

    const moveMap = new Map()
    moveMap.set(PieceType.KING, (item, toRank, toFile) => {
        console.log(item)
        const { rank, file } = item

        setGame(prevGame => {
            if (!prevGame[rank][file]) {
                console.error("ERROR: No piece exists on this square", rank, file)
                return prevGame
            }

            if (prevGame[rank][file] !== item.id) {
                console.error("ERROR: The piece on the board does not match the specified piece", item.id)
                return prevGame
            }

            const gameClone = structuredClone(prevGame)
            gameClone[rank][file] = 0
            gameClone[toRank][toFile] = item.id
            return gameClone
        })
    })

    return (
        <GameContext.Provider value={{ game, canMoveMap, moveMap }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    return useContext(GameContext)
}