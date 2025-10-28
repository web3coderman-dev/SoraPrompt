import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-scene-fillLight
            border ${hasError ? 'border-state-error' : 'border-keyLight/20'}
            text-text-primary
            focus:outline-none focus:ring-2
            ${hasError ? 'focus:ring-state-error/20' : 'focus:ring-keyLight/20'}
            focus:border-keyLight
            placeholder:text-text-tertiary
            transition-all duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-state-error flex items-center gap-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'cinematic';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const hasError = !!error;
  const isCinematic = variant === 'cinematic';

  const cinematicStyles = isCinematic ? {
    background: isDark ? 'rgba(26, 31, 46, 0.6)' : 'rgba(248, 248, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1.5px solid ${isDark ? 'rgba(58, 108, 255, 0.15)' : 'rgba(58, 108, 255, 0.12)'}`,
  } as React.CSSProperties : {};

  const [isFocused, setIsFocused] = React.useState(false);

  const cinematicFocusStyles = isCinematic && isFocused ? {
    background: isDark ? 'rgba(26, 31, 46, 0.8)' : 'rgba(255, 255, 255, 0.95)',
    borderWidth: '2px',
    borderColor: isDark ? 'rgba(58, 108, 255, 0.3)' : 'rgba(58, 108, 255, 0.3)',
    boxShadow: isDark
      ? '0 0 0 2px rgba(57, 97, 251, 0.2), 0 0 20px rgba(138, 96, 255, 0.15), inset 0 0 0 1px rgba(58, 108, 255, 0.3)'
      : '0 0 0 2px rgba(57, 97, 251, 0.15), 0 0 16px rgba(138, 96, 255, 0.1), inset 0 0 0 1px rgba(58, 108, 255, 0.2)',
  } as React.CSSProperties : {};

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block font-medium ${
          isCinematic ? 'text-base font-display font-semibold tracking-wide' : 'text-sm'
        } text-text-primary`}>
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-xl
          text-text-primary
          ${isCinematic ? 'px-5 py-4 text-[15px] leading-relaxed' : 'px-4 py-3'}
          ${isCinematic ? 'placeholder:italic placeholder:text-text-tertiary/35' : 'placeholder:text-text-tertiary'}
          ${!isCinematic && 'bg-scene-fillLight'}
          ${!isCinematic && (hasError ? 'border border-state-error' : 'border border-keyLight/20')}
          ${!isCinematic && 'focus:outline-none focus:ring-2'}
          ${!isCinematic && (hasError ? 'focus:ring-state-error/20' : 'focus:ring-keyLight/20')}
          ${!isCinematic && 'focus:border-keyLight'}
          ${isCinematic && 'focus:outline-none'}
          resize-none
          transition-all duration-300 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        style={isCinematic ? { ...cinematicStyles, ...cinematicFocusStyles } : undefined}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="text-xs text-state-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
};
