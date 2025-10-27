import React from 'react';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  total: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const getVariantClass = (percentage: number, variant: ProgressVariant): string => {
  if (variant !== 'default') {
    switch (variant) {
      case 'success':
        return 'from-state-ok/80 to-state-ok';
      case 'warning':
        return 'from-state-warning/80 to-state-warning';
      case 'error':
        return 'from-state-error/80 to-state-error';
    }
  }

  if (percentage > 50) return 'from-state-ok/80 to-state-ok';
  if (percentage > 0) return 'from-state-warning/80 to-state-warning';
  return 'from-state-error/80 to-state-error';
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  total,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / total) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">
            {value} / {total}
          </span>
          <span className="text-sm font-medium text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div className={`relative w-full ${sizeClasses[size]} bg-scene-background rounded-full overflow-hidden border border-border-subtle`}>
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        )}
        <div
          className={`h-full bg-gradient-to-r ${getVariantClass(percentage, variant)} transition-all duration-500 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
        </div>
      </div>
    </div>
  );
};
