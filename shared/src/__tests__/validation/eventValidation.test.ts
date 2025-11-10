/**
 * Event Validation Tests
 * Tests for Zod validation schemas
 */

import {
  validateEventTitle,
  validateEventDescription,
  validateCapacity,
  validateDepositAmount,
  validateCoordinates,
  validateCreateEventRequest,
  DEFAULT_CAPACITY,
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_VISIBILITY,
  DEPOSIT_OPTIONS,
} from '../../validation/eventValidation';
import type { CreateEventRequest } from '../../types/event.types';

describe('Event Validation', () => {
  describe('validateEventTitle', () => {
    it('should validate valid titles', () => {
      expect(validateEventTitle('Weekend Pickleball')).toBeNull();
      expect(validateEventTitle('A'.repeat(3))).toBeNull(); // Min length
      expect(validateEventTitle('A'.repeat(100))).toBeNull(); // Max length
    });

    it('should reject titles that are too short', () => {
      const error = validateEventTitle('AB');
      expect(error).toContain('at least 3 characters');
    });

    it('should reject titles that are too long', () => {
      const error = validateEventTitle('A'.repeat(101));
      expect(error).toContain('100 characters');
    });

    it('should reject empty titles', () => {
      const error = validateEventTitle('');
      expect(error).toContain('3 characters');
    });
  });

  describe('validateEventDescription', () => {
    it('should validate valid descriptions', () => {
      expect(validateEventDescription('A fun game for everyone to enjoy!')).toBeNull();
      expect(validateEventDescription('A'.repeat(10))).toBeNull(); // Min length
      expect(validateEventDescription('A'.repeat(500))).toBeNull(); // Max length
    });

    it('should reject descriptions that are too short', () => {
      const error = validateEventDescription('Too short');
      expect(error).toContain('at least 10 characters');
    });

    it('should reject descriptions that are too long', () => {
      const error = validateEventDescription('A'.repeat(501));
      expect(error).toContain('500 characters');
    });
  });

  describe('validateCapacity', () => {
    it('should validate valid capacities', () => {
      expect(validateCapacity(1)).toBeNull(); // Min
      expect(validateCapacity(8)).toBeNull(); // Default
      expect(validateCapacity(100)).toBeNull(); // Max
    });

    it('should reject capacity below minimum', () => {
      const error = validateCapacity(0);
      expect(error).toContain('must be at least 1');
    });

    it('should reject capacity above maximum', () => {
      const error = validateCapacity(101);
      expect(error).toContain('100');
    });

    it('should reject non-integer capacity', () => {
      const error = validateCapacity(8.5);
      expect(error).toBeTruthy();
    });
  });

  describe('validateDepositAmount', () => {
    it('should validate allowed deposit amounts', () => {
      expect(validateDepositAmount(0)).toBeNull();
      expect(validateDepositAmount(500)).toBeNull();
      expect(validateDepositAmount(1000)).toBeNull();
    });

    it('should reject disallowed deposit amounts', () => {
      const error = validateDepositAmount(250);
      expect(error).toContain('$0, $5, or $10');
    });

    it('should reject negative deposits', () => {
      const error = validateDepositAmount(-100);
      expect(error).toContain('$0, $5, or $10');
    });
  });

  describe('validateCoordinates', () => {
    it('should validate valid coordinates', () => {
      expect(validateCoordinates(37.7749, -122.4194)).toBeNull();
      expect(validateCoordinates(-90, -180)).toBeNull(); // Min bounds
      expect(validateCoordinates(90, 180)).toBeNull(); // Max bounds
    });

    it('should reject latitude out of range', () => {
      const error = validateCoordinates(91, -122.4194);
      expect(error).toBeTruthy();
    });

    it('should reject longitude out of range', () => {
      const error = validateCoordinates(37.7749, 181);
      expect(error).toBeTruthy();
    });
  });

  describe('validateCreateEventRequest', () => {
    const validRequest: CreateEventRequest = {
      title: 'Test Event',
      description: 'A test event for validation',
      sportId: 'pickleball',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        coordinates: { latitude: 37.7749, longitude: -122.4194 },
      },
      dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      capacity: 8,
      depositAmount: 500,
      visibility: 'public',
    };

    it('should validate a complete valid request', () => {
      const result = validateCreateEventRequest(validRequest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe(validRequest.title);
      }
    });

    it('should reject past event dates', () => {
      const pastRequest = {
        ...validRequest,
        dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      };
      const result = validateCreateEventRequest(pastRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || '';
        expect(errorMessage).toContain('Event date must be in the future');
      }
    });

    it('should reject invalid title length', () => {
      const invalidRequest = { ...validRequest, title: 'AB' };
      const result = validateCreateEventRequest(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject invalid deposit amount', () => {
      const invalidRequest = { ...validRequest, depositAmount: 250 };
      const result = validateCreateEventRequest(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject invalid visibility', () => {
      const invalidRequest = { ...validRequest, visibility: 'invalid' };
      const result = validateCreateEventRequest(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const incompleteRequest = { title: 'Test' } as CreateEventRequest;
      const result = validateCreateEventRequest(incompleteRequest);
      expect(result.success).toBe(false);
    });
  });

  describe('Constants', () => {
    it('should export correct default values', () => {
      expect(DEFAULT_CAPACITY).toBe(8);
      expect(DEFAULT_DEPOSIT_AMOUNT).toBe(0);
      expect(DEFAULT_VISIBILITY).toBe('public');
    });

    it('should export correct deposit options', () => {
      expect(DEPOSIT_OPTIONS).toEqual([
        { label: 'Free', value: 0 },
        { label: '$5', value: 500 },
        { label: '$10', value: 1000 },
      ]);
    });
  });
});
