import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // App renders with LoginPage by default (redirects / to /login)
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('displays login form elements', () => {
    render(<App />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows sign in button', () => {
    render(<App />);
    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThan(0);
  });
});
