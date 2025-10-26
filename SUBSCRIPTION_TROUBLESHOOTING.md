# Subscription System Troubleshooting Guide

## 问题：点击升级按钮无响应

### 已实施的修复

#### 1. 添加调试日志
在 `SubscriptionContext.tsx` 的 `upgradeSubscription` 函数中添加了详细的控制台日志：
```typescript
console.log('Upgrading subscription to:', newTier);
console.log('Upgrade response:', { data, error });
```

这将帮助我们在浏览器控制台中看到：
- 升级请求是否被发送
- 数据库函数是否正确响应
- 是否有任何错误

#### 2. 添加用户反馈
在 `SubscriptionPlans.tsx` 中添加了成功/失败消息显示：
- ✅ 升级成功时显示绿色提示
- ❌ 升级失败时显示红色错误提示
- 🔄 升级中时按钮显示禁用状态

#### 3. 添加未登录用户检查
如果用户未登录，现在会显示友好的登录提示页面，而不是空白或错误。

### 如何测试升级功能

1. **确保已登录**
   - 打开应用
   - 使用邮箱/密码或 Google 登录
   - 等待加载完成

2. **访问订阅页面**
   - 点击侧边栏的"订阅"菜单
   - 应该看到三个订阅层级：Free、Creator、Director
   - 当前计划会显示在顶部，带有徽章

3. **测试升级**
   - 点击非当前计划的"升级"按钮
   - 按钮会显示"处理中..."状态
   - 几秒后会显示成功或失败消息

4. **查看控制台日志**（开发调试用）
   - 打开浏览器开发者工具（F12）
   - 切换到 Console 标签
   - 点击升级按钮
   - 查看日志输出：
     ```
     Upgrading subscription to: creator
     Upgrade response: { data: true, error: null }
     Upgrade successful, refreshing subscription
     ```

### 常见问题排查

#### 问题 1：按钮点击后没有任何反应
**可能原因：**
- 用户未登录
- 网络连接问题
- 数据库触发器未创建

**解决方法：**
1. 检查浏览器控制台是否有错误
2. 确认用户已成功登录（顶部应显示用户信息）
3. 检查网络请求是否发送（Network 标签）

#### 问题 2：显示"升级失败"消息
**可能原因：**
- 数据库 RPC 函数返回 false
- 用户没有有效的订阅记录
- 权限问题（RLS 策略）

**解决方法：**
1. 查看控制台日志中的 `Upgrade response`
2. 如果 `data: false`，说明数据库函数执行失败
3. 检查 Supabase 数据库中的 `subscriptions` 表是否有该用户的记录
4. 确认 RLS 策略允许用户更新自己的订阅

#### 问题 3：订阅记录不存在
**可能原因：**
- 用户刚注册，订阅记录还未创建
- 数据库触发器未正常工作

**解决方法：**
`SubscriptionContext` 会在加载时自动创建订阅记录：
```typescript
if (!data) {
  // Auto-create subscription for new users
  const { data: newSub, error: createError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      tier: 'free',
      remaining_credits: 3,
      total_credits: 3,
      reset_cycle: 'daily',
      renewal_date: new Date(Date.now() + 86400000).toISOString(),
    })
    .select()
    .single();
}
```

### 数据库函数检查

如果升级一直失败，请在 Supabase 数据库中运行以下 SQL 检查：

```sql
-- 1. 检查用户的订阅记录
SELECT * FROM subscriptions WHERE user_id = 'YOUR_USER_ID';

-- 2. 手动测试升级函数
SELECT upgrade_subscription('YOUR_USER_ID'::uuid, 'creator'::subscription_tier);

-- 3. 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'subscriptions';

-- 4. 检查触发器
SELECT * FROM pg_trigger WHERE tgname LIKE '%subscription%';
```

### 成功标志

升级成功后，你应该看到：

1. ✅ 页面顶部显示绿色成功消息
2. ✅ 当前计划徽章更新为新层级
3. ✅ 新选择的计划按钮变为"当前计划"（禁用状态）
4. ✅ 使用量计数器显示新的额度（Creator=1000，Director=3000）
5. ✅ 控制台显示成功日志

### 下一步开发

如果基本升级功能正常，可以考虑：

1. **集成支付（Stripe）**
   - 添加真实的支付流程
   - 连接 Stripe webhooks
   - 处理支付成功/失败

2. **订阅取消功能**
   - 添加"取消订阅"按钮
   - 实现降级到 Free 的逻辑
   - 保留剩余天数的按比例退款

3. **订阅历史**
   - 显示订阅变更历史
   - 显示支付历史记录
   - 下载发票功能

4. **自动续费提醒**
   - 发送邮件提醒
   - 显示续费倒计时
   - 自动扣费通知

## 测试清单

- [ ] 未登录用户访问订阅页面显示登录提示
- [ ] 已登录用户能看到三个订阅层级
- [ ] 当前计划显示正确的徽章
- [ ] 点击"升级"按钮显示"处理中..."状态
- [ ] 升级成功显示绿色成功消息
- [ ] 升级失败显示红色错误消息
- [ ] 升级后当前计划徽章更新
- [ ] 升级后使用量计数器显示新额度
- [ ] 控制台日志显示详细的调试信息
- [ ] 所有语言（中英日等）的翻译都正确显示
