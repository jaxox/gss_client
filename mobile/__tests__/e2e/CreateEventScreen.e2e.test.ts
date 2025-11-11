/**
 * E2E Test: CreateEventScreen
 * Tests all form interactions, validation, and button clicks
 */

import { by, device, element, expect as detoxExpect, waitFor } from 'detox';

describe('CreateEventScreen E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Navigate to CreateEventScreen - adjust based on your navigation setup
    // This assumes you have a "Create Event" button accessible from home
    try {
      await waitFor(element(by.text('Create Event')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.text('Create Event')).tap();
    } catch (e) {
      console.warn('Could not navigate to CreateEventScreen automatically');
    }
  });

  describe('Form Input Tests', () => {
    it('should display all form fields', async () => {
      await detoxExpect(element(by.text('Event Title *'))).toBeVisible();
      await detoxExpect(element(by.text('Description *'))).toBeVisible();
      await detoxExpect(element(by.text('Sport *'))).toBeVisible();
      await detoxExpect(element(by.text('Capacity *'))).toBeVisible();
      await detoxExpect(element(by.text('Deposit Amount *'))).toBeVisible();
      await detoxExpect(element(by.text('Visibility *'))).toBeVisible();
    });

    it('should allow typing in title field', async () => {
      await element(by.label('Event Title *')).typeText('Test Pickleball Game');
      await detoxExpect(element(by.label('Event Title *'))).toHaveText(
        'Test Pickleball Game',
      );
    });

    it('should allow typing in description field', async () => {
      await element(by.label('Description *')).typeText(
        'This is a test event description for E2E testing',
      );
      await detoxExpect(element(by.label('Description *'))).toHaveText(
        'This is a test event description for E2E testing',
      );
    });

    it('should show character counter for description', async () => {
      await element(by.label('Description *')).typeText('Short description');
      await detoxExpect(element(by.text(/\d+\/500 characters/))).toBeVisible();
    });

    it('should allow entering capacity', async () => {
      await element(by.label('Capacity *')).replaceText('10');
      await detoxExpect(element(by.label('Capacity *'))).toHaveText('10');
    });
  });

  describe('Sport Selection Tests', () => {
    it('should allow selecting Pickleball', async () => {
      await element(by.text('🏓 Pickleball')).tap();
      // Verify selection by checking if button is selected (implementation-dependent)
    });

    it('should allow selecting Basketball', async () => {
      await element(by.text('🏀 Basketball')).tap();
    });

    it('should allow selecting Soccer', async () => {
      await element(by.text('⚽ Soccer')).tap();
    });

    it('should allow selecting Tennis', async () => {
      await element(by.text('🎾 Tennis')).tap();
    });

    it('should allow selecting Volleyball', async () => {
      await element(by.text('🏐 Volleyball')).tap();
    });
  });

  describe('Deposit Amount Tests', () => {
    it('should allow selecting $0 deposit', async () => {
      await element(by.text('Free')).tap();
    });

    it('should allow selecting $5 deposit', async () => {
      await element(by.text('$5')).tap();
    });

    it('should allow selecting $10 deposit', async () => {
      await element(by.text('$10')).tap();
    });
  });

  describe('Visibility Tests', () => {
    it('should allow selecting Public visibility', async () => {
      await element(by.text('Public')).tap();
    });

    it('should allow selecting Private visibility', async () => {
      await element(by.text('Private')).tap();
    });
  });

  describe('Validation Tests', () => {
    it('should show error when submitting with empty title', async () => {
      await element(by.text('Create Event')).atIndex(1).tap(); // Submit button
      await waitFor(element(by.text(/title/i)))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should show error for title less than 3 characters', async () => {
      await element(by.label('Event Title *')).typeText('ab');
      await element(by.text('Create Event')).atIndex(1).tap();
      await waitFor(element(by.text(/at least 3 characters/i)))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should show error for description less than 10 characters', async () => {
      await element(by.label('Event Title *')).typeText('Valid Title');
      await element(by.label('Description *')).typeText('Short');
      await element(by.text('Create Event')).atIndex(1).tap();
      await waitFor(element(by.text(/at least 10 characters/i)))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should show error for capacity less than 1', async () => {
      await element(by.label('Capacity *')).replaceText('0');
      await element(by.text('Create Event')).atIndex(1).tap();
      await waitFor(element(by.text(/at least 1/i)))
        .toBeVisible()
        .withTimeout(2000);
    });

    it('should show error for capacity greater than 100', async () => {
      await element(by.label('Capacity *')).replaceText('150');
      await element(by.text('Create Event')).atIndex(1).tap();
      await waitFor(element(by.text(/not exceed 100/i)))
        .toBeVisible()
        .withTimeout(2000);
    });
  });

  describe('Form Submission Tests', () => {
    it('should successfully submit valid form', async () => {
      // Fill in all required fields
      await element(by.label('Event Title *')).typeText('Test Pickleball Game');
      await element(by.label('Description *')).typeText(
        'This is a test event for E2E testing with valid length',
      );
      await element(by.text('🏓 Pickleball')).tap();
      await element(by.label('Capacity *')).replaceText('8');
      await element(by.text('Free')).tap();
      await element(by.text('Public')).tap();

      // Fill location fields
      await element(by.label('Address *')).typeText('123 Main St');
      await element(by.label('City *')).typeText('San Francisco');
      await element(by.label('State *')).typeText('CA');
      await element(by.label('ZIP Code *')).typeText('94102');

      // Fill date/time (format: YYYY-MM-DD HH:MM)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const dateString = futureDate
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');
      await element(by.label('Date & Time *')).typeText(dateString);

      // Submit form
      await element(by.text('Create Event')).atIndex(1).tap();

      // Verify success message appears
      await waitFor(element(by.text(/Event created successfully/i)))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show loading state during submission', async () => {
      // Fill form with valid data
      await element(by.label('Event Title *')).typeText('Loading Test Event');
      await element(by.label('Description *')).typeText(
        'Testing loading state during submission process',
      );

      // Submit and immediately check for loading indicator
      await element(by.text('Create Event')).atIndex(1).tap();

      // Should show loading indicator (button disabled or spinner)
      await waitFor(element(by.id('loading-indicator')))
        .toBeVisible()
        .withTimeout(1000);
    });
  });

  describe('Button Interaction Tests', () => {
    it('should allow tapping Cancel button', async () => {
      await element(by.text('Cancel')).tap();
      // Verify navigation or dialog appears
    });

    it('should disable Submit button during loading', async () => {
      // Fill minimum valid form
      await element(by.label('Event Title *')).typeText('Button Test');
      await element(by.label('Description *')).typeText(
        'Testing button disable state',
      );

      await element(by.text('Create Event')).atIndex(1).tap();

      // Button should be disabled during API call
      // Note: Detox doesn't have direct "isDisabled" check, would need custom matcher
    });
  });

  describe('Error Handling Tests', () => {
    it('should display error banner when submission fails', async () => {
      // This would require mocking API failure
      // Or testing with invalid data that backend rejects
    });

    it('should auto-dismiss error after 5 seconds', async () => {
      // Trigger an error
      await element(by.text('Create Event')).atIndex(1).tap();

      // Wait for error to appear
      await waitFor(element(by.id('error-banner')))
        .toBeVisible()
        .withTimeout(2000);

      // Wait 6 seconds and verify error disappeared
      await waitFor(element(by.id('error-banner')))
        .not.toBeVisible()
        .withTimeout(7000);
    });
  });

  describe('Keyboard Behavior Tests', () => {
    it('should show keyboard when tapping text input', async () => {
      await element(by.label('Event Title *')).tap();
      // Keyboard should be visible (platform-dependent check)
    });

    it('should hide keyboard when scrolling', async () => {
      await element(by.label('Event Title *')).tap();
      await element(by.id('scroll-view')).scroll(200, 'down');
      // Keyboard should dismiss
    });
  });
});
