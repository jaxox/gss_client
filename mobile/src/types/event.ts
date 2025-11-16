/**
 * Event-related TypeScript types
 */

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
  paymentDueBy: '1h_after' | '24h_before' | 'at_event';
  paymentMethods: {
    venmo: string;
    paypal: string;
    cashapp: string;
    zelle: string;
  };
  cohosts: string[];
  links: Array<{ icon: string; title: string; url: string }>;
  guestInvite: boolean;
}
