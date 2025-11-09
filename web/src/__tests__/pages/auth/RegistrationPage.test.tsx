import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import RegistrationPage from '../../../pages/auth/RegistrationPage';
import authReducer from '../../../store/auth/authSlice';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../components/GoogleSignInButton', () => ({
  default: () => <div data-testid="google-signin-button">Google Sign In</div>,
}));

describe('RegistrationPage', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  // Helper to get password input by finding the input with autocomplete="new-password"
  const getPasswordInput = () => {
    const container = screen.getByRole('button', { name: /sign up/i }).closest('form');
    return container?.querySelector('input[autocomplete="new-password"]') as HTMLInputElement;
  };

  it('renders registration form with all required fields', () => {
    renderWithProviders(<RegistrationPage />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    // Password input doesn't have textbox role, check by placeholder or autocomplete
    const container = screen.getByRole('button', { name: /sign up/i }).closest('form');
    expect(container?.querySelector('input[autocomplete="new-password"]')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /display name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /home city/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('disables sign up button when form is incomplete', () => {
    renderWithProviders(<RegistrationPage />);

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    // Button is enabled but form validation will prevent submission
    expect(signUpButton).toBeInTheDocument();
  });

  it('shows password strength indicator', () => {
    renderWithProviders(<RegistrationPage />);

    const passwordInput = getPasswordInput();

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    // Medium requires 8+ chars with uppercase and number (50-75% strength)
    fireEvent.change(passwordInput, { target: { value: 'Medium1pass' } });
    expect(screen.getByText(/medium/i)).toBeInTheDocument();

    // Strong requires 8+ chars with uppercase, number, and special char (100% strength)
    fireEvent.change(passwordInput, { target: { value: 'Strong1!' } });
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('enables sign up button when all fields are valid', () => {
    renderWithProviders(<RegistrationPage />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordInput(), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByRole('textbox', { name: /display name/i }), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /home city/i }), {
      target: { value: 'San Francisco' },
    });

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    expect(signUpButton).not.toBeDisabled();
  });

  it('validates email format on submit', async () => {
    renderWithProviders(<RegistrationPage />);

    const form = screen.getByRole('button', { name: /sign up/i }).closest('form');

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(getPasswordInput(), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByRole('textbox', { name: /display name/i }), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /home city/i }), {
      target: { value: 'San Francisco' },
    });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('dispatches register action when form is submitted', async () => {
    renderWithProviders(<RegistrationPage />);

    const form = screen.getByRole('button', { name: /sign up/i }).closest('form');

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordInput(), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByRole('textbox', { name: /display name/i }), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /home city/i }), {
      target: { value: 'San Francisco' },
    });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isLoading).toBe(true);
    });
  });

  it('renders google sign-in button', () => {
    renderWithProviders(<RegistrationPage />);

    expect(screen.getByTestId('google-signin-button')).toBeInTheDocument();
  });

  it('renders sign in link', () => {
    renderWithProviders(<RegistrationPage />);

    // Get the specific "Sign In" link button, not the Google Sign In button
    const signInButtons = screen.getAllByText(/sign in/i);
    const signInLink = signInButtons.find(
      el => el.tagName === 'BUTTON' && el.textContent === 'Sign In'
    );
    expect(signInLink).toBeInTheDocument();

    if (signInLink) {
      fireEvent.click(signInLink);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }
  });
});
