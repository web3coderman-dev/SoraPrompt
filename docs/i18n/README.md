# 国际化 (i18n) 文档

本目录包含 SoraPrompt Studio 多语言支持的相关文档。

## 🌍 支持的语言

- 🇨🇳 中文 (zh)
- 🇺🇸 English (en)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)

## 📚 文档清单

### 快速入门
- **[快速参考](./quick-reference.md)** - i18n 使用快速指南

### 实现文档
- [完成报告](./completion-report.md) - i18n 全面实现报告
- [组件审计](./component-audit.md) - 组件国际化审计
- [文档实现](./docs-implementation.md) - 文档多语言实现
- [Toast 优化](./toast-optimization.md) - Toast 消息国际化优化

### 审计报告
- [文档审计](./docs-complete-audit.md) - 文档国际化完整审计
- [设置审计](./settings-audit.md) - 设置页面国际化审计
- [模态框审计](./modal-audit.md) - 模态框国际化审计

### 问题修复
- [诊断报告](./diagnostic-report.md) - i18n 问题诊断
- [缺失文件修复](./missing-files-fix.md) - 缺失翻译文件修复

## 🛠️ 使用指南

### 添加新翻译
1. 在 `src/lib/i18n.ts` 中添加翻译键
2. 为所有支持的语言添加翻译
3. 在组件中使用 `useLanguage()` 钩子
4. 测试所有语言版本

### 翻译规范
- 保持翻译的准确性和一致性
- 注意文化差异和习惯用语
- 避免直译，追求自然表达
- 保持格式和占位符一致

## 🔗 相关资源

- [组件代码](../../src/components/)
- [i18n 配置](../../src/lib/i18n.ts)
- [用户文档](../../public/docs/)

---

**最后更新**: 2025-10-30
