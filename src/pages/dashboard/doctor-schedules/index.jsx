import React, { useContext } from 'react';
import { Box, Paper } from '@mui/material';
import Loading from '../../../modules/common/components/Loading';
import { useTranslation } from 'react-i18next';
import DoctorScheduleForm from '../../../modules/pages/DoctorScheduleComponents/DoctorScheduleForm';
import UserContext from '../../../lib/context/UserContext';
import { Helmet } from 'react-helmet';

const DoctorSchedules = () => {
    const {t, tReady} = useTranslation(['doctor-schedule', 'common']);
    const {user} = useContext(UserContext);

    if(tReady)
        return <Box sx={{ minHeight: "300px" }}>
            <Helmet>
                <title>Doctor Schedules</title>
            </Helmet>
            <Box className='ou-p-5'>
                <Loading/>
            </Box>
        </Box>

    return (
        <>
            <Helmet>
                <title>{t('doctor-schedule:doctor-schedule')}</title>
            </Helmet>
            <Box component={Paper} className='ou-w-[90%] ou-mx-auto'>     
                <DoctorScheduleForm doctor={user}/>
            </Box>
        </>
    );
}   

export default DoctorSchedules;