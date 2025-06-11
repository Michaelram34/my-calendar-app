import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

export default function EventList({ events }) {
  return (
    <Box sx={{ width: 300 }}>
      <Typography variant="h6" align="center" gutterBottom>
        All Events
      </Typography>
      <List>
        {events.length === 0 && (
          <ListItem>
            <Typography variant="body2">No events</Typography>
          </ListItem>
        )}
        {events.map((ev) => (
          <ListItem key={ev.id}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{ev.title}</Typography>
              <Typography variant="body2">
                {new Date(ev.dateTime).toLocaleString()}
                {ev.duration ? ` - ${ev.duration} min` : ''}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
