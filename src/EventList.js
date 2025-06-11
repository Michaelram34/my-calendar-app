import React from 'react';
import { Box, List, ListItem, Typography, IconButton, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function EventList({ events, onEdit, onDelete }) {
  return (
    <Paper sx={{ width: 300, p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Events
      </Typography>
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {events.length === 0 && (
          <ListItem>
            <Typography variant="body2">No events</Typography>
          </ListItem>
        )}
        {events.map((ev) => (
          <ListItem
            key={ev.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit && onEdit(ev)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete && onDelete(ev.id)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
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
    </Paper>
  );
}
