import React from 'react';
import { Box, List, ListItemButton, Typography } from '@mui/material';

export default function EventList({ events, onEdit }) {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Events
      </Typography>
      <List sx={{ maxHeight: '70vh', overflow: 'auto', p: 0 }}>
        {events.length === 0 && (
          <ListItemButton disabled>
            <Typography variant="body2">No events</Typography>
          </ListItemButton>
        )}
        {events.map((ev) => (
          <ListItemButton key={ev.id} onClick={() => onEdit && onEdit(ev)}>
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
