import { useEffect, useRef } from "react"

function PromotionDialog({ open, onClose, promotionPiece, children }) {
    const ref = useRef()

    useEffect(() => {
        if (open && !promotionPiece) {
            ref.current?.showModal()
        } else {
            ref.current?.close()
        }
    }, [open, promotionPiece])

    return (
        <dialog ref={ref} onCancel={onClose} autoFocus>
            {children}
            <form action={onClose}>
                <select name="promotion-piece" id="promotion-piece">
                    <option value="k">Knight</option>
                    <option value="b">Bishop</option>
                    <option value="r">Rook</option>
                    <option value="q">Queen</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </dialog>
    )
}

export default PromotionDialog