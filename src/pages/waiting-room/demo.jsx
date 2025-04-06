import { Box, Container, Paper, Typography, Grid, Divider, Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import React from "react";

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

  // Mock examination tickets data (to be replaced with real data)
  const mockTickets = {
    "08:00-09:00": [], 
    "09:00-10:00": [{ id: 1, patientName: "Nguyễn Văn A" },{ id: 6, patientName: "Nguyễn Văn 9" }], 
    "10:00-11:00": [{ id: 2, patientName: "Trần Thị B" }], 
    "11:00-12:00": [],
    "13:00-14:00": [{ id: 3, patientName: "Lê Văn C" }], 
    "14:00-15:00": [], 
    "15:00-16:00": [{ id: 4, patientName: "Phạm Văn D" }], 
    "16:00-17:00": []
  };

  return (
    <Container>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      
      <Paper elevation={3} sx={{ mt: 4, overflow: 'hidden' }}>
        {/* Header */}
        <Box className="ou-waiting-room-header">
          <Typography variant="h6">{t('title')}</Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', backgroundColor: '#f9f9f9', padding: '10px' }}>{t('morning')}</Box>

        {/* Morning slots */}
        <Grid container>
          {timeSlots.slice(0, 4).map((timeSlot, index) => (
            <Grid item xs={3} key={index} sx={{ 
              borderRight: index < 3 ? '1px solid #e0e0e0' : 'none',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Box sx={{ 
                p: 2,
                textAlign: 'center',
              }}>
                <Typography>{timeSlot}</Typography>
              </Box>
              
              {/* Ticket container for each time slot */}
              <Box sx={{ 
                p: 2, 
                minHeight: '150px',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5'
              }}>
                {mockTickets[timeSlot].length > 0 ? (
                  mockTickets[timeSlot].map(ticket => (
                    <Card key={ticket.id} sx={{ mb: 1, p: 1 }}>
                      <Typography variant="body2">{ticket.patientName} - {ticket.id}</Typography>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 2 }}>
                    {t('noAppointment')}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', backgroundColor: '#f9f9f9', padding: '10px' }}>{t('afternoon')}</Box>

        {/* Afternoon slots */}
        <Grid container>
          {timeSlots.slice(4).map((timeSlot, index) => (
            <Grid item xs={3} key={index} sx={{ 
              borderRight: index < 3 ? '1px solid #e0e0e0' : 'none',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Box sx={{ 
                p: 2,
                textAlign: 'center',
              }}>
                <Typography>{timeSlot}</Typography>
              </Box>
              
              {/* Ticket container for each time slot */}
              <Box sx={{ 
                p: 2, 
                minHeight: '150px',
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5'
              }}>
                {mockTickets[timeSlot].length > 0 ? (
                  mockTickets[timeSlot].map(ticket => (
                    <Card key={ticket.id} sx={{ mb: 1, p: 1 }}>
                      <Typography variant="body2">{ticket.patientName} - {ticket.id}</Typography>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', pt: 2 }}>
                    {t('noAppointment')}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default OnlineWaitingRoom;