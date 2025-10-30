# Stripe 支付集成文档

## 概述

本项目已完整集成 Stripe 支付系统，支持订阅、续费、取消以及客户自助管理功能。

## 架构设计

### 后端架构

#### Edge Functions

1. **stripe-checkout** - 创建支付会话
   - 路径: `/functions/v1/stripe-checkout`
   - 认证: 需要 JWT
   - 功能: 创建 Stripe Checkout Session，处理新订阅和升级

2. **stripe-webhook** - 处理 Webhook 事件
   - 路径: `/functions/v1/stripe-webhook`
   - 认证: Webhook 签名验证
   - 功能: 处理支付事件，同步订阅状态

3. **stripe-portal** - 客户门户
   - 路径: `/functions/v1/stripe-portal`
   - 认证: 需要 JWT
   - 功能: 创建客户门户会话，用户可管理订阅和支付方式

### 数据库设计

#### 扩展的表结构

**subscriptions 表新增字段:**
- `subscription_status` - 订阅状态 (active/canceled/past_due/trialing/incomplete)
- `current_period_end` - 当前计费周期结束时间
- `cancel_at_period_end` - 是否在周期结束时取消

**payment_history 表 (新建):**
- 记录所有支付交易
- 支持多币种 (USD/EUR/JPY)
- 关联用户和订阅信息

**webhook_events 表 (新建):**
- 记录所有 Webhook 事件
- 用于调试和审计
- 防止重复处理

## 配置要求

### 环境变量

需要在 Bolt.new 后端配置以下环境变量：

```bash
# Stripe 密钥
STRIPE_SECRET_KEY=sk_live_xxx  # 或 sk_test_xxx (测试环境)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 前端环境变量 (.env)
VITE_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
VITE_STRIPE_DIRECTOR_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_DIRECTOR_YEARLY_PRICE_ID=price_xxx
```

### Stripe Dashboard 配置

1. **创建产品和价格**
   - 进入 [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
   - 创建以下产品:
     - Pro 月付 (推荐: $9.99/月)
     - Pro 年付 (推荐: $99.99/年)
     - Director 月付 (推荐: $29.99/月)
     - Director 年付 (推荐: $299.99/年)
   - 复制每个价格的 `price_id`

2. **配置 Webhook**
   - 进入 [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - 添加端点: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - 选择以下事件:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - 复制 Webhook 签名密钥

3. **配置客户门户**
   - 进入 [Stripe Dashboard > Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
   - 启用客户门户
   - 配置允许的操作:
     - ✅ 更新支付方式
     - ✅ 查看发票历史
     - ✅ 取消订阅
     - ✅ 切换订阅计划

## 使用流程

### 1. 用户订阅流程

```
用户点击订阅按钮
    ↓
前端调用 StripeService.redirectToCheckout()
    ↓
后端创建 Checkout Session
    ↓
用户跳转到 Stripe Checkout 页面
    ↓
用户完成支付
    ↓
Stripe 触发 checkout.session.completed webhook
    ↓
后端更新数据库订阅状态
    ↓
用户重定向回应用 (/dashboard?session_id=xxx)
    ↓
前端显示成功消息，刷新订阅状态
```

### 2. 订阅管理流程

```
用户点击"管理订阅"按钮
    ↓
前端调用 StripeService.redirectToPortal()
    ↓
后端创建 Portal Session
    ↓
用户跳转到 Stripe Customer Portal
    ↓
用户修改支付方式/取消订阅
    ↓
Stripe 触发相应 webhook 事件
    ↓
后端同步更新数据库
```

### 3. Webhook 事件处理

#### checkout.session.completed
- 创建或更新订阅记录
- 分配对应套餐的积分
- 创建支付历史记录

#### customer.subscription.updated
- 更新订阅状态
- 更新计费周期结束时间
- 刷新积分额度

#### customer.subscription.deleted
- 将套餐降级为 free
- 清空积分
- 标记订阅为已取消

#### invoice.payment_succeeded
- 记录成功的支付
- 更新支付历史

#### invoice.payment_failed
- 标记订阅为 past_due
- 记录失败的支付

## 前端集成

### StripeService API

```typescript
// 创建 Checkout Session 并跳转
await StripeService.redirectToCheckout(priceId, planType);

// 创建 Portal Session 并跳转
await StripeService.redirectToPortal();

// 手动创建会话（不跳转）
const { url } = await StripeService.createCheckoutSession({
  priceId: 'price_xxx',
  planType: 'pro',
  successUrl: 'https://example.com/success',
  cancelUrl: 'https://example.com/cancel',
});
```

### 组件集成

**SubscriptionPlans 组件已集成:**
- 点击付费套餐按钮自动跳转到 Stripe Checkout
- 显示"管理订阅"按钮（仅活跃订阅）
- 处理支付成功/取消回调
- 显示加载状态和错误提示

## 测试指南

### 本地测试

1. **安装 Stripe CLI**
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   ```

2. **转发 Webhook 到本地**
   ```bash
   stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
   ```

3. **使用测试卡号**
   - 成功支付: `4242 4242 4242 4242`
   - 需要验证: `4000 0025 0000 3155`
   - 拒绝支付: `4000 0000 0000 9995`
   - 过期日期: 任意未来日期
   - CVC: 任意 3 位数字

### 测试场景

#### 1. 新用户订阅
- 测试创建新的 Stripe Customer
- 验证订阅状态同步
- 检查积分正确分配

#### 2. 升级/降级订阅
- 测试从 Pro 升级到 Director
- 测试从 Director 降级到 Free
- 验证积分变化

#### 3. 支付失败
- 使用失败卡号测试
- 验证订阅状态变为 past_due
- 检查失败记录是否保存

#### 4. 取消订阅
- 通过 Customer Portal 取消订阅
- 验证 cancel_at_period_end 标记
- 确认周期结束后降级

#### 5. 续费
- 等待订阅自动续费
- 验证 invoice.payment_succeeded 处理
- 检查积分重置

### 监控和调试

#### 查看 Webhook 日志
```sql
SELECT * FROM webhook_events
ORDER BY created_at DESC
LIMIT 50;
```

#### 查看支付历史
```sql
SELECT
  ph.*,
  up.email
FROM payment_history ph
JOIN auth.users up ON ph.user_id = up.id
ORDER BY ph.created_at DESC;
```

#### 检查订阅状态
```sql
SELECT
  s.*,
  u.email
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_status = 'active';
```

## 安全最佳实践

### 已实施的安全措施

1. **Webhook 签名验证**
   - 使用 `stripe.webhooks.constructEvent()` 验证
   - 防止伪造 webhook 请求

2. **JWT 认证**
   - Checkout 和 Portal 端点需要认证
   - 验证用户身份

3. **RLS (Row Level Security)**
   - 用户只能查看自己的支付历史
   - Webhook 表仅系统可访问

4. **幂等性处理**
   - webhook_events 表记录所有事件
   - event_id 唯一约束防止重复处理

5. **敏感信息保护**
   - 密钥仅存储在服务器端
   - 前端只使用 price_id（公开信息）

### 注意事项

- 🔒 永远不要在前端代码中暴露 `STRIPE_SECRET_KEY`
- ✅ 使用环境变量管理所有密钥
- 🔄 定期轮换 API 密钥
- 📊 监控 Webhook 处理失败率
- 🧪 在生产环境前进行充分测试

## 常见问题

### Q: Webhook 未触发怎么办？
A:
1. 检查 Stripe Dashboard > Webhooks 中的事件日志
2. 验证端点 URL 是否正确
3. 确认已选择正确的事件类型
4. 检查 STRIPE_WEBHOOK_SECRET 是否正确

### Q: 支付成功但订阅未激活？
A:
1. 检查 webhook_events 表是否收到事件
2. 查看 processing_error 字段
3. 验证 metadata 中的 user_id 是否正确
4. 检查 Edge Function 日志

### Q: 如何处理订阅到期？
A:
- Stripe 会自动尝试续费
- 如果支付失败，触发 `invoice.payment_failed`
- 订阅状态变为 `past_due`
- 可配置重试策略和宽限期

### Q: 如何支持多币种？
A:
1. 在 Stripe 中为每个币种创建价格
2. 根据用户地理位置选择对应 price_id
3. payment_history 表已支持记录不同货币

### Q: 如何实现试用期？
A:
```typescript
// 在创建 Checkout Session 时添加
subscription_data: {
  trial_period_days: 14,
  metadata: { ... }
}
```

## 扩展功能

### 计划中的功能

- [ ] 年度订阅折扣
- [ ] 优惠券/促销码支持
- [ ] 团队订阅
- [ ] 按需付费模式
- [ ] 多种支付方式 (Alipay, WeChat Pay)

### 实现建议

**优惠券:**
```typescript
// Checkout Session 添加
allow_promotion_codes: true,
```

**按量计费:**
- 使用 Stripe 的 Metered Billing
- 每月根据实际使用量计费

**企业订阅:**
- 创建 enterprise 套餐
- 支持多用户座位管理

## 技术支持

如遇到问题，请检查:
1. Stripe Dashboard 的事件日志
2. Supabase Edge Function 日志
3. webhook_events 表的错误记录
4. 浏览器控制台的错误信息

## 相关资源

- [Stripe 文档](https://stripe.com/docs)
- [Stripe API 参考](https://stripe.com/docs/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
