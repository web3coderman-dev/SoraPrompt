import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'scene' | 'script' | 'lighting' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  variant = 'scene',
}) => {
  const variantClasses = {
    scene: 'bg-scene-fill border border-keyLight/20 shadow-depth-lg',
    script: 'bg-scene-fill border-l-4 border-rimLight shadow-depth-md',
    lighting: 'bg-gradient-to-br from-scene-fill to-scene-fillLight border border-border-default shadow-depth-md',
    glass: 'bg-scene-fill/80 backdrop-blur-md border border-keyLight/10 shadow-light',
  };

  const baseClasses = `
    rounded-xl shadow-depth-md
    overflow-hidden transition-all duration-300 ease-smooth
    ${variantClasses[variant]}
  `;

  const hoverClasses = hoverable
    ? 'hover:shadow-key hover:border-keyLight/40 cursor-pointer active:scale-[0.99] hover:-translate-y-1 transition-transform'
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
    <div className={`px-6 py-4 bg-scene-fillLight border-t border-keyLight/10 ${className}`.trim()}>
      {children}
    </div>
  );
};
