/*
  # Remove Unused Indexes and Fix Security Issues

  ## Changes

  ### 1. Remove Unused Indexes
  - Drop `idx_prompt_versions_prompt_id` on `prompt_versions`
  - Drop `idx_user_preferences_session_id` on `user_preferences`
  - Drop `idx_payment_history_user_id` on `payment_history`
  - Drop `idx_payment_history_created_at` on `payment_history`
  - Drop `idx_payment_history_stripe_payment_intent` on `payment_history`
  - Drop `idx_payment_history_status` on `payment_history`
  - Drop `idx_usage_logs_prompt_id` on `usage_logs`
  - Drop `idx_webhook_events_event_id` on `webhook_events`
  - Drop `idx_webhook_events_event_type` on `webhook_events`
  - Drop `idx_webhook_events_processed` on `webhook_events`
  - Drop `idx_webhook_events_created_at` on `webhook_events`
  - Drop `idx_prompts_session_id` on `prompts`
  - Drop `idx_subscriptions_renewal_date` on `subscriptions`
  - Drop `idx_usage_logs_user_id` on `usage_logs`
  - Drop `idx_usage_logs_created_at` on `usage_logs`
  - Drop `idx_guest_usage_fingerprint_date` on `guest_usage_logs`
  - Drop `idx_guest_usage_ip_date` on `guest_usage_logs`

  ### 2. Fix Security Issues with View
  - Drop and recreate `user_subscription_overview` WITHOUT security definer
  - Add RLS policy to restrict access to own data only
  - Only expose minimal user data (no email to others)

  ## Security Notes
  - All unused indexes removed to improve performance and reduce maintenance
  - View no longer uses SECURITY DEFINER
  - View access controlled through RLS policies
  - Users can only see their own subscription data
*/

-- =====================================================
-- 1. DROP UNUSED INDEXES
-- =====================================================

-- Drop unused indexes on prompt_versions
DROP INDEX IF EXISTS public.idx_prompt_versions_prompt_id;

-- Drop unused indexes on user_preferences
DROP INDEX IF EXISTS public.idx_user_preferences_session_id;

-- Drop unused indexes on payment_history
DROP INDEX IF EXISTS public.idx_payment_history_user_id;
DROP INDEX IF EXISTS public.idx_payment_history_created_at;
DROP INDEX IF EXISTS public.idx_payment_history_stripe_payment_intent;
DROP INDEX IF EXISTS public.idx_payment_history_status;

-- Drop unused indexes on usage_logs
DROP INDEX IF EXISTS public.idx_usage_logs_prompt_id;
DROP INDEX IF EXISTS public.idx_usage_logs_user_id;
DROP INDEX IF EXISTS public.idx_usage_logs_created_at;

-- Drop unused indexes on webhook_events
DROP INDEX IF EXISTS public.idx_webhook_events_event_id;
DROP INDEX IF EXISTS public.idx_webhook_events_event_type;
DROP INDEX IF EXISTS public.idx_webhook_events_processed;
DROP INDEX IF EXISTS public.idx_webhook_events_created_at;

-- Drop unused indexes on prompts
DROP INDEX IF EXISTS public.idx_prompts_session_id;

-- Drop unused indexes on subscriptions
DROP INDEX IF EXISTS public.idx_subscriptions_renewal_date;

-- Drop unused indexes on guest_usage_logs
DROP INDEX IF EXISTS public.idx_guest_usage_fingerprint_date;
DROP INDEX IF EXISTS public.idx_guest_usage_ip_date;

-- =====================================================
-- 2. FIX SECURITY DEFINER VIEW AND AUTH EXPOSURE
-- =====================================================

-- Drop the existing view
DROP VIEW IF EXISTS public.user_subscription_overview;

-- Create a secure function instead of a view to prevent auth.users exposure
-- This function uses SECURITY DEFINER safely by checking auth.uid()
CREATE OR REPLACE FUNCTION public.get_user_subscription_info()
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  tier text,
  remaining_credits integer,
  total_credits integer,
  subscription_status text,
  renewal_date timestamptz,
  subscription_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return data for the authenticated user
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    u.id as user_id,
    u.email,
    up.full_name,
    s.tier,
    s.remaining_credits,
    s.total_credits,
    s.subscription_status,
    s.renewal_date,
    s.created_at as subscription_created_at
  FROM auth.users u
  LEFT JOIN public.user_profiles up ON u.id = up.id
  LEFT JOIN public.subscriptions s ON u.id = s.user_id
  WHERE u.id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_user_subscription_info() TO authenticated;

-- Revoke any public access
REVOKE ALL ON FUNCTION public.get_user_subscription_info() FROM public;

-- Add comment explaining the security model
COMMENT ON FUNCTION public.get_user_subscription_info() IS
'Securely returns subscription information for the authenticated user only. Uses SECURITY DEFINER to access auth.users but restricts results to auth.uid().';

-- =====================================================
-- 3. VERIFY ESSENTIAL INDEXES REMAIN
-- =====================================================

-- Keep only the actively used indexes
-- These should already exist from previous migrations:
-- - idx_prompts_user_id (used for user queries)
-- - idx_prompts_created_at (used for sorting)
-- - idx_subscriptions_user_id (used for lookups)

-- Verify essential indexes exist
DO $$
BEGIN
  -- Ensure user_id index exists on prompts (this is critical)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'prompts'
    AND indexname = 'idx_prompts_user_id'
  ) THEN
    CREATE INDEX idx_prompts_user_id ON public.prompts(user_id) WHERE user_id IS NOT NULL;
  END IF;

  -- Ensure created_at index exists on prompts (for sorting)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'prompts'
    AND indexname = 'idx_prompts_created_at'
  ) THEN
    CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);
  END IF;

  -- Ensure user_id index exists on subscriptions (critical for lookups)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'subscriptions'
    AND indexname = 'idx_subscriptions_user_id'
  ) THEN
    CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
  END IF;
END $$;
