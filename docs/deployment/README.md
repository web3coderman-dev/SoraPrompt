# 🔐 Google 域名验证文档

> SoraPrompt 项目的 Google Cloud 域名所有权验证指南

---

## 📚 文档导航

### 🚀 [快速开始](./QUICK-START.md)
5 分钟快速完成验证配置

### 📖 [完整操作指南](./google-verification-guide.md)
详细的分步操作说明和问题排查

### 📊 [验证报告](./verification.md)
DNS 检测结果和配置信息

### 🛠️ [验证脚本](./verify-dns.cjs)
自动检查 DNS 记录的 Node.js 脚本

---

## ⚡ 快速验证步骤

1. **登录 Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **添加 DNS TXT 记录**
   ```
   Settings → Domains → DNS Records

   Type:  TXT
   Name:  @
   Value: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
   ```

3. **等待并验证**
   ```bash
   # 等待 10 分钟后运行
   node docs/deployment/verify-dns.cjs
   ```

4. **完成 Google 验证**
   - 访问: https://console.cloud.google.com/apis/credentials/consent
   - 点击"验证"按钮

---

## 📋 核心信息

| 项目 | 值 |
|------|-----|
| 域名 | soraprompt.studio |
| DNS 托管 | Vercel (NS1) |
| 验证值 | google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0 |

---

## 🎯 验证目标

完成后，Google Cloud 验证中心应显示:

```
✅ 隐私权政策要求
✅ 首页要求
```

---

## ⚠️ 重要提示

1. **DNS 记录需永久保留** - 删除后需重新验证
2. **等待 DNS 传播** - 通常 5-15 分钟
3. **使用验证脚本确认** - 避免过早提交验证

---

## 🆘 需要帮助？

- 查看 [完整操作指南](./google-verification-guide.md)
- 运行 [验证脚本](./verify-dns.cjs) 获取详细状态
- 查看 [常见问题](./google-verification-guide.md#常见问题)

---

## 📞 支持资源

- [Google Search Console 文档](https://support.google.com/webmasters/answer/9008080)
- [Vercel DNS 文档](https://vercel.com/docs/concepts/projects/domains)
- [Google Cloud Console](https://console.cloud.google.com)

---

**更新时间**: 2025-10-30
**文档版本**: 1.0
