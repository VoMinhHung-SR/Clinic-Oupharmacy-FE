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
import useExaminationConfirm from "../../../modules/pages/ExaminationListComponents/ExaminationConfirm/hooks/useExaminationConfirm"
import { useTranslation } from "react-i18next"
import ExaminationCard from "../../../modules/common/components/card/ExaminationCard"
import ExaminationFilter from "../../../modules/common/components/FIlterBar/ExaminationFilter"
import { Helmet } from "react-helmet"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import { memo, useState } from "react"
import SkeletonExaminationList from "../../../modules/common/components/skeletons/pages/examinations"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_TABLE_CONTAINER_SX,
  DASHBOARD_TABLE_HEAD_CELL_SX,
  DASHBOARD_TABLE_SX,
} from "../../../modules/common/layout/dashboard/styleTokens"
import DashboardPageShell from "../../../modules/common/layout/dashboard/shell/DashboardPageShell"
import DashboardFilterButton from "../../../modules/common/layout/dashboard/components/DashboardFilterButton"

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
      <>
        <Helmet>
          <title>Examinations</title>
        </Helmet>
        <Box sx={DASHBOARD_PAGE_FRAME_SX}>
          <SkeletonExaminationList />
        </Box>
      </>
    )

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
    <>
      <Helmet>
        <title>{t("common:examinations")}</title>
      </Helmet>
      <DashboardPageShell
        actions={
          <DashboardFilterButton
            label={t("examinations:filter")}
            count={pagination.count}
            showFilter={showFilter}
            onToggle={() => setShowFilter((prev) => !prev)}
          />
        }
        showFilter={showFilter}
        filterPanel={
          <MemoizedExaminationFilter
            onSubmit={handleOnSubmitFilter}
            mailStatus={paramsFilter.mailStatus}
            createdDate={paramsFilter.createdDate}
            kw={paramsFilter.kw}
            hasDiagnosis={paramsFilter.hasDiagnosis}
            isMobile={isMobile}
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
              minWidth: isMobile ? 300 : 650,
              "& .MuiTableCell-root": {
                padding: isMobile ? "8px" : "12px 16px",
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
                <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("id")}</TableCell>
                <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("description")}</TableCell>
                <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("createdDate")}
                </TableCell>
                <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("mailStatus")}
                </TableCell>
                <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("diagnosisStatus")}
                </TableCell>
                <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("userCreated")}</TableCell>
                <TableCell sx={DASHBOARD_TABLE_HEAD_CELL_SX}>{t("doctorName")}</TableCell>
                <TableCell align="center" sx={DASHBOARD_TABLE_HEAD_CELL_SX}>
                  {t("function")}
                </TableCell>
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
      </DashboardPageShell>
    </>
  )
}

export default Examinations
