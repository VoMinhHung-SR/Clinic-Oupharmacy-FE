import { Box, Typography } from "@mui/material"
import { DASHBOARD_PANE_HEADER_SX } from "../styleTokens"

/** Primary pane header — matches waiting-room / conversations pattern. */
export default function DashboardPaneHeader({ title, subtitle = null }) {
  return (
    <Box sx={DASHBOARD_PANE_HEADER_SX}>
      <Typography variant="subtitle1" fontWeight={600} component="h2">
        {title}
      </Typography>
      {subtitle != null && (
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
