# 订阅页面交互设计方案

## 📋 设计目标

让未登录用户能够完整浏览所有套餐信息，降低认知门槛，提升转化率。登录仅在用户明确表达付费意愿时触发。

---

## 🎯 核心原则

1. **透明度优先**：所有信息对所有用户可见
2. **延迟登录**：只在必要时才要求登录
3. **保持上下文**：登录后用户回到原操作点
4. **体验一致**：登录前后视觉完全一致

---

## 🔄 状态机设计

```
┌─────────────────────────────────────────────────────────────┐
│                    订阅页面状态机                              │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  页面加载     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ 检查登录状态  │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼─────┐            ┌─────▼────┐
         │ 未登录    │            │ 已登录    │
         └────┬─────┘            └─────┬────┘
              │                        │
    ┌─────────▼──────────┐    ┌───────▼────────┐
    │ 展示完整套餐信息    │    │ 展示完整套餐    │
    │ • 功能列表          │    │ • 功能列表       │
    │ • 价格              │    │ • 价格           │
    │ • 权益说明          │    │ • 当前订阅状态   │
    │ • 按钮：立即升级    │    │ • 按钮：立即升级 │
    └─────────┬──────────┘    └───────┬────────┘
              │                        │
              │ 点击升级按钮             │ 点击升级按钮
              │                        │
    ┌─────────▼──────────┐    ┌───────▼────────┐
    │ 触发登录模态框      │    │ 直接进入付费流程 │
    │ • 提示需要登录      │    │ • 显示订阅确认   │
    │ • 提供注册/登录选项 │    │ • 计算价格差额   │
    └─────────┬──────────┘    │ • 调用支付接口   │
              │                └───────┬────────┘
              │ 登录成功               │
              │                        │
    ┌─────────▼──────────┐            │
    │ 保留操作上下文      │            │
    │ • 记住目标套餐      │            │
    │ • 刷新页面状态      │            │
    └─────────┬──────────┘            │
              │                        │
              │ 自动触发               │
              │                        │
    ┌─────────▼────────────────────────▼────────┐
    │           进入付费流程                      │
    │ • 显示套餐确认弹窗                          │
    │ • 计算实际支付金额                          │
    │ • 调用 upgradeSubscription()                │
    └─────────┬──────────────────────────────────┘
              │
              │ 支付成功/失败
              │
    ┌─────────▼──────────┐
    │ 更新 UI 状态        │
    │ • 刷新订阅信息      │
    │ • 显示成功/失败提示 │
    │ • 更新按钮状态      │
    └────────────────────┘
```

---

## 🎨 UI 行为流程

### 场景 1：未登录用户浏览订阅页面

```
用户访问 /subscription
    ↓
【页面渲染】
    ├─ 显示标题："选择您的计划"
    ├─ 显示 3 张套餐卡片（免费版/创作者/导演）
    │   ├─ 卡片样式：完全可见，正常颜色（无半透明）
    │   ├─ 功能列表：完整展示
    │   ├─ 价格信息：清晰显示
    │   └─ 按钮文案："立即升级" / "开始使用"
    ├─ 底部说明：功能对比、隐私政策等
    └─ ❌ 不显示 LoginPrompt 遮挡层

用户点击某个套餐的"立即升级"按钮
    ↓
【触发拦截】
    ├─ 检测到未登录状态
    ├─ 记录目标套餐 tier (localStorage/state)
    └─ 弹出 LoginModal

【登录模态框】
    ├─ 标题："登录以继续订阅"
    ├─ 提示："登录后即可订阅 [套餐名称] 方案"
    ├─ 登录表单（邮箱/密码 或 OAuth）
    └─ 注册链接

用户完成登录
    ↓
【登录成功处理】
    ├─ 关闭 LoginModal
    ├─ 刷新页面状态（AuthContext 更新）
    ├─ 读取保存的目标套餐
    └─ 自动触发 upgradeSubscription(targetTier)

【进入付费流程】
    ├─ 调用 Supabase 更新订阅
    ├─ 显示 Toast 提示："订阅成功"
    └─ 刷新页面，按钮变为"当前方案"
```

---

### 场景 2：已登录用户访问订阅页面

```
用户访问 /subscription（已登录）
    ↓
【页面渲染】
    ├─ 显示标题："选择您的计划"
    ├─ 显示当前订阅状态徽章（顶部）
    │   例如："当前方案: 创作者 🎬"
    ├─ 显示 3 张套餐卡片
    │   ├─ 当前订阅的卡片：按钮显示"当前方案"，禁用状态
    │   ├─ 其他卡片：按钮显示"立即升级" / "降级"
    │   └─ 卡片样式：完全一致，无差异
    └─ 底部说明

用户点击"立即升级"
    ↓
【直接进入付费流程】
    ├─ 无需登录检查
    ├─ 调用 upgradeSubscription(tier)
    ├─ 更新 Supabase 数据
    └─ 显示成功提示

【更新 UI】
    ├─ 刷新订阅状态
    ├─ 更新按钮状态
    └─ 显示 Toast："订阅已更新"
```

---

## 🛠️ 技术实现要点

### 1. 组件结构调整

#### SubscriptionPlans.tsx

```typescript
// 移除这部分代码：
if (!user) {
  return (
    <LoginPrompt ... />
    <div className="opacity-60 pointer-events-none">
      {/* 半透明卡片 */}
    </div>
  );
}

// 改为统一渲染：
return (
  <div>
    {/* 标题 + 当前订阅状态（如果已登录） */}
    <Header
      user={user}
      subscription={subscription}
    />

    {/* 套餐卡片（始终完整展示） */}
    <PlanCards
      plans={plans}
      user={user}
      subscription={subscription}
      onUpgrade={handleUpgrade} // 统一处理
    />

    {/* 底部说明 */}
    <Footer />

    {/* 登录模态框（按需显示） */}
    {showLoginModal && (
      <LoginModal
        onClose={handleLoginClose}
        context={{ targetTier }}
      />
    )}
  </div>
);
```

### 2. 升级处理逻辑

```typescript
const handleUpgrade = async (tier: SubscriptionTier) => {
  // 1. 检查登录状态
  if (!user) {
    // 保存目标套餐到 state/localStorage
    setTargetTier(tier);
    setShowLoginModal(true);
    return;
  }

  // 2. 已登录，直接升级
  setUpgrading(true);
  try {
    await upgradeSubscription(tier);
    // 显示成功提示
    showToast('订阅成功', 'success');
  } catch (error) {
    showToast('订阅失败', 'error');
  } finally {
    setUpgrading(false);
  }
};
```

### 3. 登录成功回调

```typescript
const handleLoginSuccess = async () => {
  setShowLoginModal(false);

  // 如果有保存的目标套餐，自动触发升级
  if (targetTier) {
    // 等待 AuthContext 更新
    await new Promise(resolve => setTimeout(resolve, 500));

    // 自动触发升级流程
    await handleUpgrade(targetTier);

    // 清除保存的目标
    setTargetTier(null);
  }
};
```

### 4. LoginModal 改进

```typescript
interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  context?: {
    targetTier?: SubscriptionTier;
    message?: string;
  };
}

// 在模态框中显示上下文提示
{context?.targetTier && (
  <div className="mb-4 text-center">
    <p className="text-sm text-text-secondary">
      登录后即可订阅
      <span className="font-bold text-text-primary">
        {getTierName(context.targetTier)}
      </span>
      方案
    </p>
  </div>
)}
```

---

## 📊 数据流转

### 状态管理

```typescript
// SubscriptionPlans 组件内部状态
const [targetTier, setTargetTier] = useState<SubscriptionTier | null>(null);
const [showLoginModal, setShowLoginModal] = useState(false);
const [upgrading, setUpgrading] = useState(false);

// 全局状态（来自 Context）
const { user } = useAuth();
const { subscription, upgradeSubscription } = useSubscription();
```

### 本地存储（可选）

```typescript
// 如果需要跨页面刷新保持上下文
localStorage.setItem('pendingSubscription', tier);

// 页面加载时检查
useEffect(() => {
  const pending = localStorage.getItem('pendingSubscription');
  if (user && pending) {
    handleUpgrade(pending as SubscriptionTier);
    localStorage.removeItem('pendingSubscription');
  }
}, [user]);
```

---

## 🎬 视觉设计规范

### 按钮状态

| 状态 | 文案 | 样式 | 交互 |
|-----|------|------|------|
| 未登录 | "立即升级" | `variant="director"` | 触发登录 |
| 已登录-当前方案 | "当前方案" | `variant="preview"`, `disabled` | 不可点击 |
| 已登录-可升级 | "立即升级" | `variant="director"` | 直接升级 |
| 已登录-可降级 | "切换方案" | `variant="scene"` | 确认后切换 |
| 升级中 | "处理中..." | `variant="preview"`, `disabled` | 不可点击 |

### 卡片样式（统一）

```css
/* 无论登录状态，卡片样式保持一致 */
.plan-card {
  opacity: 1; /* ✅ 始终完全可见 */
  pointer-events: auto; /* ✅ 始终可交互 */
  border: 1px solid rgba(58, 108, 255, 0.2);
  background: var(--scene-fill);
  transition: all 300ms ease;
}

.plan-card:hover {
  border-color: rgba(58, 108, 255, 0.4);
  box-shadow: var(--shadow-key);
}

.plan-card.popular {
  border: 2px solid var(--key-light);
  box-shadow: var(--shadow-key);
  scale: 1.05;
}
```

---

## 🔌 后端接口依赖

### 现有接口（Supabase）

1. **获取用户订阅**
   - Context: `useSubscription()`
   - 返回: `subscription` 对象

2. **升级订阅**
   - 方法: `upgradeSubscription(tier: SubscriptionTier)`
   - 更新: `user_subscriptions` 表

3. **扣除积分**
   - 方法: `deductCredits(promptId, mode)`
   - 更新: `user_subscriptions.credits_used`

### 无需新增接口

当前 Supabase 设置已支持所有需求，无需额外后端开发。

---

## ✅ 验收标准

### 功能验收

- [ ] 未登录用户能看到完整套餐信息（无遮挡、无半透明）
- [ ] 未登录点击升级按钮触发登录弹窗
- [ ] 登录成功后自动继续升级流程
- [ ] 已登录用户点击升级按钮直接进入付费流程
- [ ] 当前订阅方案按钮显示"当前方案"且禁用
- [ ] 升级成功后显示 Toast 提示
- [ ] 页面状态实时更新

### 视觉验收

- [ ] 登录前后页面布局完全一致
- [ ] 所有卡片样式符合 Design System
- [ ] 按钮状态有明确视觉反馈
- [ ] 登录模态框样式符合 Design System
- [ ] 过渡动画流畅（300ms）
- [ ] 无闪烁或布局跳动

### 体验验收

- [ ] 操作流程顺畅，无卡顿
- [ ] 登录后自动回到原操作点
- [ ] 错误提示清晰友好
- [ ] 移动端适配良好
- [ ] 无控制台错误

---

## 📈 预期收益

1. **降低认知门槛**：用户无需登录即可了解所有套餐
2. **提升转化率**：透明的信息展示增强信任感
3. **改善流程**：延迟登录减少用户流失
4. **体验一致性**：统一的视觉和交互降低学习成本

---

## 🔄 迭代方向

### Phase 2（未来优化）

1. **套餐对比表**：添加功能对比矩阵
2. **价格计算器**：实时显示升级/降级差额
3. **推荐算法**：根据使用情况推荐合适套餐
4. **优惠券系统**：支持优惠码和促销活动
5. **试用期管理**：提供限时试用功能

---

**文档版本**: v1.0
**最后更新**: 2025-10-27
**负责人**: AI Assistant
**状态**: ✅ 设计完成，待实现
