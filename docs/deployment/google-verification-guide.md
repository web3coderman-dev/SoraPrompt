# Google Cloud 域名验证操作指南

> 📅 生成时间: 2025-10-30
> 🎯 目标: 完成 soraprompt.studio 的 Google 域名所有权验证
> 🔐 验证方式: DNS TXT 记录

---

## 📊 DNS 配置检测结果

- **域名**: `soraprompt.studio`
- **DNS 托管**: NS1 (通常为 Vercel 管理)
- **Nameservers**:
  - dns1.p09.nsone.net
  - dns2.p09.nsone.net
  - dns3.p09.nsone.net
  - dns4.p09.nsone.net

---

## 🔑 Google 验证信息

```
验证类型: TXT 记录
记录名称: @  (或留空，代表根域名)
记录值: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
TTL: 3600 (或自动)
```

---

## ✅ 操作步骤

### 方案 1: 通过 Vercel 控制台添加（推荐）

由于您的 DNS 使用 NS1（Vercel 的 DNS 服务），最简单的方法是：

1. **登录 Vercel Dashboard**
   - 访问: https://vercel.com/dashboard
   - 找到 `soraprompt.studio` 项目

2. **进入域名设置**
   - 点击项目 → Settings → Domains
   - 找到 `soraprompt.studio`

3. **添加 DNS 记录**
   - 滚动到 "DNS Records" 部分
   - 点击 "Add Record" 或 "Edit DNS"
   - 添加以下记录:
     ```
     Type: TXT
     Name: @
     Value: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
     TTL: 默认 (或 3600)
     ```

4. **保存并等待生效**
   - 点击 "Save" 保存记录
   - DNS 传播通常需要 5-15 分钟

5. **验证 DNS 生效**
   - 等待 10 分钟后，在本地运行验证命令（见下方）
   - 或使用在线工具: https://toolbox.googleapps.com/apps/dig/#TXT/soraprompt.studio

6. **返回 Google 验证中心**
   - 访问: https://console.cloud.google.com/apis/credentials/consent
   - 找到"验证中心"
   - 点击"验证"按钮
   - 等待系统检查（可能需要几分钟）

---

### 方案 2: 通过域名注册商添加

如果您在其他平台购买域名（如 Namecheap、GoDaddy 等）:

1. 登录域名注册商控制台
2. 找到 DNS 管理页面
3. 添加 TXT 记录:
   ```
   Host/Name: @ 或留空
   Type: TXT
   Value: google-site-verification=j2nrnLhJJ0F7ft7OJ8aFgKkZ7kNOs-pzg6zZiOuZRy0
   TTL: 3600
   ```
4. 保存并等待 DNS 传播（10-30 分钟）

---

## 🧪 验证 DNS 记录

### 在项目中运行验证脚本

```bash
node docs/deployment/verify-dns.cjs
```

### 手动检查（命令行）

```bash
# 使用 dig
dig soraprompt.studio TXT +short

# 使用 nslookup
nslookup -type=TXT soraprompt.studio

# 使用 host
host -t TXT soraprompt.studio
```

### 在线工具验证

- Google Dig Tool: https://toolbox.googleapps.com/apps/dig/#TXT/soraprompt.studio
- MXToolbox: https://mxtoolbox.com/TXTLookup.aspx

---

## ⏱️ DNS 传播时间

| 平台 | 预计传播时间 |
|------|------------|
| Vercel | 5-15 分钟 |
| Cloudflare | 2-5 分钟 |
| 其他平台 | 10-48 小时 |

---

## ❓ 常见问题

### Q1: 添加记录后仍然提示未验证？
**A**: DNS 传播需要时间，请等待 15-30 分钟后再点击验证。

### Q2: 如何确认 DNS 记录已生效？
**A**: 运行项目中的 `verify-dns.js` 脚本，或使用 Google Dig Tool 查询。

### Q3: 验证失败怎么办？
**A**:
1. 确认 TXT 记录值完全正确（包括 `google-site-verification=`）
2. 等待更长时间（有些 DNS 服务器更新较慢）
3. 清除浏览器缓存后重新验证
4. 检查是否有多条 TXT 记录冲突

### Q4: 可以删除其他 TXT 记录吗？
**A**: 建议保留所有现有 TXT 记录，只添加新的 Google 验证记录。

---

## 📝 验证完成检查清单

- [ ] DNS TXT 记录已添加到托管平台
- [ ] 等待 DNS 传播（至少 10 分钟）
- [ ] 使用验证脚本确认记录生效
- [ ] 在 Google 验证中心点击"验证"按钮
- [ ] 确认"首页要求"状态变为 ✅
- [ ] 验证 Google OAuth 可以正常使用

---

## 🔄 下一步

验证成功后：
1. Google Auth Platform 将自动更新验证状态
2. OAuth 应用将可以正常使用
3. 建议保留 TXT 记录，不要删除

---

## 📞 技术支持

如遇到问题，可以：
1. 查看 Google Search Console 帮助文档
2. 联系域名托管商客服
3. 在 Vercel Discord 社区寻求帮助

---

**注意**: 此验证记录需要永久保留在 DNS 中，删除后 Google 可能会要求重新验证。
