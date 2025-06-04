import { Box, Grid, Typography, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from "react-i18next";
import React from "react";
import CircleIcon from '@mui/icons-material/Circle';
import moment from "moment";
import Loading from "../../../common/components/Loading";

const Item = ({ children, sx }) => (
  <Box
    sx={{
      p: 1.5,
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      minHeight: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      ...sx,
    }}
  >
    {children}
  </Box>
);

const DoctorCalendar = ({scheduleData, selectedYear, selectedWeek}) => {
    const {t, tReady} = useTranslation(['doctor-schedule', 'common']);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
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
        const startOfWeek = moment().year(selectedYear).isoWeek(selectedWeek).startOf('isoWeek');
        return startOfWeek.clone().add(index, 'days').format('YYYY-MM-DD');
    };

    const isToday = (date) => {
        return moment().format('YYYY-MM-DD') === date;
    };

    const renderDoctorStatus = (status, doctorEmail) => {
        const displayName = doctorEmail.split('@')[0];
        const isAvailable = status === t('doctor-schedule:available');
        const shortName = displayName.length > 10 ? displayName.slice(0, 10) + '…' : displayName;
        return (
            <Tooltip title={displayName} key={doctorEmail} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <CircleIcon sx={{ color: isAvailable ? '#4CAF50' : '#FF0000', fontSize: '14px' }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{shortName}</span>
                </Box>
            </Tooltip>
        );
    };

    return (
        <Box sx={{ overflowX: isTablet ? 'auto' : 'unset',  m: { xs: 1, md: 4 } }}>
                   
            <Typography variant="h6" className="ou-text-center" sx={{ mb: 3 }}>
                {t('doctor-schedule:doctorCalendar')} - {t('doctor-schedule:week')} {selectedWeek}, {selectedYear}
            </Typography>
                
            <Box sx={{ minWidth: isTablet ? 700 : 'unset' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                    <Item sx={{ flex: 1.2, backgroundColor: '#f5f5f5' }}>{t('doctor-schedule:time')}</Item>
                    {weekDays.map((day, index) => {
                        const date = getDayDate(index);
                        return (
                            <Item
                                key={index}
                                sx={{
                                    flex: 1,
                                    backgroundColor: isToday(date) ? '#e3f2fd' : '#f5f5f5',
                                    color: isToday(date) ? theme.palette.primary.main : 'inherit',
                                    borderBottom: isToday(date) ? '2px solid ' + theme.palette.primary.main : undefined,
                                }}
                            >
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    {day}
                                    <br />
                                    <span style={{ fontSize: 13 }}>{moment(getDayDate(index)).format('DD/MM')}</span>
                                </div>
                            </Item>
                        );
                    })}
                </Box>
                {/* Body */}
                {timeSlots.map((timeSlot, timeIndex) => (
                    <Box sx={{ display: 'flex', gap: 1, mb: timeIndex === 0 ? 1 : 0 }} key={timeIndex}>
                        <Item sx={{ flex: 1.2, backgroundColor: '#f5f5f5' }}>{timeSlot}</Item>
                        {weekDays.map((_, dayIndex) => {
                            const date = getDayDate(dayIndex);
                            return (
                                <Item
                                    key={dayIndex}
                                    sx={{
                                        flex: 1,
                                        backgroundColor: isToday(date) ? '#e3f2fd' : '#fff',
                                        border: isToday(date) ? '2px solid ' + theme.palette.primary.main : undefined,
                                        transition: 'background 0.2s',
                                        '&:hover': {
                                            backgroundColor: '#f0f4c3',
                                        },
                                    }}
                                >
                                    <div className="doctor-list" style={{ width: '100%' }}>
                                        {Object.keys(scheduleData).map((doctorEmail) => {
                                            const schedule = scheduleData[doctorEmail][date];
                                            const session = timeIndex === 0 ? 'morning' : 'afternoon';
                                            if (!schedule || !schedule[session]) return null;
                                            const status = schedule[session].is_off
                                                ? t('doctor-schedule:unavailable')
                                                : t('doctor-schedule:available');
                                            return renderDoctorStatus(status, doctorEmail);
                                        })}
                                    </div>
                                </Item>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default DoctorCalendar;