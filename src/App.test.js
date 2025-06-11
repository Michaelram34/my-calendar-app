import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calendar title', () => {
  render(<App />);
  const heading = screen.getByText(/my calendar/i);
  expect(heading).toBeInTheDocument();
});
