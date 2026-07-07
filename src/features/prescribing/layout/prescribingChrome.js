import {
  DASHBOARD_PAPER_SX,
  DASHBOARD_RADIUS,
  dashboardRadius,
} from "../../../modules/common/layout/dashboard/styleTokens"

/** Re-export for prescribing feature consumers. */
export const PRESCRIBING_RADIUS = DASHBOARD_RADIUS

/** Shared elevation for patient / diagnosis context cards. */
export const PRESCRIBING_CONTEXT_ELEVATION = 2

/** Context strip Paper — patient bar, diagnosis strip (Tier A). */
export const prescribingContextPaperSx = {
  borderRadius: dashboardRadius("surface"),
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
}

/** Main catalog / draft shell (Tier B) — same radius as dashboard cards. */
export const prescribingShellPaperSx = {
  ...DASHBOARD_PAPER_SX,
}

/**
 * Tinted section band inside shell — no extra elevation (Tier C).
 * Use for diagnosis suggestions instead of nested Paper cards.
 */
export const prescribingSectionBandSx = {
  borderRadius: dashboardRadius("control"),
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
}

/** Inset panel — quick add, results list, draft scroll (Tier C/D). */
export const prescribingInsetPanelSx = {
  borderRadius: dashboardRadius("control"),
  border: "1px solid",
  borderColor: "divider",
}

/** Flat results zone — divider only, no corner radius (inside shell). */
export const prescribingResultsZoneSx = {
  borderTop: "1px solid",
  borderColor: "divider",
}

/** Chip / badge pill radius. */
export const prescribingPillRadius = dashboardRadius("pill")

/** MUI sx for search input + filter button row. */
export const prescribingSearchInputSx = {
  bgcolor: "background.paper",
  borderRadius: dashboardRadius("control"),
}

/** Filter button aligned with search field height. */
export const prescribingFilterButtonSx = {
  borderRadius: dashboardRadius("control"),
  fontWeight: 500,
  textTransform: "none",
  minHeight: 40,
  px: 1.5,
  whiteSpace: "nowrap",
}

/** Dock top corners — attach flush to shell bottom. */
export const prescribingDockTopRadiusSx = {
  borderTopLeftRadius: dashboardRadius("surface"),
  borderTopRightRadius: dashboardRadius("surface"),
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}
