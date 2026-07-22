import {
  Button,
  Chip,
  CircularProgress,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PaidIcon from "@mui/icons-material/Paid";
import SendIcon from "@mui/icons-material/Send";
import ErrorIcon from "@mui/icons-material/Error";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { canDiagnose, canViewPayments, canSendConfirmEmail } from "../../../../../lib/auth";
import CustomModal from "../../Modal";
import useCustomModal from "../../../../../lib/hooks/useCustomModal";
import ExaminationDetailCard from "../ExaminationDetailCard";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ErrorAlert } from "../../../../../config/sweetAlert2";
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardRowActions from "../../../layout/dashboard/components/DashboardRowActions";
import { DASHBOARD_ACTIONS_CELL_SX } from "../../../layout/dashboard/styleTokens";

const actionButtonSx = {
  minWidth: 40,
  minHeight: 40,
  p: 1,
};

const VISIT_STATUS_CHIP_COLOR = {
  pending: "warning",
  confirmed: "info",
  in_progress: "secondary",
  completed: "success",
  cancelled: "default",
  no_show: "error",
};

const ExaminationCard = ({examinationData, user, loading, sendEmailConfirm}) => {
  const { t } = useTranslation(["examinations", "common", "modal", "examination-detail"]);

  const {id, description, created_date, mail_status, schedule_appointment, diagnosis_info, status} = examinationData
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
  const router = useNavigate()
  const visitStatus = status || "pending"

  const handleSendEmailConfirm = () => {
    sendEmailConfirm();
  };

  const navigateDoctor = () => {
    if (canDiagnose(user, examinationData))
      return router(`/dashboard/examinations/${examinationData.id}/diagnosis`);
    return ErrorAlert(t('modal:errPrescribingNotOwner'), t('modal:pleaseTryAgain'), t('modal:ok'));
  };

  const navigateNurse = () => {
    if (!canViewPayments(user))
      return ErrorAlert(t('modal:errPrescribingNotOwner'), t('modal:pleaseTryAgain'), t('modal:ok'));
    if (examinationData.diagnosis_info?.length > 0)
      return router(`/dashboard/prescribing/${examinationData.diagnosis_info[0].id}/payments`);
    return ErrorAlert(t('examination-detail:errNullDiagnosis'), t('modal:pleaseTryAgain'), t('modal:ok'));
  };

  const renderPrimaryAction = () => {
    if (mail_status) {
      if (canDiagnose(user, examinationData))
        return (
          <Tooltip followCursor title={t("diagnose")}>
            <span>
              <Button
                onClick={() => navigateDoctor()}
                variant="contained"
                color="success"
                sx={actionButtonSx}
              >
                <MedicalServicesIcon />
              </Button>
            </span>
          </Tooltip>
        );
      if (canViewPayments(user))
        return (
          <Tooltip followCursor title={t("pay")}>
            <span>
              <Button onClick={() => navigateNurse()} variant="contained" color="success" sx={actionButtonSx}>
                <PaidIcon />
              </Button>
            </span>
          </Tooltip>
        );
      return null;
    }
    if (canDiagnose(user, examinationData))
      return (
        <Tooltip followCursor title={t("noReady")}>
          <span>
            <Button size="small" variant="contained" color="error" sx={actionButtonSx}>
              <ErrorIcon />
            </Button>
          </span>
        </Tooltip>
      );
    if (canSendConfirmEmail(user))
      return (
        <Tooltip followCursor title={t("sendEmail")}>
          <Button
            onClick={handleSendEmailConfirm}
            disabled={loading}
            variant="contained"
            color="primary"
            sx={actionButtonSx}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
          </Button>
        </Tooltip>
      );
    return null;
  };

  return (
    <>
      <TableRow
        key={id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          <Typography>{id}</Typography>
        </TableCell>
        <TableCell align="left">
          <Typography className="ou-table-truncate-text-container">
            {description || "—"}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{schedule_appointment.day ? <span>{moment(new Date(schedule_appointment.day)).format("DD/MM/YYYY")}</span>
          : <span>{moment(created_date).format("DD/MM/YYYY")}</span>}</Typography>
        </TableCell>
        <TableCell align="center">
          <Chip
            size="small"
            label={t(`status_${visitStatus}`)}
            color={VISIT_STATUS_CHIP_COLOR[visitStatus] || "default"}
            variant="outlined"
          />
        </TableCell>
        <TableCell align="center">
          <Typography>{mail_status ? <span><CheckCircleIcon className="!ou-text-green-700"/></span>
          : <span><CancelIcon className="!ou-text-red-700"/></span>}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography> {diagnosis_info?.length ? 
            <span><CheckCircleIcon className="!ou-text-green-700"/></span> 
          : <span><CancelIcon className="!ou-text-red-700"/></span>}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{examinationData?.user?.email ? examinationData.user.email : "undefined"}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{examinationData?.schedule_appointment?.first_name + " " + examinationData?.schedule_appointment?.last_name}</Typography>
        </TableCell>
        <TableCell align="center" sx={DASHBOARD_ACTIONS_CELL_SX}>
          <DashboardRowActions slots={2}>
            {user ? renderPrimaryAction() : null}
            <Tooltip followCursor title={t("detail")}>
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  sx={actionButtonSx}
                  size="small"
                  onClick={() => handleOpenModal()}
                >
                  <AssignmentIcon />
                </Button>
              </span>
            </Tooltip>
          </DashboardRowActions>
        </TableCell>
      </TableRow>
      
      <CustomModal
        open={isOpen}
        onClose={handleCloseModal}
        title={t("examination-detail:examinationDetailInfo")}
        content={<ExaminationDetailCard examinationData={examinationData} />}
        actions={
          <Button key="cancel" variant="outlined" color="inherit" onClick={handleCloseModal}>
            {t("modal:cancel")}
          </Button>
        }
      />
    
    </>

  );
};
export default ExaminationCard;
