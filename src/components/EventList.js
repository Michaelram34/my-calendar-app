import React, { useState } from 'react';
import './EventList.css';

function EventList({ dateKey, events, addEvent }) {
  const [title, setTitle] = useState('');

  if (!dateKey) {
    return <div className="event-list">Select a day to see events</div>;
  }

  const eventItems = events[dateKey] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addEvent(dateKey, title.trim());
      setTitle('');
    }
  };

  return (
    <div className="event-list">
      <h3>Events on {dateKey}</h3>
      <ul>
        {eventItems.map((evt, idx) => (
          <li key={idx}>{evt}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          placeholder="New event"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default EventList;
