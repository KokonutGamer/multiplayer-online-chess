import Board from "../game/Board"
import { GameContextProvider } from "../game/GameContext"

function GamePage() {
    return (
        <GameContextProvider>
            <Board />
        </GameContextProvider>
    )
}

export default GamePage
