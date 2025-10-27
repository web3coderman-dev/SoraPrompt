/*
  # Stripe 支付集成 - 数据库扩展

  ## 功能说明
  为现有订阅系统添加 Stripe 支付集成所需的字段和功能

  ## 修改内容
  
  1. 扩展 subscriptions 表
     - `subscription_status` (text) - 订阅状态 (active/canceled/past_due/trialing)
     - `current_period_end` (timestamptz) - 当前计费周期结束时间
     - `cancel_at_period_end` (boolean) - 是否在周期结束时取消
  
  2. 创建 payment_history 表
     - `id` (uuid) - 主键
     - `user_id` (uuid) - 用户 ID（外键）
     - `stripe_payment_intent_id` (text) - Stripe 支付意图 ID
     - `amount` (integer) - 金额（分为单位）
     - `currency` (text) - 货币代码
     - `status` (text) - 支付状态
     - `plan_type` (text) - 套餐类型
     - `created_at` (timestamptz) - 创建时间
  
  3. 创建 webhook_events 表
     - 记录所有 Stripe webhook 事件以便调试和审计
  
  4. 安全性
     - 所有表启用 RLS
     - 用户只能查看自己的支付记录
     - webhook_events 仅系统可访问
*/

-- 1. 扩展 subscriptions 表，添加 Stripe 支付状态字段
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN subscription_status text DEFAULT 'inactive';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'current_period_end'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN current_period_end timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'cancel_at_period_end'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end boolean DEFAULT false;
  END IF;
END $$;

-- 2. 创建支付历史表
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  stripe_charge_id text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  plan_type text NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_intent ON payment_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- 启用 RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- 支付历史 RLS 策略
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. 创建 webhook 事件记录表（用于调试和审计）
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  processing_error text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- 启用 RLS（webhook 表只允许服务角色访问）
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- 4. 创建辅助函数：更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 payment_history 添加自动更新时间戳触发器
DROP TRIGGER IF EXISTS update_payment_history_updated_at ON payment_history;
CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON payment_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. 创建视图：用户订阅概览（包含支付信息）
CREATE OR REPLACE VIEW user_subscription_overview AS
SELECT 
  s.user_id,
  s.tier as plan_type,
  s.subscription_status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.current_period_end,
  s.cancel_at_period_end,
  s.remaining_credits,
  s.total_credits,
  s.renewal_date,
  COUNT(ph.id) as total_payments,
  COALESCE(SUM(CASE WHEN ph.status = 'succeeded' THEN ph.amount ELSE 0 END), 0) as total_paid_amount
FROM subscriptions s
LEFT JOIN payment_history ph ON s.user_id = ph.user_id
GROUP BY s.user_id, s.tier, s.subscription_status, 
         s.stripe_customer_id, s.stripe_subscription_id,
         s.current_period_end, s.cancel_at_period_end,
         s.remaining_credits, s.total_credits, s.renewal_date;

-- 6. 添加约束检查
ALTER TABLE payment_history 
  ADD CONSTRAINT check_amount_positive CHECK (amount >= 0);

ALTER TABLE payment_history
  ADD CONSTRAINT check_currency_format CHECK (currency ~ '^[a-z]{3}$');

-- 7. 添加注释说明
COMMENT ON TABLE payment_history IS '支付历史记录表，存储所有支付交易';
COMMENT ON TABLE webhook_events IS 'Stripe webhook 事件日志表，用于调试和审计';
COMMENT ON COLUMN subscriptions.subscription_status IS '订阅状态: active, canceled, past_due, trialing, incomplete, incomplete_expired';
COMMENT ON COLUMN subscriptions.current_period_end IS '当前订阅周期结束时间';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS '是否在当前周期结束时取消订阅';
COMMENT ON COLUMN payment_history.amount IS '支付金额（以分为单位，如 $10.00 = 1000）';
COMMENT ON COLUMN payment_history.currency IS '货币代码（ISO 4217，如 usd, eur, jpy）';
