import { Children } from "react"
import { Stack, Typography } from "@mui/material"

const ACTION_SLOT_WIDTH = 40

/**
 * Fixed-width actions cell — keeps column alignment when some rows have fewer buttons.
 */
export default function DashboardRowActions({ children, slots = 2 }) {
  const items = Children.toArray(children).filter(Boolean)
  const minWidth = slots * ACTION_SLOT_WIDTH + (slots - 1) * 6 + 16

  return (
    <Stack
      direction="row"
      spacing={0.75}
      justifyContent="center"
      alignItems="center"
      sx={{ minWidth, minHeight: 40, mx: "auto" }}
    >
      {items.length > 0 ? (
        items
      ) : (
        <Typography variant="body2" color="text.disabled" component="span" aria-hidden>
          —
        </Typography>
      )}
    </Stack>
  )
}
