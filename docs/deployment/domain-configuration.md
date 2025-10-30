# 域名配置指南

## 问题描述

登录成功后，域名从 `https://soraprompt.studio` 跳转到 `https://sorapromptstudio-v1-i3ef.bolt.host/home`。

## 解决方案

已在代码层面实现自动域名重定向，但仍需要在托管平台和 Supabase 进行配置。

---

## 📋 已完成的代码修改

### 1. 创建域名重定向工具 (`src/lib/domainRedirect.ts`)

- ✅ 检测当前域名是否为 bolt.host
- ✅ 提供自定义域名重定向功能
- ✅ 为 OAuth 回调提供自定义域名 URL

### 2. 更新 OAuth 回调逻辑 (`src/pages/AuthCallback.tsx`)

- ✅ 登录成功后检测域名
- ✅ 如果在 bolt.host，自动重定向到 soraprompt.studio
- ✅ 保持路径和参数完整性

### 3. 更新 Auth Context (`src/contexts/AuthContext.tsx`)

- ✅ Google OAuth 使用自定义域名作为 redirectTo
- ✅ 所有登录流程使用 `https://soraprompt.studio/auth/callback`

### 4. 应用启动时检查 (`src/main.tsx`)

- ✅ 初始化域名重定向检查
- ✅ 自动将 bolt.host 访问重定向到自定义域名

---

## 🔧 需要手动配置的部分

### 1. Supabase OAuth 设置

访问 Supabase Dashboard → Authentication → URL Configuration

添加以下 Redirect URLs:

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

### 2. Google Cloud OAuth 设置

访问 Google Cloud Console → APIs & Services → Credentials

在 "Authorized redirect URIs" 中添加:

```
https://soraprompt.studio/auth/callback
https://sorapromptstudio-v1-i3ef.bolt.host/auth/callback
```

在 "Authorized JavaScript origins" 中添加:

```
https://soraprompt.studio
https://sorapromptstudio-v1-i3ef.bolt.host
```

### 3. Bolt.new / Vercel 托管配置

#### 设置主域名

1. 访问项目设置 → Domains
2. 将 `soraprompt.studio` 设为 **Primary Domain**
3. 确保 DNS 记录正确指向

#### 域名重定向规则（可选）

如果平台支持，添加重定向规则：

```
Source: https://sorapromptstudio-v1-i3ef.bolt.host/*
Destination: https://soraprompt.studio/:splat
Status: 301 (Permanent Redirect)
```

### 4. 环境变量检查

确保 `.env` 文件中的 Supabase URL 配置正确:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🧪 测试步骤

### 1. 测试从 bolt.host 访问

1. 访问 `https://sorapromptstudio-v1-i3ef.bolt.host`
2. 应该自动重定向到 `https://soraprompt.studio`

### 2. 测试 Google 登录

1. 从 `https://soraprompt.studio` 点击 "使用 Google 继续"
2. 完成 Google 授权
3. 应该回到 `https://soraprompt.studio/home`（不是 bolt.host）

### 3. 测试邮箱登录

1. 使用邮箱密码登录
2. 登录成功后应停留在 `https://soraprompt.studio/home`

### 4. 测试直接访问 bolt.host 回调

1. 假设用户直接访问 `https://sorapromptstudio-v1-i3ef.bolt.host/auth/callback?code=xxx`
2. 处理完成后应重定向到 `https://soraprompt.studio/home`

---

## 🔍 工作原理

### 域名检测与重定向流程

```
用户访问任意域名
    ↓
应用启动 (main.tsx)
    ↓
initDomainRedirect() 检查域名
    ↓
如果是 bolt.host 且不是 /auth/callback → 立即重定向
    ↓
如果是 /auth/callback → 等待处理完成
    ↓
AuthCallback 处理登录
    ↓
如果在 bolt.host → 重定向到 soraprompt.studio/home
    ↓
用户停留在自定义域名
```

### OAuth 流程

```
用户点击 Google 登录
    ↓
AuthContext.signInWithGoogle()
    ↓
redirectTo = https://soraprompt.studio/auth/callback
    ↓
Google OAuth (可能经过 bolt.host)
    ↓
回到 /auth/callback (任意域名)
    ↓
检测到 bolt.host → 重定向到 soraprompt.studio/home
    ↓
完成，停留在自定义域名
```

---

## ⚠️ 注意事项

### 1. DNS 传播时间

- 域名配置修改后可能需要 5-15 分钟生效
- 使用 `https://dnschecker.org` 检查 DNS 传播状态

### 2. 浏览器缓存

- 测试时使用无痕模式或清除缓存
- 某些浏览器可能缓存重定向规则

### 3. OAuth 回调限制

- 必须在 Supabase 和 Google Cloud 中都配置两个域名
- 删除旧的回调 URL 可能导致现有会话失效

### 4. HTTPS 要求

- 两个域名都必须启用 HTTPS
- 混合内容（HTTP + HTTPS）会导致登录失败

---

## 📊 验证清单

- [ ] Supabase Redirect URLs 已更新
- [ ] Google Cloud OAuth URIs 已更新
- [ ] soraprompt.studio 设为 Primary Domain
- [ ] 代码已部署到生产环境
- [ ] 从 bolt.host 访问会自动重定向
- [ ] Google 登录保持在自定义域名
- [ ] 邮箱登录保持在自定义域名
- [ ] 所有页面路由都使用相对路径

---

## 🆘 故障排查

### 问题 1: 仍然跳转到 bolt.host

**可能原因**:
- 代码未部署
- 浏览器缓存
- Supabase 配置未更新

**解决方法**:
1. 确认代码已部署: 检查 `src/lib/domainRedirect.ts` 是否存在
2. 清除浏览器缓存或使用无痕模式
3. 检查 Supabase Dashboard 中的 Redirect URLs

### 问题 2: OAuth 回调报错

**可能原因**:
- Google Cloud 未配置 bolt.host 回调 URL
- Supabase 配置不完整

**解决方法**:
1. 确保两个域名都在 Google OAuth 配置中
2. 检查 Supabase Site URL 是否正确
3. 查看浏览器控制台错误信息

### 问题 3: 无限重定向循环

**可能原因**:
- DNS 配置错误
- 代码逻辑问题

**解决方法**:
1. 检查 DNS CNAME/A 记录
2. 检查浏览器控制台日志
3. 暂时注释掉 `initDomainRedirect()` 定位问题

---

## 📝 部署检查命令

```bash
# 构建并检查
npm run build

# 检查域名重定向文件是否存在
ls -la src/lib/domainRedirect.ts

# 检查构建输出
cat dist/index.html | grep -i domain
```

---

**更新时间**: 2025-10-30
**版本**: 1.0
**状态**: ✅ 代码已更新，等待配置完成
