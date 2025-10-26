import { LogIn, Crown, Cloud, Zap, Shield } from 'lucide-react';
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
    language === 'zh' ? '☁️ 无限云端存储历史记录' : '☁️ Unlimited cloud history storage',
    language === 'zh' ? '🎯 每日免费生成次数' : '🎯 Daily free generations',
    language === 'zh' ? '🎬 解锁 Director 模式' : '🎬 Unlock Director mode',
    language === 'zh' ? '🔒 数据安全同步' : '🔒 Secure data sync',
  ];

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
        <div className="bg-gradient-to-r from-blue-50 to-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{displayTitle}</p>
                <p className="text-sm text-gray-600">{displayMessage}</p>
              </div>
            </div>
            <Button
              onClick={handleLoginClick}
              className="bg-primary-600 hover:bg-primary-700 text-white flex-shrink-0"
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
        <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <LogIn className="w-5 h-5 text-primary-600 flex-shrink-0" />
          <p className="text-sm text-gray-700 flex-1">{displayMessage}</p>
          <Button
            onClick={handleLoginClick}
            size="sm"
            className="bg-primary-600 hover:bg-primary-700 text-white flex-shrink-0"
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayTitle}</h3>
        <p className="text-gray-600 mb-6">{displayMessage}</p>

        {showBenefits && (
          <div className="mb-6 space-y-3 text-left max-w-md mx-auto">
            {displayBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleLoginClick}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3"
        >
          <LogIn className="w-5 h-5 mr-2" />
          {t.signIn || 'Sign In'}
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          {language === 'zh' ? '登录即表示您同意我们的服务条款' : 'By signing in, you agree to our terms of service'}
        </p>
      </div>
      {showLoginModal && <LoginModal onClose={handleLoginClose} />}
    </>
  );
}
