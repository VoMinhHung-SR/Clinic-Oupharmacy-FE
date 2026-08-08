/** Shared dashboard surface + spacing tokens (Phase 0 style contract + P0 polish). */

import { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE } from "../../../../lib/constants"

export const DASHBOARD_BORDER = "1px solid"
export const DASHBOARD_BORDER_COLOR = "divider"
/** MUI elevation-4 — shadow nghiêng góc phải dưới (khớp AvatarProfile). */
export const DASHBOARD_SHADOW =
  "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)"

/**
 * Dashboard radius contract — explicit px strings (avoids MUI shape multiplier drift).
 * - surface (12px): cards / panes / context strips
 * - control (8px): buttons, inputs, inset panels, list rows
 * - pill (999): chips, badges, drag handles
 */
export const DASHBOARD_RADIUS = {
  surface: 12,
  control: 8,
  pill: 999,
}

/** @param {"surface" | "control" | "pill"} tier */
export const dashboardRadius = (tier) =>
  tier === "pill" ? DASHBOARD_RADIUS.pill : `${DASHBOARD_RADIUS[tier]}px`

export const DASHBOARD_SURFACE = {
  elevation: 4,
  borderRadius: dashboardRadius("surface"),
}

/** Shared Paper chrome for dashboard cards / panes — shadow via elevation={DASHBOARD_SURFACE.elevation}. */
export const DASHBOARD_PAPER_SX = {
  borderRadius: DASHBOARD_SURFACE.borderRadius,
  bgcolor: "background.paper",
}

export const DASHBOARD_PAGE_PADDING = {
  xs: 1.5,
  md: 2,
}

export const DASHBOARD_PAGE_PADDING_Y = {
  xs: 1,
  md: 1.5,
}

/** Toolbar row — filter/actions only (title lives in AppBar). */
export const DASHBOARD_LIST_HEADER_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 2,
  px: 2,
  py: 1.5,
  minHeight: 52,
  borderBottom: 1,
  borderColor: DASHBOARD_BORDER_COLOR,
  bgcolor: "background.paper",
  flexShrink: 0,
}

export const DASHBOARD_FILTER_BUTTON_SX = {
  borderRadius: dashboardRadius("control"),
  fontWeight: 500,
  textTransform: "none",
  px: 2,
}

export const DASHBOARD_PAGINATION_SX = {
  pt: 1.5,
  pb: 1,
  px: 2,
}

/** Table head — brand tint, fixed 48px height (mọi dashboard list table). */
export const DASHBOARD_TABLE_HEAD_BG = "#f8faff"

export const DASHBOARD_TABLE_HEAD_HEIGHT = 48

export const DASHBOARD_TABLE_HEAD_CELL_SX = {
  height: DASHBOARD_TABLE_HEAD_HEIGHT,
  minHeight: DASHBOARD_TABLE_HEAD_HEIGHT,
  maxHeight: DASHBOARD_TABLE_HEAD_HEIGHT,
  boxSizing: "border-box",
  py: 0,
  px: 2,
  fontWeight: 600,
  fontSize: "0.8125rem",
  lineHeight: 1.25,
  letterSpacing: "0.01em",
  color: "primary.dark",
  bgcolor: DASHBOARD_TABLE_HEAD_BG,
  borderBottom: "2px solid",
  borderColor: "primary.main",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
}

export const DASHBOARD_TABLE_BODY_CELL_SX = {
  py: 1.5,
  px: 2,
  fontSize: "0.875rem",
  lineHeight: 1.43,
}

export const DASHBOARD_TABLE_SX = {
  "& .MuiTableCell-head": {
    ...DASHBOARD_TABLE_HEAD_CELL_SX,
  },
  "& .MuiTableCell-body": {
    ...DASHBOARD_TABLE_BODY_CELL_SX,
  },
}

export const DASHBOARD_TABLE_CONTAINER_SX = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
}

/** Optional mobile density override for list tables. */
export const DASHBOARD_TABLE_MOBILE_BODY_SX = {
  "& .MuiTableCell-body": {
    whiteSpace: "nowrap",
    maxWidth: 150,
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.75rem",
    py: 1,
    px: 1,
  },
}

export const DASHBOARD_ACTIONS_CELL_SX = {
  minWidth: 148,
  width: 148,
}

/** Outlet wrapper inside DashboardLayout — fill viewport below app bar. */
export const DASHBOARD_PAGE_FRAME_SX = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxSizing: "border-box",
  /** Room for elevation shadow — tránh bị clip bởi overflow:hidden của layout shell. */
  pb: 1.5,
  pr: 0.75,
}

export const DASHBOARD_SCROLL_BODY_SX = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

/** Scrollable page body inside DASHBOARD_PAGE_FRAME_SX */
export const DASHBOARD_SCROLL_CONTENT_SX = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
}

/** Routes that hide layout footer to maximize list viewport. */
export const DASHBOARD_HIDE_FOOTER_PREFIXES = [
  "/dashboard/examinations",
  "/dashboard/prescribing",
  "/dashboard/categories",
]

/** Show copyright only on dashboard home. */
export const shouldShowDashboardFooter = (pathname) =>
  pathname === "/dashboard" || pathname === "/dashboard/"

/** Sidebar active state — disambiguate prescribing vs payments (same list URL). */
export const isDashboardNavItemActive = (pathname, item, user = null) => {
  const { id, link } = typeof item === "string" ? { id: undefined, link: item } : item

  if (link === "/dashboard" || id === "dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/"
  }

  // Kê toa: list (doctor/admin oversight) + doctor workspace — never payments sub-routes
  if (id === "prescribing") {
    if (pathname.includes("/payments")) return false
    if (pathname === "/dashboard/prescribing") {
      return user?.role === ROLE_DOCTOR || user?.role === ROLE_ADMIN
    }
    return /^\/dashboard\/prescribing\/[^/]+$/.test(pathname) && user?.role === ROLE_DOCTOR
  }

  // Thanh toán: list (nurse) + .../payments detail (nurse/admin)
  if (id === "payments") {
    if (pathname.includes("/payments")) return true
    if (pathname === "/dashboard/prescribing") {
      return user?.role === ROLE_NURSE
    }
    return false
  }

  return pathname === link || pathname.startsWith(`${link}/`)
}

/** Primary header bar for split panes (waiting-room, conversations). */
export const DASHBOARD_PANE_HEADER_SX = {
  flexShrink: 0,
  px: 2,
  py: 1.5,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  textAlign: "center",
}

/** Profile / side nav item — aligned with dashboard toolbar height. */
export const dashboardNavItemSx = (isActive, variant = "primary") => ({
  display: "flex",
  alignItems: "center",
  px: 2,
  py: 1.25,
  minHeight: 44,
  borderRadius: dashboardRadius("control"),
  transition: "background-color 0.15s ease",
  ...(isActive && variant === "warning"
    ? { bgcolor: "warning.main", color: "warning.contrastText" }
    : isActive
      ? { bgcolor: "primary.main", color: "primary.contrastText" }
      : { "&:hover": { bgcolor: "action.hover" } }),
})
