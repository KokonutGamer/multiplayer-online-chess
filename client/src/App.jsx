import Board from "./game/Board.jsx"
import { GameContextProvider } from "./game/GameContext.jsx"

function App() {
  return (
    <GameContextProvider>
      <Board />
    </GameContextProvider>
  )
}

export default App
