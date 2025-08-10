import { Box } from "@mui/material";
import SkeletonListLineItem from "../listLineItem";

const SkeDiagnosisCard = () => {
    return (
        <Box className="ou-mt-5">
            <Box className="ou-mb-3">
                <SkeletonListLineItem 
                height="20px"count={1} className="ou-w-[50%] ou-m-auto"/>
            </Box>
            <Box className="ou-p-5">
                {/* title area */}
                <Box className="ou-w-[20%] ou-mb-2"><SkeletonListLineItem count={1}/></Box>
                {/* input area */}
                <SkeletonListLineItem count={1}/>
            </Box>
            <Box className="ou-p-5">
                {/* title area */}
                <Box className="ou-w-[20%] ou-mb-2"><SkeletonListLineItem count={1}/></Box>
                {/* input area */}
                <SkeletonListLineItem count={1}/>
            </Box>
        </Box>
    )
}

export default SkeDiagnosisCard;