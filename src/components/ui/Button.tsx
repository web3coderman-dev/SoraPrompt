import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'take' | 'cut' | 'preview' | 'director' | 'scene' | 'rim' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  take: `bg-gradient-to-r from-keyLight to-keyLight-600
         hover:shadow-neon hover:scale-105
         text-white font-display shadow-key
         transition-all duration-300 ease-in-out
         relative overflow-hidden
         before:absolute before:inset-0 before:bg-neon before:opacity-0 hover:before:opacity-20 before:transition-opacity before:duration-300`,
  cut: `bg-state-error/10 border-2 border-state-error
        hover:bg-state-error hover:text-white
        text-state-error font-display
        transition-all duration-200 ease-in-out`,
  preview: `bg-scene-fill border border-border-default
            hover:bg-scene-fillLight hover:border-keyLight
            hover:text-text-primary text-text-secondary font-medium
            transition-all duration-200 ease-in-out`,
  director: `bg-gradient-to-r from-keyLight via-neon to-keyLight
             hover:shadow-neon hover:scale-105
             text-white font-display shadow-key
             transition-all duration-300 ease-in-out
             animate-render-pulse`,
  scene: `bg-scene-fill border border-rimLight/30 hover:border-rimLight/50
          hover:bg-scene-fillLight text-text-primary hover:text-rimLight
          transition-all duration-300 ease-in-out`,
  rim: `bg-gradient-to-r from-rimLight-500 to-rimLight-600
        hover:from-rimLight-600 hover:to-rimLight-700
        text-white shadow-rim
        transition-all duration-300 ease-in-out`,
  secondary: `bg-scene-fill border border-keyLight/20
              hover:bg-scene-fillLight hover:border-keyLight/40
              hover:shadow-light
              text-text-primary font-medium
              transition-all duration-300 ease-in-out`,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
  xl: 'px-8 py-4 text-lg rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'take',
  size = 'lg',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium
    transition-all duration-300
    disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
    active:scale-[0.98]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight focus-visible:ring-offset-2 focus-visible:ring-offset-scene-bg
  `;

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-render-pulse h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};
