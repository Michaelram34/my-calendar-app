import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function EventManager({ open, onClose, defaultDate }) {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : [];
  });

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (open && defaultDate) {
      setDateTime(new Date(defaultDate));
    }
  }, [open, defaultDate]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const resetForm = () => {
    setTitle('');
    setDateTime(new Date());
    setDuration('');
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const event = {
      id: editingId || Date.now(),
      title,
      dateTime: dateTime ? dateTime.toISOString() : new Date().toISOString(),
      duration
    };
    if (editingId) {
      setEvents(events.map(ev => (ev.id === editingId ? event : ev)));
    } else {
      setEvents([...events, event]);
    }
    resetForm();
  };

  const handleEdit = (id) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    setTitle(ev.title);
    setDateTime(new Date(ev.dateTime));
    setDuration(ev.duration || '');
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const eventsForDay = defaultDate
    ? events.filter(ev =>
        isSameDay(new Date(ev.dateTime), new Date(defaultDate))
      )
    : events;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        Manage Events{defaultDate ? ` - ${new Date(defaultDate).toDateString()}` : ''}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Date & Time"
            value={dateTime}
            onChange={(newValue) => setDateTime(newValue)}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button type="submit" variant="contained">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </Box>
        <List>
          {eventsForDay.map((ev) => (
            <ListItem
              key={ev.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(ev.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(ev.id)}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
