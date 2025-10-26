import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Battery, Zap, HardDrive, AlertCircle } from 'lucide-react';
import { PromptStorage } from '../lib/promptStorage';
import { LoginPrompt } from './LoginPrompt';
import { useState } from 'react';

export function UsageCounter() {
  const { subscription, loading } = useSubscription();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const localCount = PromptStorage.getLocalPromptCount();
  const localLimit = 10;
  const isLocalNearLimit = localCount >= 7;
  const isLocalAtLimit = localCount >= localLimit;

  if (!user) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className={`w-5 h-5 ${isLocalNearLimit ? 'text-orange-500' : 'text-gray-600'}`} />
              <span className="font-medium text-gray-900">
                {language === 'zh' ? '本地存储' : 'Local Storage'}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-600">
              {localCount} / {localLimit}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLocalAtLimit ? 'bg-red-500' : isLocalNearLimit ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(localCount / localLimit) * 100}%` }}
            />
          </div>

          {isLocalNearLimit && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">
                    {isLocalAtLimit
                      ? (language === 'zh' ? '存储空间已满' : 'Storage full')
                      : (language === 'zh' ? '存储空间即将用尽' : 'Storage almost full')
                    }
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    {language === 'zh'
                      ? '登录后可解锁无限云端存储'
                      : 'Sign in to unlock unlimited cloud storage'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginPrompt(true)}
                className="mt-2 w-full text-sm font-medium text-orange-700 hover:text-orange-800 bg-orange-100 hover:bg-orange-200 py-2 px-3 rounded transition-colors"
              >
                {language === 'zh' ? '立即登录' : 'Sign In Now'}
              </button>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            {language === 'zh'
              ? '未登录用户最多保存 10 条记录'
              : 'Guest users can save up to 10 records'
            }
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
      </>
    );
  }

  if (loading || !subscription) {
    return null;
  }

  const percentage = (subscription.remaining_credits / subscription.total_credits) * 100;
  const isLow = percentage < 20;

  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isLow ? (
            <Battery className="w-5 h-5 text-red-500" />
          ) : (
            <Zap className="w-5 h-5 text-primary-600" />
          )}
          <span className="font-medium text-gray-900">{t.subscriptionCredits}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">
          {subscription.remaining_credits} / {subscription.total_credits}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>

      {isLow && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                {language === 'zh' ? 'Credits 即将用尽' : 'Credits running low'}
              </p>
              <p className="text-xs text-red-700 mt-1">
                {language === 'zh'
                  ? '考虑升级套餐以获得更多 Credits'
                  : 'Consider upgrading for more credits'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        {subscription.reset_cycle === 'daily' ? (
          <span>{t.subscriptionResetsDaily}</span>
        ) : (
          <span>{t.subscriptionResetsMonthly}</span>
        )}
        {' • '}
        <span>{new Date(subscription.renewal_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
