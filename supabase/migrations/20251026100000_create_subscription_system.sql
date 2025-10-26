/*
  # Subscription System Schema

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tier` (enum: free, creator, director)
      - `remaining_credits` (int, current available credits)
      - `total_credits` (int, max credits per cycle)
      - `reset_cycle` (enum: daily, monthly)
      - `renewal_date` (timestamptz, next reset time)
      - `stripe_customer_id` (text, for future payment integration)
      - `stripe_subscription_id` (text, for future payment integration)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `usage_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt_id` (uuid, references prompts)
      - `mode` (text, quick or director)
      - `cost` (int, credits consumed, default 1)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read their own subscription data
    - Users can read their own usage logs
    - System can update subscription data via service role

  3. Functions
    - Auto-create subscription on user signup
    - Auto-reset credits based on cycle
    - Check and deduct credits before generation
*/

-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'creator', 'director');

-- Create reset cycle enum
CREATE TYPE reset_cycle AS ENUM ('daily', 'monthly');

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  tier subscription_tier DEFAULT 'free' NOT NULL,
  remaining_credits int DEFAULT 3 NOT NULL,
  total_credits int DEFAULT 3 NOT NULL,
  reset_cycle reset_cycle DEFAULT 'daily' NOT NULL,
  renewal_date timestamptz DEFAULT (CURRENT_DATE + interval '1 day') NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id uuid REFERENCES prompts(id) ON DELETE SET NULL,
  mode text NOT NULL,
  cost int DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for usage_logs
CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function: Auto-create subscription for new users
CREATE OR REPLACE FUNCTION create_subscription_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, remaining_credits, total_credits, reset_cycle, renewal_date)
  VALUES (
    NEW.id,
    'free',
    3,
    3,
    'daily',
    CURRENT_DATE + interval '1 day'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create subscription when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_subscription_for_user();

-- Function: Check if user has enough credits
CREATE OR REPLACE FUNCTION check_credits(p_user_id uuid, p_cost int DEFAULT 1)
RETURNS boolean AS $$
DECLARE
  v_remaining int;
  v_renewal_date timestamptz;
  v_tier subscription_tier;
  v_reset_cycle reset_cycle;
BEGIN
  -- Get current subscription info
  SELECT remaining_credits, renewal_date, tier, reset_cycle
  INTO v_remaining, v_renewal_date, v_tier, v_reset_cycle
  FROM subscriptions
  WHERE user_id = p_user_id;

  -- If no subscription found, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if credits need to be reset
  IF v_renewal_date <= now() THEN
    -- Reset credits based on tier
    CASE v_tier
      WHEN 'free' THEN
        UPDATE subscriptions
        SET remaining_credits = 3,
            total_credits = 3,
            renewal_date = CURRENT_DATE + interval '1 day',
            updated_at = now()
        WHERE user_id = p_user_id;
        v_remaining := 3;
      WHEN 'creator' THEN
        UPDATE subscriptions
        SET remaining_credits = 1000,
            total_credits = 1000,
            renewal_date = (date_trunc('month', now()) + interval '1 month'),
            updated_at = now()
        WHERE user_id = p_user_id;
        v_remaining := 1000;
      WHEN 'director' THEN
        UPDATE subscriptions
        SET remaining_credits = 3000,
            total_credits = 3000,
            renewal_date = (date_trunc('month', now()) + interval '1 month'),
            updated_at = now()
        WHERE user_id = p_user_id;
        v_remaining := 3000;
    END CASE;
  END IF;

  -- Check if enough credits
  RETURN v_remaining >= p_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Deduct credits after generation
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id uuid, p_prompt_id uuid, p_mode text, p_cost int DEFAULT 1)
RETURNS boolean AS $$
DECLARE
  v_remaining int;
BEGIN
  -- Check credits first
  IF NOT check_credits(p_user_id, p_cost) THEN
    RETURN false;
  END IF;

  -- Deduct credits
  UPDATE subscriptions
  SET remaining_credits = remaining_credits - p_cost,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING remaining_credits INTO v_remaining;

  -- Log usage
  INSERT INTO usage_logs (user_id, prompt_id, mode, cost)
  VALUES (p_user_id, p_prompt_id, p_mode, p_cost);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Upgrade subscription
CREATE OR REPLACE FUNCTION upgrade_subscription(p_user_id uuid, p_new_tier subscription_tier)
RETURNS boolean AS $$
DECLARE
  v_new_credits int;
  v_new_cycle reset_cycle;
  v_new_renewal timestamptz;
BEGIN
  -- Set credits and cycle based on tier
  CASE p_new_tier
    WHEN 'free' THEN
      v_new_credits := 3;
      v_new_cycle := 'daily';
      v_new_renewal := CURRENT_DATE + interval '1 day';
    WHEN 'creator' THEN
      v_new_credits := 1000;
      v_new_cycle := 'monthly';
      v_new_renewal := date_trunc('month', now()) + interval '1 month';
    WHEN 'director' THEN
      v_new_credits := 3000;
      v_new_cycle := 'monthly';
      v_new_renewal := date_trunc('month', now()) + interval '1 month';
  END CASE;

  -- Update subscription
  UPDATE subscriptions
  SET tier = p_new_tier,
      remaining_credits = v_new_credits,
      total_credits = v_new_credits,
      reset_cycle = v_new_cycle,
      renewal_date = v_new_renewal,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON subscriptions(renewal_date);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);
