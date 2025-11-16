/**
 * WizardScreenLayout Component
 * Consistent layout for multi-step wizard flows
 * Includes: progress indicator, scrollable content area, bottom action buttons
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../theme';

interface WizardScreenLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  renderBottomButtons?: () => React.ReactNode;
}

export const WizardScreenLayout: React.FC<WizardScreenLayoutProps> = ({
  currentStep,
  totalSteps,
  children,
  renderBottomButtons,
}) => {
  const renderProgressDots = () => {
    const dots = [];
    for (let i = 0; i < totalSteps; i++) {
      dots.push(
        <React.Fragment key={i}>
          <View style={[styles.dot, i < currentStep && styles.dotActive]} />
          {i < totalSteps - 1 && <View style={styles.dotLine} />}
        </React.Fragment>,
      );
    }
    return dots;
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
          <View style={styles.progressInline}>
            <Text variant="labelSmall" style={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </Text>
            <View style={styles.progressDots}>{renderProgressDots()}</View>
          </View>
        </View>

        {/* Main Content */}
        {children}

        {/* Bottom Buttons */}
        {renderBottomButtons && (
          <View style={styles.buttonContainer}>{renderBottomButtons()}</View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  progressSection: {
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.neutral400,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
  dotLine: {
    width: 16,
    height: 2,
    backgroundColor: theme.colors.neutral200,
    marginHorizontal: 3,
  },
  progressText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.xs,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
});
