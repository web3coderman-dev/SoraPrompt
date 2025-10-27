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
        <div className="bg-scene-fill rounded-lg shadow-sm border border-keyLight/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className={`w-5 h-5 ${isLocalNearLimit ? 'text-state-warning' : 'text-text-secondary'}`} />
              <span className="font-medium text-text-primary">
                {language === 'zh' ? '本地存储' : 'Local Storage'}
              </span>
            </div>
            <span className="text-sm font-semibold font-code text-text-secondary">
              {localCount} / {localLimit}
            </span>
          </div>

          <div className="w-full bg-scene-fillLight rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLocalAtLimit ? 'bg-state-error/100' : isLocalNearLimit ? 'bg-state-warning/100' : 'bg-state-info/100'
              }`}
              style={{ width: `${(localCount / localLimit) * 100}%` }}
            />
          </div>

          {isLocalNearLimit && (
            <div className="mt-3 p-3 bg-state-warning/10 border border-state-warning/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-state-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-state-warning">
                    {isLocalAtLimit
                      ? (language === 'zh' ? '存储空间已满' : 'Storage full')
                      : (language === 'zh' ? '存储空间即将用尽' : 'Storage almost full')
                    }
                  </p>
                  <p className="text-xs text-state-warning mt-1">
                    {language === 'zh'
                      ? '登录后可解锁无限云端存储'
                      : 'Sign in to unlock unlimited cloud storage'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginPrompt(true)}
                className="mt-2 w-full text-sm font-medium text-white bg-state-warning hover:bg-state-warning/80 py-2 px-3 rounded transition-all duration-200"
              >
                {language === 'zh' ? '立即登录' : 'Sign In Now'}
              </button>
            </div>
          )}

          <div className="mt-2 text-xs text-text-tertiary">
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
                className="absolute -top-2 -right-2 w-8 h-8 bg-scene-fill rounded-full shadow-depth-lg flex items-center justify-center text-text-secondary hover:text-text-primary z-10"
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

  const bonusCredits = subscription.bonus_credits || 0;
  const totalAvailable = subscription.remaining_credits + bonusCredits;
  const totalCapacity = subscription.total_credits;
  const percentage = (subscription.remaining_credits / totalCapacity) * 100;
  const isLow = percentage < 20 && bonusCredits === 0;
  const hasBonus = bonusCredits > 0;

  const getColor = () => {
    if (percentage > 50) return 'bg-state-ok/100';
    if (percentage > 20) return 'bg-state-warning';
    return 'bg-state-error/100';
  };

  const getBonusColor = () => 'bg-gradient-to-r from-state-warning to-state-warning/80';

  return (
    <div className="bg-scene-fill rounded-lg shadow-sm border border-keyLight/20 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isLow ? (
            <Battery className="w-5 h-5 text-state-error" />
          ) : (
            <Zap className="w-5 h-5 text-keyLight" />
          )}
          <span className="font-medium text-text-primary">{t.subscriptionCredits}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold font-code text-text-secondary">
            {subscription.remaining_credits} / {subscription.total_credits}
          </span>
          {hasBonus && (
            <span className="text-xs font-medium text-state-warning">
              +{bonusCredits} {language === 'zh' ? '奖励' : 'bonus'}
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-scene-fillLight rounded-full h-2.5 overflow-hidden relative">
        <div
          className={`h-full ${getColor()} transition-all duration-300 absolute left-0`}
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
        {hasBonus && (
          <div
            className={`h-full ${getBonusColor()} transition-all duration-300 absolute left-0 opacity-60`}
            style={{ width: `${Math.max(0, Math.min(100, (bonusCredits / totalCapacity) * 100))}%`, left: `${percentage}%` }}
          />
        )}
      </div>

      {hasBonus && (
        <div className="mt-3 p-3 bg-state-warning/10 border border-state-warning/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-state-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-state-warning">
                {language === 'zh' ? '🎉 注册奖励' : '🎉 Registration Bonus'}
              </p>
              <p className="text-xs text-state-warning mt-1">
                {language === 'zh'
                  ? `恭喜！您获得了 ${bonusCredits} 次额外生成机会`
                  : `Congrats! You got ${bonusCredits} extra generations`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {isLow && (
        <div className="mt-3 p-3 bg-state-error/10 border border-state-error/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-state-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-state-error">
                {language === 'zh' ? 'Credits 即将用尽' : 'Credits running low'}
              </p>
              <p className="text-xs text-state-error mt-1">
                {language === 'zh'
                  ? '考虑升级套餐以获得更多 Credits'
                  : 'Consider upgrading for more credits'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-text-tertiary">
        {subscription.reset_cycle === 'daily' ? (
          <span>{t.subscriptionResetsDaily}</span>
        ) : (
          <span>{t.subscriptionResetsMonthly}</span>
        )}
        {' • '}
        <span className="font-code">{new Date(subscription.renewal_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
