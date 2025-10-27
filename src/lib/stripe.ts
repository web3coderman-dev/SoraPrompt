import { supabase } from './supabase';

export interface CheckoutSessionRequest {
  priceId: string;
  planType: 'pro' | 'director';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

export class StripeService {
  private static async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }
    return session.access_token;
  }

  static async createCheckoutSession(
    request: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> {
    const token = await this.getAuthToken();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  }

  static async createPortalSession(returnUrl?: string): Promise<PortalSessionResponse> {
    const token = await this.getAuthToken();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const response = await fetch(`${supabaseUrl}/functions/v1/stripe-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ returnUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    return response.json();
  }

  static async redirectToCheckout(priceId: string, planType: 'pro' | 'director'): Promise<void> {
    try {
      const { url } = await this.createCheckoutSession({
        priceId,
        planType,
      });

      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }

  static async redirectToPortal(): Promise<void> {
    try {
      const { url } = await this.createPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      throw error;
    }
  }
}

export const STRIPE_PRICE_IDS = {
  pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  pro_yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  director_monthly: import.meta.env.VITE_STRIPE_DIRECTOR_MONTHLY_PRICE_ID || 'price_director_monthly',
  director_yearly: import.meta.env.VITE_STRIPE_DIRECTOR_YEARLY_PRICE_ID || 'price_director_yearly',
};
