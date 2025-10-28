import { useState } from 'react';
import PromptInput from '../components/PromptInput';
import PromptResult from '../components/PromptResult';
import Footer from '../components/Footer';
import { UsageCounter } from '../components/UsageCounter';
import { UpgradeModal } from '../components/UpgradeModal';
import { RegisterPromptModal } from '../components/RegisterPromptModal';
import { GuestUsageCard } from '../components/GuestUsageCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { shouldPromptRegistration } from '../lib/guestUsage';
import type { Prompt } from '../lib/supabase';
import type { SupportedLanguage } from '../lib/openai';
import { generatePrompt, improvePrompt, explainPrompt } from '../lib/openai';
import { PromptStorage } from '../lib/promptStorage';

export default function NewProject() {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [explanation, setExplanation] = useState<string | undefined>();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'credits_out' | 'frequent_use' | 'director_locked'>('credits_out');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerReason, setRegisterReason] = useState<'no_credits' | 'frequent_user' | 'director_locked' | 'history_locked'>('no_credits');
  const { t } = useLanguage();
  const { user } = useAuth();
  const { subscription, isGuest, hasCredits, canUseDirectorMode, deductCredits } = useSubscription();

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
      } else {
        setUpgradeReason('director_locked');
        setShowUpgradeModal(true);
      }
      return;
    }

    if (!hasCredits()) {
      if (isGuest) {
        setRegisterReason('no_credits');
        setShowRegisterModal(true);
      } else {
        setUpgradeReason('credits_out');
        setShowUpgradeModal(true);
      }
      return;
    }

    setIsGenerating(true);
    setCurrentPrompt(null);
    setExplanation(undefined);

    try {
      const result = await generatePrompt(input, mode, language, detectedInputLanguage);
      setCurrentPrompt(result);
      await PromptStorage.savePrompt(result);
      await deductCredits(result.id, mode);

      if (shouldPromptRegistration()) {
        setRegisterReason('frequent_user');
        setShowRegisterModal(true);
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (improvementInput: string) => {
    if (!currentPrompt) return;

    if (!hasCredits()) {
      if (isGuest) {
        setRegisterReason('no_credits');
        setShowRegisterModal(true);
      } else {
        setUpgradeReason('credits_out');
        setShowUpgradeModal(true);
      }
      return;
    }

    setIsImproving(true);
    try {
      const result = await improvePrompt(currentPrompt, improvementInput);
      setCurrentPrompt(result);
      await PromptStorage.savePrompt(result);
      await deductCredits(result.id, result.mode);
    } catch (error) {
      console.error('Error improving prompt:', error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleExplain = async () => {
    if (!currentPrompt) return;

    try {
      const result = await explainPrompt(currentPrompt);
      setExplanation(result);
    } catch (error) {
      console.error('Error explaining prompt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary font-display">
                {t.title}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="keyLight" size="md">{t.tagGeneration}</Badge>
              <Badge variant="rimLight" size="md">{t.tagAssistant}</Badge>
            </div>
          </header>

          <PromptInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {isGuest && <GuestUsageCard />}
          {user && <UsageCounter />}

          {currentPrompt && (
            <PromptResult
              prompt={currentPrompt}
              onImprove={handleImprove}
              isImproving={isImproving}
              onExplain={handleExplain}
              explanation={explanation}
            />
          )}
        </div>
      </div>

      <Footer />

      {showUpgradeModal && (
        <UpgradeModal
          reason={upgradeReason}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {showRegisterModal && (
        <RegisterPromptModal
          reason={registerReason}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}
