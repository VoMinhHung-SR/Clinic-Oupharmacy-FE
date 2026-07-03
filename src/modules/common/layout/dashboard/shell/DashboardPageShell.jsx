import { Box, Collapse, Paper } from "@mui/material"
import {
  DASHBOARD_LIST_HEADER_SX,
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_PAGINATION_SX,
  DASHBOARD_PAPER_SX,
  DASHBOARD_SCROLL_BODY_SX,
  DASHBOARD_SURFACE,
} from "../styleTokens"

/**
 * Viewport-filling page shell: toolbar/filter/footer fixed, scrollable body.
 * Page title is shown in AppBar only — no duplicate h6 in card header.
 */
export default function DashboardPageShell({
  actions = null,
  showFilter = false,
  filterPanel = null,
  toolbar = null,
  footer = null,
  children,
}) {
  const showHeader = actions != null

  return (
    <Box sx={DASHBOARD_PAGE_FRAME_SX}>
      <Paper
        elevation={DASHBOARD_SURFACE.elevation}
        sx={{
          ...DASHBOARD_PAPER_SX,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {showHeader && <Box sx={DASHBOARD_LIST_HEADER_SX}>{actions}</Box>}

        {toolbar != null && (
          <Box sx={{ flexShrink: 0, px: 2, pt: showHeader ? 0 : 2, pb: 1.5 }}>{toolbar}</Box>
        )}

        {filterPanel != null && (
          <Collapse in={showFilter}>
            <Box sx={{ flexShrink: 0, p: 2, bgcolor: "action.hover", borderBottom: 1, borderColor: "divider" }}>
              {filterPanel}
            </Box>
          </Collapse>
        )}

        <Box sx={DASHBOARD_SCROLL_BODY_SX}>{children}</Box>

        {footer != null && (
          <Box
            sx={{
              flexShrink: 0,
              borderTop: 1,
              borderColor: "divider",
              ...DASHBOARD_PAGINATION_SX,
            }}
          >
            {footer}
          </Box>
        )}
      </Paper>
    </Box>
  )
}
