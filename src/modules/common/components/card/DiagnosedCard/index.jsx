import { Button, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { canPrescribe, canViewPayments, isBillPaid } from "../../../../../lib/auth";
import { Link, useNavigate } from "react-router-dom";
import PaidIcon from "@mui/icons-material/Paid";
import { useTranslation } from "react-i18next";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { ErrorAlert } from "../../../../../config/sweetAlert2";
import CancelIcon from "@mui/icons-material/Cancel";
import DashboardRowActions from "../../../layout/dashboard/components/DashboardRowActions";
import { DASHBOARD_ACTIONS_CELL_SX } from "../../../layout/dashboard/styleTokens";

const actionButtonSx = {
  minWidth: 40,
  minHeight: 40,
  p: 1,
};

const DiagnosedCard = ({ diagnosedInfo, user }) => {

    const {t} = useTranslation(['prescription', 'common', 'modal'])
    const router = useNavigate()
    const renderBillStatus = (prescribingArray) => {
        let doneStatus = 0
        if(prescribingArray.length === 0)
            return <span><CancelIcon className="!ou-text-red-700"/></span> 


        if (prescribingArray.some(prescribing => prescribing && !isBillPaid(prescribing.bill_status))) {
            doneStatus = -1;
        }

        if(doneStatus === -1 ) 
            return <span><CancelIcon className="!ou-text-red-700"/></span> 
        return  <span><CheckCircleIcon className="!ou-text-green-700"/></span> 
    }

    const handleOnClick = (id) => {
      if (!canPrescribe(user, diagnosedInfo))
        return ErrorAlert(t('modal:errPrescribingNotOwner'), t('modal:pleaseTryAgain'), t('modal:ok'));
      router(`/dashboard/prescribing/${id}`);
    };

    const prescribeAction =
      user && canPrescribe(user, diagnosedInfo) ? (
        <Tooltip followCursor title={t("prescribing")}>
          <span>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleOnClick(diagnosedInfo.id)}
              sx={actionButtonSx}
            >
              <MedicalServicesIcon />
            </Button>
          </span>
        </Tooltip>
      ) : null;

    const paymentAction =
      user && canViewPayments(user) ? (
        <Tooltip followCursor title={t("pay")}>
          <span>
            <Link
              style={{ textDecoration: "none" }}
              to={`/dashboard/prescribing/${diagnosedInfo.id}/payments`}
            >
              <Button variant="contained" color="success" sx={actionButtonSx}>
                <PaidIcon />
              </Button>
            </Link>
          </span>
        </Tooltip>
      ) : null;

  return (
    <TableRow key={diagnosedInfo.id} 
    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Typography>{diagnosedInfo.id}</Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography>{diagnosedInfo.examination.id}</Typography>
      </TableCell>
      <TableCell>
        <Typography className="ou-table-truncate-text-container">
          {diagnosedInfo.sign}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography className="ou-table-truncate-text-container">
          {diagnosedInfo.diagnosed}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography>{moment(diagnosedInfo.created_date).format("DD/MM/YYYY")}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography>
          {diagnosedInfo.prescribing_info?.length ? (
            <span>
              <CheckCircleIcon className="!ou-text-green-700" />
            </span>
          ) : (
            <span>
              <CancelIcon className="!ou-text-red-700" />
            </span>
          )}
        </Typography> 
      </TableCell>
      <TableCell align="center">
        <Typography>{renderBillStatus(diagnosedInfo.prescribing_info)}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography>
          {diagnosedInfo.patient.first_name} {diagnosedInfo.patient.last_name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography>
          {diagnosedInfo.user.first_name} {diagnosedInfo.user.last_name}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={DASHBOARD_ACTIONS_CELL_SX}>
        <DashboardRowActions slots={2}>
          {prescribeAction}
          {paymentAction}
        </DashboardRowActions>
      </TableCell>
    </TableRow>
  );
};

export default DiagnosedCard;
