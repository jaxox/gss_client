/**
 * Create Event Wizard - Multi-Step Event Creation
 * Implements Story 2-1 visual specification with 4 steps
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Step1BasicInfo from './Step1BasicInfo';
import Step2LocationTime from './Step2LocationTime';
import Step3Details from './Step3Details';
import Step4Review from './Step4Review';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface WizardData {
  // Step 1: Basic Info
  title: string;
  description: string;
  sportId: string;

  // Step 2: Location & Time
  location: string;
  date: Date | null;
  time: Date | null;
  duration: number; // in minutes

  // Step 3: Details
  capacity: number | null;
  cost: number | null;
  paymentDueBy: 'immediate' | '24h_before' | 'at_event';
  paymentMethods: {
    venmo: string;
    paypal: string;
    cashapp: string;
    zelle: string;
    cash: boolean;
  };
  cohosts: string[];
  links: Array<{ icon: string; url: string }>;
  guestInvite: boolean;
}

const initialData: WizardData = {
  title: '',
  description: '',
  sportId: '',
  location: '',
  date: null,
  time: null,
  duration: 120, // default 2 hours
  capacity: null,
  cost: null,
  paymentDueBy: 'immediate',
  paymentMethods: {
    venmo: '',
    paypal: '',
    cashapp: '',
    zelle: '',
    cash: false,
  },
  cohosts: [],
  links: [],
  guestInvite: true,
};

export default function CreateEventWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);

  const handleNext = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    // TODO: Show confirmation dialog, then navigate back
    console.log('Cancel wizard');
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
          <Step2LocationTime
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
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={currentStep === 1 ? handleCancel : handleBack}
        />
        <Appbar.Content title="Create Event" />
        <Appbar.Action icon="close" onPress={handleCancel} />
      </Appbar.Header>
      <MaterialCommunityIcons name="close" size={32} color="#000" />
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
