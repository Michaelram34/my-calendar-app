import './App.css';
import Calendar from './Calendar';
import EventManager from './EventManager';
import EventList from './EventList';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper
} from '@mui/material';
import { useState, useEffect } from 'react';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setSelectedDate(null);
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <>
      <AppBar position="fixed" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Calendar
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="App">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 4 }}>
          <Paper sx={{ p: 2, flexGrow: 1 }}>
            <Calendar onDateClick={handleDateClick} />
          </Paper>
          <Paper sx={{ p: 2, width: 320 }}>
            <EventList events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
          </Paper>
        </Box>
        <EventManager
          open={dialogOpen}
          onClose={handleClose}
          defaultDate={selectedDate}
          events={events}
          setEvents={setEvents}
          editingEvent={editingEvent}
        />
      </Container>
    </>
  );
}

export default App;
