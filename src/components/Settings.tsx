import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, Shield, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
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
  const [outputLanguage, setOutputLanguage] = useState<SupportedLanguage>('auto');
  const [saved, setSaved] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    const savedOutputLang = localStorage.getItem('output-language') as SupportedLanguage;
    if (savedOutputLang) {
      setOutputLanguage(savedOutputLang);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showSavedMessage();
  };

  const handleOutputLanguageChange = (lang: SupportedLanguage) => {
    setOutputLanguage(lang);
    localStorage.setItem('output-language', lang);
    showSavedMessage();
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
    <div className="max-w-2xl mx-auto">
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
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>
            ))}
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
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {lang.name}
                  </span>
                  {outputLanguage === lang.code && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'zh' ? '账号与安全' : 'Account & Security'}
            </h3>
          </div>

          {user && profile?.google_id ? (
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
    </div>
  );
}
