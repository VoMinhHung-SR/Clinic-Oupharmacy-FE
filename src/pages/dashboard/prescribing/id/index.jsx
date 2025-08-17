import { Button, FormControl, Grid, Paper, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import Loading from "../../../../modules/common/components/Loading"
import usePrescriptionDetail from "../../../../modules/pages/PrescriptionDetailComponents/hooks/usePrescriptionDetail"
import { Helmet } from "react-helmet"
import PatientInfoModal from "../../../../modules/pages/PrescriptionDetailComponents/PatientInfoModal"
import MedicalRecordsModal from "../../../../modules/pages/PrescriptionDetailComponents/MedicalRecordsModal"
import { useContext, useState, useEffect, useRef } from "react"
import PrescribingContext from "../../../../lib/context/PrescribingContext"
import UserContext from "../../../../lib/context/UserContext"
import EditPrescriptionModal from "../../../../modules/pages/PrescriptionDetailComponents/EditPrescriptionModal"
import MedicinesHome from "../../../../modules/pages/ProductComponents/MedicinesHome"
import useCustomNavigate from "../../../../lib/hooks/useCustomNavigate"
import PrescriptionDetailCard from "../../../../modules/common/components/card/PrescriptionDetailCard"
import { ConfirmAlert } from "../../../../config/sweetAlert2"
import BackdropLoading from "../../../../modules/common/components/BackdropLoading"

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
    const { prescribingId } = useParams();

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

    const renderMedicinesSubmit = (medicineUnitInfo, index) => {
        return (
            <Grid  key={'mdc-'+index} item xs={12} className="!ou-mt-2">
                <Grid id={medicineUnitInfo.id} 
                    container justifyContent="flex" style={{ "margin": "0 auto" }}>

                    <Grid item xs={7}>
                        <FormControl fullWidth >
                            <span className="ou-text-sm">{index+1 + ". " + medicineUnitInfo.medicineName}</span>
                        </FormControl>
                    </Grid>
                
                    <Grid item xs={3}  className="ou-text-center">
                        <span className="ou-text-sm">{medicineUnitInfo.uses}</span>
                    </Grid>
                    <Grid item xs={2}  className="ou-text-center">
                        <span className="ou-text-sm ou-text-center">{medicineUnitInfo.quantity}</span>
                    </Grid>
                </Grid>
            </Grid>
    )}

    //TODO: add skeletons here
    if(!ready || isLoadingPrescriptionDetail)
        return <Box sx={{ height: "300px" }}>
            <Helmet>
                <title>Prescribing</title>
            </Helmet>
            
            <Box className='ou-p-5'>
                <Loading/>
            </Box>
        </Box>

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
                                {t('errNullPrescription')}
                            </h2>
                            <Typography className='text-center'>
                                <h3>{t('common:goToBooking')} </h3>
                                <Button onClick={() => { navigate('/booking') }}>{t('common:here')}!</Button>
                            </Typography>
                    </Box>
               </Box>
            )}

            {!isLoadingPrescriptionDetail && prescriptionDetail !== null && newestPrescriptionDetail.length === 0 &&
                <Grid container>
                    <Grid item xs={8} className="ou-pr-6">
                        <Box>
                        <MedicinesHome 
                            onAddMedicineLineItem={addMedicineItem} 
                            medicinesSubmit={medicinesSubmit}
                            actionButton={
                                <Button fullWidth className="!ou-p-3 !ou-bg-blue-600 !ou-text-white"> Prescribing 
                                </Button>
                            }
                        />
                        </Box>
                    </Grid>
                    <Grid item xs={4} className="ou-w-[100%]">
                        <Box className='ou-m-auto ou-max-w-[1536px] ou-w-full'>                     
                            <Box className="ou-m-auto ou-mb-6" >
                                <Grid container justifyContent="flex" className="ou-min-h-[160px] ou-p-5" component={Paper} elevation={5}> 
                                    <Grid item xs={12} className="ou-pb-5" >
                                        <h1 className="ou-text-center ou-text-xl">{t('common:basicInformation')}</h1>
                                    </Grid>
                                    <Grid item xs={12} className="ou-pb-5 ou-text-center" >
                                        <PatientInfoModal patientData={prescriptionDetail.examination.patient}/>
                                    </Grid>

                                    <Grid item xs={12} className="ou-text-center">
                                        <MedicalRecordsModal patientID={prescriptionDetail.examination.patient.id}/>
                                    </Grid>
                                </Grid>
                            </Box>
                            {/* Medicine Submit area */}
                            
                            <Grid item component={Paper} elevation={5}>
                                <form
                                    className="ou-p-5 ou-w-full">
                                    <h1 className="ou-text-center ou-text-xl ou-pb-8">{t('prescriptionDetail')}</h1>
                                    <Grid container className="ou-py-3">
                                    {medicinesSubmit.length === 0 ?
                                        (<>
                                            <Grid item xs={12}><Typography className="ou-text-center">{t('nullMedicine')}</Typography></Grid>
                                        </>)
                                        : <>
                                            <Grid item xs={7} className="!ou-mb-2">{t('prescription-detail:medicineName')}</Grid>
                                            <Grid item xs={3} className="ou-text-center !ou-mb-2">{t('prescription-detail:uses')}</Grid>
                                            <Grid item xs={2} className="ou-text-center !ou-mb-2">{t('prescription-detail:quantity')}</Grid>
                                            
                                            {medicinesSubmit.map((item, index) => renderMedicinesSubmit(item, index))}
                                        
                                            <Grid container spacing={2} className="p-3 ou-w-full !ou-mt-5" >

                                                <Grid item xs={6}>
                                                    <EditPrescriptionModal medicinesSubmitData={medicinesSubmit} 
                                                    handleOnEdit={handleOnEdit} handleClearAll={resetMedicineStore}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Button className="ou-w-full" variant="contained" color="error"
                                                            onClick={resetMedicineStore} 
                                                        >
                                                            {t('common:deleteAll')}
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Button className="ou-w-full" variant="contained" color="success"
                                                            onClick={() => handleAddPrescriptionDetail(user.id, prescribingId)} 
                                                        >
                                                            {t('prescribing')}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            </> 
                                        }
                                        
                                    </Grid>
                                </form>            
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default PrescriptionDetail