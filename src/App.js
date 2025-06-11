import './App.css';
import Calendar from './Calendar';
import EventManager from './EventManager';
import { Container } from '@mui/material';
import { useState } from 'react';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container className="App">
      <Calendar onDateClick={handleDateClick} />
      <EventManager
        open={dialogOpen}
        onClose={handleClose}
        defaultDate={selectedDate}
      />
    </Container>
  );
}

export default App;
