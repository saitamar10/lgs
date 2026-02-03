import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Stripe Integration for Web Payments
 * You'll need to replace this with your actual Stripe publishable key
 */

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create Stripe Checkout Session
 * This should be called from your backend
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string | null> {
  try {
    // In production, this should call your backend API
    // For now, we'll use a placeholder
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: params.priceId,
        userId: params.userId,
        userEmail: params.userEmail,
        successUrl: params.successUrl || `${window.location.origin}/subscription/success`,
        cancelUrl: params.cancelUrl || `${window.location.origin}/subscription/cancel`,
      }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    console.error('Stripe redirect error:', error);
    throw error;
  }
}

/**
 * Start subscription flow
 */
export async function startSubscriptionFlow(params: CreateCheckoutSessionParams): Promise<void> {
  const sessionId = await createCheckoutSession(params);
  if (!sessionId) {
    throw new Error('Failed to create checkout session');
  }
  await redirectToCheckout(sessionId);
}

export default {
  getStripe,
  createCheckoutSession,
  redirectToCheckout,
  startSubscriptionFlow,
};
