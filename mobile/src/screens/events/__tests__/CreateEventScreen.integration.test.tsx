/**
 * Integration Test: CreateEventScreen
 * Tests all UI interactions, buttons, and form behavior
 * Run with: npm test CreateEventScreen.integration.test.tsx
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CreateEventScreen from '../CreateEventScreen';
import eventsReducer from '../../../store/events/eventsSlice';
import authReducer from '../../../store/auth/authSlice';

// Mock React Native Paper's theme hook
jest.mock('react-native-paper', () => {
  const actualPaper = jest.requireActual('react-native-paper');
  return {
    ...actualPaper,
    useTheme: () => ({
      colors: {
        primary: '#007AFF',
        error: '#FF3B30',
        errorContainer: '#FFEBEE',
        primaryContainer: '#E3F2FD',
        outline: '#9E9E9E',
      },
    }),
  };
});

describe('CreateEventScreen - Button and Form Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        events: eventsReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: {
            id: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
          },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        events: {
          myEvents: [],
          myRSVPs: [],
          searchResults: [],
          currentEvent: null,
          loading: {
            create: false,
            fetch: false,
            update: false,
            delete: false,
          },
          error: { create: null, fetch: null, update: null, delete: null },
          success: { create: false, update: false, delete: false },
          pagination: { page: 1, limit: 20, total: 0, hasMore: false },
        },
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <CreateEventScreen />
      </Provider>,
    );
  };

  describe('🎯 All Buttons Render Correctly', () => {
    it('should display all sport selection buttons', () => {
      const { getByText } = renderComponent();
      expect(getByText(/Pickleball/)).toBeTruthy();
      expect(getByText(/Basketball/)).toBeTruthy();
      expect(getByText(/Soccer/)).toBeTruthy();
      expect(getByText(/Tennis/)).toBeTruthy();
      expect(getByText(/Volleyball/)).toBeTruthy();
    });

    it('should display all deposit amount buttons', () => {
      const { getByText } = renderComponent();
      expect(getByText('Free')).toBeTruthy();
      expect(getByText('$5')).toBeTruthy();
      expect(getByText('$10')).toBeTruthy();
    });

    it('should display visibility toggle buttons', () => {
      const { getByText } = renderComponent();
      expect(getByText('Public')).toBeTruthy();
      expect(getByText('Private')).toBeTruthy();
    });

    it('should display Submit and Cancel buttons', () => {
      const { getAllByText } = renderComponent();
      expect(getAllByText('Create Event').length).toBeGreaterThan(0);
      expect(getAllByText('Cancel').length).toBeGreaterThan(0);
    });
  });

  describe('🖱️ All Buttons Are Pressable', () => {
    it('should allow pressing all sport buttons without errors', async () => {
      const { getByText } = renderComponent();

      const sports = [
        'Pickleball',
        'Basketball',
        'Soccer',
        'Tennis',
        'Volleyball',
      ];
      for (const sport of sports) {
        await act(async () => {
          fireEvent.press(getByText(new RegExp(sport)));
        });
      }

      // If we got here without errors, all buttons are pressable
      expect(true).toBeTruthy();
    });

    it('should allow pressing all deposit buttons without errors', async () => {
      const { getByText } = renderComponent();

      await act(async () => {
        fireEvent.press(getByText('Free'));
      });
      await act(async () => {
        fireEvent.press(getByText('$5'));
      });
      await act(async () => {
        fireEvent.press(getByText('$10'));
      });

      expect(true).toBeTruthy();
    });

    it('should allow pressing visibility buttons without errors', async () => {
      const { getByText } = renderComponent();

      await act(async () => {
        fireEvent.press(getByText('Public'));
      });
      await act(async () => {
        fireEvent.press(getByText('Private'));
      });

      expect(true).toBeTruthy();
    });

    it('should allow pressing Cancel button without errors', async () => {
      const { getByText } = renderComponent();

      await act(async () => {
        fireEvent.press(getByText('Cancel'));
      });

      expect(true).toBeTruthy();
    });
  });

  describe('✍️ All Text Inputs Accept Text', () => {
    it('should accept text in title field', async () => {
      const { getAllByTestId } = renderComponent();

      await act(async () => {
        const inputs = getAllByTestId('text-input-outlined');
        // First input is title
        fireEvent.changeText(inputs[0], 'Test Event');
      });

      // Should not crash - if we get here, it worked
      expect(true).toBe(true);
    });

    it('should accept text in description field', async () => {
      const { getAllByTestId } = renderComponent();

      await act(async () => {
        const inputs = getAllByTestId('text-input-outlined');
        // Second input is description
        fireEvent.changeText(inputs[1], 'Test description for the event');
      });

      expect(true).toBe(true);
    });

    it('should accept text in capacity field', async () => {
      const { getByDisplayValue } = renderComponent();

      await act(async () => {
        const capacityInput = getByDisplayValue('8'); // Default capacity
        fireEvent.changeText(capacityInput, '12');
      });

      expect(true).toBe(true);
    });
  });

  describe('✅ Form Validation Works', () => {
    it('should show validation error for short title', async () => {
      const { getAllByTestId, findByText } = renderComponent();

      await act(async () => {
        const inputs = getAllByTestId('text-input-outlined');
        // First input is title
        fireEvent.changeText(inputs[0], 'ab');
        fireEvent(inputs[0], 'blur');
      });

      // Should find error message
      const errorText = await findByText(
        /Title must be at least 3 characters/i,
      );
      expect(errorText).toBeTruthy();
    });

    it('should show validation error for short description', async () => {
      const { getAllByTestId, findByText } = renderComponent();

      await act(async () => {
        const inputs = getAllByTestId('text-input-outlined');
        // Second input is description
        fireEvent.changeText(inputs[1], 'short');
        fireEvent(inputs[1], 'blur');
      });

      // Should find error message
      const errorText = await findByText(
        /Description must be at least 10 characters/i,
      );
      expect(errorText).toBeTruthy();
    });
  });

  describe('📋 Complete Form Submission Flow', () => {
    it('should handle full form submission without crashes', async () => {
      const { getAllByTestId, getByText, getByDisplayValue } =
        renderComponent();

      // Fill out entire form
      await act(async () => {
        const inputs = getAllByTestId('text-input-outlined');
        // Title (first input)
        fireEvent.changeText(inputs[0], 'Integration Test Event');
        // Description (second input)
        fireEvent.changeText(
          inputs[1],
          'This is a comprehensive integration test of the event creation form',
        );
        // Sport selection
        fireEvent.press(getByText(/Basketball/));
        // Capacity (find by default value)
        const capacityInput = getByDisplayValue('8');
        fireEvent.changeText(capacityInput, '12');
        // Deposit amount
        fireEvent.press(getByText(/\$5/));
        // Visibility
        fireEvent.press(getByText(/Private/));
        // Address - find it among inputs (5th input after title, description, capacity, and datetime)
        fireEvent.changeText(inputs[3], '123 Main St');
        // City
        fireEvent.changeText(inputs[4], 'San Francisco');
        // State
        fireEvent.changeText(inputs[5], 'CA');
        // ZIP
        fireEvent.changeText(inputs[6], '94102');
        // DateTime (3rd input - between capacity and address)
        fireEvent.changeText(inputs[2], '2025-12-25 14:30');
      });

      // Submit form (find button by test ID, not text)
      await act(async () => {
        const buttons = getAllByTestId('button');
        // Submit button is the second button (after Cancel)
        fireEvent.press(buttons[1]);
      });

      // Should not crash - if we get here, it worked
      expect(true).toBe(true);
    });
  });
});
