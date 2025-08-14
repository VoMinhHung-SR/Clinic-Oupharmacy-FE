import { Box, Divider, Paper, Skeleton } from "@mui/material";

const SkeletonPayments = () => {
    return (
        <Box component={Paper} elevation={6}  className="ou-container ou-mx-auto ou-min-h-[550px]">
        <Box className="ou-w-full ou-p-5">
                <Skeleton variant="rectangular" height={32} className="ou-w-[30%] ou-mr-auto"/>
                <Box className="ou-my-6">
                    <Divider />
                </Box>
                <Box className="ou-flex ou-justify-between">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2 " /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" />
                </Box>
                <Box className="ou-flex ou-justify-between">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" />
                </Box>
                <Box className="ou-flex ou-justify-between">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" />
                </Box>
                <Box className="ou-flex ou-justify-between">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" />
                </Box>
                <Box className="ou-flex ou-justify-between">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[45%] ou-mx-auto ou-my-2" />
                </Box>
            </Box>
        <Box className="ou-w-full ou-p-5">
            <Box className="ou-mb-6">
                    <Divider />
                </Box>
                <Box className="ou-flex ou-justify-between ou-mb-6">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[25%] ou-mx-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[25%] ou-mx-2" />
                    <Skeleton variant="rectangular" height={20} className="ou-w-[25%] ou-mx-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[25%] ou-mx-2" />
                    <Skeleton variant="rectangular" height={20} className="ou-w-[25%] ou-mx-2" />
                </Box>
                <Box className="ou-mb-6">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[100%] ou-m-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[100%] ou-m-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[100%] ou-m-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[100%] ou-m-2" /> 
                </Box>
                <Box className="ou-my-6">
                    <Divider />
                </Box>
                <Box className="ou-mb-4 ou-flex ou-flex-col ou-items-end">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[20%] ou-my-2" /> 
                    <Skeleton variant="rectangular" height={20} className="ou-w-[30%] ou-my-2" /> 
                    <Skeleton variant="rectangular" height={32} className="ou-w-[40%] ou-my-2" /> 
                </Box>
        </Box>
    </Box>
    )
}

export default SkeletonPayments;