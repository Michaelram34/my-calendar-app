import React, { useState, useEffect, useCallback } from 'react';
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
  DialogActions,
  MenuItem
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const COLOR_OPTIONS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Orange', value: '#FF7F00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Indigo', value: '#4B0082' },
  { name: 'Violet', value: '#8B00FF' }
];

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function EventManager({ open, onClose, defaultDate, events, setEvents, editingEvent }) {

  const createDefaultDateTime = useCallback((baseDate) => {
    const d = baseDate ? new Date(baseDate) : new Date();
    d.setHours(17, 0, 0, 0);
    return d;
  }, []);

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(createDefaultDateTime());
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (open && defaultDate) {
      setDateTime(createDefaultDateTime(defaultDate));
    }
  }, [open, defaultDate, createDefaultDateTime]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDateTime(new Date(editingEvent.dateTime));
      setDuration(editingEvent.duration || '');
      setLocation(editingEvent.location || '');
      setDescription(editingEvent.description || '');
      setColor(editingEvent.color || COLOR_OPTIONS[0].value);
      setEditingId(editingEvent.id);
    }
  }, [editingEvent]);


  const resetForm = useCallback(() => {
    setTitle('');
    setDateTime(createDefaultDateTime());
    setDuration('');
    setLocation('');
    setDescription('');
    setColor(COLOR_OPTIONS[0].value);
    setEditingId(null);
  }, [createDefaultDateTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    const event = {
      id: editingId || Date.now(),
      title,
      dateTime: dateTime ? dateTime.toISOString() : new Date().toISOString(),
      duration,
      location,
      description,
      color
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
    setLocation(ev.location || '');
    setDescription(ev.description || '');
    setColor(ev.color || COLOR_OPTIONS[0].value);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
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

  const showList = defaultDate || !editingEvent;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          <DatePicker
            label="Date"
            value={dateTime}
            onChange={(newValue) => {
              if (newValue) {
                const updated = new Date(dateTime);
                updated.setFullYear(newValue.getFullYear(), newValue.getMonth(), newValue.getDate());
                setDateTime(updated);
              }
            }}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
          <TimePicker
            label="Time"
            value={dateTime}
            onChange={(newValue) => {
              if (newValue) {
                const updated = new Date(dateTime);
                updated.setHours(newValue.getHours(), newValue.getMinutes());
                setDateTime(updated);
              }
            }}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>
          <TextField
            label="Duration (minutes)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {COLOR_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: opt.value,
                display: 'inline-block',
                mr: 1
              }} />
              {opt.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
            rows={3}
            fullWidth
          />
          <Button type="submit" variant="contained">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </Box>
        {showList && (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {eventsForDay.length === 0 && (
              <ListItem>
                <Typography variant="body2">No events</Typography>
              </ListItem>
            )}
            {eventsForDay.map((ev) => (
              <ListItem
                key={ev.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(ev.id)}>
                    <Delete />
                  </IconButton>
                }
                onClick={() => handleEdit(ev.id)}
                button
              >
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: ev.color || 'secondary.main', mr: 2 }} />
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
        )}
      </DialogContent>
      <DialogActions>
        {editingId && (
          <Button color="error" onClick={() => { handleDelete(editingId); onClose(); }}>
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
