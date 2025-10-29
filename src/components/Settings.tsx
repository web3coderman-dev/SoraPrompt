import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, Shield, LogIn, Moon, Sun, Crown, Cloud, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { LoginPrompt } from './LoginPrompt';
import { SettingsSync, type SyncStatus } from '../lib/settingsSync';
import type { Language } from '../lib/i18n';
import type { SupportedLanguage } from '../lib/openai';
import { LANGUAGES } from '../lib/openai';
import { Button, OptionButton, GoogleIcon } from './ui';
import { CloudSyncCard } from './CloudSyncCard';
import { FeatureCard } from './FeatureCard';

const getInterfaceLanguages = (t: any): { code: Language; name: string }[] => [
  { code: 'zh', name: t.languageNames.zh },
  { code: 'en', name: t.languageNames.en },
  { code: 'ja', name: t.languageNames.ja },
  { code: 'es', name: t.languageNames.es },
  { code: 'fr', name: t.languageNames.fr },
  { code: 'de', name: t.languageNames.de },
  { code: 'ko', name: t.languageNames.ko },
];

const getOutputLanguages = (): { code: SupportedLanguage }[] => [
  { code: 'auto' },
  ...LANGUAGES.map(lang => ({ code: lang.code }))
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
          setSyncError(t['settings.syncFailed']);
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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    showSavedMessage();
    window.dispatchEvent(new CustomEvent('settings-changed', {
      detail: { type: 'theme', value: newTheme }
    }));
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
          message: t['settings.syncSuccess'],
          type: 'success'
        }
      }));
    } else {
      setSyncError(result.error || t['settings.syncFailed']);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: t['settings.syncErrorRetry'],
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
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <SettingsIcon className="w-8 h-8 text-keyLight" />
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">{t.settingsTitle}</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-state-ok/10 border border-state-ok/30 rounded-lg p-4 flex items-center gap-2 animate-cut-fade">
          <Check className="w-5 h-5 text-state-ok" />
          <span className="text-state-ok font-medium">{t.settingsSaved}</span>
        </div>
      )}

      <CloudSyncCard
        user={user}
        syncStatus={syncStatus}
        syncing={syncing}
        lastSynced={lastSynced}
        syncError={syncError}
        language={language}
        onManualSync={handleManualSync}
      />

      <div className="space-y-8">
        <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6">
          <h3 className="text-xl font-semibold font-display text-text-primary mb-4">{t.settingsLanguage}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getInterfaceLanguages(t).map((lang) => (
              <OptionButton
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                selected={language === lang.code}
              >
                {lang.name}
              </OptionButton>
            ))}
          </div>
        </div>

        <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6">
          <h3 className="text-xl font-semibold font-display text-text-primary mb-4">
            {t.themeAppearance}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <OptionButton
              onClick={() => handleThemeChange('light')}
              selected={theme === 'light'}
              icon={<Sun className="w-5 h-5" />}
            >
              {t.lightMode}
            </OptionButton>

            <OptionButton
              onClick={() => handleThemeChange('dark')}
              selected={theme === 'dark'}
              icon={<Moon className="w-5 h-5" />}
            >
              {t.darkMode}
            </OptionButton>
          </div>
        </div>

        <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6">
          <h3 className="text-xl font-semibold font-display text-text-primary mb-2">{t.settingsOutputLanguage}</h3>
          <p className="text-sm text-text-secondary mb-4">{t.settingsOutputLanguageDesc}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-keyLight/30 scrollbar-track-scene-fillLight">
            {getOutputLanguages().map((lang) => (
              <OptionButton
                key={lang.code}
                onClick={() => handleOutputLanguageChange(lang.code)}
                selected={outputLanguage === lang.code}
                className="!p-3 text-left"
                showCheckmark={true}
              >
                <span className="text-sm truncate">
                  {t.languages && (t.languages as any)[lang.code] ? (t.languages as any)[lang.code] : lang.code}
                </span>
              </OptionButton>
            ))}
          </div>
        </div>

        {!user && (
          <div className="relative bg-gradient-to-r from-keyLight/15 to-neon/15 rounded-xl shadow-depth-md border-2 border-keyLight/30 p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-keyLight/20 to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-keyLight to-neon rounded-full flex items-center justify-center shadow-neon">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-text-primary">
                      {t['settings.unlockTitle']}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t['settings.unlockDesc']}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <FeatureCard
                  icon={Cloud}
                  iconColor="text-keyLight"
                  text={t['settings.featureUnlimitedStorage']}
                />
                <FeatureCard
                  icon={Shield}
                  iconColor="text-state-ok"
                  text={t['settings.featureSecureSync']}
                />
                <FeatureCard
                  icon={Crown}
                  iconColor="text-neon"
                  text={t['settings.featurePremium']}
                />
                <FeatureCard
                  icon={Check}
                  iconColor="text-state-ok"
                  text={t['settings.featureMoreGenerations']}
                />
              </div>

              <Button
                onClick={() => setShowLoginPrompt(true)}
                variant="take"
                size="lg"
                icon={LogIn}
                fullWidth
                className="group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200">
                  {t['settings.signInNow']}
                </span>
              </Button>
            </div>
          </div>
        )}

        {user && (
          <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-keyLight" />
              <h3 className="text-xl font-semibold font-display text-text-primary">
                {t['settings.accountTitle']}
              </h3>
            </div>

            {profile?.google_id ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-state-ok/10 border border-state-ok/30 rounded-lg">
                  <Check className="w-5 h-5 text-state-ok flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {t['settings.googleConnected']}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <GoogleIcon className="w-5 h-5" />
                  <span>
                    {t['settings.googleBenefit']}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-keyLight/10 border border-keyLight/30 rounded-lg">
                  <p className="text-sm font-medium text-text-primary mb-1">
                    {t['settings.emailLoginStatus']}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {user?.email}
                  </p>
                </div>
                <p className="text-sm text-text-secondary">
                  {t['settings.linkGoogleDesc']}
                </p>
                <Button
                  onClick={handleLinkGoogle}
                  disabled={linking}
                  variant="preview"
                  size="lg"
                  fullWidth
                  className="hover:shadow-key transition-shadow duration-300"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span>
                    {linking
                      ? t['settings.linking']
                      : t['settings.linkGoogle']
                    }
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-medium backdrop-blur-sm animate-cut-fade">
          <div className="relative max-w-md animate-modal-enter">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-scene-fill rounded-full shadow-depth-lg flex items-center justify-center text-text-secondary hover:text-text-primary z-10 border-2 border-keyLight/20 hover:border-keyLight/40 transition-all duration-200"
              aria-label={t.closeModal}
            >
              <X className="w-4 h-4" />
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
