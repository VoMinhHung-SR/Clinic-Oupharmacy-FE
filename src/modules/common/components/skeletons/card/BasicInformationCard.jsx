import { Box, Paper, Skeleton } from "@mui/material";

const SkeletonBasicInformationCard = () => {
    return (
        <Box component={Paper} elevation={4} className="ou-w-full ou-h-[160px] ou-py-5">
            <Skeleton variant="rectangular" height={32} className="ou-w-[30%] ou-mx-auto ou-mb-5" />
            <Box className="ou-flex ou-justify-between">
                <Skeleton variant="rectangular" height={40} className="ou-w-[40%] ou-mx-auto" /> 
                <Skeleton variant="rectangular" height={40} className="ou-w-[40%] ou-mx-auto" />
            </Box>
        </Box>
    )
}

export default SkeletonBasicInformationCard;