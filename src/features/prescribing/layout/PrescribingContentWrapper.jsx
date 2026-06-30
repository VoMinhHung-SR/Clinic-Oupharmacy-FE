import { Box, useTheme } from "@mui/material"

/** Viewport-height shell for prescribing workspace (offset ≈ app header). */
export default function PrescribingContentWrapper({ children }) {
  const theme = useTheme()
  const offset = theme.spacing(15)

  return (
    <Box
      sx={{
        overflow: "hidden",
        height: { xs: "auto", md: `calc(100vh - ${offset})` },
        maxHeight: { xs: "none", md: `calc(100vh - ${offset})` },
        minHeight: { xs: "70vh", md: 0 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  )
}
