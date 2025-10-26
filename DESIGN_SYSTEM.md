# 🎨 Sora Prompt Studio 设计系统

> **版本：** v1.0.0
> **最后更新：** 2025-10-26

---

## 📋 目录

1. [设计原则](#设计原则)
2. [品牌基础](#品牌基础)
3. [颜色系统](#颜色系统)
4. [字体系统](#字体系统)
5. [间距系统](#间距系统)
6. [组件规范](#组件规范)
7. [动画与交互](#动画与交互)
8. [响应式规范](#响应式规范)

---

## 🎯 设计原则

### 1. 专业而友好
- 保持专业的视觉呈现
- 降低使用门槛，友好引导
- 避免过度装饰

### 2. 清晰的视觉层次
- 主次分明的信息架构
- 合理的留白和间距
- 一致的视觉节奏

### 3. 响应式优先
- 移动端友好
- 优雅的断点过渡
- 适配不同屏幕尺寸

### 4. 高性能
- 流畅的动画（60fps）
- 快速的交互反馈
- 合理的加载状态

---

## 🎨 品牌基础

### 品牌定位
**Sora Prompt Studio** - 专业的 AI 视频提示词创作工具

### 品牌关键词
- 🎬 电影感（Cinematic）
- ⚡ 智能（Intelligent）
- 🎨 创意（Creative）
- 🚀 高效（Efficient）

### 视觉风格
- **现代简约**：干净的界面，专注内容
- **轻微渐变**：增加视觉深度
- **圆角设计**：友好亲和
- **微妙阴影**：层次感

---

## 🌈 颜色系统

### 主色调（Primary）
品牌主色 - 蓝色系（代表智能、专业、科技）

```css
primary-50:   #EFF6FF   /* 极浅蓝 - 背景 */
primary-100:  #DBEAFE   /* 浅蓝 - 次级背景 */
primary-200:  #BFDBFE   /* 中浅蓝 */
primary-300:  #93C5FD   /* 中蓝 */
primary-400:  #60A5FA   /* 标准蓝 */
primary-500:  #3B82F6   /* 主蓝 - 主按钮 */
primary-600:  #2563EB   /* 深蓝 - 悬停 */
primary-700:  #1D4ED8   /* 更深蓝 - 激活 */
primary-800:  #1E40AF   /* 极深蓝 */
primary-900:  #1E3A8A   /* 最深蓝 */
```

### 辅助色调（Secondary）
电影感 - 紫色系（代表创意、艺术）

```css
secondary-50:   #FAF5FF   /* 极浅紫 */
secondary-100:  #F3E8FF   /* 浅紫 */
secondary-200:  #E9D5FF   /* 中浅紫 */
secondary-300:  #D8B4FE   /* 中紫 */
secondary-400:  #C084FC   /* 标准紫 */
secondary-500:  #A855F7   /* 主紫 - 强调色 */
secondary-600:  #9333EA   /* 深紫 */
secondary-700:  #7E22CE   /* 更深紫 */
secondary-800:  #6B21A8   /* 极深紫 */
secondary-900:  #581C87   /* 最深紫 */
```

### 中性色调（Neutral）
界面基础色 - 灰色系

```css
gray-50:   #F9FAFB   /* 背景 */
gray-100:  #F3F4F6   /* 次级背景 */
gray-200:  #E5E7EB   /* 边框 */
gray-300:  #D1D5DB   /* 分割线 */
gray-400:  #9CA3AF   /* 禁用文本 */
gray-500:  #6B7280   /* 次要文本 */
gray-600:  #4B5563   /* 正文 */
gray-700:  #374151   /* 小标题 */
gray-800:  #1F2937   /* 标题 */
gray-900:  #111827   /* 主标题 */
```

### 语义色（Semantic Colors）

#### 成功（Success）
```css
success-50:   #F0FDF4   /* 浅绿背景 */
success-500:  #10B981   /* 标准绿 */
success-600:  #059669   /* 深绿 */
```

#### 警告（Warning）
```css
warning-50:   #FFFBEB   /* 浅黄背景 */
warning-500:  #F59E0B   /* 标准黄 */
warning-600:  #D97706   /* 深黄 */
```

#### 错误（Error）
```css
error-50:   #FEF2F2   /* 浅红背景 */
error-500:  #EF4444   /* 标准红 */
error-600:  #DC2626   /* 深红 */
```

#### 信息（Info）
```css
info-50:   #EFF6FF   /* 浅蓝背景 */
info-500:  #3B82F6   /* 标准蓝 */
info-600:  #2563EB   /* 深蓝 */
```

### 渐变色（Gradients）

```css
gradient-primary:   linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)
gradient-secondary: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)
gradient-mixed:     linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)
gradient-bg:        linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 50%, #FAF5FF 100%)
```

---

## 📝 字体系统

### 字体族（Font Family）

#### 主字体
```css
font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
           "Helvetica Neue", Arial, sans-serif
```

#### 等宽字体（代码）
```css
font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
           Consolas, monospace
```

### 字体大小（Font Size）

| 名称 | 尺寸 | 行高 | 用途 |
|------|------|------|------|
| `text-xs` | 12px (0.75rem) | 16px (1rem) | 辅助信息、标签 |
| `text-sm` | 14px (0.875rem) | 20px (1.25rem) | 次要文本、按钮 |
| `text-base` | 16px (1rem) | 24px (1.5rem) | 正文 |
| `text-lg` | 18px (1.125rem) | 28px (1.75rem) | 小标题 |
| `text-xl` | 20px (1.25rem) | 28px (1.75rem) | 卡片标题 |
| `text-2xl` | 24px (1.5rem) | 32px (2rem) | 页面副标题 |
| `text-3xl` | 30px (1.875rem) | 36px (2.25rem) | 页面标题 |
| `text-4xl` | 36px (2.25rem) | 40px (2.5rem) | 主标题 |
| `text-5xl` | 48px (3rem) | 1 | Hero 标题 |
| `text-6xl` | 60px (3.75rem) | 1 | 特大标题 |

### 字重（Font Weight）

```css
font-normal:    400   /* 正文 */
font-medium:    500   /* 次要强调 */
font-semibold:  600   /* 小标题、按钮 */
font-bold:      700   /* 标题 */
```

### 行高（Line Height）

```css
leading-tight:   1.25   /* 标题 */
leading-snug:    1.375  /* 小标题 */
leading-normal:  1.5    /* 正文 */
leading-relaxed: 1.625  /* 长文本 */
leading-loose:   2      /* 特殊用途 */
```

---

## 📏 间距系统

采用 **8px 基准栅格系统**（8pt Grid）

### 间距尺度（Spacing Scale）

| Token | 值 | 用途 |
|-------|-----|------|
| `spacing-0` | 0px | 无间距 |
| `spacing-1` | 4px | 极小间距 |
| `spacing-2` | 8px | 小间距 |
| `spacing-3` | 12px | 中小间距 |
| `spacing-4` | 16px | 标准间距 |
| `spacing-5` | 20px | 中间距 |
| `spacing-6` | 24px | 中大间距 |
| `spacing-8` | 32px | 大间距 |
| `spacing-10` | 40px | 更大间距 |
| `spacing-12` | 48px | 超大间距 |
| `spacing-16` | 64px | 区块间距 |
| `spacing-20` | 80px | 页面间距 |
| `spacing-24` | 96px | 特大间距 |

### 间距使用指南

#### 组件内部间距（Padding）
- **按钮内边距：** `px-4 py-2`（16px × 8px）或 `px-6 py-3`（24px × 12px）
- **卡片内边距：** `p-4`（16px）或 `p-6`（24px）
- **输入框内边距：** `px-4 py-2.5`（16px × 10px）

#### 组件之间间距（Margin/Gap）
- **表单项间距：** `space-y-4`（16px）
- **卡片间距：** `gap-4`（16px）或 `gap-6`（24px）
- **区块间距：** `space-y-8`（32px）或 `space-y-12`（48px）

---

## 🧩 组件规范

### 按钮（Buttons）

#### 主要按钮（Primary Button）
```tsx
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                   text-white font-semibold rounded-lg shadow-md
                   hover:shadow-lg transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed">
  按钮文字
</button>
```

**规格：**
- 高度：44px（移动端）/ 40px（桌面端）
- 最小宽度：88px
- 圆角：8px（`rounded-lg`）
- 阴影：中等（`shadow-md`）
- 悬停：加深颜色 + 增强阴影

#### 次要按钮（Secondary Button）
```tsx
<button className="px-6 py-3 bg-white border-2 border-gray-300
                   hover:border-gray-400 hover:bg-gray-50
                   text-gray-700 font-semibold rounded-lg
                   transition-all duration-200">
  按钮文字
</button>
```

#### 幽灵按钮（Ghost Button）
```tsx
<button className="px-4 py-2 text-blue-600 hover:bg-blue-50
                   font-semibold rounded-lg transition-all duration-200">
  按钮文字
</button>
```

#### 按钮尺寸变体

| 尺寸 | 类名 | 高度 | 内边距 |
|------|------|------|--------|
| 小 | `px-3 py-1.5 text-sm` | 32px | 12px × 6px |
| 中 | `px-4 py-2 text-sm` | 36px | 16px × 8px |
| 大 | `px-6 py-3 text-base` | 44px | 24px × 12px |
| 超大 | `px-8 py-4 text-lg` | 56px | 32px × 16px |

---

### 输入框（Input Fields）

#### 标准输入框
```tsx
<input className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent placeholder:text-gray-400
                  transition-all duration-200"
       type="text"
       placeholder="请输入..." />
```

**规格：**
- 高度：44px
- 边框：1px，灰色（`border-gray-300`）
- 圆角：8px
- 聚焦：2px 蓝色描边（`focus:ring-2 focus:ring-blue-500`）

#### 文本域（Textarea）
```tsx
<textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent placeholder:text-gray-400
                     resize-none transition-all duration-200"
          rows={4}
          placeholder="请输入..."></textarea>
```

---

### 卡片（Cards）

#### 标准卡片
```tsx
<div className="bg-white rounded-2xl shadow-lg border border-gray-200
                overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <div className="p-6">
    卡片内容
  </div>
</div>
```

**规格：**
- 圆角：16px（`rounded-2xl`）
- 阴影：大（`shadow-lg`）
- 边框：1px 灰色
- 内边距：24px（`p-6`）
- 悬停：增强阴影

#### 交互卡片（可点击）
```tsx
<div className="bg-white rounded-xl shadow-md border border-gray-200
                cursor-pointer hover:shadow-lg hover:border-blue-300
                transition-all duration-200 active:scale-[0.98]">
  <div className="p-4">
    卡片内容
  </div>
</div>
```

---

### 标签（Badges/Tags）

#### 状态标签
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-medium bg-blue-100 text-blue-700">
  标签文字
</span>
```

**颜色变体：**
- 蓝色：`bg-blue-100 text-blue-700`（信息）
- 绿色：`bg-green-100 text-green-700`（成功）
- 黄色：`bg-yellow-100 text-yellow-700`（警告）
- 红色：`bg-red-100 text-red-700`（错误）
- 灰色：`bg-gray-100 text-gray-700`（中性）
- 紫色：`bg-purple-100 text-purple-700`（特殊）

---

### 模态框（Modal）

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center
                bg-black bg-opacity-50 backdrop-blur-sm
                animate-in fade-in duration-200">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4
                  animate-in zoom-in-95 duration-200">
    <div className="p-6">
      模态框内容
    </div>
  </div>
</div>
```

**规格：**
- 遮罩：50% 不透明黑色 + 毛玻璃效果
- 圆角：16px
- 最大宽度：448px（`max-w-md`）
- 动画：淡入 + 缩放

---

## ⚡ 动画与交互

### 过渡时长（Transition Duration）

```css
duration-75:   75ms     /* 极快 - 微交互 */
duration-100:  100ms    /* 很快 - 悬停 */
duration-150:  150ms    /* 快 - 按钮 */
duration-200:  200ms    /* 标准 - 默认 */
duration-300:  300ms    /* 中等 - 卡片 */
duration-500:  500ms    /* 慢 - 模态框 */
duration-700:  700ms    /* 很慢 - 页面切换 */
```

### 缓动函数（Easing）

```css
ease-linear:     cubic-bezier(0, 0, 1, 1)         /* 线性 */
ease-in:         cubic-bezier(0.4, 0, 1, 1)       /* 渐快 */
ease-out:        cubic-bezier(0, 0, 0.2, 1)       /* 渐慢 - 推荐 */
ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1)     /* 中间快 */
```

### 常用交互效果

#### 悬停效果（Hover）
```css
/* 颜色变化 */
hover:bg-blue-700
hover:text-white

/* 阴影增强 */
hover:shadow-lg

/* 轻微上移 */
hover:-translate-y-0.5

/* 缩放 */
hover:scale-105
```

#### 激活效果（Active）
```css
/* 按下缩放 */
active:scale-[0.98]

/* 颜色加深 */
active:bg-blue-800
```

#### 聚焦效果（Focus）
```css
/* 描边 */
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2

/* 移除默认边框 */
focus:outline-none focus:border-transparent
```

---

## 📱 响应式规范

### 断点（Breakpoints）

```css
sm:  640px    /* 小屏幕（手机横屏） */
md:  768px    /* 中等屏幕（平板） */
lg:  1024px   /* 大屏幕（桌面） */
xl:  1280px   /* 超大屏幕 */
2xl: 1536px   /* 超宽屏幕 */
```

### 响应式策略

#### 移动优先（Mobile First）
```tsx
<div className="text-sm md:text-base lg:text-lg">
  文字会随屏幕增大
</div>
```

#### 容器最大宽度

```css
max-w-sm:    640px    /* 小容器 */
max-w-md:    768px    /* 中等容器 */
max-w-lg:    1024px   /* 大容器 */
max-w-xl:    1280px   /* 超大容器 */
max-w-2xl:   1536px   /* 超宽容器 */
max-w-5xl:   1024px   /* 设置页面 */
max-w-7xl:   1280px   /* 主内容区 */
```

#### 侧边栏响应式
```tsx
<aside className="fixed inset-y-0 left-0 w-64 bg-white
                  transform -translate-x-full lg:translate-x-0
                  transition-transform duration-300">
  侧边栏内容
</aside>
```

---

## 🎯 无障碍规范（Accessibility）

### 颜色对比度
- **正文：** 最小对比度 4.5:1
- **大号文字：** 最小对比度 3:1
- **图标：** 最小对比度 3:1

### 焦点可见性
- 所有可交互元素必须有明显的 `:focus` 状态
- 使用 `focus:ring` 提供视觉反馈

### 语义化 HTML
- 使用正确的 HTML5 标签（`<button>`, `<nav>`, `<main>`, `<article>`）
- 为图标添加 `aria-label`
- 为表单添加 `<label>`

---

## 📦 实施指南

### 1. Tailwind 配置更新
在 `tailwind.config.js` 中定义自定义颜色、间距等。

### 2. 创建基础组件库
- 按钮组件（Button.tsx）
- 输入框组件（Input.tsx）
- 卡片组件（Card.tsx）
- 模态框组件（Modal.tsx）

### 3. 文档维护
- 保持设计系统文档更新
- 记录新增的组件和模式
- 定期审查和优化

---

## 🔄 版本历史

### v1.0.0 (2025-10-26)
- ✅ 初始版本发布
- ✅ 定义品牌色彩系统
- ✅ 确立字体和间距规范
- ✅ 创建组件设计指南

---

**设计系统维护者：** Sora Prompt Studio Team
**反馈渠道：** GitHub Issues
