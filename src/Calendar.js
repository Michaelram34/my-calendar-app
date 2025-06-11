import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let day = 1 - firstDay;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (day > 0 && day <= daysInMonth) {
        week.push(day);
      } else {
        week.push(null);
      }
      day++;
    }
    weeks.push(week);
  }
  return weeks;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = generateCalendar(year, month);
  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthLabel = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth} data-testid="prev-month"><ChevronLeft /></IconButton>
        <Typography variant="h6" component="div" data-testid="month-label">{monthLabel}</Typography>
        <IconButton onClick={handleNextMonth} data-testid="next-month"><ChevronRight /></IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {daysOfWeek.map(day => (
          <Typography key={day} variant="subtitle2" align="center" fontWeight="bold">
            {day}
          </Typography>
        ))}
        {weeks.flat().map((day, idx) => {
          const isToday =
            day &&
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          return (
            <Box
              key={idx}
              sx={{
                border: 1,
                borderColor: 'divider',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: day ? 'pointer' : 'default',
                borderRadius: 1,
                backgroundColor: isToday ? 'primary.main' : undefined,
                color: isToday ? 'primary.contrastText' : undefined,
                '&:hover': {
                  backgroundColor: day ? 'action.hover' : 'transparent'
                }
              }}
              onClick={() => day && onDateClick && onDateClick(new Date(year, month, day))}
              data-testid={day ? `day-${day}` : undefined}
              data-today={isToday ? 'true' : undefined}
            >
              {day || ''}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
