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
      : title.length > 100
        ? 'Title cannot exceed 100 characters'
        : null;

  const descriptionError =
    touched.description && description.trim().length < 10
      ? 'Description must be at least 10 characters'
      : description.length > 500
        ? 'Description cannot exceed 500 characters'
        : null;

  const sportError = !sportId ? 'Please select a sport' : null;

  const isValid =
    title.trim().length >= 3 &&
    title.length <= 100 &&
    description.trim().length >= 10 &&
    description.length <= 500 &&
    sportId !== '';

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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dotLine} />
            <View style={styles.dot} />
            <View style={styles.dotLine} />
            <View style={styles.dot} />
            <View style={styles.dotLine} />
            <View style={styles.dot} />
          </View>
          <Text variant="labelMedium" style={styles.progressText}>
            Step 1 of 4
          </Text>
        </View>

        {/* Section Header */}
        <Text variant="titleLarge" style={styles.sectionHeader}>
          Basic Information
        </Text>

        {/* Title Input */}
        <TextInput
          label="Event Title *"
          value={title}
          onChangeText={setTitle}
          onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
          mode="outlined"
          error={!!titleError}
          maxLength={100}
          style={styles.input}
        />
        <HelperText type={titleError ? 'error' : 'info'} visible>
          {titleError || `${title.length}/100 characters`}
        </HelperText>

        {/* Description Input */}
        <TextInput
          label="Description *"
          value={description}
          onChangeText={setDescription}
          onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!descriptionError}
          maxLength={500}
          style={styles.input}
        />
        <HelperText type={descriptionError ? 'error' : 'info'} visible>
          {descriptionError || `${description.length}/500 characters`}
        </HelperText>

        {/* Sport Selector */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Select Sport *
        </Text>

        <View style={styles.sportGrid}>
          {SPORTS.map(sport => {
            const isSelected = sportId === sport.id;
            return (
              <Pressable
                key={sport.id}
                onPress={() => setSportId(sport.id)}
                style={styles.sportCardWrapper}
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
                      size={48}
                      color={isSelected ? theme.colors.primary : '#666'}
                    />
                    <Text
                      variant="labelMedium"
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
        </View>

        {sportError && !sportId && (
          <HelperText type="error" visible>
            {sportError}
          </HelperText>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button mode="text" onPress={onCancel} style={styles.cancelButton}>
            Cancel
          </Button>
          <Button
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
    marginBottom: 24,
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9CA3AF',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
  dotLine: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressText: {
    color: '#6B7280',
  },
  sectionHeader: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '600',
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  sportCardWrapper: {
    width: '48%',
  },
  sportCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sportCardSelected: {
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  sportCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sportLabel: {
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
