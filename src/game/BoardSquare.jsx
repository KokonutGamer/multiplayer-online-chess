import Square from "./Square"
import { useDrop } from "react-dnd"
import { Constants } from "./Constants"
import { useGame } from "./GameContext"
import Overlay from "./Overlay"

function BoardSquare({ rank, file, children }) {
    const { moveCount, compute, handleMove, moves } = useGame()
    const dark = (rank + file) % 2 === 1

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: Object.values(Constants).filter((piece) => (piece === piece.toUpperCase() ? moveCount % 2 === 0 : moveCount % 2 === 1)),
            canDrop: (item) => moves.some(move => move.from.rank === item.rank && move.from.file === item.file && move.to.rank === rank && move.to.file === file),
            drop: (item) => handleMove({ ...item, toRank: rank, toFile: file }),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [rank, file, moveCount, moves]
    )

    return (
        <div
            ref={drop}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
        >
            <Square dark={dark}>{children}</Square>
            {isOver && !canDrop && <Overlay color="red" />}
            {!isOver && canDrop && <Overlay color="yellow" />}
            {isOver && canDrop && <Overlay color="green" />}
        </div>
    )
}

export default BoardSquare