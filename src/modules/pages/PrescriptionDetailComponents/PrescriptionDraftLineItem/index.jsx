import React, { useState } from "react"
import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import EditIcon from "@mui/icons-material/Edit"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { useTranslation } from "react-i18next"

function PrescriptionDraftLineItem({
  medicineName,
  packaging,
  uses,
  quantity,
  index = 0,
  itemId,
  onRemove,
  onEditItem,
  variant = "card",
}) {
  const { t } = useTranslation(["prescription-detail", "common", "modal"])
  const [isEditing, setIsEditing] = useState(false)
  const [editUses, setEditUses] = useState(uses ?? "")
  const [editQuantity, setEditQuantity] = useState(String(quantity ?? ""))
  const fullLabel = packaging ? `${medicineName} (${packaging})` : medicineName

  const handleStartEdit = () => {
    setEditUses(uses ?? "")
    setEditQuantity(String(quantity ?? ""))
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (onEditItem && itemId != null) {
      onEditItem(itemId, { uses: editUses, quantity: parseInt(editQuantity, 10) || 0 })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditUses(uses ?? "")
    setEditQuantity(String(quantity ?? ""))
    setIsEditing(false)
  }

  const numberNode = (
    <Avatar
      sx={{
        width: 28,
        height: 28,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontSize: "0.875rem",
        fontWeight: 600,
      }}
    >
      {index + 1}
    </Avatar>
  )

  const nameNode = (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Tooltip title={fullLabel} placement="top" enterDelay={300}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {medicineName}
        </Typography>
      </Tooltip>
      {packaging && (
        <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mt: 0.25 }}>
          {packaging}
        </Typography>
      )}
    </Box>
  )

  const actionsNode = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {onEditItem != null && itemId != null && !isEditing && (
        <Tooltip title={t("common:edit")} followCursor>
          <IconButton size="small" color="primary" onClick={handleStartEdit} aria-label={t("common:edit")}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onRemove != null && itemId != null && (
        <Tooltip title={t("common:delete")} followCursor>
          <IconButton size="small" color="error" onClick={() => onRemove(itemId)} aria-label={t("common:delete")}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )

  if (variant === "table") {
    return (
      <TableRow hover sx={{ "& > td": { verticalAlign: "middle", py: 1.5 } }}>
        <TableCell padding="none" sx={{ width: 32, textAlign: "center" }}>
          {numberNode}
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 220 }}>{nameNode}</TableCell>
        <TableCell sx={{ width: 72, textAlign: "center" }}>
          <Typography variant="body2">{uses}</Typography>
        </TableCell>
        <TableCell sx={{ width: 64, textAlign: "center" }}>
          <Typography variant="body2">{quantity}</Typography>
        </TableCell>
        <TableCell padding="none" sx={{ width: 80 }}>{actionsNode}</TableCell>
      </TableRow>
    )
  }

  if (variant === "card") {
    return (
      <Box
        sx={{
          p: 1.5,
          mb: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ pt: 0.25 }}>{numberNode}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {nameNode}
            {isEditing ? (
              <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField
                  size="small"
                  label={t("prescription-detail:uses")}
                  value={editUses}
                  onChange={(e) => setEditUses(e.target.value)}
                  fullWidth
                />
                <TextField
                  size="small"
                  type="number"
                  label={t("prescription-detail:quantity")}
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  inputProps={{ min: 1 }}
                  fullWidth
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={handleSaveEdit} aria-label={t("common:update")}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCancelEdit} aria-label={t("modal:cancel")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary">
                  {t("prescription-detail:uses")}: {uses || "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("prescription-detail:quantity")}: {quantity}
                </Typography>
                {actionsNode}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  return null
}

export default React.memo(PrescriptionDraftLineItem)
