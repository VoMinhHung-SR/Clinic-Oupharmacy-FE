import { Button, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ROLE_DOCTOR, ROLE_NURSE } from "../../../../../lib/constants";
import { Link, useNavigate } from "react-router-dom";
import PaidIcon from "@mui/icons-material/Paid";
import { useTranslation } from "react-i18next";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { ErrorAlert } from "../../../../../config/sweetAlert2";

const DiagnosedCard = ({ diagnosedInfo, user }) => {

    const {t, ready} = useTranslation(['prescription', 'common'])
    const router = useNavigate()
    const renderBillStatus = (prescribingArray) => {
        let doneStatus = 0
        if(prescribingArray.length === 0)
            return <span><CheckCircleIcon className="!ou-text-red-700"/></span> 


        if (prescribingArray.some(prescribing => prescribing && prescribing.bill_status === null)) {
            doneStatus = -1;
        }

        if(doneStatus === -1 ) 
            return <span><CheckCircleIcon className="!ou-text-red-700"/></span> 
        return  <span><CheckCircleIcon className="!ou-text-green-700"/></span> 
    }

    const handleOnClick = (id) => {
      if (user.id !== diagnosedInfo.examination.schedule_appointment.doctor_id)
        return ErrorAlert(t('modal:errPrescribingNotOwner'), t('modal:pleaseTryAgain'), t('modal:ok'));
      else router(`/dashboard/prescribing/${id}`)
    }
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
              <CheckCircleIcon className="!ou-text-red-700" />
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
      <TableCell align="center">
        {user && user.role === ROLE_DOCTOR && (
          <>
            <Typography className="mb-2">
                <Tooltip followCursor title={t("prescribing")}>
                  <span>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleOnClick(diagnosedInfo.id)}
                      className="ou-bg-blue-700 !ou-min-w-[68px] !ou-min-h-[40px] !ou-mx-2"
                    >
                      <MedicalServicesIcon />
                    </Button>
                  </span>
                </Tooltip>
            </Typography>
          </>
        )}
        {user && user.role === ROLE_NURSE && (
          <>
            <Tooltip followCursor title={t("pay")}>
              <span>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/dashboard/payments/prescribing/${diagnosedInfo.id}`}
                >
                  <Button
                    variant="contained"
                    color="success"
                    className="!ou-min-w-[68px] !ou-py-2  !ou-min-h-[40px]"
                  >
                    <PaidIcon />
                  </Button>
                </Link>
              </span>
            </Tooltip>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default DiagnosedCard;
