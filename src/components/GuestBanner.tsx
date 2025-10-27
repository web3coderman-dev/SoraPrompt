import { UserPlus, Sparkles, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function GuestBanner() {
  const { subscription, isGuest } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  const handleRegister = () => {
    navigate('/login');
  };

  return (
    <div className="relative bg-gradient-to-r from-scene-fill via-scene-fillLight to-scene-fill border-b border-keyLight/20 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-keyLight/5 via-neon/5 to-rimLight/5 animate-[pulse_3s_ease-in-out_infinite]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
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

            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-keyLight" />
                  <span className="text-base font-display font-bold text-text-primary tabular-nums">
                    {remaining}<span className="text-text-secondary font-normal">/{total}</span>
                  </span>
                </div>
                <div className="relative w-32 h-2 bg-scene-background rounded-full overflow-hidden border border-border-subtle">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out ${getGlowColor()} relative`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-text-secondary hidden sm:block max-w-xs leading-relaxed">
              {t['guestMode.cta'] || 'Register for 3 free daily generations!'}
            </p>
            <Button
              variant="gradient"
              size="sm"
              icon={UserPlus}
              onClick={handleRegister}
              className="shadow-neon hover:scale-105 transition-transform duration-300"
            >
              {t['guestMode.registerButton'] || 'Free Register'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
