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
import PrescriptionDetailCard from "../../../../../modules/common/components/card/PrescriptionDetailCard"

const Payments = () => {
    const {
        isLoadingPrescriptionDetail, 
        prescriptionDetail,
        getPrescribingByDiagnosisId,
        diagnosisInfo
        // isPrescribingLoading,
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
                    <SkeletonBillCard count={4} height="20px" /> 
                </Box>
            </Box>
        </Box>
    );
    
    console.log(diagnosisInfo, "===diagnosisInfo")
    console.log(prescriptionDetail, "===prescriptionDetail")

    const renderPrescriptionSkeleton = (key) => (
        <Box component={Paper} key={key} elevation={6} className="ou-p-5 ou-mb-4">
            <SkeletonBillCard count={4} height="20px" /> 
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
    if (!ready || !diagnosisInfo) {
        return renderInitialPageSkeleton();
    }

    if (!diagnosisInfo) {
        return renderErrorBox("examination-error", 'payment:errLoadExaminationDetailFailed', 'common:backToHomepage');
    }

    const renderDiagnosisSection = () => {
            // if (!prescriptionDetail || prescriptionDetail.length === 0) {
            //     return renderErrorBox("no-diagnosis-error", 'payment:errNullPrescription', 'common:backToHomepage');
            // }

        // return prescriptionDetail.map(prescribing => {
            // const isLoadingPrescriptions = isPrescribingLoading(prescribing.id);
            // const prescribingData = getPrescribingByDiagnosisId(prescribing.id);

            // if (isLoadingPrescriptions) {
            //     return renderPrescriptionSkeleton(`skeleton-${prescribing.id}`);
            // }

            // if (!prescribingData || prescribingData.length === 0) {
            //     return renderErrorBox(
            //         `error-${prescribing.id}`, 
            //         'payment:errNullPrescriptionDetail', 
            //         'common:backToHomepage', 
            //         { prescribingID: prescribing.id }
            //     );
            // }
            return (
                <Box key={`diagnosis-section-${diagnosisInfo.id}`} className="ou-mb-4">
                    <Box>    
                        <PrescriptionDetailCard
                            prescriptionData={{
                                listPrescribingId: diagnosisInfo.prescribing_info?.map(prescribing => prescribing.id),
                                created_date: diagnosisInfo.prescribing_info[0]?.created_date,
                                medicineUnits: prescriptionDetail[0],
                                examination: diagnosisInfo.examination,
                                patient: diagnosisInfo.patient,
                                user: diagnosisInfo.user
                            }}
                        />
                        {/* <BillCard 
                            slotID={examinationDetail.schedule_appointment.id}
                            date={examinationDetail.schedule_appointment.day}
                            id={prescribing.id} 
                            wage={examinationDetail.wage}
                            diagnosisId={diagnosis.id} 
                            bill_status={prescribing.bill_status} 
                        /> */}
                    </Box>
                </Box>
            );
        // });
    };

    return (
        <>
            <Helmet><title>{t('common:payments')}</title></Helmet>
            <Box className='ou-container ou-mx-auto ou-m-auto ou-max-w-[1536px] ou-min-h-[550px]'>
                {/* --- Diagnosis & Prescriptions Section --- */} 
                {renderDiagnosisSection()}
            </Box>
        </>
    )
}

export default Payments;