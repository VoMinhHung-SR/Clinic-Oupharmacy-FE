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
  DASHBOARD_TABLE_MOBILE_BODY_SX,
  DASHBOARD_TABLE_SX,
} from "../../../modules/common/layout/dashboard/styleTokens"
import DashboardPageShell from "../../../modules/common/layout/dashboard/shell/DashboardPageShell"
import DashboardFilterButton from "../../../modules/common/layout/dashboard/components/DashboardFilterButton"
import DashboardEmptyState from "../../../modules/common/layout/dashboard/components/DashboardEmptyState"
import DashboardTableHeadCell from "../../../modules/common/layout/dashboard/components/DashboardTableHeadCell"

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
          size="small"
          stickyHeader
          sx={{
            ...DASHBOARD_TABLE_SX,
            ...(isMobile ? DASHBOARD_TABLE_MOBILE_BODY_SX : {}),
          }}
        >
          <TableHead>
            <TableRow>
              <DashboardTableHeadCell className="ou-hidden md:ou-table-cell">
                {t("prescription:prescriptionId")}
              </DashboardTableHeadCell>
              <DashboardTableHeadCell className="ou-hidden md:ou-table-cell">
                {t("prescription:EID")}
              </DashboardTableHeadCell>
              <DashboardTableHeadCell>{t("prescription:sign")}</DashboardTableHeadCell>
              <DashboardTableHeadCell>{t("prescription:diagnosed")}</DashboardTableHeadCell>
              <DashboardTableHeadCell align="center">{t("prescription:diagnosisDate")}</DashboardTableHeadCell>
              <DashboardTableHeadCell align="center">{t("prescription:prescribingStatus")}</DashboardTableHeadCell>
              <DashboardTableHeadCell align="center">{t("prescription:paymentStatus")}</DashboardTableHeadCell>
              <DashboardTableHeadCell>{t("prescription:patientName")}</DashboardTableHeadCell>
              <DashboardTableHeadCell className="ou-hidden md:ou-table-cell">
                {t("prescription:doctorName")}
              </DashboardTableHeadCell>
              <DashboardTableHeadCell align="center">{t("prescription:feature")}</DashboardTableHeadCell>
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
                <TableCell colSpan={12} sx={{ border: 0 }}>
                  <DashboardEmptyState message={t("prescription:errNullPrescription")} />
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
