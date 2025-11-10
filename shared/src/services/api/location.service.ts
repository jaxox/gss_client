/**
 * LocationService Interface for GSS Client
 * Handles geocoding, reverse geocoding, distance calculation, and location permissions
 */

import type {
  Coordinates,
  GeocodeResponse,
  ReverseGeocodeResponse,
  LocationPermissionStatus,
} from '../../types/location.types';

export interface ILocationService {
  // Geocoding Operations
  geocodeAddress(address: string): Promise<GeocodeResponse>;
  reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResponse>;

  // Distance Calculations
  calculateDistance(from: Coordinates, to: Coordinates): number; // Returns miles

  // User Location
  getCurrentLocation(): Promise<Coordinates>;
  requestLocationPermission(): Promise<LocationPermissionStatus>;
}

/**
 * Abstract base class for LocationService implementations
 */
export abstract class LocationService implements ILocationService {
  protected baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  abstract geocodeAddress(address: string): Promise<GeocodeResponse>;
  abstract reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResponse>;
  abstract calculateDistance(from: Coordinates, to: Coordinates): number;
  abstract getCurrentLocation(): Promise<Coordinates>;
  abstract requestLocationPermission(): Promise<LocationPermissionStatus>;
}
