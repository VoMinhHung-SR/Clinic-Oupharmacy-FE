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
import BookingDoctorDiscovery from "../../modules/pages/BookingComponents/BookingDoctorDiscovery";

// Constants for reusable styles
const BUTTON_STYLES = {
  base: "ou-btn-base ou-min-w-[120px]",
  booking: "ou-btn-booking ou-border-opacity-60",
};

const ICON_STYLES = {
  large: {
    fontSize: { xs: 56, sm: 64, md: 72 },
    marginBottom: '8px'
  },
  text: {
    paddingTop: '8px',
    fontWeight: 600,
    fontSize: { xs: '0.95rem', sm: '1.05rem' },
    textAlign: 'center',
    lineHeight: 1.35,
  }
};

// Reusable SelectionButton component
const SelectionButton = ({ onClick, isSelected, icon, text }) => (
    <button 
        type="button"
        onClick={onClick} 
        className={clsx(BUTTON_STYLES.booking, {
            "ou-btn-booking__focus": isSelected,
        })}
        style={{
            width: '100%',
            maxWidth: 360,
            minHeight: 200,
            padding: '28px 24px',
            boxSizing: 'border-box',
        }}
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

    const contentAlignCenter = state === 1 || state === 4
    const patientCount = patientList?.length || 0
    const patientGridCentered = patientCount > 0 && patientCount <= 2
    const patientItemCols =
        patientCount === 1
            ? { xs: 12, sm: 8, md: 5, lg: 4 }
            : patientCount === 2
              ? { xs: 12, sm: 6, md: 5 }
              : patientCount <= 3
                ? { xs: 12, sm: 6, md: 4 }
                : { xs: 12, sm: 6, md: 4, lg: 3 }

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
            style: { minWidth: 120 }
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
                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            mb: 3,
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                    >
                        {t('booking:choosePatientMethod')}
                    </Box>
                    <Box 
                        className="ou-w-full ou-flex ou-justify-center ou-items-stretch"    
                        sx={{
                            gap: { xs: 2, sm: 3, md: 4 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'stretch' },
                        }}
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
                    spacing={{ xs: 2, sm: 2.5, md: 3 }}
                    justifyContent={patientGridCentered ? 'center' : 'flex-start'}
                    alignItems="stretch"
                    sx={{ 
                        px: { xs: 0, sm: 0.5 },
                        margin: 0,
                        width: '100%',
                    }}
                >
                    {patientList && patientList.map(p => (
                        <Grid 
                            item
                            key={"patient@"+p.id}
                            {...patientItemCols}
                            sx={{ display: 'flex' }}
                        >
                            <PatientCard 
                                patientData={p} 
                                callBackOnClickCard={onCallbackPatientCardOnClick}
                                isSelected={patientSelected && patientSelected.id === p.id}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        )
    
    }
    // Step 3 — discovery then single doctor booking panel (MASTER P3)
    const renderThirdState = () => {
        if (!allConfig?.doctors?.length) {
            return <p className="ou-text-gray-600">{t('booking:noDoctorFound')}</p>
        }
        return (
            <Box sx={{ width: '100%', textAlign: 'left' }}>
                <BookingDoctorDiscovery doctors={allConfig.doctors} />
            </Box>
        )
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
                    position: 'relative',
                    display: 'flex',
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 1.5, sm: 2, md: 3 },
                }}
            >
                <Box 
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: { xs: '100%', md: 1440 },
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        borderRadius: { xs: 2, md: 3 },
                        overflow: 'hidden',
                        bgcolor: '#fff',
                    }}
                    component={Paper} 
                    elevation={2}
                >        
                    {/* Progression area */}
                    <Box 
                        sx={{
                            position: 'absolute',
                            top: { xs: 12, sm: 16, md: 20 },
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
                            textAlign: contentAlignCenter ? 'center' : 'left',
                            width: '100%',
                            mx: 'auto',
                            pt: { xs: 8, sm: 9, md: 10 },
                            pb: { xs: 9, sm: 10, md: 11 },
                            px: { xs: 2, sm: 4, md: 5, lg: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: contentAlignCenter ? 'center' : 'flex-start',
                            minHeight: contentAlignCenter ? { xs: 300, sm: 340 } : 'auto',
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
                            alignItems: 'center',
                            zIndex: 2,
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
