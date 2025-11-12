import { createContext, useContext, useEffect, useReducer, useRef } from "react"
import { Constants, extractColor, PieceType } from "./Constants"

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

    const gameRef = useRef(game)

    useEffect(() => {
        gameRef.current = game
        console.log(game)
    }, [game])

    function gameReducer(prevGame, action) {
        switch (action.type) {
            case 'move':
                const { item, toRank, toFile } = action
                const { rank, file } = item
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
            default:
                console.error("ERROR: Unknown action type dispatched")
                return prevGame
        }
    }

    function handleMove(item, toRank, toFile) {
        dispatch({
            type: 'move',
            item,
            toRank,
            toFile
        })
    }

    const canMoveMap = new Map()
    canMoveMap.set(PieceType.KING, (item, toRank, toFile) => {
        if(gameRef.current[toRank][toFile] && extractColor(gameRef.current[toRank][toFile]) === extractColor(item.id)) return false
        
        const { rank, file } = item
        const dF = Math.abs(toFile - file)
        const dR = Math.abs(toRank - rank)
        return (dF <= 1 && dR <= 1 && (dF !== 0 || dR !== 0))
    })
    
    canMoveMap.set(PieceType.KNIGHT, (item, toRank, toFile) => {
        if(gameRef.current[toRank][toFile] && extractColor(gameRef.current[toRank][toFile]) === extractColor(item.id)) return false

        const { rank, file} = item
        const dF = Math.abs(toFile - file)
        const dR = Math.abs(toRank - rank)
        return (dF === 2 && dR === 1) || (dF === 1 && dR === 2)
    })

    const moveMap = new Map()

    return (
        <GameContext.Provider value={{ game, canMoveMap, handleMove }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => {
    return useContext(GameContext)
}