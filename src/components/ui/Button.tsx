import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
  take: `bg-gradient-to-br from-[#3961FB] via-[#4A72FF] to-[#5A7FFF]
         hover:from-[#4A72FF] hover:via-[#5B83FF] hover:to-[#6B8FFF]
         hover:scale-[1.02]
         text-white font-display font-semibold
         transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
         relative overflow-hidden
         will-change-transform
         active:scale-[0.98]`,
  cut: `bg-state-error/10 border-2 border-state-error/30
        hover:bg-state-error hover:border-state-error hover:text-white
        text-state-error font-medium
        transition-all duration-300 ease-in-out`,
  preview: `bg-scene-fill border border-border-default
            hover:bg-scene-fillLight hover:border-keyLight
            hover:text-text-primary text-text-secondary font-medium
            transition-all duration-300 ease-in-out`,
  director: `bg-gradient-to-r from-[#3961FB] via-[#8A60FF] to-[#A66BFF]
             bg-[length:200%_100%] animate-gradient-shift
             hover:scale-[1.02]
             text-white font-display font-semibold
             transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
             relative overflow-hidden
             will-change-transform
             active:scale-[0.98]`,
  scene: `bg-scene-fillLight border border-keyLight/10
          hover:bg-scene-fillLight/80 hover:border-keyLight/20
          text-text-secondary hover:text-text-primary font-medium
          transition-all duration-200 ease-in-out`,
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = React.useState(false);

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium
    transition-all duration-300
    disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight focus-visible:ring-offset-2 focus-visible:ring-offset-scene-bg
  `;

  const widthClass = fullWidth ? 'w-full' : '';

  const getShadowStyle = () => {
    if (disabled || loading) return {};

    if (variant === 'take') {
      return {
        boxShadow: isHovered
          ? isDark
            ? '0 6px 16px rgba(57, 97, 251, 0.4), 0 0 32px rgba(57, 97, 251, 0.25)'
            : '0 4px 12px rgba(57, 97, 251, 0.25), 0 0 24px rgba(57, 97, 251, 0.15)'
          : isDark
            ? '0 4px 12px rgba(57, 97, 251, 0.3), 0 0 20px rgba(57, 97, 251, 0.15)'
            : '0 2px 8px rgba(57, 97, 251, 0.2), 0 0 16px rgba(57, 97, 251, 0.1)',
      };
    }

    if (variant === 'director') {
      return {
        boxShadow: isHovered
          ? isDark
            ? '0 6px 16px rgba(138, 96, 255, 0.4), 0 0 32px rgba(138, 96, 255, 0.3)'
            : '0 4px 12px rgba(138, 96, 255, 0.25), 0 0 24px rgba(138, 96, 255, 0.18)'
          : isDark
            ? '0 4px 12px rgba(138, 96, 255, 0.3), 0 0 20px rgba(138, 96, 255, 0.2)'
            : '0 2px 8px rgba(138, 96, 255, 0.2), 0 0 16px rgba(138, 96, 255, 0.12)',
      };
    }

    return {};
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={getShadowStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};
