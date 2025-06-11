import React from 'react';
import { Box, List, ListItemButton, Typography } from '@mui/material';

export default function EventList({ events, onEdit }) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Events
      </Typography>
      <List sx={{ maxHeight: '70vh', overflow: 'auto', p: 0 }}>
        {sortedEvents.length === 0 && (
          <ListItemButton disabled sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
            <Typography variant="body2">No events</Typography>
          </ListItemButton>
        )}
        {sortedEvents.map((ev) => (
          <ListItemButton
            key={ev.id}
            onClick={() => onEdit && onEdit(ev)}
            sx={{
              mb: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              transition: 'background-color 0.2s, border-color 0.2s, transform 0.1s',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: ev.color || 'secondary.main', mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{ev.title}</Typography>
              <Typography variant="body2">
                {new Date(ev.dateTime).toLocaleString()}
                {ev.duration ? ` - ${ev.duration} min` : ''}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
