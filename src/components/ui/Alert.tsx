import React from 'react';
import { LucideIcon } from 'lucide-react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'bg-state-ok/10 border-state-ok/30 text-state-ok',
  error: 'bg-state-error/10 border-state-error/30 text-state-error',
  warning: 'bg-state-warning/10 border-state-warning/30 text-state-warning',
  info: 'bg-state-info/10 border-state-info/30 text-state-info',
};

export const Alert: React.FC<AlertProps> = ({
  variant,
  children,
  icon: Icon,
  className = '',
}) => {
  return (
    <div
      className={`
        rounded-lg border p-4 flex items-start gap-3 animate-slide-down
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="alert"
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
      <div className="text-sm flex-1">{children}</div>
    </div>
  );
};
