import { Box, Divider, Paper, Typography } from "@mui/material"
import { DASHBOARD_SURFACE, DASHBOARD_PAPER_SX } from "../../../layout/dashboard/styleTokens"

const StatisticCard = ({ icon, title, value, footer }) => {
  return (
    <Paper
      elevation={DASHBOARD_SURFACE.elevation}
      sx={{
        ...DASHBOARD_PAPER_SX,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Box>{icon}</Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            textAlign: "right",
            width: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="span" fontWeight={600} color="text.primary">
            {value}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ width: "90%", mx: "auto" }} />
      <Box sx={{ p: 2, pt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {footer}
        </Typography>
      </Box>
    </Paper>
  )
}

export default StatisticCard
