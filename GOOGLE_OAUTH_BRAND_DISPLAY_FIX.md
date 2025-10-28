# Google OAuth 品牌显示问题修复指南

## 📊 问题现状分析

### 当前显示内容（截图分析）

**问题 1: 账号选择页面**
```
显示内容: "继续前往 dasflvaxjpcjykgtlkrt.supabase.co"
期望内容: "继续前往 SoraPrompt Studio"
```

**问题 2: 授权确认页面**
```
显示内容: "您正在重新登录 dasflvaxjpcjykgtlkrt.supabase.co"
期望内容: "您正在登录 SoraPrompt Studio"
```

---

## 🔍 根本原因分析

### 问题根源

Google OAuth 授权页面的显示内容由以下配置决定：

```
┌─────────────────────────────────────────────────────────────────┐
│ Google OAuth 授权页面显示逻辑                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 应用名称显示来源：                                           │
│     ├─ Google Cloud Console                                    │
│     ├─ APIs & Services                                         │
│     ├─ OAuth consent screen                                    │
│     └─ App name: [当前未配置 ❌]                               │
│                                                                 │
│  2. 域名显示来源：                                               │
│     ├─ OAuth Client 配置                                       │
│     ├─ Authorized redirect URIs                                │
│     └─ https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/...  │
│                                                                 │
│  3. 显示优先级：                                                 │
│     ├─ 优先: App name（如果已配置）                            │
│     └─ 备选: Redirect URI 的域名（当前显示）                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 为什么显示 Supabase 域名？

```
问题链路追踪：
───────────────────────────────────────────────────────────────

1. 用户点击 "Continue with Google" 按钮
   ↓
2. Supabase Auth 发起 OAuth 请求
   ↓
3. OAuth 请求参数:
   - client_id: [你的 Google Client ID]
   - redirect_uri: https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
   ↓
4. Google 读取 OAuth 配置:
   - 检查 OAuth Consent Screen
   - App name: [空] ❌
   - 未找到应用名称！
   ↓
5. Google 使用备选方案:
   - 显示 redirect_uri 的域名
   - 结果: "继续前往 dasflvaxjpcjykgtlkrt.supabase.co"
```

---

## 🛠 完整修复方案

### 核心解决方案

**关键点**: 问题不在于 Supabase 域名本身，而在于 Google OAuth 配置中缺少应用名称！

即使使用 Supabase 默认域名作为 redirect_uri，只要正确配置了 OAuth Consent Screen，就会显示品牌名称。

---

## 🎯 修复步骤（详细版）

### 步骤 1: 配置 Google OAuth 同意屏幕（核心修复）

#### 1.1 访问 Google Cloud Console

```
URL: https://console.cloud.google.com/
```

1. 登录您的 Google 账号
2. 选择已创建的项目（或创建新项目）

#### 1.2 进入 OAuth 同意屏幕配置

```
导航路径:
左侧菜单 → APIs & Services → OAuth consent screen
```

#### 1.3 编辑应用信息

点击页面顶部的 **"EDIT APP"** 按钮

**填写以下信息：**

```yaml
# === 应用信息 ===
App name: SoraPrompt Studio
App logo: [上传 120x120 PNG logo，可选]
User support email: [您的支持邮箱，必填]

# === 应用域名 ===
Application home page: https://soraprompt.studio
Application privacy policy link: https://soraprompt.studio/privacy
Application terms of service link: https://soraprompt.studio/terms

# === 授权域名 ===
Authorized domains:
  - soraprompt.studio
  - dasflvaxjpcjykgtlkrt.supabase.co

# === 开发者联系信息 ===
Developer contact information: [您的邮箱]
```

**重要说明：**

1. **App name（必填）**: 这是显示给用户的品牌名称
   - 填写: `SoraPrompt Studio` 或 `Sora Prompt Studio`
   - 这将直接显示在授权页面

2. **Application home page（建议填写）**:
   - 填写您的品牌域名: `https://soraprompt.studio`
   - 如果暂时没有自定义域名，可以留空或填写 GitHub 页面

3. **Authorized domains**:
   - 必须添加 `dasflvaxjpcjykgtlkrt.supabase.co`
   - 如果有自定义域名，也添加进去

#### 1.4 配置权限范围（Scopes）

点击 **"SAVE AND CONTINUE"** 进入下一步

```yaml
Scopes (必需的权限):
  - .../auth/userinfo.email
  - .../auth/userinfo.profile
  - openid
```

通常 Supabase 会自动请求这些基础权限，无需额外配置。

#### 1.5 添加测试用户（可选）

如果应用处于 "Testing" 状态：

```
Test users:
  - your-email@gmail.com
  - test-user@example.com
```

#### 1.6 保存并发布

1. 点击 **"SAVE AND CONTINUE"** 完成配置
2. 返回 OAuth consent screen 主页
3. 检查 Publishing status:
   - **Testing**: 只有测试用户可以登录
   - **In production**: 所有用户可以登录

**发布应用（推荐）:**

如果只使用基础权限（email, profile），可以直接点击 **"PUBLISH APP"** 按钮发布应用，无需 Google 审核。

---

### 步骤 2: 验证 OAuth Client 配置

#### 2.1 检查 OAuth Client ID

```
导航路径:
APIs & Services → Credentials → OAuth 2.0 Client IDs
```

#### 2.2 编辑 OAuth Client

找到您的 Web Client，点击编辑（铅笔图标）

**检查配置：**

```yaml
Name: SoraPrompt Studio Web Client

Authorized JavaScript origins:
  - http://localhost:5173
  - http://localhost:5174
  - https://soraprompt.studio (如果已部署)

Authorized redirect URIs:
  - https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
  - https://soraprompt.studio/auth/v1/callback (如果使用自定义域名)
```

**关键点**:
- Redirect URI 必须精确匹配 Supabase 的回调地址
- 使用 Supabase 默认域名是完全正常的！
- 只要配置了 App name，就会显示品牌名称

#### 2.3 保存更改

点击 **"SAVE"** 保存配置

---

### 步骤 3: 配置 Supabase（可选优化）

虽然不是必需的，但可以优化配置：

#### 3.1 检查 Supabase Auth 配置

```
Supabase Dashboard → Authentication → Providers → Google
```

确认：
- ✅ Google Provider 已启用
- ✅ Client ID 和 Client Secret 已正确填写

#### 3.2 配置 URL Configuration

```
Supabase Dashboard → Authentication → URL Configuration
```

```yaml
Site URL:
  - 开发环境: http://localhost:5173
  - 生产环境: https://soraprompt.studio

Additional Redirect URLs:
  - http://localhost:5173/auth/callback
  - https://soraprompt.studio/auth/callback
```

---

### 步骤 4: 清除缓存并测试

#### 4.1 撤销旧的授权

1. 访问 Google 账号管理: https://myaccount.google.com/permissions
2. 找到您的应用（可能显示为项目名称）
3. 点击 "移除访问权限"

#### 4.2 清除浏览器缓存

```
Chrome:
  Ctrl+Shift+Delete → 清除"所有时间"的缓存和 Cookie
```

#### 4.3 测试登录流程

1. 打开无痕窗口（推荐）
2. 访问您的应用
3. 点击 "Continue with Google"
4. 观察授权页面显示

---

## ✅ 预期修复结果

### 修复前（当前状态）

```
账号选择页面:
  标题: 使用 Google 账号登录
  内容: 继续前往 dasflvaxjpcjykgtlkrt.supabase.co
  体验: ❌ 显示技术域名，不专业

授权确认页面:
  标题: 您正在重新登录 dasflvaxjpcjykgtlkrt.supabase.co
  内容: 查看 dasflvaxjpcjykgtlkrt.supabase.co 的《隐私权政策》
  体验: ❌ 用户信任度低
```

### 修复后（目标状态）

```
账号选择页面:
  标题: 使用 Google 账号登录
  内容: 继续前往 SoraPrompt Studio
  Logo: [您的应用 Logo]
  体验: ✅ 显示品牌名称，专业可信

授权确认页面:
  标题: 您正在登录 SoraPrompt Studio
  内容: 查看 SoraPrompt Studio 的《隐私权政策》
  Logo: [您的应用 Logo]
  链接: https://soraprompt.studio
  体验: ✅ 品牌统一，用户信任
```

---

## 🎨 品牌一致性配置建议

### 应用 Logo 规范

```yaml
尺寸: 120x120 像素（用于 OAuth 同意屏幕）
格式: PNG 或 JPG
背景: 透明或白色
内容: 品牌标识
文件大小: < 1MB
```

### 应用名称规范

```yaml
推荐格式:
  - SoraPrompt Studio ✅ (清晰专业)
  - Sora Prompt Studio ✅
  - SoraPrompt ✅ (简洁)

避免使用:
  - sora-prompt-studio ❌ (不符合品牌规范)
  - My App ❌ (太通用)
  - Test Application ❌ (不专业)
```

### 域名配置建议

```yaml
应用主页:
  - https://soraprompt.studio ✅
  - https://www.soraprompt.studio ✅
  - https://app.soraprompt.studio ✅

避免使用:
  - http://... ❌ (必须使用 HTTPS)
  - localhost ❌ (仅用于开发)
  - IP 地址 ❌ (不专业)
```

---

## 🚀 进阶配置：自定义域名（可选）

如果您希望连 redirect_uri 都显示自定义域名：

### 选项 A: Supabase 自定义域名

Supabase 支持为 Auth 服务配置自定义域名（需要付费计划）

```yaml
步骤:
  1. Supabase Dashboard → Project Settings → Custom Domains
  2. 添加域名: auth.soraprompt.studio
  3. 配置 DNS CNAME 记录
  4. 等待 SSL 证书签发
  5. 更新 Google OAuth redirect URI:
     - https://auth.soraprompt.studio/auth/v1/callback
```

### 选项 B: 自建 Auth 代理（高级）

通过反向代理将 Supabase Auth 映射到自定义域名：

```nginx
# nginx 配置示例
server {
  listen 443 ssl;
  server_name auth.soraprompt.studio;

  location /auth/ {
    proxy_pass https://dasflvaxjpcjykgtlkrt.supabase.co/auth/;
    proxy_set_header Host dasflvaxjpcjykgtlkrt.supabase.co;
  }
}
```

**注意**: 这种方式较复杂，需要额外的服务器配置和维护。

---

## 🔄 配置生效时间

```yaml
OAuth 同意屏幕配置:
  生效时间: 立即生效
  缓存清除: 需要撤销旧授权或清除浏览器缓存

OAuth Client 配置:
  生效时间: 1-5 分钟
  DNS 传播: 不需要（配置在 Google 端）

应用发布状态:
  Testing → Production: 立即生效
  无需审核: 仅请求基础权限时

Supabase 配置:
  生效时间: 几秒到几分钟
  重新部署: 不需要（服务端配置）
```

---

## ⚠️ 常见问题与解决

### Q1: 配置后仍显示 Supabase 域名

**可能原因:**
1. OAuth 同意屏幕的 App name 未填写或未保存
2. 浏览器缓存了旧的授权信息
3. Google 账号中存在旧的授权记录

**解决方案:**
```bash
# 1. 确认配置已保存
Google Cloud Console → OAuth consent screen → 查看 App name

# 2. 撤销旧授权
访问: https://myaccount.google.com/permissions
移除应用授权

# 3. 清除浏览器缓存
Chrome: Ctrl+Shift+Delete → 清除所有数据

# 4. 使用无痕窗口测试
Ctrl+Shift+N (Chrome) 或 Ctrl+Shift+P (Firefox)
```

### Q2: 显示 "此应用未经验证" 警告

**这是正常现象！**

```yaml
原因:
  - 应用处于 "Testing" 模式
  - 或请求了敏感权限但未通过审核

解决方案:
  选项 1 (推荐):
    - 如果只使用基础权限 (email, profile)
    - 直接点击 "PUBLISH APP" 发布应用
    - 无需 Google 审核

  选项 2 (仅内部使用):
    - 保持 Testing 模式
    - 添加所有用户为测试用户
    - 用户需要点击 "继续" 按钮

  选项 3 (请求敏感权限):
    - 提交 Google 验证审核
    - 审核时间: 3-5 天
    - 需要提供应用详细信息
```

### Q3: redirect_uri_mismatch 错误

**错误信息:**
```
Error: redirect_uri_mismatch
The redirect URI in the request does not match...
```

**解决方案:**
```yaml
1. 检查 Google OAuth Client 配置:
   - Authorized redirect URIs 必须完全匹配
   - 包括协议 (https://)、域名、端口、路径

2. 常见错误:
   - ❌ http://... (应该是 https://)
   - ❌ 末尾多了斜杠 /
   - ❌ 域名拼写错误
   - ❌ 路径错误 (/callback 而不是 /auth/v1/callback)

3. 正确格式:
   ✅ https://dasflvaxjpcjykgtlkrt.supabase.co/auth/v1/callback
   ✅ http://localhost:5173/auth/v1/callback (仅开发环境)
```

### Q4: 测试用户数量限制

```yaml
限制:
  - Testing 模式: 最多 100 个测试用户
  - Production 模式: 无限制

建议:
  - 内部测试: 使用 Testing 模式
  - 公开发布: 发布到 Production 模式
  - 基础权限: 可以直接发布，无需审核
```

### Q5: 如何快速验证配置是否生效？

```bash
# 检查清单:

1. Google Cloud Console
   ✓ OAuth consent screen → App name 已填写
   ✓ OAuth consent screen → 状态为 "Published"
   ✓ Credentials → Redirect URIs 配置正确

2. 浏览器测试
   ✓ 使用无痕窗口
   ✓ 撤销了旧的应用授权
   ✓ 清除了浏览器缓存

3. 验证结果
   ✓ 授权页面显示品牌名称
   ✓ 显示应用 Logo (如果配置了)
   ✓ 链接指向品牌域名 (如果配置了)
```

---

## 📋 配置完成检查清单

使用此清单确认所有步骤已完成：

### Google Cloud Console 配置

- [ ] **OAuth 同意屏幕配置**
  - [ ] App name: `SoraPrompt Studio`
  - [ ] App logo: 已上传 (可选)
  - [ ] User support email: 已填写
  - [ ] Application home page: 已填写 (可选但推荐)
  - [ ] Privacy policy link: 已填写 (可选但推荐)
  - [ ] Authorized domains: 已添加必要域名

- [ ] **OAuth Client 配置**
  - [ ] Client ID 和 Secret 已创建
  - [ ] Authorized redirect URIs 包含 Supabase 回调地址
  - [ ] 配置已保存

- [ ] **发布状态**
  - [ ] Testing (仅测试用户) 或
  - [ ] In production (所有用户)

### Supabase 配置

- [ ] **Google Provider**
  - [ ] Google Provider 已启用
  - [ ] Client ID 已填写
  - [ ] Client Secret 已填写

- [ ] **URL Configuration**
  - [ ] Site URL 已配置
  - [ ] Redirect URLs 已配置

### 测试验证

- [ ] **清除缓存**
  - [ ] 撤销了 Google 账号中的旧授权
  - [ ] 清除了浏览器缓存和 Cookie

- [ ] **功能测试**
  - [ ] 使用无痕窗口测试
  - [ ] Google 登录正常工作
  - [ ] 授权页面显示正确的品牌名称
  - [ ] 登录后正确跳转到应用

---

## 🎯 快速修复总结

**最简单的修复步骤 (5 分钟):**

1. **打开 Google Cloud Console**
   ```
   https://console.cloud.google.com/
   → APIs & Services
   → OAuth consent screen
   → EDIT APP
   ```

2. **填写应用名称**
   ```
   App name: SoraPrompt Studio
   User support email: [你的邮箱]
   ```

3. **保存并测试**
   ```
   → SAVE AND CONTINUE
   → 清除浏览器缓存
   → 重新测试 Google 登录
   ```

**预期结果:**
```
修复前: 继续前往 dasflvaxjpcjykgtlkrt.supabase.co
修复后: 继续前往 SoraPrompt Studio ✅
```

---

## 📚 参考资源

### 官方文档

- [Google OAuth 同意屏幕配置](https://support.google.com/cloud/answer/10311615)
- [Supabase Google Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [OAuth 2.0 最佳实践](https://developers.google.com/identity/protocols/oauth2/web-server)

### 相关工具

- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Dashboard](https://app.supabase.com/)
- [Google 账号权限管理](https://myaccount.google.com/permissions)

---

## 💡 最佳实践建议

### 1. 品牌一致性

```yaml
保持一致的品牌呈现:
  - 应用名称: 在所有平台使用相同的名称
  - Logo: 使用相同的品牌标识
  - 域名: 使用统一的品牌域名
  - 配色: 保持视觉一致性
```

### 2. 用户体验优化

```yaml
优化登录体验:
  - 提供清晰的品牌识别
  - 添加隐私政策和服务条款链接
  - 使用 HTTPS 确保安全
  - 提供多种登录方式
```

### 3. 安全性考虑

```yaml
安全最佳实践:
  - 不要在代码中暴露 Client Secret
  - 定期轮换 OAuth 凭据
  - 只请求必要的权限范围
  - 监控异常登录活动
```

### 4. 部署清单

```yaml
部署到生产环境前:
  ✓ OAuth 配置已更新为生产域名
  ✓ 应用已发布 (Testing → Production)
  ✓ 隐私政策和服务条款页面已上线
  ✓ SSL 证书已配置
  ✓ 所有环境变量已更新
  ✓ 已进行端到端测试
```

---

## 🆘 需要帮助？

如果按照以上步骤操作后仍有问题：

### 调试步骤

1. **检查 Google Cloud Console 日志**
   ```
   APIs & Services → Dashboard → 查看错误日志
   ```

2. **查看浏览器控制台**
   ```
   F12 → Console → 查看详细错误信息
   ```

3. **验证 Supabase 配置**
   ```
   Supabase Dashboard → Logs → 查看认证日志
   ```

4. **测试 OAuth 流程**
   ```
   使用 Google OAuth Playground 测试:
   https://developers.google.com/oauthplayground/
   ```

### 常见错误代码

```yaml
400 Bad Request:
  - 检查 Client ID 和 Secret 是否正确
  - 确认 Google Provider 已在 Supabase 中启用

401 Unauthorized:
  - 检查 OAuth 凭据是否过期
  - 确认权限范围配置正确

redirect_uri_mismatch:
  - 检查 redirect URI 是否完全匹配
  - 注意协议、域名、端口、路径必须完全一致

access_denied:
  - 用户拒绝了授权
  - 或应用未添加为测试用户 (Testing 模式)
```

---

## ✨ 结语

完成以上配置后，您的 Google OAuth 登录体验将更加专业和可信，用户会看到统一的品牌形象，而不是技术性的 Supabase 域名。

**关键要点:**
- ✅ 应用名称是必需的，必须在 OAuth 同意屏幕中配置
- ✅ 使用 Supabase 默认域名作为 redirect URI 是正常的
- ✅ 配置后立即生效，清除缓存即可看到效果
- ✅ 基础权限无需审核即可发布应用

祝配置顺利！🚀
