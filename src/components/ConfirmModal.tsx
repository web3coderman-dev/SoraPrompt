import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmModalProps) {
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

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: 'bg-state-error hover:bg-state-error/80 focus:ring-state-error/20',
      icon: 'text-state-error bg-state-error/10'
    },
    warning: {
      button: 'bg-state-warning hover:bg-state-warning/80 focus:ring-state-warning/20',
      icon: 'text-state-warning bg-state-warning/10'
    },
    info: {
      button: 'bg-keyLight hover:bg-keyLight/80 focus:ring-keyLight/20',
      icon: 'text-state-info bg-state-info/10'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-cut-fade">
      <div
        className="absolute inset-0 bg-overlay-medium backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-scene-fill rounded-2xl shadow-key max-w-md w-full animate-modal-enter">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-secondary transition-colors"
          aria-label={t['ui.modal.close'] || 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {title}
          </h3>

          <p className="text-text-secondary mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-keyLight/20 text-text-secondary rounded-lg hover:bg-scene-fillLight font-medium transition-all duration-300 focus:ring-2 focus:ring-keyLight/20 active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-all duration-300 focus:ring-2 active:scale-[0.98] ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
