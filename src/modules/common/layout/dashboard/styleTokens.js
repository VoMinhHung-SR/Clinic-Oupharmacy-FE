/** Shared dashboard surface + spacing tokens (Phase 0 style contract). */
export const DASHBOARD_SURFACE = {
  elevation: 2,
  borderRadius: 2,
}

export const DASHBOARD_PAGE_PADDING = {
  xs: 2,
  md: 3,
}

export const DASHBOARD_LIST_HEADER_SX = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  gap: 2,
  p: 2,
  borderBottom: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
}

export const DASHBOARD_FILTER_BUTTON_SX = {
  borderRadius: 3,
  fontWeight: 500,
  textTransform: "none",
}

export const DASHBOARD_PAGINATION_SX = {
  pt: 3,
  pb: 2,
}
