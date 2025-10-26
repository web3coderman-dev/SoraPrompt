import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'creator' | 'director';
export type ResetCycle = 'daily' | 'monthly';

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  remaining_credits: number;
  total_credits: number;
  reset_cycle: ResetCycle;
  renewal_date: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
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

  const hasCredits = (cost: number = 1): boolean => {
    if (!subscription) return false;
    return subscription.remaining_credits >= cost;
  };

  const canUseDirectorMode = (): boolean => {
    if (!subscription) return false;
    return subscription.tier === 'creator' || subscription.tier === 'director';
  };

  const upgradeSubscription = async (newTier: SubscriptionTier): Promise<boolean> => {
    if (!user || !subscription) {
      console.log('No user or subscription found');
      return false;
    }

    try {
      console.log('Upgrading subscription to:', newTier);
      const { data, error } = await supabase.rpc('upgrade_subscription', {
        p_user_id: user.id,
        p_new_tier: newTier,
      });

      console.log('Upgrade response:', { data, error });

      if (error) throw error;

      if (data) {
        console.log('Upgrade successful, refreshing subscription');
        await refreshSubscription();
        return true;
      }
      console.log('Upgrade failed: no data returned');
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
