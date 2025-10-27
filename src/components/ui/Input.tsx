import React from 'react';
import { LucideIcon } from 'lucide-react';

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
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
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
      <textarea
        className={`
          w-full px-4 py-3 rounded-lg
          bg-scene-fillLight
          border ${hasError ? 'border-state-error' : 'border-keyLight/20'}
          text-text-primary
          focus:outline-none focus:ring-2
          ${hasError ? 'focus:ring-state-error/20' : 'focus:ring-keyLight/20'}
          focus:border-keyLight
          placeholder:text-text-tertiary
          resize-none
          transition-all duration-200 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `.trim().replace(/\s+/g, ' ')}
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
