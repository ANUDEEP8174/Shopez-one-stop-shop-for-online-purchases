import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Navbar component', () => {
  render(<App />);
  const navbar = screen.getByRole('navigation'); // assuming <nav> used in Navbar
  expect(navbar).toBeInTheDocument();
});
