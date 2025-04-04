import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Felipe Barbosa on the page', () => {
  render(<App />);
  const nameElement = screen.getByText(/Barbosa/i);
  expect(nameElement).toBeInTheDocument();
});