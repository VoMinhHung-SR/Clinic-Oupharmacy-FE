import { Box, Grid, Paper } from "@mui/material"
import BackdropLoading from "../../modules/common/components/BackdropLoading";
import { useTranslation } from "react-i18next";
import Loading from "../../modules/common/components/Loading";
import useBooking from "../../modules/pages/BookingComponents/hooks/useBooking";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useContext } from "react";
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import clsx from "clsx";
import FormAddPatient from "../../modules/pages/BookingComponents/FormAddPatient";
import BookingContext from "../../lib/context/BookingContext";
import createToastMessage from "../../lib/utils/createToastMessage";
import { TOAST_ERROR } from "../../lib/constants";
import PatientCard from "../../modules/common/components/card/PatientCard";
import BookingProcess from "../../modules/pages/BookingComponents/BookingProcess";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from "react-router";
import BookingForm from "../../modules/pages/BookingComponents/BookingForm";
import UserContext from "../../lib/context/UserContext";


const Booking = () => {
    const { t, ready } = useTranslation(['booking','common'])

    const { allConfig } = useSelector((state) => state.config);

    const { isAddNewPatient, setIsAddNewPatient,
        state, actionUpState, actionDownState, clearStage,
        patientSelected, setPatientSelected} = useContext(BookingContext)

    const { hasValidUserAddress } = useContext(UserContext)
    const {openBackdrop,patientList, isLoading} = useBooking()
    const router = useNavigate();
    // TODO: adding skeletons here
    if (!ready)
        return <Box sx={{ minHeight: "300px" }}>
             <Helmet>
                <title>Booking</title>
            </Helmet>
            <Box className='ou-p-5'>
                <Loading></Loading>
            </Box>
    </Box>;
    

    const onCallbackPatientCardOnClick = (patientData) => {
        setPatientSelected(patientData)
    }

    const checkUpStateTwoToThree = () => {
        // Add new patient profile
        if(isAddNewPatient)
            if (state === 2 && Object.keys(patientSelected).length <= 0)
                return createToastMessage({type: TOAST_ERROR ,message:t('booking:errPatientNeedToCreate')})
            if (state === 2 && Object.keys(patientSelected).length > 0)
                return actionUpState()
        // Using exist patient profile
        if (state === 2 && Object.keys(patientSelected).length <= 0)
            return createToastMessage({type: TOAST_ERROR ,message:t('booking:errPatientNeedToSelect')})
        return actionUpState()
    }

    const createPatientSuccess = (patientData) => {
        setPatientSelected(patientData)
        actionUpState()
    }
    // === Base step ===
    const renderStep = () => {
        if (state ===  4)
            return(
                <>
                    <button className="ou-mr-3 ou-btn-base ou-min-w-[120px]" 
                    onClick={()=> clearStage()}>{t("booking:addingNewPatient")}</button>
                </>)
        ;
        if (state === 1)
            return <button
                    className={clsx("ou-btn-base ou-min-w-[120px]" ,{})
                    } onClick={()=> actionUpState()}>{t('booking:next')}</button>
        if (state === 3)
            return <button className="ou-btn-base ou-min-w-[120px]" onClick={()=> actionDownState()}>{t('booking:previous')}</button>
        return (
            <>
                <button className="ou-mr-3 ou-btn-base ou-min-w-[120px]" onClick={()=> actionDownState()}>{t('booking:previous')}</button>
                <button className=" ou-btn-base ou-min-w-[120px]" onClick={()=> checkUpStateTwoToThree()}>{t('booking:next')}</button>
            </>
        )
    }


    // Step 1
    const renderSelectionBookingMethod = () => {
        if (isLoading)
            return <BackdropLoading/>
        if(patientList.length !== 0)
            return (
                <>
                    <div className="ou-flex ou-justify-center ou-space-x-10 ">
                        <button onClick={()=>{setIsAddNewPatient(true)}} 
                            className={
                                clsx("ou-btn-booking ou-border-opacity-60",{
                                    "ou-btn-booking__focus": isAddNewPatient === true,
                                })
                            }>  
                            <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                                <AddIcon className="!ou-text-[120px] ou-mb-3 "/>
                                <span className="ou-pt-5 ou-font-bold">{t("booking:addingNewPatient")}</span>
                            </div>
                        </button>
                        
                        <div>
                            <button onClick={()=>{setIsAddNewPatient(false)}} className={
                                clsx("ou-btn-booking ou-border-opacity-60",{
                                    "ou-btn-booking__focus": isAddNewPatient === false,
                                })
                            }
                            >  
                                <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                                    <PersonIcon  className="!ou-text-[120px] ou-mb-3 "/>
                                    <span className="ou-pt-5 ou-font-bold">{t("booking:existingPatient")}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )
        else
            return (
                <div className="ou-flex ou-justify-center">
                    <button onClick={()=>{setIsAddNewPatient(true)}}  className={
                                    clsx("ou-btn-booking ou-border-opacity-60",{
                                        "ou-btn-booking__focus": isAddNewPatient === true,
                                    })
                                }>  
                        <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                            <AddIcon className="!ou-text-[120px] ou-mb-3 "/>
                            <span className="ou-pt-5 ou-font-bold">{t("booking:addingNewPatient")}</span>
                        </div>
                    </button>
                </div>
        )
    }

    // Step 2 : State 2: when user choosing create with new patient
    // or choosing create with exist patient  
    const renderSecondState = () => {
        if (isAddNewPatient)
            return  <FormAddPatient onCallbackSuccess={(patientData) =>  
                createPatientSuccess(patientData)}/>
        
        return (
            <div> 
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent={"center"}>
                    {patientList && patientList.map(p => <div className="ou-mb-3">
                        <PatientCard patientData={p} 
                            callBackOnClickCard={onCallbackPatientCardOnClick} key={"pa"+p.id} 
                            isSelected={patientSelected && patientSelected.id === p.id}/>
                        </div>)}
                </Grid>
            </div>
        )
    
    }
    // Step 3
    const renderThirdState = () => {
        return (<Box>
            {allConfig && allConfig.doctors ? allConfig.doctors.map((d)=> 
                <BookingForm doctorInfo={d} key={d.id}/>) : <></>}
        </Box>)
    }

    // Step 4 
    const renderLastState = () => {
        return(
            <>
                <Box className="ou-text-xl ou-font-bold ou-mb-3">{t('booking:thanksBooking')}</Box>
                <Box>{t('booking:noteBooking')}</Box>
                <Box className="ou-mb-3">{t('booking:bestWishes')}</Box>
                <CheckCircleIcon className="!ou-text-[200px] ou-text-green-700 ou-opacity-80 ou-mb-3"/>    
                <Box>{t('booking:viewAppointment')} 
                    <span className="ou-text-blue-700 hover:ou-cursor-pointer ou-underline" onClick={()=> router('/profile/examinations')}>
                        {t('common:here')}
                    </span>
                </Box>
            </>
            )
    }

    return (
        <>
            <Helmet>
                <title>{t('common:booking')} - OUPharmacy</title>
            </Helmet>
            {openBackdrop === true ?
                (<BackdropLoading />)
                : <></>
            } 
            <Box className="ou-relative ou-py-8 ou-min-h-[80vh] ou-flex">
                <Box className="ou-relative ou-w-full
                            ou-m-auto ou-flex ou-items-center ou-justify-center" 
                            component={Paper} elevation={6}>        
                    {/* Progression area */}
                    <div className="ou-absolute ou-top-[5%]">
                        <BookingProcess/>
                    </div>
                    {/* Main content */}
                    <div className="ou-text-center ou-py-20 ou-w-[80%] ou-mt-8">           
                        {state === 1 && renderSelectionBookingMethod()}
                        {state === 2 && renderSecondState()}
                        {state === 3 && renderThirdState()}
                        {state === 4 && renderLastState()}
                    </div>
                    {/* Button area */}
                    <div className="ou-bottom-0 ou-absolute ou-right-0 ou-m-3">
                        {renderStep()}
                    </div>
                </Box>
            </Box>
        </>
    )
    
}
export default Booking