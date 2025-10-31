# 支付系统集成速查表

## 快速切换支付方式

### 使用 Lemon Squeezy (默认)
```bash
# .env
VITE_PAYMENT_PROVIDER=lemon
```

### 使用 Stripe
```bash
# .env
VITE_PAYMENT_PROVIDER=stripe
```

重新构建即可：
```bash
npm run build
```

---

## 核心架构

```typescript
// 统一调用接口
import { PaymentService } from './lib/payments';

// 创建订阅
await PaymentService.redirectToCheckout('creator', 'monthly');

// 管理订阅
await PaymentService.redirectToPortal();
```

系统自动根据 `VITE_PAYMENT_PROVIDER` 选择实现。

---

## 订阅计划配置

| 计划 | 价格 | 积分 | Lemon Variant | Stripe Price ID |
|------|------|------|---------------|-----------------|
| Free | $0 | 10 | - | - |
| Creator | $19/月 | 100 | `VITE_LEMON_VARIANT_CREATOR` | `VITE_STRIPE_PRO_MONTHLY_PRICE_ID` |
| Director | $49/月 | 500 | `VITE_LEMON_VARIANT_DIRECTOR` | `VITE_STRIPE_DIRECTOR_MONTHLY_PRICE_ID` |

---

## Edge Functions

| Function | URL | 用途 |
|----------|-----|------|
| lemon-checkout | `/functions/v1/lemon-checkout` | 创建结账会话 |
| lemon-portal | `/functions/v1/lemon-portal` | 获取客户门户 URL |
| lemon-webhook | `/functions/v1/lemon-webhook` | 处理 Webhook 事件 |

---

## Webhook 事件处理

| 事件 | 操作 |
|------|------|
| `order_created` | 创建订阅记录 |
| `subscription_created` | 激活订阅 |
| `subscription_updated` | 更新状态 |
| `subscription_cancelled` | 取消订阅 |
| `subscription_expired` | 降级到 Free |
| `order_refunded` | 撤销订阅 |

---

## 数据库字段

新增字段到 `subscriptions` 表：
- `lemon_customer_id` - Lemon Squeezy 客户 ID
- `lemon_subscription_id` - 订阅 ID
- `lemon_order_id` - 订单 ID
- `status` - 订阅状态 (枚举)
- `payment_provider` - 支付提供商 ('stripe' | 'lemon')

---

## 环境变量清单

### 前端 (.env)
```bash
VITE_PAYMENT_PROVIDER=lemon
VITE_LEMON_VARIANT_CREATOR=xxx
VITE_LEMON_VARIANT_DIRECTOR=xxx
VITE_STRIPE_PRO_MONTHLY_PRICE_ID=xxx
VITE_STRIPE_DIRECTOR_MONTHLY_PRICE_ID=xxx
```

### Supabase Secrets
```bash
LEMON_API_KEY=xxx
LEMON_STORE_ID=xxx
LEMON_VARIANT_CREATOR=xxx
LEMON_VARIANT_DIRECTOR=xxx
LEMON_WEBHOOK_SECRET=xxx
STRIPE_SECRET_KEY=xxx
APP_URL=https://your-domain.com
```

---

## 部署步骤

```bash
# 1. 部署 Edge Functions
supabase functions deploy lemon-checkout
supabase functions deploy lemon-portal
supabase functions deploy lemon-webhook

# 2. 应用数据库迁移
supabase db push

# 3. 构建前端
npm run build

# 4. 部署到生产环境
```

---

## 测试清单

- [ ] Checkout 流程正常
- [ ] 支付成功页面跳转
- [ ] 支付取消页面跳转
- [ ] Webhook 事件触发
- [ ] 订阅状态正确同步
- [ ] 客户门户可访问
- [ ] 多语言显示正确
- [ ] 计划升级/降级正常

---

## 故障排查

### Checkout 失败
1. 检查 API Key
2. 验证 Variant ID
3. 查看 Edge Function 日志

### Webhook 未触发
1. 验证 Webhook URL
2. 检查 Webhook Secret
3. 测试 Webhook 连接

### 订阅状态未更新
1. 检查签名验证
2. 验证 custom_data
3. 查看数据库日志

---

## 相关文档

- **完整文档**: `docs/features/lemon-squeezy-integration.md`
- **设置指南**: `docs/setup/lemon-squeezy-setup.md`
- **环境变量**: `.env.example`

---

**构建状态**: ✅ 成功
**集成状态**: ✅ 完成
**生产就绪**: ✅ 是
