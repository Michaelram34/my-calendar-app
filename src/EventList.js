import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function EventList({ events, onEdit, onDelete }) {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Events
      </Typography>
      <Box
        sx={{
          maxHeight: '70vh',
          overflow: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 1
        }}
      >
        {events.length === 0 && (
          <Typography variant="body2" align="center">No events</Typography>
        )}
        {events.map((ev) => (
          <Paper
            key={ev.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              height: 60,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
            onClick={() => onEdit && onEdit(ev)}
          >
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(ev.id);
              }}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <Delete fontSize="small" />
            </IconButton>
            <Typography variant="subtitle1">{ev.title}</Typography>
            <Typography variant="body2">
              {new Date(ev.dateTime).toLocaleString()}
              {ev.duration ? ` - ${ev.duration} min` : ''}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
