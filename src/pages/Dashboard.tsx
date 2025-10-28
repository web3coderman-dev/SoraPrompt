import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import PromptResult from '../components/PromptResult';
import History from '../components/History';
import Settings from '../components/Settings';
import Footer from '../components/Footer';
import { SubscriptionPlans } from '../components/SubscriptionPlans';
import { UsageCounter } from '../components/UsageCounter';
import { UpgradeModal } from '../components/UpgradeModal';
import { RegisterPromptModal } from '../components/RegisterPromptModal';
import { GuestUsageCard } from '../components/GuestUsageCard';
import { ConflictResolutionModal } from '../components/ConflictResolutionModal';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SettingsSync, type UserSettings } from '../lib/settingsSync';
import { shouldPromptRegistration } from '../lib/guestUsage';
import type { Prompt } from '../lib/supabase';
import type { SupportedLanguage } from '../lib/openai';
import { generateSoraPrompt } from '../lib/promptGenerator';
import { improvePrompt, explainPrompt, generatePrompt } from '../lib/openai';
import { PromptStorage } from '../lib/promptStorage';

type View = 'new' | 'history' | 'settings' | 'subscription';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('new');
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [explanation, setExplanation] = useState<string | undefined>();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'credits_out' | 'frequent_use' | 'director_locked'>('credits_out');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerReason, setRegisterReason] = useState<'no_credits' | 'frequent_user' | 'director_locked' | 'history_locked'>('no_credits');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{
    cloudSettings: Omit<UserSettings, 'user_id'>;
    localSettings: Omit<UserSettings, 'user_id'>;
    userId: string;
  } | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();
  const { subscription, isGuest, hasCredits, canUseDirectorMode, deductCredits } = useSubscription();

  useEffect(() => {
    const handleConflict = (event: Event) => {
      const customEvent = event as CustomEvent<{
        cloudSettings: Omit<UserSettings, 'user_id'>;
        localSettings: Omit<UserSettings, 'user_id'>;
        userId: string;
      }>;
      setConflictData(customEvent.detail);
      setShowConflictModal(true);
    };

    window.addEventListener('settings-conflict', handleConflict);
    return () => window.removeEventListener('settings-conflict', handleConflict);
  }, []);

  const handleConflictResolve = async (useCloud: boolean) => {
    if (!conflictData) return;

    const result = await SettingsSync.resolveConflict(
      conflictData.userId,
      useCloud,
      conflictData.cloudSettings,
      conflictData.localSettings
    );

    if (result.success) {
      window.dispatchEvent(new CustomEvent('settings-synced', {
        detail: result.settings
      }));

      const userLang = localStorage.getItem('language') || 'en';
      const message = useCloud
        ? (userLang === 'zh' ? '已采用云端设置' : 'Cloud settings applied')
        : (userLang === 'zh' ? '已采用本地设置并同步' : 'Local settings applied and synced');

      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type: 'success' }
      }));
    }

    setShowConflictModal(false);
    setConflictData(null);
  };

  const handleGenerate = async (
    input: string,
    mode: 'quick' | 'director',
    language: SupportedLanguage,
    detectedInputLanguage: SupportedLanguage
  ) => {
    if (mode === 'director' && !canUseDirectorMode()) {
      if (isGuest) {
        setRegisterReason('director_locked');
        setShowRegisterModal(true);
        return;
      } else {
        setUpgradeReason('director_locked');
        setShowUpgradeModal(true);
        return;
      }
    }

    if (!hasCredits()) {
      if (isGuest) {
        setRegisterReason('no_credits');
        setShowRegisterModal(true);
        return;
      } else {
        setUpgradeReason('credits_out');
        setShowUpgradeModal(true);
        return;
      }
    }

    const shouldPrompt = shouldPromptRegistration();
    if (isGuest && shouldPrompt === 'frequent_user') {
      setRegisterReason('frequent_user');
      setShowRegisterModal(true);
    }

    try {
      setIsGenerating(true);
      setExplanation(undefined);

      const prompt = await generateSoraPrompt(
        input,
        mode,
        language,
        detectedInputLanguage,
        user?.id
      );

      if (user && prompt.id) {
        await deductCredits(prompt.id, mode);
      }

      setCurrentPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert(t['dialogs.generationFailed'] || 'Generation failed, please retry');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (feedback: string) => {
    if (!currentPrompt) return;

    try {
      setIsImproving(true);

      const outputLang = localStorage.getItem('output-language') as SupportedLanguage || 'en';
      const result = await improvePrompt(
        currentPrompt.generated_prompt,
        feedback,
        outputLang
      );

      const updatedPrompt: Prompt = {
        ...currentPrompt,
        generated_prompt: result.prompt,
        quality_score: result.qualityScore,
        updated_at: new Date().toISOString(),
      };

      if (user?.id && currentPrompt.user_id) {
        await PromptStorage.saveToCloud(updatedPrompt, user.id);
      } else {
        PromptStorage.saveLocalPrompt(updatedPrompt);
      }

      setCurrentPrompt(updatedPrompt);
    } catch (error) {
      console.error('Error improving prompt:', error);
      alert(t['dialogs.improvementFailed'] || 'Improvement failed, please retry');
    } finally {
      setIsImproving(false);
    }
  };

  const handleExplain = async () => {
    if (!currentPrompt) return;

    try {
      const outputLang = localStorage.getItem('output-language') as SupportedLanguage || 'en';
      const explanation = await explainPrompt(
        currentPrompt.generated_prompt,
        currentPrompt.intent_data,
        outputLang
      );
      setExplanation(explanation);
    } catch (error) {
      console.error('Error explaining prompt:', error);
      alert(t['dialogs.explanationFailed'] || 'Explanation failed, please retry');
    }
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (!currentPrompt) return;

    try {
      setIsChangingLanguage(true);

      const { prompt, qualityScore } = await generatePrompt(
        currentPrompt.intent_data,
        currentPrompt.style_data,
        currentPrompt.mode,
        language
      );

      const updatedPrompt: Prompt = {
        ...currentPrompt,
        generated_prompt: prompt,
        quality_score: qualityScore,
        updated_at: new Date().toISOString(),
      };

      if (user?.id && currentPrompt.user_id) {
        await PromptStorage.saveToCloud(updatedPrompt, user.id);
      } else {
        PromptStorage.saveLocalPrompt(updatedPrompt);
      }

      setCurrentPrompt(updatedPrompt);
    } catch (error) {
      console.error('Error changing language:', error);
      alert(t['dialogs.languageChangeFailed'] || 'Language change failed, please retry');
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const handlePromptSelected = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setCurrentView('new');
    setExplanation(undefined);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return (
          <div className="p-6 md:p-8 lg:p-12">
            <History onSelectPrompt={handlePromptSelected} />
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 md:p-8 lg:p-12">
            <Settings />
          </div>
        );
      case 'subscription':
        return (
          <div className="p-6 md:p-8 lg:p-12">
            <SubscriptionPlans />
          </div>
        );
      default:
        return (
          <div className="p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-text-primary mb-4 tracking-tight">
                  {t.title}
                </h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">
                  {t.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  <Badge variant="info" size="sm">
                    {t.tagGeneration}
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    {t.tagAssistant}
                  </Badge>
                </div>
              </div>

              <PromptInput
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                initialValue={currentPrompt?.user_input}
              />

              <div className="mt-10">
                {user ? (
                  <UsageCounter />
                ) : (
                  <GuestUsageCard />
                )}
              </div>

              {currentPrompt && (
                <div className="mt-12">
                  <PromptResult
                    prompt={currentPrompt}
                    onImprove={handleImprove}
                    onExplain={handleExplain}
                    onLanguageChange={handleLanguageChange}
                    isImproving={isImproving}
                    isChangingLanguage={isChangingLanguage}
                    explanation={explanation}
                  />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-scene-bg via-scene-fill to-scene-fillLight">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main className="flex-1">
          {renderContent()}
        </main>
        <Footer />
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
        usageData={
          subscription
            ? {
                used: subscription.total_credits - subscription.remaining_credits,
                total: subscription.total_credits,
              }
            : undefined
        }
      />

      <RegisterPromptModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        reason={registerReason}
      />

      {conflictData && (
        <ConflictResolutionModal
          isOpen={showConflictModal}
          cloudSettings={conflictData.cloudSettings}
          localSettings={conflictData.localSettings}
          onResolve={handleConflictResolve}
          onCancel={() => {
            setShowConflictModal(false);
            setConflictData(null);
          }}
        />
      )}
    </div>
  );
}
