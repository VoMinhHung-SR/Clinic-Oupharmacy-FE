import { Button, Chip } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FilterListIcon from "@mui/icons-material/FilterList"
import { DASHBOARD_FILTER_BUTTON_SX } from "../styleTokens"

/**
 * Filter toggle with count badge beside label (not overlapping the icon).
 */
export default function DashboardFilterButton({
  label,
  count,
  showFilter = false,
  onToggle,
  max = 999,
}) {
  const displayCount = count != null && count > 0 ? (count > max ? `${max}+` : count) : null

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<FilterListIcon />}
      endIcon={
        <ExpandMoreIcon
          sx={{
            transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      }
      onClick={onToggle}
      sx={DASHBOARD_FILTER_BUTTON_SX}
    >
      {label}
      {displayCount != null && (
        <Chip
          label={displayCount}
          size="small"
          color="primary"
          sx={{ ml: 1, height: 22, fontSize: "0.75rem", fontWeight: 600 }}
        />
      )}
    </Button>
  )
}
