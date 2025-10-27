import { SubscriptionTier } from '../contexts/SubscriptionContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SubscriptionBadge({ tier, size = 'md', showLabel = true }: SubscriptionBadgeProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const tierConfig = {
    free: {
      bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: '⚪️',
      label: t.tierFree,
    },
    creator: {
      bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
      text: 'text-white',
      border: 'border-green-600',
      icon: '⚡️',
      label: t.tierCreator,
    },
    director: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      text: 'text-white',
      border: 'border-blue-700',
      icon: '🎥',
      label: t.tierDirector,
    },
  };

  const config = tierConfig[tier];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${config.bg} ${config.text} ${config.border}
        ${sizeClasses[size]}
        font-semibold shadow-sm
      `}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
