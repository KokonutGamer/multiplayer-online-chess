import Square from "./Square"
import { useDrop } from "react-dnd"
import { Constants, extractType, PieceType } from "./Constants"
import { useGame } from "./GameContext"
import Overlay from "./Overlay"

function BoardSquare({ rank, file, children }) {
    const { canMoveMap, handleMove } = useGame()
    const dark = (rank + file) % 2 === 1
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: [Constants.WHITE_KING, Constants.WHITE_KNIGHT, Constants.WHITE_PAWN, Constants.BLACK_PAWN],
            canDrop: (item) => canMoveMap.get(extractType(item.id))(item, rank, file),
            drop: (item) => handleMove(item, rank, file),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [rank, file]
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