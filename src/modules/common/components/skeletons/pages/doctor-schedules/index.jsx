import { Box, Paper } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"
import { DASHBOARD_PAGE_FRAME_SX, DASHBOARD_SURFACE } from "../../../../layout/dashboard/styleTokens"

const SkeletonDoctorScheduleList = () => {
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <SkeletonListLineItem count={1} height="32px" className="ou-w-[10%]" />
      </Box>

      <SkeletonListLineItem count={1} height="32px" className="ou-w-[30%] ou-mx-auto ou-mb-4" />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 1 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonListLineItem key={`h-${i}`} count={1} height="72px" className="ou-w-[15%]" />
        ))}
      </Box>

      {[1, 2].map((row) => (
        <Box key={row} sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap: 1 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonListLineItem key={`${row}-${i}`} count={1} height="60px" className="ou-w-[15%]" />
          ))}
        </Box>
      ))}

      <Box sx={{ mt: 4 }}>
        <SkeletonListLineItem count={1} height="72px" className="ou-w-full ou-mb-2" />
        <SkeletonListLineItem count={2} height="60px" className="ou-w-full" />
      </Box>
    </Box>
  )
}

export default SkeletonDoctorScheduleList
