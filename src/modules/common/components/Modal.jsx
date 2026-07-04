import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import clsx from "clsx"
import {
  MODAL_ACTIONS_SX,
  MODAL_CONTENT_SX,
  MODAL_PAPER_SX,
  MODAL_TITLE_SX,
} from "./modalTokens"

const CustomModal = (props) => {
  const {
    title,
    content,
    open,
    onClose,
    actions,
    isClosingDropOutside = true,
    className,
    maxWidth = "md",
    fullWidth = true,
    showCloseButton = true,
  } = props

  const handleDialogClose = (event, reason) => {
    if (!isClosingDropOutside && reason === "backdropClick") {
      return
    }
    if (onClose) {
      onClose(event, reason)
    }
  }

  const showHeader = Boolean(title) || (showCloseButton && onClose)
  const showFooter = Boolean(actions)

  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      onClose={handleDialogClose}
      scroll="paper"
      PaperProps={{ sx: MODAL_PAPER_SX }}
    >
      {showHeader && (
        <DialogTitle sx={MODAL_TITLE_SX} component="div">
          {title ? (
            <Typography
              variant="h6"
              component="h2"
              fontWeight={600}
              className={clsx(className)}
              sx={{ fontSize: { xs: "1.05rem", sm: "1.15rem" }, color: "#1e3a8a" }}
            >
              {title}
            </Typography>
          ) : (
            <span />
          )}
          {showCloseButton && onClose ? (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{ color: "text.secondary", ml: "auto" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null}
        </DialogTitle>
      )}

      <DialogContent sx={MODAL_CONTENT_SX}>{content}</DialogContent>

      {showFooter && <DialogActions sx={MODAL_ACTIONS_SX}>{actions}</DialogActions>}
    </Dialog>
  )
}

export default CustomModal
