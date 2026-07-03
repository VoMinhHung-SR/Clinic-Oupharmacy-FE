import { createTheme } from "@mui/material/styles"

/** Scoped theme for /dashboard/* — does not affect public site. */
export const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      dark: "#1e3a8a",
      light: "#3b82f6",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    subtitle1: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "inherit",
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation2: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          lineHeight: 1.4,
          color: "rgba(0, 0, 0, 0.6)",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        },
        stickyHeader: {
          backgroundColor: "#f9fafb",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginInline: 8,
          marginBlock: 2,
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.24)",
            },
          },
        },
      },
    },
  },
})
