# 产品文档页面 i18n 快速参考指南

## 🎯 快速诊断

如果产品文档页面的翻译显示不正确，请按以下步骤排查：

### 步骤 1: 清除浏览器缓存

**最常见的问题原因是浏览器缓存**

```bash
# Chrome / Edge
Ctrl + Shift + Delete（Windows）
Cmd + Shift + Delete（Mac）

# 或直接强制刷新
Ctrl + F5（Windows）
Cmd + Shift + R（Mac）
```

### 步骤 2: 检查当前语言设置

1. 打开浏览器开发者工具（F12）
2. 在 Console 中输入：
```javascript
localStorage.getItem('app-language')
```
3. 确认返回值是否为预期语言（zh/en/ja/ko/de/fr/es）

### 步骤 3: 验证翻译键

在浏览器 Console 中运行：

```javascript
// 打开 React DevTools
// 找到 LanguageContext.Provider
// 查看 value.t 对象

// 或在组件内添加临时 console.log
console.log(t['docs.title']);
console.log(t['docs.quickStart']);
```

### 步骤 4: 重新构建项目

```bash
rm -rf dist/
npm run build
```

## 📋 所有语言的翻译对照

### "产品文档" / "Product Documentation"

| 语言 | 翻译 |
|------|------|
| 中文 (zh) | 产品文档 |
| English (en) | Product Documentation |
| 日本語 (ja) | 製品ドキュメント |
| 한국어 (ko) | 제품 문서 |
| Deutsch (de) | Produktdokumentation |
| Français (fr) | Documentation du Produit |
| Español (es) | Documentación del Producto |

### "快速开始" / "Quick Start"

| 语言 | 翻译 |
|------|------|
| 中文 (zh) | 快速开始 |
| English (en) | Quick Start |
| 日本語 (ja) | クイックスタート |
| 한국어 (ko) | 빠른 시작 |
| Deutsch (de) | Schnellstart |
| Français (fr) | Démarrage Rapide |
| Español (es) | Inicio Rápido |

### "功能说明" / "Features"

| 语言 | 翻译 |
|------|------|
| 中文 (zh) | 功能说明 |
| English (en) | Features |
| 日本語 (ja) | 機能概要 |
| 한국어 (ko) | 기능 |
| Deutsch (de) | Funktionen |
| Français (fr) | Fonctionnalités |
| Español (es) | Características |

### "常见问题" / "FAQ"

| 语言 | 翻译 |
|------|------|
| 中文 (zh) | 常见问题 |
| English (en) | FAQ |
| 日本語 (ja) | よくある質問 |
| 한국어 (ko) | 자주 묻는 질문 |
| Deutsch (de) | Häufig Gestellte Fragen |
| Français (fr) | FAQ |
| Español (es) | Preguntas Frecuentes |

### "更新日志" / "Changelog"

| 语言 | 翻译 |
|------|------|
| 中文 (zh) | 更新日志 |
| English (en) | Changelog |
| 日本語 (ja) | 変更履歴 |
| 한국어 (ko) | 변경 로그 |
| Deutsch (de) | Änderungsprotokoll |
| Français (fr) | Journal des Modifications |
| Español (es) | Registro de Cambios |

## 🔧 代码审计结果

### ✅ 所有检查项通过

- ✅ i18n.ts 包含全部 7 种语言的 13 个 docs 翻译键（共 91 条）
- ✅ DocsSidebar 正确使用翻译键
- ✅ DocsMobileNav 正确使用翻译键
- ✅ DocsLayout 正确使用翻译键
- ✅ DocsPage 正确使用翻译键
- ✅ LanguageContext 正确传递翻译对象
- ✅ 所有组件都有 fallback 值
- ✅ 项目构建成功，无错误

### 📍 翻译键位置

**i18n.ts 文件中的位置：**
- 中文 (zh): 第 467-479 行
- English (en): 第 1013-1025 行
- 日本語 (ja): 第 1497-1509 行
- Español (es): 第 1981-1993 行
- Français (fr): 第 2465-2477 行
- Deutsch (de): 第 2949-2961 行
- 한국어 (ko): 第 3434-3446 行

## 🧪 快速测试

### 测试方法

1. 打开设置页面
2. 切换到目标语言（如日语）
3. 导航到产品文档页面 (/docs)
4. 检查以下内容是否正确显示：
   - 左侧边栏标题
   - 导航项（快速开始、功能、常见问题、更新日志）
   - 移动端页面标题

### 预期结果

**日语示例：**
- 侧边栏标题：製品ドキュメント
- 导航项：
  - クイックスタート
  - 機能概要
  - よくある質問
  - 変更履歴

**韩语示例：**
- 侧边栏标题：제품 문서
- 导航项：
  - 빠른 시작
  - 기능
  - 자주 묻는 질문
  - 변경 로그

## 💡 常见问题

### Q: 为什么切换语言后页面没有更新？

**A:** 可能是浏览器缓存。请：
1. 强制刷新页面（Ctrl+F5 或 Cmd+Shift+R）
2. 清除浏览器缓存
3. 尝试隐私/无痕模式

### Q: 为什么某些语言显示英文？

**A:** 检查两个可能的原因：
1. 翻译键是否正确？（应为 `docs.title` 不是 `doc.title`）
2. Fallback 机制是否正常？（代码中有 `|| 'English text'`）

### Q: 如何添加新的翻译键？

**A:**
1. 在 `src/lib/i18n.ts` 的所有 7 种语言中添加相同的键
2. 在组件中使用 `t['新键名']`
3. 重新构建项目

## 📞 需要帮助？

如果问题持续存在：

1. 查看完整诊断报告：`DOCS_I18N_DIAGNOSTIC_REPORT.md`
2. 检查浏览器控制台是否有错误
3. 使用 React DevTools 检查 Context 值
4. 确认 localStorage 中的语言设置

---

**文档版本：** 1.0
**最后更新：** 2025年10月29日
**状态：** 所有代码审计通过 ✅
