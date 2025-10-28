import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'neon' | 'keyLight' | 'rimLight';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-keyLight/10 text-keyLight border border-keyLight/30',
  secondary: 'bg-rimLight/10 text-rimLight border border-rimLight/30',
  success: 'bg-state-ok/10 text-state-ok border border-state-ok/30',
  warning: 'bg-state-warning/10 text-state-warning border border-state-warning/30',
  error: 'bg-state-error/10 text-state-error border border-state-error/30',
  info: 'bg-state-info/10 text-state-info border border-state-info/30',
  neutral: 'bg-scene-fillLight text-text-secondary border border-keyLight/10',
  neon: 'bg-neon/10 text-neon border border-neon/30 shadow-neon',
  keyLight: 'bg-keyLight/10 text-keyLight border border-keyLight/30 shadow-sm',
  rimLight: 'bg-rimLight/10 text-rimLight border border-rimLight/30 shadow-sm',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

interface QualityBadgeProps {
  score: number;
  className?: string;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ score, className = '' }) => {
  const { t } = useLanguage();

  const getScoreColor = () => {
    if (score >= 90) return 'bg-state-ok/10 border-state-ok/30 text-state-ok';
    if (score >= 75) return 'bg-state-info/10 border-state-info/30 text-state-info';
    if (score >= 60) return 'bg-state-warning/10 border-state-warning/30 text-state-warning';
    return 'bg-state-error/10 border-state-error/30 text-state-error';
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
        ${getScoreColor()}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="text-sm font-semibold">{t.qualityScore}:</span>
      <span className="text-sm font-bold font-code">{score} / 100</span>
    </div>
  );
};
