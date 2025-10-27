import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
  variant?: 'default' | 'scene' | 'glass';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  variant = 'default',
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantClasses = {
    default: 'bg-white dark:bg-scene-fill border border-gray-200 dark:border-keyLight/20',
    scene: 'bg-scene-fill border border-keyLight/20 shadow-light',
    glass: 'bg-scene-fill/95 backdrop-blur-xl border border-keyLight/20',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/60 backdrop-blur-sm
                 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`
          rounded-2xl shadow-depth-xl w-full mx-4
          animate-scale-in
          transition-all duration-300 ease-smooth
          ${variantClasses[variant]}
          ${maxWidthClasses[maxWidth]}
        `.trim().replace(/\s+/g, ' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-keyLight/10">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-keyLight/10
                           rounded-lg transition-all duration-200 ease-smooth
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyLight"
                aria-label={t['ui.modal.closeButton'] || 'Close modal'}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-scene-fillLight border-t border-gray-200 dark:border-keyLight/10 ${className}`.trim()}>
      {children}
    </div>
  );
};
