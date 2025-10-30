# 🚀 域名配置快速指南

## ✅ 代码已完成

自动域名重定向功能已在代码中实现，无需额外开发。

---

## 📋 需要您手动完成的配置（3 步）

### 1️⃣ Supabase 配置（5 分钟）

访问: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/url-configuration

**Redirect URLs** 添加:
```
https://soraprompt.studio/auth/callback
https://soraprompt.studio/*
https://sorapromptstudio-v1-i3ef.bolt.host/auth/callback
https://sorapromptstudio-v1-i3ef.bolt.host/*
```

**Site URL** 设置为:
```
https://soraprompt.studio
```

---

### 2️⃣ Google Cloud Console 配置（5 分钟）

访问: https://console.cloud.google.com/apis/credentials

找到您的 OAuth 2.0 客户端 ID，编辑:

**Authorized redirect URIs**:
```
https://soraprompt.studio/auth/callback
https://sorapromptstudio-v1-i3ef.bolt.host/auth/callback
```

**Authorized JavaScript origins**:
```
https://soraprompt.studio
https://sorapromptstudio-v1-i3ef.bolt.host
```

---

### 3️⃣ Bolt.new 托管配置（2 分钟）

如果您使用 Bolt.new:

1. 进入项目设置
2. 找到 Domains 部分
3. 将 `soraprompt.studio` 设为 **Primary Domain**

如果使用 Vercel:

1. 访问: https://vercel.com/dashboard
2. 项目 → Settings → Domains
3. 点击 `soraprompt.studio` → Set as Primary

---

## 🧪 测试

配置完成后，测试以下场景:

### ✅ 测试 1: 自动重定向
访问: `https://sorapromptstudio-v1-i3ef.bolt.host`
预期: 自动跳转到 `https://soraprompt.studio`

### ✅ 测试 2: Google 登录
1. 访问 `https://soraprompt.studio`
2. 点击 "使用 Google 继续"
3. 完成授权
4. 预期: 回到 `https://soraprompt.studio/home`（不是 bolt.host）

### ✅ 测试 3: 邮箱登录
1. 使用邮箱密码登录
2. 预期: 停留在 `https://soraprompt.studio/home`

---

## 🎯 工作原理

代码已实现:
- ✅ 检测当前域名
- ✅ bolt.host 自动重定向到 soraprompt.studio
- ✅ OAuth 回调使用自定义域名
- ✅ 登录后保持在自定义域名

---

## ⚠️ 重要提示

1. **两个域名都需要配置** - 过渡期间两个域名都要支持
2. **等待 DNS 生效** - 配置后等待 5-15 分钟
3. **清除缓存测试** - 使用无痕模式测试

---

## 📞 遇到问题?

查看详细文档: [domain-configuration.md](./domain-configuration.md)

---

**预计配置时间**: 10-15 分钟
**生效时间**: 立即（DNS 已配置的情况下）
