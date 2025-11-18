/**
 * Create Event Wizard - Step 2: Location & Time (Premium Athletic Design)
 * Dark theme with orange gradient accents
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import {
  GradientButton,
  PremiumProgressBar,
} from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationInputModal from '../../../components/LocationInputModal';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

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
];

const getFutureDate = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

export default function Step2LocationTime({ data, onNext, onBack }: Props) {
  const isE2E = !!(globalThis as any).__E2E__;

  const [location, setLocation] = useState(data.location || '');
  const [date, setDate] = useState<Date | null>(data.date);
  const [time, setTime] = useState<Date | null>(data.time);

  const calculateEndTime = () => {
    if (!time) return null;
    const endTime = new Date(time);
    endTime.setMinutes(endTime.getMinutes() + (data.duration || 120));
    return endTime;
  };

  const [endTime, setEndTime] = useState<Date | null>(calculateEndTime());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [touched, setTouched] = useState({
    location: false,
    date: false,
    time: false,
    endTime: false,
  });

  useEffect(() => {
    if (isE2E && !date) {
      setDate(getFutureDate(2));
      setTouched(prev => ({ ...prev, date: true }));
    }
  }, [isE2E, date]);

  const locationError =
    touched.location && location.trim().length > 0 && location.trim().length < 7
      ? 'Location must be at least 7 characters'
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

  const isValid =
    location.trim().length >= 7 &&
    date !== null &&
    time !== null &&
    endTime !== null &&
    !endTimeError;

  const calculateDuration = () => {
    if (!time || !endTime) return 120;
    const diff = endTime.getTime() - time.getTime();
    return Math.round(diff / (1000 * 60));
  };

  const handleNext = () => {
    if (!isValid) {
      setTouched({
        location: true,
        date: true,
        time: true,
        endTime: true,
      });
      return;
    }
    const duration = calculateDuration();
    onNext({ location, date, time, endTime, duration });
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
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  };

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
        <Text style={styles.sectionHeader}>LOCATION & SCHEDULE</Text>

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
                placeholder="Search for venue or enter address"
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
                right={
                  <TextInput.Icon
                    icon="map-marker"
                    color={theme.colors.primary}
                  />
                }
              />
            </View>
          </Pressable>
          {locationError && (
            <HelperText type="error" visible style={styles.helper}>
              {locationError}
            </HelperText>
          )}
        </View>

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
                  />
                }
              />
            </View>
          </Pressable>
          {dateError && (
            <HelperText type="error" visible style={styles.helper}>
              {dateError}
            </HelperText>
          )}
        </View>

        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          date={date || new Date()}
          label="Select Event Date"
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
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>START TIME *</Text>
            {isE2E ? (
              <TextInput
                testID="time-input"
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
                  }
                }}
                mode="outlined"
                error={!!timeError}
                placeholder="14:00"
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
                      />
                    }
                  />
                </View>
              </Pressable>
            )}
            <TimePickerModal
              locale="en"
              visible={showTimePicker}
              onDismiss={() => setShowTimePicker(false)}
              label="Select Start Time"
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
          </View>

          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>END TIME *</Text>
            {isE2E ? (
              <TextInput
                testID="end-time-input"
                value={formatTimeE2E(endTime)}
                onChangeText={text => {
                  const parsed = parseTimeString(text);
                  if (parsed) {
                    setEndTime(parsed);
                    setTouched(prev => ({ ...prev, endTime: true }));
                  }
                }}
                mode="outlined"
                error={!!endTimeError}
                placeholder="16:00"
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
                      />
                    }
                  />
                </View>
              </Pressable>
            )}
            <TimePickerModal
              locale="en"
              visible={showEndTimePicker}
              onDismiss={() => setShowEndTimePicker(false)}
              label="Select End Time"
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
          </View>
        </View>

        {(timeError || endTimeError) && (
          <HelperText type="error" visible style={styles.helper}>
            {timeError || endTimeError}
          </HelperText>
        )}

        {/* Duration Display Card */}
        {!timeError && !endTimeError && time && endTime && (
          <View style={styles.durationCard}>
            <View style={styles.durationCardAccent} />
            <Icon name="timer-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.durationText}>
              Duration: {formatDuration(calculateDuration())}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            testID="back-button"
          >
            <Icon name="arrow-left" size={20} color={theme.colors.text} />
            <Text style={styles.backText}>BACK</Text>
          </Pressable>
          <GradientButton
            testID="next-button"
            onPress={handleNext}
            disabled={!isValid}
            icon="arrow-right"
            style={styles.nextButton}
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
    paddingBottom: theme.spacing.xxxl,
  },
  sectionHeader: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: theme.fontSizes.lg,
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
  },
  locationInput: {
    minHeight: 64,
    maxHeight: 80,
    fontSize: theme.fontSizes.md,
  },
  timeRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  timeInputContainer: {
    flex: 1,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.2)',
    position: 'relative',
  },
  durationCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: theme.radius.lg,
    borderBottomLeftRadius: theme.radius.lg,
  },
  durationText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxl,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  backText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0.5,
  },
  nextButton: {
    flex: 2,
    height: 48,
  },
});
