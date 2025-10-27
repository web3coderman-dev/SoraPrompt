import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import {
  getGuestCredits,
  hasGuestCredits,
  deductGuestCredits,
  getGuestUsageStats,
} from '../lib/guestUsage';

export type SubscriptionTier = 'guest' | 'free' | 'creator' | 'director';
export type ResetCycle = 'daily' | 'monthly';

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  remaining_credits: number;
  total_credits: number;
  bonus_credits?: number;
  bonus_granted_at?: string;
  bonus_reason?: string;
  reset_cycle: ResetCycle;
  renewal_date: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
}

interface GuestSubscription {
  tier: 'guest';
  remaining_credits: number;
  total_credits: number;
  reset_cycle: 'daily';
  isGuest: true;
}

interface SubscriptionContextType {
  subscription: Subscription | GuestSubscription | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  hasCredits: (cost?: number) => boolean;
  canUseDirectorMode: () => boolean;
  refreshSubscription: () => Promise<void>;
  upgradeSubscription: (newTier: SubscriptionTier) => Promise<boolean>;
  deductCredits: (promptId: string, mode: string, cost?: number) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | GuestSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuestSubscription = () => {
    const stats = getGuestUsageStats();
    const guestSub: GuestSubscription = {
      tier: 'guest',
      remaining_credits: stats.remaining,
      total_credits: stats.total,
      reset_cycle: 'daily',
      isGuest: true,
    };
    setSubscription(guestSub);
    setLoading(false);
  };

  const refreshSubscription = async () => {
    if (!user) {
      loadGuestSubscription();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        const { data: newSub, error: createError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            tier: 'free',
            remaining_credits: 3,
            total_credits: 3,
            reset_cycle: 'daily',
            renewal_date: new Date(Date.now() + 86400000).toISOString(),
          })
          .select()
          .single();

        if (createError) throw createError;
        setSubscription(newSub);
      } else {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const isGuest = !user;

  const hasCredits = (cost: number = 1): boolean => {
    if (!subscription) return false;

    if (isGuest) {
      return hasGuestCredits(cost);
    }

    return subscription.remaining_credits >= cost;
  };

  const canUseDirectorMode = (): boolean => {
    if (!subscription) return false;
    if (isGuest) return false;

    const tier = subscription.tier as SubscriptionTier;
    return tier === 'creator' || tier === 'director';
  };

  const upgradeSubscription = async (newTier: SubscriptionTier): Promise<boolean> => {
    if (!user || !subscription || isGuest) return false;

    try {
      const { data, error } = await supabase.rpc('upgrade_subscription', {
        p_user_id: user.id,
        p_new_tier: newTier,
      });

      if (error) throw error;

      if (data) {
        await refreshSubscription();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      return false;
    }
  };

  const deductCredits = async (
    promptId: string,
    mode: string,
    cost: number = 1
  ): Promise<boolean> => {
    if (isGuest) {
      const success = deductGuestCredits(cost);
      if (success) {
        loadGuestSubscription();
      }
      return success;
    }

    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_prompt_id: promptId,
        p_mode: mode,
        p_cost: cost,
      });

      if (error) throw error;

      if (data) {
        await refreshSubscription();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deducting credits:', err);
      return false;
    }
  };

  const value: SubscriptionContextType = {
    subscription,
    isGuest,
    loading,
    error,
    hasCredits,
    canUseDirectorMode,
    refreshSubscription,
    upgradeSubscription,
    deductCredits,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
