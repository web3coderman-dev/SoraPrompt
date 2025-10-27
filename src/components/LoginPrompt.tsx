import { LogIn, Crown, Cloud, Zap, Shield, Check } from 'lucide-react';
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
    language === 'zh' ? '无限云端存储历史记录' : 'Unlimited cloud history storage',
    language === 'zh' ? '每日免费生成次数' : 'Daily free generations',
    language === 'zh' ? '解锁 Director 模式' : 'Unlock Director mode',
    language === 'zh' ? '数据安全同步' : 'Secure data sync',
  ];

  const benefitIcons = [Cloud, Zap, Shield, Crown];

  const displayTitle = title || (language === 'zh' ? '登录以解锁完整功能' : 'Sign in to unlock full features');
  const displayMessage = message || (language === 'zh'
    ? '登录后可享受云端存储、更多生成次数和高级功能'
    : 'Sign in to enjoy cloud storage, more generations, and premium features');
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
      <div className="bg-scene-fill rounded-2xl shadow-key border border-keyLight/20 p-8 text-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-keyLight/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-keyLight to-neon rounded-2xl mb-4 shadow-key">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-2xl font-bold font-display text-text-primary mb-2">{displayTitle}</h3>
          <p className="text-text-secondary mb-6">{displayMessage}</p>

          {showBenefits && (
            <div className="mb-6 space-y-3 text-left max-w-md mx-auto">
              {displayBenefits.map((benefit, index) => {
                const Icon = benefitIcons[index] || Check;
                return (
                  <div key={index} className="flex items-start gap-3 text-sm text-text-secondary">
                    <div className="w-5 h-5 bg-state-ok/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-state-ok" />
                    </div>
                    <span>{benefit}</span>
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
