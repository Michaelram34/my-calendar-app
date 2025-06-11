import React, { useState, useEffect } from 'react';
import CalendarGrid from './components/CalendarGrid';
import EventList from './components/EventList';
import './App.css';

function App() {
  const today = new Date();
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('calendarEvents');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (dateKey, title) => {
    setEvents((prev) => {
      const items = prev[dateKey] ? [...prev[dateKey], title] : [title];
      return { ...prev, [dateKey]: items };
    });
  };

  return (
    <div className="App">
      <h1>My Calendar</h1>
      <CalendarGrid
        month={month}
        year={year}
        events={events}
        onSelectDate={setSelectedDate}
      />
      <EventList dateKey={selectedDate} events={events} addEvent={addEvent} />
    </div>
  );
}

export default App;
