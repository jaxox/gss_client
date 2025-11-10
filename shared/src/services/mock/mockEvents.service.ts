/**
 * MockEventService for GSS Client
 * Mock implementation for development and testing
 */

import { EventService } from '../api/events.service';
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
  Sport,
} from '../../types/event.types';
import type { User } from '../../types/auth.types';

export class MockEventService extends EventService {
  private mockEvents: Event[] = [];
  private mockRSVPs: RSVP[] = [];
  private mockParticipants: Map<string, EventParticipant[]> = new Map();
  private eventIdCounter = 1;
  private rsvpIdCounter = 1;

  constructor() {
    super('mock://api');
    this.initializeMockData();
  }

  // Reset mock data for testing
  public reset(): void {
    this.mockEvents = [];
    this.mockRSVPs = [];
    this.mockParticipants.clear();
    this.eventIdCounter = 1;
    this.rsvpIdCounter = 1;
  }

  private initializeMockData(): void {
    // Mock sports
    const pickleball: Sport = {
      id: 'sport-1',
      name: 'Pickleball',
      icon: '🏓',
    };

    // Mock user (host)
    const mockHost: User = {
      id: 'user-1',
      email: 'host@example.com',
      displayName: 'Event Host',
      homeCity: 'San Francisco',
      reliabilityScore: 0.95,
      level: 5,
      xp: 5000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Pre-populate with test events
    this.mockEvents.push({
      id: 'event-1',
      title: 'Morning Pickleball Session',
      description: 'Join us for a fun morning pickleball game!',
      sport: pickleball,
      location: {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
        venueName: 'Golden Gate Park Courts',
        venueType: 'outdoor',
      },
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      capacity: 8,
      depositAmount: 500, // $5
      visibility: 'public',
      hostId: 'user-1',
      host: mockHost,
      qrCode: 'mock-qr-code-base64-string',
      status: 'upcoming',
      participantCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async createEvent(event: CreateEventRequest): Promise<Event> {
    await this.simulateNetworkDelay();

    const newEvent: Event = {
      id: `event-${this.eventIdCounter++}`,
      title: event.title,
      description: event.description,
      sport: { id: event.sportId, name: 'Pickleball', icon: '🏓' }, // Mock sport
      location: event.location,
      dateTime: event.dateTime,
      capacity: event.capacity,
      depositAmount: event.depositAmount,
      visibility: event.visibility,
      hostId: 'current-user-id', // Would come from auth context
      host: {
        id: 'current-user-id',
        email: 'user@example.com',
        displayName: 'Current User',
        homeCity: 'San Francisco',
        reliabilityScore: 0.85,
        level: 3,
        xp: 2500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      qrCode: `mock-qr-code-${this.eventIdCounter}`,
      inviteToken:
        event.visibility === 'private' ? `invite-token-${this.eventIdCounter}` : undefined,
      status: 'upcoming',
      participantCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockEvents.push(newEvent);
    return newEvent;
  }

  async getEvent(eventId: string): Promise<EventDetailView> {
    await this.simulateNetworkDelay();

    const event = this.mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const participants = this.mockParticipants.get(eventId) || [];

    return {
      ...event,
      participants,
    };
  }

  async updateEvent(eventId: string, updates: UpdateEventRequest): Promise<Event> {
    await this.simulateNetworkDelay();

    const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    this.mockEvents[eventIndex] = {
      ...this.mockEvents[eventIndex],
      ...updates,
      sport: updates.sportId
        ? { id: updates.sportId, name: 'Pickleball', icon: '🏓' }
        : this.mockEvents[eventIndex].sport,
      updatedAt: new Date().toISOString(),
    };

    return this.mockEvents[eventIndex];
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.simulateNetworkDelay();

    const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    this.mockEvents.splice(eventIndex, 1);
  }

  async searchEvents(filters: EventFilterRequest): Promise<EventSearchResult> {
    await this.simulateNetworkDelay();

    let filteredEvents = [...this.mockEvents];

    // Apply filters
    if (filters.sportIds && filters.sportIds.length > 0) {
      filteredEvents = filteredEvents.filter(e => filters.sportIds!.includes(e.sport.id));
    }

    if (filters.visibility) {
      filteredEvents = filteredEvents.filter(e => e.visibility === filters.visibility);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    return {
      events: paginatedEvents,
      total: filteredEvents.length,
      page,
      limit,
      hasMore: endIndex < filteredEvents.length,
    };
  }

  async getNearbyEvents(
    _latitude: number,
    _longitude: number,
    _radiusMiles: number
  ): Promise<Event[]> {
    await this.simulateNetworkDelay();

    // Simple mock - return first 5 events
    return this.mockEvents.slice(0, 5);
  }

  async getMyEvents(_userId: string): Promise<Event[]> {
    await this.simulateNetworkDelay();

    // Return events where current user is host
    return this.mockEvents.filter(e => e.hostId === 'current-user-id');
  }

  async getMyRSVPs(_userId: string): Promise<Event[]> {
    await this.simulateNetworkDelay();

    // Return events where current user has RSVP'd
    const rsvpEventIds = this.mockRSVPs
      .filter(r => r.userId === 'current-user-id')
      .map(r => r.eventId);
    return this.mockEvents.filter(e => rsvpEventIds.includes(e.id));
  }

  async createRSVP(request: RSVPRequest): Promise<RSVP> {
    await this.simulateNetworkDelay();

    const event = this.mockEvents.find(e => e.id === request.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const newRSVP: RSVP = {
      id: `rsvp-${this.rsvpIdCounter++}`,
      eventId: request.eventId,
      userId: 'current-user-id',
      status: 'confirmed',
      depositAuthorized: event.depositAmount > 0,
      depositAmount: event.depositAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockRSVPs.push(newRSVP);

    // Update participant count
    const eventIndex = this.mockEvents.findIndex(e => e.id === request.eventId);
    if (eventIndex !== -1) {
      this.mockEvents[eventIndex].participantCount++;
    }

    return newRSVP;
  }

  async cancelRSVP(eventId: string, _reason?: string): Promise<void> {
    await this.simulateNetworkDelay();

    const rsvpIndex = this.mockRSVPs.findIndex(
      r => r.eventId === eventId && r.userId === 'current-user-id'
    );

    if (rsvpIndex !== -1) {
      this.mockRSVPs.splice(rsvpIndex, 1);

      // Update participant count
      const eventIndex = this.mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        this.mockEvents[eventIndex].participantCount--;
      }
    }
  }

  async getRSVPStatus(eventId: string): Promise<RSVP | null> {
    await this.simulateNetworkDelay();

    const rsvp = this.mockRSVPs.find(r => r.eventId === eventId && r.userId === 'current-user-id');

    return rsvp || null;
  }

  async checkIn(_request: CheckInRequest): Promise<CheckInResponse> {
    await this.simulateNetworkDelay();

    // Mock successful check-in with deposit refund
    return {
      success: true,
      depositRefunded: true,
      refundAmount: 500,
      message: 'Checked in successfully! Deposit refunded.',
    };
  }

  async generateQRCode(_eventId: string): Promise<string> {
    await this.simulateNetworkDelay();

    return `mock-qr-code-${_eventId}`;
  }

  async validateQRToken(_token: string): Promise<{ valid: boolean; eventId?: string }> {
    await this.simulateNetworkDelay();

    // Mock validation - always valid for testing
    return {
      valid: true,
      eventId: 'event-1',
    };
  }

  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    await this.simulateNetworkDelay();

    return this.mockParticipants.get(eventId) || [];
  }

  async manualCheckIn(_eventId: string, _userId: string): Promise<CheckInResponse> {
    await this.simulateNetworkDelay();

    return {
      success: true,
      depositRefunded: true,
      refundAmount: 500,
      message: 'Manually checked in successfully!',
    };
  }

  async generateInviteLink(eventId: string): Promise<string> {
    await this.simulateNetworkDelay();

    return `gss://invite/${eventId}/token-${Date.now()}`;
  }

  async validateInviteToken(_token: string): Promise<{ valid: boolean; eventId?: string }> {
    await this.simulateNetworkDelay();

    return {
      valid: true,
      eventId: 'event-1',
    };
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
