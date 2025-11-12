import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react"
import { Constants, extractColor, PieceColor, PieceType } from "./Constants"

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

    useEffect(() => {
        gameRef.current = game
        console.log(moveCount)
    }, [game, moveCount])

    function gameReducer(prevGame, action) {
        console.log(action)
        console.log(action.payload)
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
            // item,
            // toRank,
            // toFile
        })

        // WARNING this state may update even if dispatch move doesn't work
        setMoveCount(prevMoveCount => prevMoveCount + 1)
    }

    // TODO refactor canMoveMap - how can we simplify this logic?
    const compute = {
        'K': { canMove: ({type, rank, file, toRank, toFile}) => {
            if(gameRef.current[toRank][toFile] && extractColor(gameRef.current[toRank][toFile]) === extractColor(type)) return false
            const dF = Math.abs(toFile - file)
            const dR = Math.abs(toRank - rank)
            return (dF <= 1 && dR <= 1 && (dF !== 0 || dR !== 0))
        }},
        'N': { canMove: ({type, rank, file, toRank, toFile}) => {
            if(gameRef.current[toRank][toFile] && extractColor(gameRef.current[toRank][toFile]) === extractColor(type)) return false
            const dF = Math.abs(toFile - file)
            const dR = Math.abs(toRank - rank)
            return (dF === 2 && dR === 1) || (dF === 1 && dR === 2)
        }},
        'P': { canMove: ({type, rank, file, toRank, toFile}) => {
            if(gameRef.current[toRank][toFile] && extractColor(gameRef.current[toRank][toFile]) === extractColor(type)) return false
            const dF = Math.abs(toFile - file)
            const dR = toRank - rank
            return dF === 0 && dR === ((extractColor(type) === PieceColor.LIGHT) ? -1 : 1)
        }}
    }

    return (
        <GameContext.Provider value={{ game, compute, handleMove, moveCount }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    return useContext(GameContext)
}