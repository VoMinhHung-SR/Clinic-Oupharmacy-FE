import { Box, Button, Alert, Typography, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import useAppointment from "../../../../firebase/hooks/useAppointment";
import { WAITING_STATUS_PROCESSING, WAITING_STATUS_UNDONE } from "../../../../lib/constants";

const AppointmentStatusBanner = ({ scheduleAppointment, hasDiagnosis }) => {
  const { t } = useTranslation(["diagnosis"]);
  const timeSlotId = scheduleAppointment?.id ?? null;
  const date = scheduleAppointment?.day;

  const {
    appointmentData,
    loading: appointmentLoading,
    updateAppointmentStatus,
  } = useAppointment(date, timeSlotId);

  if (appointmentLoading || !appointmentData?.timeSlot) return null;

  const { status } = appointmentData.timeSlot;
  const isUndone = status === WAITING_STATUS_UNDONE;
  const isProcessing = status === WAITING_STATUS_PROCESSING;

  return (
    <Box className="ou-mb-4">
      {isUndone && (
        <Alert
          severity="warning"
          className="ou-mb-4"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => updateAppointmentStatus(WAITING_STATUS_PROCESSING)}
            >
              {t("diagnosis:markProcessing")}
            </Button>
          }
        >
          <div className="ou-flex ou-items-center">
            <Chip
              label={t("diagnosis:waitingForProcessing")}
              color="warning"
              size="small"
              className="ou-mr-2"
            />
            <Typography variant="body2">
              {t("diagnosis:appointmentNotStarted")}
            </Typography>
          </div>
        </Alert>
      )}

      {isUndone && (
        <Box className="ou-mt-4 ou-text-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateAppointmentStatus(WAITING_STATUS_PROCESSING)}
          >
            {t("diagnosis:markProcessing")}
          </Button>
        </Box>
      )}

      {isProcessing && !hasDiagnosis && (
        <Box className="ou-mt-4 ou-text-center">
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
                backgroundColor: "rgba(211, 47, 47, 0.04)",
              },
            }}
            onClick={() => updateAppointmentStatus(WAITING_STATUS_UNDONE)}
          >
            {t("diagnosis:markAsNotStarted")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentStatusBanner;