# SoraPrompt Studio 文档中心

欢迎来到 SoraPrompt Studio 项目文档中心。本文档库包含了项目的设计规范、功能说明、开发指南和历史记录。

## 📚 文档导航

### 🎨 设计系统 (Design System)
设计规范、主题配置和视觉指南。

- **[设计系统总览](./design-system/design-system.md)** - 完整的设计系统规范
- [设计示例](./design-system/design-examples.md) - 组件设计示例
- [主题对比](./design-system/theme-comparison.md) - 明暗主题对比说明
- [归档文档](./design-system/) - 历史审计和修复报告

### ✨ 功能实现 (Features)
主要功能的实现文档和技术说明。

- **[订阅系统](./features/subscription-implementation.md)** - 订阅功能实现
  - [订阅 UX 设计](./features/subscription-ux-design.md)
  - [订阅 UX 实现](./features/subscription-ux-implementation.md)
- **[访客模式](./features/guest-mode.md)** - 访客功能实现
- **[Stripe 集成](./features/stripe-integration.md)** - 支付系统集成
- **[路由系统](./features/routing.md)** - 路由实现说明
- **[亮色模式](./features/light-mode.md)** - 亮色主题实现
  - [亮色模式总结（中文）](./features/light-mode-summary-zh.md)

### 🌍 国际化 (i18n)
多语言支持的实现和维护文档。

- **[国际化快速参考](./i18n/quick-reference.md)** - i18n 使用指南
- [完成报告](./i18n/completion-report.md) - i18n 实现完成报告
- [Toast 优化](./i18n/toast-optimization.md) - Toast 国际化优化
- [组件审计](./i18n/component-audit.md) - 组件国际化审计
- [文档审计](./i18n/docs-complete-audit.md) - 文档国际化审计
- [诊断报告](./i18n/diagnostic-report.md) - i18n 问题诊断

### 🔍 组件审计 (Audits)
组件设计审计报告和修复记录。

- [认证模态框审计](./audits/auth-modal-design-audit.md)
- [页脚审计](./audits/footer-design-audit.md)
- [侧边栏审计](./audits/sidebar-design-audit.md)
- [历史页面审计](./audits/history-page-design-audit.md)
- [新建项目页面审计](./audits/new-project-page-audit.md)
- [设置页面审计](./audits/settings-page-audit.md)
- [访客使用卡片审计](./audits/guest-usage-card-audit.md)
- [复选框合规审计](./audits/checkbox-design-compliance.md)

### 🐛 Bug 修复 (Bug Fixes)
问题修复记录和优化报告。

#### 认证相关
- [认证模态框条款复选框](./bug-fixes/auth-modal-terms-checkbox.md)
- [认证模态框条款](./bug-fixes/auth-modal-terms.md)
- [登录卡片优化](./bug-fixes/login-card.md)
- [登录模态框条款链接](./bug-fixes/login-modal-terms-links.md)
- [Director 模式登录提示](./bug-fixes/director-mode-login-prompt.md)

#### Google OAuth 相关
- [Google OAuth 品牌显示](./bug-fixes/google-oauth-brand-display.md)
- [Google OAuth 品牌修复](./bug-fixes/google-oauth-branding.md)
- [Google OAuth 页脚](./bug-fixes/google-oauth-footer.md)

#### 语言选择器相关
- [语言检测持久化](./bug-fixes/language-detection-persistence.md)
- [语言选择器自动检测](./bug-fixes/language-selector-auto-detection.md)
- [语言选择器设计](./bug-fixes/language-selector-design.md)
- [语言选择器定位](./bug-fixes/language-selector-positioning.md)
- [语言选择器向上打开](./bug-fixes/language-selector-upward.md)
- [韩语黑屏修复](./bug-fixes/korean-blackscreen.md)

#### 页脚相关
- [页脚亮色模式](./bug-fixes/footer-light-mode.md)
- [页脚 Logo 集成](./bug-fixes/footer-logo.md)
- [页脚优化](./bug-fixes/footer-optimization.md)
- [页脚标语更新](./bug-fixes/footer-slogan.md)
- [文档页面页脚优化](./bug-fixes/document-pages-footer.md)

#### 布局和视觉优化
- [亮色模式背景](./bug-fixes/light-mode-background.md)
- [Logo 替换](./bug-fixes/logo-replacement.md)
- [新建项目布局调整](./bug-fixes/new-project-layout.md)
- [新建项目页面修复](./bug-fixes/new-project-page.md)
- [页面布局一致性](./bug-fixes/page-layout-consistency.md)
- [页面内边距统一](./bug-fixes/page-padding.md)
- [统一卡片集成](./bug-fixes/unified-card-integration.md)
- [视觉优化总结](./bug-fixes/visual-optimization.md)

#### 访客功能相关
- [访客横幅优化](./bug-fixes/guest-banner.md)
- [访客使用修复](./bug-fixes/guest-usage-fixes.md)

#### 其他
- [创意卡片实现](./bug-fixes/idea-card-implementation.md)
- [创意卡片视觉优化](./bug-fixes/idea-card-visual.md)

### 🚀 优化 (Optimization)
性能和体验优化相关文档。

- [第二阶段优化](./optimization/phase-2.md) - 项目第二阶段优化计划

### ⚙️ 设置和部署 (Setup & Deployment)
项目设置、部署和配置指南。

- **[项目设置](./setup/README.md)** - 项目初始化和配置
- **[Google OAuth 设置](./setup/google-oauth-setup.md)** - Google OAuth 配置指南

#### 部署相关
- [部署快速开始](./deployment/QUICK-START.md) - 快速部署指南
- [Bolt 域名修复](./deployment/BOLT-DOMAIN-FIX.md) - Bolt 托管域名问题解决
- [域名配置](./deployment/domain-configuration.md) - 自定义域名配置
- [域名设置快速指南](./deployment/DOMAIN-SETUP-QUICK.md)
- [OAuth 域名设置](./deployment/OAUTH-DOMAIN-SETUP.md)
- [Google 验证指南](./deployment/google-verification-guide.md)
- [域名验证](./deployment/verification.md)

#### 订阅文档
- [订阅说明](./subscription.md) - 订阅系统用户文档

---

## 📖 用户文档 (User Documentation)

用户文档支持多语言，位于 `/public/docs/` 目录：

- **中文 (zh)**: `/public/docs/zh/`
- **English (en)**: `/public/docs/en/`
- **日本語 (ja)**: `/public/docs/ja/`
- **한국어 (ko)**: `/public/docs/ko/`
- **Español (es)**: `/public/docs/es/`
- **Français (fr)**: `/public/docs/fr/`
- **Deutsch (de)**: `/public/docs/de/`

每种语言包含：
- `quick-start.md` - 快速开始指南
- `features.md` - 功能说明
- `faq.md` - 常见问题
- `changelog.md` - 更新日志

---

## 🏗️ 项目结构

```
docs/
├── README.md                    # 本文件
├── design-system/               # 设计系统
├── features/                    # 功能实现
├── i18n/                        # 国际化
├── audits/                      # 组件审计
├── bug-fixes/                   # Bug 修复
├── optimization/                # 优化
├── setup/                       # 设置指南
├── deployment/                  # 部署指南
└── subscription.md              # 订阅文档
```

---

## 📝 文档规范

### 命名规范
- 使用小写字母和连字符（kebab-case）
- 英文命名优先
- 清晰描述文档内容

### 文档结构
- 使用 Markdown 格式
- 合理使用标题层级（h1-h4）
- 添加目录（TOC）便于导航
- 包含必要的代码示例和截图

### 维护原则
- 及时更新过时内容
- 归档历史文档而非删除
- 为归档文档添加明确标记

---

## 🔗 相关链接

- [项目主页](https://soraprompt.studio)
- [GitHub 仓库](#)
- [问题追踪](#)

---

**最后更新**: 2025-10-30
