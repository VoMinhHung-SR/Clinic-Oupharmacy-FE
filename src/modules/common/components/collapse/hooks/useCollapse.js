import { useState } from "react"

const useCollapse = (isOpen) => {


    const [open, setOpen] = useState(isOpen || false)

    const handleSetOpen = () => {
        setOpen(!open);
    }

    return{
        open, handleSetOpen
    }
}

export default useCollapse