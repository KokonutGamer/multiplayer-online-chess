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
                    <option value="K">Knight</option>
                    <option value="B">Bishop</option>
                    <option value="R">Rook</option>
                    <option value="Q">Queen</option>
                </select>
                <button type="submit">Cancel</button>
            </form>
        </dialog>
    )
}

export default PromotionDialog