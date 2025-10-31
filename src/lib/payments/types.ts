export type PlanTier = 'free' | 'creator' | 'director';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  price: number;
  credits: number;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  lemonSqueezyVariantId?: string;
}

export interface CheckoutSessionRequest {
  planTier: PlanTier;
  billingCycle?: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId?: string;
  url: string;
}

export interface PortalSessionRequest {
  returnUrl?: string;
}

export interface PortalSessionResponse {
  url: string;
}

export interface PaymentAdapter {
  createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse>;
  createPortalSession(request: PortalSessionRequest): Promise<PortalSessionResponse>;
  redirectToCheckout(planTier: PlanTier, billingCycle?: 'monthly' | 'yearly'): Promise<void>;
  redirectToPortal(returnUrl?: string): Promise<void>;
}
