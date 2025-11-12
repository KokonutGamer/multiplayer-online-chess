import images from "./Images.js"
import { useDrag } from "react-dnd"

function Piece({ type, rank, file }) {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: type,
            item: { id: type, rank, file },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging()
            })
        }),
        [type, rank, file]
    )

    return (
        <img
            src={images.get(type)}
            ref={drag}
            className="piece"
            style={{
                opacity: isDragging ? 0.5 : 0.99
            }}
        />
    )
}

export default Piece