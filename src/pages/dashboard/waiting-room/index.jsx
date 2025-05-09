import { useTranslation } from "react-i18next";
import useOnlineWaitingRoom from "../../../modules/pages/WaittingRoomComponents/hooks/useOnlineWaitingRoom";
import { Paper, Typography, Grid, Box } from "@mui/material";
import moment from "moment";
import { CURRENT_DATE } from "../../../lib/constants";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
import { Helmet } from "react-helmet";
import TimeSlotGrid from "../../../modules/pages/WaittingRoomComponents/TimeSlotGrid";
import { useState, useEffect } from "react";

const DashboardWaitingRoom = () => {
    const { t } = useTranslation(['waiting-room']);
    const { schedules, loading, error, updateTimeSlot } = useOnlineWaitingRoom();
    const [ticketsByTimeSlot, setTicketsByTimeSlot] = useState({});
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

    useEffect(() => {
      if (schedules) {
        const initialTickets = {};
        timeSlots.forEach(timeSlot => {
          initialTickets[timeSlot] = getTicketsForTimeSlot(timeSlot);
        });
        setTicketsByTimeSlot(initialTickets);
      }
    }, [schedules]);

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

    const handleTicketMove = async (ticket, newTimeSlot) => {
      // Store the previous state to revert if needed
      const previousState = { ...ticketsByTimeSlot };
      
      // Update UI immediately
      setTicketsByTimeSlot(prevTickets => {
        const newTickets = { ...prevTickets };
        Object.keys(newTickets).forEach(slot => {
          newTickets[slot] = newTickets[slot].filter(t => t.id !== ticket.id);
        });
        newTickets[newTimeSlot] = [...newTickets[newTimeSlot], ticket];
        return newTickets;
      });

      const [newStartTime, newEndTime] = newTimeSlot.split('-');
      try {
        const result = await updateTimeSlot(ticket.id, newStartTime, newEndTime);
        // If user cancels, revert the state
        if (!result) {
          setTicketsByTimeSlot(previousState);
        }
      } catch (err) {
        console.error('Update Firestore failed:', err);
        // If there's an error, revert the state
        setTicketsByTimeSlot(previousState);
      }
    };
    if (loading) 
      return(
    <Box>
      <Paper elevation={3}>
      <Box sx={{ p: 2, bgcolor: '#1976d2', color: '#fff', textAlign: 'center' }}>
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
    </Box>
    )  
  
    if (error) return <div>
      Error: {error}
    </div>;
  
    return (
      <Box>
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
                tickets={ticketsByTimeSlot[timeSlot] || []} 
                onTicketMove={handleTicketMove}
              />
            ))}
          </Grid>
  
          <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('afternoon')}</Box>
          <Grid container>
            {timeSlots.slice(4).map((timeSlot, index) => (
              <TimeSlotGrid 
                key={timeSlot} 
                timeSlot={timeSlot} 
                tickets={ticketsByTimeSlot[timeSlot] || []} 
                onTicketMove={handleTicketMove}
              />
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  };

export default DashboardWaitingRoom;