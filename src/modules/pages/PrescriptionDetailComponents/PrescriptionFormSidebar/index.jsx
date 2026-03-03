import { Button, Grid, Paper, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useTranslation } from "react-i18next"
import PatientInfoModal from "../PatientInfoModal"
import MedicalRecordsModal from "../MedicalRecordsModal"
import EditPrescriptionModal from "../EditPrescriptionModal"
import PrescriptionDraftLineItem from "../PrescriptionDraftLineItem"

const PrescriptionFormSidebar = ({
  patient,
  patientId,
  medicinesSubmit,
  onAddPrescriptionDetail,
  onReset,
  onEdit,
  user,
  prescribingId,
}) => {
  const { t } = useTranslation(["prescription-detail", "common"])

  return (
    <Box className="ou-m-auto ou-max-w-[1536px] ou-w-full">
      <Box className="ou-m-auto ou-mb-6">
        <Grid
          container
          justifyContent="flex"
          className="ou-min-h-[160px] ou-p-5"
          component={Paper}
          elevation={5}
        >
          <Grid item xs={12} className="ou-pb-5">
            <h1 className="ou-text-center ou-text-xl">{t("common:basicInformation")}</h1>
          </Grid>
          <Grid item xs={12} className="ou-pb-5 ou-text-center">
            <PatientInfoModal patientData={patient} />
          </Grid>
          <Grid item xs={12} className="ou-text-center">
            <MedicalRecordsModal patientID={patientId} />
          </Grid>
        </Grid>
      </Box>

      <Grid item component={Paper} elevation={5}>
        <form className="ou-p-5 ou-w-full">
          <h1 className="ou-text-center ou-text-xl ou-pb-8">
            {t("prescription-detail:prescriptionDetail")}
          </h1>
          <Grid container className="ou-py-3">
            {medicinesSubmit.length === 0 ? (
              <Grid item xs={12}>
                <Typography className="ou-text-center">
                  {t("prescription-detail:nullMedicine")}
                </Typography>
              </Grid>
            ) : (
              <>
                <Grid item xs={7} className="!ou-mb-2">
                  {t("prescription-detail:medicineName")}
                </Grid>
                <Grid item xs={3} className="ou-text-center !ou-mb-2">
                  {t("prescription-detail:uses")}
                </Grid>
                <Grid item xs={2} className="ou-text-center !ou-mb-2">
                  {t("prescription-detail:quantity")}
                </Grid>

                {medicinesSubmit.map((item, index) => (
                  <PrescriptionDraftLineItem
                    key={item.id ?? index}
                    medicineName={item.medicineName}
                    uses={item.uses}
                    quantity={item.quantity}
                    index={index}
                  />
                ))}

                <Grid container spacing={2} className="p-3 ou-w-full !ou-mt-5">
                  <Grid item xs={6}>
                    <EditPrescriptionModal
                      medicinesSubmitData={medicinesSubmit}
                      handleOnEdit={onEdit}
                      handleClearAll={onReset}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      className="ou-w-full"
                      variant="outlined"
                      color="error"
                      onClick={onReset}
                    >
                      {t("common:deleteAll")}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      className="ou-w-full"
                      variant="contained"
                      color="success"
                      onClick={() => onAddPrescriptionDetail(user?.id, prescribingId)}
                    >
                      {t("prescription-detail:prescribing")}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Grid>
    </Box>
  )
}

export default PrescriptionFormSidebar
