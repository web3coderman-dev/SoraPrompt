import { LogIn, Crown, Cloud, Zap, Shield, Check, Clapperboard, Palette, Sparkles, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import LoginModal from './LoginModal';
import { useState } from 'react';

interface LoginPromptProps {
  title?: string;
  message?: string;
  benefits?: string[];
  variant?: 'default' | 'compact' | 'inline';
  showBenefits?: boolean;
  onLoginSuccess?: () => void;
}

export function LoginPrompt({
  title,
  message,
  benefits,
  variant = 'default',
  showBenefits = true,
  onLoginSuccess,
}: LoginPromptProps) {
  const { t, language } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const defaultBenefits = [
    t['loginPrompt.benefit1'] || 'Unlimited cloud history storage',
    t['loginPrompt.benefit2'] || 'Daily free generations',
    t['loginPrompt.benefit3'] || 'Unlock Director mode',
    t['loginPrompt.benefit4'] || 'Secure data sync',
  ];

  const benefitIcons = [Clapperboard, Palette, Sparkles, Rocket];

  const displayTitle = title || t['loginPrompt.title'] || 'Sign in to unlock full features';
  const displayMessage = message || t['loginPrompt.message'] || 'Sign in to enjoy cloud storage, more generations, and premium features';
  const displayBenefits = benefits || defaultBenefits;

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <div className="bg-scene-fill border border-keyLight/20 rounded-lg p-4 shadow-depth-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-keyLight rounded-full flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">{displayTitle}</p>
                <p className="text-sm text-text-secondary">{displayMessage}</p>
              </div>
            </div>
            <Button
              onClick={handleLoginClick}
              variant="director"
              className="flex-shrink-0"
            >
              {t.signIn || 'Sign In'}
            </Button>
          </div>
        </div>
        {showLoginModal && <LoginModal onClose={handleLoginClose} />}
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <div className="flex items-center gap-3 p-3 bg-scene-fill border border-keyLight/20 rounded-lg shadow-depth-sm">
          <LogIn className="w-5 h-5 text-keyLight flex-shrink-0" />
          <p className="text-sm text-text-secondary flex-1">{displayMessage}</p>
          <Button
            onClick={handleLoginClick}
            size="sm"
            variant="director"
            className="flex-shrink-0"
          >
            {t.signIn || 'Sign In'}
          </Button>
        </div>
        {showLoginModal && <LoginModal onClose={handleLoginClose} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-scene-fill rounded-2xl shadow-depth-xl border border-keyLight/20 p-8 text-center overflow-hidden relative" role="article" aria-labelledby="login-prompt-title">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-keyLight/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-keyLight to-neon rounded-2xl mb-4 shadow-key">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h3 id="login-prompt-title" className="text-2xl font-bold font-display text-text-primary mb-3">{displayTitle}</h3>
          <p className="text-text-secondary mb-8 leading-relaxed">{displayMessage}</p>

          {showBenefits && (
            <div className="mb-8 space-y-4 text-left max-w-md mx-auto">
              {displayBenefits.map((benefit, index) => {
                const Icon = benefitIcons[index] || Check;
                return (
                  <div key={index} className="flex items-center gap-3 text-base text-text-secondary group">
                    <div className="w-10 h-10 bg-keyLight/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-keyLight/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-keyLight" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                );
              })}
            </div>
          )}

          <Button
            onClick={handleLoginClick}
            variant="director"
            size="lg"
            className="shadow-key"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {t.signIn || 'Sign In'}
          </Button>

          <p className="text-xs text-text-tertiary mt-4">
            {language === 'zh' ? '登录即表示您同意我们的服务条款' : 'By signing in, you agree to our terms of service'}
          </p>
        </div>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginClose} />}
    </>
  );
}
