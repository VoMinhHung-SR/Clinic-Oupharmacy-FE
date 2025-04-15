import { Box, Button, Container, Grid, Paper, Typography, Alert, Chip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import Loading from "../../../../../modules/common/components/Loading"
import DiagnosisForm from "../../../../../modules/pages/DiagnosisComponents/DiagnosisForm"
import PatientInfoModal from "../../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import useDiagnosis from "../../../../../modules/pages/DiagnosisComponents/hooks/useDiagnosis"
import useAppointment from "../../../../../firebase/hooks/useAppointment"
import { WAITING_STATUS_PROCESSING, WAITING_STATUS_UNDONE } from "../../../../../lib/constants"

const Diagnosis = () => {
    const { examinationDetail, isLoadingExamination, diagnosis,
        prescriptionId, examinationId, user, handleChangeFlag } = useDiagnosis()
    const router = useNavigate()
    const {t , ready} = useTranslation(['diagnosis','common'])

    // Construct timeSlotId from examinationDetail
    const timeSlotId = examinationDetail?.schedule_appointment 
        ? `${examinationDetail.schedule_appointment.day}_${examinationDetail.schedule_appointment.id}`
        : null;

    const { appointmentData, loading: appointmentLoading, error: appointmentError, updateAppointmentStatus } = useAppointment(timeSlotId);

    if (!ready)
        return <Box sx={{ height: "300px" }}>
        <Box className='ou-p-5'>
            <Loading></Loading>
        </Box>
        <Helmet>
            <title>Diagnosis</title>
        </Helmet>
    </Box>

    return (
        <>
           <Helmet>
                <title>{t('diagnosis:title')}</title>
            </Helmet>
            {isLoadingExamination && !examinationDetail && examinationDetail.length === 0 ?
                (<Box sx={{ height: "300px" }}>
                    <Box className='ou-p-5'>
                        <Loading></Loading>
                    </Box>
                </Box>)
                : examinationDetail && examinationDetail.length === 0 ?
                    (
                    <Box className="ou-relative ou-items-center " sx={{ minHeight: "550px" }}>
                        <Box className='ou-absolute ou-p-5 ou-text-center 
                        ou-flex-col ou-flex ou-justify-center ou-items-center
                        ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center'>
                            <h2 className='ou-text-xl ou-text-red-600'>
                                {t('errNullExamination')}
                            </h2>
                            <Typography className='text-center'>
                                <h3>{t('common:goToBooking')}</h3>
                                <Button onClick={() => { router('/booking') }}>{t('here')}!</Button>
                            </Typography>
                        </Box>
                    </Box>)
                    : (
                        <>
                            {/* Status debug display */}
                            {/* <Box className="ou-mb-4 ou-p-4" component={Paper} elevation={1}>
                                <Typography variant="subtitle2">Debug Status Information</Typography>
                                <pre style={{ overflow: 'auto', maxHeight: '100px' }}>
                                    {JSON.stringify({ 
                                        appointmentLoading,
                                        hasData: Boolean(appointmentData),
                                        status: appointmentData?.timeSlot?.status,
                                        constants: { WAITING_STATUS_UNDONE, WAITING_STATUS_PROCESSING }
                                    }, null, 2)}
                                </pre>
                            </Box> */}
                        
                            <Container>
                                <Box className='ou-py-8 ou-m-auto'> 
                                    <Box style={{ "margin": "auto" }} >
                                        <Grid container justifyContent="flex" className="ou-min-h-[160px] ou-p-5" component={Paper} elevation={5}> 
                                            <Grid item xs={12} className="ou-pb-5" >
                                                <h1 className="ou-text-center ou-text-2xl">{t('common:basicInformation')}</h1>
                                            </Grid>

                                            <Grid item xs={6} className="ou-text-center" >
                                                <PatientInfoModal patientData={examinationDetail.patient}/>
                                            </Grid>

                                            <Grid item xs={6} className="ou-text-center">
                                                <MedicalRecordsModal patientID={examinationDetail.patient.id}/>
                                            </Grid>
                                    
                                        </Grid>
                                    </Box>
                                
                                </Box>

                                {/* Show notification for any status that's not PROCESSING */}
                                {!appointmentLoading && appointmentData && appointmentData.timeSlot 
                                && appointmentData.timeSlot.status === WAITING_STATUS_UNDONE && (
                                    <Box className="ou-mb-4">
                                        <Alert 
                                            severity="warning" 
                                            className="ou-mb-4"
                                            action={
                                                <Button 
                                                    color="inherit" 
                                                    size="small"
                                                    onClick={() => updateAppointmentStatus(WAITING_STATUS_PROCESSING)}
                                                >
                                                    {t('diagnosis:markProcessing')}
                                                </Button>
                                            }
                                        >
                                            <div className="ou-flex ou-items-center">
                                                <Chip 
                                                    label={t('diagnosis:waitingForProcessing')} 
                                                    color="warning" 
                                                    size="small" 
                                                    className="ou-mr-2"
                                                />
                                                <Typography variant="body2">
                                                    {t('diagnosis:appointmentNotStarted')}
                                                </Typography>
                                            </div>
                                        </Alert>
                                    </Box>
                                )}

                                <Box>
                                    <Box style={{ "margin": "auto" }}>
                                        {user && <DiagnosisForm
                                            id={prescriptionId}
                                            examinationId={examinationId}
                                            diagnosed={diagnosis.diagnosed}
                                            sign={diagnosis.sign}
                                            userID={user.id}
                                            patientID={examinationDetail.patient.id}
                                            handleChangeFlag={handleChangeFlag}
                                            />
                                        }       
                                    </Box>
                                </Box>
                            </Container>
                            {!appointmentLoading && appointmentData &&
                            appointmentData.timeSlot && appointmentData.timeSlot.status === WAITING_STATUS_UNDONE && (
                                <Box className="ou-mt-4 ou-text-center">
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => updateAppointmentStatus(WAITING_STATUS_PROCESSING)}
                                    >
                                        {t('diagnosis:markProcessing')}
                                    </Button>
                                </Box>
                            )}
                            {!appointmentLoading && appointmentData && !diagnosis &&
                            appointmentData.timeSlot && appointmentData.timeSlot.status === WAITING_STATUS_PROCESSING && (
                                <Box className="ou-mt-4 ou-text-center">
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        sx={{ 
                                            borderWidth: '2px',
                                            '&:hover': {
                                                borderWidth: '2px',
                                                backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                            }
                                        }}
                                        onClick={() => updateAppointmentStatus(WAITING_STATUS_UNDONE)}
                                    >
                                        {t('diagnosis:markAsNotStarted')}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )
            }

        </>
    )
}
export default Diagnosis