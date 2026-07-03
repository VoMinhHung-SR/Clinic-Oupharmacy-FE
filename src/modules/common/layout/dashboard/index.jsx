import React, { useState } from "react"
import { Outlet, useLocation } from "react-router"
import { Box, ThemeProvider, useTheme, useMediaQuery, Toolbar } from "@mui/material"
import { dashboardTheme } from "../../../../theme/dashboardTheme"
import Copyright from "./footer"
import NavDashboard from "./nav"
import {
  DASHBOARD_HIDE_FOOTER_PREFIXES,
  DASHBOARD_PAGE_PADDING,
  DASHBOARD_PAGE_PADDING_Y,
  shouldShowDashboardFooter,
} from "./styleTokens"

export default function DashboardLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const location = useLocation()

  const [open, setOpen] = useState(!isMobile)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const collapsedDrawerWidth = theme.spacing(9)
  const hideFooter = DASHBOARD_HIDE_FOOTER_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  )
  const showFooter = shouldShowDashboardFooter(location.pathname)

  return (
    <ThemeProvider theme={dashboardTheme}>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <NavDashboard open={open} toggleDrawer={toggleDrawer} />

        <Box
          component="main"
          sx={{
            backgroundColor: "background.default",
            flexGrow: 1,
            height: "100vh",
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            marginLeft: isMobile ? 0 : open ? 0 : `${collapsedDrawerWidth}px`,
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              px: DASHBOARD_PAGE_PADDING,
              py: DASHBOARD_PAGE_PADDING_Y,
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Outlet />
            </Box>
            {!hideFooter && showFooter && <Copyright sx={{ flexShrink: 0, py: 0.25 }} />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
