import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseClasses = `
    bg-white rounded-2xl shadow-lg border border-gray-200
    overflow-hidden transition-all duration-300
  `;

  const hoverClasses = hoverable
    ? 'hover:shadow-xl hover:border-primary-300 cursor-pointer active:scale-[0.99]'
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
    ? 'bg-gradient-to-r from-gray-900 to-gray-800'
    : 'border-b border-gray-200';

  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`.trim().replace(/\s+/g, ' ')}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 ${className}`.trim()}>
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
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`.trim()}>
      {children}
    </div>
  );
};
