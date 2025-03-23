import { useState } from "react"

const useCustomModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpenModal = () => {
        setIsOpen(true)
    }
    const handleCloseModal = () => {
        setIsOpen(false)
    }
    return{
        isOpen,handleCloseModal, handleOpenModal
    }
}
export default useCustomModal