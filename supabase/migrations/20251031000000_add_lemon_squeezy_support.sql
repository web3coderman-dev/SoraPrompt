/*
  # Add Lemon Squeezy Payment Support

  1. Schema Changes
    - Add `lemon_customer_id` column to subscriptions
    - Add `lemon_subscription_id` column to subscriptions
    - Add `lemon_order_id` column to subscriptions
    - Add `status` column to track subscription status
    - Add `payment_provider` column to identify provider

  2. New Status Types
    - Create subscription_status enum

  3. Update existing rows
    - Set default values for new columns

  4. Security
    - Maintain existing RLS policies
    - Add new columns to allowed updates

  5. Backward Compatibility
    - Keep Stripe columns functional
    - Support both payment providers
*/

-- Create subscription status enum
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM (
    'trialing',
    'active',
    'cancelled',
    'expired',
    'past_due',
    'paused',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add Lemon Squeezy columns to subscriptions table
DO $$
BEGIN
  -- Add lemon_customer_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'lemon_customer_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN lemon_customer_id text;
  END IF;

  -- Add lemon_subscription_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'lemon_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN lemon_subscription_id text;
  END IF;

  -- Add lemon_order_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'lemon_order_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN lemon_order_id text;
  END IF;

  -- Add status if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'status'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN status subscription_status DEFAULT 'active';
  END IF;

  -- Add payment_provider if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'payment_provider'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN payment_provider text DEFAULT 'stripe';
  END IF;
END $$;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_customer_id
  ON subscriptions(lemon_customer_id)
  WHERE lemon_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_subscription_id
  ON subscriptions(lemon_subscription_id)
  WHERE lemon_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_order_id
  ON subscriptions(lemon_order_id)
  WHERE lemon_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_payment_provider
  ON subscriptions(payment_provider);

-- Update existing subscriptions to have active status
UPDATE subscriptions
SET status = 'active'
WHERE status IS NULL AND tier != 'free';

UPDATE subscriptions
SET status = 'active'
WHERE status IS NULL AND tier = 'free';

-- Add comment for documentation
COMMENT ON COLUMN subscriptions.lemon_customer_id IS 'Lemon Squeezy customer ID';
COMMENT ON COLUMN subscriptions.lemon_subscription_id IS 'Lemon Squeezy subscription ID';
COMMENT ON COLUMN subscriptions.lemon_order_id IS 'Lemon Squeezy order ID';
COMMENT ON COLUMN subscriptions.status IS 'Current subscription status';
COMMENT ON COLUMN subscriptions.payment_provider IS 'Payment provider: stripe or lemon';
