/**
 * EventService Interface for GSS Client
 * Handles event creation, management, RSVP, and check-in operations
 */

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

export interface IEventService {
  // Event CRUD Operations
  createEvent(event: CreateEventRequest): Promise<Event>;
  getEvent(eventId: string): Promise<EventDetailView>;
  updateEvent(eventId: string, updates: UpdateEventRequest): Promise<Event>;
  deleteEvent(eventId: string): Promise<void>;

  // Event Discovery
  searchEvents(filters: EventFilterRequest): Promise<EventSearchResult>;
  getNearbyEvents(latitude: number, longitude: number, radiusMiles: number): Promise<Event[]>;
  getMyEvents(userId: string): Promise<Event[]>; // Events user created (host)
  getMyRSVPs(userId: string): Promise<Event[]>; // Events user RSVP'd to

  // RSVP Management
  createRSVP(request: RSVPRequest): Promise<RSVP>;
  cancelRSVP(eventId: string, reason?: string): Promise<void>;
  getRSVPStatus(eventId: string): Promise<RSVP | null>;

  // Check-In Operations
  checkIn(request: CheckInRequest): Promise<CheckInResponse>;
  generateQRCode(eventId: string): Promise<string>; // Returns QR code image URL/base64
  validateQRToken(token: string): Promise<{ valid: boolean; eventId?: string }>;

  // Host Operations
  getEventParticipants(eventId: string): Promise<EventParticipant[]>;
  manualCheckIn(eventId: string, userId: string): Promise<CheckInResponse>;

  // Private Events
  generateInviteLink(eventId: string): Promise<string>;
  validateInviteToken(token: string): Promise<{ valid: boolean; eventId?: string }>;
}

/**
 * Abstract base class for EventService implementations
 */
export abstract class EventService implements IEventService {
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  abstract createEvent(event: CreateEventRequest): Promise<Event>;
  abstract getEvent(eventId: string): Promise<EventDetailView>;
  abstract updateEvent(eventId: string, updates: UpdateEventRequest): Promise<Event>;
  abstract deleteEvent(eventId: string): Promise<void>;
  abstract searchEvents(filters: EventFilterRequest): Promise<EventSearchResult>;
  abstract getNearbyEvents(
    latitude: number,
    longitude: number,
    radiusMiles: number
  ): Promise<Event[]>;
  abstract getMyEvents(userId: string): Promise<Event[]>;
  abstract getMyRSVPs(userId: string): Promise<Event[]>;
  abstract createRSVP(request: RSVPRequest): Promise<RSVP>;
  abstract cancelRSVP(eventId: string, reason?: string): Promise<void>;
  abstract getRSVPStatus(eventId: string): Promise<RSVP | null>;
  abstract checkIn(request: CheckInRequest): Promise<CheckInResponse>;
  abstract generateQRCode(eventId: string): Promise<string>;
  abstract validateQRToken(token: string): Promise<{ valid: boolean; eventId?: string }>;
  abstract getEventParticipants(eventId: string): Promise<EventParticipant[]>;
  abstract manualCheckIn(eventId: string, userId: string): Promise<CheckInResponse>;
  abstract generateInviteLink(eventId: string): Promise<string>;
  abstract validateInviteToken(token: string): Promise<{ valid: boolean; eventId?: string }>;
}
