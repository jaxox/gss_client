/**
 * Create Event Wizard - Step 1: Basic Info (Premium Athletic Design)
 * Dark theme with orange gradient accents
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, HelperText } from 'react-native-paper';
import {
  GradientButton,
  PremiumProgressBar,
} from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

export default function Step1BasicInfo({ data, onNext, onCancel }: Props) {
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [sportId, setSportId] = useState(data.sportId);
  const [touched, setTouched] = useState({ title: false, description: false });

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
    <View style={styles.container}>
      <ScrollView
        testID="step1-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Bar */}
        <PremiumProgressBar currentStep={1} totalSteps={4} />

        {/* Section Header */}
        <Text style={styles.sectionHeader}>BASIC INFORMATION</Text>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>EVENT TITLE *</Text>
          <TextInput
            testID="event-title-input"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            mode="outlined"
            error={!!titleError}
            maxLength={50}
            placeholder="Enter event title"
            placeholderTextColor={theme.colors.textMuted}
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
          <HelperText
            type={titleError ? 'error' : 'info'}
            visible
            style={styles.helper}
          >
            {titleError || `${title.length}/50 characters`}
          </HelperText>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>DESCRIPTION *</Text>
          <TextInput
            testID="event-description-input"
            value={description}
            onChangeText={setDescription}
            onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            error={!!descriptionError}
            maxLength={1000}
            placeholder="Describe your event"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, styles.descriptionInput]}
            outlineColor={theme.colors.border}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.text}
            theme={{
              colors: {
                background: theme.colors.surface,
              },
            }}
          />
          <HelperText
            type={descriptionError ? 'error' : 'info'}
            visible
            style={styles.helper}
          >
            {descriptionError || `${description.length}/1000 characters`}
          </HelperText>
        </View>

        {/* Sport Selector */}
        <Text style={styles.sectionHeader}>SELECT SPORT</Text>
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
                  {isSelected && <View style={styles.sportCardAccent} />}
                  <Icon
                    name={sport.icon}
                    size={40}
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
    </View>
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
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
  },
  sportScrollContent: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xxl,
  },
  sportCardPressable: {
    position: 'relative',
  },
  sportCard: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  sportCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
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
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
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
    paddingVertical: 14,
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
    flex: 2,
  },
});
