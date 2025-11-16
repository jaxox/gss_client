/**
 * E2E Tests for Create Event Wizard (Premium Athletic Design v2)
 */

import { by, device, element, waitFor, expect as detoxExpect } from 'detox';

describe('CreateEventWizard E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    (globalThis as any).__E2E__ = true;
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await waitFor(element(by.id('create-event-menu-button')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('create-event-menu-button')).tap();
    await new Promise(resolve => setTimeout(resolve, 500));
    await waitFor(element(by.id('event-title-input')))
      .toBeVisible()
      .withTimeout(5000);
    await device.disableSynchronization();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  describe('Step 1 - Complete Basic Info', () => {
    it('should display all Step 1 inputs', async () => {
      await detoxExpect(element(by.id('event-title-input'))).toBeVisible();
      await detoxExpect(
        element(by.id('event-description-input')),
      ).toBeVisible();
      await detoxExpect(element(by.text('Choose Sport'))).toBeVisible();
    });

    it('should allow proceeding to Step 2', async () => {
      await element(by.id('event-title-input')).typeText('Test Event');
      await element(by.id('event-description-input')).typeText(
        'This is a test event description with enough characters to pass validation',
      );
      await element(by.id('sport-card-tennis')).tap();
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('location-input-pressable')).atIndex(0).tap();
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('location-search-input')).typeText('Downtown Court');
      await element(by.id('location-save-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('time-input-pressable')).replaceText('14:30');
      await element(by.id('end-time-input-pressable')).replaceText('16:30');
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 300));
      await element(by.id('next-button')).tap();
      await waitFor(element(by.text('Co-hosts')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Complete Wizard Flow', () => {
    it('should complete all 4 steps', async () => {
      await element(by.id('event-title-input')).typeText('Complete Flow Test');
      await element(by.id('event-description-input')).typeText(
        'Testing complete wizard flow with all steps and data preservation',
      );
      await element(by.id('sport-card-badminton')).tap();
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('location-input-pressable')).atIndex(0).tap();
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('location-search-input')).typeText(
        'Flow Test Location',
      );
      await element(by.id('location-save-button')).tap();
      await new Promise(resolve => setTimeout(resolve, 500));
      await element(by.id('time-input-pressable')).replaceText('09:00');
      await element(by.id('end-time-input-pressable')).replaceText('11:00');
      await element(by.id('step1-scroll-view')).scrollTo('bottom');
      await new Promise(resolve => setTimeout(resolve, 300));
      await element(by.id('next-button')).tap();
      await waitFor(element(by.text('Co-hosts')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('step2-next-button')).tap();
      await waitFor(element(by.id('capacity-input')))
        .toBeVisible()
        .withTimeout(5000);
      await element(by.id('step3-next-button')).tap();
      await waitFor(element(by.text('Event Title')))
        .toBeVisible()
        .withTimeout(5000);
      await detoxExpect(element(by.id('step4-publish-button'))).toBeVisible();
    });
  });
});
