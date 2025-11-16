/**
 * Create Event Wizard - Multi-Step Event Creation
 * Implements Story 2-1 visual specification with 4 steps
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../../theme';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Social from './Step2Social';
import Step3Details from './Step3Details';
import Step4Review from './Step4Review';

export interface WizardData {
  // Step 1: Basic Info
  title: string;
  description: string;
  sportId: string;
  location: string;
  date: Date | null;
  time: Date | null;
  endTime?: Date | null;
  duration: number; // in minutes

  // Step 2: Social Features
  cohosts?: string[];
  links?: Array<{ label: string; url: string }>;
  questions?: string[];
  reminders?: string[];

  // Step 3: Settings & Payment
  capacity?: number | null;
  waitlistEnabled?: boolean;
  guestCanInvite?: boolean;
  guestCanPlusOne?: boolean;
  cost?: number | null;

  // Legacy fields
  paymentDueBy?: '1h_after' | '24h_before' | 'at_event';
  paymentMethods?: {
    venmo: string;
    paypal: string;
    cashapp: string;
    zelle: string;
  };
  guestInvite?: boolean;
}

const initialData: WizardData = {
  title: '',
  description: '',
  sportId: '',
  location: '',
  date: null,
  time: null,
  endTime: null,
  duration: 120, // default 2 hours
  capacity: null,
  waitlistEnabled: false,
  guestCanInvite: true,
  guestCanPlusOne: false,
  cost: null,
  cohosts: [],
  links: [],
  questions: [],
  reminders: [],
};

interface Props {
  onCancel?: () => void;
}

export default function CreateEventWizard({ onCancel }: Props = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleNext = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Fallback: just log if no onCancel prop provided
      console.log('Cancel wizard - no onCancel handler provided');
    }
  };

  const handlePublish = async () => {
    // TODO: Submit event to backend
    console.log('Publish event:', wizardData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={wizardData}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <Step2Social
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3Details
            data={wizardData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4Review
            data={wizardData}
            onBack={handleBack}
            onPublish={handlePublish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Create Event</Text>
          <Pressable
            style={[
              styles.privateToggle,
              isPrivate && styles.privateToggleActive,
            ]}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            <View
              style={[styles.toggleIcon, isPrivate && styles.toggleIconActive]}
            >
              {isPrivate && <Icon name="check" size={12} color="#fff" />}
            </View>
            <Text style={styles.toggleLabel}>Private</Text>
          </Pressable>
        </View>
        <Pressable style={styles.closeButton} onPress={handleCancel}>
          <Icon name="close" size={20} color="#ff6b35" />
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map(step => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              currentStep >= step && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundDark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  titleGradient: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff6b35',
    textShadowColor: 'rgba(255, 140, 66, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  privateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  privateToggleActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.25)',
    borderColor: '#ff6b35',
  },
  toggleIcon: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: '#ff6b35',
  },
});
