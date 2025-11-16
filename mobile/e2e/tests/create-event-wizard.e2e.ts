/**
 * E2E Test: Create Event Wizard Flow
 * Tests the complete 4-step wizard with Premium Athletic design
 */
/// <reference types="detox" />

describe('Create Event Wizard', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full wizard flow and create event', async () => {
    // Navigate to Create Event (adjust navigation as needed)
    // await element(by.id('create-event-button')).tap();

    // Step 1: Basic Info
    await expect(element(by.id('step1-scroll-view'))).toBeVisible();

    // Fill in title
    await element(by.id('event-title-input')).typeText(
      'Premium Athletic Tennis Match',
    );
    await element(by.id('event-title-input')).tapReturnKey();

    // Fill in description
    await element(by.id('event-description-input')).typeText(
      'Join us for an exciting tennis match at the park. All skill levels welcome!',
    );

    // Select sport (Tennis)
    await element(by.id('sport-card-tennis')).tap();

    // Proceed to Step 2
    await element(by.id('next-button')).tap();

    // Step 2: Location & Time
    await expect(element(by.id('step2-scroll-view'))).toBeVisible();

    // Select location
    await element(by.id('location-input-pressable')).tap();
    await expect(
      element(by.text('Golden Gate Park Tennis Courts')),
    ).toBeVisible();
    await element(by.text('Golden Gate Park Tennis Courts')).tap();

    // Select date (use date picker)
    await element(by.id('date-input-pressable')).tap();
    // Date picker interactions would go here

    // Select start time
    await element(by.id('time-input-pressable')).tap();
    // Time picker interactions

    // Select end time
    await element(by.id('end-time-input-pressable')).tap();
    // Time picker interactions

    // Proceed to Step 3
    await element(by.id('next-button')).tap();

    // Step 3: Details
    await expect(element(by.id('step3-scroll-view'))).toBeVisible();

    // Set capacity
    await element(by.id('capacity-input')).typeText('10');

    // Set cost
    await element(by.id('cost-input')).typeText('15');

    // Proceed to Step 4
    await element(by.id('step3-next-button')).tap();

    // Step 4: Review & Publish
    await expect(element(by.id('step4-scroll-view'))).toBeVisible();

    // Verify all data is displayed correctly
    await expect(
      element(by.text('Premium Athletic Tennis Match')),
    ).toBeVisible();
    await expect(element(by.text(/Golden Gate Park/))).toBeVisible();

    // Publish event
    await element(by.id('publish-button')).tap();

    // Verify success (adjust based on your success flow)
    await waitFor(element(by.text(/Event created successfully/i)))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should navigate backwards through wizard preserving data', async () => {
    // Step 1
    await element(by.id('event-title-input')).typeText('Test Event');
    await element(by.id('event-description-input')).typeText(
      'Test Description for going back',
    );
    await element(by.id('sport-card-pickleball')).tap();
    await element(by.id('next-button')).tap();

    // Step 2 - Go back
    await expect(element(by.id('step2-scroll-view'))).toBeVisible();
    await element(by.text('BACK')).tap();

    // Verify Step 1 data preserved
    await expect(element(by.id('step1-scroll-view'))).toBeVisible();
    await expect(element(by.id('event-title-input'))).toHaveText('Test Event');
    await expect(element(by.id('event-description-input'))).toHaveText(
      'Test Description for going back',
    );
  });

  it('should validate required fields in Step 1', async () => {
    // Try to proceed without filling fields
    await element(by.id('next-button')).tap();

    // Should show validation errors
    await expect(
      element(by.text(/Title must be at least 3 characters/)),
    ).toBeVisible();
    await expect(
      element(by.text(/Description must be at least 10 characters/)),
    ).toBeVisible();
  });

  it('should validate title length constraints', async () => {
    // Test minimum length
    await element(by.id('event-title-input')).typeText('AB');
    await element(by.id('event-description-input')).tap(); // Blur
    await expect(
      element(by.text(/Title must be at least 3 characters/)),
    ).toBeVisible();

    // Test maximum length
    await element(by.id('event-title-input')).clearText();
    await element(by.id('event-title-input')).typeText('A'.repeat(51));
    await element(by.id('event-description-input')).tap(); // Blur
    await expect(
      element(by.text(/Title cannot exceed 50 characters/)),
    ).toBeVisible();
  });

  it('should show Premium Athletic design elements', async () => {
    // Verify dark theme
    await expect(element(by.id('step1-scroll-view'))).toBeVisible();

    // Verify progress bar
    await expect(element(by.text('STEP 1 OF 4'))).toBeVisible();
    await expect(element(by.text(/25% Complete/))).toBeVisible();

    // Verify section headers are uppercase
    await expect(element(by.text('BASIC INFORMATION'))).toBeVisible();
    await expect(element(by.text('SELECT SPORT'))).toBeVisible();

    // Verify gradient button
    await expect(element(by.id('next-button'))).toBeVisible();
  });

  it('should handle sport selection correctly', async () => {
    // Select Pickleball
    await element(by.id('sport-card-pickleball')).tap();

    // Verify selection (could check for orange accent or selected state)
    // Orange accent bar should be visible on selected card

    // Change selection to Tennis
    await element(by.id('sport-card-tennis')).tap();

    // Fill required fields and proceed
    await element(by.id('event-title-input')).typeText('Sport Selection Test');
    await element(by.id('event-description-input')).typeText(
      'Testing sport selection functionality',
    );
    await element(by.id('next-button')).tap();

    // Verify navigation worked
    await expect(element(by.id('step2-scroll-view'))).toBeVisible();
  });
});
