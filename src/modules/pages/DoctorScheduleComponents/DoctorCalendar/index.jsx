import { Box, Grid, Typography, Paper, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import CircleIcon from '@mui/icons-material/Circle';
import moment from "moment";
import Loading from "../../../common/components/Loading";

const Item = styled(Paper)({
    padding: '12px',
    textAlign: 'center',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .doctor-list': {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '140px',
        overflow: 'auto'
    },
    '& .doctor-item': {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        '& .doctor-name': {
            maxWidth: '120px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }
});

const DoctorCalendar = ({scheduleData, selectedYear, selectedWeek}) => {
    const {t, tReady} = useTranslation(['doctor-schedule', 'common']);
    
    if(tReady || !scheduleData) {
        return <Box sx={{ minHeight: "300px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loading />
        </Box>
    }

    const weekDays = [
        t('doctor-schedule:monday'), 
        t('doctor-schedule:tuesday'),
        t('doctor-schedule:wednesday'), 
        t('doctor-schedule:thursday'), 
        t('doctor-schedule:friday'), 
        t('doctor-schedule:saturday')
    ];

    const timeSlots = [
        t('doctor-schedule:morning'), 
        t('doctor-schedule:afternoon')
    ];

    const getDayDate = (index) => {
        const startOfWeek = moment().year(selectedYear).week(selectedWeek).startOf('isoWeek');
        return startOfWeek.clone().add(index, 'days').format('YYYY-MM-DD');
    };

    const renderDoctorStatus = (status, doctorEmail) => {
        const displayName = doctorEmail.split('@')[0];
        const isAvailable = status === t('doctor-schedule:available');
        
        return (
            <div className="doctor-item" key={doctorEmail}>
                <CircleIcon sx={{ color: isAvailable ? '#4CAF50' : '#FF0000', fontSize: '14px' }} />
                <span className="doctor-name">{displayName}</span>
            </div>
        );
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" className="ou-text-center" sx={{ mb: 3 }}>
                {t('doctor-schedule:doctorCalendar')} - {t('doctor-schedule:week')} {selectedWeek}, {selectedYear}
            </Typography>
                
            <Grid container spacing={1} justifyContent={"center"}>
                {/* Header */}
                <Grid item xs={2}>
                    <Item sx={{ backgroundColor: '#f5f5f5' }}>{t('doctor-schedule:time')}</Item>
                </Grid>
                {weekDays.map((day, index) => (
                    <Grid item xs={1.5} key={index}>
                        <Item sx={{ backgroundColor: '#f5f5f5' }}>
                            {day}
                            <br />
                            {moment(getDayDate(index)).format('DD/MM')}
                        </Item>
                    </Grid>
                ))}

                {/* Schedule Grid */}
                {timeSlots.map((timeSlot, timeIndex) => (
                    <React.Fragment key={timeIndex}>
                        <Grid item xs={2}>
                            <Item>{timeSlot}</Item>
                        </Grid>
                        {weekDays.map((_, dayIndex) => (
                            <Grid item xs={1.5} key={dayIndex}>
                                <Item>
                                    <div className="doctor-list">
                                        {Object.keys(scheduleData).map(doctorEmail => {
                                            const date = getDayDate(dayIndex);
                                            const schedule = scheduleData[doctorEmail][date];
                                            const session = timeIndex === 0 ? 'morning' : 'afternoon';

                                            if (!schedule || !schedule[session]) return null;

                                            const status = schedule[session].is_off ? 
                                                t('doctor-schedule:unavailable') : 
                                                t('doctor-schedule:available');

                                            return renderDoctorStatus(status, doctorEmail);
                                        })}
                                    </div>
                                </Item>
                            </Grid>
                        ))}
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
};

export default DoctorCalendar;