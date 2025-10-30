# 🚀 Google 域名验证 - 快速开始

> ⚡ 5 分钟完成 Google 域名验证

---

## 📋 验证信息（复制使用）

```
域名: soraprompt.studio
验证值: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
```

---

## ⚡ 快速步骤

### 1️⃣ 登录 Vercel
🔗 https://vercel.com/dashboard

### 2️⃣ 添加 DNS 记录
```
Settings → Domains → DNS Records → Add

Type:  TXT
Name:  @
Value: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
```

### 3️⃣ 等待 10 分钟后验证
```bash
node docs/deployment/verify-dns.cjs
```

### 4️⃣ 完成 Google 验证
🔗 https://console.cloud.google.com/apis/credentials/consent

点击"验证"按钮 → 等待成功 ✅

---

## 📚 详细文档

- [完整操作指南](./google-verification-guide.md)
- [验证报告](./verification.md)

---

## 🆘 遇到问题？

### 验证失败？
1. 等待 15 分钟再试
2. 检查 TXT 记录值是否完全正确
3. 清除浏览器缓存

### 找不到 DNS 设置？
Vercel: 项目 → Settings → Domains → 滚动到底部

---

**提示**: 验证记录需要永久保留，不要删除！
