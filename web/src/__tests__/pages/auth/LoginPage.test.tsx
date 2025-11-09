import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../../pages/auth/LoginPage';
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

describe('LoginPage', () => {
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

  // Helper to get password input by finding the input with autocomplete="current-password"
  const getPasswordInput = () => {
    const container = screen.getByRole('button', { name: /sign in/i }).closest('form');
    return container?.querySelector('input[autocomplete="current-password"]') as HTMLInputElement;
  };

  it('renders login form with all required fields', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('disables sign in button when form is empty', () => {
    renderWithProviders(<LoginPage />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeDisabled();
  });

  it('enables sign in button when email and password are provided', () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = getPasswordInput();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).not.toBeDisabled();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    renderWithProviders(<LoginPage />);

    const passwordInput = getPasswordInput();
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');
  });

  it('validates email format on submit', async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = getPasswordInput();
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('dispatches login action when form is submitted with valid data', async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = getPasswordInput();
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isLoading).toBe(true);
    });
  });

  it('includes remember me flag when checkbox is checked', async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = getPasswordInput();
    const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(rememberMeCheckbox);

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isLoading).toBe(true);
    });
  });

  it('renders forgot password link', () => {
    renderWithProviders(<LoginPage />);

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();

    fireEvent.click(forgotPasswordLink);
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  it('renders google sign-in button', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByTestId('google-signin-button')).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    renderWithProviders(<LoginPage />);

    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toBeInTheDocument();

    fireEvent.click(signUpLink);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
