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
        p: 0,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          gap: 2,
        }}
      >
        <SkeletonListLineItem count={1} height="28px" className="ou-w-[35%]" />
        <SkeletonListLineItem count={1} height="32px" className="ou-w-[40%]" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flex: 1,
          minHeight: 280,
        }}
      >
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonListLineItem key={`h-${i}`} count={1} height="44px" className="ou-w-[14%]" />
            ))}
          </Box>
          {[1, 2].map((row) => (
            <Box key={row} sx={{ display: "flex", gap: 1, mb: 1 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <SkeletonListLineItem
                  key={`${row}-${i}`}
                  count={1}
                  height="72px"
                  className="ou-w-[14%]"
                />
              ))}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            borderTop: { xs: 1, md: 0 },
            borderLeft: { md: 1 },
            borderColor: "divider",
            p: 2,
          }}
        >
          <SkeletonListLineItem count={1} height="24px" className="ou-w-[60%] ou-mb-2" />
          <SkeletonListLineItem count={1} height="16px" className="ou-w-[80%] ou-mb-3" />
          <SkeletonListLineItem count={2} height="56px" className="ou-w-full ou-mb-2" />
          <SkeletonListLineItem count={1} height="36px" className="ou-w-[40%] ou-ml-auto ou-mt-4" />
        </Box>
      </Box>
    </Box>
  )
}

export default SkeletonDoctorScheduleList
