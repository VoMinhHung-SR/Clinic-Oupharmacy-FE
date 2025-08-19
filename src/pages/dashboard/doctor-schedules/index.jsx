import React, { useContext } from 'react';
import { Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DoctorScheduleForm from '../../../modules/pages/DoctorScheduleComponents/DoctorScheduleForm';
import UserContext from '../../../lib/context/UserContext';
import { Helmet } from 'react-helmet';
import SkeletonDoctorScheduleList from '../../../modules/common/components/skeletons/pages/doctor-schedules';

const DoctorSchedules = () => {
    const {t, tReady} = useTranslation(['doctor-schedule', 'common']);
    const {user} = useContext(UserContext);

    if(tReady)
        return <Box>
            <Helmet>
                <title>Doctor Schedules</title>
            </Helmet>
            <SkeletonDoctorScheduleList />
        </Box>

    return (
        <>
            <Helmet>
                <title>{t('doctor-schedule:doctor-schedule')}</title>
            </Helmet>
            <Box component={Paper} elevation={4} className='ou-container ou-mx-auto'>     
                <DoctorScheduleForm doctor={user}/>
            </Box>
        </>
    );
}   

export default DoctorSchedules;