import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import usePayment from "../../../../../modules/pages/PaymentComponents/hooks/usePayment"
import BillCard from "../../../../../modules/common/components/card/BillCard"
import PatientInfoModal from "../../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import { useNavigate } from "react-router-dom"
import SkeletonBasicInformationCard from "../../../../../modules/common/components/skeletons/card/BasicInformationCard"
import SkeletonBillCard from "../../../../../modules/common/components/skeletons/card/BillCard"

const Payments = () => {
    const {
        isLoadingExamination, 
        examinationDetail,
        diagnosisInfo,
        getPrescribingByDiagnosisId,
        isPrescribingLoading
    } = usePayment()
    
    const {t, ready} = useTranslation(['payment','common', 'modal'])
    const router = useNavigate()    

    // --- Skeleton Render Functions --- 
    const renderInitialPageSkeleton = () => (
        <Box>
            <Helmet><title>Payments</title></Helmet>
            <Box className="ou-container ou-mx-auto ou-min-h-[550px]">
                <Box className="ou-mb-8" >
                    <SkeletonBasicInformationCard />
                </Box>
                <Box component={Paper} elevation={6} className="ou-p-5 ou-mb-4">
                    <SkeletonBillCard count={4} height="200px" /> 
                </Box>
            </Box>
        </Box>
    );

    const renderPrescriptionSkeleton = (key) => (
        <Box component={Paper} key={key} elevation={6} className="ou-p-5 ou-mb-4">
            <SkeletonBillCard count={4} height="200px" /> 
        </Box>
    );
    
    const renderErrorBox = (key, titleKey, messageKey, messageParams = {}) => (
        <Box component={Paper} elevation={6} key={key} className="ou-py-10 ou-mb-4">
            <Box className='ou-text-center ou-flex ou-flex-col ou-items-center'>
                <h3 className='ou-text-xl ou-text-red-600'>
                    {t(titleKey, messageParams)}
                </h3>
                <Typography className='text-center'>
                    <h3>{t('common:backToHomepage')} </h3>
                    <Button onClick={() => router('/dashboard')}>{t('common:here')}!</Button>
                </Typography>
            </Box>
        </Box>
    );

    // --- Main Render Logic --- 
    if (!ready || isLoadingExamination) {
        return renderInitialPageSkeleton();
    }

    if (!examinationDetail) {
        return renderErrorBox("examination-error", 'payment:errLoadExaminationDetailFailed', 'common:backToHomepage');
    }

    const renderDiagnosisSection = () => {
        if (!diagnosisInfo || diagnosisInfo.length === 0) {
             return renderErrorBox("no-diagnosis-error", 'payment:errNullPrescription', 'common:backToHomepage');
        }

        return diagnosisInfo.map(diagnosis => {
            const isLoadingPrescriptions = isPrescribingLoading(diagnosis.id);
            const prescribingData = getPrescribingByDiagnosisId(diagnosis.id);

            if (isLoadingPrescriptions) {
                return renderPrescriptionSkeleton(`skeleton-${diagnosis.id}`);
            }

            if (!prescribingData || prescribingData.length === 0) {
                return renderErrorBox(
                    `error-${diagnosis.id}`, 
                    'payment:errNullPrescriptionDetail', 
                    'common:backToHomepage', 
                    { diagnosisID: diagnosis.id }
                );
            }
            return (
                <Box key={`diagnosis-section-${diagnosis.id}`} className="ou-mb-4">
                    {prescribingData.map((prescribing, index) => (
                        <Box key={prescribing.id} className={`${prescribingData.length === index + 1 ? 'ou-mb-0' : 'ou-mb-4'}`}>    
                            <BillCard 
                                slotID={examinationDetail.schedule_appointment.id}
                                date={examinationDetail.schedule_appointment.day}
                                id={prescribing.id} 
                                wage={examinationDetail.wage}
                                diagnosisId={diagnosis.id} 
                                bill_status={prescribing.bill_status} 
                            />
                        </Box>
                    ))}
                </Box>
            );
        });
    };

    return (
        <>
            <Helmet><title>{t('common:payments')}</title></Helmet>
            <Box className='ou-container ou-mx-auto ou-m-auto ou-max-w-[1536px] ou-min-h-[550px]'>
                {/* --- Basic Information Section --- */} 
                <Box className='ou-mb-8'> 
                    <Grid container justifyContent="center" className="ou-min-h-[160px] ou-p-5" component={Paper} elevation={5}> 
                        <Grid item xs={12} className="ou-pb-5" >
                            <h1 className="ou-text-center ou-text-2xl">{t('common:basicInformation')}</h1>
                        </Grid>
                        <Grid item xs={12} sm={6} className="ou-text-center ou-mb-4 sm:ou-mb-0" >
                            <PatientInfoModal patientData={examinationDetail.patient}/>
                        </Grid>
                        <Grid item xs={12} sm={6} className="ou-text-center">
                            <MedicalRecordsModal patientID={examinationDetail.patient.id}/>
                        </Grid>
                    </Grid>
                </Box>
                
                {/* --- Diagnosis & Prescriptions Section --- */} 
                {renderDiagnosisSection()}
            </Box>
        </>
    )
}

export default Payments;