/*
  # Update Subscription Credits and Features

  1. Changes
    - Update Free tier: 3 → 5 daily credits
    - Update Creator tier: 50 → 1000 monthly credits
    - Update Director tier: 200 → 3000 monthly credits
    - Enable director mode for Free tier users (no database changes needed, handled in app logic)

  2. Updates
    - Modify default values in subscriptions table
    - Update check_credits function to use new credit amounts
    - Update upgrade_subscription function to use new credit amounts
    - Update create_subscription_for_user function to use new default

  3. Notes
    - Existing subscriptions keep their current credits until next renewal
    - New users will get the updated credit amounts
    - Credit reset logic will use new amounts on next cycle
*/

-- Update the create_subscription_for_user function with new defaults
CREATE OR REPLACE FUNCTION create_subscription_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, remaining_credits, total_credits, reset_cycle, renewal_date)
  VALUES (
    NEW.id,
    'free',
    5,
    5,
    'daily',
    CURRENT_DATE + interval '1 day'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update check_credits function with new credit amounts
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
    -- Reset credits based on tier with new amounts
    CASE v_tier
      WHEN 'free' THEN
        UPDATE subscriptions
        SET remaining_credits = 5,
            total_credits = 5,
            renewal_date = CURRENT_DATE + interval '1 day',
            updated_at = now()
        WHERE user_id = p_user_id;
        v_remaining := 5;
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

-- Update upgrade_subscription function with new credit amounts
CREATE OR REPLACE FUNCTION upgrade_subscription(p_user_id uuid, p_new_tier subscription_tier)
RETURNS boolean AS $$
DECLARE
  v_new_credits int;
  v_new_cycle reset_cycle;
  v_new_renewal timestamptz;
BEGIN
  -- Set credits and cycle based on tier with new amounts
  CASE p_new_tier
    WHEN 'free' THEN
      v_new_credits := 5;
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
