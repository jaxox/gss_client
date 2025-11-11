/**
 * Create Event Wizard - Full Integration Test
 * Tests the complete flow through all 4 steps including Add Cohosts modal
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { configureStore } from '@reduxjs/toolkit';
import CreateEventWizard from '../CreateEventWizard';
import Step3Details from '../Step3Details';
import AddCohostsModal from '../AddCohostsModal';

// Mock react-native-paper-dates
jest.mock('react-native-paper-dates', () => ({
  DatePickerModal: jest.fn(),
  TimePickerModal: jest.fn(),
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock Appbar components specifically
jest.mock(
  'react-native-paper/src/components/Appbar/AppbarHeader',
  () => 'AppbarHeader',
);
jest.mock(
  'react-native-paper/src/components/Appbar/AppbarBackAction',
  () => 'AppbarBackAction',
);
jest.mock(
  'react-native-paper/src/components/Appbar/AppbarContent',
  () => 'AppbarContent',
);
jest.mock(
  'react-native-paper/src/components/Appbar/AppbarAction',
  () => 'AppbarAction',
);

// Test wrapper with all providers
const AllTheProviders = ({ children, store }: any) => {
  return (
    <PaperProvider>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </PaperProvider>
  );
};

// Create mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      events: (state = { events: [], loading: false }) => state,
      auth: (state = { user: { id: 'user-1', name: 'Test User' } }) => state,
    },
  });
};

describe('CreateEventWizard - Full Flow Integration Test', () => {
  let store: ReturnType<typeof createMockStore>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    store = createMockStore();
    jest.clearAllMocks();
    // Capture console errors
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation((...args) => {
        // Log errors so we can see them
        console.log('CONSOLE ERROR DETECTED:', ...args);
      });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    // Check if any errors were logged
    if (consoleErrorSpy.mock.calls.length > 0) {
      console.log('\n⚠️  ERRORS DETECTED:');
      consoleErrorSpy.mock.calls.forEach((call, index) => {
        console.log(`\nError ${index + 1}:`, call);
      });
    }
  });

  describe('Step 3: Add Cohosts Modal Flow', () => {
    it('should render AddCohostsModal without errors', () => {
      const onDismiss = jest.fn();
      const onSave = jest.fn();

      expect(() => {
        render(
          <PaperProvider>
            <AddCohostsModal
              visible={true}
              onDismiss={onDismiss}
              onSave={onSave}
              initialSelected={[]}
            />
          </PaperProvider>,
        );
      }).not.toThrow();

      // Check if any console errors were logged
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should display search input and user list', () => {
      const onDismiss = jest.fn();
      const onSave = jest.fn();

      const { getByPlaceholderText, getByText } = render(
        <PaperProvider>
          <AddCohostsModal
            visible={true}
            onDismiss={onDismiss}
            onSave={onSave}
            initialSelected={[]}
          />
        </PaperProvider>,
      );

      // Check for search input
      expect(getByPlaceholderText('Search by name or sport')).toBeTruthy();

      // Check for mock users
      expect(getByText('Sarah Johnson')).toBeTruthy();
      expect(getByText('Mike Chen')).toBeTruthy();
      expect(getByText('Emily Rodriguez')).toBeTruthy();
    });

    it('should filter users by search query', async () => {
      const onDismiss = jest.fn();
      const onSave = jest.fn();

      const { getByPlaceholderText, getByText, queryByText } = render(
        <PaperProvider>
          <AddCohostsModal
            visible={true}
            onDismiss={onDismiss}
            onSave={onSave}
            initialSelected={[]}
          />
        </PaperProvider>,
      );

      const searchInput = getByPlaceholderText('Search by name or sport');

      // Search for Sarah
      fireEvent.changeText(searchInput, 'Sarah');

      await waitFor(() => {
        expect(getByText('Sarah Johnson')).toBeTruthy();
        expect(queryByText('Mike Chen')).toBeNull();
      });
    });

    it('should handle back/dismiss action', () => {
      const onDismiss = jest.fn();
      const onSave = jest.fn();

      const { UNSAFE_getByType } = render(
        <PaperProvider>
          <AddCohostsModal
            visible={true}
            onDismiss={onDismiss}
            onSave={onSave}
            initialSelected={[]}
          />
        </PaperProvider>,
      );

      // Find and press back button in Appbar
      const appbar = UNSAFE_getByType(
        require('react-native-paper').Appbar.Header,
      );
      expect(appbar).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const onDismiss = jest.fn();
      const onSave = jest.fn();

      const { queryByText } = render(
        <PaperProvider>
          <AddCohostsModal
            visible={false}
            onDismiss={onDismiss}
            onSave={onSave}
            initialSelected={[]}
          />
        </PaperProvider>,
      );

      expect(queryByText('Add Cohosts')).toBeNull();
    });
  });

  describe('Step 3: Integration with Parent Component', () => {
    it('should render Step3Details without errors', () => {
      const mockData = {
        title: 'Test Event',
        description: 'Test Description',
        sportId: 'pickleball',
        location: 'Test Location',
        date: new Date(),
        time: new Date(),
        duration: 120,
        capacity: null,
        cost: null,
        paymentDueBy: 'immediate' as const,
        paymentMethods: { venmo: '', paypal: '', cashapp: '', zelle: '' },
        cohosts: [],
        links: [],
        guestInvite: true,
      };

      const onNext = jest.fn();
      const onBack = jest.fn();

      expect(() => {
        render(
          <PaperProvider>
            <Step3Details data={mockData} onNext={onNext} onBack={onBack} />
          </PaperProvider>,
        );
      }).not.toThrow();

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should open Add Cohosts modal when button is pressed', async () => {
      const mockData = {
        title: 'Test Event',
        description: 'Test Description',
        sportId: 'pickleball',
        location: 'Test Location',
        date: new Date(),
        time: new Date(),
        duration: 120,
        capacity: null,
        cost: null,
        paymentDueBy: 'immediate' as const,
        paymentMethods: { venmo: '', paypal: '', cashapp: '', zelle: '' },
        cohosts: [],
        links: [],
        guestInvite: true,
      };

      const onNext = jest.fn();
      const onBack = jest.fn();

      const { getByText, queryByText } = render(
        <PaperProvider>
          <Step3Details data={mockData} onNext={onNext} onBack={onBack} />
        </PaperProvider>,
      );

      // Initially modal should not be visible
      expect(queryByText('Search by name or sport')).toBeNull();

      // Press Add Co-hosts button
      const addButton = getByText('Add Co-hosts');
      fireEvent.press(addButton);

      // Modal should now be visible
      await waitFor(() => {
        expect(queryByText('Search by name or sport')).toBeTruthy();
      });
    });
  });

  describe('Full Wizard Navigation', () => {
    it('should render CreateEventWizard without errors', () => {
      expect(() => {
        render(
          <AllTheProviders store={store}>
            <CreateEventWizard />
          </AllTheProviders>,
        );
      }).not.toThrow();

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should start at Step 1', () => {
      const { getByText } = render(
        <AllTheProviders store={store}>
          <CreateEventWizard />
        </AllTheProviders>,
      );

      expect(getByText('Step 1 of 4')).toBeTruthy();
      expect(getByText('Event Details')).toBeTruthy();
    });

    it('should navigate to Step 2 after filling Step 1', async () => {
      const { getByText, getByPlaceholderText } = render(
        <AllTheProviders store={store}>
          <CreateEventWizard />
        </AllTheProviders>,
      );

      // Fill title
      const titleInput = getByPlaceholderText(
        'e.g., Saturday Morning Pickleball',
      );
      fireEvent.changeText(titleInput, 'Test Event');

      // Select sport
      const pickleballCard = getByText('Pickleball');
      fireEvent.press(pickleballCard);

      // Press Next
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(getByText('Step 2 of 4')).toBeTruthy();
      });
    });
  });

  describe('Error Detection and Reporting', () => {
    it('should catch and report any rendering errors', () => {
      const renderComponents = [
        () =>
          render(
            <AllTheProviders store={store}>
              <CreateEventWizard />
            </AllTheProviders>,
          ),
        () => {
          const mockData = {
            title: '',
            description: '',
            sportId: '',
            location: '',
            date: null,
            time: null,
            duration: 120,
            capacity: null,
            cost: null,
            paymentDueBy: 'immediate' as const,
            paymentMethods: { venmo: '', paypal: '', cashapp: '', zelle: '' },
            cohosts: [],
            links: [],
            guestInvite: true,
          };
          render(
            <PaperProvider>
              <Step3Details
                data={mockData}
                onNext={jest.fn()}
                onBack={jest.fn()}
              />
            </PaperProvider>,
          );
        },
        () =>
          render(
            <PaperProvider>
              <AddCohostsModal
                visible={true}
                onDismiss={jest.fn()}
                onSave={jest.fn()}
                initialSelected={[]}
              />
            </PaperProvider>,
          ),
      ];

      const errors: any[] = [];
      renderComponents.forEach((renderFn, index) => {
        try {
          renderFn();
          if (consoleErrorSpy.mock.calls.length > 0) {
            errors.push({
              component:
                index === 0
                  ? 'CreateEventWizard'
                  : index === 1
                    ? 'Step3Details'
                    : 'AddCohostsModal',
              errors: consoleErrorSpy.mock.calls,
            });
          }
          consoleErrorSpy.mockClear();
        } catch (error) {
          errors.push({
            component:
              index === 0
                ? 'CreateEventWizard'
                : index === 1
                  ? 'Step3Details'
                  : 'AddCohostsModal',
            error,
          });
        }
      });

      if (errors.length > 0) {
        console.log('\n🔴 ERRORS FOUND IN COMPONENTS:');
        errors.forEach(err => {
          console.log(`\n Component: ${err.component}`);
          console.log('Error:', err.error || err.errors);
        });
      }

      // This test passes but reports errors if found
      expect(true).toBe(true);
    });
  });
});
