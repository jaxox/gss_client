/**
 * useCreateEventWizard Hook
 * Manages Create Event wizard state and navigation logic
 */

import { useState } from 'react';
import { WizardData } from '../types/event';

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
  paymentDueBy: '1h_after',
  paymentMethods: {
    venmo: '',
    paypal: '',
    cashapp: '',
    zelle: '',
  },
  cohosts: [],
  links: [],
  guestInvite: true,
};

export const useCreateEventWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);

  const goToNextStep = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setWizardData(initialData);
  };

  const publishEvent = async () => {
    // TODO: Submit event to backend
    console.log('Publishing event:', wizardData);
    return wizardData;
  };

  return {
    currentStep,
    wizardData,
    goToNextStep,
    goToPreviousStep,
    resetWizard,
    publishEvent,
  };
};
