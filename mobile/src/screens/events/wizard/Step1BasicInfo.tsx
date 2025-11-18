/**
 * Create Event Wizard - Step 1: Complete Basic Info (Premium Athletic Design)
 * Includes: Title, Description, Sport, Location, Date, Start/End Time
 * Dark theme with orange gradient accents
 */

/* eslint-disable react-native/no-inline-styles */
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
import { GradientButton } from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LocationInputModal from '../../../components/LocationInputModal';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onCancel: () => void;
}

const SPORTS = [
  { id: 'pickleball', label: 'Pickleball', icon: 'badminton' },
  { id: 'tennis', label: 'Tennis', icon: 'tennis' },
  { id: 'table-tennis', label: 'Table Tennis', icon: 'table-tennis' },
  { id: 'badminton', label: 'Badminton', icon: 'badminton' },
  { id: 'padel', label: 'Padel', icon: 'tennis' },
];

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
];

const getFutureDate = (daysAhead = 1) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

export default function Step1BasicInfo({ data, onNext, onCancel }: Props) {
  const isE2E = !!(globalThis as any).__E2E__;

  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [sportId, setSportId] = useState(data.sportId);
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
    title: false,
    description: false,
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

  const titleError =
    touched.title && title.trim().length > 0 && title.trim().length < 7
      ? 'Title must be at least 7 characters'
      : null;

  const descriptionError =
    touched.description &&
    description.trim().length > 0 &&
    description.trim().length < 10
      ? 'Description must be at least 10 characters'
      : null;

  const isValid =
    title.trim().length >= 7 &&
    title.length <= 50 &&
    description.trim().length >= 10 &&
    description.length <= 1000 &&
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
        title: true,
        description: true,
        location: true,
        date: true,
        time: true,
        endTime: true,
      });
      return;
    }
    const duration = calculateDuration();
    onNext({ title, description, sportId, location, date, time, duration });
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
        testID="step1-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            testID="event-title-input"
            mode="outlined"
            label="Event Title"
            placeholder="Pick-up Basketball"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            maxLength={50}
            error={!!titleError}
            outlineColor="rgba(255,255,255,0.15)"
            activeOutlineColor={theme.colors.primary}
            textColor="#ffffff"
            outlineStyle={{ borderWidth: 1 }}
            theme={{
              roundness: theme.radius.lg,
              fonts: {
                bodyLarge: { fontSize: 15, fontWeight: '600' },
              },
            }}
          />
          {titleError && (
            <HelperText type="error" visible={true} style={styles.helper}>
              {titleError}
            </HelperText>
          )}
        </View>

        {/* Description Input */}
        <View style={[styles.inputContainer, { marginTop: theme.spacing.sm }]}>
          <TextInput
            testID="event-description-input"
            mode="outlined"
            label="Description"
            placeholder="Tell participants what to expect..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={description}
            onChangeText={setDescription}
            onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
            multiline
            numberOfLines={5}
            scrollEnabled
            error={!!descriptionError}
            style={[
              styles.input,
              styles.multilineInput,
              styles.inputWithShadow,
            ]}
            outlineColor="rgba(255,255,255,0.15)"
            activeOutlineColor={theme.colors.primary}
            textColor="#ffffff"
            outlineStyle={{ borderWidth: 1 }}
            theme={{
              roundness: theme.radius.lg,
              fonts: {
                bodyLarge: { fontSize: 15, fontWeight: '600' },
              },
            }}
          />
          {descriptionError && (
            <HelperText type="error" visible={true} style={styles.helper}>
              {descriptionError}
            </HelperText>
          )}
        </View>

        {/* Sport Selector */}
        <Text style={styles.sectionHeader}>Choose Sport</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportScrollContent}
        >
          {SPORTS.map(sport => {
            const isSelected = sportId === sport.id;
            return (
              <Pressable
                key={sport.id}
                testID={`sport-card-${sport.label.toLowerCase()}`}
                onPress={() => setSportId(sport.id)}
                style={styles.sportCardPressable}
              >
                <View
                  style={[
                    styles.sportCard,
                    isSelected && styles.sportCardSelected,
                  ]}
                >
                  <Icon
                    name={sport.icon}
                    size={32}
                    color={
                      isSelected
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sportLabel,
                      isSelected && styles.sportLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {sport.label.toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Location Input */}
        <View style={styles.inputContainer}>
          <Pressable
            testID="location-input-pressable"
            onPress={() => setShowLocationModal(true)}
          >
            <View pointerEvents="none">
              <TextInput
                value={location}
                mode="outlined"
                label="Location"
                error={!!locationError}
                placeholder="Enter address or search venues"
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={2}
                editable={false}
                style={[
                  styles.input,
                  styles.locationInput,
                  styles.inputWithShadow,
                ]}
                outlineColor="rgba(255,255,255,0.15)"
                activeOutlineColor={theme.colors.primary}
                textColor="#ffffff"
                outlineStyle={{ borderWidth: 1 }}
                theme={{
                  roundness: theme.radius.lg,
                  fonts: {
                    bodyLarge: { fontSize: 15, fontWeight: '600' },
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
          {locationError && (
            <HelperText type="error" visible={true} style={styles.helper}>
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
        <View style={[styles.inputContainer, { marginTop: theme.spacing.sm }]}>
          <Pressable
            testID="date-input-pressable"
            onPress={() => setShowDatePicker(true)}
          >
            <View pointerEvents="none">
              <TextInput
                value={formatDate(date)}
                mode="outlined"
                label="Date"
                error={!!dateError}
                placeholder="Select date"
                placeholderTextColor="rgba(255,255,255,0.4)"
                editable={false}
                outlineColor="rgba(255,255,255,0.15)"
                activeOutlineColor={theme.colors.primary}
                // textColor="#ffffff"
                outlineStyle={{ borderWidth: 1 }}
                theme={{
                  roundness: theme.radius.lg,
                  fonts: {
                    bodyLarge: { fontSize: 15, fontWeight: '600' },
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
          {dateError && (
            <HelperText type="error" visible={true} style={styles.helper}>
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
                label="Start Time"
                error={!!timeError}
                placeholder="14:30"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                // style={[styles.input, styles.inputWithShadow]}
                outlineColor="rgba(255,255,255,0.15)"
                activeOutlineColor={theme.colors.primary}
                textColor="#ffffff"
                outlineStyle={{ borderWidth: 1 }}
                theme={{
                  colors: {
                    background: 'rgba(255,255,255,0.08)',
                    onSurfaceVariant: 'rgba(255,255,255,0.7)',
                    primary: theme.colors.primary,
                  },
                  roundness: theme.radius.lg,
                  fonts: {
                    bodyLarge: { fontSize: 15, fontWeight: '600' },
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
                      label="Start Time"
                      error={!!timeError}
                      placeholder="Select time"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      editable={false}
                      // style={[styles.input, styles.inputWithShadow]}
                      outlineColor="rgba(255,255,255,0.15)"
                      activeOutlineColor={theme.colors.primary}
                      textColor="#ffffff"
                      outlineStyle={{ borderWidth: 1 }}
                      theme={{
                        colors: {
                          // background: 'rgba(255,255,255,0.08)',
                          // onSurfaceVariant: 'rgba(255,255,255,0.7)',
                          primary: theme.colors.primary,
                        },
                        roundness: theme.radius.lg,
                        fonts: {
                          bodyLarge: { fontSize: 15, fontWeight: '600' },
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
              </>
            )}
          </View>

          <View style={styles.timeInputContainer}>
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
                label="End Time"
                error={!!endTimeError}
                placeholder="16:30"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="numeric"
                style={[styles.input, styles.inputWithShadow]}
                outlineColor="rgba(255,255,255,0.15)"
                activeOutlineColor={theme.colors.primary}
                textColor="#ffffff"
                outlineStyle={{ borderWidth: 1 }}
                theme={{
                  colors: {
                    // background: 'rgba(255,255,255,0.08)',
                    // onSurfaceVariant: 'rgba(255,255,255,0.7)',
                    // primary: theme.colors.primary,
                  },
                  roundness: theme.radius.lg,
                  fonts: {
                    bodyLarge: { fontSize: 15, fontWeight: '600' },
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
                      label="End Time"
                      error={!!endTimeError}
                      placeholder="Select time"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      editable={false}
                      style={[styles.input, styles.inputWithShadow]}
                      outlineColor="rgba(255,255,255,0.15)"
                      activeOutlineColor={theme.colors.primary}
                      textColor="#ffffff"
                      outlineStyle={{ borderWidth: 1 }}
                      theme={{
                        colors: {
                          // background: 'rgba(255,255,255,0.08)',
                          // onSurfaceVariant: 'rgba(255,255,255,0.7)',
                          // primary: theme.colors.primary,
                        },
                        roundness: theme.radius.lg,
                        fonts: {
                          bodyLarge: { fontSize: 15, fontWeight: '600' },
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
              </>
            )}
          </View>
        </View>

        {(timeError || endTimeError) && (
          <HelperText type="error" visible={true} style={styles.helper}>
            {timeError || endTimeError}
          </HelperText>
        )}

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
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>CANCEL</Text>
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
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  input: {
    // backgroundColor: 'rgba(255, 255, 255, 0.08)',
    fontSize: theme.fontSizes.lg,
  },
  inputWithShadow: {
    shadowColor: 'rgba(255, 107, 53, 0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputOutlineStyle: {
    borderWidth: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  multilineInput: {
    minHeight: 120,
    maxHeight: 300,
    textAlignVertical: 'top',
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    marginBottom: 0,
    marginTop: theme.spacing.sm,
  },
  timeInputContainer: {
    flex: 1,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 8,
    padding: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 107, 53, 0.9)',
    letterSpacing: 0.5,
  },
  sportScrollContent: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sportCardPressable: {
    position: 'relative',
  },
  sportCard: {
    width: 90,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
  sportCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  sportCardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: theme.radius.lg,
    borderBottomLeftRadius: theme.radius.lg,
  },
  sportLabel: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.xxs,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sportLabelSelected: {
    color: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: 0.5,
  },
  nextButton: {
    flex: 1,
    height: 48,
  },
});
