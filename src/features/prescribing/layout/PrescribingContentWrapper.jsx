import { Box } from "@mui/material"
import { DASHBOARD_PAGE_FRAME_SX } from "../../../modules/common/layout/dashboard/styleTokens"

/** Fills dashboard outlet; parent DashboardLayout owns viewport height. */
export default function PrescribingContentWrapper({ children }) {
  return (
    <Box
      sx={{
        ...DASHBOARD_PAGE_FRAME_SX,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  )
}
