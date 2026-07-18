import {
  Box,
  Button,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import Loading from "../../../modules/common/components/Loading"
import useExaminationList from "../../../modules/pages/ExaminationListComponents/hooks/useExaminationList"
import moment from "moment"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CustomModal from "../../../modules/common/components/Modal"
import ExaminationUpdate from "../../../modules/pages/ExaminationListComponents/ExaminationUpdate"
import useCustomModal from "../../../lib/hooks/useCustomModal"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import { Link } from "react-router-dom"

const ExaminationList = () => {
  const {
    isLoading,
    examinationList,
    handleDeleteExamination,
    handleChangePage,
    page,
    pagination,
    handleChangeFlag,
  } = useExaminationList()
  const { t, ready } = useTranslation(["examinations", "common"])

  if (!ready) {
    return (
      <Box sx={{ minHeight: 240 }}>
        <Helmet>
          <title>Booking list</title>
        </Helmet>
        <Loading />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("examinations:appointmentList")} - OUpharmacy</title>
      </Helmet>

      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 600, mb: 2, textAlign: { xs: "center", sm: "left" } }}
      >
        {t("examinations:appointmentList")}
      </Typography>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table aria-label="examinations table" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "8%", py: 1.5, fontWeight: 600 }}>{t("id")}</TableCell>
              <TableCell align="center" sx={{ width: "24%", py: 1.5, fontWeight: 600 }}>
                {t("description")}
              </TableCell>
              <TableCell align="center" sx={{ width: "12%", py: 1.5, fontWeight: 600 }}>
                {t("createdDate")}
              </TableCell>
              <TableCell align="center" sx={{ width: "10%", py: 1.5, fontWeight: 600 }}>
                {t("mailStatus")}
              </TableCell>
              <TableCell align="center" sx={{ width: "20%", py: 1.5, fontWeight: 600 }}>
                {t("patientName")}
              </TableCell>
              <TableCell align="center" sx={{ width: "14%", py: 1.5, fontWeight: 600 }}>
                {t("function")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <SkeletonListLineItem count={4} className="ou-w-full" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && examinationList.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      px: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography color="text.secondary">{t("examinations:errExamsNull")}</Typography>
                    <Button component={Link} to="/booking" variant="contained" color="primary">
                      {t("common:goToBooking")}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              examinationList.length > 0 &&
              examinationList.map((e) => (
                <OwnerExaminationUpdate
                  e={e}
                  key={`own-e-${e.id}`}
                  onUpdateSuccess={handleChangeFlag}
                  handleDeleteExamination={() => handleDeleteExamination(e.id)}
                />
              ))}
          </TableBody>
        </Table>
        {pagination.sizeNumber >= 2 && (
          <Box sx={{ pt: 3, pb: 1 }}>
            <Stack>
              <Pagination
                count={pagination.sizeNumber}
                variant="outlined"
                color="primary"
                sx={{ margin: "0 auto" }}
                page={page}
                onChange={handleChangePage}
              />
            </Stack>
          </Box>
        )}
      </TableContainer>
    </>
  )
}

export default ExaminationList

export const OwnerExaminationUpdate = ({ e, handleDeleteExamination, onUpdateSuccess }) => {
  const { t } = useTranslation(["examinations", "common"])
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()

  return (
    <>
      <TableRow key={e.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
          <Typography variant="body2">{e.id}</Typography>
        </TableCell>
        <TableCell
          align="center"
          sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          <Typography variant="body2" noWrap title={e.description}>
            {e.description}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ py: 1.5 }}>
          <Typography variant="body2">
            {e.schedule_appointment?.day
              ? moment(e.schedule_appointment.day).format("DD/MM/YYYY")
              : moment(e.created_date).format("DD/MM/YYYY")}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ py: 1.5 }}>
          {e.mail_status === true ? (
            <CheckCircleIcon className="!ou-text-green-700" sx={{ fontSize: 22 }} />
          ) : (
            <CancelIcon className="!ou-text-red-700" sx={{ fontSize: 22 }} />
          )}
        </TableCell>
        <TableCell
          align="center"
          sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          <Typography
            variant="body2"
            noWrap
            title={e.patient?.first_name + " " + e.patient?.last_name}
          >
            {e.patient?.first_name + " " + e.patient?.last_name}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ py: 1.5 }}>
          <Box className="!ou-flex ou-justify-center ou-items-center ou-gap-1">
            {!e.mail_status && (
              <Tooltip followCursor title={t("common:edit")}>
                <Button
                  variant="contained"
                  className="!ou-min-w-0 !ou-p-1.5"
                  color="primary"
                  size="small"
                  onClick={handleOpenModal}
                >
                  <EditIcon sx={{ fontSize: 22 }} />
                </Button>
              </Tooltip>
            )}
            <Tooltip followCursor title={t("common:delete")}>
              <Button
                className="!ou-min-w-0 !ou-p-1.5"
                variant="contained"
                size="small"
                onClick={() => handleDeleteExamination()}
                color="error"
              >
                <DeleteIcon sx={{ fontSize: 22 }} />
              </Button>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <CustomModal
        className="ou-w-[min(900px,95vw)] ou-text-center"
        open={isOpen}
        onClose={handleCloseModal}
        content={
          <Box>
            <ExaminationUpdate
              examination={e}
              onUpdateSuccess={onUpdateSuccess}
              handleClose={handleCloseModal}
            />
          </Box>
        }
        actions={[
          <Button key="cancel" onClick={handleCloseModal}>
            {t("modal:cancel")}
          </Button>,
        ]}
      />
    </>
  )
}
