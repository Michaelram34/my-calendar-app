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

test('week view shows custom range', () => {
  render(<App initialDate={new Date('2025-06-06')} />);
  fireEvent.click(screen.getByRole('button', { name: /week/i }));
  expect(screen.getByTestId('month-label').textContent).toBe('June 8, 2025 - June 14, 2025');
});

test('day view shows custom date', () => {
  render(<App initialDate={new Date('2025-06-06')} />);
  fireEvent.click(screen.getByRole('button', { name: /day/i }));
  expect(screen.getByTestId('month-label').textContent).toBe('June 6, 2025');
});

