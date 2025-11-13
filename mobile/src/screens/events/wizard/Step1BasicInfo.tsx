/**
 * Create Event Wizard - Step 1: Basic Info
 * Collects title, description, and sport selection using card-based UI
 * Visual Spec: Screen 1 - 14 acceptance criteria
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  HelperText,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onCancel: () => void;
}

// Sport options - only racket sports per visual spec
const SPORTS = [
  { id: 'pickleball', label: 'Pickleball', icon: 'badminton' },
  { id: 'tennis', label: 'Tennis', icon: 'tennis' },
  { id: 'table-tennis', label: 'Table Tennis', icon: 'table-tennis' },
  { id: 'badminton', label: 'Badminton', icon: 'badminton' },
  { id: 'padel', label: 'Padel', icon: 'tennis' },
];

export default function Step1BasicInfo({ data, onNext, onCancel }: Props) {
  const theme = useTheme();
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [sportId, setSportId] = useState(data.sportId);
  const [touched, setTouched] = useState({ title: false, description: false });

  // Validation
  const titleError =
    touched.title && title.trim().length < 3
      ? 'Title must be at least 3 characters'
      : title.length > 50
        ? 'Title cannot exceed 50 characters'
        : null;

  const descriptionError =
    touched.description && description.trim().length < 10
      ? 'Description must be at least 10 characters'
      : description.length > 1000
        ? 'Description cannot exceed 1000 characters'
        : null;

  const isValid =
    title.trim().length >= 3 &&
    title.length <= 50 &&
    description.trim().length >= 10 &&
    description.length <= 1000;

  const handleNext = () => {
    if (!isValid) {
      setTouched({ title: true, description: true });
      return;
    }
    onNext({ title, description, sportId });
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
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressInline}>
            <Text variant="labelSmall" style={styles.progressText}>
              Step 1 of 4
            </Text>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Section Header */}
        <Text variant="labelLarge" style={styles.sectionHeader}>
          Basic Information
        </Text>

        {/* Title Input */}
        <TextInput
          testID="event-title-input"
          label="Event Title *"
          value={title}
          onChangeText={setTitle}
          onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
          mode="outlined"
          error={!!titleError}
          maxLength={50}
          dense
          style={styles.input}
        />
        <HelperText type={titleError ? 'error' : 'info'} visible>
          {titleError || `${title.length}/50 characters`}
        </HelperText>

        {/* Description Input */}
        <TextInput
          testID="event-description-input"
          label="Description *"
          value={description}
          onChangeText={setDescription}
          onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!descriptionError}
          maxLength={1000}
          dense
          style={[styles.input, styles.descriptionInput]}
        />
        <HelperText type={descriptionError ? 'error' : 'info'} visible>
          {descriptionError || `${description.length}/1000 characters`}
        </HelperText>

        {/* Sport Selector */}
        <Text variant="labelLarge" style={styles.sectionTitle}>
          Select Sport
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sportScrollView}
          contentContainerStyle={styles.sportScrollContent}
        >
          {SPORTS.map(sport => {
            const isSelected = sportId === sport.id;
            return (
              <Pressable
                key={sport.id}
                testID={`sport-card-${sport.label.toLowerCase()}`}
                onPress={() => setSportId(sport.id)}
              >
                <Card
                  mode="elevated"
                  style={[
                    styles.sportCard,
                    isSelected && styles.sportCardSelected,
                    isSelected && { borderColor: theme.colors.primary },
                  ]}
                  elevation={isSelected ? 4 : 1}
                >
                  <Card.Content style={styles.sportCardContent}>
                    <Icon
                      name={sport.icon}
                      size={32}
                      color={isSelected ? theme.colors.primary : '#666'}
                    />
                    <Text
                      variant="labelSmall"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.sportLabel,
                        isSelected && { color: theme.colors.primary },
                      ]}
                    >
                      {sport.label}
                    </Text>
                  </Card.Content>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            testID="cancel-button"
            mode="text"
            onPress={onCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            testID="next-button"
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
    fontWeight: '600',
    fontSize: 15,
    color: '#111827',
  },
  input: {
    marginBottom: 2,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
    color: '#374151',
  },
  sportScrollView: {
    marginBottom: 12,
  },
  sportScrollContent: {
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  sportCard: {
    width: 90,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sportCardSelected: {
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  sportCardContent: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sportLabel: {
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonContent: {
    flexDirection: 'row-reverse',
  },
});
