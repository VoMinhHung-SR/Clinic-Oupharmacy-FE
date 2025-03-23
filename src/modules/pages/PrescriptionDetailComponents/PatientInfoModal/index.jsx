import { useTranslation } from "react-i18next";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import CustomModal from "../../../common/components/Modal";
import { Box, Button, Grid, Paper, Tooltip, Typography } from "@mui/material";
import moment from "moment";

const PatientInfoModal = ({patientData}) => {
    const { t } = useTranslation(["prescription-detail", "common", "modal"]);

    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    return (
        <>
         <Typography>
            <Button
                variant="contained"
                className="ou-bg-blue-700 !ou-min-w-[68px] !ou-min-h-[40px] ou-w-[50%] !ou-py-2 !ou-px-8 !ou-mx-2"
                size="small"
                onClick={()=>handleOpenModal()}
            >
                {t('patientInfo')}
            </Button>
        </Typography>

        <CustomModal
            className="ou-w-[900px] ou-text-center"
            title={t('patientInfo')}
            open={isOpen}
            onClose={handleCloseModal}
            content={<Box component={Paper} elevation={5}>
                 <Grid container justifyContent="flex" className="ou-p-5" component={Paper} elevation={4}> 
                 
                    <Grid item xs={7} className="!ou-mb-5">
                        <Typography>
                            <span >{t('patientFullName')}: </span>
                            {patientData?.first_name} {patientData?.last_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={5} className="!ou-mb-3">
                        <Typography>
                            <span >{t('dateOfBirth')}: </span>
                            {patientData?.date_of_birth ?
                                <span >{moment(patientData?.date_of_birth).format('DD/MM/YYYY') }</span>
                                : t('common:undefined')}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className="!ou-mb-5">
                        <Typography>
                            <span >{t('phoneNumber')}: </span>
                            {patientData?.phone_number}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} >
                        <Typography>
                            <span >{t('email')}: </span>
                            {patientData?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} >
                        <Typography>
                            <span >{t('gender')}: </span>
                            {patientData.gender === 0 ? t('male') : 
                                patientData.gender === 1 ? t('female') :  t('secret')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} >
                        <Typography>
                            <span >{t('address')}: </span>
                            {patientData?.address}
                        </Typography>
                    </Grid>
                   
                </Grid>
            </Box>}
            actions={[
            <Button key="cancel" onClick={handleCloseModal}>
                {t('modal:cancel')}
            </Button>
            ]}
            />
        </>
       
    )
}

export default PatientInfoModal