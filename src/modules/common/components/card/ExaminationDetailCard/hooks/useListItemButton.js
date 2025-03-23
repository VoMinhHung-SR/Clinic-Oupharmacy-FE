import { useState } from "react"

const useListItemButton = () => {
    const [ isOpen, setIsOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prevSelectedId, setPrevSelectedId] = useState(null)
    const handleIsOpen = () =>{
        setIsOpen(!isOpen)
        
    } 

    const handleSelectId = (id) => {
        setLoading(true)
    
        // If the same item is clicked twice, close the list
        if (selectedId === id) {
          setIsOpen(false);
          setSelectedId(null);
          setPrevSelectedId(null);
          setLoading(false);
        }
        // If a different item is clicked, swap the selectedId and open the list
        else {
          setSelectedId(id);
          setIsOpen(true);
          setPrevSelectedId(selectedId);
          setLoading(false);
        }

      };


    return{
        selectedId, isOpen, handleIsOpen, handleSelectId, loading
    } 
}

export default useListItemButton