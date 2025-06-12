import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from '@mui/material';
import { ChevronLeft, ChevronRight, Today as TodayIcon } from '@mui/icons-material';

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

function generateWeek(date) {
  const start = new Date(date);
  start.setDate(date.getDate() - start.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function Calendar({ onDateClick, events = [], hoveredDate, onRangeChange, onDateHover }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month | week | day
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = generateCalendar(year, month);
  const weekDays = generateWeek(currentDate);
  const today = new Date();

  useEffect(() => {
    if (!onRangeChange) return;
    let start, end;
    if (view === 'month') {
      start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (view === 'week') {
      start = new Date(currentDate);
      start.setDate(currentDate.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      start = new Date(currentDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(currentDate);
      end.setHours(23, 59, 59, 999);
    }
    onRangeChange({ start, end, view });
  }, [currentDate, view, onRangeChange]);

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (view === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  let monthLabel;
  if (view === 'month') {
    monthLabel = currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  } else if (view === 'week') {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    monthLabel = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  } else {
    monthLabel = currentDate.toDateString();
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <IconButton onClick={handlePrev} data-testid="prev-month"><ChevronLeft /></IconButton>
          <IconButton onClick={handleNext} data-testid="next-month"><ChevronRight /></IconButton>
        </Box>
        <Typography variant="h6" component="div" data-testid="month-label">{monthLabel}</Typography>
        <Button
          onClick={() => setCurrentDate(new Date())}
          data-testid="today-button"
          startIcon={<TodayIcon />}
          size="small"
        >
          Today
        </Button>
      </Box>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, v) => v && setView(v)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="month">Month</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="day">Day</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${view === 'day' ? 1 : 7}, 1fr)`, gap: 1 }}>
        {(view === 'day' ? [daysOfWeek[currentDate.getDay()]] : daysOfWeek).map((day, idx) => (
          <Typography key={idx} variant="subtitle2" align="center" fontWeight="bold">
            {day}
          </Typography>
        ))}
        {(view === 'month' ? weeks.flat() : view === 'week' ? weekDays : [currentDate]).map((d, idx) => {
          const dateObj = view === 'month' ? (d ? new Date(year, month, d) : null) : d;
          const dayNumber = view === 'month' ? d : d.getDate();
          const isToday = dateObj && isSameDay(dateObj, today);
          const isHovered = dateObj && hoveredDate && isSameDay(dateObj, hoveredDate);
          const eventsForDay = dateObj ? events.filter(ev =>
            isSameDay(new Date(ev.dateTime), dateObj)
          ) : [];
          const hasEvents = eventsForDay.length > 0;
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
                cursor: dateObj ? 'pointer' : 'default',
                borderRadius: 1,
                position: 'relative',
                backgroundColor: isToday
                  ? 'primary.main'
                  : isHovered
                  ? 'action.selected'
                  : undefined,
                color: isToday ? 'primary.contrastText' : undefined,
                '&:hover': {
                  backgroundColor: dateObj ? 'action.hover' : 'transparent'
                }
              }}
              onClick={() => dateObj && onDateClick && onDateClick(dateObj)}
              onMouseEnter={() => dateObj && onDateHover && onDateHover(dateObj)}
              onMouseLeave={() => dateObj && onDateHover && onDateHover(null)}
              data-testid={dateObj ? `day-${dayNumber}` : undefined}
              data-today={isToday ? 'true' : undefined}
              data-hovered={isHovered ? 'true' : undefined}
              data-has-events={hasEvents ? 'true' : undefined}
            >
              {dayNumber || ''}
              {hasEvents && (
                <Box
                  data-testid={`events-${dayNumber}`}
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 0.5
                  }}
                >
                  {eventsForDay.slice(0,3).map((ev, i) => (
                    <Box
                      key={i}
                      data-testid={`event-dot-${dayNumber}-${i}`}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: ev.color || 'secondary.main'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
