import './App.css';
import Calendar from './Calendar';
import EventManager from './EventManager';
import EventList from './EventList';
import { Container, Box } from '@mui/material';
import { useState, useEffect } from 'react';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container className="App">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 4 }}>
        <Calendar onDateClick={handleDateClick} />
        <EventList events={events} />
      </Box>
      <EventManager
        open={dialogOpen}
        onClose={handleClose}
        defaultDate={selectedDate}
        events={events}
        setEvents={setEvents}
      />
    </Container>
  );
}

export default App;
