/**
 * Mock Event Service Tests
 * Tests for MockEventService implementation
 */

import { MockEventService } from '../../services/mock/mockEvents.service';
import type { CreateEventRequest, UpdateEventRequest } from '../../types/event.types';

describe('MockEventService', () => {
  let eventService: MockEventService;
  const validEventRequest: CreateEventRequest = {
    title: 'Test Pickleball Game',
    description: 'A fun pickleball game for testing',
    sportId: 'pickleball',
    location: {
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
    },
    dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    capacity: 8,
    depositAmount: 500, // $5.00
    visibility: 'public',
  };

  beforeEach(() => {
    eventService = new MockEventService();
    eventService.reset(); // Clear pre-populated mock data
  });

  describe('createEvent', () => {
    it('should create a new event with valid data', async () => {
      const event = await eventService.createEvent(validEventRequest);

      expect(event).toBeDefined();
      expect(event.id).toBeDefined();
      expect(event.title).toBe(validEventRequest.title);
      expect(event.description).toBe(validEventRequest.description);
      expect(event.sport.id).toBe(validEventRequest.sportId);
      expect(event.capacity).toBe(validEventRequest.capacity);
      expect(event.depositAmount).toBe(validEventRequest.depositAmount);
      expect(event.visibility).toBe(validEventRequest.visibility);
      expect(event.status).toBe('upcoming');
      expect(event.participantCount).toBe(0);
      expect(event.qrCode).toBeDefined();
    });

    it('should generate unique event IDs', async () => {
      const event1 = await eventService.createEvent(validEventRequest);
      const event2 = await eventService.createEvent(validEventRequest);

      expect(event1.id).not.toBe(event2.id);
    });

    it('should map sport ID to sport object', async () => {
      const event = await eventService.createEvent(validEventRequest);

      expect(event.sport).toEqual({
        id: 'pickleball',
        name: 'Pickleball',
        icon: '🏓',
      });
    });

    it('should create private events with invite token', async () => {
      const privateRequest = { ...validEventRequest, visibility: 'private' as const };
      const event = await eventService.createEvent(privateRequest);

      expect(event.visibility).toBe('private');
      expect(event.inviteToken).toBeDefined();
      expect(event.inviteToken).toMatch(/^invite-token-\d+$/);
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await eventService.createEvent(validEventRequest);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(300);
    });
  });

  describe('getEvent', () => {
    it('should retrieve an existing event', async () => {
      const createdEvent = await eventService.createEvent(validEventRequest);
      const event = await eventService.getEvent(createdEvent.id);

      expect(event).toBeDefined();
      expect(event.id).toBe(createdEvent.id);
      expect(event.title).toBe(createdEvent.title);
    });

    it('should throw error for non-existent event', async () => {
      await expect(eventService.getEvent('non-existent-id')).rejects.toThrow('Event not found');
    });
  });

  describe('updateEvent', () => {
    it('should update event title', async () => {
      const createdEvent = await eventService.createEvent(validEventRequest);
      const updates: UpdateEventRequest = { title: 'Updated Title' };
      const updated = await eventService.updateEvent(createdEvent.id, updates);

      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe(createdEvent.description); // Unchanged
    });

    it('should update event capacity', async () => {
      const createdEvent = await eventService.createEvent(validEventRequest);
      const updates: UpdateEventRequest = { capacity: 12 };
      const updated = await eventService.updateEvent(createdEvent.id, updates);

      expect(updated.capacity).toBe(12);
    });

    it('should update event location', async () => {
      const createdEvent = await eventService.createEvent(validEventRequest);
      const newLocation = {
        address: '456 New St',
        city: 'Oakland',
        state: 'CA',
        zipCode: '94601',
        coordinates: { latitude: 37.8044, longitude: -122.2712 },
      };
      const updates: UpdateEventRequest = { location: newLocation };
      const updated = await eventService.updateEvent(createdEvent.id, updates);

      expect(updated.location.address).toBe('456 New St');
      expect(updated.location.city).toBe('Oakland');
    });

    it('should throw error when updating non-existent event', async () => {
      const updates: UpdateEventRequest = { title: 'Updated' };
      await expect(eventService.updateEvent('non-existent', updates)).rejects.toThrow(
        'Event not found'
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event', async () => {
      const createdEvent = await eventService.createEvent(validEventRequest);
      await eventService.deleteEvent(createdEvent.id);

      // Event is removed, so getEvent should throw
      await expect(eventService.getEvent(createdEvent.id)).rejects.toThrow('Event not found');
    });

    it('should throw error when deleting non-existent event', async () => {
      await expect(eventService.deleteEvent('non-existent')).rejects.toThrow('Event not found');
    });
  });

  describe('getMyEvents', () => {
    it('should return events for host user', async () => {
      // Create events with mock service (hostId will be 'current-user-id')
      await eventService.createEvent(validEventRequest);

      const events = await eventService.getMyEvents('current-user-id');
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].hostId).toBe('current-user-id');
    });

    it('should return empty array for user with no events', async () => {
      const events = await eventService.getMyEvents('user-no-events');
      expect(events).toEqual([]);
    });
  });

  describe('getMyRSVPs', () => {
    it("should return events user has RSVP'd to", async () => {
      const events = await eventService.getMyRSVPs('user2');
      expect(Array.isArray(events)).toBe(true);
    });

    it('should return empty array for user with no RSVPs', async () => {
      const events = await eventService.getMyRSVPs('user-no-rsvps');
      expect(events).toEqual([]);
    });
  });

  describe('searchEvents', () => {
    it('should search events', async () => {
      await eventService.createEvent({
        ...validEventRequest,
        title: 'Unique Basketball Tournament',
        sportId: 'basketball',
      });

      const results = await eventService.searchEvents({
        page: 1,
        limit: 10,
      });

      expect(results.events.length).toBeGreaterThan(0);
      expect(results.total).toBeGreaterThanOrEqual(results.events.length);
    });

    it('should filter by sport', async () => {
      await eventService.createEvent(validEventRequest); // Pickleball

      const results = await eventService.searchEvents({
        sportIds: ['pickleball'],
        page: 1,
        limit: 10,
      });

      expect(results.events.length).toBeGreaterThan(0);
    });

    it('should respect pagination', async () => {
      const results = await eventService.searchEvents({
        page: 1,
        limit: 5,
      });

      expect(results.events.length).toBeLessThanOrEqual(5);
      expect(results.page).toBe(1);
      expect(results.limit).toBe(5);
      expect(results.total).toBeGreaterThanOrEqual(results.events.length);
    });
  });
});
