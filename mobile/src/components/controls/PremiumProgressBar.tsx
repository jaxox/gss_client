/**
 * PremiumProgressBar - Segmented progress bar with orange gradient for completed steps
 * Premium Athletic design with thick bar (6px) and numeric indicators
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme';

interface PremiumProgressBarProps {
  currentStep: number; // 1-based (1, 2, 3, 4)
  totalSteps: number;
}

export const PremiumProgressBar: React.FC<PremiumProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>
        STEP {currentStep} OF {totalSteps}
      </Text>
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.barFill, { width: `${progress}%` }]}
          />
        </View>
        <View style={styles.indicators}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <View
              key={step}
              style={[
                styles.indicator,
                step <= currentStep && styles.indicatorActive,
              ]}
            >
              <Text
                style={[
                  styles.indicatorText,
                  step <= currentStep && styles.indicatorTextActive,
                ]}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  stepText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  barContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  barBackground: {
    height: 6,
    backgroundColor: theme.colors.neutral700,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: theme.radius.full,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.neutral700,
    borderWidth: 2,
    borderColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorActive: {
    backgroundColor: theme.colors.primary,
  },
  indicatorText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textMuted,
  },
  indicatorTextActive: {
    color: '#ffffff',
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});
