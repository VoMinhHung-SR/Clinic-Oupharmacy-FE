import { createTheme } from "@mui/material/styles"
import { brandPalette } from "./brandPalette"

/** Scoped theme for public layout + auth pages (not dashboard). */
export const publicTheme = createTheme({
  palette: brandPalette,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})
