# Google OAuth 品牌显示修复指南

## 问题描述

在 Google 授权登录时，显示 "您正在重新登录 dasflvaxjpcjykgtlkrt.supabase.co"，而不是 "登录 SoraPrompt"。

## 根本原因

Google OAuth 同意屏幕显示的信息来自 **Google Cloud Console 的 OAuth 同意屏幕配置**，而非应用前端。当应用名称未正确配置时，Google 会显示 redirect_uri 的域名。

---

## 🔧 修复步骤

### 步骤 1: 配置 Google OAuth 同意屏幕

1. **访问 Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **选择您的项目**
   - 在顶部项目选择器中，选择配置了 OAuth 的项目

3. **进入 OAuth 同意屏幕配置**
   ```
   左侧菜单 → APIs & Services → OAuth consent screen
   ```

4. **编辑应用信息**（点击 "EDIT APP" 按钮）

   **基础配置：**
   ```
   应用名称: SoraPrompt
   用户支持电子邮件: your-email@example.com
   应用徽标: [上传 192x192 PNG logo]
   ```

   **应用域名：**
   ```
   应用首页链接: https://your-production-domain.com
   应用隐私政策链接: https://your-production-domain.com/privacy
   应用服务条款链接: https://your-production-domain.com/terms
   ```

   **授权域名：**（在 "Authorized domains" 部分添加）
   ```
   - your-production-domain.com（如果有自定义域名）
   - dasflvaxjpcjykgtlkrt.supabase.co（开发环境）
   ```

   **作用域（Scopes）：**
   ```
   - .../auth/userinfo.email
   - .../auth/userinfo.profile
   - openid
   ```

5. **保存更改**
   - 点击底部 "SAVE AND CONTINUE"
   - 完成所有步骤的配置

---

### 步骤 2: 验证 OAuth Client 配置

1. **进入凭据配置**
   ```
   APIs & Services → Credentials
   ```

2. **找到您的 OAuth 2.0 Client ID**
   - 点击编辑（铅笔图标）

3. **检查 Authorized redirect URIs**

   确保包含：
   ```
   https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
   ```

   如果有生产域名，也添加：
   ```
   https://your-production-domain.com/auth/v1/callback
   ```

4. **保存更改**

---

### 步骤 3: 发布应用（可选，推荐）

**开发阶段（测试模式）：**
- OAuth 同意屏幕 → Publishing status: "Testing"
- 添加测试用户邮箱到 "Test users" 列表
- 只有测试用户可以登录
- **会显示警告："此应用未经验证"**

**生产环境（正式模式）：**
- OAuth 同意屏幕 → 点击 "PUBLISH APP"
- 如果需要敏感权限，需提交 Google 审核（通常需要 3-5 天）
- 所有用户可以登录
- 显示正式的品牌信息

---

### 步骤 4: 清除缓存并测试

1. **清除浏览器缓存**
   ```
   Chrome: Ctrl+Shift+Delete → 清除所有时间范围的缓存
   ```

2. **测试登录流程**
   - 访问您的应用
   - 点击 "使用 Google 登录"
   - 检查授权页面显示

**预期结果：**
```
修复前: 您正在重新登录 dasflvaxjpcjykgtlkrt.supabase.co
修复后: 您正在登录 SoraPrompt
```

---

## 🎨 OAuth 同意屏幕最佳实践

### 应用名称
- ✅ 使用品牌名称：SoraPrompt
- ❌ 避免技术性名称：My OAuth App, Test App

### 应用徽标
- 尺寸：192x192 像素
- 格式：PNG 或 JPG
- 背景：透明或白色
- 内容：品牌 Logo

### 应用域名
- 使用真实的生产域名
- 确保隐私政策和服务条款页面可访问
- 链接应为 HTTPS

### 权限范围（Scopes）
- 只请求必要的权限
- 基本登录只需要：email, profile, openid
- 避免请求敏感权限（如 Drive、Gmail）

---

## 🔄 配置生效时间

- **OAuth 同意屏幕配置**：立即生效
- **授权域名更新**：1-5 分钟
- **应用发布状态变更**：立即生效
- **缓存清除后测试**：即时看到效果

---

## ⚠️ 常见问题

### Q1: 修改后仍显示 Supabase 域名？
**解决方案：**
1. 确认 OAuth 同意屏幕的 "应用名称" 已填写
2. 清除浏览器所有 Google 账户的授权缓存
3. 访问 https://myaccount.google.com/permissions 撤销应用授权
4. 重新登录测试

### Q2: 显示 "此应用未经验证" 警告？
**这是正常的！原因：**
- 应用处于 "Testing" 模式
- 或者应用请求了敏感权限但未通过 Google 审核

**解决方案：**
- 对于内部使用：保持测试模式，添加测试用户
- 对于公开应用：提交 Google 审核（仅当请求敏感权限时需要）
- 基本登录权限（email, profile）不需要审核即可发布

### Q3: 如何添加自定义域名？
**Supabase 自定义域名配置：**
1. 在 Supabase Dashboard → Project Settings → Custom Domains
2. 添加您的域名（如 app.soraprompt.com）
3. 配置 DNS CNAME 记录指向 Supabase
4. 等待 SSL 证书自动签发
5. 更新 Google OAuth 的 Authorized redirect URIs

### Q4: 测试用户数量限制？
- 测试模式：最多 100 个测试用户
- 超出限制需发布应用到生产环境

---

## 📋 配置检查清单

在测试前，请确认：

- [ ] Google Cloud Console → OAuth 同意屏幕 → 应用名称 = "SoraPrompt"
- [ ] 应用徽标已上传（192x192 PNG）
- [ ] 授权域名已添加（包含 Supabase 域名）
- [ ] OAuth Client → Authorized redirect URIs 包含正确的回调 URL
- [ ] 发布状态：Testing（开发）或 Published（生产）
- [ ] 测试用户已添加（如果是测试模式）
- [ ] 浏览器缓存已清除
- [ ] 在无痕模式下测试登录流程

---

## 🎯 预期结果对比

### 修复前（当前状态）
```
标题: 您正在重新登录 dasflvaxjpcjykgtlkrt.supabase.co
内容: 查看 dasflvaxjpcjykgtlkrt.supabase.co 的《隐私权政策》和《服务条款》
体验: ❌ 显示技术域名，用户信任度低
```

### 修复后（目标状态）
```
标题: 您正在登录 SoraPrompt
内容: 查看 SoraPrompt 的《隐私权政策》和《服务条款》
图标: [SoraPrompt Logo]
体验: ✅ 显示品牌名称，专业可信
```

---

## 🚀 部署到生产环境时的额外步骤

当您准备上线时：

1. **绑定自定义域名**
   - 在 Supabase 或 Vercel/Netlify 配置自定义域名
   - 更新 Google OAuth 的 redirect URIs

2. **更新环境变量**
   ```bash
   # .env.production
   VITE_SUPABASE_URL=https://your-custom-domain.com
   VITE_APP_URL=https://soraprompt.com
   ```

3. **更新 Supabase Auth 配置**
   - Dashboard → Authentication → URL Configuration
   - Site URL: https://soraprompt.com
   - Redirect URLs: https://soraprompt.com/auth/callback

4. **发布 OAuth 应用**
   - 如果只使用基本权限（email, profile），可以直接发布
   - 如果需要其他 Google API 权限，提交审核

---

## 📞 需要帮助？

如果按照以上步骤操作后仍有问题：

1. 检查 Google Cloud Console 的错误日志
2. 确认 OAuth Client ID 和 Secret 配置正确
3. 验证 Supabase 中的 Google Provider 配置
4. 在无痕窗口测试，排除缓存影响

---

## 参考资源

- [Google OAuth 同意屏幕文档](https://support.google.com/cloud/answer/10311615)
- [Supabase Google Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [OAuth 最佳实践](https://developers.google.com/identity/protocols/oauth2/web-server)
