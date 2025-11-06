import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });

  it('displays the count button', () => {
    render(<App />);
    expect(screen.getByRole('button')).toHaveTextContent('count is 0');
  });

  it('shows the edit instruction', () => {
    render(<App />);
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });
});
