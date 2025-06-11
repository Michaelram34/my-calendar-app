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

