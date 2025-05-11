import { Box, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const TicketCard = ({ ticket, onDragStart, onDragEnd }) => {
    const { t } = useTranslation(['waiting-room']);
    const statusStyles = {
      done: { bg: '#e8f5e9', color: '#2e7d32', label: t('done')},
      processing: { bg: '#fff3e0', color: '#e65100', label: t('processing') },
      undone: { bg: '#ffebee', color: '#c62828', label: t('unDone') }
    };
  
    const style = statusStyles[ticket.status] || statusStyles.undone;
  
    return (
      <Box 
        draggable
        onDragStart={(e) => onDragStart(e, ticket)}
        onDragEnd={onDragEnd}
        sx={{ 
          mb: 1,
          p: 1, 
          borderRadius: 1,
          backgroundColor: style.bg,
          borderLeft: `4px solid ${style.color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          '&:hover': {
            opacity: 0.8,
          },
          '&:active': {
            cursor: 'grabbing',
          }
        }}
      >
        <Typography variant="body2" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          <b>{ticket.doctorName ? `${t('drTitle')} ${ticket.doctorName} -` : ''}</b> {ticket.patientName} - {ticket.id}
        </Typography>
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
  
const TimeSlotGrid = ({ timeSlot, tickets, onTicketMove }) => {
    const { t } = useTranslation(['waiting-room']);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragStart = (e, ticket) => {
      e.dataTransfer.setData('application/json', JSON.stringify(ticket));
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
      setIsDraggingOver(false);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
      setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
    
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
    
      try {
        const ticket = JSON.parse(data);
        if (onTicketMove) {
          onTicketMove(ticket, timeSlot);
        }
      } catch (error) {
        console.error('Error handling drop:', error);
      }
    };

    return(
      <Grid 
        item 
        xs={3} 
        sx={{ 
          borderRight: '1px solid #e0e0e0', 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: isDraggingOver ? '#f5f5f5' : 'transparent',
          transition: 'background-color 0.2s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography>{timeSlot}</Typography>
        </Box>
        <Box sx={{ p: 2, minHeight: 150, borderTop: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))
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