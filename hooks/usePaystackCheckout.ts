import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../lib/apiClient';

// ── Types ──
export type CheckoutStep = 'contact' | 'payment' | 'processing' | 'success' | 'failed';
export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer';

export interface ProcessingStep {
  id: number;
  text: string;
  status: 'pending' | 'loading' | 'done';
}

export interface PlanConfig {
  id: string;
  name: string;
  description: string;
  amount: number;       // in dollars (display)
  amountCents: number;  // in cents (API)
  credits: number;
  creditsLabel: string;
  interval: 'monthly' | 'one-time';
  seatCount?: number;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutState {
  step: CheckoutStep;
  plan: PlanConfig | null;
  contact: ContactForm;
  paymentMethod: PaymentMethod;
  currency: string;
  reference: string;
  authorizationUrl: string;
  error: string;
  processingSteps: ProcessingStep[];
}

const INITIAL_PROCESSING_STEPS: ProcessingStep[] = [
  { id: 1, text: 'Initializing secure payment session', status: 'pending' },
  { id: 2, text: 'Verifying payment details with Paystack', status: 'pending' },
  { id: 3, text: 'Charging payment method', status: 'pending' },
  { id: 4, text: 'Activating your plan & adding credits', status: 'pending' },
];

// ── Plan Configs ──
export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  personal: {
    id: 'personal', name: 'Personal Plan', description: '500 credits/month · No daily reset',
    amount: 15, amountCents: 1500, credits: 500, creditsLabel: 'credits/month', interval: 'monthly',
  },
  personal_annual: {
    id: 'personal', name: 'Personal Plan (Annual)', description: '500 credits/month · Billed annually',
    amount: 12, amountCents: 1200, credits: 500, creditsLabel: 'credits/month', interval: 'monthly',
  },
  teams: {
    id: 'teams', name: 'Teams Plan', description: '800 credits/seat/month',
    amount: 15, amountCents: 1500, credits: 800, creditsLabel: 'credits/seat/month', interval: 'monthly',
  },
  student: {
    id: 'student', name: 'Student Plan', description: '500 credits/month · 90% discount',
    amount: 1.50, amountCents: 150, credits: 500, creditsLabel: 'credits/month', interval: 'monthly',
  },
  topup_50: {
    id: 'topup_50', name: '50 Credits', description: 'Non-expiring credits',
    amount: 2, amountCents: 200, credits: 50, creditsLabel: 'credits', interval: 'one-time',
  },
  topup_150: {
    id: 'topup_150', name: '150 Credits', description: 'Non-expiring credits',
    amount: 5, amountCents: 500, credits: 150, creditsLabel: 'credits', interval: 'one-time',
  },
  topup_500: {
    id: 'topup_500', name: '500 Credits', description: 'Non-expiring credits',
    amount: 14, amountCents: 1400, credits: 500, creditsLabel: 'credits', interval: 'one-time',
  },
  topup_1000: {
    id: 'topup_1000', name: '1,000 Credits', description: 'Non-expiring credits',
    amount: 25, amountCents: 2500, credits: 1000, creditsLabel: 'credits', interval: 'one-time',
  },
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════════
// usePaystackCheckout — Full checkout state machine
// ═══════════════════════════════════════════════════════════════
export function usePaystackCheckout() {
  const [state, setState] = useState<CheckoutState>({
    step: 'contact',
    plan: null,
    contact: { firstName: '', lastName: '', email: '', phone: '' },
    paymentMethod: 'card',
    currency: 'USD',
    reference: '',
    authorizationUrl: '',
    error: '',
    processingSteps: [...INITIAL_PROCESSING_STEPS],
  });

  const pollingRef = useRef<boolean>(false);

  // ── Open checkout with a plan ──
  const openCheckout = useCallback((planKey: string, contact?: Partial<ContactForm>) => {
    const plan = PLAN_CONFIGS[planKey];
    if (!plan) return;

    setState(prev => ({
      ...prev,
      step: 'contact',
      plan,
      contact: {
        firstName: contact?.firstName || prev.contact.firstName || '',
        lastName: contact?.lastName || prev.contact.lastName || '',
        email: contact?.email || prev.contact.email || '',
        phone: contact?.phone || prev.contact.phone || '',
      },
      reference: '',
      authorizationUrl: '',
      error: '',
      processingSteps: INITIAL_PROCESSING_STEPS.map(s => ({ ...s, status: 'pending' as const })),
    }));
  }, []);

  // ── Update contact form ──
  const updateContact = useCallback((field: keyof ContactForm, value: string) => {
    setState(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  }, []);

  // ── Set payment method ──
  const setPaymentMethod = useCallback((method: PaymentMethod) => {
    setState(prev => ({ ...prev, paymentMethod: method }));
  }, []);

  // ── Set currency ──
  const setCurrency = useCallback((currency: string) => {
    setState(prev => ({ ...prev, currency }));
  }, []);

  // ── Set step ──
  const setStep = useCallback((step: CheckoutStep) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  // ── Update a processing step status ──
  const updateProcessingStep = useCallback((id: number, status: ProcessingStep['status']) => {
    setState(prev => ({
      ...prev,
      processingSteps: prev.processingSteps.map(s =>
        s.id === id ? { ...s, status } : s
      ),
    }));
  }, []);

  // ── Poll backend for payment confirmation ──
  const pollForConfirmation = useCallback(async (ref: string): Promise<boolean> => {
    pollingRef.current = true;
    for (let i = 0; i < 30; i++) { // up to 60 seconds
      if (!pollingRef.current) return false;
      await sleep(2000);

      try {
        const response = await apiClient.get(`/api/payments/status/${ref}`);
        if (response.ok) {
          const data = await response.json();
          if (data.confirmed) return true;
          if (data.status === 'failed') return false;
        }
      } catch {
        // Continue polling on network errors
      }
    }
    return false;
  }, []);

  // ── Initialize payment — the main action ──
  const initializePayment = useCallback(async () => {
    const { plan, contact, paymentMethod } = state;
    if (!plan) return;

    // Move to processing
    setState(prev => ({
      ...prev,
      step: 'processing',
      error: '',
      processingSteps: INITIAL_PROCESSING_STEPS.map(s => ({ ...s, status: 'pending' as const })),
    }));

    try {
      // Step 1: Initialize session
      updateProcessingStep(1, 'loading');
      await sleep(800);

      const response = await apiClient.post('/api/payments/initialize', {
        plan: plan.id,
        email: contact.email,
        name: `${contact.firstName} ${contact.lastName}`.trim(),
        phone: contact.phone,
        paymentMethod,
        currency: state.currency,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.details || err.error || 'Payment initialization failed');
      }

      const data = await response.json();
      const ref = data.reference;

      setState(prev => ({
        ...prev,
        reference: ref,
        authorizationUrl: data.authorization_url || '',
      }));

      updateProcessingStep(1, 'done');

      // Step 2: Verify details
      updateProcessingStep(2, 'loading');
      await sleep(1200);

      // For card payments, redirect to Paystack's authorization URL
      if (paymentMethod === 'card' && data.authorization_url) {
        // Open Paystack's hosted page in same window
        // User completes card entry there, then gets redirected back
        window.location.href = data.authorization_url;
        return;
      }

      updateProcessingStep(2, 'done');

      // Step 3: Charge payment method
      updateProcessingStep(3, 'loading');

      // Poll for webhook confirmation
      const confirmed = await pollForConfirmation(ref);

      if (!confirmed) {
        updateProcessingStep(3, 'done');
        throw new Error('Payment was not confirmed in time. Please check your transaction history.');
      }

      updateProcessingStep(3, 'done');

      // Step 4: Activate plan
      updateProcessingStep(4, 'loading');
      await sleep(800);
      updateProcessingStep(4, 'done');

      await sleep(500);

      // Success!
      setState(prev => ({ ...prev, step: 'success' }));

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        step: 'failed',
        error: error.message || 'Payment failed. Please try again.',
      }));
    }
  }, [state, updateProcessingStep, pollForConfirmation]);

  // ── Reset / close ──
  const reset = useCallback(() => {
    pollingRef.current = false;
    setState({
      step: 'contact',
      plan: null,
      contact: { firstName: '', lastName: '', email: '', phone: '' },
      paymentMethod: 'card',
      currency: 'USD',
      reference: '',
      authorizationUrl: '',
      error: '',
      processingSteps: INITIAL_PROCESSING_STEPS.map(s => ({ ...s, status: 'pending' as const })),
    });
  }, []);

  return {
    ...state,
    openCheckout,
    updateContact,
    setPaymentMethod,
    setCurrency,
    setStep,
    initializePayment,
    reset,
  };
}
