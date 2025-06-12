import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders calendar header', () => {
  render(<App />);
  const header = screen.getByTestId('month-label');
  expect(header).toBeInTheDocument();
});

test("highlights today's date", () => {
  render(<App />);
  const today = new Date();
  const dayCell = screen.getByTestId(`day-${today.getDate()}`);
  expect(dayCell).toHaveAttribute('data-today', 'true');
});

test('shows indicator on day with events', () => {
  const today = new Date();
  const event = {
    id: 1,
    title: 'Test',
    dateTime: today.toISOString(),
    color: '#ff0000'
  };
  window.localStorage.setItem('events', JSON.stringify([event]));
  render(<App />);
  const dayCell = screen.getByTestId(`day-${today.getDate()}`);
  expect(dayCell).toHaveAttribute('data-has-events', 'true');
  const dot = screen.getByTestId(`event-dot-${today.getDate()}-0`);
  expect(dot).toHaveStyle(`background-color: ${event.color}`);
  window.localStorage.removeItem('events');
});

test('today button resets the calendar', () => {
  render(<App />);
  const nextBtn = screen.getByTestId('next-month');
  fireEvent.click(nextBtn);
  const todayLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  expect(screen.getByTestId('month-label').textContent).not.toBe(todayLabel);
  const todayBtn = screen.getByTestId('today-button');
  fireEvent.click(todayBtn);
  expect(screen.getByTestId('month-label').textContent).toBe(todayLabel);
});

test('highlights date on event hover', () => {
  const today = new Date();
  const event = {
    id: 2,
    title: 'Hover Test',
    dateTime: today.toISOString(),
    color: '#00ff00'
  };
  window.localStorage.setItem('events', JSON.stringify([event]));
  render(<App />);
  const dayCell = screen.getByTestId(`day-${today.getDate()}`);
  const eventItem = screen.getByText('Hover Test').closest('button');
  expect(dayCell).not.toHaveAttribute('data-hovered', 'true');
  fireEvent.mouseOver(eventItem);
  expect(dayCell).toHaveAttribute('data-hovered', 'true');
  fireEvent.mouseLeave(eventItem);
  expect(dayCell).not.toHaveAttribute('data-hovered', 'true');
  window.localStorage.removeItem('events');
});

test('event list matches visible calendar range', () => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const events = [
    { id: 3, title: 'This Month', dateTime: today.toISOString() },
    { id: 4, title: 'Next Month', dateTime: nextMonth.toISOString() }
  ];
  window.localStorage.setItem('events', JSON.stringify(events));
  render(<App />);
  expect(screen.getByText('This Month')).toBeInTheDocument();
  expect(screen.queryByText('Next Month')).toBeNull();
  const nextBtn = screen.getByTestId('next-month');
  fireEvent.click(nextBtn);
  expect(screen.queryByText('This Month')).toBeNull();
  expect(screen.getByText('Next Month')).toBeInTheDocument();
  window.localStorage.removeItem('events');
});

test('week view includes Saturday events', () => {
  const today = new Date();
  const saturday = new Date(today);
  saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
  const events = [
    { id: 5, title: 'Saturday Event', dateTime: saturday.toISOString() }
  ];
  window.localStorage.setItem('events', JSON.stringify(events));
  render(<App />);
  const weekBtn = screen.getByRole('button', { name: /week/i });
  fireEvent.click(weekBtn);
  expect(screen.getByText('Saturday Event')).toBeInTheDocument();
  window.localStorage.removeItem('events');
});

