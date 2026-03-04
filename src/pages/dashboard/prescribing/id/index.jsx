import { Button, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import usePrescriptionDetail from "../../../../modules/pages/PrescriptionDetailComponents/hooks/usePrescriptionDetail"
import { Helmet } from "react-helmet"
import { useContext, useState, useEffect, useRef } from "react"
import PrescribingContext from "../../../../lib/context/PrescribingContext"
import UserContext from "../../../../lib/context/UserContext"
import MedicinesHome from "../../../../modules/pages/ProductComponents/MedicinesHome"
import useCustomNavigate from "../../../../lib/hooks/useCustomNavigate"
import PrescriptionDetailCard from "../../../../modules/common/components/card/PrescriptionDetailCard"
import { ConfirmAlert } from "../../../../config/sweetAlert2"
import BackdropLoading from "../../../../modules/common/components/BackdropLoading"
import PrescriptionDetailLayout from "../../../../modules/pages/PrescriptionDetailComponents/layout"
import PrescriptionFormSidebar from "../../../../modules/pages/PrescriptionDetailComponents/PrescriptionFormSidebar"
import SkeletonPrescribingDetail from "../../../../modules/common/components/skeletons/pages/prescribing/[id]"

const PrescriptionDetail = () => {
    const {user} = useContext(UserContext)
    const {medicinesSubmit, handleAddPrescriptionDetail, newPrescribing,
        handleUpdateMedicinesSubmit, resetMedicineStore, 
        addMedicineItem, clearForm, hasUnsavedChanges, 
        newestPrescriptionDetail, isBackdropLoading} = useContext(PrescribingContext)
    
    const {isLoadingPrescriptionDetail, prescriptionDetail} = usePrescriptionDetail()

    const {t, ready} = useTranslation(['prescription-detail','common', 'modal'])
    
    
    const {navigate} = useCustomNavigate({
        shouldBlock: hasUnsavedChanges,
        onClearForm: () => {
            clearForm();
        }
    })
    const [confirm, setConfirm] = useState(false)
    const hasShownDialog = useRef(false)
    // URL param :prescribingId is diagnosis ID (same route, semantics clarified in code)
    const { prescribingId: diagnosisId } = useParams();

    const handlePrescriptionDetailExist = () => {
        if(prescriptionDetail?.prescribing_info.length > 0 && !hasShownDialog.current){
            hasShownDialog.current = true;
            ConfirmAlert(
                t('prescription-detail:prescriptionDetailExist'), 
                t('prescription-detail:prescriptionDetailExistDescription'), 
                t('modal:continue'),t('modal:back'), 
                () => {
                    setConfirm(true);
                }, 
                () => {
                    navigate('/dashboard/prescribing/');
                }
            );
        }
    }

    useEffect(() => {
        if (!isLoadingPrescriptionDetail && 
            prescriptionDetail && 
            prescriptionDetail.prescribing_info.length > 0 && 
            !confirm &&
            !hasShownDialog.current) {
            handlePrescriptionDetailExist();
        }
    }, [isLoadingPrescriptionDetail, prescriptionDetail]);

    const handleOnEdit = (medicineUpdate, deletedArrayItems) => {
        if (deletedArrayItems.length === medicinesSubmit.length)
            return handleUpdateMedicinesSubmit([])

        const dataWithoutNull = medicineUpdate.filter(item => item !== null);
        handleUpdateMedicinesSubmit(dataWithoutNull)
    }

    if (!ready || isLoadingPrescriptionDetail)
        return (
            <>
                <Helmet>
                    <title>Prescribing Detail</title>
                </Helmet>
                <SkeletonPrescribingDetail />
            </>
        )

    return (
        <>
            <Helmet>
                <title>{t('prescription-detail:prescriptionDetail')}</title>
            </Helmet>

            {isBackdropLoading && (
                <Box className="ou-absolute ou-top-0 ou-left-0 ou-right-0 ou-bottom-0 ou-bg-black ou-opacity-50">
                    <BackdropLoading/>
                </Box>
            )}

            {newestPrescriptionDetail.length > 0 && (
                <Box>
                    <Box className="ou-mb-4">
                        <PrescriptionDetailCard 
                            prescriptionData={{
                                listPrescribingId: [newPrescribing.id],
                                created_date: newestPrescriptionDetail[0].created_date,
                                medicineUnits: newestPrescriptionDetail,
                                // normal info
                                examination: prescriptionDetail.examination,
                                patient: prescriptionDetail.examination.patient,
                                user: prescriptionDetail.user
                            }} 
                        />
                    </Box>
                </Box>
            )}

            {!isLoadingPrescriptionDetail && prescriptionDetail === null && newestPrescriptionDetail.length === 0 && (
               <Box className="ou-relative ou-items-center " sx={{ minHeight: "550px" }}>
                    <Box className='ou-absolute ou-p-5 ou-text-center 
                    ou-flex-col ou-flex ou-justify-center ou-items-center
                    ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center'>
                            <h2 className='ou-text-xl ou-text-red-600'>
                                {t('prescription-detail:errNullPrescription')}
                            </h2>
                            <Typography className='text-center'>
                                <h3>{t('common:goToBooking')} </h3>
                                <Button onClick={() => { navigate('/booking') }}>{t('common:here')}!</Button>
                            </Typography>
                    </Box>
               </Box>
            )}

            {!isLoadingPrescriptionDetail && prescriptionDetail !== null && newestPrescriptionDetail.length === 0 && (
                <PrescriptionDetailLayout
                    leftContent={
                        <MedicinesHome
                            onAddMedicineLineItem={addMedicineItem}
                            medicinesSubmit={medicinesSubmit}
                            actionButton={
                                <Button fullWidth className="!ou-p-3 !ou-bg-blue-600 !ou-text-white">
                                    {t("prescription-detail:prescribing")}
                                </Button>
                            }
                        />
                    }
                    rightContent={
                        <PrescriptionFormSidebar
                            patient={prescriptionDetail.examination.patient}
                            patientId={prescriptionDetail.examination.patient.id}
                            medicinesSubmit={medicinesSubmit}
                            onAddPrescriptionDetail={handleAddPrescriptionDetail}
                            onReset={resetMedicineStore}
                            onEdit={handleOnEdit}
                            user={user}
                            diagnosisId={diagnosisId}
                        />
                    }
                />
            )}
        </>
    )
}

export default PrescriptionDetail