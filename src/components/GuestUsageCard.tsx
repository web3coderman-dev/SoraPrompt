import { Sparkles, Zap } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ProgressBar } from './ui/ProgressBar';

export function GuestUsageCard() {
  const { subscription, isGuest } = useSubscription();
  const { t } = useLanguage();

  if (!isGuest || !subscription) return null;

  const remaining = subscription.remaining_credits;
  const total = subscription.total_credits;

  return (
    <div className="bg-gradient-to-r from-scene-fill via-scene-fillLight to-scene-fill rounded-lg shadow-depth-md border border-keyLight/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-keyLight/5 via-neon/5 to-rimLight/5 animate-pulse" />

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
              {remaining}<span className="text-text-secondary font-normal">/{total}</span>
            </span>
          </div>
        </div>

        <ProgressBar
          value={remaining}
          total={total}
          variant="default"
          size="md"
          animated={true}
          className="mb-3"
        />

        <div className="flex items-center gap-2 px-3 py-2 bg-keyLight/15 border border-keyLight/20 rounded-lg">
          <span className="text-xl">💡</span>
          <p className="text-xs text-text-secondary leading-relaxed flex-1">
            {t['guestMode.cta'] || 'Register for 3 free daily generations!'}
          </p>
        </div>
      </div>
    </div>
  );
}
