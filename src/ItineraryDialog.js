import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function ItineraryDialog({ open, onClose, events = [] }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const printRef = useRef(null);

  const filtered = events.filter(ev => {
    const d = new Date(ev.dateTime);
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(23,59,59,999);
    return d >= start && d <= end;
  }).sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));

  const handlePrint = () => {
    if (!printRef.current) return;
    const wnd = window.open('', '_blank');
    if (!wnd) return;
    wnd.document.write(
      `<html><head><title>Itinerary</title></head><body>${printRef.current.innerHTML}</body></html>`
    );
    wnd.document.close();
    wnd.focus();
    wnd.print();
    wnd.close();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Itinerary</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(v) => v && setStartDate(v)}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(v) => v && setEndDate(v)}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
          </Box>
        </LocalizationProvider>
        <Box ref={printRef}>
          {filtered.length === 0 && (
            <Typography variant="body2">No events</Typography>
          )}
          {filtered.map(ev => (
            <Box key={ev.id} sx={{ mb: 1 }}>
              <Typography variant="subtitle1">{ev.title}</Typography>
              <Typography variant="body2">
                {new Date(ev.dateTime).toLocaleString()}
                {ev.location ? ` - ${ev.location}` : ''}
              </Typography>
              {ev.description && (
                <Typography variant="body2">{ev.description}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint} disabled={filtered.length === 0}>
          Download PDF
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
