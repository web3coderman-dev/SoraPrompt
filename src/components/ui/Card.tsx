import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'scene' | 'script' | 'lighting' | 'glass' | 'idea';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'scene',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variantClasses = {
    scene: 'bg-scene-fill border border-keyLight/20 shadow-depth-lg',
    script: 'bg-scene-fill border-l-4 border-rimLight shadow-depth-md',
    lighting: 'bg-gradient-to-br from-scene-fill to-scene-fillLight border border-border-default shadow-depth-md',
    glass: 'bg-scene-fill/80 backdrop-blur-md border border-keyLight/10 shadow-light',
    idea: isDark
      ? 'border shadow-depth-xl'
      : 'border shadow-depth-lg',
  };

  const ideaStyles = variant === 'idea' ? {
    background: isDark
      ? 'linear-gradient(135deg, #141821 0%, #1A1F2E 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
    borderColor: isDark ? 'rgba(58, 108, 255, 0.25)' : 'rgba(58, 108, 255, 0.12)',
    boxShadow: isDark
      ? '0 0 0 1px rgba(58, 108, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.4), 0 16px 48px rgba(58, 108, 255, 0.12)'
      : '0 0 0 1px rgba(58, 108, 255, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(58, 108, 255, 0.06)',
  } : {};

  const baseClasses = `
    rounded-xl shadow-depth-md
    overflow-hidden transition-all duration-300 ease-in-out
    ${variantClasses[variant]}
  `;

  const hoverClasses = hoverable
    ? 'hover:shadow-key hover:border-keyLight/40 cursor-pointer active:scale-[0.99] hover:-translate-y-1'
    : '';

  const ideaHoverStyles = variant === 'idea' && hoverable ? {
    boxShadow: isDark
      ? '0 0 0 1px rgba(58, 108, 255, 0.15), 0 12px 32px rgba(0, 0, 0, 0.5), 0 24px 64px rgba(58, 108, 255, 0.2)'
      : '0 0 0 1px rgba(58, 108, 255, 0.08), 0 6px 16px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(58, 108, 255, 0.1)',
    borderColor: isDark ? 'rgba(58, 108, 255, 0.4)' : 'rgba(58, 108, 255, 0.2)',
  } : {};

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`.trim().replace(/\s+/g, ' ')}
      style={variant === 'idea' ? ideaStyles : undefined}
      onMouseEnter={(e) => {
        if (variant === 'idea' && hoverable) {
          Object.assign(e.currentTarget.style, ideaHoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'idea' && hoverable) {
          Object.assign(e.currentTarget.style, ideaStyles);
        }
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  gradient = false,
}) => {
  const baseClasses = 'px-6 py-4';
  const gradientClasses = gradient
    ? 'bg-gradient-to-r from-keyLight/10 via-neon/10 to-rimLight/10 border-b border-keyLight/20'
    : 'border-b border-border-default';

  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`.trim()}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 border-t border-keyLight/10 ${className}`.trim()}>
      {children}
    </div>
  );
};
