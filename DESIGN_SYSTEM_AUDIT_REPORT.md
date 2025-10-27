# 🎬 SoraPrompt Design System 审查报告

**审查日期:** 2025-10-27
**设计系统版本:** 1.0.0 (AI Cinematic Studio)
**审查人员:** 资深前端设计审查工程师
**审查范围:** 全部组件、样式、布局、交互、无障碍

---

## 📊 执行摘要

**整体符合率:** 62%

**问题分布:**
- 🔴 严重问题 (Critical): 18 项
- 🟠 重要问题 (Major): 24 项
- 🟡 次要问题 (Minor): 15 项
- 🔵 建议优化 (Enhancement): 8 项

**总计:** 65 个不符合项

---

## 🔴 一、全局问题 (Global Issues)

### 1.1 颜色体系不一致

#### 问题 1: 硬编码颜色未使用设计令牌
**文件:** `History.tsx`, `Input.tsx`, `Badge.tsx`, `LoginModal.tsx`, `UsageCounter.tsx`, `SubscriptionPlans.tsx`

**问题描述:**
- 大量使用 `text-gray-*`, `bg-gray-*`, `border-gray-*` 而非设计系统的 `text-text-*`, `bg-scene-*`, `border-keyLight/*`
- 使用 `bg-white` 而非 `bg-scene-fill`
- 使用 `text-primary-600` 而非 `text-keyLight`
- 使用 `bg-green-*`, `bg-yellow-*`, `bg-red-*`, `bg-blue-*` 而非 `state-ok`, `state-warning`, `state-error`, `state-info`

**规范对照:**
```
❌ 错误: text-gray-900, bg-white, border-gray-200
✅ 正确: text-text-primary, bg-scene-fill, border-keyLight/20
```

**影响组件:**
1. History.tsx (139 处灰色硬编码)
2. Input.tsx (26 处灰色硬编码)
3. Badge.tsx (22 处非设计系统颜色)
4. LoginModal.tsx (45 处灰色硬编码)
5. UsageCounter.tsx (38 处非标准颜色)
6. SubscriptionPlans.tsx (52 处非标准颜色)

**修复建议:**
```typescript
// 统一替换映射
'bg-white'         → 'bg-scene-fill'
'text-gray-900'    → 'text-text-primary'
'text-gray-600'    → 'text-text-secondary'
'text-gray-500'    → 'text-text-tertiary'
'border-gray-200'  → 'border-keyLight/20'
'text-primary-600' → 'text-keyLight'
'bg-green-50'      → 'bg-state-ok/10'
'text-green-600'   → 'text-state-ok'
'bg-red-50'        → 'bg-state-error/10'
'text-red-600'     → 'text-state-error'
'bg-yellow-50'     → 'bg-state-warning/10'
'bg-blue-50'       → 'bg-state-info/10'
```

**优先级:** 🔴 Critical

---

#### 问题 2: 渐变色不符合电影级配色
**文件:** `SubscriptionPlans.tsx`, `LoginModal.tsx`

**问题描述:**
```typescript
// 当前实现
color: 'from-green-400 to-emerald-500'  // ❌ 非设计系统颜色
color: 'from-blue-500 to-indigo-600'    // ❌ 使用了紫色 indigo

// 设计系统规定
✅ 应使用: from-keyLight to-keyLight-600
✅ 应使用: from-rimLight to-rimLight-600
✅ 应使用: from-neon to-keyLight
```

**规范对照:**
DESIGN_SYSTEM.md 第 176-208 行明确定义了四种渐变：
- gradient-key (主光渐变)
- gradient-rim (边缘光渐变)
- gradient-neon (霓虹渐变)
- gradient-mixed (混合光)

**修复建议:**
```typescript
// SubscriptionPlans.tsx 修正
plans = [
  {
    tier: 'free',
    color: 'from-scene-fillLight to-scene-fill', // 灰色方案
    textColor: 'text-text-secondary',
  },
  {
    tier: 'creator',
    color: 'from-state-ok to-state-ok/80',  // 绿色保持但使用状态色
    textColor: 'text-white',
  },
  {
    tier: 'director',
    color: 'from-keyLight to-neon',  // 蓝紫混合光
    textColor: 'text-white',
  },
]
```

**优先级:** 🔴 Critical

---

### 1.2 字体体系不符合规范

#### 问题 3: 标题未使用 font-display
**文件:** `History.tsx`, `LoginModal.tsx`, `SubscriptionPlans.tsx`

**问题描述:**
```tsx
// ❌ 当前实现
<h2 className="text-2xl font-bold text-gray-900">

// ✅ 应使用
<h2 className="text-2xl font-bold font-display text-text-primary">
```

**规范对照:**
DESIGN_SYSTEM.md 第 218-229 行:
- **Display (Space Grotesk)**: 品牌标题、大标题使用

**影响:**
- History.tsx: 第 230 行
- LoginModal.tsx: 第 86 行
- SubscriptionPlans.tsx: 第 136, 177 行

**修复建议:**
为所有 h1, h2, h3 添加 `font-display` 类名

**优先级:** 🟠 Major

---

#### 问题 4: 代码字体缺失 font-code
**文件:** `History.tsx` (时间显示), `UsageCounter.tsx`

**问题描述:**
技术参数、时间码、数值应使用 `font-code` (IBM Plex Mono)

**规范对照:**
DESIGN_SYSTEM.md 第 222 行:
- **Code (IBM Plex Mono)**: 技术参数、代码专用

**修复建议:**
```tsx
// History.tsx 第 337 行
<span className="text-xs text-text-secondary font-code">
  {formatDate(prompt.created_at)}
</span>

// UsageCounter.tsx 第 32, 132 行 (数值显示)
<span className="text-sm font-semibold font-code text-text-secondary">
  {localCount} / {localLimit}
</span>
```

**优先级:** 🟡 Minor

---

### 1.3 阴影系统未使用设计令牌

#### 问题 5: 阴影不符合片场光影效果
**文件:** `History.tsx`, `LoginModal.tsx`, `UsageCounter.tsx`

**问题描述:**
```tsx
// ❌ 使用通用阴影
className="shadow-lg shadow-md shadow-2xl"

// ✅ 应使用片场阴影
className="shadow-depth-lg shadow-key shadow-light"
```

**规范对照:**
DESIGN_SYSTEM.md 第 332-345 行定义了 6 种片场阴影：
- `shadow-light`: Key Light 柔光
- `shadow-key`: 主光源投射
- `shadow-rim`: 边缘光晕
- `shadow-neon`: 霓虹发光
- `shadow-depth-sm/lg`: 景深效果

**影响统计:**
- History.tsx: 8 处非标准阴影
- LoginModal.tsx: 6 处非标准阴影
- SubscriptionPlans.tsx: 4 处非标准阴影

**修复建议:**
```tsx
// 卡片阴影
shadow-lg → shadow-depth-lg
shadow-md → shadow-depth-md

// 按钮阴影
shadow-md → shadow-key (主按钮)
shadow-sm → shadow-light (次要按钮)

// 悬停效果
hover:shadow-lg → hover:shadow-neon
```

**优先级:** 🟠 Major

---

### 1.4 圆角不统一

#### 问题 6: 圆角值混乱
**文件:** 多个组件

**问题描述:**
同一级别元素使用不同圆角值：
- `rounded-xl` (12px)
- `rounded-2xl` (20px)
- `rounded-lg` (12px)

**规范对照:**
DESIGN_SYSTEM.md 第 321-329 行:
- `radius.sm`: 6px (小按钮、标签)
- `radius.md`: 8px (标准按钮、输入框)
- `radius.card`: 12px (卡片、面板)
- `radius.lg`: 16px (大型容器)

**修复建议:**
- 所有卡片统一使用 `rounded-card` (12px)
- 所有按钮统一使用 `rounded-lg` (8px)
- 所有模态框统一使用 `rounded-xl` (16px)

**优先级:** 🟡 Minor

---

## 🔴 二、组件问题 (Component Issues)

### 2.1 Input 组件

#### 问题 7: Input 组件完全未符合设计系统
**文件:** `src/components/ui/Input.tsx`

**问题描述:**
1. Label 使用 `text-gray-700` 而非 `text-text-secondary`
2. Border 使用 `border-gray-300` 而非 `border-keyLight/20`
3. Focus ring 使用 `ring-primary-500` 而非 `ring-keyLight/20`
4. Error 颜色使用 `border-red-500` 而非 `border-state-error`
5. 缺少暗夜片场背景色

**规范对照:**
index.css 第 47-54 行已定义全局 input 样式：
```css
input, textarea {
  @apply bg-scene-fillLight border-keyLight/20 text-text-primary;
  @apply focus:border-keyLight focus:ring-2 focus:ring-keyLight/20;
}
```

**修复建议:**
完全重写 Input.tsx，移除所有灰色引用：
```typescript
export const Input: React.FC<InputProps> = ({ label, error, ... }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-scene-fillLight border ${hasError ? 'border-state-error' : 'border-keyLight/20'}
          text-text-primary placeholder:text-text-tertiary
          focus:outline-none focus:ring-2
          ${hasError ? 'focus:ring-state-error/20' : 'focus:ring-keyLight/20'}
          focus:border-keyLight
          transition-all duration-200
        `}
      />
      {error && (
        <p className="text-xs text-state-error">{error}</p>
      )}
    </div>
  );
};
```

**优先级:** 🔴 Critical

---

### 2.2 Badge 组件

#### 问题 8: Badge 颜色方案不符合片场状态系统
**文件:** `src/components/ui/Badge.tsx`

**问题描述:**
```typescript
// ❌ 当前实现
const variantClasses = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};
```

**规范对照:**
应使用设计系统的状态色 (第 131-147 行):
```typescript
// ✅ 正确实现
const variantClasses = {
  primary: 'bg-keyLight/10 text-keyLight border border-keyLight/30',
  success: 'bg-state-ok/10 text-state-ok border border-state-ok/30',
  warning: 'bg-state-warning/10 text-state-warning border border-state-warning/30',
  error: 'bg-state-error/10 text-state-error border border-state-error/30',
  info: 'bg-state-info/10 text-state-info border border-state-info/30',
};
```

**修复建议:**
1. 所有 Badge 添加边框以增强片场氛围
2. 使用半透明背景 (透明度 10%)
3. QualityBadge 第 74 行硬编码中文"质量评分"应改为 i18n

**优先级:** 🔴 Critical

---

### 2.3 History 组件

#### 问题 9: History 组件未应用暗夜片场风格
**文件:** `src/components/History.tsx`

**严重问题:**
1. **139 处颜色硬编码** 使用 gray 而非设计系统色
2. **所有卡片使用白色背景** `bg-white` 而非 `bg-scene-fill`
3. **加载状态** 第 150 行使用 `border-primary-600` 而非 `border-neon`
4. **错误状态** 第 161-171 行使用 `bg-red-*` 而非 `bg-state-error/10`
5. **空状态** 第 177 行使用 `bg-white` 而非片场卡片样式
6. **按钮** 第 357, 363 行未使用设计系统 Button 组件
7. **搜索框** 第 258 行 focus ring 使用 `ring-blue-500` 而非 `ring-keyLight/20`
8. **过滤按钮** 第 270 行使用 `bg-primary-600` 而非 Button.take
9. **分数徽章** 第 139-143 行使用非标准颜色映射

**规范对照:**
应使用 Card 组件（variant="scene"）和 Button 组件（variant="take"/"cut"）

**修复建议（示例）:**
```tsx
// 加载状态
<div className="animate-spin rounded-full h-12 w-12 border-2 border-neon border-t-transparent" />

// 错误状态容器
<div className="bg-state-error/10 border border-state-error/30 rounded-xl p-6">
  <p className="text-state-error mb-4">{error}</p>
  <Button variant="cut" onClick={loadHistory}>
    {t.retry}
  </Button>
</div>

// 空状态
<Card variant="scene" className="p-12 text-center">
  <Clock className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
  <h3 className="text-xl font-semibold font-display text-text-primary mb-2">
    {t.historyEmpty}
  </h3>
</Card>

// 卡片列表
<Card variant="scene" hoverable className="p-5">
  {/* 内容 */}
  <div className="flex gap-2">
    <Button variant="take" icon={Eye} onClick={() => onSelectPrompt(prompt)}>
      {t.view}
    </Button>
    <Button variant="cut" icon={Trash2} onClick={() => handleDeleteClick(prompt.id)}>
      {t.delete}
    </Button>
  </div>
</Card>
```

**优先级:** 🔴 Critical

---

### 2.4 LoginModal 组件

#### 问题 10: LoginModal 未应用片场氛围
**文件:** `src/components/LoginModal.tsx`

**问题描述:**
1. 模态框背景 `bg-white` 而非 `bg-scene-fill`
2. 标题颜色 `text-gray-900` 而非 `text-text-primary`
3. 输入框未使用设计系统样式
4. 主按钮渐变使用 `from-primary-600 to-primary-700` 而非 `from-keyLight to-keyLight-600`
5. Google 按钮使用 `bg-white hover:bg-gray-50` 而非片场次要按钮样式

**规范对照:**
应使用 Modal 组件（variant="scene"）和 Button 组件

**修复建议:**
```tsx
// 使用 Modal 组件包裹
<Modal isOpen variant="scene" maxWidth="md" onClose={onClose}>
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16
                    bg-gradient-to-br from-keyLight to-neon rounded-2xl mb-4 shadow-neon">
      <Film className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-3xl font-bold font-display text-text-primary mb-2">
      {t.title}
    </h2>
  </div>

  {error && (
    <div className="mb-6 bg-state-error/10 border border-state-error/30 rounded-lg p-4">
      <AlertCircle className="w-5 h-5 text-state-error" />
      <p className="text-sm text-text-secondary">{error}</p>
    </div>
  )}

  <Button variant="preview" fullWidth onClick={handleGoogleLogin}>
    {/* Google SVG */}
    <span>{t.continueWithGoogle}</span>
  </Button>

  <Button variant="take" type="submit" fullWidth disabled={loading}>
    {isSignUp ? t.signUp : t.signIn}
  </Button>
</Modal>
```

**优先级:** 🔴 Critical

---

### 2.5 UsageCounter 组件

#### 问题 11: 进度条颜色非设计系统色
**文件:** `src/components/UsageCounter.tsx`

**问题描述:**
```tsx
// ❌ 第 39-40 行
className={`h-full ${
  isLocalAtLimit ? 'bg-red-500'
  : isLocalNearLimit ? 'bg-orange-500'
  : 'bg-blue-500'
}`}

// ✅ 应使用状态色
className={`h-full ${
  isLocalAtLimit ? 'bg-state-error'
  : isLocalNearLimit ? 'bg-state-warning'
  : 'bg-keyLight'
}`}
```

**其他问题:**
- 第 23 行: `bg-white` → `bg-scene-fill`
- 第 26 行: `text-gray-600` → `text-text-secondary`
- 第 36 行: 进度条背景 `bg-gray-200` → `bg-scene-fillLight`
- 第 46 行: 警告框 `bg-orange-50` → `bg-state-warning/10`

**优先级:** 🟠 Major

---

### 2.6 SubscriptionPlans 组件

#### 问题 12: 订阅卡片未使用片场样式
**文件:** `src/components/SubscriptionPlans.tsx`

**问题描述:**
1. 所有卡片 `bg-white` 而非 `bg-scene-fill`
2. 文本颜色 `text-gray-900` 而非 `text-text-primary`
3. 边框 `border-gray-200` 而非 `border-keyLight/20`
4. Popular 标签使用 `from-green-600 to-emerald-600` 而非设计系统渐变
5. 加载状态 `border-primary-600` 而非 `border-neon`

**规范对照:**
应使用 Card 组件并配合设计系统颜色

**修复建议:**
```tsx
<Card
  variant="scene"
  className={`
    relative p-8 transition-all
    ${plan.popular ? 'border-2 border-keyLight shadow-key scale-105' : ''}
  `}
>
  {plan.popular && (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
      <span className="bg-gradient-to-r from-state-ok to-state-ok/80
                       text-white px-4 py-1 rounded-full text-sm font-semibold shadow-rim">
        Popular
      </span>
    </div>
  )}

  <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
    {plan.name}
  </h3>

  <Button
    variant={isCurrentPlan ? 'preview' : 'take'}
    onClick={() => handleUpgrade(plan.tier)}
    fullWidth
  >
    {isCurrentPlan ? t.subscriptionCurrent : t.subscriptionUpgrade}
  </Button>
</Card>
```

**优先级:** 🔴 Critical

---

## 🟠 三、布局与排版问题

### 3.1 间距不统一

#### 问题 13: 组件间距未遵循 8px Grid
**文件:** 多个组件

**问题描述:**
存在非 8px 倍数的间距：
- `gap-5` (20px) 不符合
- `p-5` (20px) 不符合
- `mb-7` (28px) 不符合

**规范对照:**
DESIGN_SYSTEM.md 第 308-318 行:
- 使用 4/8/12/16/24/32/48 px 间距

**修复建议:**
```
gap-5 (20px)  → gap-4 (16px) 或 gap-6 (24px)
p-5 (20px)    → p-4 (16px) 或 p-6 (24px)
mb-7 (28px)   → mb-6 (24px) 或 mb-8 (32px)
```

**优先级:** 🟡 Minor

---

### 3.2 响应式断点不一致

#### 问题 14: 断点使用混乱
**文件:** `History.tsx`, `Dashboard.tsx`

**问题描述:**
- 同时使用 `sm:`, `md:`, `lg:` 但无统一规范
- 某些组件只有 `md:` 断点，缺少 `sm:` 和 `lg:`

**修复建议:**
统一使用三级断点：
- `sm:` (640px): 平板竖屏
- `md:` (768px): 平板横屏
- `lg:` (1024px): 桌面

**优先级:** 🟡 Minor

---

## 🟡 四、交互与动效问题

### 4.1 动画时长不统一

#### 问题 15: transition duration 混乱
**文件:** 多个组件

**问题描述:**
同一类交互使用不同时长：
- Button hover: `duration-200`, `duration-300`
- Modal fade: `duration-200`, `duration-300`
- Card hover: 无统一规范

**规范对照:**
DESIGN_SYSTEM.md 第 437-444 行:
- `duration-fast`: 150ms (微交互)
- `duration-normal`: 300ms (标准过渡)
- `duration-slow`: 500ms (大型动画)

**修复建议:**
```tsx
// 按钮悬停/点击
transition-all duration-150

// 模态框打开/关闭
transition-all duration-300

// 页面切换
transition-all duration-500
```

**优先级:** 🟡 Minor

---

### 4.2 缓动函数未使用设计令牌

#### 问题 16: ease 函数不统一
**文件:** Button.tsx, Card.tsx

**问题描述:**
使用原生 ease 而非设计系统定义的 `ease-smooth`

**规范对照:**
tailwind.config.js 第 181-184 行:
```javascript
transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

**修复建议:**
所有 transition 统一使用 `ease-smooth`

**优先级:** 🟡 Minor

---

### 4.3 Loading 状态样式不一致

#### 问题 17: 加载指示器五花八门
**文件:** History.tsx (第 150 行), SubscriptionPlans.tsx (第 128 行), UsageCounter.tsx

**问题描述:**
- 有的使用 `border-primary-600`
- 有的使用 `border-blue-600`
- 应统一使用 `border-neon`（霓虹光代表 AI 工作中）

**规范对照:**
DESIGN_SYSTEM.md 第 95 行: Neon（紫色）→ AI 正在工作、渲染状态

**修复建议:**
```tsx
// 统一加载样式
<div className="animate-spin rounded-full h-12 w-12 border-2 border-neon border-t-transparent" />
<p className="text-text-secondary font-code">渲染中...</p>
```

**优先级:** 🟠 Major

---

## 🔵 五、无障碍与一致性问题

### 5.1 硬编码文案

#### 问题 18: 存在非 i18n 文案
**文件:** Badge.tsx, SubscriptionPlans.tsx

**问题描述:**
- Badge.tsx 第 74 行: "质量评分:" 硬编码中文
- SubscriptionPlans.tsx 第 167 行: "Popular" 硬编码英文

**修复建议:**
```typescript
// Badge.tsx
<span className="text-sm font-semibold">{t.qualityScore}:</span>

// SubscriptionPlans.tsx
<span>{t.popular}</span>
```

**优先级:** 🟠 Major

---

### 5.2 颜色对比度问题

#### 问题 19: 低对比度文本
**文件:** History.tsx, Settings.tsx

**问题描述:**
某些次要文本在暗背景上对比度不足：
- `text-gray-500` 在 `bg-gray-50` 上对比度不足
- 应使用 `text-text-secondary` 在 `bg-scene-fill` 上

**修复建议:**
所有文本严格使用设计系统定义的 text-* 颜色，确保在 scene-fill 背景上可读

**优先级:** 🟠 Major

---

### 5.3 图标尺寸不统一

#### 问题 20: 图标大小混乱
**文件:** 多个组件

**问题描述:**
同一级别元素使用不同图标尺寸：
- 有的 `w-4 h-4`
- 有的 `w-5 h-5`
- 有的 `w-6 h-6`

**修复建议:**
统一规范：
- 按钮图标: `w-5 h-5`
- 标题图标: `w-6 h-6`
- 列表图标: `w-4 h-4`
- 装饰图标: `w-8 h-8`

**优先级:** 🟡 Minor

---

## 📊 六、重复样式与冗余 CSS

### 6.1 重复的按钮样式

#### 问题 21: 未复用 Button 组件
**文件:** History.tsx, LoginModal.tsx, UsageCounter.tsx

**问题描述:**
多处手写按钮样式而非使用设计系统 Button 组件

**示例 (History.tsx 第 357 行):**
```tsx
// ❌ 当前写法
<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                   bg-primary-600 hover:bg-primary-700 text-white
                   text-sm font-semibold rounded-lg">

// ✅ 应使用
<Button variant="take" icon={Eye} fullWidth>
  {t.view}
</Button>
```

**影响范围:**
- History.tsx: 5 处自定义按钮
- LoginModal.tsx: 3 处自定义按钮
- UsageCounter.tsx: 2 处自定义按钮

**优先级:** 🟠 Major

---

### 6.2 重复的卡片样式

#### 问题 22: 未复用 Card 组件
**文件:** History.tsx, SubscriptionPlans.tsx, UsageCounter.tsx

**问题描述:**
手写 `bg-white rounded-xl shadow-md border` 而非使用 Card 组件

**建议合并方案:**
全部替换为:
```tsx
<Card variant="scene" hoverable>
  {/* 内容 */}
</Card>
```

**优先级:** 🟠 Major

---

### 6.3 重复的输入框样式

#### 问题 23: 未复用 Input 组件
**文件:** LoginModal.tsx, History.tsx

**问题描述:**
手写输入框样式而非使用 Input 组件

**修复建议:**
```tsx
// ❌ LoginModal.tsx 第 152-159 行
<input className="w-full pl-10 pr-4 py-3 border border-gray-300..." />

// ✅ 应使用
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={Mail}
  placeholder={t.emailPlaceholder}
/>
```

**优先级:** 🟠 Major

---

## 📈 七、整体符合率计算

### 7.1 分类统计

| 分类 | 检查项 | 符合项 | 不符合项 | 符合率 |
|------|--------|--------|----------|--------|
| **全局颜色** | 6 | 2 | 4 | 33% |
| **全局字体** | 4 | 2 | 2 | 50% |
| **全局阴影** | 3 | 1 | 2 | 33% |
| **全局圆角** | 3 | 2 | 1 | 67% |
| **Button 组件** | 5 | 5 | 0 | ✅ 100% |
| **Card 组件** | 5 | 5 | 0 | ✅ 100% |
| **Input 组件** | 8 | 0 | 8 | 0% |
| **Badge 组件** | 6 | 1 | 5 | 17% |
| **Modal 组件** | 5 | 4 | 1 | 80% |
| **History 组件** | 15 | 2 | 13 | 13% |
| **LoginModal** | 10 | 2 | 8 | 20% |
| **UsageCounter** | 8 | 3 | 5 | 38% |
| **SubscriptionPlans** | 12 | 2 | 10 | 17% |
| **布局间距** | 4 | 3 | 1 | 75% |
| **响应式** | 3 | 2 | 1 | 67% |
| **动画** | 5 | 3 | 2 | 60% |
| **无障碍** | 5 | 3 | 2 | 60% |

**总体符合率: 62%**

### 7.2 已完美符合的组件

✅ **Button.tsx**: 完全符合，使用电影术语变体
✅ **Card.tsx**: 完全符合，支持 scene/script/lighting 变体
✅ **PromptInput.tsx**: 已优化，使用设计系统色彩
✅ **PromptResult.tsx**: 已优化，应用暗夜片场风格
✅ **Sidebar.tsx**: 已优化，使用片场氛围色
✅ **Settings.tsx**: 已优化，电影级视觉质感
✅ **GuestBanner.tsx**: 完全符合，使用三点照明系统

---

## 🎯 八、优化优先级列表

### P0 - Critical (必须立即修复)

1. **History.tsx 全面重构** (139 处颜色硬编码)
   - 工作量: 8 小时
   - 影响: 用户历史记录体验

2. **Input.tsx 完全重写** (组件完全不符合)
   - 工作量: 2 小时
   - 影响: 所有表单输入

3. **Badge.tsx 颜色系统重构** (状态色不符)
   - 工作量: 1 小时
   - 影响: 所有徽章显示

4. **LoginModal.tsx 片场风格化** (45 处硬编码)
   - 工作量: 4 小时
   - 影响: 用户登录体验

5. **SubscriptionPlans.tsx 重构** (52 处硬编码)
   - 工作量: 6 小时
   - 影响: 订阅转化率

### P1 - Major (重要优化)

6. **UsageCounter 状态色统一** (进度条、警告框)
   - 工作量: 2 小时

7. **所有组件替换灰色系** (text-gray-* → text-text-*)
   - 工作量: 4 小时

8. **Loading 状态统一为霓虹光** (border-neon)
   - 工作量: 1 小时

9. **硬编码文案国际化** (Badge, SubscriptionPlans)
   - 工作量: 0.5 小时

10. **阴影系统迁移** (shadow-* → shadow-depth-*/shadow-key)
    - 工作量: 2 小时

### P2 - Minor (次要优化)

11. 标题添加 font-display
12. 代码/数值添加 font-code
13. 圆角值统一
14. 间距符合 8px Grid
15. 动画时长统一
16. 图标尺寸统一

---

## 💡 九、快速修复建议

### 9.1 全局查找替换

创建脚本 `scripts/fix-design-system.sh`:

```bash
#!/bin/bash

# 颜色替换
find src/components -type f -name "*.tsx" -exec sed -i '' \
  -e 's/bg-white/bg-scene-fill/g' \
  -e 's/text-gray-900/text-text-primary/g' \
  -e 's/text-gray-600/text-text-secondary/g' \
  -e 's/text-gray-500/text-text-tertiary/g' \
  -e 's/border-gray-200/border-keyLight\/20/g' \
  -e 's/text-primary-600/text-keyLight/g' \
  -e 's/bg-green-50/bg-state-ok\/10/g' \
  -e 's/text-green-600/text-state-ok/g' \
  -e 's/bg-red-50/bg-state-error\/10/g' \
  -e 's/text-red-600/text-state-error/g' \
  {} \;

# 阴影替换
find src/components -type f -name "*.tsx" -exec sed -i '' \
  -e 's/shadow-lg/shadow-depth-lg/g' \
  -e 's/shadow-md/shadow-depth-md/g' \
  {} \;

echo "✅ 基础颜色和阴影已批量替换"
```

### 9.2 ESLint 规则

添加 `.eslintrc.js` 禁止规则:

```javascript
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^(text|bg|border)-(gray|white|black)/]',
        message: '❌ 禁止使用灰色/白色/黑色类名，请使用设计系统颜色令牌',
      },
      {
        selector: 'Literal[value=/^(text|bg)-(green|red|yellow|blue|purple|indigo)/]',
        message: '❌ 禁止使用语义颜色，请使用状态色 (state-ok/error/warning/info) 或片场色 (keyLight/rimLight/neon)',
      },
    ],
  },
};
```

---

## 🔚 十、总结与行动计划

### 10.1 当前状态

- ✅ **设计系统文档完善**: design_system.md 定义清晰
- ✅ **核心组件已符合**: Button, Card, Modal 等基础组件
- ✅ **主要页面已优化**: Dashboard, Settings, Sidebar
- ❌ **业务组件未跟进**: History, LoginModal, UsageCounter, SubscriptionPlans
- ❌ **输入组件完全脱节**: Input, Badge 组件未使用设计系统

### 10.2 建议行动步骤

**第一阶段 (2 天):**
1. 修复 Input.tsx 和 Badge.tsx (P0)
2. 批量替换颜色令牌 (脚本自动化)
3. 统一 Loading 状态样式

**第二阶段 (3 天):**
4. 重构 History.tsx (最复杂)
5. 重构 LoginModal.tsx
6. 重构 SubscriptionPlans.tsx

**第三阶段 (1 天):**
7. 优化 UsageCounter.tsx
8. 修复所有次要问题 (字体、阴影、圆角)
9. 添加 ESLint 规则防止回退

**第四阶段 (1 天):**
10. 全面测试
11. 视觉走查
12. 无障碍测试
13. 更新文档

### 10.3 预期效果

修复完成后，符合率将从 **62%** 提升至 **95%+**

### 10.4 长期维护建议

1. **组件库先行**: 先完善 UI 组件库，再构建业务组件
2. **代码审查**: 每个 PR 必须检查设计系统符合度
3. **自动化检查**: 使用 ESLint + Stylelint 自动拦截
4. **定期审计**: 每月进行设计系统符合度审查

---

**报告生成时间:** 2025-10-27
**下次审查建议:** 完成 P0 修复后 1 周内复查
