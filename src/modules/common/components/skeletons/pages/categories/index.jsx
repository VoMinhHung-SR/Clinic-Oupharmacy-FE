import { Box, Paper } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"
import { DASHBOARD_SURFACE } from "../../../../layout/dashboard/styleTokens"

const SkeletonCategoryList = () => {
  return (
    <Box
      component={Paper}
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{
        flex: 1,
        minHeight: 0,
        borderRadius: DASHBOARD_SURFACE.borderRadius,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ width: "20%", mb: 2 }}>
        <SkeletonListLineItem count={1} height="32px" className="ou-w-full" />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 1 }}>
        <SkeletonListLineItem count={1} height="32px" className="ou-w-[10%]" />
        <SkeletonListLineItem count={1} height="32px" className="ou-w-[60%]" />
        <SkeletonListLineItem count={1} height="32px" className="ou-w-[30%]" />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SkeletonListLineItem count={5} height="40px" className="ou-w-full" />
      </Box>
    </Box>
  )
}

export default SkeletonCategoryList
