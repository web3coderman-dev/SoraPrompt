import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, Shield, LogIn, Moon, Sun, Crown, Cloud, CloudOff, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { LoginPrompt } from './LoginPrompt';
import { SettingsSync, type SyncStatus } from '../lib/settingsSync';
import type { Language } from '../lib/i18n';
import type { SupportedLanguage } from '../lib/openai';
import { LANGUAGES } from '../lib/openai';

const interfaceLanguages: { code: Language; name: string }[] = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ko', name: '한국어' },
];

const outputLanguages: { code: SupportedLanguage; name: string; nameEn: string }[] = [
  { code: 'auto', name: '自动匹配', nameEn: 'Auto Match' },
  ...LANGUAGES.map(lang => ({
    code: lang.code,
    name: lang.nativeName,
    nameEn: lang.name
  }))
];

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, signInWithGoogle } = useAuth();
  const { theme, setTheme } = useTheme();
  const { subscription } = useSubscription();
  const [outputLanguage, setOutputLanguage] = useState<SupportedLanguage>('auto');
  const [saved, setSaved] = useState(false);
  const [linking, setLinking] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const savedOutputLang = localStorage.getItem('output-language') as SupportedLanguage;
    if (savedOutputLang) {
      setOutputLanguage(savedOutputLang);
    }

    const initialStatus = SettingsSync.getSyncStatus();
    setSyncStatus(initialStatus);

    const lastSync = SettingsSync.getLastSyncTime();
    setLastSynced(lastSync);

    const handleStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ status: SyncStatus }>;
      setSyncStatus(customEvent.detail.status);
      if (customEvent.detail.status === 'success') {
        setLastSynced(new Date());
        setSyncError(null);
      }
    };

    const handleSettingsChanged = async (event: Event) => {
      const customEvent = event as CustomEvent<{ type: string; value: any }>;
      const { type, value } = customEvent.detail;

      if (user) {
        setSyncing(true);
        let success = false;

        if (type === 'language') {
          success = await SettingsSync.updateSetting(user.id, 'interface_language', value);
        } else if (type === 'theme') {
          success = await SettingsSync.updateSetting(user.id, 'theme', value);
        } else if (type === 'output-language') {
          success = await SettingsSync.updateSetting(user.id, 'output_language', value);
        }

        if (!success) {
          setSyncError(language === 'zh' ? '同步失败' : 'Sync failed');
        }
        setSyncing(false);
      }
    };

    window.addEventListener('sync-status-changed', handleStatusChange);
    window.addEventListener('settings-changed', handleSettingsChanged);

    return () => {
      window.removeEventListener('sync-status-changed', handleStatusChange);
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, [user, language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showSavedMessage();
  };

  const handleOutputLanguageChange = async (lang: SupportedLanguage) => {
    setOutputLanguage(lang);
    localStorage.setItem('output-language', lang);
    showSavedMessage();

    window.dispatchEvent(new CustomEvent('settings-changed', {
      detail: { type: 'output-language', value: lang }
    }));
  };

  const handleManualSync = async () => {
    if (!user) return;

    setSyncing(true);
    setSyncError(null);

    const result = await SettingsSync.manualSync(user.id);

    if (result.success) {
      setLastSynced(new Date());
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: language === 'zh' ? '设置已同步到云端' : 'Settings synced to cloud',
          type: 'success'
        }
      }));
    } else {
      setSyncError(result.error || (language === 'zh' ? '同步失败' : 'Sync failed'));
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: language === 'zh' ? '同步失败，请稍后重试' : 'Sync failed, please try again',
          type: 'error'
        }
      }));
    }

    setSyncing(false);
  };

  const showSavedMessage = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLinkGoogle = async () => {
    try {
      setLinking(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Error linking Google account:', error);
      setLinking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-gray-900" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.settingsTitle}</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{t.settingsSaved}</span>
        </div>
      )}

      {user && (
        <div className={`mb-6 rounded-lg p-4 border-2 ${
          syncStatus === 'success' ? 'bg-blue-50 border-blue-200' :
          syncStatus === 'error' ? 'bg-red-50 border-red-200' :
          syncStatus === 'syncing' ? 'bg-yellow-50 border-yellow-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {syncStatus === 'syncing' || syncing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              ) : syncStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : syncStatus === 'error' ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Cloud className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {syncStatus === 'syncing' || syncing
                    ? (language === 'zh' ? '正在同步...' : 'Syncing...')
                    : syncStatus === 'success'
                    ? (language === 'zh' ? '云端同步已启用' : 'Cloud sync enabled')
                    : syncStatus === 'error'
                    ? (language === 'zh' ? '同步失败' : 'Sync failed')
                    : (language === 'zh' ? '云端同步' : 'Cloud sync')
                  }
                </p>
                {lastSynced && !syncing && syncStatus !== 'error' && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {language === 'zh' ? '上次同步: ' : 'Last synced: '}
                    {lastSynced.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                )}
                {syncError && (
                  <p className="text-xs text-red-600 mt-0.5">{syncError}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={syncing || syncStatus === 'syncing'}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {language === 'zh' ? '立即同步' : 'Sync Now'}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {language === 'zh'
              ? '设置修改后自动同步到云端，可跨设备访问'
              : 'Settings are automatically synced to cloud and accessible across devices'
            }
          </p>
        </div>
      )}

      {!user && (
        <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CloudOff className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-orange-900">
              {language === 'zh' ? '设置仅保存在本地' : 'Settings saved locally only'}
            </p>
          </div>
          <p className="text-xs text-orange-700">
            {language === 'zh'
              ? '登录以启用云端同步，跨设备保持设置一致'
              : 'Sign in to enable cloud sync and keep settings consistent across devices'
            }
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.settingsLanguage}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interfaceLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  language === lang.code
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && <Check className="w-5 h-5 text-primary-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.themeAppearance}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5" />
                  <span className="font-medium">
                    {t.lightMode}
                  </span>
                </div>
                {theme === 'light' && <Check className="w-5 h-5 text-primary-600" />}
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-primary-600 bg-primary-50 text-primary-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <span className="font-medium">
                    {t.darkMode}
                  </span>
                </div>
                {theme === 'dark' && <Check className="w-5 h-5 text-primary-600" />}
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.settingsOutputLanguage}</h3>
          <p className="text-sm text-gray-600 mb-4">{t.settingsOutputLanguageDesc}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {outputLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleOutputLanguageChange(lang.code)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  outputLanguage === lang.code
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {lang.name}
                  </span>
                  {outputLanguage === lang.code && <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {!user && (
          <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl shadow-md border-2 border-primary-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === 'zh' ? '解锁完整功能' : 'Unlock Full Features'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'zh' ? '登录以享受更多功能' : 'Sign in to enjoy more features'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>{language === 'zh' ? '无限云端存储' : 'Unlimited cloud storage'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span>{language === 'zh' ? '数据安全同步' : 'Secure data sync'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg">
                <Crown className="w-4 h-4 text-purple-600" />
                <span>{language === 'zh' ? '高级功能访问' : 'Premium features'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg">
                <Check className="w-4 h-4 text-green-600" />
                <span>{language === 'zh' ? '更多生成次数' : 'More generations'}</span>
              </div>
            </div>

            <button
              onClick={() => setShowLoginPrompt(true)}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {language === 'zh' ? '立即登录' : 'Sign In Now'}
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'zh' ? '账号与安全' : 'Account & Security'}
            </h3>
          </div>

          {user ? (
            profile?.google_id ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    {language === 'zh' ? 'Google 账号已关联' : 'Google Account Connected'}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {language === 'zh'
                    ? '使用 Google 账号登录可享受安全便捷的体验'
                    : 'Enjoy secure and convenient access with Google'
                  }
                </span>
              </div>
            </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    {language === 'zh' ? '当前状态：邮箱登录' : 'Current Status: Email Login'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {user?.email}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'zh'
                    ? '关联 Google 账号以启用一键登录和云端数据同步'
                    : 'Link your Google account for one-click sign-in and cloud sync'
                  }
                </p>
                <button
                  onClick={handleLinkGoogle}
                  disabled={linking}
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {linking ? (
                  <span>{language === 'zh' ? '关联中...' : 'Linking...'}</span>
                ) : (
                  <span>
                    {language === 'zh' ? '关联 Google 账号' : 'Link Google Account'}
                  </span>
                )}
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-6">
              <LogIn className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                {language === 'zh'
                  ? '登录后查看账号信息'
                  : 'Sign in to view account information'
                }
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {language === 'zh' ? '关于' : 'About'}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Version:</span> 0.1 MVP
            </p>
            <p>
              <span className="font-medium">
                {language === 'zh' ? '技术栈' : 'Tech Stack'}:
              </span>{' '}
              React + Supabase + OpenAI
            </p>
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative max-w-md">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
            >
              ×
            </button>
            <LoginPrompt
              onLoginSuccess={() => setShowLoginPrompt(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
