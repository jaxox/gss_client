/**
 * MockLocationService for GSS Client
 * Mock implementation for development and testing
 */

import { LocationService } from '../api/location.service';
import type {
  Coordinates,
  GeocodeResponse,
  ReverseGeocodeResponse,
  LocationPermissionStatus,
} from '../../types/location.types';

export class MockLocationService extends LocationService {
  private mockLocations: Map<string, GeocodeResponse> = new Map();
  private permissionStatus: LocationPermissionStatus = 'not-determined';

  constructor() {
    super('mock://api');
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Pre-populate with common addresses
    this.mockLocations.set('123 Main St, San Francisco, CA 94102', {
      latitude: 37.7749,
      longitude: -122.4194,
      formattedAddress: '123 Main St, San Francisco, CA 94102, USA',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    });

    this.mockLocations.set('Golden Gate Park', {
      latitude: 37.7694,
      longitude: -122.4862,
      formattedAddress: 'Golden Gate Park, San Francisco, CA 94118, USA',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94118',
    });
  }

  async geocodeAddress(address: string): Promise<GeocodeResponse> {
    await this.simulateNetworkDelay();

    // Check if we have a cached mock location
    const mockLocation = this.mockLocations.get(address);
    if (mockLocation) {
      return mockLocation;
    }

    // Generate a mock location for any address
    const hashCode = this.hashString(address);
    const latitude = 37.7749 + (hashCode % 1000) / 10000; // San Francisco area
    const longitude = -122.4194 + (hashCode % 1000) / 10000;

    return {
      latitude,
      longitude,
      formattedAddress: `${address}, USA`,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
    };
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResponse> {
    await this.simulateNetworkDelay();

    return {
      address: `${Math.floor(latitude * 100)} Mock St`,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      coordinates: {
        latitude,
        longitude,
      },
      venueName: 'Mock Venue',
      venueType: 'outdoor',
    };
  }

  calculateDistance(from: Coordinates, to: Coordinates): number {
    // Haversine formula for distance calculation
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

  async getCurrentLocation(): Promise<Coordinates> {
    await this.simulateNetworkDelay();

    // Return mock San Francisco coordinates
    return {
      latitude: 37.7749,
      longitude: -122.4194,
    };
  }

  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    await this.simulateNetworkDelay();

    // Simulate permission grant
    this.permissionStatus = 'granted';
    return this.permissionStatus;
  }

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 500 + 250; // 250-750ms (faster than event service)
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
