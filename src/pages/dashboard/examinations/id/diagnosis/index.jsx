import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Helmet } from "react-helmet"
import Loading from "../../../../../modules/common/components/Loading"
import DiagnosisForm from "../../../../../modules/pages/DiagnosisComponents/DiagnosisForm"
import PatientInfoModal from "../../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import useDiagnosis from "../../../../../modules/pages/DiagnosisComponents/hooks/useDiagnosis"

const Diagnosis = () => {
    const { examinationDetail, isLoadingExamination, diagnosis,
        prescriptionId, examinationId, user, handleChangeFlag } = useDiagnosis()
    const router = useNavigate()
    const {t , ready} = useTranslation(['diagnosis','common'])

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
                <title>Diagnosis</title>
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

                    )
            }

        </>
    )
}
export default Diagnosis