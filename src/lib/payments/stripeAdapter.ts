import { supabase } from '../supabase';
import type {
  PaymentAdapter,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PortalSessionRequest,
  PortalSessionResponse,
} from './types';

export class StripeAdapter implements PaymentAdapter {
  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }
    return session.access_token;
  }

  private getSupabaseUrl(): string {
    return import.meta.env.VITE_SUPABASE_URL;
  }

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    const token = await this.getAuthToken();
    const supabaseUrl = this.getSupabaseUrl();

    const priceId = this.getPriceId(request.planTier, request.billingCycle || 'monthly');

    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        priceId,
        planType: request.planTier === 'creator' ? 'pro' : request.planTier,
        successUrl: request.successUrl,
        cancelUrl: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  }

  async createPortalSession(request: PortalSessionRequest): Promise<PortalSessionResponse> {
    const token = await this.getAuthToken();
    const supabaseUrl = this.getSupabaseUrl();

    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ returnUrl: request.returnUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    return response.json();
  }

  async redirectToCheckout(planTier: 'free' | 'creator' | 'director', billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<void> {
    if (planTier === 'free') {
      throw new Error('Cannot checkout for free plan');
    }

    try {
      const { url } = await this.createCheckoutSession({
        planTier,
        billingCycle,
      });

      window.location.href = url;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }

  async redirectToPortal(returnUrl?: string): Promise<void> {
    try {
      const { url } = await this.createPortalSession({ returnUrl });
      window.location.href = url;
    } catch (error) {
      console.error('Stripe portal error:', error);
      throw error;
    }
  }

  private getPriceId(planTier: 'free' | 'creator' | 'director', billingCycle: 'monthly' | 'yearly'): string {
    const prefix = planTier === 'creator' ? 'pro' : planTier;
    const key = `VITE_STRIPE_${prefix.toUpperCase()}_${billingCycle.toUpperCase()}_PRICE_ID`;
    return import.meta.env[key] || `price_${prefix}_${billingCycle}`;
  }
}
