import { useState } from "react";

const useExaminationFilter = () => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return {
        expanded, toggleExpanded
    }
}

export default useExaminationFilter