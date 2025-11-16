/**
 * Create Event Wizard - Step 2: Location & Time (Premium Athletic Design)
 * Dark theme with orange gradient accents
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
import { Text, TextInput, HelperText } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import {
  GradientButton,
  PremiumProgressBar,
} from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';
import LocationInputModal from '../../../components/LocationInputModal';

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
  const [showLocationModal, setShowLocationModal] = useState(false);
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

  // Calculate duration in minutes
  const calculateDuration = () => {
    if (!time || !endTime) return 0;
    const diff = endTime.getTime() - time.getTime();
    return Math.round(diff / (1000 * 60)); // Convert to minutes
  };

  // Validation
  const locationError =
    touched.location && !location.trim() ? 'Location is required' : null;

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

  const isValid =
    location.trim() !== '' &&
    date !== null &&
    time !== null &&
    endTime !== null &&
    !endTimeError;

  const handleNext = () => {
    if (!isValid) {
      setTouched({ location: true, date: true, time: true, endTime: true });
      return;
    }
    const duration = calculateDuration();
    onNext({ location, date, time, duration });
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
        {/* Progress Bar */}
        <PremiumProgressBar currentStep={2} totalSteps={4} />

        {/* Section Header */}
        <Text style={styles.sectionHeader}>LOCATION & TIME</Text>

        {/* Location Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>LOCATION *</Text>
          <Pressable
            testID="location-input-pressable"
            onPress={() => setShowLocationModal(true)}
          >
            <View pointerEvents="none">
              <TextInput
                value={location}
                mode="outlined"
                error={!!locationError}
                placeholder="Enter address or search venues"
                placeholderTextColor={theme.colors.textMuted}
                multiline
                numberOfLines={2}
                editable={false}
                style={[styles.input, styles.locationInput]}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{
                  colors: {
                    background: theme.colors.surface,
                  },
                }}
                left={
                  <TextInput.Icon
                    icon="map-marker"
                    color={theme.colors.primary}
                  />
                }
                right={
                  <TextInput.Icon
                    icon="pencil"
                    color={theme.colors.textSecondary}
                  />
                }
              />
            </View>
          </Pressable>
          <HelperText
            type="error"
            visible={!!locationError}
            style={styles.helper}
          >
            {locationError}
          </HelperText>
        </View>

        {/* Location Input Modal */}
        <LocationInputModal
          visible={showLocationModal}
          value={location}
          locations={MOCK_LOCATIONS}
          onSave={newLocation => {
            setLocation(newLocation);
            setTouched(prev => ({ ...prev, location: true }));
          }}
          onDismiss={() => setShowLocationModal(false)}
        />

        {/* Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>DATE *</Text>
          <Pressable
            testID="date-input-pressable"
            onPress={() => setShowDatePicker(true)}
          >
            <View pointerEvents="none">
              <TextInput
                value={formatDate(date)}
                mode="outlined"
                error={!!dateError}
                placeholder="Select date"
                placeholderTextColor={theme.colors.textMuted}
                editable={false}
                style={styles.input}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{
                  colors: {
                    background: theme.colors.surface,
                  },
                }}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    color={theme.colors.primary}
                    onPress={() => setShowDatePicker(true)}
                  />
                }
              />
            </View>
          </Pressable>
          <HelperText type="error" visible={!!dateError} style={styles.helper}>
            {dateError}
          </HelperText>
        </View>

        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          date={date || new Date()}
          onConfirm={params => {
            setShowDatePicker(false);
            setDate(params.date || null);
            setTouched(prev => ({ ...prev, date: true }));
          }}
          validRange={{
            startDate: new Date(),
          }}
        />

        {/* Time Inputs Row */}
        <View style={styles.timeRow}>
          {/* Start Time */}
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>START TIME *</Text>
            {isE2E ? (
              <TextInput
                testID="time-input-pressable"
                value={formatTimeE2E(time)}
                onChangeText={text => {
                  const parsed = parseTimeString(text);
                  if (parsed) {
                    setTime(parsed);
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
                mode="outlined"
                error={!!timeError}
                placeholder="14:30"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                style={styles.input}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{
                  colors: {
                    background: theme.colors.surface,
                  },
                }}
              />
            ) : (
              <>
                <Pressable
                  testID="time-input-pressable"
                  onPress={() => setShowTimePicker(true)}
                >
                  <View pointerEvents="none">
                    <TextInput
                      value={formatTime(time)}
                      mode="outlined"
                      error={!!timeError}
                      placeholder="Select time"
                      placeholderTextColor={theme.colors.textMuted}
                      editable={false}
                      style={styles.input}
                      outlineColor={theme.colors.border}
                      activeOutlineColor={theme.colors.primary}
                      textColor={theme.colors.text}
                      theme={{
                        colors: {
                          background: theme.colors.surface,
                        },
                      }}
                      right={
                        <TextInput.Icon
                          icon="clock-outline"
                          color={theme.colors.primary}
                          onPress={() => setShowTimePicker(true)}
                        />
                      }
                    />
                  </View>
                </Pressable>
                <TimePickerModal
                  locale="en"
                  visible={showTimePicker}
                  onDismiss={() => setShowTimePicker(false)}
                  onConfirm={params => {
                    setShowTimePicker(false);
                    const newTime = new Date();
                    newTime.setHours(params.hours, params.minutes);
                    setTime(newTime);

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
          </View>

          {/* End Time */}
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>END TIME *</Text>
            {isE2E ? (
              <TextInput
                testID="end-time-input-pressable"
                value={formatTimeE2E(endTime)}
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
                mode="outlined"
                error={!!endTimeError}
                placeholder="16:30"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                style={styles.input}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{
                  colors: {
                    background: theme.colors.surface,
                  },
                }}
              />
            ) : (
              <>
                <Pressable
                  testID="end-time-input-pressable"
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <View pointerEvents="none">
                    <TextInput
                      value={formatTime(endTime)}
                      mode="outlined"
                      error={!!endTimeError}
                      placeholder="Select time"
                      placeholderTextColor={theme.colors.textMuted}
                      editable={false}
                      style={styles.input}
                      outlineColor={theme.colors.border}
                      activeOutlineColor={theme.colors.primary}
                      textColor={theme.colors.text}
                      theme={{
                        colors: {
                          background: theme.colors.surface,
                        },
                      }}
                      right={
                        <TextInput.Icon
                          icon="clock-outline"
                          color={theme.colors.primary}
                          onPress={() => setShowEndTimePicker(true)}
                        />
                      }
                    />
                  </View>
                </Pressable>
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
          </View>
        </View>

        {/* Time Error Helper */}
        <HelperText
          type="error"
          visible={!!timeError || !!endTimeError}
          style={styles.helper}
        >
          {timeError || endTimeError}
        </HelperText>

        {/* Duration Card */}
        {!timeError && !endTimeError && time && endTime && (
          <View style={styles.durationCard}>
            <Icon name="timer-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.durationText}>
              Duration: {formatDuration(calculateDuration())}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            testID="step2-back-button"
            onPress={onBack}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color={theme.colors.text} />
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          <GradientButton
            testID="step2-next-button"
            onPress={handleNext}
            disabled={!isValid}
            icon="arrow-right"
          >
            NEXT
          </GradientButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: theme.fontSizes.lg,
  },
  locationInput: {
    minHeight: 64,
    maxHeight: 80,
    fontSize: theme.fontSizes.md,
  },
  helper: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  timeInputContainer: {
    flex: 1,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  durationText: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: 14,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
});
