/**
 * Location Types for GSS Client
 * Defines interfaces for location services and geocoding
 */

import type { EventLocation } from './event.types';

/**
 * Coordinates interface
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Geocoding request
 */
export interface GeocodeRequest {
  address: string;
}

/**
 * Geocoding response
 */
export interface GeocodeResponse {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

/**
 * Reverse geocoding response
 */
export interface ReverseGeocodeResponse extends EventLocation {}

/**
 * Distance calculation request
 */
export interface DistanceRequest {
  from: Coordinates;
  to: Coordinates;
}

/**
 * Distance calculation response
 */
export interface DistanceResponse {
  distance: number; // in miles
  unit: 'miles' | 'kilometers';
}

/**
 * Location permission status
 */
export type LocationPermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted';
