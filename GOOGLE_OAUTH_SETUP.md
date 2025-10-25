# Google OAuth 配置指南

## 错误原因
当前错误 `net::ERR_BLOCKED_BY_RESPONSE 400 (Bad Request)` 是因为 Supabase 的 Google OAuth Provider 尚未配置。

## 配置步骤

### 第一步：在 Google Cloud Console 创建 OAuth 凭据

1. **访问 Google Cloud Console**
   - 打开 https://console.cloud.google.com/

2. **创建或选择项目**
   - 如果没有项目，点击"创建项目"
   - 输入项目名称（例如：Sora Prompt Studio）
   - 点击"创建"

3. **启用 Google+ API**
   - 在左侧菜单中，选择"APIs & Services" > "Library"
   - 搜索 "Google+ API"
   - 点击并启用它

4. **配置 OAuth 同意屏幕**
   - 进入 "APIs & Services" > "OAuth consent screen"
   - 选择 "External" 用户类型
   - 点击"创建"
   - 填写应用信息：
     - 应用名称：Sora Prompt Studio
     - 用户支持电子邮件：你的邮箱
     - 开发者联系信息：你的邮箱
   - 点击"保存并继续"
   - 在"Scopes"页面，点击"保存并继续"
   - 在"Test users"页面，可以添加测试用户（可选）
   - 点击"保存并继续"

5. **创建 OAuth 2.0 Client ID**
   - 进入 "APIs & Services" > "Credentials"
   - 点击"+ CREATE CREDENTIALS" > "OAuth client ID"
   - 应用类型：选择 "Web application"
   - 名称：Sora Prompt Studio Web Client
   - 授权的 JavaScript 来源：
     ```
     http://localhost:5173
     ```
   - 授权的重定向 URI：
     ```
     https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
     ```
     **重要**：将 `[YOUR_SUPABASE_PROJECT_REF]` 替换为你的 Supabase 项目 ID
     - 你可以在 Supabase Dashboard URL 中找到它
     - 例如：`https://dasfivaxjpcjykqtlkrt.supabase.co` 中的 `dasfivaxjpcjykqtlkrt`

6. **获取凭据**
   - 创建完成后，会显示 Client ID 和 Client Secret
   - **复制这两个值**（接下来需要用到）

### 第二步：在 Supabase 中配置 Google Provider

1. **登录 Supabase Dashboard**
   - 访问 https://app.supabase.com/
   - 选择你的项目

2. **配置 Google Provider**
   - 在左侧菜单中，选择 "Authentication" > "Providers"
   - 找到 "Google" 并点击它
   - 启用 Google Provider（切换开关）
   - 填入从 Google Cloud Console 获取的：
     - **Client ID**：粘贴你的 Google Client ID
     - **Client Secret**：粘贴你的 Google Client Secret
   - 点击"Save"保存

3. **检查 Site URL 配置**
   - 在 "Authentication" > "URL Configuration" 中
   - 确保 "Site URL" 设置为：
     - 本地开发：`http://localhost:5173`
     - 生产环境：你的生产域名
   - 确保 "Redirect URLs" 包含：
     - `http://localhost:5173/auth/callback`

### 第三步：验证配置

1. **重启开发服务器**
   - 如果开发服务器正在运行，重启它

2. **测试登录**
   - 访问登录页面
   - 点击 "Continue with Google"
   - 应该会跳转到 Google 授权页面
   - 授权后会重定向回应用

## 常见问题

### Q1: 错误 "redirect_uri_mismatch"
**原因**：Google OAuth 配置中的重定向 URI 不匹配

**解决方案**：
1. 检查 Google Cloud Console 中的授权重定向 URI
2. 确保包含：`https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
3. 确保没有多余的空格或字符

### Q2: 错误 "400 Bad Request"
**原因**：Supabase Google Provider 未配置或配置不正确

**解决方案**：
1. 确认在 Supabase Dashboard 中启用了 Google Provider
2. 检查 Client ID 和 Client Secret 是否正确
3. 保存配置后等待几秒钟生效

### Q3: 授权后无法登录
**原因**：回调 URL 配置问题

**解决方案**：
1. 检查 Supabase "URL Configuration" 中的 Site URL
2. 确保 Redirect URLs 包含正确的回调地址
3. 检查浏览器控制台是否有错误信息

## 开发环境 vs 生产环境

### 开发环境配置
```
JavaScript origins: http://localhost:5173
Redirect URIs: https://[PROJECT_REF].supabase.co/auth/v1/callback
Site URL: http://localhost:5173
```

### 生产环境配置（部署后）
```
JavaScript origins: https://your-domain.com
Redirect URIs: https://[PROJECT_REF].supabase.co/auth/v1/callback
Site URL: https://your-domain.com
```

## 安全提示

1. **不要将 Client Secret 提交到版本控制**
   - Client Secret 应该只在 Supabase Dashboard 中配置
   - 前端代码不需要也不应该包含 Client Secret

2. **定期轮换凭据**
   - 在生产环境中，建议定期更新 OAuth 凭据

3. **限制授权范围**
   - 只请求应用需要的最小权限

## 需要帮助？

如果遇到问题：
1. 检查 Supabase Dashboard 的日志
2. 查看浏览器控制台的详细错误信息
3. 确认 Google Cloud Console 中的项目配置
