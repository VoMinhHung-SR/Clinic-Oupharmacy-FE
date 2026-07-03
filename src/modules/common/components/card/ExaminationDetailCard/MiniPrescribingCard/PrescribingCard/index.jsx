import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  DASHBOARD_PAPER_SX,
  DASHBOARD_SURFACE,
  DASHBOARD_TABLE_HEAD_CELL_SX,
} from "../../../../../layout/dashboard/styleTokens"
import { fetchPrescriptionDetailBillCard } from "../../../BillCard/services"
import {
  getPrescriptionLineDisplayName,
  resolvePrescriptionDetailUnitPrice,
} from "../../../../../../../lib/adapters/storeProduct"
import SkePrescriptionDetailCard from "../../../../skeletons/card/SkePrescriptionDetailCard"
import {
  EXAM_DETAIL_EMBEDDED_HEADER_SX,
  EXAM_DETAIL_EMBEDDED_PANEL_SX,
} from "../../detailLayoutTokens"

const PrescribingCard = ({ prescribing, embedded = false }) => {
  const { t, ready } = useTranslation(["payment"])
  const [isLoading, setIsLoading] = useState(true)
  const [prescriptionDetail, setPrescriptionDetail] = useState([])
  const prescribingID = prescribing

  useEffect(() => {
    if (!prescribingID) return
    const loadData = async () => {
      setIsLoading(true)
      try {
        const { data } = await fetchPrescriptionDetailBillCard(prescribingID)
        setPrescriptionDetail(data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }

    loadData()
  }, [prescribingID])

  if (isLoading || !prescribingID || !ready)
    return <SkePrescriptionDetailCard key={`mini-load-prescribing-${prescribingID}`} />

  const prescriptionId = prescriptionDetail[0]?.prescribing?.id
  const isPaid = prescriptionDetail[0]?.prescribing?.bill_status

  const tableContent = (
    <TableContainer sx={embedded ? { maxHeight: 280 } : undefined}>
      <Table sx={{ minWidth: embedded ? 480 : 650 }} aria-label="prescription lines" size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={embedded ? 2 : 3} align="left" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
              {t("medicineName")}
            </TableCell>
            <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
              {t("uses")}
            </TableCell>
            <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
              {t("quantity")}
            </TableCell>
            {!embedded && (
              <>
                <TableCell colSpan={2} align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("unitPrice")}
                </TableCell>
                <TableCell colSpan={2} align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("total")} (VND)
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {prescriptionDetail.map((p, index) => {
            const unitPrice = resolvePrescriptionDetailUnitPrice(p)
            return (
              <TableRow
                key={p.medicine_unit?.id ?? p.id ?? index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={embedded ? 2 : 3} align="left">
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {index + 1}. {getPrescriptionLineDisplayName(p)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{p.uses}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{p.quantity}</Typography>
                </TableCell>
                {!embedded && (
                  <>
                    <TableCell colSpan={2} align="center">
                      <Typography variant="body2">{unitPrice}</Typography>
                    </TableCell>
                    <TableCell colSpan={2} align="center">
                      <Typography variant="body2">{unitPrice * p.quantity}</Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

  if (embedded) {
    return (
      <Box sx={EXAM_DETAIL_EMBEDDED_PANEL_SX}>
        <Box sx={EXAM_DETAIL_EMBEDDED_HEADER_SX}>
          <Typography variant="body2" fontWeight={600} color="primary.dark">
            {t("prescriptionDetail", { id: prescriptionId })}
          </Typography>
          <Chip
            label={isPaid ? t("paid") : t("unpaid")}
            color={isPaid ? "success" : "error"}
            variant="filled"
            size="small"
          />
        </Box>
        {tableContent}
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Paper
        elevation={DASHBOARD_SURFACE.elevation}
        sx={{
          ...DASHBOARD_PAPER_SX,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            py: 2,
            px: 3,
            bgcolor: "#f8faff",
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
            {t("prescriptionDetail", { id: prescriptionId })}
          </Typography>
          <Box sx={{ position: "absolute", top: 12, right: 12 }}>
            <Chip
              label={isPaid ? t("paid") : t("unpaid")}
              color={isPaid ? "success" : "error"}
              variant="filled"
              size="small"
            />
          </Box>
        </Box>
        {tableContent}
      </Paper>
    </Box>
  )
}

export default PrescribingCard
