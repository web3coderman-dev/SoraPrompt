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
    guest: {
      bg: 'bg-scene-fill',
      text: 'text-text-tertiary',
      border: 'border-border-subtle',
      icon: '👤',
      label: t.tierGuest || 'Guest',
    },
    free: {
      bg: 'bg-scene-fillLight',
      text: 'text-text-secondary',
      border: 'border-keyLight/20',
      icon: '⚪️',
      label: t.tierFree,
    },
    creator: {
      bg: 'bg-gradient-to-r from-[#45E0A2] to-[#3DD598]',
      text: 'text-white',
      border: 'border-[#45E0A2]',
      icon: '⚡️',
      label: t.tierCreator,
    },
    director: {
      bg: 'bg-gradient-to-r from-[#3A6CFF] to-[#8A60FF]',
      text: 'text-white',
      border: 'border-[#3A6CFF]',
      icon: '🎥',
      label: t.tierDirector,
    },
  };

  const config = tierConfig[tier];

  if (!config) {
    console.error(`Unknown subscription tier: ${tier}`);
    return null;
  }

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
