import { Box, Container, Paper, Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import React, { useMemo } from "react";
import useOnlineWaitingRoom from "../../modules/pages/WaittingRoomComponents/hooks/useOnlineWaitingRoom";
import TimeSlotGrid from "../../modules/pages/WaittingRoomComponents/TimeSlotGrid";
import { CURRENT_DATE } from "../../lib/constants";
import moment from "moment";
import SkeletonListLineItem from "../../modules/common/components/skeletons/listLineItem";


const OnlineWaitingRoom = () => {
  const { t } = useTranslation(['waiting-room']);
  const { schedules, loading, error } = useOnlineWaitingRoom();;
  if (loading) 
    return(
  <Container>
    <Paper elevation={3}>
    <Box sx={{ p: 2, bgcolor: '#1D4ED8', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h6">{t('title')} - {moment(CURRENT_DATE).format('DD/MM/YYYY')}</Typography>
        </Box>
      <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('morning')}</Box>
      <Grid container>
        <SkeletonListLineItem height="200px" width="25%" />
        <SkeletonListLineItem height="200px" width="25%"/>
        <SkeletonListLineItem height="200px" width="25%"/>
        <SkeletonListLineItem height="200px" width="25%"/>
      </Grid>

      <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('afternoon')}</Box>
      <Grid container>
        <SkeletonListLineItem height="200px" width="25%"/>
        <SkeletonListLineItem height="200px" width="25%"/>
        <SkeletonListLineItem height="200px" width="25%"/>
        <SkeletonListLineItem height="200px" width="25%"/>
      </Grid>
    </Paper>
  </Container>
  )  

  if (error) return <div>
    Error: {error}
  </div>;

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
        id: slot.appointment_info.id,
        patientName: slot.patient_info.name,
        status: slot.status,
        doctorName: slot.appointment_info.doctor_info.doctor_name
      }))
    );
    return tickets;
  };

  return (
    <Container>
      <Helmet>
        <title>{t('title')} </title>
      </Helmet>
      
      <Paper elevation={3}>
        <Box sx={{ p: 2, bgcolor: '#1976d2', color: '#fff', textAlign: 'center' }}>
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