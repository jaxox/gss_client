/**
 * Event Validation Schemas for GSS Client
 * Zod-based validation for event creation and updates
 */

import { z } from 'zod';

// Event title validation
export const eventTitleSchema = z
  .string()
  .min(3, 'Event title must be at least 3 characters')
  .max(100, 'Event title must not exceed 100 characters')
  .trim();

// Event description validation
export const eventDescriptionSchema = z
  .string()
  .min(10, 'Event description must be at least 10 characters')
  .max(500, 'Event description must not exceed 500 characters')
  .trim();

// Sport ID validation
export const sportIdSchema = z.string().min(1, 'Please select a sport');

// Capacity validation
export const capacitySchema = z
  .number()
  .int('Capacity must be a whole number')
  .min(1, 'Capacity must be at least 1')
  .max(100, 'Capacity must not exceed 100 participants');

// Deposit amount validation (in cents)
export const depositAmountSchema = z
  .number()
  .int('Deposit amount must be a whole number')
  .refine(val => [0, 500, 1000].includes(val), {
    message: 'Deposit amount must be $0, $5, or $10',
  });

// Coordinates validation
export const coordinatesSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

// Event location validation
export const eventLocationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  coordinates: coordinatesSchema,
  venueName: z.string().optional(),
  venueType: z.enum(['indoor', 'outdoor']).optional(),
});

// Date/time validation (must be in the future)
export const eventDateTimeSchema = z
  .string()
  .datetime('Invalid date/time format')
  .refine(
    dateTime => {
      const eventDate = new Date(dateTime);
      const now = new Date();
      return eventDate > now;
    },
    {
      message: 'Event date must be in the future',
    }
  );

// Visibility validation
export const eventVisibilitySchema = z.enum(['public', 'private'], {
  message: 'Visibility must be either public or private',
});

// Complete create event request validation schema
export const createEventRequestSchema = z.object({
  title: eventTitleSchema,
  description: eventDescriptionSchema,
  sportId: sportIdSchema,
  location: eventLocationSchema,
  dateTime: eventDateTimeSchema,
  capacity: capacitySchema,
  depositAmount: depositAmountSchema,
  visibility: eventVisibilitySchema,
});

// Update event request validation schema (all fields optional)
export const updateEventRequestSchema = createEventRequestSchema.partial();

// Helper function to validate create event request
export function validateCreateEventRequest(
  data: unknown
): ReturnType<typeof createEventRequestSchema.safeParse> {
  return createEventRequestSchema.safeParse(data);
}

// Helper function to validate update event request
export function validateUpdateEventRequest(
  data: unknown
): ReturnType<typeof updateEventRequestSchema.safeParse> {
  return updateEventRequestSchema.safeParse(data);
}

// Export types inferred from schemas
export type CreateEventRequestValidation = z.infer<typeof createEventRequestSchema>;
export type UpdateEventRequestValidation = z.infer<typeof updateEventRequestSchema>;

// Field-level validation helpers for real-time form validation
export const validateEventTitle = (value: string): string | null => {
  const result = eventTitleSchema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || 'Invalid title';
};

export const validateEventDescription = (value: string): string | null => {
  const result = eventDescriptionSchema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || 'Invalid description';
};

export const validateCapacity = (value: number): string | null => {
  const result = capacitySchema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || 'Invalid capacity';
};

export const validateDepositAmount = (value: number): string | null => {
  const result = depositAmountSchema.safeParse(value);
  return result.success ? null : result.error.issues[0]?.message || 'Invalid deposit amount';
};

export const validateCoordinates = (lat: number, lon: number): string | null => {
  const result = coordinatesSchema.safeParse({ latitude: lat, longitude: lon });
  return result.success ? null : result.error.issues[0]?.message || 'Invalid coordinates';
};

// Constants for form defaults
export const DEFAULT_CAPACITY = 8;
export const DEFAULT_DEPOSIT_AMOUNT = 0; // Free event
export const DEFAULT_VISIBILITY = 'public' as const;
export const DEPOSIT_OPTIONS = [
  { label: 'Free', value: 0 },
  { label: '$5', value: 500 },
  { label: '$10', value: 1000 },
] as const;
