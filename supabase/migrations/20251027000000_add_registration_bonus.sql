/*
  # 添加注册奖励系统

  ## 变更说明
  为新注册用户提供额外的积分奖励，鼓励从游客模式转化为注册用户。

  ## 修改内容

  1. **subscriptions 表扩展**
     - 添加 `bonus_credits` 字段用于存储奖励积分
     - 添加 `bonus_granted_at` 字段记录奖励发放时间
     - 添加 `bonus_reason` 字段记录奖励原因

  2. **授予注册奖励函数**
     - 创建 `grant_registration_bonus()` 函数
     - 自动为新注册用户发放 5 次额外生成机会
     - 防止重复发放奖励

  3. **使用奖励积分函数**
     - 更新 `deduct_credits()` 函数优先使用奖励积分
     - 奖励积分用完后再使用常规积分

  ## 奖励规则
  - 新注册用户：+5 次额外生成
  - 仅在首次注册时发放一次
  - 奖励积分不随每日/每月重置
  - 奖励积分优先于常规积分使用
*/

-- 1. 添加奖励相关字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'bonus_credits'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN bonus_credits integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'bonus_granted_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN bonus_granted_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'bonus_reason'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN bonus_reason text;
  END IF;
END $$;

-- 2. 创建授予注册奖励函数
CREATE OR REPLACE FUNCTION grant_registration_bonus(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_granted boolean;
BEGIN
  SELECT (bonus_granted_at IS NOT NULL)
  INTO v_already_granted
  FROM subscriptions
  WHERE user_id = p_user_id;

  IF v_already_granted THEN
    RETURN false;
  END IF;

  UPDATE subscriptions
  SET
    bonus_credits = 5,
    bonus_granted_at = now(),
    bonus_reason = 'registration_bonus'
  WHERE user_id = p_user_id;

  RETURN true;
END;
$$;

-- 3. 更新扣除积分函数（优先使用奖励积分）
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id uuid,
  p_prompt_id uuid,
  p_mode text,
  p_cost integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_has_credits boolean;
  v_bonus_credits integer;
  v_remaining_credits integer;
  v_bonus_used integer;
  v_regular_used integer;
BEGIN
  SELECT check_credits(p_user_id, p_cost)
  INTO v_has_credits;

  IF NOT v_has_credits THEN
    RETURN false;
  END IF;

  SELECT bonus_credits, remaining_credits
  INTO v_bonus_credits, v_remaining_credits
  FROM subscriptions
  WHERE user_id = p_user_id;

  IF v_bonus_credits >= p_cost THEN
    v_bonus_used := p_cost;
    v_regular_used := 0;
  ELSE
    v_bonus_used := v_bonus_credits;
    v_regular_used := p_cost - v_bonus_credits;
  END IF;

  UPDATE subscriptions
  SET
    bonus_credits = bonus_credits - v_bonus_used,
    remaining_credits = remaining_credits - v_regular_used,
    updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO usage_logs (user_id, prompt_id, mode, credits_used)
  VALUES (p_user_id, p_prompt_id, p_mode, p_cost);

  RETURN true;
END;
$$;

-- 4. 更新检查积分函数（包含奖励积分）
CREATE OR REPLACE FUNCTION check_credits(
  p_user_id uuid,
  p_cost integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sub RECORD;
  v_now timestamptz;
  v_total_available integer;
BEGIN
  SELECT * INTO v_sub
  FROM subscriptions
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  v_now := now();

  IF v_now >= v_sub.renewal_date THEN
    UPDATE subscriptions
    SET
      remaining_credits = total_credits,
      renewal_date = CASE
        WHEN reset_cycle = 'daily' THEN v_now + interval '1 day'
        WHEN reset_cycle = 'monthly' THEN v_now + interval '1 month'
        ELSE v_now + interval '1 day'
      END,
      updated_at = v_now
    WHERE user_id = p_user_id;

    SELECT * INTO v_sub
    FROM subscriptions
    WHERE user_id = p_user_id;
  END IF;

  v_total_available := v_sub.remaining_credits + COALESCE(v_sub.bonus_credits, 0);

  RETURN v_total_available >= p_cost;
END;
$$;

-- 5. 创建触发器：新用户自动发放注册奖励
CREATE OR REPLACE FUNCTION auto_grant_registration_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.tier = 'free' AND NEW.bonus_granted_at IS NULL THEN
    PERFORM grant_registration_bonus(NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_registration_bonus ON subscriptions;

CREATE TRIGGER trigger_auto_registration_bonus
  AFTER INSERT ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION auto_grant_registration_bonus();

-- 6. 为现有用户授予注册奖励（如果尚未发放）
UPDATE subscriptions
SET
  bonus_credits = 5,
  bonus_granted_at = now(),
  bonus_reason = 'retroactive_bonus'
WHERE tier = 'free'
  AND bonus_granted_at IS NULL
  AND created_at >= (now() - interval '30 days');
