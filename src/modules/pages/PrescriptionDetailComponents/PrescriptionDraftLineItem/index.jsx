import React from "react"
import { IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useTranslation } from "react-i18next"

function PrescriptionDraftLineItem({ medicineName, packaging, uses, quantity, index = 0, itemId, onRemove }) {
  const { t } = useTranslation(["prescription-detail", "common"])
  const fullLabel = packaging ? `${medicineName} (${packaging})` : medicineName

  return (
    <TableRow hover sx={{ "& > td": { verticalAlign: "middle", py: 1.5 } }}>
      <TableCell padding="none" sx={{ width: 32, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">{index + 1}</Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 120, maxWidth: 220 }}>
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
      </TableCell>
      <TableCell sx={{ width: 72, textAlign: "center" }}>
        <Typography variant="body2">{uses}</Typography>
      </TableCell>
      <TableCell sx={{ width: 64, textAlign: "center" }}>
        <Typography variant="body2">{quantity}</Typography>
      </TableCell>
      {onRemove != null && itemId != null && (
        <TableCell padding="none" sx={{ width: 48 }}>
          <IconButton size="small" color="error" onClick={() => onRemove(itemId)} aria-label={t("common:delete")} title={t("common:delete")}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  )
}

export default React.memo(PrescriptionDraftLineItem)
