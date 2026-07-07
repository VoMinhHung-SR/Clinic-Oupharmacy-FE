import { Badge, Box, Drawer, Fab, IconButton, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import { cloneElement, isValidElement } from "react"
import { useTranslation } from "react-i18next"
import { prescribingPillRadius } from "../layout/prescribingChrome"

export default function PrescribingDraftDrawer({ open, onOpen, onClose, draftCount, children }) {
  const { t } = useTranslation(["prescription-detail"])

  return (
    <>
      <Fab
        color="primary"
        aria-label={t("prescription-detail:openDraftDrawer", { count: draftCount })}
        onClick={onOpen}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: (theme) => theme.zIndex.speedDial,
          display: { xs: "flex", md: "none" },
          textTransform: "none",
          gap: 0.5,
          px: 2,
          borderRadius: prescribingPillRadius,
          width: "auto",
          minWidth: 56,
        }}
      >
        <Badge badgeContent={draftCount} color="error" max={99}>
          <ReceiptLongIcon />
        </Badge>
        <Typography component="span" variant="button" sx={{ ml: 0.5, display: { xs: "none", sm: "inline" } }}>
          {t("prescription-detail:draftFabLabel")}
        </Typography>
      </Fab>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "88vh",
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {t("prescription-detail:prescriptionDetail")}
            {draftCount > 0 ? ` (${draftCount})` : ""}
          </Typography>
          <IconButton onClick={onClose} aria-label={t("prescription-detail:closeDraftDrawer")} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 1.5 }}>
          {isValidElement(children) ? cloneElement(children, { compact: true }) : children}
        </Box>
      </Drawer>
    </>
  )
}
