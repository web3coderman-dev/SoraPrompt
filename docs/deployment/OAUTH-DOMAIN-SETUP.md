# 🚀 OAuth 域名配置指南（Bolt + Supabase）

## ✅ 当前状态

从您的 Bolt 截图可以看到：
- ✅ Google OAuth 已在 Bolt 中配置
- ✅ 使用 Supabase 数据库 (`dasflvaxjpcjykgtlkrt.supabase.co`)
- ✅ 代码已实现域名重定向
- ⚠️ 需要在 Supabase 中添加自定义域名配置

---

## 🎯 关键理解

### Bolt 显示的回调 URL 是正确的！

Bolt 显示：
```
Authorised redirect URI:
https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
```

这是 **Supabase 的回调地址**，这是正确的！因为 OAuth 流程是：

```
您的网站 → Google 授权 → Supabase Auth → 回到您的网站
              ⬆️                    ⬆️
          这个回调是              这个回调在
          Google → Supabase      Supabase 配置
```

---

## 📋 您只需要做 2 步

### 1️⃣ Supabase 配置（核心！⭐）

#### 访问 Supabase Dashboard

```
https://supabase.com/dashboard/project/dasflvaxjpcjykgtlkrt/auth/url-configuration
```

或者：
1. 访问 https://supabase.com/dashboard
2. 选择您的项目
3. 左侧菜单：Authentication → URL Configuration

---

#### A. 添加 Redirect URLs

在 **"Redirect URLs"** 部分，点击 **"Add URL"** 按钮，逐个添加：

```
https://soraprompt.studio/auth/callback
```

```
https://soraprompt.studio/*
```

如果 bolt.host 域名仍在使用（过渡期），也添加：

```
https://sorapromptstudio-v1-i3ef.bolt.host/auth/callback
```

```
https://sorapromptstudio-v1-i3ef.bolt.host/*
```

**示例图**：
```
┌─────────────────────────────────────────────────────────┐
│ Redirect URLs                                     [Add] │
├─────────────────────────────────────────────────────────┤
│ ✓ https://soraprompt.studio/auth/callback        [删除] │
│ ✓ https://soraprompt.studio/*                    [删除] │
│ ✓ https://sorapromptstudio-v1-i3ef.bolt.host/... [删除] │
└─────────────────────────────────────────────────────────┘
```

---

#### B. 设置 Site URL

找到 **"Site URL"** 字段，输入：

```
https://soraprompt.studio
```

**示例**：
```
┌─────────────────────────────────────┐
│ Site URL                            │
├─────────────────────────────────────┤
│ https://soraprompt.studio           │
└─────────────────────────────────────┘
```

---

#### C. 保存设置

滚动到页面底部，点击 **"Save"** 按钮。

✅ 配置立即生效！

---

### 2️⃣ Google Cloud Console 配置

#### 访问 Google Cloud Console

```
https://console.cloud.google.com/apis/credentials
```

---

#### 找到您的 OAuth 2.0 Client ID

使用 Bolt 截图中的 Client ID：
```
238754658061-a4ci3rj0do263qrparh61pq8e13o8j5m.apps.googleusercontent.com
```

点击右侧的 **编辑（✏️）** 图标。

---

#### 配置 Authorized JavaScript origins

在 **"Authorized JavaScript origins"** 部分，添加：

```
https://soraprompt.studio
```

```
https://www.soraprompt.studio
```

**Bolt 已经自动为您生成了这些，您只需要复制到 Google Cloud！**

---

#### 配置 Authorized redirect URIs

在 **"Authorized redirect URIs"** 部分，确保包含：

```
https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
```

**⚠️ 注意**：这个 URI 应该**已经存在**，因为您之前配置过。如果没有，请添加。

**不要添加** `https://soraprompt.studio/auth/callback` 到这里！
这个地址应该配置在 Supabase 中（第 1 步）。

---

#### 保存

点击页面底部的 **"保存"** 按钮。

✅ 通常 5 分钟内生效。

---

## 🎯 完整 OAuth 流程解析

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: 用户点击"使用 Google 继续"                      │
│  Location: https://soraprompt.studio                    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: 跳转到 Google OAuth 授权页面                   │
│  Google 检查: soraprompt.studio 在允许列表中吗？        │
│  ✅ 是的！在 Authorized JavaScript origins 中          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: 用户授权后，Google 回调 Supabase              │
│  Location: https://dasflvaxjpcjykgtlkrt.supabase.co/  │
│            auth/v1/callback?code=xxx                    │
│  Google 检查: 这个 URI 在允许列表中吗？                 │
│  ✅ 是的！在 Authorized redirect URIs 中               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 4: Supabase 处理 token，然后重定向回您的网站     │
│  Supabase 检查: 重定向到哪里？                         │
│  查看 Redirect URLs 配置...                            │
│  ✅ 找到: https://soraprompt.studio/auth/callback      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 5: 到达您的网站 /auth/callback                   │
│  Location: https://soraprompt.studio/auth/callback     │
│           （或 bolt.host，取决于 Supabase 配置）        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  Step 6: 我们的代码检测域名                            │
│  if (isBoltDomain()) {                                  │
│    window.location.replace(                             │
│      'https://soraprompt.studio/home'                   │
│    )                                                     │
│  }                                                       │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ✅ 最终页面: https://soraprompt.studio/home           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 测试步骤

### 测试 1: 自动域名重定向

```bash
# 在浏览器中访问
https://sorapromptstudio-v1-i3ef.bolt.host

# 预期结果
立即跳转到: https://soraprompt.studio
```

---

### 测试 2: Google OAuth 登录

```bash
# 步骤
1. 访问 https://soraprompt.studio
2. 点击 "使用 Google 继续"
3. 选择或登录 Google 账户
4. 授权应用

# 预期结果
回到: https://soraprompt.studio/home
（不应该看到 bolt.host）
```

---

### 测试 3: 邮箱密码登录

```bash
# 步骤
1. 访问 https://soraprompt.studio
2. 输入邮箱和密码
3. 点击 "登录"

# 预期结果
跳转到: https://soraprompt.studio/home
（域名不变）
```

---

## ❓ 常见问题

### Q1: 为什么 Bolt 不显示我的自定义域名回调 URL？

**A**: Bolt 显示的是 **Google → Supabase** 的回调 URL。您的自定义域名（`soraprompt.studio`）的回调 URL 需要在 **Supabase Dashboard** 中配置。

这是两个不同的回调：
- `Google → Supabase`: 在 Google Cloud 配置
- `Supabase → 您的网站`: 在 Supabase 配置

---

### Q2: 我需要在 Bolt 的 Authentication 设置中做什么？

**A**: 什么都不需要！Bolt 已经自动生成了正确的配置。您只需要：
1. 在 **Supabase** 中添加自定义域名
2. 在 **Google Cloud** 中添加 Bolt 生成的 origins

---

### Q3: 为什么不把 soraprompt.studio/auth/callback 添加到 Google OAuth？

**A**: 因为 Google 不会直接回调到您的网站。流程是：

```
Google → Supabase → 您的网站
```

所以 Google 只需要知道 Supabase 的地址。

---

### Q4: 配置后多久生效？

**A**:
- ✅ Supabase 配置：立即生效
- ⏱️ Google Cloud 配置：5 分钟内
- ⏱️ DNS 变更：5-15 分钟

---

### Q5: 我看到错误 "redirect_uri_mismatch"

**A**: 检查以下内容：
1. ✅ Supabase Redirect URLs 是否包含您的域名
2. ✅ Google Cloud Authorized redirect URIs 是否包含 Supabase 的回调地址
3. ✅ 等待 5-10 分钟让配置生效
4. ✅ 清除浏览器缓存并使用无痕模式测试

---

## 🔍 故障排查

### 问题：仍然跳转到 bolt.host

**可能原因**：
- Supabase Redirect URLs 未配置
- Supabase Site URL 未设置
- 浏览器缓存

**解决方法**：
```bash
1. 检查 Supabase Dashboard 配置是否保存成功
2. 打开浏览器控制台 (F12)，查看 Network 标签
3. 观察重定向流程，找到哪一步出错
4. 清除浏览器缓存，使用无痕模式测试
```

---

### 问题：Google OAuth 报错

**错误信息示例**：
```
Error 400: redirect_uri_mismatch
```

**解决方法**：
```bash
1. 检查 Google Cloud Console 配置
2. 确认 Supabase 回调 URL 在 Authorized redirect URIs 中
3. 等待 10 分钟后重试
4. 检查是否使用了正确的 Google Client ID
```

---

### 问题：登录后显示空白页

**可能原因**：
- JavaScript 错误
- 会话未正确建立

**解决方法**：
```bash
1. 打开浏览器控制台 (F12)
2. 查看 Console 标签的错误信息
3. 检查 Network 标签，确认 API 请求成功
4. 确认 Supabase 环境变量正确
```

---

## 📊 配置检查清单

### Supabase 配置
- [ ] 添加 `https://soraprompt.studio/auth/callback`
- [ ] 添加 `https://soraprompt.studio/*`
- [ ] （可选）添加 bolt.host 的回调 URL
- [ ] 设置 Site URL 为 `https://soraprompt.studio`
- [ ] 点击 Save 按钮
- [ ] 等待 2 分钟让配置生效

### Google Cloud 配置
- [ ] 添加 `https://soraprompt.studio` 到 JavaScript origins
- [ ] 添加 `https://www.soraprompt.studio` 到 JavaScript origins
- [ ] 确认 Supabase 回调 URL 在 redirect URIs 中
- [ ] 点击 Save 按钮
- [ ] 等待 5 分钟让配置生效

### 测试验证
- [ ] 访问 bolt.host 会自动跳转到 soraprompt.studio
- [ ] Google 登录成功回到 soraprompt.studio/home
- [ ] 邮箱登录停留在 soraprompt.studio/home
- [ ] 刷新页面会话保持

---

## ⏱️ 预计完成时间

- 🔧 Supabase 配置: 3 分钟
- 🔧 Google Cloud 配置: 5 分钟
- 🧪 测试验证: 5 分钟
- **📊 总计**: 约 15 分钟

---

## 🎉 完成后的效果

✅ 用户始终停留在 `https://soraprompt.studio`
✅ Google OAuth 登录流畅，无域名跳转
✅ 邮箱密码登录保持在自定义域名
✅ 所有页面导航使用自定义域名
✅ 用户体验专业、统一

---

## 📞 需要更多帮助？

1. 查看浏览器控制台 (F12) 的错误信息
2. 检查 Supabase Dashboard → Logs → Auth Logs
3. 确认域名 DNS 已正确配置
4. 使用无痕模式测试，避免缓存干扰

---

## 📚 相关文档

- [完整配置指南](./domain-configuration.md)
- [简化配置指南](./DOMAIN-SETUP-QUICK.md)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)

---

**更新时间**: 2025-10-30
**适用场景**: Bolt.new + Supabase + 自定义域名
**状态**: ✅ 代码已准备就绪，等待您的配置
**预期结果**: 完美的域名体验！
