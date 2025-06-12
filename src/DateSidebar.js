import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

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
          height: 'calc(100% - 80px)',
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Enhanced Date Display */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'primary.main' }}
          gutterBottom
        >
          {formatted}
        </Typography>

        <List>
          {/* Friendly No Events Message */}
          {events.length === 0 && (
            <ListItem>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No events for this date
              </Typography>
            </ListItem>
          )}

          {/* Events with Icon */}
          {events.map((ev) => (
            <ListItem key={ev.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="subtitle1">{ev.title}</Typography>
                <Typography variant="body2">
                  {new Date(ev.dateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
