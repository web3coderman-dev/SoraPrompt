# Sora Prompt Studio - 配置指南

## 必需的环境变量配置

### OpenAI API Key 配置

Edge Function 需要 OpenAI API Key 才能正常工作。请按以下步骤配置：

#### 1. 获取 OpenAI API Key

1. 访问 [OpenAI API Keys 页面](https://platform.openai.com/api-keys)
2. 登录您的 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制生成的 API Key（格式：`sk-...`）

#### 2. 在 Supabase 中配置环境变量

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目：`dasflvaxjpcjykgtlkrt`
3. 进入 **Project Settings** → **Edge Functions**
4. 找到 **Environment Variables** 部分
5. 添加以下环境变量：

   **变量名**: `OPENAI_API_KEY`
   **值**: `sk-your-actual-api-key-here`

6. 点击 **Save** 保存

#### 3. 可选：配置 OpenAI 模型

默认使用 `gpt-5`（会自动回退到 `gpt-4o`）。如果需要指定模型：

**变量名**: `OPENAI_MODEL`
**值**: `gpt-4o` 或 `gpt-4-turbo` 或其他可用模型

#### 4. 重新部署 Edge Function（可选）

环境变量更新后，Edge Function 会自动生效。如果遇到问题，可以重新部署。

---

## 验证配置

配置完成后，访问应用并尝试生成一个提示词。检查：

1. **成功标志**：生成的提示词应该是独特的、详细的电影级描述
2. **失败标志**：如果生成的提示词总是相同且简单（如 "landscape中的person..."），说明配置未生效

### 调试方法

如果配置后仍然失败，请检查浏览器开发者控制台（F12）：

- 查看 **Console** 标签中的错误信息
- 查看 **Network** 标签中的 Edge Function 请求
- 检查响应状态码和错误详情

常见错误：
- `OPENAI_API_KEY not configured` - 环境变量未设置
- `401 Unauthorized` - API Key 无效
- `429 Too Many Requests` - API 请求频率超限
- `model_not_found` - 模型不可用（会自动回退到 gpt-4o）

---

## 功能说明

配置完成后，系统将提供以下 AI 功能：

1. **智能语义解析** - 自动提取场景、主题、情绪等元素
2. **导演风格匹配** - 基于 6 位大师导演风格库自动匹配
3. **电影级提示词生成** - 生成专业的 Sora 视频提示词
4. **质量评分** - AI 自动评估提示词质量（0-100 分）
5. **迭代优化** - 根据反馈持续改进提示词
6. **多语言支持** - 支持中文、英文、日语、韩语等 7 种语言

---

## 技术架构

```
用户输入 → Edge Function → OpenAI GPT-4/5 → 生成提示词 → 保存到数据库
                ↓ (失败时)
              Mock Fallback (临时方案)
```

**重要**：当前如果 OpenAI API 调用失败，系统会使用简单的 fallback 逻辑，生成质量会显著下降。强烈建议配置真实的 API Key。

---

## 成本估算

OpenAI API 按 token 计费：

- **快速生成模式**：约 500-1000 tokens/次（$0.005 - $0.01/次）
- **导演模式**：约 1500-3000 tokens/次（$0.015 - $0.03/次）

估算月成本（gpt-4o）：
- 轻度使用（100次/月）：~$1-2
- 中度使用（500次/月）：~$5-10
- 重度使用（2000次/月）：~$20-40

如果使用 gpt-5（价格可能更高），请参考 [OpenAI 定价页面](https://openai.com/api/pricing/)。

---

## 故障排除

### 问题：生成的提示词总是一样

**原因**：OPENAI_API_KEY 未配置或无效

**解决方案**：
1. 检查 Supabase Dashboard 中的环境变量配置
2. 确认 API Key 有效且有余额
3. 检查浏览器控制台的错误信息

### 问题：生成的提示词中英文混杂

**原因**：已在最新版本修复

**确认**：检查生成时间，2025-10-25 03:01 之后的生成应该已修复

### 问题：API 请求被限流

**原因**：超过 OpenAI 的速率限制

**解决方案**：
1. 降低请求频率
2. 升级 OpenAI 账号等级
3. 考虑添加请求队列/缓存机制

---

## 支持

如有问题，请检查：
1. Supabase Dashboard 的 Edge Functions 日志
2. 浏览器开发者控制台的网络请求
3. OpenAI API 使用情况和余额

---

**最后更新**: 2025-10-25
**版本**: v0.1 MVP
