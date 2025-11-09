import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import RegistrationPage from '../../../pages/auth/RegistrationPage';
import authReducer from '../../../store/auth/authSlice';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegistrationPage', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    mockNavigate.mockClear();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <RegistrationPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render registration form with all fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/home city/i)).toBeInTheDocument();
    const submitButtons = screen.getAllByRole('button', { name: /sign up/i });
    expect(submitButtons.length).toBeGreaterThan(0);
  });

  it('should show validation error for invalid email', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    // Get the submit button (first one is the main form submit, second is Google sign-in)
    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password missing uppercase', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];

    fireEvent.change(passwordInput, { target: { value: 'lowercase123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/uppercase letter/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password missing number', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];

    fireEvent.change(passwordInput, { target: { value: 'Password!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/contain a number/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password missing special character', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/special character/i)).toBeInTheDocument();
    });
  });

  it('should show password strength indicator for weak password', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    fireEvent.change(passwordInput, { target: { value: 'pass' } });

    expect(screen.getByText(/weak/i)).toBeInTheDocument();
  });

  it('should show password strength indicator for medium password', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    fireEvent.change(passwordInput, { target: { value: 'Password1' } });

    expect(screen.getByText(/medium/i)).toBeInTheDocument();
  });

  it('should show password strength indicator for strong password', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('should show validation errors for all empty fields', async () => {
    renderComponent();

    const submitButton = screen.getAllByRole('button', { name: /sign up/i })[0];
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/display name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/home city is required/i)).toBeInTheDocument();
    });
  });

  it('should have link to login page', () => {
    renderComponent();

    const loginLink = screen.getByText(/already have an account/i);
    expect(loginLink).toBeInTheDocument();
  });
});
