import {
  Box,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import DiagnosisFilter from "../../../modules/common/components/FIlterBar/DiagnosisFilter"
import DiagnosedCard from "../../../modules/common/components/card/DiagnosedCard"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import {
  DASHBOARD_TABLE_CONTAINER_SX,
  DASHBOARD_TABLE_HEAD_CELL_SX,
  DASHBOARD_TABLE_SX,
} from "../../../modules/common/layout/dashboard/styleTokens"
import DashboardPageShell from "../../../modules/common/layout/dashboard/shell/DashboardPageShell"
import DashboardFilterButton from "../../../modules/common/layout/dashboard/components/DashboardFilterButton"

const MemoizedDiagnosisFilter = memo(DiagnosisFilter)

export default function PrescribingListShell({
  user,
  prescriptionList,
  isLoadingPrescriptionList,
  pagination,
  page,
  handleChangePage,
  handleOnSubmitFilter,
  paramsFilter,
}) {
  const { t } = useTranslation(["prescription", "common"])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [showFilter, setShowFilter] = useState(false)

  const paginationFooter =
    pagination.sizeNumber >= 2 ? (
      <Stack>
        <Pagination
          count={pagination.sizeNumber}
          variant="outlined"
          sx={{ margin: "0 auto" }}
          page={page}
          onChange={handleChangePage}
          size={isMobile ? "small" : "medium"}
        />
      </Stack>
    ) : null

  return (
    <DashboardPageShell
      actions={
        <DashboardFilterButton
          label={t("prescription:filter")}
          count={pagination.count}
          showFilter={showFilter}
          onToggle={() => setShowFilter((prev) => !prev)}
        />
      }
      showFilter={showFilter}
      filterPanel={
        <MemoizedDiagnosisFilter
          onSubmit={handleOnSubmitFilter}
          doctorName={paramsFilter.doctorName}
          createdDate={paramsFilter.createdDate}
          patientName={paramsFilter.patientName}
          hasPrescription={paramsFilter.hasPrescription}
          hasPayment={paramsFilter.hasPayment}
        />
      }
      footer={paginationFooter}
    >
      <TableContainer className="ou-scrollbar" sx={DASHBOARD_TABLE_CONTAINER_SX}>
        <Table
          size={isMobile ? "small" : "medium"}
          stickyHeader
          sx={{
            ...DASHBOARD_TABLE_SX,
            "& .MuiTableCell-root": {
              padding: isMobile ? "8px" : "12px 16px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell className="ou-hidden md:ou-table-cell" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:prescriptionId")}
              </TableCell>
              <TableCell className="ou-hidden md:ou-table-cell" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:EID")}
              </TableCell>
              <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("prescription:sign")}</TableCell>
              <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("prescription:diagnosed")}</TableCell>
              <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:diagnosisDate")}
              </TableCell>
              <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:prescribingStatus")}
              </TableCell>
              <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:paymentStatus")}
              </TableCell>
              <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("prescription:patientName")}</TableCell>
              <TableCell className="ou-hidden md:ou-table-cell" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:doctorName")}
              </TableCell>
              <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                {t("prescription:feature")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingPrescriptionList ? (
              <TableRow>
                <TableCell colSpan={12}>
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <SkeletonListLineItem count={8} height="40px" className="ou-w-full" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoadingPrescriptionList && prescriptionList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12}>
                  <Typography align="center" color="error" sx={{ py: 6 }}>
                    {t("prescription:errNullPrescription")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoadingPrescriptionList &&
              prescriptionList.map((diagnosisInfo) => (
                <DiagnosedCard
                  key={diagnosisInfo.id ?? diagnosisInfo.examination_id}
                  diagnosedInfo={diagnosisInfo}
                  user={user}
                  isMobile={isMobile}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardPageShell>
  )
}
