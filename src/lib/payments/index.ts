import { StripeAdapter } from './stripeAdapter';
import { LemonSqueezyAdapter } from './lemonSqueezyAdapter';
import type { PaymentAdapter, PlanConfig, PlanTier } from './types';

export * from './types';

function getPaymentProvider(): PaymentAdapter {
  const provider = import.meta.env.VITE_PAYMENT_PROVIDER || 'stripe';

  if (provider === 'lemon' || provider === 'lemonsqueezy') {
    return new LemonSqueezyAdapter();
  }

  return new StripeAdapter();
}

export const PaymentService = getPaymentProvider();

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    price: 19,
    credits: 100,
    stripeMonthlyPriceId: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_creator_monthly',
    stripeYearlyPriceId: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || 'price_creator_yearly',
    lemonSqueezyVariantId: import.meta.env.VITE_LEMON_VARIANT_CREATOR || '',
  },
  director: {
    id: 'director',
    name: 'Director',
    price: 49,
    credits: 500,
    stripeMonthlyPriceId: import.meta.env.VITE_STRIPE_DIRECTOR_MONTHLY_PRICE_ID || 'price_director_monthly',
    stripeYearlyPriceId: import.meta.env.VITE_STRIPE_DIRECTOR_YEARLY_PRICE_ID || 'price_director_yearly',
    lemonSqueezyVariantId: import.meta.env.VITE_LEMON_VARIANT_DIRECTOR || '',
  },
};

export function getPlanConfig(tier: PlanTier): PlanConfig {
  return PLAN_CONFIGS[tier];
}
