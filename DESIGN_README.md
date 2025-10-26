# 🎨 Sora Prompt Studio 设计系统

欢迎使用 Sora Prompt Studio 设计系统！这是一套完整的设计语言和实施指南。

---

## 📚 文档导航

### 1. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
**核心设计系统文档** - 完整的设计规范

包含内容：
- 🎯 设计原则
- 🎨 品牌基础
- 🌈 颜色系统（主色、辅助色、语义色）
- 📝 字体系统（字族、大小、字重）
- 📏 间距系统（8px 栅格）
- 🧩 组件规范（按钮、输入框、卡片等）
- ⚡ 动画与交互
- 📱 响应式规范

### 2. [DESIGN_EXAMPLES.md](./DESIGN_EXAMPLES.md)
**设计系统使用示例** - 实际代码示例

包含内容：
- 🔘 按钮示例（主要、次要、幽灵）
- 📝 输入框示例（文本框、文本域、错误状态）
- 🃏 卡片示例（标准卡片、历史记录卡片）
- 🏷️ 标签示例（状态标签、评分标签）
- 📐 布局示例（两栏、三栏、容器）
- 🎨 颜色使用示例
- 🎭 渐变与阴影
- 🎬 动画示例

### 3. [tailwind.config.js](./tailwind.config.js)
**Tailwind CSS 配置** - 设计 Token 实现

已配置：
- ✅ 自定义颜色（primary、secondary）
- ✅ 字体族
- ✅ 自定义间距
- ✅ 圆角
- ✅ 阴影（含光晕效果）
- ✅ 动画（淡入、滑入、缩放）
- ✅ 毛玻璃效果

---

## 🚀 快速开始

### 步骤 1：理解设计原则

阅读 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) 的 **设计原则** 部分，了解：
- 专业而友好
- 清晰的视觉层次
- 响应式优先
- 高性能

### 步骤 2：熟悉颜色系统

我们的颜色系统：
- **主色调（蓝色）** - 代表智能、专业、科技
- **辅助色（紫色）** - 代表创意、艺术、电影感
- **中性色（灰色）** - 界面基础色

### 步骤 3：使用组件规范

查看 [DESIGN_EXAMPLES.md](./DESIGN_EXAMPLES.md)，找到你需要的组件示例：

```tsx
// 主按钮示例
<button className="px-6 py-3 bg-primary-600 hover:bg-primary-700
                   text-white font-semibold rounded-lg shadow-md
                   hover:shadow-lg transition-all duration-200">
  快速生成
</button>
```

### 步骤 4：应用到项目

1. 使用定义好的 Tailwind 类名
2. 遵循 8px 栅格系统
3. 保持一致的交互效果
4. 添加适当的过渡动画

---

## 🎨 设计系统核心价值

### 1. 一致性（Consistency）
- 统一的视觉语言
- 可预测的交互模式
- 降低用户学习成本

### 2. 效率（Efficiency）
- 预定义的设计 Token
- 可复用的组件规范
- 加快开发速度

### 3. 可维护性（Maintainability）
- 清晰的文档
- 系统化的命名
- 易于扩展和更新

### 4. 可访问性（Accessibility）
- 符合 WCAG 标准
- 良好的颜色对比度
- 语义化 HTML

---

## 🧩 设计系统架构

```
设计系统
├── 设计原则（Design Principles）
│   ├── 专业而友好
│   ├── 清晰的视觉层次
│   ├── 响应式优先
│   └── 高性能
│
├── 品牌基础（Brand Foundation）
│   ├── 品牌定位
│   ├── 品牌关键词
│   └── 视觉风格
│
├── 设计 Token（Design Tokens）
│   ├── 颜色（Colors）
│   │   ├── 主色调（Primary）
│   │   ├── 辅助色（Secondary）
│   │   ├── 中性色（Neutral）
│   │   └── 语义色（Semantic）
│   │
│   ├── 字体（Typography）
│   │   ├── 字体族
│   │   ├── 字体大小
│   │   ├── 字重
│   │   └── 行高
│   │
│   ├── 间距（Spacing）
│   │   └── 8px 栅格系统
│   │
│   ├── 圆角（Border Radius）
│   ├── 阴影（Shadows）
│   └── 动画（Animations）
│
├── 组件规范（Components）
│   ├── 按钮（Buttons）
│   ├── 输入框（Inputs）
│   ├── 卡片（Cards）
│   ├── 标签（Badges）
│   └── 模态框（Modals）
│
└── 模式库（Patterns）
    ├── 布局模式
    ├── 导航模式
    ├── 表单模式
    └── 反馈模式
```

---

## 🎯 使用场景

### 场景 1：设计新功能
1. 查阅设计系统文档
2. 选择合适的组件规范
3. 使用预定义的颜色和间距
4. 确保响应式和可访问性

### 场景 2：优化现有界面
1. 对照设计系统检查现有代码
2. 统一颜色使用（blue-600 → primary-600）
3. 标准化间距（使用 4 的倍数）
4. 添加过渡动画

### 场景 3：解决设计问题
1. 在 DESIGN_EXAMPLES.md 中搜索类似场景
2. 参考推荐的实现方式
3. 遵循最佳实践

---

## 📊 设计系统度量

### 颜色使用
- **主色调：** 按钮、链接、强调元素
- **辅助色：** 导演模式、特殊功能
- **中性色：** 文本、边框、背景
- **语义色：** 成功、警告、错误、信息

### 间距标准
- **组件内：** 4px、8px、12px、16px、24px
- **组件间：** 16px、24px、32px
- **区块间：** 48px、64px、96px

### 字体大小
- **主标题：** 36px - 60px
- **副标题：** 24px - 30px
- **正文：** 16px
- **辅助：** 12px - 14px

---

## 🔄 版本与更新

### 当前版本：v1.0.0

### 更新日志

#### v1.0.0 (2025-10-26)
- ✅ 初始设计系统发布
- ✅ 定义完整的颜色系统
- ✅ 创建组件设计规范
- ✅ 建立间距和字体系统
- ✅ 配置 Tailwind CSS
- ✅ 提供实用示例

### 计划更新
- 🔜 创建可复用 React 组件库
- 🔜 添加深色模式支持
- 🔜 扩展动画库
- 🔜 增加图标系统

---

## 💡 最佳实践

### ✅ 推荐

1. **始终使用设计系统定义的值**
   ```tsx
   ✅ bg-primary-600
   ❌ bg-blue-500
   ```

2. **遵循 8px 栅格**
   ```tsx
   ✅ space-y-4, gap-6, p-8
   ❌ space-y-3, gap-5, p-7
   ```

3. **添加过渡效果**
   ```tsx
   ✅ transition-all duration-200
   ❌ （无过渡）
   ```

4. **使用语义化命名**
   ```tsx
   ✅ <button className="primary-button">
   ❌ <div className="btn">
   ```

### ⚠️ 避免

1. ❌ 硬编码颜色值（如 `#3B82F6`）
2. ❌ 使用非标准间距（如 `margin: 13px`）
3. ❌ 混合不同的设计模式
4. ❌ 忽视无障碍性

---

## 🤝 贡献指南

### 如何贡献

1. **发现问题**
   - 设计不一致
   - 缺少组件规范
   - 文档不清晰

2. **提出改进**
   - 创建 GitHub Issue
   - 描述问题和建议
   - 提供示例

3. **更新文档**
   - Fork 项目
   - 修改设计系统文档
   - 提交 Pull Request

### 审查流程

1. 设计评审
2. 代码实现
3. 文档更新
4. 团队审核
5. 合并发布

---

## 📞 支持与反馈

### 获取帮助

- 📚 查阅文档：[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- 💡 查看示例：[DESIGN_EXAMPLES.md](./DESIGN_EXAMPLES.md)
- 🐛 报告问题：GitHub Issues
- 💬 讨论交流：GitHub Discussions

### 联系方式

- **设计系统维护者：** Sora Prompt Studio Team
- **反馈渠道：** GitHub Issues
- **最后更新：** 2025-10-26

---

## 🎉 开始使用

准备好了吗？开始使用 Sora Prompt Studio 设计系统：

1. 📖 阅读 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
2. 💻 参考 [DESIGN_EXAMPLES.md](./DESIGN_EXAMPLES.md)
3. 🚀 开始设计和开发

**让我们一起创造美好的用户体验！** 🎨✨
