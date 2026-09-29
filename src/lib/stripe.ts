import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const isStripeConfigured = (): boolean => {
  return Boolean(
    stripeSecretKey &&
    stripeSecretKey.startsWith('sk_') &&
    !stripeSecretKey.includes('your_secret_key')
  );
};

let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe | null {
  if (!isStripeConfigured()) {
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
      typescript: true,
    });
  }

  return stripeInstance;
}

export function formatAmountForStripe(amountInDollars: number): number {
  return Math.round(amountInDollars * 100);
}
