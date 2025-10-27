import { UserPlus, Sparkles } from 'lucide-react';
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
    if (percentage > 50) return 'bg-state-ok';
    if (percentage > 0) return 'bg-state-warning';
    return 'bg-state-error';
  };

  const handleRegister = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-keyLight/10 via-neon/10 to-rimLight/10 border-b border-keyLight/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon animate-light-blink" />
              <span className="text-sm font-medium text-text-primary">
                {t['guestMode.title'] || '🎭 Guest Mode'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-text-secondary">
                {t['guestMode.remaining'] || 'Trial credits'}:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {remaining}/{total}
                </span>
                <div className="w-24 h-2 bg-scene-fillLight rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs text-text-secondary hidden sm:block">
              {t['guestMode.cta'] || 'Register for 3 free daily generations!'}
            </p>
            <Button
              variant="gradient"
              size="sm"
              icon={UserPlus}
              onClick={handleRegister}
              className="shadow-neon"
            >
              {t['guestMode.registerButton'] || 'Free Register'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
