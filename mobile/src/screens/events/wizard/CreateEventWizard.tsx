/**
 * Create Event Wizard - Multi-Step Event Creation
 * Implements Story 2-1 visual specification with 4 steps
 */

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../../theme';
import { CheckboxButton, FABButton } from '../../../components/buttons';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Social from './Step2Social.premium';
import Step3SettingsPayment from './Step3SettingsPayment.premium';
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

  // Step 2: Social Features (legacy)
  // Step 3: Settings & Payment
  capacity?: number | null;
  waitlistEnabled?: boolean;
  guestCanInvite?: boolean;
  guestCanPlusOne?: boolean;

  // Step 3: New Premium Features
  paymentConfig?: {
    type: 'required' | 'flexible' | 'pay-what-you-can';
    amount?: number;
    minAmount?: number;
    maxAmount?: number;
    dueBy: '1hour' | '24hours' | 'at-event';
    methods: {
      venmo?: string;
      paypal?: string;
      cashapp?: string;
      zelle?: string;
    };
  } | null;
  cohosts?: Array<{
    id: string;
    name: string;
    level: number;
    xp: number;
    reliability: number;
  }>;
  links?: Array<{
    icon: string;
    iconName: string;
    title: string;
    url: string;
  }>;
  questions?: Array<{
    id: string;
    type: 'short-answer' | 'multiple-choice' | 'email';
    question: string;
    required: boolean;
    options?: string[]; // For multiple choice
  }>;
  reminders?: {
    rsvpReminder: {
      enabled: boolean;
      daysBefore: number;
    };
    eventReminder: {
      enabled: boolean;
      hoursBefore: number;
    };
  } | null;

  // Legacy fields
  cost?: number | null;
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
  paymentConfig: null,
  cohosts: [],
  links: [],
  questions: [],
  reminders: null,
  cost: null,
};

interface Props {
  onCancel?: () => void;
}

export default function CreateEventWizard({ onCancel }: Props = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);
  const [isPrivate, setIsPrivate] = useState(false);

  const handleUpdateData = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

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
            onUpdate={handleUpdateData}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3SettingsPayment
            data={wizardData}
            onNext={handleNext}
            onUpdate={handleUpdateData}
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
          <CheckboxButton
            label="Private"
            checked={isPrivate}
            onPress={() => setIsPrivate(!isPrivate)}
          />
        </View>
        <FABButton
          onPress={handleCancel}
          icon="close"
          size="medium"
          variant="remove"
        />
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
