import { Box, Paper } from "@mui/material"
import { DASHBOARD_PAGE_FRAME_SX, DASHBOARD_PAPER_SX, DASHBOARD_SURFACE } from "../styleTokens"

function SplitPane({ children, sx = {} }) {
  return (
    <Paper
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{
        ...DASHBOARD_PAPER_SX,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        ...sx,
      }}
    >
      <Box className="ou-scrollbar" sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {children}
      </Box>
    </Paper>
  )
}

/**
 * Two-pane dashboard layout (conversations, profile-like).
 * When fillViewport=false, keeps legacy min-height for public routes.
 */
export default function DashboardSplitShell({
  left,
  right,
  leftWidth = "30%",
  fillViewport = true,
}) {
  return (
    <Box
      sx={{
        ...(fillViewport ? DASHBOARD_PAGE_FRAME_SX : { width: "100%", minHeight: 600 }),
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      <SplitPane
        sx={{
          flex: { xs: "0 0 auto", md: `0 0 ${leftWidth}` },
          width: { xs: "100%", md: leftWidth },
          maxHeight: { xs: "42vh", md: "100%" },
        }}
      >
        {left}
      </SplitPane>

      <SplitPane
        sx={{
          flex: { xs: "1 1 auto", md: "1 1 0" },
          width: { xs: "100%", md: "auto" },
          maxHeight: { xs: "none", md: "100%" },
        }}
      >
        {right}
      </SplitPane>
    </Box>
  )
}
