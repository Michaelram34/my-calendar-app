import './App.css';
import Calendar from './Calendar';
import EventManager from './EventManager';
import EventList from './EventList';
import DateSidebar from './DateSidebar';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredCalendarDate, setHoveredCalendarDate] = useState(null);
  const [visibleRange, setVisibleRange] = useState({ start: null, end: null });
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

  const handleRangeChange = (range) => {
    setVisibleRange({ start: range.start, end: range.end });
  };

  const handleCalendarHover = (date) => {
    setHoveredCalendarDate(date);
    setHoveredDate(date);
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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
          <Box sx={{ flexBasis: '65%', flexGrow: 1 }}>
            <Calendar
              onDateClick={handleDateClick}
              events={events}
              hoveredDate={hoveredDate}
              onRangeChange={handleRangeChange}
              onDateHover={handleCalendarHover}
            />
          </Box>
          <Box sx={{ flexBasis: '35%' }}>
            <EventList
              events={visibleRange.start && visibleRange.end
                ? events.filter(ev => {
                    const d = new Date(ev.dateTime);
                    return d >= visibleRange.start && d <= visibleRange.end;
                  })
                : events}
              onEdit={handleEditEvent}
              onHoverDate={setHoveredDate}
            />
          </Box>
        </Box>
        <EventManager
          open={dialogOpen}
          onClose={handleClose}
          defaultDate={selectedDate}
          events={events}
          setEvents={setEvents}
          editingEvent={editingEvent}
        />
        <DateSidebar
          open={Boolean(hoveredCalendarDate)}
          date={hoveredCalendarDate}
          events={hoveredCalendarDate ? events.filter(ev => {
            const d = new Date(ev.dateTime);
            return (
              d.getFullYear() === hoveredCalendarDate.getFullYear() &&
              d.getMonth() === hoveredCalendarDate.getMonth() &&
              d.getDate() === hoveredCalendarDate.getDate()
            );
          }) : []}
        />
      </Container>
    </>
  );
}

export default App;
