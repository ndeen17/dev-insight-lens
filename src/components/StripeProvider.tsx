/**
 * Stripe Provider
 * Wraps children with Stripe Elements context.
 * Only loads Stripe.js when a publishable key is configured.
 */

import { useMemo } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise && STRIPE_PK) {
    stripePromise = loadStripe(STRIPE_PK);
  }
  return stripePromise ?? Promise.resolve(null);
}

interface StripeProviderProps {
  children: React.ReactNode;
  /** Optional client secret — pass when confirming a specific PaymentIntent / SetupIntent */
  clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const stripe = useMemo(() => getStripe(), []);

  if (!STRIPE_PK) {
    // Stripe not configured — render children without Elements wrapper
    return <>{children}</>;
  }

  const options = clientSecret
    ? { clientSecret, appearance: { theme: 'stripe' as const } }
    : { appearance: { theme: 'stripe' as const } };

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}
