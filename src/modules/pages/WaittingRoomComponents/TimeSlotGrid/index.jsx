import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

export default TimeSlotGrid;