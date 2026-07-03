import { TableCell } from "@mui/material"
import { DASHBOARD_TABLE_HEAD_CELL_SX } from "../styleTokens"

/** Dashboard table header cell — fixed height + style contract. */
export default function DashboardTableHeadCell({ align, children, className, ...props }) {
  return (
    <TableCell align={align} className={className} sx={DASHBOARD_TABLE_HEAD_CELL_SX} {...props}>
      {children}
    </TableCell>
  )
}
