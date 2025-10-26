import React from 'react';
import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
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
  const getScoreColor = () => {
    if (score >= 90) return 'bg-green-50 border-green-200 text-green-700';
    if (score >= 75) return 'bg-blue-50 border-blue-200 text-blue-700';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    return 'bg-red-50 border-red-200 text-red-700';
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
        ${getScoreColor()}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <span className="text-sm font-semibold">质量评分:</span>
      <span className="text-sm font-bold">{score} / 100</span>
    </div>
  );
};
