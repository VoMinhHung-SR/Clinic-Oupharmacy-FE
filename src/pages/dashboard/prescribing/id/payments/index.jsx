import { Box, Button, Paper, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import usePayment from "../../../../../modules/pages/PaymentComponents/hooks/usePayment"
import { useNavigate } from "react-router-dom"
import PrescriptionDetailCard from "../../../../../modules/common/components/card/PrescriptionDetailCard"
import SkeletonPayments from "../../../../../modules/common/components/skeletons/pages/payments"

const Payments = () => {
    const {
        isLoadingPrescriptionDetail, 
        prescriptionDetail,
        diagnosisInfo,
        handlePayment,
        isLoadingButton,
    } = usePayment()
    const {t, ready} = useTranslation(['payment','common', 'modal'])
    const router = useNavigate()    

    const groupMedicinesByDate = (prescriptionData) => {
        const result = [];
        Object.keys(prescriptionData).forEach(date => {
            const prescribingIds = Object.keys(prescriptionData[date]);
            
            const firstPrescribingKey = prescribingIds[0];
            const firstPrescribingData = prescriptionData[date][firstPrescribingKey];
            const firstMedicineData = firstPrescribingData[0];
            
            const allMedicinesForDate = [];
            prescribingIds.forEach(prescribingId => {
                const medicines = prescriptionData[date][prescribingId];
                Object.values(medicines).forEach(medicine => {
                    allMedicinesForDate.push(medicine);
                });
            });
            
            result.push({
                date,
                prescribingIds: prescribingIds.map(id => parseInt(id)),
                medicines: allMedicinesForDate,
                baseData: firstMedicineData
            });
        });
        return result;
    };
    
    const renderInitialPageSkeleton = () => (
        <Box>
            <Helmet><title>Payments</title></Helmet>
            <SkeletonPayments />
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

    if (!ready || isLoadingPrescriptionDetail) {
        return renderInitialPageSkeleton();
    }

    const renderDiagnosisSection = () => {
            return (
                <Box key={`diagnosis-section-${diagnosisInfo.id}`} className="ou-mb-4">
                    <Box>    
                        {(!isLoadingPrescriptionDetail && !diagnosisInfo) && renderErrorBox("examination-error", 'payment:errLoadExaminationDetailFailed', 'common:backToHomepage')}
                        
                        {(!isLoadingPrescriptionDetail && prescriptionDetail) && groupMedicinesByDate(prescriptionDetail).map(
                                ({ date, prescribingIds, medicines, baseData }) => (
                                <Box key={date}>
                                    <PrescriptionDetailCard 
                                        key={`date-${date}`}
                                        handlePayment={({amounts, onSuccess, onError, momoWallet = false}) =>
                                            handlePayment({amounts, onSuccess, onError, momoWallet})}
                                        isLoadingButton={isLoadingButton}
                                        prescriptionData={{
                                            medicineUnits: medicines,
                                            listPrescribingId: prescribingIds,
                                            created_date: date,
                                            examination: diagnosisInfo.examination,
                                            patient: diagnosisInfo.patient,
                                            user: diagnosisInfo.user,
                                            bill_status: baseData.prescribing.bill_status,
                                        }} 
                                    />
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            );
    };

    return (
        <>
            <Helmet><title>{t('common:payments')}</title></Helmet>
            <Box className='ou-container ou-mx-auto ou-m-auto ou-max-w-[1536px] ou-min-h-[550px]'>
                {renderDiagnosisSection()}
            </Box>
        </>
    )
}

export default Payments;