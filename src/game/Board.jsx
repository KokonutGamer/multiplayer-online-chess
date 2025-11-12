import BoardSquare from "./BoardSquare"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import Piece from "./Piece"
import { useGame } from "./GameContext"

function renderSquare(rank, file, board) {
    return (
        <div
            key={rank * 8 + file}
            style={{ width: '12.5%', height: '12.5%' }}
        >
            <BoardSquare rank={rank} file={file}>
                {renderPiece(rank, file, board)}
            </BoardSquare>
        </div>
    )
}

function renderPiece(rank, file, board) {
    const piece = board[rank][file]
    if (piece) {
        return <Piece type={piece} rank={rank} file={file} />
    }
}

function Board() {
    const { game } = useGame()

    const squares = []
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            squares.push(renderSquare(r, f, game))
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="board">
                {squares}
            </div>
        </DndProvider>
    )
}

export default Board