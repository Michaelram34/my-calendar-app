import React from 'react';
import { Drawer, Box, Typography, List, ListItem } from '@mui/material';

export default function DateSidebar({ open, date, events }) {
  const formatted = date ? date.toDateString() : '';
  return (
    <Drawer
      anchor="left"
      open={open}
      variant="persistent"
      PaperProps={{
        sx: {
          width: 250,
          top: '80px',
          height: 'calc(100% - 80px)'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {formatted}
        </Typography>
        <List>
          {events.length === 0 && (
            <ListItem>
              <Typography variant="body2">No events</Typography>
            </ListItem>
          )}
          {events.map((ev) => (
            <ListItem key={ev.id} sx={{ display: 'block', py: 1 }}>
              <Typography variant="subtitle1">{ev.title}</Typography>
              <Typography variant="body2">
                {new Date(ev.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
