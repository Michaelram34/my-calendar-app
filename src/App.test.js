import { render, screen } from '@testing-library/react';
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
    dateTime: today.toISOString()
  };
  window.localStorage.setItem('events', JSON.stringify([event]));
  render(<App />);
  const dayCell = screen.getByTestId(`day-${today.getDate()}`);
  expect(dayCell).toHaveAttribute('data-has-events', 'true');
  window.localStorage.removeItem('events');
});

