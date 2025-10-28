/*
  # Add Guest Usage Tracking

  1. New Tables
    - `guest_usage_logs`
      - `id` (uuid, primary key)
      - `fingerprint` (text) - Device fingerprint
      - `ip_address` (text) - User IP address
      - `session_id` (text) - Session identifier
      - `usage_count` (int) - Number of uses today
      - `usage_date` (date) - Date of usage
      - `last_used_at` (timestamptz) - Last usage timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `guest_usage_logs` table
    - No policies needed - accessed only via Edge Functions

  3. Functions
    - `check_guest_usage` - Check if guest can use the service
    - `record_guest_usage` - Record guest usage
*/

-- Create guest usage logs table
CREATE TABLE IF NOT EXISTS guest_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  ip_address text NOT NULL,
  session_id text,
  usage_count int DEFAULT 0,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  last_used_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_guest_usage_fingerprint_date 
  ON guest_usage_logs(fingerprint, usage_date);

CREATE INDEX IF NOT EXISTS idx_guest_usage_ip_date 
  ON guest_usage_logs(ip_address, usage_date);

-- Enable RLS
ALTER TABLE guest_usage_logs ENABLE ROW LEVEL SECURITY;

-- Function: Check guest usage limit
CREATE OR REPLACE FUNCTION check_guest_usage(
  p_fingerprint text,
  p_ip_address text,
  p_daily_limit int DEFAULT 3
)
RETURNS jsonb AS $$
DECLARE
  v_record record;
  v_remaining int;
BEGIN
  -- Get or create usage record for today
  SELECT * INTO v_record
  FROM guest_usage_logs
  WHERE fingerprint = p_fingerprint
    AND usage_date = CURRENT_DATE
  LIMIT 1;

  -- If no record exists, return full quota
  IF v_record IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', p_daily_limit,
      'total', p_daily_limit,
      'reset_at', (CURRENT_DATE + interval '1 day')::text
    );
  END IF;

  -- Check if limit exceeded
  v_remaining := p_daily_limit - v_record.usage_count;
  
  IF v_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'total', p_daily_limit,
      'reset_at', (CURRENT_DATE + interval '1 day')::text,
      'message', 'Daily limit reached'
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', v_remaining,
    'total', p_daily_limit,
    'reset_at', (CURRENT_DATE + interval '1 day')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Record guest usage
CREATE OR REPLACE FUNCTION record_guest_usage(
  p_fingerprint text,
  p_ip_address text,
  p_session_id text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_existing_id uuid;
BEGIN
  -- Try to find existing record for today
  SELECT id INTO v_existing_id
  FROM guest_usage_logs
  WHERE fingerprint = p_fingerprint
    AND usage_date = CURRENT_DATE
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    -- Update existing record
    UPDATE guest_usage_logs
    SET usage_count = usage_count + 1,
        last_used_at = now(),
        updated_at = now(),
        ip_address = p_ip_address,
        session_id = COALESCE(p_session_id, session_id)
    WHERE id = v_existing_id;
  ELSE
    -- Create new record
    INSERT INTO guest_usage_logs (
      fingerprint,
      ip_address,
      session_id,
      usage_count,
      usage_date
    ) VALUES (
      p_fingerprint,
      p_ip_address,
      p_session_id,
      1,
      CURRENT_DATE
    );
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Cleanup old guest logs (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_guest_logs()
RETURNS int AS $$
DECLARE
  v_deleted_count int;
BEGIN
  DELETE FROM guest_usage_logs
  WHERE usage_date < CURRENT_DATE - interval '7 days';
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
