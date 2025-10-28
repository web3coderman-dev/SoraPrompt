# 🎬 SoraPrompt Design System — Studio Edition v1.0

> **Core Theme:** AI Cinematic Studio（AI 电影片场）
> **让每一个 Prompt 创作者，都像导演一样走进自己的 AI 片场**

**Version:** 1.0.0
**Last Updated:** 2025-10-27
**Brand Statement:** *"Direct the AI. Capture your imagination."*

---

## 📋 Table of Contents

1. [Design Philosophy](#-design-philosophy)
2. [Visual System](#-visual-system)
3. [Typography System](#-typography-system)
4. [Spacing & Layout](#-spacing--layout)
5. [Motion System](#-motion-system)
6. [Component Grammar](#-component-grammar)
7. [Interaction System](#-interaction-system)
8. [Brand Language](#-brand-language)
9. [Implementation Guide](#-implementation-guide)

---

## 🎯 Design Philosophy

### Core Metaphor: AI Film Studio

SoraPrompt 的视觉隐喻是 **"AI 电影片场"**。每个交互环节都应对应真实电影制作流程：

```
Scene（场景）   → 主创作区域，布局场景
Camera（镜头）  → 视角控制，构图调整
Lighting（布光）→ 氛围营造，视觉增强
Script（剧本）  → Prompt 编写，导演语言
Render（渲染）  → AI 生成，实时预览
```

### Design Principles

#### 1. **导演式协作 (Director's Collaboration)**
- 用户不是"操作者"，而是"导演"
- AI 是协作的"摄影师"和"灯光师"
- 每个控件都是片场设备（如调光台、镜头选择器）

#### 2. **暗夜片场氛围 (Night Studio Atmosphere)**
- 深色背景模拟真实片场环境（0B0D12）
- 蓝橙色光线模拟专业布光（Key Light + Rim Light）
- 霓虹特效代表 AI 能量流动

#### 3. **电影级视觉质感 (Cinematic Visual Quality)**
- 使用真实光影效果（投射阴影、环境光）
- 微妙的景深与模糊效果
- 流畅的镜头运动式动画

#### 4. **专业而直观 (Professional yet Intuitive)**
- 视觉专业但不晦涩
- 术语接地气（"开拍" > "执行"）
- 降低创作门槛，保持专业调性

---

## 🌈 Visual System

### Color Tokens

#### Scene Colors（场景色）
片场基础色调，营造暗夜摄影棚氛围

| Token | Value | Usage | Example |
|-------|-------|-------|---------|
| `color.scene.background` | `#0B0D12` | 主背景（暗色片场地面） | 页面底色、侧边栏 |
| `color.scene.fill` | `#141821` | 填充色（布景板） | 卡片背景、面板 |
| `color.scene.fillLight` | `#1A1F2E` | 亮填充（补光区域） | 悬停状态、选中区域 |

**视觉效果：** 深邃的片场环境，低反光，视觉焦点集中在内容

```css
/* 示例：主容器 */
.studio-container {
  background: linear-gradient(180deg, #0B0D12 0%, #141821 100%);
}
```

---

#### Light Colors（灯光色）
专业布光系统，基于三点照明原理

| Token | Value | Usage | Metaphor |
|-------|-------|-------|----------|
| `color.light.key` | `#3A6CFF` | 主光源（Key Light） | 品牌主色、主按钮、链接 |
| `color.light.rim` | `#E4A24D` | 边缘光（Rim Light） | 强调边框、温暖氛围 |
| `color.light.neon` | `#8A60FF` | 霓虹光（Neon FX） | AI 能量、特效、动画 |
| `color.light.fill` | `#2A3441` | 补光（Fill Light） | 次要元素、禁用状态 |

**三点照明示意：**
```
     Key Light (蓝)
         ▼
    ┌─────────┐
    │  主体   │ ← Rim Light (金)
    └─────────┘
         ▲
    Fill Light (灰)
```

**使用场景：**
- **Key Light（蓝色）：** 导演的主要工作区（Prompt 编辑器、主按钮）
- **Rim Light（金色）：** 高级功能提示、成功状态、预览区边缘
- **Neon（紫色）：** AI 正在工作、渲染状态、魔法时刻

```css
/* 示例：主按钮（导演喊 Action） */
.button-take {
  background: linear-gradient(135deg, #3A6CFF 0%, #5C89FF 100%);
  box-shadow: 0 0 24px rgba(58, 108, 255, 0.3);
}

/* 示例：AI 渲染中 */
.rendering-glow {
  border: 2px solid #8A60FF;
  box-shadow: 0 0 32px rgba(138, 96, 255, 0.5);
  animation: neon-pulse 2s ease-in-out infinite;
}
```

---

#### State Colors（状态色）
清晰的状态反馈，符合电影制作流程

| Token | Value | Usage | Cinema Metaphor |
|-------|-------|-------|-----------------|
| `color.state.ok` | `#45E0A2` | 成功/就绪 | 绿灯（Green Light - 开拍） |
| `color.state.error` | `#FF5E5E` | 错误/阻塞 | 红灯（Red Light - 停机） |
| `color.state.warning` | `#FFB74D` | 警告/注意 | 黄灯（Amber Light - 准备） |
| `color.state.info` | `#64B5F6` | 信息/提示 | 蓝灯（Blue Screen - 后期） |

**状态语义：**
```
🟢 Green Light   → "Scene is ready"（场景就绪）
🔴 Red Light     → "Cut! Something's wrong"（停！有问题）
🟡 Amber Light   → "Stand by..."（准备中...）
🔵 Blue Light    → "In post-production"（后期处理）
```

---

#### Text Colors（文字色）
层次分明的文本系统

| Token | Value | Usage |
|-------|-------|-------|
| `color.text.primary` | `#FFFFFF` | 主要文字（剧本标题、导演指令） |
| `color.text.secondary` | `#A0A8B8` | 次要文字（场记信息、时间码） |
| `color.text.tertiary` | `#6B7280` | 辅助文字（备注、提示） |
| `color.text.disabled` | `#4B5563` | 禁用文字（未激活设备） |

---

#### Border & Overlay（边框与遮罩）

| Token | Value | Usage |
|-------|-------|-------|
| `color.border.subtle` | `rgba(58, 108, 255, 0.1)` | 微妙分隔线 |
| `color.border.default` | `rgba(58, 108, 255, 0.2)` | 标准边框 |
| `color.border.strong` | `rgba(58, 108, 255, 0.4)` | 强调边框 |
| `color.overlay.light` | `rgba(0, 0, 0, 0.4)` | 轻遮罩（模态框背景） |
| `color.overlay.medium` | `rgba(0, 0, 0, 0.6)` | 中遮罩（聚焦模式） |
| `color.overlay.heavy` | `rgba(0, 0, 0, 0.8)` | 重遮罩（全屏预览） |

---

### Gradients（渐变）

模拟片场光线渐变效果

```css
/* 主光渐变（蓝色导演光） */
gradient-key: linear-gradient(135deg, #3A6CFF 0%, #0A47E8 100%)

/* 边缘光渐变（金色暖光） */
gradient-rim: linear-gradient(135deg, #E4A24D 0%, #D68722 100%)

/* 霓虹渐变（紫色能量） */
gradient-neon: linear-gradient(135deg, #8A60FF 0%, #6730FF 100%)

/* 混合光（蓝紫混合） */
gradient-mixed: linear-gradient(135deg, #3A6CFF 0%, #8A60FF 100%)

/* 片场背景（深色渐变） */
gradient-studio: linear-gradient(180deg, #0B0D12 0%, #141821 100%)
```

**使用示例：**
```css
/* 高级按钮 */
.button-director {
  background: linear-gradient(135deg, #3A6CFF 0%, #8A60FF 100%);
}

/* 渲染进度条 */
.progress-render {
  background: linear-gradient(90deg, #8A60FF 0%, #3A6CFF 100%);
}
```

---

## 📝 Typography System

### Font Family（字体族）

基于电影制作流程的字体分类

| Token | Font | Usage | Metaphor |
|-------|------|-------|----------|
| `font.primary` | Inter / 思源黑体 | 主界面文字 | 片场标识牌 |
| `font.script` | EB Garamond / 仿宋体 | Prompt 剧本区 | 导演手写剧本 |
| `font.code` | IBM Plex Mono | 技术参数、代码 | 摄影机参数面板 |
| `font.display` | Space Grotesk | 品牌标题、大标题 | 片场大屏幕 |

**字体选择原则：**
- **Primary（Inter）：** 清晰、专业，适合长时间阅读
- **Script（EB Garamond）：** 优雅、有仪式感，模拟导演手稿
- **Code（IBM Plex Mono）：** 等宽、精确，技术参数专用
- **Display（Space Grotesk）：** 几何、现代，品牌识别

```css
/* 实现示例 */
.font-primary {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.font-script {
  font-family: "EB Garamond", Georgia, serif;
  font-style: italic; /* 导演手写感 */
}

.font-code {
  font-family: "IBM Plex Mono", "Menlo", monospace;
  font-variant-numeric: tabular-nums; /* 数字对齐 */
}

.font-display {
  font-family: "Space Grotesk", Inter, sans-serif;
  letter-spacing: -0.02em; /* 紧凑现代感 */
}
```

---

### Font Scale（字号比例）

| Size Token | Value | Line Height | Usage | Cinema Context |
|------------|-------|-------------|-------|----------------|
| `text-xs` | 12px (0.75rem) | 16px (1.33) | 时间码、技术标签 | Timecode |
| `text-sm` | 14px (0.875rem) | 20px (1.43) | 场记信息、次要文字 | Slate Info |
| `text-base` | 16px (1rem) | 24px (1.5) | 正文、导演指令 | Script Body |
| `text-lg` | 18px (1.125rem) | 28px (1.56) | 场景标题 | Scene Header |
| `text-xl` | 20px (1.25rem) | 28px (1.4) | 镜头编号 | Shot Number |
| `text-2xl` | 24px (1.5rem) | 32px (1.33) | 幕次标题 | Act Title |
| `text-3xl` | 30px (1.875rem) | 36px (1.2) | 章节标题 | Chapter Title |
| `text-4xl` | 36px (2.25rem) | 40px (1.11) | 主标题 | Main Title |
| `text-5xl` | 48px (3rem) | 48px (1) | 片头标题 | Opening Title |

---

### Font Weight（字重）

| Token | Value | Usage | Cinema Context |
|-------|-------|-------|----------------|
| `font-regular` | 400 | 正文、一般信息 | 普通场记 |
| `font-medium` | 500 | 次要强调、标签 | 部门标注 |
| `font-bold` | 700 | 标题、导演指令 | 导演批注 |

**使用原则：**
- Regular（400）：默认正文，舒适阅读
- Medium（500）：界面标签、按钮文字
- Bold（700）：标题、重要指令（导演的加粗批注）

---

### Line Height（行高）

| Token | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.2 | 大标题、Display 文字 |
| `leading-normal` | 1.5 | 正文、Prompt 文本 |
| `leading-relaxed` | 1.75 | 长文本、剧本阅读 |

---

### Letter Spacing（字间距）

```css
tracking-tight:   -0.02em   /* 紧凑（Display 标题） */
tracking-normal:   0        /* 标准（正文） */
tracking-wide:     0.05em   /* 宽松（小标签） */
```

---

## 📏 Spacing & Layout

### Spacing Scale（间距比例）

基于 **8px Grid System**（8pt 栅格）

| Token | Value | Usage | Studio Context |
|-------|-------|-------|----------------|
| `space.frame.sm` | 8px | 组件内小间距 | 设备按钮间距 |
| `space.frame.md` | 16px | 组件内标准间距 | 控制面板间距 |
| `space.frame.lg` | 32px | 场景区块间距 | 拍摄区域分隔 |
| `space.frame.xl` | 48px | 主区域间距 | 片场分区间距 |

---

### Radius（圆角）

| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | 6px | 小按钮、标签 |
| `radius.md` | 8px | 标准按钮、输入框 |
| `radius.card` | 12px | 卡片、面板 |
| `radius.lg` | 16px | 大型容器 |
| `radius.full` | 9999px | 完全圆角（状态灯） |

---

### Shadows（阴影）

模拟片场灯光投射效果

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.light` | `0 0 24px rgba(58, 108, 255, 0.2)` | Key Light 柔光 |
| `shadow.key` | `0 8px 32px rgba(58, 108, 255, 0.3)` | 主光源投射 |
| `shadow.rim` | `0 4px 16px rgba(228, 162, 77, 0.25)` | 边缘光晕 |
| `shadow.neon` | `0 0 20px rgba(138, 96, 255, 0.4)` | 霓虹发光 |
| `shadow.depth.sm` | `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)` | 微景深 |
| `shadow.depth.lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | 深景深 |

---

## ⚡ Motion System

### Motion Tokens（动效令牌）

基于电影拍摄术语的动画系统

| Token | Duration | Easing | Usage | Cinema Term |
|-------|----------|--------|-------|-------------|
| `motion.camera.pan` | 300ms | ease-in-out | 面板切换 | 摇镜头（Pan） |
| `motion.camera.dolly` | 500ms | ease-out | 缩放动画 | 推轨（Dolly） |
| `motion.cut.fade` | 200ms | ease-in | 淡入淡出 | 淡化（Fade） |
| `motion.cut.dissolve` | 400ms | ease-in-out | 溶解过渡 | 溶解（Dissolve） |
| `motion.light.blink` | 1000ms | infinite alternate | 灯光闪烁 | 灯光效果 |
| `motion.render.pulse` | 800ms | ease-in-out infinite | 渲染脉冲 | 渲染中 |

---

### Animation Examples（动画示例）

#### Camera Pan（摇镜头）
用于面板切换、侧边栏展开

```css
@keyframes camera-pan {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-enter {
  animation: camera-pan 300ms ease-in-out;
}
```

#### Cut Fade（淡切）
用于模态框、提示框

```css
@keyframes cut-fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.modal-enter {
  animation: cut-fade 200ms ease-in;
}
```

#### Light Blink（灯光闪烁）
用于状态指示、AI 工作提示

```css
@keyframes light-blink {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

.status-recording {
  animation: light-blink 1000ms infinite alternate;
}
```

#### Render Pulse（渲染脉冲）
用于 AI 生成中状态

```css
@keyframes render-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.ai-rendering {
  animation: render-pulse 800ms ease-in-out infinite;
}
```

---

### Transition Duration（过渡时长）

| Token | Value | Usage |
|-------|-------|-------|
| `duration.fast` | 150ms | 微交互（按钮悬停） |
| `duration.normal` | 300ms | 标准过渡（面板切换） |
| `duration.slow` | 500ms | 大型动画（页面过渡） |

---

## 🧩 Component Grammar

### 组件命名规则（Cinematic Naming）

所有组件使用电影制作术语命名

| Component Type | Naming Convention | Example | Explanation |
|----------------|-------------------|---------|-------------|
| **按钮** | `Button.{Action}` | `Button.Take`, `Button.Cut` | 导演指令 |
| **面板** | `Panel.{Area}` | `Panel.Scene`, `Panel.Script` | 片场区域 |
| **标签** | `Tag.{Status}` | `Tag.Recording`, `Tag.Ready` | 状态指示 |
| **滑块** | `Slider.{Control}` | `Slider.LightIntensity` | 设备控制 |
| **进度** | `Progress.{Process}` | `Progress.Render` | 流程进度 |
| **提示** | `Toast.{Type}` | `Toast.FilmSlate` | 场记板提示 |

---

### Button Components（按钮组件）

#### Button.Take（开拍按钮）
执行主要操作，如"生成 Prompt"、"开始渲染"

```tsx
<button className="
  px-6 py-3
  bg-gradient-to-r from-keyLight to-keyLight-600
  text-white font-display font-bold
  rounded-lg shadow-key
  hover:shadow-neon hover:scale-105
  active:scale-100
  transition-all duration-300
">
  <PlayIcon className="w-5 h-5 mr-2" />
  Take • 开拍
</button>
```

**视觉特征：**
- 蓝色渐变（Key Light）
- 发光阴影
- 悬停时放大 + 紫色光晕（Neon）
- 图标 + 文字组合

---

#### Button.Cut（停止按钮）
停止操作，如"停止生成"、"取消渲染"

```tsx
<button className="
  px-6 py-3
  bg-state-error/10 border-2 border-state-error
  text-state-error font-display font-bold
  rounded-lg
  hover:bg-state-error hover:text-white
  transition-all duration-200
">
  <StopIcon className="w-5 h-5 mr-2" />
  Cut • 停
</button>
```

---

#### Button.Preview（预览按钮）
次要操作，如"预览"、"查看详情"

```tsx
<button className="
  px-4 py-2
  bg-scene-fill border border-border-default
  text-text-secondary font-medium
  rounded-lg
  hover:bg-scene-fillLight hover:border-keyLight
  hover:text-text-primary
  transition-all duration-200
">
  Preview • 预览
</button>
```

---

### Panel Components（面板组件）

#### Panel.Scene（主场景面板）
核心创作区域

```tsx
<div className="
  bg-scene-fill border border-border-subtle
  rounded-card p-6
  shadow-depth-lg
">
  <div className="flex items-center gap-3 mb-4">
    <FilmIcon className="w-6 h-6 text-keyLight" />
    <h2 className="text-xl font-display font-bold text-text-primary">
      Scene • 场景
    </h2>
  </div>
  {/* 内容区域 */}
</div>
```

---

#### Panel.Script（剧本面板）
Prompt 编写区

```tsx
<div className="
  bg-scene-fill border-l-4 border-rimLight
  rounded-card p-6
">
  <h3 className="text-lg font-script text-text-primary mb-4">
    Script • 剧本
  </h3>
  <textarea className="
    w-full h-64
    bg-scene-background
    border border-border-subtle
    rounded-lg p-4
    font-script text-text-primary
    focus:border-keyLight focus:ring-2 focus:ring-keyLight/20
    resize-none
  " placeholder="Type your vision here..." />
</div>
```

---

#### Panel.Lighting（灯光面板）
控制视觉参数

```tsx
<div className="
  bg-gradient-to-br from-scene-fill to-scene-fillLight
  border border-border-default
  rounded-card p-4
">
  <h3 className="text-sm font-medium text-text-secondary mb-3">
    Lighting • 灯光控制
  </h3>
  {/* 滑块控件 */}
</div>
```

---

### Tag Components（标签组件）

#### Tag.SceneStatus（场景状态）

```tsx
/* Ready */
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5
  bg-state-ok/10 text-state-ok
  border border-state-ok/20
  rounded-full
  text-xs font-code font-medium
">
  <div className="w-2 h-2 rounded-full bg-state-ok animate-light-blink" />
  Ready
</span>

/* Rendering */
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5
  bg-neon/10 text-neon
  border border-neon/20
  rounded-full
  text-xs font-code font-medium
">
  <div className="w-2 h-2 rounded-full bg-neon animate-render-pulse" />
  Rendering...
</span>

/* Error */
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5
  bg-state-error/10 text-state-error
  border border-state-error/20
  rounded-full
  text-xs font-code font-medium
">
  <AlertIcon className="w-3 h-3" />
  Error
</span>
```

---

### Slider Components（滑块组件）

#### Slider.LightIntensity（灯光强度）

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-text-secondary">
    Light Intensity • 光线强度
  </label>
  <input
    type="range"
    min="0"
    max="100"
    className="
      w-full h-2
      bg-scene-fillLight
      rounded-full
      appearance-none
      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:w-4
      [&::-webkit-slider-thumb]:h-4
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:bg-keyLight
      [&::-webkit-slider-thumb]:shadow-light
      [&::-webkit-slider-thumb]:cursor-pointer
    "
  />
</div>
```

---

### Progress Components（进度组件）

#### Progress.Render（渲染进度）

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-xs">
    <span className="text-text-secondary">Rendering Scene 01</span>
    <span className="text-keyLight font-code font-medium">45%</span>
  </div>
  <div className="
    w-full h-2
    bg-scene-fillLight
    rounded-full
    overflow-hidden
  ">
    <div
      className="
        h-full
        bg-gradient-to-r from-neon to-keyLight
        shadow-neon
        animate-render-pulse
      "
      style={{ width: '45%' }}
    />
  </div>
</div>
```

---

### Toast Components（提示组件）

#### Toast.FilmSlate（场记板提示）

```tsx
<div className="
  flex items-start gap-4
  bg-scene-fill border-l-4 border-keyLight
  rounded-lg p-4
  shadow-key
  animate-camera-pan
">
  <ClapperIcon className="w-6 h-6 text-keyLight flex-shrink-0" />
  <div>
    <h4 className="font-display font-bold text-text-primary mb-1">
      Scene Rendered
    </h4>
    <p className="text-sm text-text-secondary">
      Your prompt has been successfully generated.
    </p>
  </div>
</div>
```

---

## 🎮 Interaction System

### Scene Modes（场景模式）

| Mode | Description | Visual State |
|------|-------------|--------------|
| **Scene Mode** | 主编辑模式 | 全局可见，多面板布局 |
| **Camera Mode** | 镜头预览模式 | 放大预览区，控制条浮现 |
| **Lighting Mode** | 灯光调整模式 | 侧边栏展开，调光面板激活 |
| **Script Mode** | 剧本专注模式 | 只显示文本编辑器，暗角环境 |

---

### Feedback Motion（反馈动效）

#### Hover States（悬停状态）
```css
/* 按钮悬停：放大 + 光晕 */
.button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 32px rgba(58, 108, 255, 0.4);
}

/* 卡片悬停：上移 + 增强阴影 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
```

#### Active States（激活状态）
```css
/* 按钮按下：缩小 */
.button:active {
  transform: scale(0.98);
}

/* 面板激活：边框发光 */
.panel.active {
  border-color: #3A6CFF;
  box-shadow: 0 0 0 4px rgba(58, 108, 255, 0.1);
}
```

#### Focus States（聚焦状态）
```css
/* 输入框聚焦：蓝色光晕 */
.input:focus {
  outline: none;
  border-color: #3A6CFF;
  box-shadow: 0 0 0 4px rgba(58, 108, 255, 0.15);
}
```

---

### Status Indicators（状态指示器）

```tsx
/* Recording（录制中） */
<div className="flex items-center gap-2">
  <div className="w-3 h-3 rounded-full bg-state-error animate-light-blink" />
  <span className="text-sm font-code text-state-error">REC</span>
</div>

/* Processing（处理中） */
<div className="flex items-center gap-2">
  <div className="w-3 h-3 rounded-full border-2 border-neon border-t-transparent animate-spin" />
  <span className="text-sm font-code text-neon">Processing...</span>
</div>

/* Ready（就绪） */
<div className="flex items-center gap-2">
  <div className="w-3 h-3 rounded-full bg-state-ok" />
  <span className="text-sm font-code text-state-ok">Ready</span>
</div>
```

---

## 🎙️ Brand Language

### Voice & Tone（语音与语气）

#### 1. Director's Voice（导演语气）
像导演对 AI 说话，不是开发者对系统下命令

**❌ 避免：** 技术术语、生硬指令
```
"执行生成任务"
"提交 Prompt"
"渲染队列"
```

**✅ 使用：** 电影术语、自然对话
```
"开拍！"（Take / Action）
"准备场景"（Set the scene）
"调整灯光"（Adjust lighting）
```

---

#### 2. Interface Copy Guidelines（界面文案指南）

| Context | Technical | Cinematic | Emotional Tone |
|---------|-----------|-----------|----------------|
| 生成 Prompt | "提交" | "开拍 Take" | 兴奋、期待 |
| 停止生成 | "取消" | "停 Cut" | 果断、掌控 |
| 保存草稿 | "保存" | "封存 Archive" | 安全、珍藏 |
| 查看结果 | "查看输出" | "放映 Screen" | 成就、展示 |
| AI 处理中 | "处理中..." | "拍摄中..." | 进行中、等待 |
| 成功完成 | "完成" | "杀青 Wrap" | 庆祝、满足 |

---

#### 3. Error Messages（错误提示）

**原则：** 用电影场景类比，降低挫败感

```tsx
/* Bad */
"Error 500: Internal server error"

/* Good */
"灯光故障 Lighting Malfunction
片场设备需要调试，请稍后重试"

/* Bad */
"Invalid input format"

/* Good */
"剧本格式问题 Script Format Issue
导演，这段文字似乎不完整，能再完善一下吗？"

/* Bad */
"Request timeout"

/* Good */
"拍摄超时 Shot Timeout
这个镜头拍摄时间过长，建议简化场景或分段拍摄"
```

---

### Micro-Copy Examples（微文案示例）

#### Loading States
```
⏳ "布景中..." → Setting up the scene...
⏳ "调光中..." → Adjusting lighting...
⏳ "摄影机就位..." → Camera rolling...
⏳ "AI 后期处理..." → Post-production...
```

#### Success Messages
```
✅ "场景就绪！" → Scene is ready!
✅ "完美拍摄！" → Perfect take!
✅ "已封存至片库" → Archived to vault
```

#### Empty States
```
📽️ "片场空空如也
还没有任何项目，开始你的第一次拍摄吧！"
```

#### CTA Buttons
```
🎬 "开始新拍摄" → Start New Shoot
🎥 "进入片场" → Enter Studio
📜 "翻开剧本" → Open Script
🌟 "获取灵感" → Get Inspired
```

---

## 🛠️ Implementation Guide

### File Structure（文件结构）

```
/design-system/
├── tokens/
│   ├── colors.json          # 颜色令牌
│   ├── typography.json      # 字体令牌
│   ├── spacing.json         # 间距令牌
│   └── motion.json          # 动效令牌
├── components/
│   ├── Button/
│   │   ├── Button.Take.tsx
│   │   ├── Button.Cut.tsx
│   │   └── Button.Preview.tsx
│   ├── Panel/
│   │   ├── Panel.Scene.tsx
│   │   ├── Panel.Script.tsx
│   │   └── Panel.Lighting.tsx
│   ├── Tag/
│   │   └── Tag.SceneStatus.tsx
│   └── Motion/
│       ├── CameraPan.tsx
│       ├── CutFade.tsx
│       └── LightBlink.tsx
├── themes/
│   ├── studio-dark.theme.json    # 默认暗色主题
│   └── studio-light.theme.json   # 备选亮色主题
└── docs/
    ├── DESIGN_PHILOSOPHY.md
    ├── VISUAL_GUIDE.md
    ├── COMPONENT_NAMING.md
    └── BRAND_LANGUAGE.md
```

---

### Code Implementation（代码实现）

#### Design Tokens（设计令牌）

`/src/lib/design-tokens.ts`

```typescript
export const colors = {
  scene: {
    background: '#0B0D12',
    fill: '#141821',
    fillLight: '#1A1F2E',
  },
  light: {
    key: '#3A6CFF',
    rim: '#E4A24D',
    neon: '#8A60FF',
    fill: '#2A3441',
  },
  state: {
    ok: '#45E0A2',
    error: '#FF5E5E',
    warning: '#FFB74D',
    info: '#64B5F6',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A8B8',
    tertiary: '#6B7280',
    disabled: '#4B5563',
  },
  border: {
    subtle: 'rgba(58, 108, 255, 0.1)',
    default: 'rgba(58, 108, 255, 0.2)',
    strong: 'rgba(58, 108, 255, 0.4)',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.6)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },
};

export const fonts = {
  primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  script: '"EB Garamond", Georgia, serif',
  code: '"IBM Plex Mono", "Menlo", monospace',
  display: '"Space Grotesk", Inter, sans-serif',
};

export const motion = {
  camera: {
    pan: '300ms ease-in-out',
    dolly: '500ms ease-out',
  },
  cut: {
    fade: '200ms ease-in',
    dissolve: '400ms ease-in-out',
  },
  light: {
    blink: '1000ms infinite alternate',
  },
  render: {
    pulse: '800ms ease-in-out infinite',
  },
};
```

---

#### Tailwind Configuration（Tailwind 配置）

`tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        scene: {
          background: '#0B0D12',
          fill: '#141821',
          fillLight: '#1A1F2E',
        },
        keyLight: '#3A6CFF',
        rimLight: '#E4A24D',
        neon: '#8A60FF',
        // ... 其他颜色
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        script: ['"EB Garamond"', 'serif'],
        code: ['"IBM Plex Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        light: '0 0 24px rgba(58, 108, 255, 0.2)',
        key: '0 8px 32px rgba(58, 108, 255, 0.3)',
        rim: '0 4px 16px rgba(228, 162, 77, 0.25)',
        neon: '0 0 20px rgba(138, 96, 255, 0.4)',
      },
      animation: {
        'camera-pan': 'cameraPan 300ms ease-in-out',
        'cut-fade': 'cutFade 200ms ease-in',
        'light-blink': 'lightBlink 1000ms infinite alternate',
        'render-pulse': 'renderPulse 800ms ease-in-out infinite',
      },
      keyframes: {
        cameraPan: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        cutFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lightBlink: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        renderPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
    },
  },
};
```

---

### Component Implementation（组件实现）

#### Button.Take Example

`/src/components/ui/Button/Button.Take.tsx`

```tsx
import React from 'react';
import { Play } from 'lucide-react';

interface ButtonTakeProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ButtonTake: React.FC<ButtonTakeProps> = ({
  onClick,
  loading = false,
  disabled = false,
  children = 'Take',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="
        group relative
        px-6 py-3
        bg-gradient-to-r from-keyLight to-keyLight-600
        text-white font-display font-bold
        rounded-lg
        shadow-key
        hover:shadow-neon hover:scale-105
        active:scale-100
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        flex items-center justify-center gap-2
      "
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>拍摄中...</span>
        </>
      ) : (
        <>
          <Play className="w-5 h-5 group-hover:animate-render-pulse" />
          <span>{children}</span>
        </>
      )}

      {/* Neon glow effect on hover */}
      <div className="
        absolute inset-0 rounded-lg
        bg-neon opacity-0 group-hover:opacity-20
        transition-opacity duration-300
        pointer-events-none
      " />
    </button>
  );
};
```

---

### Usage Guidelines（使用指南）

#### 1. Component Composition（组件组合）

```tsx
import { ButtonTake, ButtonCut } from '@/components/ui/Button';
import { PanelScene, PanelScript } from '@/components/ui/Panel';
import { TagSceneStatus } from '@/components/ui/Tag';

export function StudioWorkspace() {
  return (
    <div className="min-h-screen bg-scene-background">
      {/* Header with status */}
      <header className="border-b border-border-subtle px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-text-primary">
            SoraPrompt Studio
          </h1>
          <TagSceneStatus status="ready" />
        </div>
      </header>

      {/* Main workspace */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <PanelScript className="lg:col-span-2" />
        <PanelScene />
      </main>

      {/* Action bar */}
      <footer className="border-t border-border-subtle px-6 py-4">
        <div className="flex justify-end gap-3">
          <ButtonCut />
          <ButtonTake />
        </div>
      </footer>
    </div>
  );
}
```

---

#### 2. Motion Integration（动效集成）

使用 `framer-motion` 实现电影级动画

```tsx
import { motion } from 'framer-motion';

export function PanelScene() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-scene-fill rounded-card p-6"
    >
      {/* Panel content */}
    </motion.div>
  );
}
```

---

#### 3. Z-Index Layering（层级管理）

```typescript
export const zIndex = {
  base: 0,           // 背景、场景
  scene: 10,         // 主要内容
  panel: 20,         // 面板、卡片
  overlay: 30,       // 遮罩
  hud: 40,           // 悬浮控件
  modal: 50,         // 模态框
  toast: 60,         // 提示消息
};
```

---

## 🎨 Moodboard & Visual References

### Cinematic Atmosphere（电影氛围参考）

**视觉基调：**
- 🌃 **暗夜片场**：深色背景，模拟真实摄影棚环境
- 💡 **三点布光**：Key Light（蓝）+ Rim Light（金）+ Fill（灰）
- 🎞️ **胶片质感**：微妙颗粒感、高对比度
- 🌟 **霓虹特效**：AI 能量流、科技感光效
- 📹 **取景框美学**：16:9 宽银幕比例、电影级构图

**UI 氛围关键词：**
- Inter 字体 + EB Garamond 衬线 = 现代专业 + 古典优雅
- 深色界面 + 蓝橙光线 = 片场夜景 + 专业布光
- 流畅动画 + 镜头运动 = 电影感 + 导演视角

---

## 🔄 Version History

### v1.0.0 (2025-10-27)
- ✅ 完全重构为 AI Cinematic Studio 设计系统
- ✅ 定义片场色彩体系（Scene + Light + State）
- ✅ 建立电影术语命名规范（Take、Cut、Pan、Fade）
- ✅ 创建完整动效系统（Camera、Cut、Light、Render）
- ✅ 确立导演语气品牌语言
- ✅ 提供完整组件实现指南

---

## 📖 Additional Resources

### Design Tools
- **Figma Library:** [SoraPrompt Studio Design Kit](#)
- **Token Export:** `design-tokens.json`
- **Icon Set:** Lucide Icons（电影主题图标）

### Development
- **Component Storybook:** [View Components](#)
- **Code Sandbox:** [Live Examples](#)
- **GitHub Repo:** [Design System](#)

---

## 🤝 Contributing

### Design System Updates
1. 提交 Issue 说明变更理由
2. 遵循电影术语命名规范
3. 保持视觉一致性（片场氛围）
4. 更新文档与示例代码

### Review Checklist
- [ ] 是否符合 AI Cinematic Studio 主题？
- [ ] 命名是否使用电影术语？
- [ ] 视觉是否保持暗夜片场氛围？
- [ ] 动效是否模拟镜头运动？
- [ ] 文案是否使用导演语气？

---

**Design System Maintainer:** SoraPrompt Studio Team
**Feedback:** design@soraprompt.studio
**License:** Internal Use Only

---

*🎬 "Every frame matters. Every pixel tells a story."*
*— SoraPrompt Design Philosophy*
