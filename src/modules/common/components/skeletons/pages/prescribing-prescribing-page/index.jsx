import { Box, Grid, Paper, Skeleton } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"

export const ListSection = () => (
  <Box className="ou-text-center ou-mt-3">
    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} className="ou-w-full ou-mb-3" />
    <Box className="ou-flex ou-mb-2">
      <Skeleton variant="rectangular" height={24} sx={{ borderRadius: 1 }} className="ou-w-[50%]" />
      <Skeleton variant="rectangular" height={24} sx={{ borderRadius: 1 }} className="ou-w-[20%] ou-mx-auto" />
      <Skeleton variant="rectangular" height={24} sx={{ borderRadius: 1 }} className="ou-w-[10%]" />
    </Box>
    <SkeletonListLineItem count={4} height={88} className="ou-w-full" />
  </Box>
)

export const SidebarSection = () => (
  <Box className="ou-w-full">
    <Box className="ou-mb-6">
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} className="ou-w-full" />
    </Box>
    <Box component={Paper} elevation={5} className="ou-p-5 ou-w-full">
      <Skeleton variant="text" width="70%" height={32} sx={{ mx: "auto", mb: 2 }} />
      <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} className="ou-w-full ou-mb-2" />
      <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} className="ou-w-full ou-mb-2" />
      <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} className="ou-w-full ou-mb-3" />
      <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 1 }} className="ou-w-full" />
    </Box>
  </Box>
)

const SkeletonPrescribingPage = () => (
  <Box sx={{ minHeight: "400px" }} className="ou-p-5">
    <Grid container>
      <Grid item xs={9} className="ou-pr-6">
        <Box component={Paper} elevation={5} className="ou-px-4 ou-py-6">
          <ListSection />
        </Box>
      </Grid>
      <Grid item xs={3} className="ou-w-[100%]">
        <SidebarSection />
      </Grid>
    </Grid>
  </Box>
)

SkeletonPrescribingPage.ListSection = ListSection
SkeletonPrescribingPage.SidebarSection = SidebarSection

export default SkeletonPrescribingPage
