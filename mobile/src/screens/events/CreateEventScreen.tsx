/**
 * Create Event Screen
 * Mobile event creation form with validation
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  SegmentedButtons,
  HelperText,
  Card,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createEvent, clearError } from '../../store/events/eventsSlice';
import {
  validateEventTitle,
  validateEventDescription,
  validateCapacity,
  validateDepositAmount,
  DEFAULT_CAPACITY,
  DEFAULT_DEPOSIT_AMOUNT,
  DEFAULT_VISIBILITY,
  DEPOSIT_OPTIONS,
} from '@shared/validation/eventValidation';
import type { CreateEventRequest } from '@shared/types/event.types';

// Sport options (hardcoded for now, can be fetched from backend later)
const SPORTS = [
  { label: 'Pickleball', value: 'pickleball', icon: '🏓' },
  { label: 'Basketball', value: 'basketball', icon: '🏀' },
  { label: 'Soccer', value: 'soccer', icon: '⚽' },
  { label: 'Tennis', value: 'tennis', icon: '🎾' },
  { label: 'Volleyball', value: 'volleyball', icon: '🏐' },
];

interface FormErrors {
  title?: string | null;
  description?: string | null;
  capacity?: string | null;
  depositAmount?: string | null;
  location?: string | null;
  dateTime?: string | null;
}

export default function CreateEventScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.events.loading.create);
  const error = useAppSelector(state => state.events.error.create);
  const success = useAppSelector(state => state.events.success.create);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sportId, setSportId] = useState('pickleball');
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY.toString());
  const [depositAmount, setDepositAmount] = useState(DEFAULT_DEPOSIT_AMOUNT);
  const [visibility, setVisibility] = useState<'public' | 'private'>(
    DEFAULT_VISIBILITY,
  );
  const [dateTime, setDateTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time validation
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (touched.title) {
      setErrors(prev => ({ ...prev, title: validateEventTitle(value) }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (touched.description) {
      setErrors(prev => ({
        ...prev,
        description: validateEventDescription(value),
      }));
    }
  };

  const handleCapacityChange = (value: string) => {
    setCapacity(value);
    if (touched.capacity) {
      const numValue = parseInt(value, 10);
      setErrors(prev => ({
        ...prev,
        capacity: isNaN(numValue)
          ? 'Invalid number'
          : validateCapacity(numValue),
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate on blur
    if (field === 'title') {
      setErrors(prev => ({ ...prev, title: validateEventTitle(title) }));
    } else if (field === 'description') {
      setErrors(prev => ({
        ...prev,
        description: validateEventDescription(description),
      }));
    } else if (field === 'capacity') {
      const numValue = parseInt(capacity, 10);
      setErrors(prev => ({
        ...prev,
        capacity: isNaN(numValue)
          ? 'Invalid number'
          : validateCapacity(numValue),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: validateEventTitle(title),
      description: validateEventDescription(description),
      capacity: validateCapacity(parseInt(capacity, 10)),
      depositAmount: validateDepositAmount(depositAmount),
    };

    // Basic location validation
    if (!address.trim()) {
      newErrors.location = 'Address is required';
    }
    if (!city.trim()) {
      newErrors.location = 'City is required';
    }
    if (!state.trim()) {
      newErrors.location = 'State is required';
    }
    if (!zipCode.trim() || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.location = 'Valid ZIP code is required';
    }

    // Date/time validation
    if (!dateTime) {
      newErrors.dateTime = 'Date and time are required';
    } else {
      const eventDate = new Date(dateTime);
      const now = new Date();
      if (eventDate <= now) {
        newErrors.dateTime = 'Event must be in the future';
      }
    }

    setErrors(newErrors);
    setTouched({
      title: true,
      description: true,
      capacity: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      dateTime: true,
    });

    return !Object.values(newErrors).some(err => err !== null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // For now, use hardcoded coordinates (San Francisco)
    // TODO: Integrate geocoding service
    const eventData: CreateEventRequest = {
      title,
      description,
      sportId,
      capacity: parseInt(capacity, 10),
      depositAmount,
      visibility,
      dateTime: new Date(dateTime).toISOString(),
      location: {
        address,
        city,
        state,
        zipCode,
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      },
    };

    try {
      await dispatch(createEvent(eventData)).unwrap();
      // Success! Navigation would happen here
      // TODO: Navigate to event detail screen
    } catch (err) {
      // Error is handled by Redux state
      console.error('Failed to create event:', err);
    }
  };

  const handleCancel = () => {
    // TODO: Navigate back or show confirmation dialog
    console.log('Cancel event creation');
  };

  React.useEffect(() => {
    if (error) {
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError('create'));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Create Event
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Fill in the details to create your sports event
            </Text>

            <Divider style={styles.divider} />

            {/* Error Banner */}
            {error && (
              <Card
                style={[
                  styles.errorCard,
                  { backgroundColor: theme.colors.errorContainer },
                ]}
              >
                <Card.Content>
                  <Text style={{ color: theme.colors.error }}>{error}</Text>
                </Card.Content>
              </Card>
            )}

            {/* Success Banner */}
            {success && (
              <Card
                style={[
                  styles.successCard,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Card.Content>
                  <Text style={{ color: theme.colors.primary }}>
                    Event created successfully!
                  </Text>
                </Card.Content>
              </Card>
            )}

            {/* Title Input */}
            <TextInput
              label="Event Title *"
              value={title}
              onChangeText={handleTitleChange}
              onBlur={() => handleBlur('title')}
              mode="outlined"
              error={touched.title && !!errors.title}
              maxLength={100}
              style={styles.input}
              disabled={loading}
            />
            <HelperText type="error" visible={touched.title && !!errors.title}>
              {errors.title}
            </HelperText>

            {/* Description Input */}
            <TextInput
              label="Description *"
              value={description}
              onChangeText={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={touched.description && !!errors.description}
              maxLength={500}
              style={styles.input}
              disabled={loading}
            />
            <HelperText
              type="info"
              visible={!errors.description && description.length > 0}
            >
              {description.length}/500 characters
            </HelperText>
            <HelperText
              type="error"
              visible={touched.description && !!errors.description}
            >
              {errors.description}
            </HelperText>

            {/* Sport Selector */}
            <Text variant="labelLarge" style={styles.label}>
              Sport *
            </Text>
            <SegmentedButtons
              value={sportId}
              onValueChange={setSportId}
              buttons={SPORTS.map(sport => ({
                value: sport.value,
                label: `${sport.icon} ${sport.label}`,
              }))}
              style={styles.segmentedButtons}
            />

            {/* Capacity Input */}
            <TextInput
              label="Capacity *"
              value={capacity}
              onChangeText={handleCapacityChange}
              onBlur={() => handleBlur('capacity')}
              mode="outlined"
              keyboardType="number-pad"
              error={touched.capacity && !!errors.capacity}
              style={styles.input}
              disabled={loading}
            />
            <HelperText
              type="error"
              visible={touched.capacity && !!errors.capacity}
            >
              {errors.capacity}
            </HelperText>

            {/* Deposit Amount */}
            <Text variant="labelLarge" style={styles.label}>
              Deposit Amount *
            </Text>
            <SegmentedButtons
              value={depositAmount.toString()}
              onValueChange={value => setDepositAmount(parseInt(value, 10))}
              buttons={DEPOSIT_OPTIONS.map(option => ({
                value: option.value.toString(),
                label: option.label,
              }))}
              style={styles.segmentedButtons}
            />

            {/* Visibility */}
            <Text variant="labelLarge" style={styles.label}>
              Visibility *
            </Text>
            <SegmentedButtons
              value={visibility}
              onValueChange={value =>
                setVisibility(value as 'public' | 'private')
              }
              buttons={[
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
              ]}
              style={styles.segmentedButtons}
            />

            <Divider style={styles.divider} />

            {/* Location Section */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Location
            </Text>

            <TextInput
              label="Address *"
              value={address}
              onChangeText={setAddress}
              onBlur={() => handleBlur('address')}
              mode="outlined"
              error={touched.address && !!errors.location}
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label="City *"
              value={city}
              onChangeText={setCity}
              onBlur={() => handleBlur('city')}
              mode="outlined"
              error={touched.city && !!errors.location}
              style={styles.input}
              disabled={loading}
            />

            <View style={styles.row}>
              <TextInput
                label="State *"
                value={state}
                onChangeText={setState}
                onBlur={() => handleBlur('state')}
                mode="outlined"
                error={touched.state && !!errors.location}
                style={[styles.input, styles.halfWidth]}
                disabled={loading}
              />

              <TextInput
                label="ZIP Code *"
                value={zipCode}
                onChangeText={setZipCode}
                onBlur={() => handleBlur('zipCode')}
                mode="outlined"
                keyboardType="number-pad"
                error={touched.zipCode && !!errors.location}
                style={[styles.input, styles.halfWidth]}
                disabled={loading}
              />
            </View>

            <HelperText type="error" visible={!!errors.location}>
              {errors.location}
            </HelperText>

            <Divider style={styles.divider} />

            {/* Date/Time Section */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Date & Time
            </Text>

            <TextInput
              label="Date & Time *"
              value={dateTime}
              onChangeText={setDateTime}
              onBlur={() => handleBlur('dateTime')}
              mode="outlined"
              placeholder="YYYY-MM-DD HH:MM"
              error={touched.dateTime && !!errors.dateTime}
              style={styles.input}
              disabled={loading}
            />
            <HelperText
              type="error"
              visible={touched.dateTime && !!errors.dateTime}
            >
              {errors.dateTime}
            </HelperText>
            <HelperText type="info">
              Format: YYYY-MM-DD HH:MM (e.g., 2025-12-25 14:30)
            </HelperText>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  errorCard: {
    marginBottom: 16,
  },
  successCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
