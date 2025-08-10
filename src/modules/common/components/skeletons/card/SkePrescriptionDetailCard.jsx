import { Box } from "@mui/material";
import SkeletonListLineItem from "../listLineItem";

const SkePrescriptionDetailCard = () => {
    return (
        <Box className="ou-mt-5">
            <Box className="ou-p-3">
                <SkeletonListLineItem 
                height="20px"count={1} className="ou-w-[50%] ou-m-auto"/>
            </Box>
            <Box className="ou-p-3">
                <SkeletonListLineItem count={5}/>
            </Box>
        </Box>
    )
}

export default SkePrescriptionDetailCard;