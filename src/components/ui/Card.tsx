import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'scene' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-scene-fill border border-gray-200 dark:border-keyLight/10',
    scene: 'bg-scene-fill border border-keyLight/20 shadow-light',
    glass: 'bg-scene-fill/80 backdrop-blur-md border border-keyLight/10',
  };

  const baseClasses = `
    rounded-xl shadow-depth-md
    overflow-hidden transition-all duration-300 ease-smooth
    ${variantClasses[variant]}
  `;

  const hoverClasses = hoverable
    ? 'hover:shadow-depth-lg hover:border-keyLight/30 dark:hover:border-keyLight/40 cursor-pointer active:scale-[0.99] hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`.trim().replace(/\s+/g, ' ')}
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
    ? 'bg-gradient-to-r from-keyLight/10 to-neon/10 border-b border-keyLight/10'
    : 'border-b border-gray-200 dark:border-keyLight/10';

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
    <div className={`px-6 py-4 bg-gray-50 dark:bg-scene-fillLight border-t border-gray-100 dark:border-keyLight/10 ${className}`.trim()}>
      {children}
    </div>
  );
};
