/**
 * Real EventService Implementation for GSS Client
 * Uses ky HTTP client to communicate with backend API
 */

import { EventService } from './events.service';
import { httpClient, getApiError } from '../http/client';
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventDetailView,
  EventSearchResult,
  EventFilterRequest,
  RSVPRequest,
  RSVP,
  CheckInRequest,
  CheckInResponse,
  EventParticipant,
} from '../../types/event.types';

export class EventServiceImpl extends EventService {
  constructor(baseURL: string = '') {
    super(baseURL);
  }

  async createEvent(event: CreateEventRequest): Promise<Event> {
    try {
      const response = await httpClient
        .post('events', {
          json: event,
        })
        .json<{ event: Event }>();

      return response.event;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getEvent(eventId: string): Promise<EventDetailView> {
    try {
      const response = await httpClient.get(`events/${eventId}`).json<{ event: EventDetailView }>();

      return response.event;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async updateEvent(eventId: string, updates: UpdateEventRequest): Promise<Event> {
    try {
      const response = await httpClient
        .put(`events/${eventId}`, {
          json: updates,
        })
        .json<{ event: Event }>();

      return response.event;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await httpClient.delete(`events/${eventId}`).json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async searchEvents(filters: EventFilterRequest): Promise<EventSearchResult> {
    try {
      const searchParams = new URLSearchParams();

      // Add filters as query parameters
      if (filters.sportIds && filters.sportIds.length > 0) {
        searchParams.append('sportIds', filters.sportIds.join(','));
      }

      if (filters.location) {
        searchParams.append('latitude', filters.location.latitude.toString());
        searchParams.append('longitude', filters.location.longitude.toString());
        searchParams.append('radiusMiles', filters.location.radiusMiles.toString());
      }

      if (filters.dateRange) {
        searchParams.append('startDate', filters.dateRange.start);
        searchParams.append('endDate', filters.dateRange.end);
      }

      if (filters.minCapacity) {
        searchParams.append('minCapacity', filters.minCapacity.toString());
      }

      if (filters.maxCapacity) {
        searchParams.append('maxCapacity', filters.maxCapacity.toString());
      }

      if (filters.depositAmounts && filters.depositAmounts.length > 0) {
        searchParams.append('depositAmounts', filters.depositAmounts.join(','));
      }

      if (filters.visibility) {
        searchParams.append('visibility', filters.visibility);
      }

      if (filters.page) {
        searchParams.append('page', filters.page.toString());
      }

      if (filters.limit) {
        searchParams.append('limit', filters.limit.toString());
      }

      const response = await httpClient
        .get(`events?${searchParams.toString()}`)
        .json<EventSearchResult>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getNearbyEvents(
    latitude: number,
    longitude: number,
    radiusMiles: number
  ): Promise<Event[]> {
    try {
      const searchParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusMiles: radiusMiles.toString(),
      });

      const response = await httpClient
        .get(`events/nearby?${searchParams.toString()}`)
        .json<{ events: Event[] }>();

      return response.events;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getMyEvents(_userId: string): Promise<Event[]> {
    try {
      const response = await httpClient.get(`events/my-events`).json<{ events: Event[] }>();

      return response.events;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getMyRSVPs(_userId: string): Promise<Event[]> {
    try {
      const response = await httpClient.get(`events/my-rsvps`).json<{ events: Event[] }>();

      return response.events;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async createRSVP(request: RSVPRequest): Promise<RSVP> {
    try {
      const response = await httpClient
        .post(`events/${request.eventId}/rsvp`, {
          json: {
            paymentMethodId: request.paymentMethodId,
          },
        })
        .json<{ rsvp: RSVP }>();

      return response.rsvp;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async cancelRSVP(eventId: string, reason?: string): Promise<void> {
    try {
      await httpClient
        .delete(`events/${eventId}/rsvp`, {
          json: { reason },
        })
        .json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getRSVPStatus(eventId: string): Promise<RSVP | null> {
    try {
      const response = await httpClient.get(`events/${eventId}/rsvp`).json<{ rsvp: RSVP | null }>();

      return response.rsvp;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async checkIn(request: CheckInRequest): Promise<CheckInResponse> {
    try {
      const response = await httpClient
        .post(`events/${request.eventId}/check-in`, {
          json: { qrToken: request.qrToken },
        })
        .json<CheckInResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async generateQRCode(eventId: string): Promise<string> {
    try {
      const response = await httpClient.get(`events/${eventId}/qr-code`).json<{ qrCode: string }>();

      return response.qrCode;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async validateQRToken(token: string): Promise<{ valid: boolean; eventId?: string }> {
    try {
      const response = await httpClient
        .post('events/validate-qr', {
          json: { token },
        })
        .json<{ valid: boolean; eventId?: string }>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    try {
      const response = await httpClient
        .get(`events/${eventId}/participants`)
        .json<{ participants: EventParticipant[] }>();

      return response.participants;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async manualCheckIn(eventId: string, userId: string): Promise<CheckInResponse> {
    try {
      const response = await httpClient
        .post(`events/${eventId}/manual-check-in`, {
          json: { userId },
        })
        .json<CheckInResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async generateInviteLink(eventId: string): Promise<string> {
    try {
      const response = await httpClient
        .post(`events/${eventId}/invite-link`)
        .json<{ inviteLink: string }>();

      return response.inviteLink;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async validateInviteToken(token: string): Promise<{ valid: boolean; eventId?: string }> {
    try {
      const response = await httpClient
        .post('events/validate-invite', {
          json: { token },
        })
        .json<{ valid: boolean; eventId?: string }>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }
}
