/**
 * Events Redux Slice for Mobile
 * Manages event creation, updates, and retrieval state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  EventServiceImpl,
  MockEventService,
  getApiError,
  type Event,
  type CreateEventRequest,
  type UpdateEventRequest,
  type EventDetailView,
  type EventFilterRequest,
  type RSVPRequest,
  type RSVP,
} from '@gss/shared';

// Use mock service for development, switch to real service when backend is ready
const USE_MOCK = true;
const eventService = USE_MOCK ? new MockEventService() : new EventServiceImpl();

interface EventsState {
  // Event lists
  myEvents: Event[]; // Events I'm hosting
  myRSVPs: Event[]; // Events I RSVP'd to
  searchResults: Event[]; // Search/browse results

  // Single event detail
  currentEvent: EventDetailView | null;

  // Pagination for search
  searchPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };

  // Loading states
  loading: {
    create: boolean;
    update: boolean;
    delete: boolean;
    fetch: boolean;
    search: boolean;
    rsvp: boolean; // RSVP creation loading
    cancelRsvp: boolean; // RSVP cancellation loading
  };

  // Error states
  error: {
    create: string | null;
    update: string | null;
    delete: string | null;
    fetch: string | null;
    search: string | null;
    rsvp: string | null; // RSVP creation error
    cancelRsvp: string | null; // RSVP cancellation error
  };

  // Success flags for UI feedback
  success: {
    create: boolean;
    update: boolean;
    delete: boolean;
    rsvp: boolean; // RSVP creation success
    cancelRsvp: boolean; // RSVP cancellation success
  };

  // Current RSVP data (for confirmation screens)
  currentRSVP: RSVP | null;
}

const initialState: EventsState = {
  myEvents: [],
  myRSVPs: [],
  searchResults: [],
  currentEvent: null,
  searchPagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  loading: {
    create: false,
    update: false,
    delete: false,
    fetch: false,
    search: false,
    rsvp: false,
    cancelRsvp: false,
  },
  error: {
    create: null,
    update: null,
    delete: null,
    fetch: null,
    search: null,
    rsvp: null,
    cancelRsvp: null,
  },
  success: {
    create: false,
    update: false,
    delete: false,
    rsvp: false,
    cancelRsvp: false,
  },
  currentRSVP: null,
};

// Async thunks
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData: CreateEventRequest, { rejectWithValue }) => {
    try {
      const event = await eventService.createEvent(eventData);
      return event;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const getEvent = createAsyncThunk(
  'events/getEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const event = await eventService.getEvent(eventId);
      return event;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async (
    { eventId, updates }: { eventId: string; updates: UpdateEventRequest },
    { rejectWithValue },
  ) => {
    try {
      const event = await eventService.updateEvent(eventId, updates);
      return event;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (eventId: string, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const getMyEvents = createAsyncThunk(
  'events/getMyEvents',
  async (userId: string, { rejectWithValue }) => {
    try {
      const events = await eventService.getMyEvents(userId);
      return events;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const getMyRSVPs = createAsyncThunk(
  'events/getMyRSVPs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const events = await eventService.getMyRSVPs(userId);
      return events;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const searchEvents = createAsyncThunk(
  'events/search',
  async (filters: EventFilterRequest, { rejectWithValue }) => {
    try {
      const result = await eventService.searchEvents(filters);
      return result;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

// RSVP Operations
export const createRSVP = createAsyncThunk(
  'events/createRSVP',
  async (request: RSVPRequest, { rejectWithValue }) => {
    try {
      const rsvp = await eventService.createRSVP(request);
      return rsvp;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

export const cancelRSVP = createAsyncThunk(
  'events/cancelRSVP',
  async (
    { eventId, reason }: { eventId: string; reason?: string },
    { rejectWithValue },
  ) => {
    try {
      await eventService.cancelRSVP(eventId, reason);
      return eventId;
    } catch (error) {
      const apiError = getApiError(error);
      return rejectWithValue(apiError.message);
    }
  },
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state, action: PayloadAction<keyof EventsState['error']>) => {
      state.error[action.payload] = null;
    },
    clearAllErrors: state => {
      state.error = initialState.error;
    },
    clearSuccess: (
      state,
      action: PayloadAction<keyof EventsState['success']>,
    ) => {
      state.success[action.payload] = false;
    },
    clearAllSuccess: state => {
      state.success = initialState.success;
    },
    resetSearchResults: state => {
      state.searchResults = [];
      state.searchPagination = initialState.searchPagination;
    },
    clearCurrentEvent: state => {
      state.currentEvent = null;
    },
  },
  extraReducers: builder => {
    // Create Event
    builder
      .addCase(createEvent.pending, state => {
        state.loading.create = true;
        state.error.create = null;
        state.success.create = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success.create = true;
        // Optimistically add to myEvents
        state.myEvents.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as string;
      });

    // Get Event Detail
    builder
      .addCase(getEvent.pending, state => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentEvent = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as string;
      });

    // Update Event
    builder
      .addCase(updateEvent.pending, state => {
        state.loading.update = true;
        state.error.update = null;
        state.success.update = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success.update = true;

        // Update in myEvents list
        const index = state.myEvents.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.myEvents[index] = action.payload;
        }

        // Update current event if it's the same
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = { ...state.currentEvent, ...action.payload };
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as string;
      });

    // Delete Event
    builder
      .addCase(deleteEvent.pending, state => {
        state.loading.delete = true;
        state.error.delete = null;
        state.success.delete = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success.delete = true;

        // Remove from myEvents
        state.myEvents = state.myEvents.filter(e => e.id !== action.payload);

        // Clear current event if it was deleted
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload as string;
      });

    // Get My Events
    builder
      .addCase(getMyEvents.pending, state => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getMyEvents.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.myEvents = action.payload;
      })
      .addCase(getMyEvents.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as string;
      });

    // Get My RSVPs
    builder
      .addCase(getMyRSVPs.pending, state => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getMyRSVPs.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.myRSVPs = action.payload;
      })
      .addCase(getMyRSVPs.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as string;
      });

    // Search Events
    builder
      .addCase(searchEvents.pending, state => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.events;
        state.searchPagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload as string;
      });

    // Create RSVP
    builder
      .addCase(createRSVP.pending, state => {
        state.loading.rsvp = true;
        state.error.rsvp = null;
        state.success.rsvp = false;
      })
      .addCase(createRSVP.fulfilled, (state, action) => {
        state.loading.rsvp = false;
        state.success.rsvp = true;
        state.currentRSVP = action.payload;
        // Note: myRSVPs will be refreshed by calling getMyRSVPs after successful RSVP
      })
      .addCase(createRSVP.rejected, (state, action) => {
        state.loading.rsvp = false;
        state.error.rsvp = action.payload as string;
      });

    // Cancel RSVP
    builder
      .addCase(cancelRSVP.pending, state => {
        state.loading.cancelRsvp = true;
        state.error.cancelRsvp = null;
        state.success.cancelRsvp = false;
      })
      .addCase(cancelRSVP.fulfilled, (state, action) => {
        state.loading.cancelRsvp = false;
        state.success.cancelRsvp = true;
        // Remove from myRSVPs list
        state.myRSVPs = state.myRSVPs.filter(
          event => event.id !== action.payload,
        );
        // Clear currentRSVP if it matches
        if (state.currentRSVP?.eventId === action.payload) {
          state.currentRSVP = null;
        }
      })
      .addCase(cancelRSVP.rejected, (state, action) => {
        state.loading.cancelRsvp = false;
        state.error.cancelRsvp = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearAllErrors,
  clearSuccess,
  clearAllSuccess,
  resetSearchResults,
  clearCurrentEvent,
} = eventsSlice.actions;

export default eventsSlice.reducer;
