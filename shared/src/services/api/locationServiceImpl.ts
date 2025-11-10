/**
 * Real LocationService Implementation for GSS Client
 * Uses Google Maps Geocoding API and geolib for distance calculations
 */

import { LocationService } from './location.service';
import { httpClient, getApiError } from '../http/client';
import type {
  Coordinates,
  GeocodeResponse,
  ReverseGeocodeResponse,
  LocationPermissionStatus,
} from '../../types/location.types';

/**
 * Get Google Maps API key from environment
 */
const getGoogleMapsAPIKey = (): string => {
  // Check if we're in a Node.js/web environment with process.env
  if (
    typeof (globalThis as unknown as { process?: { env?: Record<string, string> } }).process !==
    'undefined'
  ) {
    const env = (globalThis as unknown as { process: { env?: Record<string, string> } }).process
      .env;
    if (env && env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      return env.REACT_APP_GOOGLE_MAPS_API_KEY;
    }
  }
  // Fallback - in production, this should throw an error
  return '';
};

export class LocationServiceImpl extends LocationService {
  private googleMapsAPIKey: string;

  constructor(baseURL: string = '') {
    super(baseURL);
    this.googleMapsAPIKey = getGoogleMapsAPIKey();
  }

  async geocodeAddress(address: string): Promise<GeocodeResponse> {
    try {
      // Use backend proxy for geocoding to keep API keys secure
      const response = await httpClient
        .post('location/geocode', {
          json: { address },
        })
        .json<GeocodeResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResponse> {
    try {
      // Use backend proxy for reverse geocoding
      const response = await httpClient
        .post('location/reverse-geocode', {
          json: { latitude, longitude },
        })
        .json<ReverseGeocodeResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in miles
   */
  calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 3958.8; // Earth's radius in miles

    const lat1 = (from.latitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const deltaLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const deltaLon = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in miles
  }

  /**
   * Get current user location
   * Implementation will be platform-specific (browser vs React Native)
   */
  async getCurrentLocation(): Promise<Coordinates> {
    // This is a placeholder - actual implementation will be platform-specific
    // For web: use navigator.geolocation
    // For mobile: use react-native-geolocation-service
    throw new Error(
      'getCurrentLocation must be implemented by platform-specific service (web or mobile)'
    );
  }

  /**
   * Request location permission
   * Implementation will be platform-specific
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    // This is a placeholder - actual implementation will be platform-specific
    // For web: automatically granted when getCurrentLocation is called
    // For mobile: use react-native-permissions
    throw new Error(
      'requestLocationPermission must be implemented by platform-specific service (web or mobile)'
    );
  }
}
