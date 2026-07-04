/** Shared dialog chrome — aligned with dashboard brand. */
export const MODAL_PAPER_SX = {
  borderRadius: 3,
  overflow: "hidden",
  width: { xs: "95%", sm: "min(720px, 92vw)" },
  maxWidth: { xs: "100%", sm: "720px" },
  maxHeight: "min(90vh, 900px)",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
}

export const MODAL_TITLE_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  py: 2.5,
  px: 3,
  m: 0,
  bgcolor: "#f8faff",
  borderBottom: "2px solid #2563eb",
}

export const MODAL_CONTENT_SX = {
  px: { xs: 2.5, sm: 3 },
  py: { xs: 2.5, sm: 3 },
  // MUI zeroes top padding when DialogTitle precedes — restore even spacing
  "&.MuiDialogContent-root": {
    pt: { xs: 2.5, sm: 3 },
    pb: { xs: 2.5, sm: 3 },
  },
}

export const MODAL_ACTIONS_SX = {
  px: { xs: 2, sm: 3 },
  py: 2,
  gap: 1,
  borderTop: 1,
  borderColor: "divider",
  bgcolor: "grey.50",
}
