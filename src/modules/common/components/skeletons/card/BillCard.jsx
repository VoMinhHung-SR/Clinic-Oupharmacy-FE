import { Box, Skeleton, Stack } from "@mui/material"

const SkeletonBillCard = ({
    count = 1, variant = 'rectangular',
    width = '100%', height = '20px',
    className = 'ou-mb-3'
}) => {
    return (
        <Stack>
            <Box className="ou-flex ou-justify-center ou-mb-4">
                <Skeleton className="ou-w-[30%] !ou-rounded-[12px]" height={40}/>
            </Box>
            <Box className="ou-mb-3">
                {[...Array(count)].map((_, index) => (
                    <Skeleton 
                    key={`skeleton-bill-card-${index}`}
                    count={count} variant={variant} 
                    width={width} height={height} 
                    className={className} 
                animation="pulse"
                sx={{
                    marginBottom: index === 0 ? '20px' : '12px',
                    borderRadius: '12px',
                    bgcolor: 'grey.200'
                }}
                />
            ))}
            </Box>
             <Box className="ou-mb-4 ou-w-full">
                <Skeleton className="ou-w-[40%] ou-ml-auto !ou-rounded-[12px]" height={32}/>
                <Skeleton className="ou-w-[35%] ou-ml-auto !ou-rounded-[12px]" height={32}/>
                <Skeleton className="ou-w-[30%] ou-ml-auto !ou-rounded-[12px]" height={40}/>
            </Box>
        </Stack>
    )   
}

export default SkeletonBillCard;