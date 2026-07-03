import { Box, Divider, Paper, Skeleton } from "@mui/material"
import { DASHBOARD_PAGE_FRAME_SX, DASHBOARD_SURFACE } from "../../../../layout/dashboard/styleTokens"

const SkeletonPayments = () => {
  return (
    <Box
      component={Paper}
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{
        ...DASHBOARD_PAGE_FRAME_SX,
        borderRadius: DASHBOARD_SURFACE.borderRadius,
        p: 2.5,
      }}
    >
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Skeleton variant="rectangular" height={40} sx={{ width: "30%" }} />
        <Skeleton variant="rectangular" height={40} sx={{ width: "10%" }} />
      </Box>
      <Divider sx={{ my: 2 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", gap: 2, my: 1 }}>
          <Skeleton variant="rectangular" height={32} sx={{ width: "45%" }} />
          <Skeleton variant="rectangular" height={32} sx={{ width: "45%" }} />
        </Box>
      ))}
    </Box>
  )
}

export default SkeletonPayments
