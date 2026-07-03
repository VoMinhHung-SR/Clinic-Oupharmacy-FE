import {
  Badge,
  Box,
  Button,
  Collapse,
  Pagination,
  Paper,
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
import FilterListIcon from "@mui/icons-material/FilterList"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import DiagnosisFilter from "../../../modules/common/components/FIlterBar/DiagnosisFilter"
import DiagnosedCard from "../../../modules/common/components/card/DiagnosedCard"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import {
  DASHBOARD_FILTER_BUTTON_SX,
  DASHBOARD_LIST_HEADER_SX,
  DASHBOARD_PAGINATION_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

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

  return (
    <Box sx={{ width: "100%", mx: "auto" }}>
      <Paper
        elevation={DASHBOARD_SURFACE.elevation}
        sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, overflow: "hidden" }}
      >
        <Box sx={DASHBOARD_LIST_HEADER_SX}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <LocalHospitalIcon color="primary" />
            <Typography variant="h6" component="h1" fontWeight={600}>
              {t("prescription:listOfDiagnosisForms")}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={
              <Badge badgeContent={pagination.count} color="primary" max={999}>
                <FilterListIcon />
              </Badge>
            }
            endIcon={
              <ExpandMoreIcon
                sx={{ transform: showFilter ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}
              />
            }
            onClick={() => setShowFilter((prev) => !prev)}
            sx={DASHBOARD_FILTER_BUTTON_SX}
          >
            {t("prescription:filter")}
          </Button>
        </Box>

        <Collapse in={showFilter}>
          <Box sx={{ p: 2, bgcolor: "action.hover" }}>
            <MemoizedDiagnosisFilter
              onSubmit={handleOnSubmitFilter}
              doctorName={paramsFilter.doctorName}
              createdDate={paramsFilter.createdDate}
              patientName={paramsFilter.patientName}
              hasPrescription={paramsFilter.hasPrescription}
              hasPayment={paramsFilter.hasPayment}
            />
          </Box>
        </Collapse>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size={isMobile ? "small" : "medium"} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className="ou-hidden md:ou-table-cell">{t("prescription:prescriptionId")}</TableCell>
                <TableCell className="ou-hidden md:ou-table-cell">{t("prescription:EID")}</TableCell>
                <TableCell align="center">{t("prescription:sign")}</TableCell>
                <TableCell align="center">{t("prescription:diagnosed")}</TableCell>
                <TableCell align="center">{t("prescription:diagnosisDate")}</TableCell>
                <TableCell align="center">{t("prescription:prescribingStatus")}</TableCell>
                <TableCell align="center">{t("prescription:paymentStatus")}</TableCell>
                <TableCell align="center">{t("prescription:patientName")}</TableCell>
                <TableCell className="ou-hidden md:ou-table-cell" align="center">
                  {t("prescription:doctorName")}
                </TableCell>
                <TableCell align="center">{t("prescription:feature")}</TableCell>
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
      </Paper>

      {pagination.sizeNumber >= 2 ? (
        <Box sx={DASHBOARD_PAGINATION_SX}>
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
        </Box>
      ) : null}
    </Box>
  )
}
