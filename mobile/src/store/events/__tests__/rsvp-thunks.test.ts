/**
 * RSVP Thunks Integration Tests
 * Tests for createRSVP and cancelRSVP async thunks
 */

import eventsReducer from '../eventsSlice';

describe('RSVP State Management', () => {
  describe('eventsSlice RSVP state', () => {
    it('should have initial RSVP state', () => {
      const state = eventsReducer(undefined, { type: '@@INIT' });

      expect(state.loading.rsvp).toBe(false);
      expect(state.error.rsvp).toBeNull();
      expect(state.success.rsvp).toBe(false);
      expect(state.currentRSVP).toBeNull();
    });

    it('should handle createRSVP.pending', () => {
      const state = eventsReducer(undefined, {
        type: 'events/createRSVP/pending',
      });

      expect(state.loading.rsvp).toBe(true);
      expect(state.error.rsvp).toBeNull();
      expect(state.success.rsvp).toBe(false);
    });

    it('should handle createRSVP.fulfilled', () => {
      const mockRSVP = {
        id: 'rsvp-1',
        eventId: 'event-1',
        userId: 'user-1',
        status: 'confirmed' as const,
        depositAuthorization: {
          authorizationId: 'pi_123',
          amount: 500,
          status: 'succeeded' as const,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const state = eventsReducer(undefined, {
        type: 'events/createRSVP/fulfilled',
        payload: mockRSVP,
      });

      expect(state.loading.rsvp).toBe(false);
      expect(state.error.rsvp).toBeNull();
      expect(state.success.rsvp).toBe(true);
      expect(state.currentRSVP).toEqual(mockRSVP);
    });

    it('should handle createRSVP.rejected', () => {
      const errorMessage = 'Event is at capacity';

      const state = eventsReducer(undefined, {
        type: 'events/createRSVP/rejected',
        payload: errorMessage,
      });

      expect(state.loading.rsvp).toBe(false);
      expect(state.error.rsvp).toBe(errorMessage);
      expect(state.success.rsvp).toBe(false);
      expect(state.currentRSVP).toBeNull();
    });

    it('should handle cancelRSVP.pending', () => {
      const initialState = eventsReducer(undefined, { type: '@@INIT' });

      const state = eventsReducer(initialState, {
        type: 'events/cancelRSVP/pending',
      });

      expect(state.loading.cancelRsvp).toBe(true);
      expect(state.error.cancelRsvp).toBeNull();
    });

    it('should handle cancelRSVP.fulfilled', () => {
      const mockRSVP = {
        id: 'rsvp-1',
        eventId: 'event-1',
        userId: 'user-1',
        status: 'confirmed' as const,
        depositAuthorization: {
          authorizationId: 'pi_123',
          amount: 500,
          status: 'succeeded' as const,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Start with an active RSVP
      const initialState = eventsReducer(undefined, {
        type: 'events/createRSVP/fulfilled',
        payload: mockRSVP,
      });

      expect(initialState.currentRSVP).toEqual(mockRSVP);

      // Cancel the RSVP - payload is the eventId
      const state = eventsReducer(initialState, {
        type: 'events/cancelRSVP/fulfilled',
        payload: mockRSVP.eventId,
      });

      expect(state.loading.cancelRsvp).toBe(false);
      expect(state.error.cancelRsvp).toBeNull();
      expect(state.success.cancelRsvp).toBe(true);
    });

    it('should handle cancelRSVP.rejected', () => {
      const errorMessage = 'RSVP not found';

      const state = eventsReducer(undefined, {
        type: 'events/cancelRSVP/rejected',
        payload: errorMessage,
      });

      expect(state.loading.cancelRsvp).toBe(false);
      expect(state.error.cancelRsvp).toBe(errorMessage);
    });

    it('should maintain separate error states for RSVP and other operations', () => {
      // Set a fetch error
      let state = eventsReducer(undefined, {
        type: 'events/getEvent/rejected',
        payload: 'Event not found',
      });

      expect(state.error.fetch).toBe('Event not found');
      expect(state.error.rsvp).toBeNull();

      // Set an RSVP error
      state = eventsReducer(state, {
        type: 'events/createRSVP/rejected',
        payload: 'Capacity full',
      });

      expect(state.error.fetch).toBe('Event not found'); // Unchanged
      expect(state.error.rsvp).toBe('Capacity full');
    });
  });
});
