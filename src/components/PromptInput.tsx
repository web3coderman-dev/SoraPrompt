import { useState, useEffect } from 'react';
import { Sparkles, Clapperboard, Lock, Zap } from 'lucide-react';
import { type SupportedLanguage, detectLanguageClient } from '../lib/openai';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Modal } from './ui/Modal';
import { LoginPrompt } from './LoginPrompt';
import { ProgressBar } from './ui/ProgressBar';
import { Divider } from './ui/Divider';

type PromptInputProps = {
  onGenerate: (input: string, mode: 'quick' | 'director', language: SupportedLanguage, detectedInputLanguage: SupportedLanguage) => void;
  isLoading: boolean;
  initialValue?: string;
};

export default function PromptInput({ onGenerate, isLoading, initialValue }: PromptInputProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { subscription, isGuest } = useSubscription();
  const [input, setInput] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (mode: 'quick' | 'director') => {
    if (!user && mode === 'director') {
      setShowLoginPrompt(true);
      return;
    }

    if (input.trim() && !isLoading) {
      const outputLanguage = localStorage.getItem('output-language') as SupportedLanguage || 'auto';

      const detected = await detectLanguageClient(input);

      let language: SupportedLanguage;
      if (outputLanguage === 'auto') {
        language = detected;
      } else {
        language = outputLanguage;
      }

      onGenerate(input, mode, language, detected);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit('quick');
    }
  };

  return (
    <Card variant="idea" className="animate-fade-in">
      <CardBody className="pt-7 pb-5">
        <Textarea
          label={t.inputLabel}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.inputPlaceholder}
          rows={3}
          disabled={isLoading}
          variant="cinematic"
        />
      </CardBody>

      <CardFooter className="flex flex-col sm:flex-row gap-4 pt-5">
        <div className="w-full sm:w-1/2">
          <Button
            variant="take"
            icon={Sparkles}
            onClick={() => handleSubmit('quick')}
            disabled={!input.trim() || isLoading}
            loading={isLoading && !isLoading}
            fullWidth
            size="xl"
            className="h-14"
          >
            {t.quickGenerate}
          </Button>
        </div>

        <div className="relative w-full sm:w-1/2">
          <Button
            variant="director"
            icon={user ? Clapperboard : Lock}
            onClick={() => handleSubmit('director')}
            disabled={!input.trim() || isLoading}
            fullWidth
            size="xl"
            className="h-14"
          >
            {t.directorMode}
          </Button>
        </div>
      </CardFooter>

      {isLoading && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 text-sm text-text-secondary animate-fade-in">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-neon border-t-transparent" />
            <span className="font-code">{t.generating}</span>
          </div>
        </div>
      )}

      {isGuest && subscription && (
        <>
          <Divider className="my-0" />
          <div className="px-6 pb-6 pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon/20 rounded-full blur-md animate-light-blink" />
                    <Sparkles className="relative w-4 h-4 text-neon drop-shadow-[0_0_8px_rgba(138,96,255,0.6)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-display font-medium text-text-primary tracking-wide">
                        {t['guestMode.title'] || 'Guest Mode'}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-neon/10 text-neon border border-neon/20 rounded-full">
                        {t['guestMode.trial'] || 'TRIAL'}
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {t['guestMode.remaining'] || 'Trial credits'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-keyLight" />
                  <span className="text-base font-display font-bold text-text-primary tabular-nums">
                    {subscription.remaining_credits}<span className="text-text-secondary font-normal">/{subscription.total_credits}</span>
                  </span>
                </div>
              </div>

              <ProgressBar
                value={subscription.remaining_credits}
                total={subscription.total_credits}
                variant="cinematic"
                size="md"
                animated={true}
              />

              <div className="flex items-center gap-2 px-3 py-2 bg-keyLight/10 border border-keyLight/20 rounded-lg backdrop-blur-sm">
                <span className="text-xl">💡</span>
                <p className="text-xs text-text-secondary leading-relaxed flex-1">
                  {t['guestMode.cta'] || 'Register for 5 free daily generations!'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        maxWidth="md"
        showCloseButton={true}
        variant="default"
      >
        <LoginPrompt
          title={t.loginPromptDirectorTitle}
          message={t.loginPromptDirectorMessage}
          benefits={[
            t.loginPromptBenefit1,
            t.loginPromptBenefit2,
            t.loginPromptBenefit3,
            t.loginPromptBenefit4,
          ]}
          onLoginSuccess={() => setShowLoginPrompt(false)}
        />
      </Modal>
    </Card>
  );
}
