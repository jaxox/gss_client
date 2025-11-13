/**
 * Create Event Wizard - Step 2: Location & Time
 * Implements location autocomplete (internal DB), native date/time pickers, duration dropdown
 * Visual Spec: Screen 2 - 19 acceptance criteria
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

// Mock location data - internal database
const MOCK_LOCATIONS = [
  {
    id: '1',
    name: 'Golden Gate Park Tennis Courts',
    address: '1100 John F Kennedy Dr',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '2',
    name: 'Dolores Park Recreation Center',
    address: '500 Dolores St',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '3',
    name: 'Mission Bay Pickleball Courts',
    address: '170 Channel St',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '4',
    name: 'Presidio Sports Complex',
    address: '250 Arguello Blvd',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '5',
    name: 'SF State Recreation Center',
    address: '1600 Holloway Ave',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '6',
    name: 'Alice Marble Tennis Courts',
    address: '1360 Greenwich St',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '7',
    name: 'Crocker Amazon Playground',
    address: '799 Moscow St',
    city: 'San Francisco',
    state: 'CA',
  },
  {
    id: '8',
    name: 'Sunset Playground Tennis Courts',
    address: '2201 28th Ave',
    city: 'San Francisco',
    state: 'CA',
  },
];

// Utility helper for prepopulating future dates in E2E tests
const getFutureDate = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

export default function Step2LocationTime({ data, onNext, onBack }: Props) {
  // Detect E2E test environment
  const isE2E = !!(globalThis as any).__E2E__;

  const [location, setLocation] = useState(data.location || '');
  const [date, setDate] = useState<Date | null>(data.date);
  const [time, setTime] = useState<Date | null>(data.time);

  // Calculate end time from duration or use stored value
  const calculateEndTime = () => {
    if (!time) return null;
    const endTime = new Date(time);
    endTime.setMinutes(endTime.getMinutes() + data.duration);
    return endTime;
  };

  const [endTime, setEndTime] = useState<Date | null>(calculateEndTime());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [touched, setTouched] = useState({
    location: false,
    date: false,
    time: false,
    endTime: false,
  });

  // Sync location from wizard data when navigating back
  useEffect(() => {
    if (data.location) {
      setLocation(data.location);
    }
  }, [data.location]);

  // E2E Mode: Prepopulate date with future date to avoid picker interaction
  useEffect(() => {
    if (isE2E) {
      console.log('E2E mode detected - prepopulating date');

      setDate(prev => prev ?? getFutureDate(2)); // only if not already set

      setTouched(prev => ({ ...prev, date: true }));
    }
  }, [isE2E]);

  // Filter locations based on search query
  const filteredLocations = MOCK_LOCATIONS.filter(
    loc =>
      loc.name.toLowerCase().includes(locationQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(locationQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(locationQuery.toLowerCase()),
  ).slice(0, 5); // Show max 5 suggestions

  // Calculate duration in minutes
  const calculateDuration = () => {
    if (!time || !endTime) return 0;
    const diff = endTime.getTime() - time.getTime();
    return Math.round(diff / (1000 * 60)); // Convert to minutes
  };

  // Validation - check BOTH location and locationQuery
  const locationError =
    touched.location && !location.trim() && !locationQuery.trim()
      ? 'Location is required'
      : null;

  const dateError =
    touched.date && !date
      ? 'Date is required'
      : date && date < new Date(new Date().setHours(0, 0, 0, 0))
        ? 'Date must be in the future'
        : null;

  const timeError = touched.time && !time ? 'Start time is required' : null;

  const endTimeError =
    touched.endTime && !endTime
      ? 'End time is required'
      : endTime && time && endTime <= time
        ? 'End time must be after start time'
        : null;

  // Valid if either location OR locationQuery has content
  const hasLocation = location.trim() !== '' || locationQuery.trim() !== '';
  const isValid =
    hasLocation &&
    date !== null &&
    time !== null &&
    endTime !== null &&
    !endTimeError;

  const handleNext = () => {
    if (!isValid) {
      setTouched({ location: true, date: true, time: true, endTime: true });
      return;
    }
    // Use locationQuery if location is empty
    const finalLocation = location || locationQuery;
    const duration = calculateDuration();
    onNext({ location: finalLocation, date, time, duration });
  };

  const formatDate = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (t: Date | null) => {
    if (!t) return '';
    return t.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
  };

  // E2E helper: Parse HH:mm format to Date
  const parseTimeString = (timeStr: string): Date | null => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    const newDate = new Date();
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // E2E helper: Format Date to HH:mm
  const formatTimeE2E = (t: Date | null): string => {
    if (!t) return '';
    const hours = t.getHours().toString().padStart(2, '0');
    const minutes = t.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        testID="step2-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressInline}>
            <Text variant="labelSmall" style={styles.progressText}>
              Step 2 of 4
            </Text>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Section Header */}
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Location & Time
        </Text>

        {/* Location Input with Autocomplete */}
        <View>
          <TextInput
            testID="location-input"
            label="Location *"
            value={locationQuery || location}
            onChangeText={query => {
              setLocationQuery(query);
              setLocation(query); // Update location as user types
              setShowLocationSuggestions(query.length >= 2);
            }}
            onFocus={() => {
              if ((locationQuery || location).length >= 2) {
                setShowLocationSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowLocationSuggestions(false);
                setTouched(prev => ({ ...prev, location: true }));
              }, 200);
            }}
            mode="outlined"
            error={!!locationError}
            placeholder="Enter address or search venues"
            dense
            style={styles.input}
            left={<TextInput.Icon icon="map-marker" />}
          />

          {/* Location Suggestions */}
          {showLocationSuggestions && filteredLocations.length > 0 && (
            <View style={styles.suggestionsList}>
              {filteredLocations.map(loc => (
                <Pressable
                  key={loc.id}
                  style={styles.suggestionItem}
                  onPress={() => {
                    const fullAddress = `${loc.name}, ${loc.city}, ${loc.state}`;
                    setLocation(fullAddress);
                    setLocationQuery(''); // Clear query after selection
                    setShowLocationSuggestions(false);
                    setTouched(prev => ({ ...prev, location: true }));
                  }}
                >
                  <View>
                    <Text variant="bodyMedium" style={styles.locationName}>
                      {loc.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.locationAddress}>
                      {loc.address}, {loc.city}, {loc.state}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <HelperText type="error" visible={!!locationError}>
          {locationError}
        </HelperText>
        <HelperText
          type="info"
          visible={!locationError && !showLocationSuggestions}
        >
          {' '}
        </HelperText>

        {/* Date Picker */}
        <TextInput
          testID="date-input"
          label="Date *"
          value={formatDate(date)}
          mode="outlined"
          error={!!dateError}
          editable={false}
          dense
          onPressIn={() => setShowDatePicker(true)}
          style={styles.input}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
            />
          }
        />
        <HelperText type="error" visible={!!dateError}>
          {dateError}
        </HelperText>

        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => {
            setShowDatePicker(false);
            setShowLocationSuggestions(false);
          }}
          date={date || new Date()}
          onConfirm={params => {
            setShowDatePicker(false);
            setShowLocationSuggestions(false);
            setDate(params.date || null);
            setTouched(prev => ({ ...prev, date: true }));
          }}
          validRange={{
            startDate: new Date(),
          }}
        />

        {/* Time Picker - E2E-aware */}
        {isE2E ? (
          <TextInput
            testID="time-input"
            label="Start Time * (HH:mm)"
            value={formatTimeE2E(time)}
            mode="outlined"
            error={!!timeError}
            placeholder="14:30"
            keyboardType="numeric"
            dense
            style={styles.input}
            onChangeText={text => {
              const parsed = parseTimeString(text);
              if (parsed) {
                setTime(parsed);
                // Auto-set end time to 2 hours later if not set
                if (!endTime) {
                  const autoEndTime = new Date(parsed);
                  autoEndTime.setHours(autoEndTime.getHours() + 2);
                  setEndTime(autoEndTime);
                }
                setTouched(prev => ({ ...prev, time: true }));
              } else if (text === '') {
                setTime(null);
                setTouched(prev => ({ ...prev, time: true }));
              }
            }}
          />
        ) : (
          <>
            <TextInput
              testID="time-input"
              label="Start Time *"
              value={formatTime(time)}
              mode="outlined"
              error={!!timeError}
              editable={false}
              dense
              onPressIn={() => setShowTimePicker(true)}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="clock-outline"
                  onPress={() => setShowTimePicker(true)}
                />
              }
            />
            <TimePickerModal
              locale="en"
              visible={showTimePicker}
              onDismiss={() => setShowTimePicker(false)}
              onConfirm={params => {
                setShowTimePicker(false);
                const newTime = new Date();
                newTime.setHours(params.hours, params.minutes);
                setTime(newTime);

                // Auto-set end time to 2 hours later if not set
                if (!endTime) {
                  const autoEndTime = new Date(newTime);
                  autoEndTime.setHours(autoEndTime.getHours() + 2);
                  setEndTime(autoEndTime);
                }

                setTouched(prev => ({ ...prev, time: true }));
              }}
              hours={time?.getHours() || 12}
              minutes={time?.getMinutes() || 0}
            />
          </>
        )}
        <HelperText type="error" visible={!!timeError}>
          {timeError}
        </HelperText>

        {/* End Time Picker - E2E-aware */}
        {isE2E ? (
          <TextInput
            testID="end-time-input"
            label="End Time * (HH:mm)"
            value={formatTimeE2E(endTime)}
            mode="outlined"
            error={!!endTimeError}
            placeholder="16:30"
            keyboardType="numeric"
            dense
            style={styles.input}
            onChangeText={text => {
              const parsed = parseTimeString(text);
              if (parsed) {
                setEndTime(parsed);
                setTouched(prev => ({ ...prev, endTime: true }));
              } else if (text === '') {
                setEndTime(null);
                setTouched(prev => ({ ...prev, endTime: true }));
              }
            }}
          />
        ) : (
          <>
            <TextInput
              testID="end-time-input"
              label="End Time *"
              value={formatTime(endTime)}
              mode="outlined"
              error={!!endTimeError}
              editable={false}
              dense
              onPressIn={() => setShowEndTimePicker(true)}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon="clock-outline"
                  onPress={() => setShowEndTimePicker(true)}
                />
              }
            />
            <TimePickerModal
              locale="en"
              visible={showEndTimePicker}
              onDismiss={() => setShowEndTimePicker(false)}
              onConfirm={params => {
                setShowEndTimePicker(false);
                const newEndTime = new Date();
                newEndTime.setHours(params.hours, params.minutes);
                setEndTime(newEndTime);
                setTouched(prev => ({ ...prev, endTime: true }));
              }}
              hours={endTime?.getHours() || 14}
              minutes={endTime?.getMinutes() || 0}
            />
          </>
        )}
        <HelperText type="error" visible={!!endTimeError}>
          {endTimeError}
        </HelperText>
        {!endTimeError && time && endTime && (
          <HelperText type="info">
            Duration: {formatDuration(calculateDuration())}
          </HelperText>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            testID="step2-back-button"
            mode="outlined"
            onPress={onBack}
            style={styles.backButton}
          >
            Back
          </Button>
          <Button
            testID="step2-next-button"
            mode="contained"
            onPress={handleNext}
            disabled={!isValid}
            style={styles.nextButton}
            icon="arrow-right"
            contentStyle={styles.nextButtonContent}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressSection: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  progressInline: {
    flexDirection: 'row', // make dots + text inline
    alignItems: 'center', // vertically centered
    justifyContent: 'center', // horizontally centered
    gap: 16, // spacing between dots and text (RN 0.71+)
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
  dotLine: {
    width: 16,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  progressText: {
    color: '#6B7280',
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 2,
  },
  suggestionsList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    maxHeight: 180,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationName: {
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 14,
  },
  locationAddress: {
    color: '#6B7280',
    fontSize: 12,
  },
  menuScroll: {
    maxHeight: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonContent: {
    flexDirection: 'row-reverse',
  },
});
