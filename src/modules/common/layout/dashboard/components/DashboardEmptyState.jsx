import { Box, Typography } from "@mui/material"
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined"

/** Centered empty state for dashboard tables and lists. */
export default function DashboardEmptyState({ message, icon = null }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        gap: 1.5,
      }}
    >
      {icon ?? <InboxOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} aria-hidden />}
      <Typography variant="body1" color="text.secondary" align="center">
        {message}
      </Typography>
    </Box>
  )
}
