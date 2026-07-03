import { Box, Grid, Paper } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SCROLL_CONTENT_SX,
  DASHBOARD_SURFACE,
} from "../../../../layout/dashboard/styleTokens"

/** Dashboard home loading — stat cards + chart placeholders fill viewport. */
export default function SkeletonDashboardHome() {
  return (
    <Box sx={DASHBOARD_PAGE_FRAME_SX}>
      <Grid container sx={{ flexShrink: 0, mb: 2 }}>
        {[0, 1, 2, 3].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i} sx={{ p: 1, pl: i === 0 ? { md: 0 } : 1, pr: i === 3 ? { md: 0 } : 1 }}>
            <Paper
              elevation={DASHBOARD_SURFACE.elevation}
              sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, p: 2, minHeight: 116 }}
            >
              <SkeletonListLineItem count={2} height="28px" className="ou-w-full" />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box className="ou-scrollbar" sx={DASHBOARD_SCROLL_CONTENT_SX}>
        <Grid container spacing={2}>
          {[0, 1].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                elevation={DASHBOARD_SURFACE.elevation}
                sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, p: 2, minHeight: 320 }}
              >
                <SkeletonListLineItem count={1} height="280px" className="ou-w-full" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
