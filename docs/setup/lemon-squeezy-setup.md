# Lemon Squeezy 快速设置指南

## 🚀 5 分钟快速部署

### 步骤 1: 获取 Lemon Squeezy 凭证

1. 访问 [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com/)
2. 创建账户并登录
3. 创建一个新商店或选择现有商店
4. 获取以下信息：
   - **Store ID**: Settings → Store Settings
   - **API Key**: Settings → API → Create API Key
   - **Variant IDs**: Products → 创建产品和变体

### 步骤 2: 创建产品和变体

#### Creator Plan ($19/月)
1. Products → New Product
2. 名称: "Creator Plan"
3. 价格: $19.00
4. 计费周期: Monthly
5. 保存并记录 **Variant ID**

#### Director Plan ($49/月)
1. Products → New Product
2. 名称: "Director Plan"
3. 价格: $49.00
4. 计费周期: Monthly
5. 保存并记录 **Variant ID**

### 步骤 3: 配置环境变量

#### 前端 (.env)

```bash
VITE_PAYMENT_PROVIDER=lemon
VITE_LEMON_VARIANT_CREATOR=你的_creator_variant_id
VITE_LEMON_VARIANT_DIRECTOR=你的_director_variant_id
```

#### Supabase Edge Functions Secrets

在 Supabase Dashboard → Settings → Edge Functions → Secrets 添加：

```bash
LEMON_API_KEY=你的_api_key
LEMON_STORE_ID=你的_store_id
LEMON_VARIANT_CREATOR=你的_creator_variant_id
LEMON_VARIANT_DIRECTOR=你的_director_variant_id
LEMON_WEBHOOK_SECRET=你的_webhook_secret
APP_URL=https://你的域名.com
```

### 步骤 4: 部署 Edge Functions

```bash
# 确保已安装 Supabase CLI
npm install -g supabase

# 登录 Supabase
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 部署函数
supabase functions deploy lemon-checkout
supabase functions deploy lemon-portal
supabase functions deploy lemon-webhook
```

### 步骤 5: 配置 Webhook

1. Lemon Squeezy Dashboard → Settings → Webhooks
2. 点击 "Create Webhook"
3. 配置：
   - **URL**: `https://你的supabase项目.supabase.co/functions/v1/lemon-webhook`
   - **Events**: 选择以下事件
     - ✅ order_created
     - ✅ order_refunded
     - ✅ subscription_created
     - ✅ subscription_updated
     - ✅ subscription_cancelled
     - ✅ subscription_expired
4. 保存并复制 **Signing Secret**
5. 将 Signing Secret 添加到 Supabase Secrets 作为 `LEMON_WEBHOOK_SECRET`

### 步骤 6: 运行数据库迁移

```bash
# 应用迁移
supabase db push
```

### 步骤 7: 构建并部署前端

```bash
# 构建项目
npm run build

# 部署到你的托管平台（Netlify/Vercel/等）
```

---

## ✅ 验证集成

### 测试 Checkout 流程

1. 访问应用的订阅页面
2. 点击 "Upgrade to Creator" 或 "Upgrade to Director"
3. 应该重定向到 Lemon Squeezy 结账页面
4. 使用测试卡号完成支付
5. 返回应用，订阅应该已激活

### 测试卡号（Lemon Squeezy 测试模式）

- **卡号**: 4242 4242 4242 4242
- **过期日期**: 任意未来日期
- **CVC**: 任意 3 位数字

### 验证 Webhook

1. 在 Lemon Squeezy Dashboard 测试 Webhook
2. 检查 Supabase Logs → Edge Functions
3. 确认事件被正确处理
4. 检查数据库订阅记录是否更新

---

## 🔄 切换回 Stripe

如果需要切换回 Stripe：

```bash
# 更新 .env
VITE_PAYMENT_PROVIDER=stripe

# 重新构建
npm run build

# 部署
```

---

## 📞 获取帮助

- [Lemon Squeezy 文档](https://docs.lemonsqueezy.com/)
- [Lemon Squeezy 支持](https://www.lemonsqueezy.com/help)
- [项目完整文档](../features/lemon-squeezy-integration.md)

---

**设置完成！** 🎉 现在可以开始接受付款了！
