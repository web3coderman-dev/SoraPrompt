import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function PageContainer({ children, maxWidth = 'xl', className = '' }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-scene-background via-scene-fill to-scene-background">
      <div className={`container mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 ${className}`}>
        <div className={`${maxWidthClasses[maxWidth]} mx-auto space-y-6`}>
          {children}
        </div>
      </div>
    </div>
  );
}
