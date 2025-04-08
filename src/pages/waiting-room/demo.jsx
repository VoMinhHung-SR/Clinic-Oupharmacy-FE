import { Box, Container, Paper, Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import React from "react";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TicketCard = ({ ticket }) => {
  const { t } = useTranslation(['waiting-room']);
  const statusStyles = {
    done: { bg: '#e8f5e9', color: '#2e7d32', label: t('done')},
    processing: { bg: '#fff3e0', color: '#e65100', label: t('processing') },
    undone: { bg: '#ffebee', color: '#c62828', label: t('unDone') }
  };

  const style = statusStyles[ticket.status] || statusStyles.undone;

  return (
    <Box 
      sx={{ 
        mb: 1,
        p: 1, 
        borderRadius: 1,
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.color}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography variant="body2">{ticket.patientName} - {ticket.id}</Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'white',
          bgcolor: style.color,
          px: 1,
          py: 0.5,
          borderRadius: 12,
        }}
      >
        {style.label}
      </Typography>
    </Box>
  );
};

const TimeSlotGrid = ({ timeSlot, tickets }) => {
  const { t } = useTranslation(['waiting-room']);
  return(
    <Grid item xs={3} sx={{ borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>{timeSlot}</Typography>
      </Box>
      <Box sx={{ p: 2, minHeight: 150, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
        {tickets.length > 0 ? (
          tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 2 }}>
            {t('noAppointment')}
          </Typography>
        )}
      </Box>
    </Grid>
  )
}

const OnlineWaitingRoom = () => {
  const { t } = useTranslation(['waiting-room']);
  
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

  // Mock examination tickets data with status
  const mockTickets = {
    "08:00-09:00": [], 
    "09:00-10:00": [
      { id: 1, patientName: "Nguyễn Văn A", status: 'done' },
      { id: 6, patientName: "Nguyễn Văn 9", status: 'processing' }
    ], 
    "10:00-11:00": [{ id: 2, patientName: "Trần Thị B", status: 'undone' }], 
    "11:00-12:00": [],
    "13:00-14:00": [{ id: 3, patientName: "Lê Văn C", status: 'processing' }], 
    "14:00-15:00": [], 
    "15:00-16:00": [{ id: 4, patientName: "Phạm Văn D", status: 'undone' }], 
    "16:00-17:00": []
  };

  return (
    <Container>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      
      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 2, bgcolor: '#1D4ED8', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h6">{t('title')}</Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('morning')}</Box>
        <Grid container>
          {timeSlots.slice(0, 4).map((timeSlot, index) => (
            <TimeSlotGrid 
              key={timeSlot} 
              timeSlot={timeSlot} 
              tickets={mockTickets[timeSlot]} 
            />
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', bgcolor: '#f9f9f9', p: '10px' }}>{t('afternoon')}</Box>
        <Grid container>
          {timeSlots.slice(4).map((timeSlot, index) => (
            <TimeSlotGrid 
              key={timeSlot} 
              timeSlot={timeSlot} 
              tickets={mockTickets[timeSlot]} 
            />
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default OnlineWaitingRoom;