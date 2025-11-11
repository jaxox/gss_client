/**
 * Events Redux Slice Tests
 * Tests for eventsSlice reducers and async thunks
 */

import { configureStore } from '@reduxjs/toolkit';
import eventsReducer, {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getMyRSVPs,
  searchEvents,
  clearError,
  clearAllErrors,
  clearSuccess,
  clearAllSuccess,
  resetSearchResults,
  clearCurrentEvent,
} from '../eventsSlice';
import type { CreateEventRequest, UpdateEventRequest } from '@gss/shared';

// Helper to create a test store
function createTestStore() {
  return configureStore({
    reducer: {
      events: eventsReducer,
    },
  });
}

describe('eventsSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  const validEventRequest: CreateEventRequest = {
    title: 'Test Event',
    description: 'A test event for validation',
    sportId: 'pickleball',
    location: {
      address: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
    },
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    capacity: 8,
    depositAmount: 500,
    visibility: 'public',
  };

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().events;

      expect(state.myEvents).toEqual([]);
      expect(state.myRSVPs).toEqual([]);
      expect(state.searchResults).toEqual([]);
      expect(state.currentEvent).toBeNull();
      expect(state.loading.create).toBe(false);
      expect(state.error.create).toBeNull();
      expect(state.success.create).toBe(false);
    });
  });

  describe('Synchronous Actions', () => {
    describe('clearError', () => {
      it('should clear specific error', () => {
        // Manually set an error in state
        store.dispatch({
          type: 'events/create/rejected',
          payload: 'Test error',
        });

        store.dispatch(clearError('create'));
        const state = store.getState().events;
        expect(state.error.create).toBeNull();
      });
    });

    describe('clearAllErrors', () => {
      it('should clear all errors', () => {
        store.dispatch(clearAllErrors());
        const state = store.getState().events;

        expect(state.error.create).toBeNull();
        expect(state.error.update).toBeNull();
        expect(state.error.delete).toBeNull();
        expect(state.error.fetch).toBeNull();
        expect(state.error.search).toBeNull();
      });
    });

    describe('clearSuccess', () => {
      it('should clear specific success flag', () => {
        store.dispatch(clearSuccess('create'));
        const state = store.getState().events;
        expect(state.success.create).toBe(false);
      });
    });

    describe('clearAllSuccess', () => {
      it('should clear all success flags', () => {
        store.dispatch(clearAllSuccess());
        const state = store.getState().events;

        expect(state.success.create).toBe(false);
        expect(state.success.update).toBe(false);
        expect(state.success.delete).toBe(false);
      });
    });

    describe('resetSearchResults', () => {
      it('should reset search results and pagination', () => {
        store.dispatch(resetSearchResults());
        const state = store.getState().events;

        expect(state.searchResults).toEqual([]);
        expect(state.searchPagination.page).toBe(1);
        expect(state.searchPagination.limit).toBe(10);
        expect(state.searchPagination.total).toBe(0);
        expect(state.searchPagination.hasMore).toBe(false);
      });
    });

    describe('clearCurrentEvent', () => {
      it('should clear current event', () => {
        store.dispatch(clearCurrentEvent());
        const state = store.getState().events;
        expect(state.currentEvent).toBeNull();
      });
    });
  });

  describe('Async Thunks', () => {
    describe('createEvent', () => {
      it('should handle pending state', () => {
        const action = { type: createEvent.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.create).toBe(true);
        expect(state.error.create).toBeNull();
        expect(state.success.create).toBe(false);
      });

      it('should handle fulfilled state', async () => {
        const result = await store.dispatch(createEvent(validEventRequest));

        if (createEvent.fulfilled.match(result)) {
          const state = store.getState().events;
          expect(state.loading.create).toBe(false);
          expect(state.success.create).toBe(true);
          expect(state.myEvents.length).toBeGreaterThan(0);
          expect(state.myEvents[0]).toHaveProperty('id');
          expect(state.myEvents[0].title).toBe(validEventRequest.title);
        }
      });

      it('should handle rejected state with error message', () => {
        const action = {
          type: createEvent.rejected.type,
          payload: 'Failed to create event',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.create).toBe(false);
        expect(state.error.create).toBe('Failed to create event');
        expect(state.success.create).toBe(false);
      });
    });

    describe('getEvent', () => {
      it('should handle pending state', () => {
        const action = { type: getEvent.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(true);
        expect(state.error.fetch).toBeNull();
      });

      it('should handle fulfilled state', async () => {
        // First create an event
        const createResult = await store.dispatch(
          createEvent(validEventRequest),
        );

        if (createEvent.fulfilled.match(createResult)) {
          const eventId = createResult.payload.id;
          const getResult = await store.dispatch(getEvent(eventId));

          if (getEvent.fulfilled.match(getResult)) {
            const state = store.getState().events;
            expect(state.loading.fetch).toBe(false);
            expect(state.currentEvent).toBeDefined();
            expect(state.currentEvent?.id).toBe(eventId);
          }
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: getEvent.rejected.type,
          payload: 'Event not found',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(false);
        expect(state.error.fetch).toBe('Event not found');
      });
    });

    describe('updateEvent', () => {
      it('should handle pending state', () => {
        const action = { type: updateEvent.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.update).toBe(true);
        expect(state.error.update).toBeNull();
        expect(state.success.update).toBe(false);
      });

      it('should handle fulfilled state and update myEvents list', async () => {
        // First create an event
        const createResult = await store.dispatch(
          createEvent(validEventRequest),
        );

        if (createEvent.fulfilled.match(createResult)) {
          const eventId = createResult.payload.id;
          const updates: UpdateEventRequest = { title: 'Updated Title' };

          const updateResult = await store.dispatch(
            updateEvent({ eventId, updates }),
          );

          if (updateEvent.fulfilled.match(updateResult)) {
            const state = store.getState().events;
            expect(state.loading.update).toBe(false);
            expect(state.success.update).toBe(true);

            const updatedEvent = state.myEvents.find(e => e.id === eventId);
            expect(updatedEvent?.title).toBe('Updated Title');
          }
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: updateEvent.rejected.type,
          payload: 'Failed to update event',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.update).toBe(false);
        expect(state.error.update).toBe('Failed to update event');
      });
    });

    describe('deleteEvent', () => {
      it('should handle pending state', () => {
        const action = { type: deleteEvent.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.delete).toBe(true);
        expect(state.error.delete).toBeNull();
        expect(state.success.delete).toBe(false);
      });

      it('should handle fulfilled state and remove from myEvents', async () => {
        // First create an event
        const createResult = await store.dispatch(
          createEvent(validEventRequest),
        );

        if (createEvent.fulfilled.match(createResult)) {
          const eventId = createResult.payload.id;
          const initialCount = store.getState().events.myEvents.length;

          const deleteResult = await store.dispatch(deleteEvent(eventId));

          if (deleteEvent.fulfilled.match(deleteResult)) {
            const state = store.getState().events;
            expect(state.loading.delete).toBe(false);
            expect(state.success.delete).toBe(true);
            expect(state.myEvents.length).toBe(initialCount - 1);
            expect(state.myEvents.find(e => e.id === eventId)).toBeUndefined();
          }
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: deleteEvent.rejected.type,
          payload: 'Failed to delete event',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.delete).toBe(false);
        expect(state.error.delete).toBe('Failed to delete event');
      });
    });

    describe('getMyEvents', () => {
      it('should handle pending state', () => {
        const action = { type: getMyEvents.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(true);
        expect(state.error.fetch).toBeNull();
      });

      it('should handle fulfilled state', async () => {
        const result = await store.dispatch(getMyEvents('user-1'));

        if (getMyEvents.fulfilled.match(result)) {
          const state = store.getState().events;
          expect(state.loading.fetch).toBe(false);
          expect(Array.isArray(state.myEvents)).toBe(true);
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: getMyEvents.rejected.type,
          payload: 'Failed to fetch events',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(false);
        expect(state.error.fetch).toBe('Failed to fetch events');
      });
    });

    describe('getMyRSVPs', () => {
      it('should handle pending state', () => {
        const action = { type: getMyRSVPs.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(true);
        expect(state.error.fetch).toBeNull();
      });

      it('should handle fulfilled state', async () => {
        const result = await store.dispatch(getMyRSVPs('user-1'));

        if (getMyRSVPs.fulfilled.match(result)) {
          const state = store.getState().events;
          expect(state.loading.fetch).toBe(false);
          expect(Array.isArray(state.myRSVPs)).toBe(true);
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: getMyRSVPs.rejected.type,
          payload: 'Failed to fetch RSVPs',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.fetch).toBe(false);
        expect(state.error.fetch).toBe('Failed to fetch RSVPs');
      });
    });

    describe('searchEvents', () => {
      it('should handle pending state', () => {
        const action = { type: searchEvents.pending.type };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.search).toBe(true);
        expect(state.error.search).toBeNull();
      });

      it('should handle fulfilled state with pagination', async () => {
        const result = await store.dispatch(
          searchEvents({ page: 1, limit: 10 }),
        );

        if (searchEvents.fulfilled.match(result)) {
          const state = store.getState().events;
          expect(state.loading.search).toBe(false);
          expect(Array.isArray(state.searchResults)).toBe(true);
          expect(state.searchPagination.page).toBe(result.payload.page);
          expect(state.searchPagination.limit).toBe(result.payload.limit);
          expect(state.searchPagination.total).toBeDefined();
          expect(typeof state.searchPagination.hasMore).toBe('boolean');
        }
      });

      it('should handle rejected state', () => {
        const action = {
          type: searchEvents.rejected.type,
          payload: 'Search failed',
        };
        store.dispatch(action);
        const state = store.getState().events;

        expect(state.loading.search).toBe(false);
        expect(state.error.search).toBe('Search failed');
      });
    });
  });

  describe('State Updates', () => {
    it('should update currentEvent when same event is updated', async () => {
      // Create an event
      const createResult = await store.dispatch(createEvent(validEventRequest));

      if (createEvent.fulfilled.match(createResult)) {
        const eventId = createResult.payload.id;

        // Set as current event
        await store.dispatch(getEvent(eventId));

        // Update the event
        const updates: UpdateEventRequest = { title: 'New Title' };
        const updateResult = await store.dispatch(
          updateEvent({ eventId, updates }),
        );

        if (updateEvent.fulfilled.match(updateResult)) {
          const state = store.getState().events;
          expect(state.currentEvent?.title).toBe('New Title');
        }
      }
    });

    it('should clear currentEvent when it is deleted', async () => {
      // Create an event
      const createResult = await store.dispatch(createEvent(validEventRequest));

      if (createEvent.fulfilled.match(createResult)) {
        const eventId = createResult.payload.id;

        // Set as current event
        await store.dispatch(getEvent(eventId));
        expect(store.getState().events.currentEvent).toBeDefined();

        // Delete the event
        await store.dispatch(deleteEvent(eventId));

        const state = store.getState().events;
        expect(state.currentEvent).toBeNull();
      }
    });

    it('should add new event to beginning of myEvents (unshift)', async () => {
      const result = await store.dispatch(createEvent(validEventRequest));

      if (createEvent.fulfilled.match(result)) {
        const state = store.getState().events;
        expect(state.myEvents[0].id).toBe(result.payload.id);
      }
    });
  });
});
