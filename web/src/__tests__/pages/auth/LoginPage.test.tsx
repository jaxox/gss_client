import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
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

describe('LoginPage', () => {
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
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render login form with email and password fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { selector: 'input' })).toBeInTheDocument();
  });

  it('should render sign in button', () => {
    renderComponent();

    const signInButtons = screen.getAllByRole('button', { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  it('should render remember me checkbox', () => {
    renderComponent();

    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  });

  it('should render forgot password link', () => {
    renderComponent();

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should toggle remember me checkbox', () => {
    renderComponent();

    const rememberMeCheckbox = screen.getByLabelText(/remember me/i) as HTMLInputElement;

    expect(rememberMeCheckbox.checked).toBe(false);

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.checked).toBe(true);

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox.checked).toBe(false);
  });

  it('should have link to registration page', () => {
    renderComponent();

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password', {
      selector: 'input',
    }) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should allow input in form fields', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password', {
      selector: 'input',
    }) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('Password123!');
  });

  it('should have Google sign-in button', () => {
    renderComponent();

    const googleButton = screen.getByText(/sign in with google/i);
    expect(googleButton).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    renderComponent();

    const submitButton = screen.getAllByRole('button', {
      name: /sign in/i,
    })[0] as HTMLButtonElement;
    // Initially form is empty, so button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form has valid inputs', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password', { selector: 'input' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const submitButton = screen.getAllByRole('button', {
      name: /sign in/i,
    })[0] as HTMLButtonElement;
    expect(submitButton).not.toBeDisabled();
  });
});
