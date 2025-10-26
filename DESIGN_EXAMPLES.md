# 🎨 设计系统使用示例

本文档展示如何在 Sora Prompt Studio 中使用设计系统。

---

## 📋 目录

1. [按钮示例](#按钮示例)
2. [输入框示例](#输入框示例)
3. [卡片示例](#卡片示例)
4. [标签示例](#标签示例)
5. [布局示例](#布局示例)
6. [颜色使用示例](#颜色使用示例)

---

## 🔘 按钮示例

### 主要按钮（Primary Button）

**使用场景：** 主要操作、提交表单、确认动作

```tsx
// 标准主按钮
<button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                   text-white font-semibold rounded-lg shadow-md
                   hover:shadow-lg transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed">
  快速生成
</button>

// 带图标的主按钮
<button className="inline-flex items-center gap-2 px-6 py-3
                   bg-primary-600 hover:bg-primary-700
                   text-white font-semibold rounded-lg shadow-md
                   hover:shadow-lg transition-all duration-200">
  <Sparkles className="w-5 h-5" />
  快速生成
</button>

// 加载状态
<button className="inline-flex items-center gap-2 px-6 py-3
                   bg-primary-600 text-white font-semibold rounded-lg
                   opacity-75 cursor-not-allowed"
        disabled>
  <RefreshCw className="w-5 h-5 animate-spin" />
  生成中...
</button>
```

### 次要按钮（Secondary Button）

**使用场景：** 辅助操作、取消、返回

```tsx
<button className="px-6 py-3 bg-white border-2 border-gray-300
                   hover:border-gray-400 hover:bg-gray-50
                   text-gray-700 font-semibold rounded-lg
                   transition-all duration-200">
  取消
</button>
```

### 幽灵按钮（Ghost Button）

**使用场景：** 低优先级操作、链接式操作

```tsx
<button className="px-4 py-2 text-primary-600 hover:bg-primary-50
                   font-semibold rounded-lg transition-all duration-200">
  了解更多
</button>
```

### 导演模式按钮（特殊风格）

```tsx
<button className="inline-flex items-center gap-2 px-6 py-3
                   bg-gradient-to-r from-secondary-600 to-secondary-700
                   hover:from-secondary-700 hover:to-secondary-800
                   text-white font-semibold rounded-lg shadow-md
                   hover:shadow-glow-purple transition-all duration-200">
  <Film className="w-5 h-5" />
  导演模式
</button>
```

---

## 📝 输入框示例

### 标准文本输入框

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    你的创意想法
  </label>
  <input
    type="text"
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-primary-500
               focus:border-transparent placeholder:text-gray-400
               transition-all duration-200"
    placeholder="例如：一个孤独的男人在电脑前开发软件"
  />
  <p className="text-xs text-gray-500">
    描述你想要的场景、主题或氛围
  </p>
</div>
```

### 文本域（Textarea）

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    详细描述
  </label>
  <textarea
    className="w-full px-4 py-3 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-primary-500
               focus:border-transparent placeholder:text-gray-400
               resize-none transition-all duration-200"
    rows={4}
    placeholder="输入更详细的场景描述..."
  />
</div>
```

### 错误状态输入框

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    电子邮件
  </label>
  <input
    type="email"
    className="w-full px-4 py-2.5 border-2 border-red-500 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-red-500
               focus:border-transparent placeholder:text-gray-400
               transition-all duration-200"
    placeholder="your@email.com"
  />
  <p className="text-xs text-red-600 flex items-center gap-1">
    <AlertCircle className="w-4 h-4" />
    请输入有效的电子邮件地址
  </p>
</div>
```

---

## 🃏 卡片示例

### 标准内容卡片

```tsx
<div className="bg-white rounded-2xl shadow-lg border border-gray-200
                overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      卡片标题
    </h3>
    <p className="text-gray-600 mb-4">
      卡片的描述内容放在这里。可以包含多行文本。
    </p>
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg
                         hover:bg-primary-700 transition-colors">
        主要操作
      </button>
      <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg
                         transition-colors">
        次要操作
      </button>
    </div>
  </div>
</div>
```

### 历史记录卡片

```tsx
<div className="bg-white rounded-xl shadow-md border border-gray-200
                hover:shadow-lg hover:border-primary-300
                transition-all duration-200 cursor-pointer
                group active:scale-[0.99]">
  <div className="p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="text-base font-semibold text-gray-900 mb-1
                       group-hover:text-primary-600 transition-colors">
          一个孤独的男人在电脑前开发软件
        </h4>
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          Oct 26, 2025, 05:52 PM
          <span className="inline-flex items-center px-2 py-0.5 rounded
                           bg-primary-100 text-primary-700 text-xs font-medium">
            快速模式
          </span>
        </p>
      </div>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full
                       bg-green-100 text-green-700 text-xs font-semibold">
        88
      </span>
    </div>

    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
      中景镜头捕捉一个男人在电脑前的工作桌，柔和不刺眼的灯光在晚上营造出舒适氛围...
    </p>

    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
      <button className="flex-1 inline-flex items-center justify-center gap-2
                         px-4 py-2 bg-primary-600 text-white rounded-lg
                         hover:bg-primary-700 transition-colors text-sm font-medium">
        <Eye className="w-4 h-4" />
        查看
      </button>
      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg
                         transition-colors text-sm font-medium">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
```

### 特性卡片（Feature Card）

```tsx
<div className="bg-gradient-to-br from-primary-50 to-secondary-50
                rounded-2xl border border-primary-200 p-6
                hover:shadow-medium transition-shadow duration-300">
  <div className="w-12 h-12 bg-primary-600 rounded-xl
                  flex items-center justify-center mb-4">
    <Sparkles className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-lg font-bold text-gray-900 mb-2">
    智能生成
  </h3>
  <p className="text-gray-600 text-sm">
    AI 驱动的提示词优化，让你的创意更具电影感
  </p>
</div>
```

---

## 🏷️ 标签示例

### 状态标签（Status Badges）

```tsx
{/* 信息 */}
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-medium bg-primary-100 text-primary-700">
  快速模式
</span>

{/* 成功 */}
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                 text-xs font-medium bg-green-100 text-green-700">
  <Check className="w-3 h-3" />
  已保存
</span>

{/* 警告 */}
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-medium bg-yellow-100 text-yellow-700">
  待处理
</span>

{/* 错误 */}
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-medium bg-red-100 text-red-700">
  生成失败
</span>

{/* 导演模式 */}
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                 text-xs font-medium bg-gradient-to-r from-secondary-100 to-secondary-200
                 text-secondary-700">
  <Film className="w-3 h-3" />
  导演模式
</span>
```

### 质量评分标签

```tsx
{/* 高分（90+）*/}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-green-50 border border-green-200">
  <span className="text-sm font-semibold text-green-700">质量评分:</span>
  <span className="text-sm font-bold text-green-800">95 / 100</span>
</div>

{/* 中高分（75-89）*/}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-blue-50 border border-blue-200">
  <span className="text-sm font-semibold text-blue-700">质量评分:</span>
  <span className="text-sm font-bold text-blue-800">82 / 100</span>
</div>

{/* 中等分（60-74）*/}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-yellow-50 border border-yellow-200">
  <span className="text-sm font-semibold text-yellow-700">质量评分:</span>
  <span className="text-sm font-bold text-yellow-800">68 / 100</span>
</div>
```

---

## 📐 布局示例

### 两栏布局

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* 左栏 */}
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900">输入</h2>
    {/* 输入内容 */}
  </div>

  {/* 右栏 */}
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-900">输出</h2>
    {/* 输出内容 */}
  </div>
</div>
```

### 三栏特性展示

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature) => (
    <div key={feature.id} className="bg-white rounded-2xl p-6
                                     border border-gray-200
                                     hover:shadow-medium transition-shadow">
      {/* 特性卡片内容 */}
    </div>
  ))}
</div>
```

### 页面容器

```tsx
<main className="flex-1 p-6 md:p-8 lg:p-12">
  <div className="max-w-7xl mx-auto">
    {/* 页面内容 */}
  </div>
</main>
```

---

## 🎨 颜色使用示例

### 主色调使用（蓝色）

```tsx
{/* 背景 */}
<div className="bg-primary-50">极浅蓝背景</div>
<div className="bg-primary-100">浅蓝背景</div>

{/* 边框 */}
<div className="border border-primary-300">蓝色边框</div>

{/* 文本 */}
<p className="text-primary-600">蓝色文本（标准）</p>
<p className="text-primary-700">深蓝色文本</p>

{/* 按钮 */}
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  主按钮
</button>
```

### 辅助色使用（紫色）

```tsx
{/* 导演模式强调 */}
<div className="bg-gradient-to-r from-secondary-600 to-secondary-700">
  导演模式按钮
</div>

{/* 特殊标签 */}
<span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full">
  电影级
</span>

{/* 装饰性渐变 */}
<div className="bg-gradient-to-br from-primary-50 via-blue-50 to-secondary-50">
  背景渐变
</div>
```

### 中性色使用（灰色）

```tsx
{/* 卡片背景 */}
<div className="bg-white">白色卡片</div>
<div className="bg-gray-50">浅灰背景</div>

{/* 文本层次 */}
<h1 className="text-gray-900">主标题（最深）</h1>
<h2 className="text-gray-800">次标题</h2>
<p className="text-gray-700">正文</p>
<p className="text-gray-600">次要文本</p>
<p className="text-gray-500">辅助文本</p>
<p className="text-gray-400">禁用文本</p>

{/* 边框 */}
<div className="border border-gray-200">浅灰边框（卡片）</div>
<div className="border border-gray-300">标准灰边框（输入框）</div>
```

---

## 🎭 渐变与阴影

### 背景渐变

```tsx
{/* 页面背景 */}
<div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
  页面背景渐变
</div>

{/* 卡片渐变 */}
<div className="bg-gradient-to-r from-primary-500 to-primary-600">
  主色渐变卡片
</div>

{/* 文字渐变（需要额外CSS）*/}
<h1 className="text-transparent bg-clip-text
               bg-gradient-to-r from-primary-600 to-secondary-600">
  渐变文字
</h1>
```

### 阴影使用

```tsx
{/* 轻微阴影 - 用于悬浮元素 */}
<div className="shadow-soft">轻柔阴影</div>

{/* 标准阴影 - 用于卡片 */}
<div className="shadow-md">标准阴影</div>
<div className="shadow-lg">大阴影</div>

{/* 强烈阴影 - 用于模态框 */}
<div className="shadow-strong">强烈阴影</div>
<div className="shadow-2xl">超大阴影</div>

{/* 光晕效果 - 用于特殊元素 */}
<button className="shadow-glow-blue hover:shadow-glow-blue">
  蓝色光晕按钮
</button>
<button className="shadow-glow-purple hover:shadow-glow-purple">
  紫色光晕按钮
</button>
```

---

## 🎬 动画示例

### 淡入动画

```tsx
<div className="animate-fade-in">
  淡入元素
</div>
```

### 滑入动画

```tsx
{/* 从下往上滑入 */}
<div className="animate-slide-up">
  向上滑入
</div>

{/* 从上往下滑入 */}
<div className="animate-slide-down">
  向下滑入
</div>
```

### 缩放动画

```tsx
<div className="animate-scale-in">
  缩放进入
</div>
```

### 悬停动画

```tsx
{/* 上移效果 */}
<button className="transition-transform duration-200 hover:-translate-y-1">
  悬停上移
</button>

{/* 缩放效果 */}
<button className="transition-transform duration-200 hover:scale-105">
  悬停放大
</button>

{/* 按下缩小 */}
<button className="transition-transform duration-100 active:scale-95">
  点击缩小
</button>
```

---

## 💡 最佳实践

### ✅ 推荐做法

1. **使用设计系统定义的颜色**
```tsx
✅ <button className="bg-primary-600 text-white">按钮</button>
❌ <button className="bg-blue-500 text-white">按钮</button>
```

2. **保持一致的间距**
```tsx
✅ <div className="space-y-4">      // 使用 4 的倍数
✅ <div className="gap-6">
❌ <div className="space-y-3">      // 避免奇数
```

3. **使用语义化的组件类**
```tsx
✅ <button className="px-6 py-3 rounded-lg">
❌ <button className="px-5 py-2.5 rounded-md">
```

4. **添加过渡效果**
```tsx
✅ <button className="transition-all duration-200 hover:bg-primary-700">
❌ <button className="hover:bg-primary-700">  // 没有过渡
```

### ⚠️ 注意事项

- 不要混用不同的设计模式
- 保持颜色使用的一致性
- 注意移动端的触摸目标大小（最小 44×44px）
- 确保足够的颜色对比度（WCAG AA 标准）

---

**文档维护者：** Sora Prompt Studio Team
**最后更新：** 2025-10-26
