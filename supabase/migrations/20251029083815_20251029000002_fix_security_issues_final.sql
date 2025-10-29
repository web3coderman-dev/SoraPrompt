/*
  # Security Fixes and Performance Optimization

  This migration addresses multiple security and performance issues:

  ## 1. Index Optimization
    - Add missing index on usage_logs.prompt_id foreign key

  ## 2. RLS Policy Performance Optimization
    - Update all RLS policies to use (select auth.uid()) instead of auth.uid()
    - This prevents re-evaluation for each row and improves query performance

  ## 3. Duplicate Policy Removal
    - Remove duplicate policies on prompts table

  ## 4. Missing RLS Policies
    - Add policies for guest_usage_logs and webhook_events tables

  ## 5. Function Security
    - Set search_path for all functions to prevent search path injection

  ## 6. Security Definer View
    - Recreate view without SECURITY DEFINER

  ## Security Notes
    - All changes maintain existing access patterns
    - Data integrity is preserved
    - Performance is improved significantly at scale
*/

-- =====================================================
-- 1. ADD MISSING INDEX FOR FOREIGN KEY
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_usage_logs_prompt_id ON public.usage_logs(prompt_id);

-- =====================================================
-- 2. DROP DUPLICATE RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can view own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can insert own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can update own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can delete own prompts" ON public.prompts;

-- =====================================================
-- 3. UPDATE RLS POLICIES FOR PERFORMANCE
-- =====================================================

-- user_profiles table (uses 'id' column)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- prompts table (recreate with optimized auth function calls)
DROP POLICY IF EXISTS "Users can insert their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can create their prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can read their prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can update their prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can delete their prompts" ON public.prompts;

CREATE POLICY "Authenticated users can create their prompts"
  ON public.prompts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can read their prompts"
  ON public.prompts FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can update their prompts"
  ON public.prompts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Authenticated users can delete their prompts"
  ON public.prompts FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_settings table
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON public.user_settings;

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own settings"
  ON public.user_settings FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- stripe_customers table
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.stripe_customers;

CREATE POLICY "Users can view their own customer data"
  ON public.stripe_customers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- stripe_subscriptions table (uses customer_id, needs join to stripe_customers)
DROP POLICY IF EXISTS "Users can view their own subscription data" ON public.stripe_subscriptions;

CREATE POLICY "Users can view their own subscription data"
  ON public.stripe_subscriptions FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM public.stripe_customers 
      WHERE user_id = (select auth.uid())
    )
  );

-- stripe_orders table (uses customer_id, needs join to stripe_customers)
DROP POLICY IF EXISTS "Users can view their own order data" ON public.stripe_orders;

CREATE POLICY "Users can view their own order data"
  ON public.stripe_orders FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM public.stripe_customers 
      WHERE user_id = (select auth.uid())
    )
  );

-- subscriptions table
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own subscription"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- usage_logs table
DROP POLICY IF EXISTS "Users can view own usage logs" ON public.usage_logs;
DROP POLICY IF EXISTS "Users can insert own usage logs" ON public.usage_logs;

CREATE POLICY "Users can view own usage logs"
  ON public.usage_logs FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own usage logs"
  ON public.usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- payment_history table
DROP POLICY IF EXISTS "Users can view own payment history" ON public.payment_history;

CREATE POLICY "Users can view own payment history"
  ON public.payment_history FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- 4. ADD MISSING RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Service role can manage guest usage logs" ON public.guest_usage_logs;

CREATE POLICY "Service role can manage guest usage logs"
  ON public.guest_usage_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;

CREATE POLICY "Service role can manage webhook events"
  ON public.webhook_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. FIX FUNCTION SEARCH PATHS
-- =====================================================

ALTER FUNCTION public.create_subscription_for_user SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column SET search_path = public, pg_temp;
ALTER FUNCTION public.check_credits SET search_path = public, pg_temp;
ALTER FUNCTION public.deduct_credits SET search_path = public, pg_temp;
ALTER FUNCTION public.upgrade_subscription SET search_path = public, pg_temp;
ALTER FUNCTION public.update_user_settings_updated_at SET search_path = public, pg_temp;
ALTER FUNCTION public.upsert_user_settings SET search_path = public, pg_temp;
ALTER FUNCTION public.check_guest_usage SET search_path = public, pg_temp;
ALTER FUNCTION public.record_guest_usage SET search_path = public, pg_temp;
ALTER FUNCTION public.cleanup_old_guest_logs SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user SET search_path = public, pg_temp;

-- =====================================================
-- 6. FIX SECURITY DEFINER VIEW
-- =====================================================

DROP VIEW IF EXISTS public.user_subscription_overview;

CREATE VIEW public.user_subscription_overview AS
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
LEFT JOIN public.subscriptions s ON u.id = s.user_id;

GRANT SELECT ON public.user_subscription_overview TO authenticated;