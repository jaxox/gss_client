/**
 * E2E Tests for Create Event Wizard (Simplified - Direct Testing)
 */

import { by, device, element, waitFor, expect as detoxExpect } from 'detox';

describe('Create Event Wizard - Direct Tests', () => {
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

  it('Wizard Step 1: should display title and description inputs', async () => {
    // This test validates wizard is rendered and basic inputs are visible
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for app load

    // Look for the title input - if wizard auto-shows or is accessible
    const titleInput = element(by.id('event-title-input'));
    await waitFor(titleInput).toBeVisible().withTimeout(10000);

    await detoxExpect(element(by.id('event-description-input'))).toBeVisible();
    await detoxExpect(element(by.text('Choose Sport'))).toBeVisible();
  });

  it('Wizard Step 1: should show all sport options', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const sportCard = element(by.id('sport-card-pickleball'));
    await waitFor(sportCard).toBeVisible().withTimeout(10000);

    await detoxExpect(element(by.text('PICKLEBALL'))).toBeVisible();
    await detoxExpect(element(by.text('TENNIS'))).toBeVisible();
  });

  it('Wizard Step 1: should have location and time inputs', async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    await waitFor(element(by.id('event-title-input')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('step1-scroll-view')).scrollTo('bottom');
    await new Promise(resolve => setTimeout(resolve, 500));

    await detoxExpect(element(by.id('location-input-pressable'))).toBeVisible();
    await detoxExpect(element(by.id('date-input-pressable'))).toBeVisible();
  });
});
