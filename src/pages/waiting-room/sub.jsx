import { Box, Container, Paper, Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import React, { useMemo } from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import useOnlineWaitingRoom from "../../modules/pages/WaittingRoomComponents/hooks/useOnlineWaitingRoom";
import TimeSlotGrid from "../../modules/pages/WaittingRoomComponents/TimeSlotGrid";
import { CURRENT_DATE } from "../../lib/constants";
import moment from "moment";


const OnlineWaitingRoom = () => {
  const { t } = useTranslation(['waiting-room']);
  const { schedules, loading, error } = useOnlineWaitingRoom();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Time slots with formatted time
  const timeSlots = [
    "08:00-09:00", 
    "09:00-10:00", 
    "10:00-11:00", 
    "11:00-12:00", 
    "13:00-14:00", 
    "14:00-15:00", 
    "15:00-16:00", 
    "16:00-17:00"
  ];

  const getTicketsForTimeSlot = (timeSlot) => {
    const tickets = schedules.flatMap(schedule =>
      schedule.time_slots.filter(slot => {
        const slotTime = `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`;
        return slotTime === timeSlot;
      }).map(slot => ({
        id: schedule.id,
        patientName: schedule.doctor_name,
        status: slot.status
      }))
    );
    return tickets;
  };

  return (
    <Container>
      <Helmet>
        <title>{t('title')} </title>
      </Helmet>
      
      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 2, bgcolor: '#1D4ED8', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h6">{t('title')} - {moment(CURRENT_DATE).format('DD/MM/YYYY')}</Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('morning')}</Box>
        <Grid container>
          {timeSlots.slice(0, 4).map((timeSlot, index) => (
            <TimeSlotGrid 
              key={timeSlot} 
              timeSlot={timeSlot} 
              tickets={getTicketsForTimeSlot(timeSlot)} 
            />
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('afternoon')}</Box>
        <Grid container>
          {timeSlots.slice(4).map((timeSlot, index) => (
            <TimeSlotGrid 
              key={timeSlot} 
              timeSlot={timeSlot} 
              tickets={getTicketsForTimeSlot(timeSlot)} 
            />
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default OnlineWaitingRoom;