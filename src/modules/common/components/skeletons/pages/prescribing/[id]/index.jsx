import { Box, Grid, Skeleton } from "@mui/material"

const SkeletonPrescribingDetail = () => {
    return(
        <Box sx={{ height: "300px" }} className="ou-p-5">
        <Grid container>
          <Grid item xs={8} className="ou-pr-6">
            <Box className="ou-mb-3">
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>
            <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 1, mb: 2 }} />
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={72}
                sx={{ borderRadius: 1, mb: 1 }}
              />
            ))}
          </Grid>
          <Grid item xs={4}>
            <Box className="ou-mb-6">
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
            </Box>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Box>
    )
}

export default SkeletonPrescribingDetail;