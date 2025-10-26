import { useSubscription } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Battery, Zap } from 'lucide-react';

export function UsageCounter() {
  const { subscription, loading } = useSubscription();
  const { t } = useLanguage();

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
