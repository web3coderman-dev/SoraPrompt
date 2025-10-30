# 🎬 Sidebar 设计系统审查报告

**审查日期：** 2025-10-28
**审查对象：** `src/components/Sidebar.tsx`
**设计系统版本：** v1.0.0 (Studio Edition)

---

## 📊 审查结果总览

| 维度 | 符合度 | 评分 |
|------|--------|------|
| 组件一致性 | 🟡 部分符合 | 6/10 |
| 视觉规范 | 🟢 良好 | 8/10 |
| 排版与图标 | 🟢 良好 | 8/10 |
| 功能与交互 | 🟢 良好 | 7/10 |
| 可复用性与结构 | 🟡 部分符合 | 6/10 |
| **综合评分** | 🟡 **需要优化** | **7/10** |

---

## ✅ 符合项

### 1. 视觉规范 (8/10)

#### ✅ 颜色系统
- **背景色**：正确使用 `bg-scene-fill`（#141821）
- **边框色**：正确使用 `border-keyLight/20`（Key Light 20% 透明度）
- **文字色**：正确使用 `text-text-primary`、`text-text-secondary`、`text-text-tertiary`
- **状态色**：正确使用 `text-keyLight`（选中态）
- **按钮渐变**：登录按钮正确使用 `from-keyLight to-neon`（L150-151）

**代码示例（符合规范）：**
```tsx
// Line 85: 正确使用边框色
<div className="p-6 border-b border-keyLight/20">

// Line 105: 正确使用选中态颜色
'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
```

#### ✅ 阴影与层次
- **深度阴影**：正确使用 `shadow-depth-lg`（L69）
- **光晕阴影**：正确使用 `shadow-light`（L105）、`shadow-key`、`shadow-neon`（L151）
- **遮罩层**：正确使用 `bg-black bg-opacity-50`（L61）

#### ✅ 圆角规范
- **按钮圆角**：正确使用 `rounded-lg`（8px，符合 `radius.md`）
- **头像圆角**：正确使用 `rounded-full`（完全圆角）

### 2. 排版与图标 (8/10)

#### ✅ 字体使用
- **品牌标题**：正确使用 `font-display`（Space Grotesk，L88）
- **按钮文字**：正确使用 `font-semibold`（L141、L151）
- **主要文字**：正确使用 `text-text-primary`

#### ✅ 图标规范
- **图标尺寸**：统一使用 `w-5 h-5`（20px）和 `w-4 h-4`（16px）
- **图标对齐**：正确使用 `flex items-center gap-3`
- **图标库**：统一使用 Lucide React（符合设计系统要求）

#### ✅ 字号与行高
- **标题字号**：`text-xl`（20px，L88）符合 `text-xl` 规范
- **正文字号**：`text-sm`（14px，L133、L135）符合 `text-sm` 规范
- **小字号**：`text-xs`（12px，L156）符合 `text-xs` 规范

### 3. 功能与交互 (7/10)

#### ✅ 交互状态
- **悬停态**：正确实现 `hover:bg-scene-fillLight`、`hover:text-text-primary`（L106）
- **激活态**：正确实现 `active:scale-[0.98]`（L141、L151）
- **禁用态**：正确实现 `disabled:opacity-50 disabled:cursor-not-allowed`（L141）
- **选中态**：正确实现 `bg-keyLight/10 text-keyLight`（L105）

#### ✅ 动画过渡
- **面板切换**：正确使用 `transition-all duration-300 ease-in-out`（L80）
- **按钮交互**：正确使用 `transition-all duration-200`（L103、L141、L151）

#### ✅ 响应式设计
- **移动端遮罩**：正确实现 `fixed inset-0 z-40 lg:hidden`（L60）
- **移动端按钮**：正确实现 `lg:hidden`（L67）
- **侧边栏收起**：正确实现 `translate-x-0` / `-translate-x-full`（L80-82）
- **自动关闭**：移动端点击后自动关闭侧边栏（L99-101）

#### ✅ 无障碍特性
- **按钮禁用**：正确实现 `disabled` 属性（L140）
- **语义化 HTML**：正确使用 `<aside>`、`<nav>` 标签（L79、L93）

---

## ❌ 不符合项

### 1. 组件一致性 (6/10)

#### ❌ 未使用设计系统组件
**问题：** Sidebar 中的按钮未复用设计系统定义的标准按钮组件

**当前实现：**
```tsx
// Line 138-145: 直接内联样式
<button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-scene-fillLight...">
  <LogOut className="w-4 h-4" />
  <span>{signingOut ? t.signingOut : t.signOut}</span>
</button>
```

**设计系统要求：**
根据 `DESIGN_SYSTEM.md` 第 511-527 行，应使用 `Button.Preview` 组件：
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

#### ❌ 登录按钮未使用标准组件
**问题：** 登录按钮未使用 `Button.Take` 组件

**当前实现：**
```tsx
// Line 149-155
<button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-keyLight to-neon...">
```

**设计系统要求：**
根据 `DESIGN_SYSTEM.md` 第 467-488 行，应使用 `Button.Take` 组件。

#### ❌ 导航按钮未遵循命名规范
**问题：** 导航项未使用电影术语命名（Component Grammar）

**设计系统要求：**
根据 `DESIGN_SYSTEM.md` 第 448-461 行，组件应使用电影制作术语命名。

**建议改进：**
```tsx
// 当前：menuItems
// 建议：sceneItems 或 studioItems（符合片场概念）

// 建议使用 NavItem 组件
<NavItem.Scene active={currentView === 'new'} />
<NavItem.Takes active={currentView === 'history'} />
<NavItem.Settings active={currentView === 'settings'} />
```

### 2. 视觉规范细节问题 (2分扣分)

#### ⚠️ 边框色不统一
**问题：** 部分边框未使用设计系统 token

**当前实现：**
```tsx
// Line 103: 使用 border-transparent（不符合规范）
: 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-transparent'
```

**设计系统要求：**
应使用 `border-keyLight/10` 或 `border-border-subtle`

#### ⚠️ 遮罩层未使用 overlay token
**问题：** 遮罩层颜色未使用设计系统定义的 `overlay` token

**当前实现：**
```tsx
// Line 61
className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
```

**设计系统要求：**
根据 `design-tokens.ts` 第 30-34 行，应使用：
```tsx
className="fixed inset-0 bg-overlay-medium z-40 lg:hidden"
```

但由于 Tailwind 不直接支持该 token，建议在 `tailwind.config.js` 中扩展：
```javascript
colors: {
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.6)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },
}
```

### 3. 动效系统未完全对齐 (1分扣分)

#### ⚠️ 未使用电影术语动画
**问题：** 侧边栏展开动画未使用 `camera-pan` 动画

**当前实现：**
```tsx
// Line 80: 使用普通 transition
className="... transition-transform duration-300 ease-in-out"
```

**设计系统要求：**
根据 `DESIGN_SYSTEM.md` 第 367-385 行，面板切换应使用 `camera-pan` 动画：
```tsx
// 应使用
className="... animate-camera-pan"

// 或定义为
@keyframes camera-pan {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```

### 4. 可复用性与结构 (6/10)

#### ❌ 缺少组件拆分
**问题：** Sidebar 中的用户信息区、导航项未拆分为独立组件

**当前实现：**
- 用户信息区直接内联（L118-146）
- 导航项通过 `map` 渲染（L94-112）

**设计系统要求：**
应拆分为独立组件：
- `UserProfile.tsx`（用户信息卡片）
- `NavItem.tsx`（导航项）
- `SidebarHeader.tsx`（侧边栏头部）

**建议结构：**
```
/components/
  /Sidebar/
    - Sidebar.tsx           （主容器）
    - SidebarHeader.tsx     （头部 Logo）
    - NavItem.tsx           （导航项）
    - UserProfile.tsx       （用户卡片）
    - index.ts              （统一导出）
```

#### ⚠️ 未使用设计系统样式工具
**问题：** 未使用 `design-tokens.ts` 中的 `zIndex` token

**当前实现：**
```tsx
// Line 61: 直接硬编码 z-40
className="... z-40 lg:hidden"

// Line 67: 硬编码 z-50
className="... z-50 lg:hidden"

// Line 80: 硬编码 z-50
className="... z-50 transition-transform"
```

**设计系统要求：**
应在 `tailwind.config.js` 中扩展 `zIndex`：
```javascript
zIndex: {
  base: '0',
  scene: '10',
  panel: '20',
  overlay: '30',
  hud: '40',
  modal: '50',
  toast: '60',
}
```

然后使用：
```tsx
className="... z-overlay lg:hidden"  // z-30
className="... z-hud lg:hidden"      // z-40
```

### 5. 品牌语言未对齐 (1分扣分)

#### ⚠️ 文案未使用电影术语
**问题：** 界面文案未使用导演语气（Director's Voice）

**当前实现：**
```tsx
// Line 36: "New" → 技术术语
label: t.sidebarNew,

// Line 41: "History" → 中性词
label: t.sidebarHistory,
```

**设计系统要求：**
根据 `DESIGN_SYSTEM.md` 第 835-845 行，应使用电影术语：
```tsx
// 建议改进
label: t.sceneNew,        // "新场景 New Scene"
label: t.sceneTakes,      // "拍摄记录 Takes"
label: t.studioSettings,  // "片场设置 Studio"
```

---

## 🔧 修复建议

### Phase 1: 紧急修复（核心一致性）

**优先级：🔴 高**

#### 1.1 创建标准按钮组件
**文件：** `src/components/ui/Button.tsx`（已存在，需增强）

**修复内容：**
```tsx
// 添加 Button.Scene（次要按钮）变体
export const ButtonScene = ({ children, ...props }: ButtonSceneProps) => {
  return (
    <button
      className="
        px-4 py-2
        bg-scene-fill border border-border-default
        text-text-secondary font-medium
        rounded-lg
        hover:bg-scene-fillLight hover:border-keyLight
        hover:text-text-primary
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
      "
      {...props}
    >
      {children}
    </button>
  );
};
```

#### 1.2 使用 Button 组件替换内联样式
**文件：** `src/components/Sidebar.tsx`

**修复位置：**
- L138-145（退出登录按钮）
- L149-155（登录/注册按钮）

**修复后：**
```tsx
// 替换 L138-145
<ButtonScene onClick={handleSignOut} disabled={signingOut} className="w-full">
  <LogOut className="w-4 h-4" />
  <span>{signingOut ? t.signingOut : t.signOut}</span>
</ButtonScene>

// 替换 L149-155
<ButtonTake onClick={() => setShowLoginModal(true)} className="w-full">
  <LogIn className="w-5 h-5" />
  <span>{t.freeRegister || t.signInSignUp}</span>
</ButtonTake>
```

#### 1.3 修复边框色不一致
**文件：** `src/components/Sidebar.tsx`

**修复位置：** L103-107

**当前：**
```tsx
border-transparent
```

**修复为：**
```tsx
border-keyLight/5
```

**完整代码：**
```tsx
className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
  currentView === item.view
    ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
    : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
}`}
```

#### 1.4 统一 z-index 使用
**文件：** `tailwind.config.js`

**修复内容：**
```javascript
module.exports = {
  theme: {
    extend: {
      zIndex: {
        base: '0',
        scene: '10',
        panel: '20',
        overlay: '30',
        hud: '40',
        modal: '50',
        toast: '60',
      },
    },
  },
};
```

**文件：** `src/components/Sidebar.tsx`

**修复位置：**
- L61: `z-40` → `z-overlay`
- L67: `z-50` → `z-hud`
- L80: `z-50` → `z-modal`

---

### Phase 2: 架构优化（可复用性）

**优先级：🟡 中**

#### 2.1 拆分 NavItem 组件
**新文件：** `src/components/Sidebar/NavItem.tsx`

**内容：**
```tsx
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3
        rounded-lg transition-all duration-200
        border font-medium
        ${
          active
            ? 'bg-keyLight/10 text-keyLight font-semibold shadow-light border-keyLight/20'
            : 'text-text-secondary hover:bg-scene-fillLight hover:text-text-primary border-keyLight/5 hover:border-keyLight/10'
        }
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}
```

#### 2.2 拆分 UserProfile 组件
**新文件：** `src/components/Sidebar/UserProfile.tsx`

**内容：**
```tsx
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ButtonScene } from '../ui/Button';

export default function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setSigningOut(false);
    }
  };

  return (
    <div className="p-4 border-b border-keyLight/20">
      <div className="flex items-center gap-3 mb-3">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-10 h-10 rounded-full border-2 border-keyLight/20 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-keyLight/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-keyLight" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {profile?.full_name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-text-secondary truncate">{user.email}</p>
        </div>
      </div>
      <ButtonScene onClick={handleSignOut} disabled={signingOut} className="w-full">
        <LogOut className="w-4 h-4" />
        <span>{signingOut ? t.signingOut : t.signOut}</span>
      </ButtonScene>
    </div>
  );
}
```

#### 2.3 拆分 SidebarHeader 组件
**新文件：** `src/components/Sidebar/SidebarHeader.tsx`

**内容：**
```tsx
import { Logo } from '../ui/Logo';

export default function SidebarHeader() {
  return (
    <div className="p-6 border-b border-keyLight/20">
      <div className="flex items-center gap-3 min-w-0">
        <Logo size={32} className="flex-shrink-0" />
        <h2 className="text-xl font-bold font-display text-text-primary whitespace-nowrap">
          SoraPrompt
        </h2>
      </div>
    </div>
  );
}
```

#### 2.4 重构 Sidebar 主组件
**文件：** `src/components/Sidebar.tsx`

**修复后：**
```tsx
import SidebarHeader from './Sidebar/SidebarHeader';
import NavItem from './Sidebar/NavItem';
import UserProfile from './Sidebar/UserProfile';
import LoginPrompt from './Sidebar/LoginPrompt';

export default function Sidebar({ isOpen, onToggle, currentView, onViewChange }: SidebarProps) {
  const menuItems = [/* ... */];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-overlay-medium z-overlay lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen bg-scene-fill border-r border-keyLight/20 z-modal ...">
        <SidebarHeader />

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={currentView === item.view}
              onClick={() => {
                onViewChange(item.view);
                if (window.innerWidth < 1024) onToggle();
              }}
            />
          ))}
        </nav>

        <div className="border-t border-keyLight/20">
          {user ? <UserProfile /> : <LoginPrompt onLogin={() => setShowLoginModal(true)} />}
        </div>
      </aside>
    </>
  );
}
```

---

### Phase 3: 高级增强（电影感体验）

**优先级：🟢 低**

#### 3.1 添加 Camera Pan 动画
**文件：** `tailwind.config.js`

**添加内容：**
```javascript
animation: {
  'camera-pan': 'cameraPan 300ms ease-in-out',
},
keyframes: {
  cameraPan: {
    '0%': { transform: 'translateX(-100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
},
```

**文件：** `src/components/Sidebar.tsx`

**修复位置：** L80

**当前：**
```tsx
className="... transition-transform duration-300 ease-in-out"
```

**修复为：**
```tsx
className={`... ${isOpen ? 'animate-camera-pan' : ''}`}
```

#### 3.2 使用电影术语文案
**文件：** `src/lib/i18n.ts`

**添加内容：**
```typescript
// 英文
sceneNew: 'New Scene',
sceneTakes: 'Takes',
sceneStudio: 'Studio',

// 中文
sceneNew: '新场景',
sceneTakes: '拍摄记录',
sceneStudio: '片场设置',
```

**文件：** `src/components/Sidebar.tsx`

**修复位置：** L33-54

**修复为：**
```tsx
const menuItems = [
  {
    icon: Sparkles,
    label: t.sceneNew,        // 替换 t.sidebarNew
    view: 'new' as ViewType,
  },
  {
    icon: History,
    label: t.sceneTakes,      // 替换 t.sidebarHistory
    view: 'history' as ViewType,
  },
  {
    icon: CreditCard,
    label: t.sidebarSubscription,
    view: 'subscription' as ViewType,
  },
  {
    icon: Settings,
    label: t.sceneStudio,     // 替换 t.sidebarSettings
    view: 'settings' as ViewType,
  },
];
```

#### 3.3 添加状态指示器
**新增功能：** 为导航项添加状态灯

**文件：** `src/components/Sidebar/NavItem.tsx`

**增强内容：**
```tsx
export default function NavItem({ icon: Icon, label, active, onClick, status }: NavItemProps) {
  return (
    <button onClick={onClick} className="...">
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate flex-1 text-left">{label}</span>
      {status && (
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            status === 'active' ? 'bg-state-ok animate-light-blink' :
            status === 'processing' ? 'bg-neon animate-render-pulse' :
            'bg-text-tertiary'
          }`}
        />
      )}
    </button>
  );
}
```

#### 3.4 添加悬停光效
**文件：** `src/components/Sidebar/NavItem.tsx`

**增强内容：**
```tsx
<button className="... group relative">
  {/* 内容 */}
  <Icon className="..." />
  <span>{label}</span>

  {/* 悬停光晕效果 */}
  <div className="
    absolute inset-0 rounded-lg
    bg-keyLight opacity-0 group-hover:opacity-10
    transition-opacity duration-200
    pointer-events-none
  " />
</button>
```

---

## 📊 修复优先级总结

### Phase 1: 紧急修复（本周完成）
- ✅ 创建 ButtonScene 组件（2 小时）
- ✅ 替换内联按钮样式（1 小时）
- ✅ 修复边框色不一致（30 分钟）
- ✅ 统一 z-index token（1 小时）

**总耗时：** ~4.5 小时
**影响范围：** Sidebar.tsx、Button.tsx、tailwind.config.js

### Phase 2: 架构优化（下周完成）
- ✅ 拆分 NavItem 组件（2 小时）
- ✅ 拆分 UserProfile 组件（2 小时）
- ✅ 拆分 SidebarHeader 组件（1 小时）
- ✅ 重构 Sidebar 主组件（2 小时）

**总耗时：** ~7 小时
**影响范围：** Sidebar/ 目录结构

### Phase 3: 高级增强（本月完成）
- ✅ 添加 Camera Pan 动画（1 小时）
- ✅ 使用电影术语文案（1 小时）
- ✅ 添加状态指示器（2 小时）
- ✅ 添加悬停光效（1 小时）

**总耗时：** ~5 小时
**影响范围：** Sidebar/、i18n.ts、tailwind.config.js

---

## 🎯 关键改进点

### 1. 组件复用
**现状：** 按钮样式直接内联
**目标：** 100% 复用设计系统组件

### 2. 视觉一致性
**现状：** 边框色、遮罩层未使用 token
**目标：** 100% 使用 design-tokens.ts

### 3. 架构清晰
**现状：** 单文件 170 行
**目标：** 拆分为 5 个组件，主文件 < 100 行

### 4. 品牌语言
**现状：** 中性技术术语
**目标：** 电影导演语气

---

## 📝 Checklist

### Phase 1
- [ ] 创建 `ButtonScene` 组件
- [ ] 替换 L138-145 按钮
- [ ] 替换 L149-155 按钮
- [ ] 修复 L103 边框色
- [ ] 扩展 `tailwind.config.js` zIndex
- [ ] 更新 L61、L67、L80 z-index 类名

### Phase 2
- [ ] 创建 `Sidebar/NavItem.tsx`
- [ ] 创建 `Sidebar/UserProfile.tsx`
- [ ] 创建 `Sidebar/SidebarHeader.tsx`
- [ ] 创建 `Sidebar/LoginPrompt.tsx`
- [ ] 重构 `Sidebar.tsx`
- [ ] 创建 `Sidebar/index.ts`

### Phase 3
- [ ] 添加 `cameraPan` 动画到 Tailwind
- [ ] 更新 i18n 文案为电影术语
- [ ] 为 NavItem 添加状态指示器
- [ ] 为 NavItem 添加悬停光效
- [ ] 测试所有交互状态

---

## 🎬 总结

Sidebar 组件在**视觉规范**和**排版图标**方面表现良好（8/10），但在**组件复用**和**结构清晰度**方面需要改进（6/10）。

**核心问题：**
1. 未复用设计系统组件（Button）
2. 缺少组件拆分（NavItem、UserProfile）
3. 未使用电影术语（品牌语言）
4. 部分 token 未对齐（边框色、遮罩层、z-index）

**修复后预期：**
- 组件一致性：6/10 → **9/10**
- 可复用性：6/10 → **9/10**
- 综合评分：7/10 → **8.5/10**

---

**审查人员签名：** Claude Code Agent
**下次审查日期：** 2025-11-04（Phase 1 修复后）
