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
import useExaminationConfirm from "../../../modules/pages/ExaminationListComponents/ExaminationConfirm/hooks/useExaminationConfirm"
import { useTranslation } from "react-i18next"
import ExaminationCard from "../../../modules/common/components/card/ExaminationCard"
import ExaminationFilter from "../../../modules/common/components/FIlterBar/ExaminationFilter"
import { Helmet } from "react-helmet"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import FilterListIcon from "@mui/icons-material/FilterList"
import AssignmentIcon from "@mui/icons-material/Assignment"
import { useState, memo } from "react"
import SkeletonExaminationList from "../../../modules/common/components/skeletons/pages/examinations"
import {
  DASHBOARD_FILTER_BUTTON_SX,
  DASHBOARD_LIST_HEADER_SX,
  DASHBOARD_PAGINATION_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

const MemoizedExaminationFilter = memo(ExaminationFilter)

const Examinations = () => {
  const {
    user,
    pagination,
    handleChangePage,
    examinationList,
    isLoadingExamination,
    page,
    paramsFilter,
    handleChangeFlag,
    handleOnSubmitFilter,
    handleSendEmailConfirm,
    loadingState,
  } = useExaminationConfirm()

  const { t, ready } = useTranslation(["examinations", "common", "modal"])
  const [showFilter, setShowFilter] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (!ready && isLoadingExamination)
    return (
      <Box>
        <Helmet>
          <title>Examinations</title>
        </Helmet>
        <SkeletonExaminationList />
      </Box>
    )

  return (
    <>
      <Helmet>
        <title>{t("common:examinations")}</title>
      </Helmet>
      <Box sx={{ width: "100%", mx: "auto" }}>
        <Paper
          elevation={DASHBOARD_SURFACE.elevation}
          sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, overflow: "hidden" }}
        >
          <Box sx={DASHBOARD_LIST_HEADER_SX}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
              <AssignmentIcon color="primary" />
              <Typography variant="h6" component="h1" fontWeight={600}>
                {t("listOfExaminations")}
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
                  sx={{
                    transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              }
              onClick={() => setShowFilter((prev) => !prev)}
              sx={DASHBOARD_FILTER_BUTTON_SX}
            >
              {t("examinations:filter")}
            </Button>
          </Box>

          <Collapse in={showFilter}>
            <Box sx={{ p: 2, bgcolor: "action.hover" }}>
              <MemoizedExaminationFilter
                onSubmit={handleOnSubmitFilter}
                mailStatus={paramsFilter.mailStatus}
                createdDate={paramsFilter.createdDate}
                kw={paramsFilter.kw}
                hasDiagnosis={paramsFilter.hasDiagnosis}
                isMobile={isMobile}
              />
            </Box>
          </Collapse>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table
              size={isMobile ? "small" : "medium"}
              stickyHeader
              sx={{
                minWidth: isMobile ? 300 : 650,
                "& .MuiTableCell-root": {
                  padding: isMobile ? "8px" : "16px",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  whiteSpace: isMobile ? "nowrap" : "normal",
                  maxWidth: isMobile ? "150px" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
              aria-label="examinations table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>{t("id")}</TableCell>
                  <TableCell align="center">{t("description")}</TableCell>
                  <TableCell align="center">{t("createdDate")}</TableCell>
                  <TableCell align="center">{t("mailStatus")}</TableCell>
                  <TableCell align="center">{t("diagnosisStatus")}</TableCell>
                  <TableCell align="center">{t("userCreated")}</TableCell>
                  <TableCell align="center">{t("doctorName")}</TableCell>
                  <TableCell align="center">{t("function")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingExamination && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <SkeletonListLineItem count={10} height="40px" className="ou-w-full" />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoadingExamination &&
                  examinationList.length > 0 &&
                  examinationList.map((e) => (
                    <ExaminationCard
                      key={`e-${e.id}`}
                      examinationData={e}
                      user={user}
                      callback={handleChangeFlag}
                      loading={loadingState[e.id] || false}
                      sendEmailConfirm={() =>
                        handleSendEmailConfirm(e.user.id, e.id, user.avatar_path)
                      }
                    />
                  ))}

                {!isLoadingExamination && examinationList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography align="center" color="error" sx={{ py: 6 }}>
                        {t("examinations:errExamsNull")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {pagination.sizeNumber >= 2 && (
          <Box
            sx={{
              ...DASHBOARD_PAGINATION_SX,
              "& .MuiPaginationItem-root": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                padding: isMobile ? "4px" : "8px",
              },
            }}
          >
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
        )}
      </Box>
    </>
  )
}

export default Examinations
