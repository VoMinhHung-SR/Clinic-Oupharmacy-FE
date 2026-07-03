/** Shared dashboard surface + spacing tokens (Phase 0 style contract + P0 polish). */

export const DASHBOARD_BORDER = "1px solid"
export const DASHBOARD_BORDER_COLOR = "divider"
export const DASHBOARD_SHADOW = "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)"

export const DASHBOARD_SURFACE = {
  elevation: 2,
  borderRadius: 3,
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
  borderRadius: 2,
  fontWeight: 500,
  textTransform: "none",
  px: 2,
}

export const DASHBOARD_PAGINATION_SX = {
  pt: 1.5,
  pb: 1,
  px: 2,
}

/** Sticky table head cell — complements theme MuiTableCell.head overrides. */
export const DASHBOARD_TABLE_HEAD_CELL_SX = {
  fontWeight: 600,
  fontSize: "0.75rem",
  color: "text.secondary",
  bgcolor: "grey.50",
  whiteSpace: "nowrap",
}

export const DASHBOARD_TABLE_SX = {
  "& .MuiTableCell-head": {
    ...DASHBOARD_TABLE_HEAD_CELL_SX,
  },
}

export const DASHBOARD_TABLE_CONTAINER_SX = {
  flex: 1,
  minHeight: 0,
  overflow: "auto",
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
