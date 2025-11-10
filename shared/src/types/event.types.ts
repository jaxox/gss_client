/**
 * Event Types for GSS Client
 * Defines interfaces for event creation, management, and lifecycle
 */

import type { User } from './auth.types';

/**
 * Sport type for events
 */
export interface Sport {
  id: string;
  name: string;
  icon?: string;
}

/**
 * Event location with coordinates
 */
export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  venueName?: string;
  venueType?: 'indoor' | 'outdoor';
}

/**
 * Event visibility
 */
export type EventVisibility = 'public' | 'private';

/**
 * Event status
 */
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Main Event interface
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  location: EventLocation;
  dateTime: string; // ISO 8601 format
  capacity: number;
  depositAmount: number; // In cents (0, 500, 1000)
  visibility: EventVisibility;
  hostId: string;
  host: User;
  qrCode?: string; // Base64 or URL
  inviteToken?: string; // For private events
  status: EventStatus;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating an event
 */
export interface CreateEventRequest {
  title: string;
  description: string;
  sportId: string;
  location: EventLocation;
  dateTime: string; // ISO 8601 format
  capacity: number;
  depositAmount: number; // In cents (0, 500, 1000)
  visibility: EventVisibility;
}

/**
 * Response from creating an event
 */
export interface CreateEventResponse {
  event: Event;
}

/**
 * Request payload for updating an event
 */
export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  // All fields optional for partial updates
}

/**
 * Event participant information
 */
export interface EventParticipant {
  userId: string;
  user: User;
  rsvpStatus: 'confirmed' | 'cancelled';
  depositAuthorized: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

/**
 * RSVP request
 */
export interface RSVPRequest {
  eventId: string;
  paymentMethodId?: string; // Required if deposit > 0
}

/**
 * RSVP response
 */
export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'confirmed' | 'cancelled';
  depositAuthorized: boolean;
  depositAmount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Check-in request
 */
export interface CheckInRequest {
  eventId: string;
  qrToken: string;
}

/**
 * Check-in response
 */
export interface CheckInResponse {
  success: boolean;
  depositRefunded: boolean;
  refundAmount?: number;
  message: string;
}

/**
 * Event filter request for search/browse
 */
export interface EventFilterRequest {
  sportIds?: string[];
  location?: {
    latitude: number;
    longitude: number;
    radiusMiles: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  minCapacity?: number;
  maxCapacity?: number;
  depositAmounts?: number[];
  visibility?: EventVisibility;
  page?: number;
  limit?: number;
}

/**
 * Event search result
 */
export interface EventSearchResult {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Event detail view (includes participants)
 */
export interface EventDetailView extends Event {
  participants: EventParticipant[];
}
