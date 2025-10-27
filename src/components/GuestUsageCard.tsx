import { Sparkles, Zap } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';

export function GuestUsageCard() {
  const { subscription, isGuest } = useSubscription();
  const { t } = useLanguage();

  if (!isGuest || !subscription) return null;

  const remaining = subscription.remaining_credits;
  const total = subscription.total_credits;
  const percentage = (remaining / total) * 100;

  const getProgressColor = () => {
    if (percentage > 50) return 'from-state-ok/80 to-state-ok';
    if (percentage > 0) return 'from-state-warning/80 to-state-warning';
    return 'from-state-error/80 to-state-error';
  };

  const getGlowColor = () => {
    if (percentage > 50) return 'shadow-[0_0_20px_rgba(69,224,162,0.3)]';
    if (percentage > 0) return 'shadow-[0_0_20px_rgba(255,183,77,0.3)]';
    return 'shadow-[0_0_20px_rgba(255,94,94,0.3)]';
  };

  return (
    <div className="bg-gradient-to-r from-scene-fill via-scene-fillLight to-scene-fill rounded-lg shadow-sm border border-keyLight/20 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-keyLight/5 via-neon/5 to-rimLight/5 animate-[pulse_3s_ease-in-out_infinite]" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 bg-neon/20 rounded-full blur-md animate-light-blink" />
              <Sparkles className="relative w-5 h-5 text-neon drop-shadow-[0_0_8px_rgba(138,96,255,0.6)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-display font-medium text-text-primary tracking-wide">
                  {t['guestMode.title'] || 'Guest Mode'}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-neon/10 text-neon border border-neon/20 rounded-full">
                  TRIAL
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
              {remaining}<span className="text-text-secondary font-normal">/{total}</span>
            </span>
          </div>
        </div>

        <div className="relative w-full h-2 bg-scene-background rounded-full overflow-hidden border border-border-subtle mb-3">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out ${getGlowColor()} relative`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-keyLight/5 border border-keyLight/10 rounded-lg">
          <span className="text-xl">💡</span>
          <p className="text-xs text-text-secondary leading-relaxed flex-1">
            {t['guestMode.cta'] || 'Register for 3 free daily generations!'}
          </p>
        </div>
      </div>
    </div>
  );
}
