import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import Loading from "../../../../../modules/common/components/Loading"
import usePayment from "../../../../../modules/pages/PaymentComponents/hooks/usePayment"
import BillCard from "../../../../../modules/common/components/card/BillCard"
import PatientInfoModal from "../../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import { useNavigate } from "react-router-dom"
const Payments = () => {
    const {
        isLoadingPrescriptionDetail, 
        examinationDetail,
        diagnosisInfo,
        getPrescribingByDiagnosisId
    } = usePayment()
    
    const {t, ready} = useTranslation(['payment','common', 'modal'])
    const router = useNavigate()    
    if(!ready)
        return <Box sx={{ height: "300px" }}>
            <Helmet>
                <title>Payments</title>
            </Helmet>
            <Box className='ou-p-5'>
                <Loading/>
            </Box>
        </Box>

    const renderExaminationDetail = () => {
        if(!examinationDetail || examinationDetail === null)
            return null;

        return (
            <Box className='ou-m-auto ou-max-w-[1536px] ou-min-h-[550px] 
            ou-flex ou-flex-col ou-justify-center ou-w-[100%]'>
                <Box className="!ou-mb-3">        
                    <Box>
                        {examinationDetail.id && (
                            <Box>
                                <Box className='ou-pb-8 ou-m-auto'> 
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
                            </Box>
                        )}

                        {/* Render BillCards for each diagnosis */}
                        {diagnosisInfo && diagnosisInfo.length > 0 ? (
                            diagnosisInfo.map(diagnosis => {
                                const prescribingData = getPrescribingByDiagnosisId(diagnosis.id);
                                return prescribingData && prescribingData.length > 0 ? (
                                    <Box key={diagnosis.id} className="ou-mb-4">
                                        {prescribingData.map(prescribing => (
                                            <BillCard 
                                                key={prescribing.id}
                                                slotID={examinationDetail.schedule_appointment.id}
                                                date={examinationDetail.schedule_appointment.day}
                                                id={prescribing.id}
                                                wage={examinationDetail.wage}
                                                diagnosisId={diagnosis.id}
                                                bill_status={prescribing.bill_status}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box component={Paper} elevation={6} key={diagnosis.id} className="ou-py-10">
                                        <Box>
                                            <Box className='ou-text-center  ou-flex ou-flex-col ou-items-center'>
                                                <h3 className='ou-text-xl ou-text-red-600'>
                                                    {t('payment:errNullPrescriptionDetail', {diagnosisID: diagnosis.id})}
                                                </h3>
                                                <Typography className='text-center'>
                                                    <h3>{t('common:backToHomepage')} </h3>
                                                    <Button onClick={() => { router('/dashboard') }}>{t('common:here')}!</Button>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })
                        ) : (
                            <Box component={Paper} elevation={6} className="ou-py-10">
                                <Box className='ou-text-center  ou-flex ou-flex-col ou-items-center'>
                                    <h2 className='ou-text-xl ou-text-red-600'>
                                        {t('payment:errNullPrescription')}
                                    </h2>
                                    <Typography className='text-center'>
                                        <h3>{t('common:backToHomepage')} </h3>
                                        <Button onClick={() => { router('/dashboard') }}>{t('common:here')}!</Button>
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <>
            <Helmet>
                <title>Payments</title>
            </Helmet>

            {isLoadingPrescriptionDetail ? (
                <Box sx={{ height: "300px" }}>
                    <Box className="p-5" >
                        <Loading />
                    </Box>
                </Box>
            ) : (
                renderExaminationDetail()
            )}
        </>
    )
}

export default Payments