import { createTheme } from "@mui/material/styles"
import { DASHBOARD_TABLE_HEAD_BG, DASHBOARD_RADIUS } from "../modules/common/layout/dashboard/styleTokens"

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
      default: "#f3f4f6",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 4,
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
        elevation4: {
          boxShadow:
            "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.8125rem",
          lineHeight: 1.25,
          letterSpacing: "0.01em",
          color: "#1e3a8a",
          backgroundColor: DASHBOARD_TABLE_HEAD_BG,
          borderBottom: "2px solid #2563eb",
          height: 48,
          minHeight: 48,
          maxHeight: 48,
          paddingTop: 0,
          paddingBottom: 0,
          boxSizing: "border-box",
          verticalAlign: "middle",
        },
        stickyHeader: {
          backgroundColor: DASHBOARD_TABLE_HEAD_BG,
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
          borderRadius: DASHBOARD_RADIUS.control,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: DASHBOARD_RADIUS.control,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: DASHBOARD_RADIUS.control,
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
