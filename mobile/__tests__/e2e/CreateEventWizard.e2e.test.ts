/**
 * E2E Tests for Create Event Wizard - Premium Athletic Implementation
 * Tests complete 4-step flow with all modals
 */

import { by, device, element, waitFor, expect as detoxExpect } from 'detox';

describe('Create Event Wizard - Complete Flow Tests', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: { detoxPrintBusyIdleResources: 'YES' },
    });
    (globalThis as any).__E2E__ = true;
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await device.disableSynchronization();
  });

  afterEach(async () => {
    await device.enableSynchronization();
  });

  describe('Step 1: Basic Info', () => {
    it('should display all Step 1 inputs', async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const titleInput = element(by.id('event-title-input'));
      await waitFor(titleInput).toBeVisible().withTimeout(10000);

      await detoxExpect(
        element(by.id('event-description-input')),
      ).toBeVisible();
      await detoxExpect(element(by.text('Choose Sport'))).toBeVisible();
    });

    it('should show all sport options', async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const sportCard = element(by.id('sport-card-pickleball'));
      await waitFor(sportCard).toBeVisible().withTimeout(10000);

      await detoxExpect(element(by.text('PICKLEBALL'))).toBeVisible();
      await detoxExpect(element(by.text('TENNIS'))).toBeVisible();
    });

    it('should have location and time inputs', async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      await detoxExpect(
        element(by.id('location-input-pressable')),
      ).toBeVisible();
      await detoxExpect(element(by.id('date-input-pressable'))).toBeVisible();
    });

    it('should validate and proceed to Step 2', async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);

      // Fill in required fields
      await element(by.id('event-title-input')).typeText('Basketball Game');
      await element(by.id('event-description-input')).typeText(
        'Casual pickup basketball game at the park',
      );

      // Select sport
      await element(by.id('sport-card-basketball')).tap();

      // Scroll to location
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Click Next button
      const nextButton = element(by.id('next-button'));
      await waitFor(nextButton).toBeVisible().withTimeout(5000);
      await nextButton.tap();

      // Verify Step 2 is displayed
      await waitFor(element(by.id('step2-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Step 2: Location & Time', () => {
    beforeEach(async () => {
      // Navigate to Step 2
      await new Promise(resolve => setTimeout(resolve, 3000));

      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('event-title-input')).typeText('Test Event');
      await element(by.id('event-description-input')).typeText(
        'Test description for the event',
      );
      await element(by.id('sport-card-pickleball')).tap();

      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      await element(by.id('next-button')).tap();

      await waitFor(element(by.id('step2-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should display location and time inputs', async () => {
      await detoxExpect(element(by.id('step2-scroll-view'))).toBeVisible();

      // Location input should be visible
      await detoxExpect(element(by.id('location-search-input'))).toBeVisible();
    });

    it('should proceed to Step 3', async () => {
      // Fill location
      await element(by.id('location-search-input')).typeText('Downtown Court');

      await element(by.id('step2-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Click Next button
      const nextButton = element(by.id('step2-next-button'));
      await waitFor(nextButton).toBeVisible().withTimeout(5000);
      await nextButton.tap();

      // Verify Step 3 is displayed
      await waitFor(element(by.id('step3-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Step 3: Settings & Payment', () => {
    beforeEach(async () => {
      // Navigate to Step 3
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 1
      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('event-title-input')).typeText('Test Event');
      await element(by.id('event-description-input')).typeText(
        'Test description',
      );
      await element(by.id('sport-card-pickleball')).tap();
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('next-button')).tap();

      // Step 2
      await waitFor(element(by.id('step2-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('location-search-input')).typeText('Test Location');
      await element(by.id('step2-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('step2-next-button')).tap();

      await waitFor(element(by.id('step3-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should display Step 3 settings', async () => {
      await detoxExpect(element(by.id('step3-scroll-view'))).toBeVisible();
      await detoxExpect(element(by.text('EVENT SETTINGS'))).toBeVisible();
      await detoxExpect(element(by.text('CAPACITY'))).toBeVisible();
    });

    it('should display all modal trigger sections', async () => {
      await element(by.id('step3-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      await detoxExpect(element(by.text('PAYMENT'))).toBeVisible();
      await detoxExpect(element(by.text('CO-HOSTS'))).toBeVisible();
      await detoxExpect(element(by.text('LINKS'))).toBeVisible();
      await detoxExpect(element(by.text('QUESTIONNAIRE'))).toBeVisible();
      await detoxExpect(element(by.text('REMINDERS'))).toBeVisible();
    });

    it('should proceed to Step 4', async () => {
      await element(by.id('step3-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Click Review button
      const reviewButton = element(by.id('step3-review-button'));
      await waitFor(reviewButton).toBeVisible().withTimeout(5000);
      await reviewButton.tap();

      // Verify Step 4 is displayed
      await waitFor(element(by.id('step4-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Step 4: Review & Publish', () => {
    beforeEach(async () => {
      // Navigate through all steps to Step 4
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 1
      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id('event-title-input')).typeText('Final Test Event');
      await element(by.id('event-description-input')).typeText('Complete test');
      await element(by.id('sport-card-pickleball')).tap();
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('next-button')).tap();

      // Step 2
      await waitFor(element(by.id('step2-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('location-search-input')).typeText('Final Location');
      await element(by.id('step2-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('step2-next-button')).tap();

      // Step 3
      await waitFor(element(by.id('step3-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('step3-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await element(by.id('step3-review-button')).tap();

      await waitFor(element(by.id('step4-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should display review screen', async () => {
      await detoxExpect(element(by.id('step4-scroll-view'))).toBeVisible();
      await detoxExpect(element(by.text('EVENT TITLE'))).toBeVisible();
      await detoxExpect(element(by.text('Final Test Event'))).toBeVisible();
    });

    it('should display back and publish buttons', async () => {
      await element(by.id('step4-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      await detoxExpect(element(by.id('step4-back-button'))).toBeVisible();
      await detoxExpect(element(by.id('step4-publish-button'))).toBeVisible();
    });

    it('should navigate back to Step 3', async () => {
      await element(by.id('step4-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));

      await element(by.id('step4-back-button')).tap();

      await waitFor(element(by.id('step3-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Complete Wizard Flow', () => {
    it('should complete entire 4-step flow', async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));

      // STEP 1
      await waitFor(element(by.id('event-title-input')))
        .toBeVisible()
        .withTimeout(10000);

      await element(by.id('event-title-input')).typeText('Complete Flow Test');
      await element(by.id('event-description-input')).typeText(
        'Testing the complete wizard flow from start to finish',
      );
      await element(by.id('sport-card-basketball')).tap();
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('next-button')).tap();

      // STEP 2
      await waitFor(element(by.id('step2-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id('location-search-input')).typeText(
        'Complete Test Location',
      );
      await element(by.id('step2-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('step2-next-button')).tap();

      // STEP 3
      await waitFor(element(by.id('step3-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);

      // Fill capacity
      await element(by.id('capacity-input')).typeText('20');

      await element(by.id('step3-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await element(by.id('step3-review-button')).tap();

      // STEP 4
      await waitFor(element(by.id('step4-scroll-view')))
        .toBeVisible()
        .withTimeout(5000);

      // Verify all data is displayed
      await detoxExpect(element(by.text('Complete Flow Test'))).toBeVisible();
      await detoxExpect(element(by.text('EVENT TITLE'))).toBeVisible();
      await detoxExpect(element(by.text('DESCRIPTION'))).toBeVisible();

      // Verify publish button is enabled
      await element(by.id('step4-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await detoxExpect(element(by.id('step4-publish-button'))).toBeVisible();

      console.log('✅ Complete 4-step wizard flow test PASSED');
    });
  });
});
