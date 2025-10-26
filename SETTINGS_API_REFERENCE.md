# 设置模块 API 参考指南

## 快速开始

设置模块已完全迁移至云端存储，以下是使用指南。

---

## 📦 导入服务

```typescript
import { UserSettingsService } from '../lib/userSettings';
import type { UserSettings, UserSettingsUpdate } from '../lib/userSettings';
```

---

## 🔧 API 方法

### 1. 获取用户设置

```typescript
static async getUserSettings(userId: string): Promise<UserSettings | null>
```

**参数：**
- `userId` (string) - 用户 UUID

**返回：**
```typescript
{
  user_id: string;
  interface_language: 'zh' | 'en' | 'ja' | 'es' | 'fr' | 'de' | 'ko';
  output_language: 'auto' | 'en' | 'zh' | ...;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
} | null
```

**示例：**
```typescript
const settings = await UserSettingsService.getUserSettings(user.id);
if (settings) {
  console.log('界面语言:', settings.interface_language);
  console.log('主题:', settings.theme);
}
```

---

### 2. 批量更新设置（UPSERT）

```typescript
static async upsertUserSettings(
  userId: string,
  settings: UserSettingsUpdate
): Promise<UserSettings>
```

**参数：**
- `userId` (string) - 用户 UUID
- `settings` (UserSettingsUpdate) - 要更新的设置
  ```typescript
  {
    interface_language?: Language;
    output_language?: SupportedLanguage;
    theme?: 'light' | 'dark';
  }
  ```

**示例：**
```typescript
const updated = await UserSettingsService.upsertUserSettings(user.id, {
  interface_language: 'zh',
  theme: 'dark'
});
```

---

### 3. 更新界面语言

```typescript
static async updateInterfaceLanguage(
  userId: string,
  language: Language
): Promise<UserSettings>
```

**参数：**
- `userId` (string) - 用户 UUID
- `language` (Language) - 'zh' | 'en' | 'ja' | 'es' | 'fr' | 'de' | 'ko'

**示例：**
```typescript
await UserSettingsService.updateInterfaceLanguage(user.id, 'zh');
```

---

### 4. 更新输出语言

```typescript
static async updateOutputLanguage(
  userId: string,
  language: SupportedLanguage
): Promise<UserSettings>
```

**参数：**
- `userId` (string) - 用户 UUID
- `language` (SupportedLanguage) - 'auto' | 'en' | 'zh' | ...

**示例：**
```typescript
await UserSettingsService.updateOutputLanguage(user.id, 'auto');
```

---

### 5. 更新主题

```typescript
static async updateTheme(
  userId: string,
  theme: 'light' | 'dark'
): Promise<UserSettings>
```

**参数：**
- `userId` (string) - 用户 UUID
- `theme` ('light' | 'dark') - 主题模式

**示例：**
```typescript
await UserSettingsService.updateTheme(user.id, 'dark');
```

---

### 6. 初始化默认设置

```typescript
static async initializeDefaultSettings(
  userId: string
): Promise<UserSettings>
```

**用途：** 为新用户创建默认设置记录

**示例：**
```typescript
const settings = await UserSettingsService.initializeDefaultSettings(user.id);
```

---

## 🎨 在组件中使用

### Context 中使用

```typescript
import { useAuth } from '../contexts/AuthContext';
import { UserSettingsService } from '../lib/userSettings';

function MyComponent() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [syncing, setSyncing] = useState(false);

  // 加载设置
  useEffect(() => {
    if (user?.id) {
      const loadSettings = async () => {
        const settings = await UserSettingsService.getUserSettings(user.id);
        if (settings) {
          setLanguage(settings.interface_language);
        }
      };
      loadSettings();
    }
  }, [user?.id]);

  // 更新设置
  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang); // 立即更新 UI
    
    if (user?.id) {
      try {
        setSyncing(true);
        await UserSettingsService.updateInterfaceLanguage(user.id, lang);
        // 显示成功提示
      } catch (error) {
        // 显示错误提示
      } finally {
        setSyncing(false);
      }
    }
  };

  return (
    <div>
      {syncing && <Spinner />}
      <button onClick={() => handleLanguageChange('zh')}>中文</button>
    </div>
  );
}
```

---

## 🔒 数据库结构

### 表：user_settings

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  interface_language TEXT NOT NULL DEFAULT 'en',
  output_language TEXT NOT NULL DEFAULT 'auto',
  theme TEXT NOT NULL DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 约束

```sql
-- 界面语言约束
ALTER TABLE user_settings
  ADD CONSTRAINT interface_language_check 
  CHECK (interface_language IN ('zh', 'en', 'ja', 'es', 'fr', 'de', 'ko'));

-- 主题约束
ALTER TABLE user_settings
  ADD CONSTRAINT theme_check 
  CHECK (theme IN ('light', 'dark'));
```

### 索引

```sql
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_updated_at ON user_settings(updated_at DESC);
```

---

## 🔐 安全策略（RLS）

所有策略都确保用户只能访问自己的数据：

```sql
-- SELECT: 用户可以查看自己的设置
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: 用户可以插入自己的设置
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 用户可以更新自己的设置
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 用户可以删除自己的设置
CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## ⚠️ 错误处理

### 常见错误

```typescript
try {
  await UserSettingsService.updateTheme(user.id, 'dark');
} catch (error) {
  if (error.code === 'PGRST301') {
    // 未认证
    console.error('用户未登录');
  } else if (error.code === 'PGRST116') {
    // 权限不足（RLS 策略拒绝）
    console.error('没有权限访问此数据');
  } else if (error.message.includes('network')) {
    // 网络错误
    console.error('网络连接失败，请检查网络');
  } else {
    // 其他错误
    console.error('更新设置失败:', error);
  }
}
```

### 错误处理最佳实践

```typescript
const handleUpdateSettings = async (updates: UserSettingsUpdate) => {
  if (!user?.id) {
    setError('请先登录');
    return;
  }

  try {
    setSyncing(true);
    setError(null);
    
    await UserSettingsService.upsertUserSettings(user.id, updates);
    
    // 成功
    setSuccess('设置已同步至云端');
    setTimeout(() => setSuccess(null), 2000);
  } catch (error) {
    console.error('Sync error:', error);
    setError('同步失败，请重试');
  } finally {
    setSyncing(false);
  }
};
```

---

## 🌐 直接使用 Supabase 客户端

如果需要更灵活的查询，可以直接使用 Supabase 客户端：

```typescript
import { supabase } from '../lib/supabase';

// 查询
const { data, error } = await supabase
  .from('user_settings')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle();

// 插入/更新
const { data, error } = await supabase
  .from('user_settings')
  .upsert({
    user_id: user.id,
    interface_language: 'zh',
    theme: 'dark'
  })
  .select()
  .single();

// 使用 RPC 函数
const { data, error } = await supabase.rpc('upsert_user_settings', {
  p_user_id: user.id,
  p_interface_language: 'zh',
  p_theme: 'dark'
});
```

---

## 📊 类型定义

```typescript
// 用户设置完整类型
export type UserSettings = {
  user_id: string;
  interface_language: Language;
  output_language: SupportedLanguage;
  theme: 'light' | 'dark';
  created_at: string;
  updated_at: string;
};

// 更新设置类型（所有字段可选）
export type UserSettingsUpdate = {
  interface_language?: Language;
  output_language?: SupportedLanguage;
  theme?: 'light' | 'dark';
};

// 界面语言类型
export type Language = 'zh' | 'en' | 'ja' | 'es' | 'fr' | 'de' | 'ko';

// 输出语言类型
export type SupportedLanguage = 
  | 'auto'
  | 'en' | 'zh' | 'ja' | 'es' | 'fr' | 'de' | 'ko'
  | 'ar' | 'pt' | 'ru' | 'it' | 'nl' | 'pl' | 'tr'
  | 'vi' | 'th' | 'id' | 'hi' | 'uk' | 'cs' | 'ro'
  | 'da' | 'fi' | 'sv' | 'no' | 'el' | 'hu' | 'he';
```

---

## 🚀 最佳实践

### 1. 使用乐观更新

```typescript
const handleChange = async (newValue) => {
  // 立即更新 UI（乐观更新）
  setLocalValue(newValue);
  
  // 后台同步到云端
  try {
    await UserSettingsService.updateSomething(user.id, newValue);
  } catch (error) {
    // 同步失败，回滚到旧值
    setLocalValue(oldValue);
    showError('同步失败');
  }
};
```

### 2. 显示同步状态

```typescript
const [syncing, setSyncing] = useState(false);

return (
  <div>
    {syncing && <div>同步中...</div>}
    <button onClick={handleUpdate} disabled={syncing}>
      保存
    </button>
  </div>
);
```

### 3. 处理未登录用户

```typescript
const handleUpdate = async (value) => {
  if (!user?.id) {
    // 未登录用户：只更新本地状态
    setLocalValue(value);
    showWarning('登录后设置将同步至云端');
    return;
  }
  
  // 登录用户：同步到云端
  await UserSettingsService.updateSomething(user.id, value);
};
```

### 4. 监听用户登录状态

```typescript
useEffect(() => {
  if (user?.id) {
    // 用户登录，加载云端设置
    loadCloudSettings();
  } else {
    // 用户登出，使用默认设置
    resetToDefaults();
  }
}, [user?.id]);
```

---

## 📚 相关文档

- **详细文档**: `SETTINGS_CLOUD_STORAGE.md`
- **验证报告**: `SETTINGS_CLOUD_MIGRATION_VERIFICATION.md`
- **数据库迁移**: `supabase/migrations/20251027000000_create_user_settings.sql`
- **服务代码**: `src/lib/userSettings.ts`

---

## 💡 快速示例

### 完整示例：设置页面

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserSettingsService } from '../lib/userSettings';
import type { Language } from '../lib/i18n';

export default function SettingsPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 加载设置
  useEffect(() => {
    if (user?.id) {
      const loadSettings = async () => {
        try {
          const settings = await UserSettingsService.getUserSettings(user.id);
          if (settings) {
            setLanguage(settings.interface_language);
            setTheme(settings.theme);
          }
        } catch (err) {
          console.error('Failed to load settings:', err);
        }
      };
      loadSettings();
    }
  }, [user?.id]);

  // 更新语言
  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang); // 立即更新 UI
    
    if (!user?.id) {
      setError('请先登录');
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      await UserSettingsService.updateInterfaceLanguage(user.id, lang);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Sync error:', err);
      setError('同步失败，请重试');
    } finally {
      setSyncing(false);
    }
  };

  // 更新主题
  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    
    if (!user?.id) return;

    try {
      setSyncing(true);
      await UserSettingsService.updateTheme(user.id, newTheme);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('同步失败');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      {/* 状态指示器 */}
      {syncing && <div className="status">同步中...</div>}
      {success && <div className="success">已同步至云端</div>}
      {error && <div className="error">{error}</div>}
      
      {/* 语言选择 */}
      <div>
        <h3>界面语言</h3>
        <button onClick={() => handleLanguageChange('zh')}>中文</button>
        <button onClick={() => handleLanguageChange('en')}>English</button>
      </div>
      
      {/* 主题选择 */}
      <div>
        <h3>主题</h3>
        <button onClick={() => handleThemeChange('light')}>亮色</button>
        <button onClick={() => handleThemeChange('dark')}>暗色</button>
      </div>
    </div>
  );
}
```

---

**最后更新:** 2025-10-27  
**版本:** 1.0.0
