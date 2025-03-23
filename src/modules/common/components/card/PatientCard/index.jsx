import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../Loading"
import PersonIcon from '@mui/icons-material/Person';
import useCustomModal from "../../../../../lib/hooks/useCustomModal.js";
import CustomModal from "../../Modal.jsx";
import moment from "moment";
import clsx from "clsx";
import { calculateAge } from "../../../../../lib/utils/helper.js";

const PatientCard = ({patientData, callBackOnClickCard = () => {}, isSelected}) => {
    const {t, tReady} = useTranslation(['booking','common'])
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    if(tReady)
        return(<Box className="!ou-mt-2">
            <Loading/>
        </Box>
    )

    const handleOnClick = () =>{
        callBackOnClickCard(patientData)
    }


    return (
    <>
        <Box key={patientData.id} className="ou-mx-4" onClick={()=> handleOnClick()}>
            <Box className="ou-flex ou-flex-col">
                <button className={
                    clsx("ou-btn-booking ou-border-opacity-60",{
                        "ou-btn-booking__focus": isSelected === true,
                    })}>
                    <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                        <PersonIcon className="!ou-text-[120px] ou-mb-3 "/>
                        <span className="ou-pt-5 ou-font-bold">{patientData.first_name + " " +patientData.last_name} 
                            <span> ({calculateAge(patientData.date_of_birth)+" "+ t('booking:yearsOld')})</span></span>
                        <span className="ou-pt-3 ou-mb-3">{patientData.email}</span>
                    </div>

                <button className="hover:ou-text-blue-900 hover:ou-font-bold ou-underline" 
                onClick={(e) => {
                    e.stopPropagation(); // prevents triggering the card click
                    handleOpenModal();
                  }}>{t('booking:seeDetail')}</button>
                </button>

            </Box>
        </Box>
        
        <CustomModal
            className="ou-w-[600px]"
            open={isOpen}
            onClose={handleCloseModal}
            content={<PatientInfoModel patientData={patientData}/>}
            actions={[
            ]}
        />

    </>
    )
}

export default PatientCard


const PatientInfoModel = ({patientData}) =>{
const {t, tReady} = useTranslation(['booking','common'])
    return (
        <div className="ou-base-form-outline">
            <h5 className="ou-text-center ou-text-2xl">{t('patientInfo')}</h5>
                <Grid container justifyContent="flex"  id={1}>
                    <Grid item xs={6}  className="!ou-mt-6 ou-pr-2" >
                        <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            defaultValue={patientData.first_name}
                            label={t('firstName')}
                            InputProps={{
                                readOnly: true,
                            }}                        
                            />
                    </Grid>
                    <Grid item xs={6} className="!ou-mt-6 ou-pl-2" >
                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            id="lastName"
                            name="lastName"
                            defaultValue={patientData.last_name}
                            label={t('lastName')}
                            InputProps={{
                                readOnly: true,
                            }}                        
                            />
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex" >
                    <Grid item xs={7} className="!ou-mt-6 ou-pr-2">
                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            id="email"
                            name="email"
                            label={t('email')}          
                            defaultValue={patientData.email} 
                            InputProps={{
                                readOnly: true,
                            }}                        
                            />
                    </Grid>

                    <Grid item xs={5} className="!ou-mt-6 ou-pl-2">

                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            id="phoneNumber"
                            name="phoneNumber"
                            label={t('phoneNumber')}
                            defaultValue={patientData.phone_number ? patientData.phone_number : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container justifyContent="flex" style={{ "margin": "0 auto" }} >
                    <Grid item xs={12} className="!ou-mt-6">
                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            id="address"
                            name="address"
                            label={t('address')}
                            defaultValue={patientData.address ? patientData.address : ""}
                            InputProps={{
                                readOnly: true,
                            }}                        
                            />
                            
                    </Grid>

                </Grid>

                <Grid container justifyContent="flex" style={{ "margin": "0 auto", "marginBottom": "12px" }}>
                    <Grid item xs={6} className="!ou-mt-6">
                        <FormControl >
                            <TextField
                                id="dateOfBirth"
                                label={t('dateOfBirth')}
                                name="dateOfBirth"
                                InputProps={{
                                    readOnly: true,
                                }}
                                defaultValue={moment(patientData.date_of_birth).format('YYYY-MM-DD')}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} className="!ou-mt-6">   
                        <FormControl >
                            <InputLabel id="demo-simple-select-label">{t('gender')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="gender"
                                label={t('gender')}
                                defaultValue={patientData.gender}
                                slotProps={{
                                    input: {
                                      readOnly: true,
                                    },
                                  }}
                            >
                                <MenuItem value={0}>{t('man')}</MenuItem>
                                <MenuItem value={1}>{t('woman')}</MenuItem>
                                <MenuItem value={2}>{t('secret')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
        </div>
    )
}