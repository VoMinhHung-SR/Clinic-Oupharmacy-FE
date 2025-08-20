import { Box, Divider, Paper, Skeleton } from "@mui/material";

const SkeletonDiagnosis = () => {
    return (
        <Box className="ou-container ou-mx-auto ou-min-h-screen ou-bg-gray-100 ou-p-4">

            {/* Thông tin cơ bản card */}
            <Box component={Paper} elevation={2} className="ou-bg-white ou-rounded-lg ou-p-6 ou-mb-4">
                <Skeleton variant="rectangular" height={32} className="ou-w-[20%] ou-mx-auto ou-my-4 ou-text-center" />
                <Box className="ou-flex ou-justify-center ou-mb-4">
                    <Skeleton variant="rectangular" height={48} className="ou-w-[20%] ou-mx-auto" />
                    <Skeleton variant="rectangular" height={48} className="ou-w-[20%] ou-mx-auto" />
                </Box>
            </Box>

            {/* Alert/Warning section */}
            <Box className="ou-bg-orange-100 ou-border-l-4 ou-border-orange-500 ou-p-4 ou-mb-4 ou-rounded-r-lg">
                <Box className="ou-flex ou-items-center ou-justify-between">
                    <Box className="ou-flex ou-items-center ou-gap-3">
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="rectangular" height={32} className="ou-w-[120px]" />
                        <Skeleton variant="rectangular" height={20} className="ou-w-[250px]" />
                    </Box>
                    <Skeleton variant="rectangular" height={32} className="ou-w-[150px]" />
                </Box>
            </Box>

  
            <Box component={Paper} elevation={2} className="ou-bg-white ou-rounded-lg ou-p-6 ou-mb-4">
                <Skeleton variant="rectangular" height={32} className="ou-w-[20%] ou-my-6" />
                
               
                <Box className="ou-mb-6">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[10%] ou-mb-2" />
                    <Skeleton variant="rectangular" height={56} className="ou-w-full" />
                </Box>

         
                <Box className="ou-mb-6">
                    <Skeleton variant="rectangular" height={20} className="ou-w-[10%] ou-mb-2" />
                    <Skeleton variant="rectangular" height={56} className="ou-w-full" />
                </Box>

               
                <Box className="ou-flex ou-justify-center">
                    <Skeleton variant="rectangular" height={48} className="ou-w-[15%]" />
                </Box>
            </Box>

            <Box className="ou-flex ou-justify-center ou-mb-8">
                <Skeleton variant="rectangular" height={48} className="ou-w-[20%]" />
            </Box>

        </Box>
    );
};

export default SkeletonDiagnosis;