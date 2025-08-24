import { Box, Paper } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"

const SkeletonCategoryList = () => {
    return (
        <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[100%]">
            <SkeletonListLineItem count={1} height="32px" className="ou-w-[20%] ou-mb-5"/>
            
            <Box className="ou-flex ou-justify-between ou-mb-5">
                <SkeletonListLineItem count={1} height="32px" className="ou-w-[10%] ou-pr-2"/>
                <SkeletonListLineItem count={1} height="32px" className="ou-w-[60%] ou-px-2"/>
                <SkeletonListLineItem count={1} height="32px" className="ou-w-[30%] ou-pl-2"/>
            </Box>
            <Box>
                <SkeletonListLineItem count={5} height="40px" className="ou-w-full"/>
            </Box>
        </Box>
    )
}

export default SkeletonCategoryList