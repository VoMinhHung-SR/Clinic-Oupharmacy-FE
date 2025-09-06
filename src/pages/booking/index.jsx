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

// Constants for reusable styles
const BUTTON_STYLES = {
  base: "ou-btn-base ou-min-w-[120px]",
  booking: "ou-btn-booking ou-border-opacity-60",
  responsive: { width: { xs: '100%', sm: 'auto' } },
  responsiveWithMax: { 
    width: { xs: '100%', sm: 'auto' }, 
    maxWidth: { xs: '300px', sm: 'none' } 
  }
};

const ICON_STYLES = {
  large: {
    fontSize: { xs: '80px', sm: '100px', md: '120px' },
    marginBottom: '12px'
  },
  text: {
    paddingTop: '12px',
    fontWeight: 'bold',
    fontSize: { xs: '14px', sm: '16px' },
    textAlign: 'center'
  }
};

// Reusable SelectionButton component
const SelectionButton = ({ onClick, isSelected, icon, text }) => (
    <button 
        onClick={onClick} 
        className={clsx(BUTTON_STYLES.booking, {
            "ou-btn-booking__focus": isSelected,
        })}
        sx={BUTTON_STYLES.responsiveWithMax}
    >  
        <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
            {icon}
            <Box sx={ICON_STYLES.text}>
                {text}
            </Box>
        </div>
    </button>
);

const Booking = () => {
    const { t, ready } = useTranslation(['booking','common'])

    const { allConfig } = useSelector((state) => state.config);

    const { isAddNewPatient, setIsAddNewPatient,
        state, actionUpState, actionDownState, clearStage,
        patientSelected, setPatientSelected} = useContext(BookingContext)

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
        const buttonProps = {
            className: BUTTON_STYLES.base,
            sx: BUTTON_STYLES.responsive
        };

        if (state === 4) return (
            <button {...buttonProps} onClick={()=> clearStage()}>
                {t("booking:addingNewPatient")}
            </button>
        );
        
        if (state === 1) return (
            <button {...buttonProps} onClick={()=> actionUpState()}>
                {t('booking:next')}
            </button>
        );
        
        if (state === 3) return (
            <button {...buttonProps} onClick={()=> actionDownState()}>
                {t('booking:previous')}
            </button>
        );
        
        return (
            <>
                <button {...buttonProps} onClick={()=> actionDownState()}>
                    {t('booking:previous')}
                </button>
                <button {...buttonProps} onClick={()=> checkUpStateTwoToThree()}>
                    {t('booking:next')}
                </button>
            </>
        )
    }

    // Step 1
    const renderSelectionBookingMethod = () => {
        if (isLoading)
            return <BackdropLoading/>
        if(patientList.length !== 0)
            return (
                <Box 
                    className="ou-w-full ou-flex ou-justify-center ou-items-center"    
                    sx={{gap: { xs: 3, sm: 4, md: 6 }, flexDirection: { xs: 'column', sm: 'row' }}}
                >
                    <SelectionButton
                        onClick={() => setIsAddNewPatient(true)}
                        isSelected={isAddNewPatient === true}
                        icon={<AddIcon sx={ICON_STYLES.large} />}
                        text={t("booking:addingNewPatient")}
                    />
                    
                    <SelectionButton
                        onClick={() => setIsAddNewPatient(false)}
                        isSelected={isAddNewPatient === false}
                        icon={<PersonIcon sx={ICON_STYLES.large} />}
                        text={t("booking:existingPatient")}
                    />
                </Box>
            )
        else
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <SelectionButton
                        onClick={() => setIsAddNewPatient(true)}
                        isSelected={isAddNewPatient === true}
                        icon={<AddIcon sx={ICON_STYLES.large} />}
                        text={t("booking:addingNewPatient")}
                    />
                </Box>
        )
    }

    // Step 2 : State 2: when user choosing create with new patient
    // or choosing create with exist patient  
    const renderSecondState = () => {
        if (isAddNewPatient)
            return  <FormAddPatient onCallbackSuccess={(patientData) =>  
                createPatientSuccess(patientData)}/>
        
        return (
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <Grid 
                    container 
                    spacing={{ xs: 3, sm: 4, md: 5 }}
                    justifyContent="center"
                    sx={{ 
                        padding: { xs: '0 20px', sm: '0 28px', md: '0 36px' },
                        margin: '0 auto'
                    }}
                >
                    {patientList && patientList.map(p => (
                        <Grid 
                            item xs={12} sm={6} md={4} lg={4} xl={4} key={"patient@"+p.id}
                            sx={{minHeight: 'fit-content'}}
                            className="ou-flex ou-justify-center "   
                        >
                            <Box>
                                <PatientCard 
                                    patientData={p} 
                                    callBackOnClickCard={onCallbackPatientCardOnClick}
                                    isSelected={patientSelected && patientSelected.id === p.id}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
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
                <Box className="ou-flex ou-justify-center">
                    <CheckCircleIcon className="!ou-text-[200px] ou-text-green-700 ou-opacity-80 ou-mb-3"/>    
                </Box>
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
            <Box 
                sx={{
                    position: 'relative',  display: 'flex',
                    py: { xs: 2, sm: 4, md: 8 }, px: { xs: 1, sm: 2, md: 4 },
                    minHeight: { xs: '90vh', sm: '80vh' }
                }}
            >
                <Box 
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: { xs: '100%', sm: '1200px' },
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    component={Paper} 
                    elevation={6}
                >        
                    {/* Progression area */}
                    <Box 
                        sx={{
                            position: 'absolute',
                            top: { xs: '2%', sm: '3%', md: '5%' },
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1
                        }}
                    >
                        <BookingProcess/>
                    </Box>
                    
                    {/* Main content */}
                    <Box 
                        sx={{
                            textAlign: 'center', width: { xs: '95%', sm: '90%', md: '85%' },
                            py: { xs: 6, sm: 8, md: 10 }, px: { xs: 3, sm: 4, md: 6 },
                            mt: { xs: 6, sm: 8, md: 10 }, minHeight: { xs: '60vh', sm: '50vh' },
                            display: 'flex', flexDirection: 'column', justifyContent: 'center'
                        }}
                    >           
                        {state === 1 && renderSelectionBookingMethod()}
                        {state === 2 && renderSecondState()}
                        {state === 3 && renderThirdState()}
                        {state === 4 && renderLastState()}
                    </Box>
                    
                    {/* Button area */}
                    <Box 
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 8, sm: 12, md: 16 },
                            right: { xs: 8, sm: 12, md: 16 },
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 1, sm: 2 },
                            alignItems: 'center'
                        }}
                    >
                        {renderStep()}
                    </Box>
                </Box>
            </Box>
        </>
    )
}
export default Booking